// A course's reader: short steps, one screen at a time.
//
// - Each module runs: intro, its lesson cards (if it has a lesson), its questions,
//   then a wrap-up with a habit to plan. After the last module, a summary.
// - One big button at the bottom always says what happens next: "Let's go",
//   "Next", "Try it" (into the questions), "Make the call", "Continue",
//   "Next module", "My results". Labels stay short, so they fit a 320px screen.
//   Back is beside it, and "Skip for now" sits under each question.
// - Move also by swiping left and right on a touch screen, or with the arrow keys.
// - The reader opens where the visitor left off: the next unanswered question, or
//   the intro of the next module they have not started.
// - The address keeps the step (#step=hug-hello, #step=intro-touch, #step=done),
//   so a reload or a shared link opens the same step. Older links (#card=3,
//   #card=done) still work.
// - The bar at the top has one segment per module, filling as its questions are
//   answered; the current module's segment is wider. Underneath, the module's name
//   and where the visitor is in it.
// - After every five calls in one sitting, a short break is offered: keep going,
//   plan the next five minutes in the calendar, or stop for now. Short sessions with
//   breaks suit everyone, and most of all people with ADHD.
// - Movement is skipped for people who ask their device for reduced motion.
//
// Without JavaScript every step is shown in order and this file does nothing.

import { readProgress, clearSet, callLabels, PROGRESS_EVENT, CALL_EVENT, type Call } from './progress';
import { readStats, updateProfile } from './store';
import { POINTS, DAILY_GOAL, dayKey } from '../lib/game';
import { drawScenes } from './scene';
import { addToCalendar, nextMoments } from './ics';

/** Sent on `document` each time a different step is shown, so the Listen button can stop. */
export const SLIDE_EVENT = 'gc:slide';

const deck = document.querySelector<HTMLElement>('[data-deck]');

if (deck) setUpDeck(deck);

function setUpDeck(deck: HTMLElement) {
  const stage = deck.querySelector<HTMLElement>('[data-deck-stage]')!;
  const slides = Array.from(stage.querySelectorAll<HTMLElement>('[data-slide]'));
  const summary = slides[slides.length - 1];
  const keys = slides.map((slide) => slide.dataset.key!);
  const kindOf = (slide: HTMLElement) => slide.dataset.kind as 'intro' | 'learn' | 'question' | 'wrap' | 'done';
  const idOf = (slide: HTMLElement) => slide.querySelector<HTMLElement>('[data-scenario]')?.dataset.id;
  const questionSlides = slides.filter((slide) => kindOf(slide) === 'question');
  const ids = questionSlides.map((slide) => idOf(slide)!);

  const nav = deck.querySelector<HTMLElement>('[data-deck-nav]')!;
  const prev = nav.querySelector<HTMLButtonElement>('[data-prev]')!;
  const next = nav.querySelector<HTMLButtonElement>('[data-next]')!;
  const nextLabel = nav.querySelector<HTMLElement>('[data-next-label]')!;
  const whereTopic = deck.querySelector<HTMLElement>('[data-where-topic]')!;
  const whereStep = deck.querySelector<HTMLElement>('[data-where-step]')!;
  const pointsChip = deck.querySelector<HTMLElement>('[data-reader-points]');
  const segments = Array.from(deck.querySelectorAll<HTMLElement>('[data-seg]')).map((seg) => ({
    seg,
    topic: seg.dataset.topic!,
    fill: seg.querySelector<HTMLElement>('[data-seg-fill]')!,
    ids: seg.dataset.ids!.split(','),
  }));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const marks: Record<Call, string> = { best: '✓', okay: '~', risky: '!' };

  let index = 0;

  deck.classList.add('js-deck');
  nav.hidden = false;

  // This is now the course to continue from on the home page.
  updateProfile((profile) => {
    profile.lastCourse = deck.dataset.set;
  });

  const topicName = (slide: HTMLElement) => slide.getAttribute('aria-label') ?? '';
  const isAnswered = (slide: HTMLElement) => Boolean(readProgress()[idOf(slide) ?? '']);

  // ---------------------------------------------------------------- where to open

  // The step named in the address, if any.
  function namedIndex(): number | undefined {
    const hash = decodeURIComponent(location.hash);
    const step = hash.match(/^#step=(.+)$/);
    if (step) {
      const i = keys.indexOf(step[1]);
      return i > -1 ? i : undefined;
    }
    // Older links: #card=3 or #card-3 is the third question, #card=done the summary.
    const card = hash.match(/^#card[=-](\d+|done)$/);
    if (card) {
      if (card[1] === 'done') return slides.length - 1;
      const slide = questionSlides[Number(card[1]) - 1];
      return slide ? slides.indexOf(slide) : undefined;
    }
    // A question's own anchor, used by links that also work without JavaScript.
    const anchor = hash.match(/^#card-(.+)$/);
    if (anchor) {
      const i = keys.indexOf(anchor[1]);
      return i > -1 ? i : undefined;
    }
    return undefined;
  }

  // Where to open: the step in the address; else the next unanswered question, or
  // the intro of its module if nothing in that module is answered yet; else the summary.
  function startingIndex(): number {
    const named = namedIndex();
    if (named !== undefined) return named;
    const progress = readProgress();
    const first = questionSlides.find((slide) => !progress[idOf(slide)!]);
    if (!first) return slides.length - 1;
    const topic = first.dataset.topic;
    const started = questionSlides.some((slide) => slide.dataset.topic === topic && progress[idOf(slide)!]);
    if (!started) {
      const intro = slides.findIndex((slide) => kindOf(slide) === 'intro' && slide.dataset.topic === topic);
      if (intro > -1) return intro;
    }
    return slides.indexOf(first);
  }

  // ---------------------------------------------------------------- showing a step

  function show(target: number, direction: -1 | 0 | 1, moveFocus: boolean) {
    const from = slides[index];
    index = Math.max(0, Math.min(slides.length - 1, target));
    slides.forEach((slide, i) => (slide.hidden = i !== index));
    const current = slides[index];

    // Draw this step's scene, and the next one's, ready for it.
    drawScenes(current);
    if (slides[index + 1]) drawScenes(slides[index + 1]);

    if (direction !== 0 && !reducedMotion.matches) {
      current.animate(
        [
          { opacity: 0, transform: `translateX(${direction * 36}px)` },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
      // Entering a new module: the bar's new segment pops.
      if (current.dataset.topic !== from.dataset.topic) {
        segments
          .find((s) => s.topic === current.dataset.topic)
          ?.seg.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(2.2)' }, { transform: 'scaleY(1)' }], { duration: 600, easing: 'ease-out' });
      }
    }

    history.replaceState(null, '', `#step=${encodeURIComponent(keys[index])}`);
    if (current === summary) renderSummary();
    update();
    document.dispatchEvent(new CustomEvent(SLIDE_EVENT, { detail: { slide: current } }));

    if (moveFocus) {
      // Back to the top, then move focus to the step's heading so screen readers
      // announce it. The jump is instant, like turning a page.
      if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: 'instant' });
      current.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
    }
  }

  // What the big button says and does, and everything else that depends on the step.
  function update() {
    const progress = readProgress();
    const current = slides[index];
    const kind = kindOf(current);
    const onSummary = current === summary;

    for (const { seg, topic, fill, ids: topicIds } of segments) {
      const done = topicIds.filter((id) => progress[id]).length;
      fill.style.width = `${(done / topicIds.length) * 100}%`;
      seg.classList.toggle('current', !onSummary && topic === current.dataset.topic);
      seg.classList.toggle('complete', done === topicIds.length);
    }

    // Where the visitor is: the module's name, and the step within it.
    if (onSummary) {
      whereTopic.textContent = ids.every((id) => progress[id]) ? 'Course complete' : 'Your progress';
      whereStep.textContent = '';
    } else {
      whereTopic.textContent = topicName(current);
      const inTopic = questionSlides.filter((slide) => slide.dataset.topic === current.dataset.topic);
      whereStep.textContent =
        kind === 'intro' ? 'Intro' : kind === 'learn' ? 'Learn' : kind === 'wrap' ? 'Wrap-up' : `${inTopic.indexOf(current) + 1} of ${inTopic.length}`;
    }

    nav.hidden = onSummary;
    prev.disabled = index === 0;

    const following = slides[index + 1];
    const answered = kind === 'question' && Boolean(progress[idOf(current)!]);
    let label: string;
    if (kind === 'intro') label = "Let's go";
    else if (kind === 'learn') label = following && kindOf(following) === 'learn' ? 'Next' : 'Try it';
    else if (kind === 'question') label = answered ? 'Continue' : 'Make the call';
    else label = following === summary ? 'My results' : 'Next module';
    nextLabel.textContent = label;
    next.classList.toggle('calling', kind === 'question' && !answered);
    // After a call, the button nudges to show the way on.
    next.classList.toggle('nudge', answered);

    const skip = current.querySelector<HTMLButtonElement>('[data-skip]');
    if (skip) skip.hidden = answered;
  }

  // ---------------------------------------------------------------- the summary

  function renderSummary() {
    const progress = readProgress();
    const answers = ids.map((id) => progress[id]);
    const answered = answers.filter(Boolean).length;
    const good = answers.filter((answer) => answer?.call === 'best').length;
    const score = summary.querySelector<HTMLElement>('[data-done-score]')!;

    const complete = answered === ids.length;
    summary.querySelector<HTMLElement>('[data-done-badge]')!.hidden = !complete;
    // Until every question is answered, the first thing offered is to go back to
    // the first unanswered one; the next course becomes the second choice.
    resume.hidden = complete;
    summary.querySelector('[data-next-module]')?.classList.toggle('ghost', !complete);
    summary.querySelector<HTMLElement>('[data-done-kicker]')!.textContent = complete ? 'Course complete' : 'Your progress';

    // Points earned in this course, and the item it unlocks once finished.
    const points = answers.reduce((sum, answer) => sum + (answer ? POINTS[answer.call] : 0), 0) + (complete ? POINTS.courseComplete : 0);
    summary.querySelector<HTMLElement>('[data-reward-points]')!.textContent = `${points} ${points === 1 ? 'point' : 'points'} earned`;
    const item = summary.querySelector<HTMLElement>('[data-reward-item]');
    if (item) item.hidden = !complete;

    if (complete) {
      score.textContent = `You made ${good} good ${good === 1 ? 'call' : 'calls'} out of ${ids.length}.`;
    } else {
      const left = ids.length - answered;
      score.textContent = `${answered} of ${ids.length} answered. ${left} ${left === 1 ? 'question is' : 'questions are'} waiting for you.`;
    }

    summary.querySelectorAll<HTMLElement>('[data-done-mark]').forEach((mark) => {
      const answer = progress[mark.dataset.id!];
      mark.dataset.call = answer ? answer.call : '';
      mark.textContent = answer ? marks[answer.call] : '';
    });
    summary.querySelectorAll<HTMLElement>('[data-done-verdict]').forEach((verdict) => {
      const answer = progress[verdict.dataset.id!];
      verdict.textContent = answer ? `Your call: ${callLabels[answer.call]}` : 'Not answered yet';
    });
  }

  const resume = summary.querySelector<HTMLButtonElement>('[data-resume]')!;
  resume.addEventListener('click', () => {
    const progress = readProgress();
    const first = questionSlides.find((slide) => !progress[idOf(slide)!]);
    if (first) show(slides.indexOf(first), -1, true);
  });

  // ---------------------------------------------------------------- a break every five calls

  const breakDialog = deck.querySelector<HTMLDialogElement>('[data-break]');
  let callsThisSitting = 0;
  let breakDue = false;

  function openBreak() {
    if (!breakDialog || typeof breakDialog.showModal !== 'function') return false;
    const today = readStats().counts?.[dayKey()] ?? 0;
    const ring = breakDialog.querySelector<HTMLElement>('[data-break-ring]')!;
    ring.style.setProperty('--p', String(Math.min(100, (today / DAILY_GOAL) * 100)));
    breakDialog.querySelector<HTMLElement>('[data-break-count]')!.textContent = String(today);
    const reached = today >= DAILY_GOAL;
    breakDialog.querySelector<HTMLElement>('[data-break-title]')!.textContent = reached && today < DAILY_GOAL + 5 ? 'Daily goal done' : 'Five calls made';
    breakDialog.querySelector<HTMLElement>('[data-break-text]')!.textContent = reached
      ? `That's ${today} today. Short bursts with breaks help it stick. Keep going, or come back later.`
      : 'Short bursts with breaks help it stick. Keep going, or come back later.';

    // Times for the next five minutes, each one a calendar reminder.
    const times = breakDialog.querySelector<HTMLElement>('[data-break-times]')!;
    const done = breakDialog.querySelector<HTMLElement>('[data-break-done]')!;
    done.hidden = true;
    times.replaceChildren(
      ...nextMoments().map((moment) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn ghost';
        button.textContent = moment.label;
        button.addEventListener('click', () => {
          addToCalendar({
            title: 'Good Call: five minutes',
            start: moment.start,
            minutes: 5,
            description: 'Five questions, then you are done. Pick up where you left off.',
            url: location.href.split('#')[0],
          });
          done.hidden = false;
        });
        return button;
      }),
    );
    breakDialog.showModal();
    return true;
  }

  breakDialog?.querySelector('[data-break-go]')?.addEventListener('click', () => {
    breakDialog.close();
    goNext();
  });
  breakDialog?.addEventListener('click', (event) => {
    if (event.target === breakDialog) breakDialog.close();
  });

  document.addEventListener(CALL_EVENT, (event) => {
    callsThisSitting += 1;
    if (callsThisSitting % 5 === 0) breakDue = true;
    flyPoints((event as CustomEvent<{ call: Call }>).detail.call);
  });

  // "+10" floats up from the points counter, which then gives a little bump.
  function flyPoints(call: Call) {
    if (!pointsChip) return;
    if (reducedMotion.matches) return;
    const fly = document.createElement('span');
    fly.className = 'fly';
    fly.setAttribute('aria-hidden', 'true');
    fly.textContent = `+${POINTS[call]}`;
    pointsChip.append(fly);
    fly.addEventListener('animationend', () => fly.remove());
    pointsChip.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], { duration: 450, delay: 350, easing: 'ease-out' });
  }

  // ---------------------------------------------------------------- moving

  const goNext = () => index < slides.length - 1 && show(index + 1, 1, true);
  const goPrev = () => index > 0 && show(index - 1, -1, true);

  // The big button: on an unanswered question it makes the call; otherwise it moves on,
  // stopping first for a break after every fifth call.
  next.addEventListener('click', () => {
    const current = slides[index];
    if (kindOf(current) === 'question' && !isAnswered(current)) {
      current.querySelector<HTMLFormElement>('[data-quiz]')?.requestSubmit();
      return;
    }
    if (breakDue) {
      breakDue = false;
      if (openBreak()) return;
    }
    goNext();
  });
  prev.addEventListener('click', goPrev);

  // "Skip for now" under a question, and turning a flip card back over by tapping its back.
  stage.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-skip]')) goNext();
    const back = target.closest('.flip[open] > p');
    if (back) {
      const flip = back.parentElement as HTMLDetailsElement;
      flip.open = false;
      flip.querySelector('summary')?.focus();
    }
  });

  // Summary links jump back to a question.
  summary.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLElement>('[data-goto]');
    if (!link) return;
    event.preventDefault();
    const i = keys.indexOf(link.dataset.goto!);
    if (i > -1) show(i, -1, true);
  });

  // Arrow keys move between steps, except inside a set of answers or a text box,
  // where they already do something.
  deck.addEventListener('keydown', (event) => {
    if ((event.target as HTMLElement).closest('input, select, textarea, [contenteditable], dialog')) return;
    if (event.key === 'ArrowRight') goNext();
    if (event.key === 'ArrowLeft') goPrev();
  });

  // Swiping. The page still scrolls up and down as normal (touch-action: pan-y in
  // the CSS); a mostly sideways drag moves the step with the finger, and letting
  // go past the threshold turns to the next or previous step.
  let startX = 0;
  let startY = 0;
  let dragging = false;
  let tracking = false;
  let suppressClick = false;
  const threshold = 70;

  stage.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    tracking = true;
    dragging = false;
    startX = event.clientX;
    startY = event.clientY;
  });

  stage.addEventListener('pointermove', (event) => {
    if (!tracking) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!dragging) {
      if (Math.abs(dx) < 12 || Math.abs(dx) < Math.abs(dy) * 1.2) {
        if (Math.abs(dy) > 12) tracking = false;
        return;
      }
      dragging = true;
      // Keep receiving the drag if the finger leaves the step. This can fail if the
      // pointer has already been released, which only means there is nothing to capture.
      try {
        stage.setPointerCapture(event.pointerId);
      } catch {
        /* nothing to capture */
      }
    }
    // Resist at either end.
    const atEnd = (dx < 0 && index === slides.length - 1) || (dx > 0 && index === 0);
    const offset = atEnd ? dx * 0.25 : dx;
    slides[index].style.transform = `translateX(${offset}px) rotate(${offset * 0.012}deg)`;
    slides[index].style.transition = 'none';
  });

  function endDrag(event: PointerEvent) {
    if (!tracking) return;
    tracking = false;
    if (!dragging) return;
    dragging = false;
    // Swallow the click that follows a drag, but only that one.
    suppressClick = true;
    setTimeout(() => (suppressClick = false), 400);
    const dx = event.clientX - startX;
    const current = slides[index];
    current.style.transition = '';
    current.style.transform = '';
    if (dx <= -threshold && index < slides.length - 1) show(index + 1, 1, true);
    else if (dx >= threshold && index > 0) show(index - 1, -1, true);
    else if (!reducedMotion.matches) {
      current.animate([{ transform: `translateX(${dx}px)` }, { transform: 'none' }], {
        duration: 260,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      });
    }
  }

  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  // A drag that started on an answer must not also select it.
  stage.addEventListener(
    'click',
    (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    },
    true,
  );

  // A link to another step on this same page changes only the address, without
  // reloading, so follow it here.
  window.addEventListener('hashchange', () => {
    const named = namedIndex();
    if (named !== undefined && named !== index) show(named, named > index ? 1 : -1, true);
  });

  // Clearing answers has to unlock every question, so the reader reloads at the start.
  summary.querySelector('[data-deck-reset]')?.addEventListener('click', () => {
    clearSet(deck.dataset.set!);
    history.replaceState(null, '', `#step=${encodeURIComponent(keys[0])}`);
    location.reload();
  });

  // A call changes the big button and the progress bar.
  document.addEventListener(PROGRESS_EVENT, update);

  show(startingIndex(), 0, false);
}

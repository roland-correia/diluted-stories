// The Explore tab's search and category filter. Every course is already on the
// page with its searchable words (data-keywords); this shows the ones that match.
// The search is kept in the address (?q=…, ?category=…) so it survives a reload
// and the browser's Back button. Nothing is sent anywhere.

import { categories, type CategoryId } from '../lib/courses';

const form = document.querySelector<HTMLFormElement>('[data-search-form]');
const input = document.querySelector<HTMLInputElement>('[data-search]');
const results = Array.from(document.querySelectorAll<HTMLElement>('[data-result]'));
const filters = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-category-filter]'));
const title = document.querySelector<HTMLElement>('[data-results-title]');
const count = document.querySelector<HTMLElement>('[data-results-count]');
const empty = document.querySelector<HTMLElement>('[data-no-results]');

const isCategory = (value: string | null): value is CategoryId => value !== null && value in categories;

if (form && input && title && count && empty) {
  const categorySection = document.querySelector<HTMLElement>('[data-categories]')!;
  categorySection.hidden = false;

  const params = new URLSearchParams(location.search);
  let category: CategoryId | undefined = isCategory(params.get('category')) ? (params.get('category') as CategoryId) : undefined;
  input.value = params.get('q') ?? '';

  // Lower case, without accents or punctuation, so "Pre-school" matches "preschool" and "pre school".
  const normalise = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9 ]+/g, ' ');

  const index = results.map((result) => {
    const book = result.querySelector<HTMLElement>('[data-book]')!;
    const words = normalise(book.dataset.keywords ?? '');
    return { result, words, squashed: words.replace(/ /g, ''), category: book.dataset.category };
  });

  function apply() {
    const query = input!.value.trim();
    const terms = normalise(query).split(' ').filter(Boolean);
    let shown = 0;
    for (const { result, words, squashed, category: bookCategory } of index) {
      const matchesTerms = terms.every((term) => words.includes(term) || squashed.includes(term));
      const matchesCategory = !category || bookCategory === category;
      result.hidden = !(matchesTerms && matchesCategory);
      if (!result.hidden) shown += 1;
    }

    filters.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.categoryFilter === category)));
    // While searching, the results come straight after the search box. A chosen category stays on show.
    categorySection.hidden = Boolean(query) && !category;

    const scope = category ? categories[category].name : '';
    if (query) title!.textContent = `Results for “${query}”${scope ? ` in ${scope}` : ''}`;
    else title!.textContent = scope || 'All courses';
    count!.textContent = `${shown} ${shown === 1 ? 'course' : 'courses'}`;
    empty!.hidden = shown > 0;

    const next = new URLSearchParams();
    if (query) next.set('q', query);
    if (category) next.set('category', category);
    const search = next.toString();
    history.replaceState(null, '', search ? `?${search}` : location.pathname);
  }

  input.addEventListener('input', apply);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    apply();
    // Closes the on-screen keyboard so the results can be seen.
    input.blur();
    title.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });

  filters.forEach((button) =>
    button.addEventListener('click', () => {
      const chosen = button.dataset.categoryFilter as CategoryId;
      category = category === chosen ? undefined : chosen;
      apply();
    }),
  );

  document.querySelector('[data-clear-search]')?.addEventListener('click', () => {
    input.value = '';
    category = undefined;
    apply();
    input.focus();
  });

  apply();
}

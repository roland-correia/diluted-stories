// Turning page text into speech: shared by the clips made in advance
// (src/lib/voice-clips.ts, tools/voice/) and the device's own voice
// (src/scripts/voice.ts), so both say things the same way.
//
// Only the spoken form changes: the page keeps its spelling.

// Words a voice would otherwise say oddly.
const sayings: [RegExp, string][] = [
  [/\bCEOP\b/g, 'See-op'],
  [/\bIWF\b/g, 'I W F'],
  [/\bNSPCC\b/g, 'N S P C C'],
  [/\bNCA\b/g, 'N C A'],
  [/\bSTIs\b/g, 'S T Is'],
  [/\bSTI\b/g, 'S T I'],
  [/\bVPNs\b/g, 'V P Ns'],
  [/\bVPN\b/g, 'V P N'],
  [/\bGP\b/g, 'G P'],
  // "A&E" is already said "ay and ee".
  [/\bU=U\b/g, 'U equals U'],
  [/\bPrEP\b/g, 'prep'],
  [/\bSENCo\b/g, 'senco'],
  [/\bNHS\b/g, 'N H S'],
  [/\bHIV\b/g, 'H I V'],
  [/\bADHD\b/g, 'A D H D'],
  [/\bCV\b/g, 'C V'],
  [/\bIT\b/g, 'I T'],
  [/\bAI\b/g, 'A I'],
  [/\bID\b/g, 'I D'],
  [/\bHR\b/g, 'H R'],
  [/\bTV\b/g, 'T V'],
  [/\bGCSEs?\b/g, 'G C S E'],
  [/\bACT\b/g, 'A C T'],
  [/\bOK\b/g, 'okay'],
  [/StopNCII\.org/g, 'Stop N C I I dot org'],
  [/\.org\b/g, ' dot org'],
  [/\.uk\b/g, ' dot U K'],
  [/(\d+)C\b/g, '$1 degrees'],
  [/\((\d+)\+\)/g, '($1 plus)'],
  [/(\d+)\+/g, '$1 plus'],
  [/\s&\s/g, ' and '],
];

// Phone numbers are read digit by digit, in their groups: "0808 802 0300", "116 123",
// "999", "NHS 111".
const spell = (digits: string) => digits.split('').join(' ');
const phone = (match: string) => match.split(/\s+/).map(spell).join(', ');

export function speakable(text: string): string {
  let out = text
    // Emoji and symbols a voice cannot say.
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '')
    // A kiss at the end of a message ("Saturday instead x").
    .replace(/\s+x{1,3}$/i, '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  out = out
    // Times: "11.30am" is "11 30 AM", "8pm" is "8 PM" (said "ay em", "pee em").
    .replace(/\b(\d{1,2})[.:](\d{2}) ?(am|pm)\b/gi, (_, h, m, ap) => `${h}${m === '00' ? '' : ` ${m}`} ${ap.toUpperCase()}`)
    .replace(/\b(\d{1,2}) ?(am|pm)\b/gi, (_, h, ap) => `${h} ${ap.toUpperCase()}`)
    .replace(/\b0\d{3}(?: \d{3,4}){1,2}\b/g, phone)
    .replace(/\b116 123\b/g, phone)
    .replace(/\b(999|111)\b/g, spell);
  for (const [pattern, replacement] of sayings) out = out.replace(pattern, replacement);
  // Shouted words ("400 DAYS", "PANTS") are said as words, not spelled out. Acronyms
  // the voice should spell are already spaced out above.
  out = out.replace(/\b[A-Z]{4,}\b/g, (word) => word.toLowerCase());
  return out.replace(/\s+/g, ' ').trim();
}

/** Ends a line with a full stop, unless it already ends a sentence ("Mine!", "Ready?"). */
export const sentence = (line: string) => (/[.!?…:"”'’]$/.test(line.trim()) ? line.trim() : `${line.trim()}.`);

/**
 * Splits text into sentences, the unit each clip is made in. Very short sentences
 * join the one before (so "Yes!" is not a clip of its own), and very long ones split
 * at a comma, so no clip is too long to make in one go.
 */
export function sentences(text: string, max = 220): string[] {
  // A sentence ends at . ! ? or … (and any closing quote or bracket), but only where a
  // new one starts: a space, then a capital, a digit or an opening quote. So "11.30",
  // "e.g. this" and "Milk?" said mid-sentence do not split.
  const parts = text
    .split(/(?<=[.!?…]["'”’)\]]*)\s+(?=["'“‘(]?[A-Z0-9£])/)
    .map((s) => s.trim())
    .filter(Boolean);
  const out: string[] = [];
  for (const part of parts) {
    if (part.length > max) {
      let current = '';
      for (const clause of part.split(/(?<=[,;:])\s+/)) {
        if (current && `${current} ${clause}`.length > max) {
          out.push(current);
          current = clause;
        } else current = current ? `${current} ${clause}` : clause;
      }
      if (current) out.push(current);
    } else if (out.length && out[out.length - 1].length + part.length < 60) {
      out[out.length - 1] += ` ${part}`;
    } else {
      out.push(part);
    }
  }
  return out.filter((s) => /[a-z0-9]/i.test(s));
}

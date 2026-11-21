// Headings in content/hotel.ts may mark one italic phrase with *asterisks*.

export type Word = { text: string; italic: boolean };

// "Built of wood, *kept small.*" -> words, each flagged italic or not.
export function parseWords(source: string): Word[] {
  const words: Word[] = [];
  source.split(/(\*[^*]+\*)/).forEach((part) => {
    const italic = part.startsWith("*") && part.endsWith("*");
    const text = italic ? part.slice(1, -1) : part;
    for (const word of text.split(/\s+/)) if (word) words.push({ text: word, italic });
  });
  return words;
}

// The same heading as plain text, for titles and labels.
export function plain(source: string): string {
  return source.replace(/\*/g, "");
}

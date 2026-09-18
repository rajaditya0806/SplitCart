const INDIC_DIGITS = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']);

export function formatINR(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  const integerPart = Math.floor(rounded);
  const decimalPart = Math.round((rounded - integerPart) * 100);

  const intStr = integerPart.toString();
  let formattedInt: string;

  if (intStr.length <= 3) {
    formattedInt = intStr;
  } else {
    const lastThree = intStr.slice(-3);
    let rest = intStr.slice(0, -3);
    const groups: string[] = [];
    while (rest.length > 2) {
      groups.unshift(rest.slice(-2));
      rest = rest.slice(0, -2);
    }
    if (rest.length > 0) groups.unshift(rest);
    formattedInt = groups.join(',') + ',' + lastThree;
  }

  const decStr = decimalPart.toString().padStart(2, '0');
  return `\u20B9${formattedInt}.${decStr}`;
}

export function formatINRPlain(amount: number): string {
  return formatINR(amount).replace('\u20B9', '');
}

export function sanitizeAmount(raw: string): string {
  return Array.from(raw)
    .filter((ch) => INDIC_DIGITS.has(ch))
    .join('');
}

export function parseAmount(raw: string): number {
  const cleaned = sanitizeAmount(raw);
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

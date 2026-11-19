/**
 * Returns the symbol to display for a currency code.
 *
 * @param {string} currencyCode - the ISO currency code (e.g. EUR, DKK)
 *
 * @returns {string} the label (e.g. "€", "kr.") or the code itself when unknown
 */
export function currencyLabel(currencyCode: string): string {

    if (currencyCode === 'EUR') return "€";
    if (currencyCode === 'DKK') return "kr.";

    return currencyCode;
}

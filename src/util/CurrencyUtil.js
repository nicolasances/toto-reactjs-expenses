
export default class CurrencyUtil {

    label(currencyCode) {
        if (currencyCode == 'EUR') return "€";
        else if (currencyCode == 'DKK') return "kr."
        else return currencyCode;
    }
}
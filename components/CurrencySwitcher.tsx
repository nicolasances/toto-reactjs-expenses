'use client'

import { useEffect, useRef, useState } from 'react';
import { ExpensesAPI } from '@/api/ExpensesAPI';
import { getCurrentUser } from '@/utils/AuthUtil';
import './CurrencySwitcher.css';

const availableCurrencies = ['EUR', 'DKK'];

interface CurrencySwitcherProps {
    initialValue?: string;                              // (OPT) the initial value that the selector should show
    initialValueLoader?: () => Promise<string>;         // (OPT) loads the initial value asynchronously
    default?: string;                                   // (OPT) default currency, in case no currency is set in the app settings
    onCurrencyChange?: (currency: string) => void;      // (OPT) called with the changed currency code
    loadFromSettings?: boolean;                         // (OPT, default true) if true, the currency is loaded from the user settings
}

/**
 * Form component to select a currency in a toggle way.
 *
 * @param {CurrencySwitcherProps} props the props
 */
export default function CurrencySwitcher(props: CurrencySwitcherProps) {

    const [currency, setCurrency] = useState<string | null>(props.initialValue ? props.initialValue : (props.default ? props.default : null));

    // Keeps the props given at mount, which are only used once
    const mountPropsRef = useRef(props);

    useEffect(() => {

        const mountProps = mountPropsRef.current;

        if (mountProps.loadFromSettings == null || mountProps.loadFromSettings) {

            const user = getCurrentUser();
            if (!user) return;

            new ExpensesAPI().getAppSettings(user.email).then((data) => {
                const loaded = data && data.currency ? data.currency : 'EUR';
                setCurrency(loaded);
                if (mountProps.onCurrencyChange) mountProps.onCurrencyChange(loaded);
            })
        }
        // Load the initial value if an async loader is provided
        else if (mountProps.initialValueLoader) mountProps.initialValueLoader().then((data) => {
            setCurrency(data);
        })
    }, [])

    /**
     * Switches to the next available currency
     */
    const nextCurrency = () => {

        const currentIndex = availableCurrencies.findIndex(value => value == currency);
        let nextIndex = currentIndex + 1;

        if (nextIndex >= availableCurrencies.length) nextIndex = 0;

        setCurrency(availableCurrencies[nextIndex]);
        if (props.onCurrencyChange) props.onCurrencyChange(availableCurrencies[nextIndex]);
    }

    const label = currency ? currency : props.initialValue;

    return (
        <div className="currency-switcher" onClick={nextCurrency}>
            {label}
        </div>
    )
}

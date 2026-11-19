'use client'

import { useEffect, useRef, useState } from 'react';
import './AmountSelector.css';

interface AmountSelectorProps {
    initialValue?: string | number;                             // (OPT) the initial value that the selector should show
    initialValueLoader?: () => Promise<string | number>;        // (OPT) loads the initial value asynchronously
    onAmountChange?: (amount: string) => void;                  // (OPT) called when the amount changes
}

/**
 * Form component to insert an amount.
 *
 * @param {AmountSelectorProps} props the props
 */
export default function AmountSelector(props: AmountSelectorProps) {

    const [amount, setAmount] = useState<string>(props.initialValue == null ? '' : String(props.initialValue));
    const [preClearAmount, setPreClearAmount] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Keeps the loader given at mount, which is only used once
    const loaderRef = useRef(props.initialValueLoader);

    useEffect(() => {

        if (loaderRef.current) loaderRef.current().then((data) => {
            setAmount(data == null ? '' : String(data));
        })
    }, [])

    /**
     * Updates the amount, if the typed text is a valid number
     */
    const updateAmount = (event: React.ChangeEvent<HTMLInputElement>) => {

        const isNumber = /^[0-9]+((\,|\.)([0-9])*)?$/.test(event.target.value);

        if (isNumber) {
            const newAmount = event.target.value.replace(',', '.');
            setAmount(newAmount);

            // Callback, if any
            if (props.onAmountChange) props.onAmountChange(newAmount);
        }
        else setAmount('');
    }

    /**
     * Clears the value on focus, remembering the previous one
     */
    const clearValue = () => {
        setAmount('');
        setPreClearAmount(amount);
    }

    /**
     * Restores the previous value if the input was left empty
     */
    const onBlur = () => {
        if (amount == '') setAmount(preClearAmount);
    }

    return (
        <div className="amount-selector" onClick={() => { if (inputRef.current) inputRef.current.focus() }}>
            <div className="amount">
                <input id="amount-input"
                    ref={inputRef}
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={updateAmount}
                    onFocus={clearValue}
                    onBlur={onBlur}
                    autoComplete="off"
                />
            </div>
        </div>
    )
}

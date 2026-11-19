'use client'

import { SavingEntry } from '@/model/stats'
import './LifetimeSavingsBubble.css'

interface LifetimeSavingsBubbleProps {
    savings?: SavingEntry[];    // The savings entries to total up
    currency?: string;          // The currency code
}

/**
 * A bubble that shows the total of the lifetime savings.
 *
 * @param {LifetimeSavingsBubbleProps} props the props
 */
export function LifetimeSavingsBubble(props: LifetimeSavingsBubbleProps) {

    if (!props.savings) return <div></div>

    // Calculate the total of savings
    let total = 0;

    for (const saving of props.savings) {

        total += saving.saving

    }

    // Define the currency
    let currency = props.currency;
    if (currency == "DKK") currency = 'kr.'
    else if (currency == 'EUR') currency = '€'

    return (
        <div className="lifetime-savings-bubble">
            <div className="label">Total</div>
            <div className={`value ${Math.abs(total) >= 1000000 ? "small" : "medium"}`}>{total.toLocaleString("it", { maximumFractionDigits: 0 })}</div>
            <div className="currency">{currency}</div>
        </div>
    )
}

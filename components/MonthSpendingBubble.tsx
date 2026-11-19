'use client'

import { useEffect, useState } from 'react';
import moment from 'moment';
import { ExpensesAPI } from '@/api/ExpensesAPI';
import './MonthSpendingBubble.css';

/**
 * Bubble showing the total spent in the current month.
 */
export default function MonthSpendingBubble() {

    const yearMonth = moment().format("YYYYMM");
    const [total, setTotal] = useState({ total: 0, scale: '' });
    const [currency, setCurrency] = useState<string>();

    // Loads the user settings
    useEffect(() => {

        new ExpensesAPI().getSettings().then((settings) => {
            setCurrency(settings.currency);
        })
    }, [])

    // Loads the year month spend
    useEffect(() => {

        if (!currency) return;

        new ExpensesAPI().getMonthTotalSpending(yearMonth, currency).then((data) => {

            let tot = data.total;
            let scale = ''

            // Rescale total if too big
            if (tot > 100000) {
                tot = tot / 1000
                scale = 'k';
            }

            setTotal({
                total: tot,
                scale: scale
            })

        });
    }, [currency, yearMonth])

    return (
        <div className="month-spending-bubble container">

            <div className="currency-container"><div className="currency">{currency}</div></div>
            <div className="amount-container"><div className="amount">{total.total.toLocaleString("it", { maximumFractionDigits: 0 })}{total.scale}</div></div>
            <div className="month-container"><div className="month">{moment(`${yearMonth}01`, "YYYYMMDD").format("MMM")}</div></div>

        </div>
    )

}

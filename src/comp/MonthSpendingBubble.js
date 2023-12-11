import React, { Component, useEffect, useState } from 'react';
import moment from 'moment';
import Cookies from 'universal-cookie';

import ExpensesAPI from '../services/ExpensesAPI';

import './MonthSpendingBubble.css'

const cookies = new Cookies()

export default function MonthSpendingBubble(props) {

    const [yearMonth, setYearMonth] = useState(moment().format("YYYYMM"))
    const [total, setTotal] = useState({total: 0, scale: ''})
    const [currency, setCurrency] = useState()

    /**
     * Loads the user settings
     */
    const loadSettings = async () => {

        // Get the settings
        const settings = await new ExpensesAPI().getSettings(cookies.get("user").email);

        // Update the settings
        setCurrency(settings.currency)
    }

    /**
     * Loads the year month spend
     */
    const loadSpending = () => {

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
    }

    useEffect(loadSettings, [])
    useEffect(loadSpending, [currency])

    return (
        <div className="month-spending-bubble container">

            <div className="currency-container"><div className="currency">{currency}</div></div>
            <div className="amount-container"><div className="amount">{total.total.toLocaleString("it", { maximumFractionDigits: 0 })}{total.scale}</div></div>
            <div className="month-container"><div className="month">{moment(`${yearMonth}01`, "YYYYMMDD").format("MMM")}</div></div>

        </div>
    )

}

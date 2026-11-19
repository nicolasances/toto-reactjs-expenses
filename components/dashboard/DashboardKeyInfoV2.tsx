'use client'

import moment from 'moment-timezone'
import { useEffect, useState } from 'react'
import { MaskedSvgIcon } from 'toto-react'
import { ExpensesAPI } from '@/api/ExpensesAPI'
import { IncastAPI } from '@/api/IncastAPI'
import MonkeyLoader from '@/components/MonkeyLoader'
import './DashboardKeyInfoV2.css'

/**
 * Dashboard key info, version 2: the incomes, savings and expenses bubbles of the current month.
 */
export function DashboardKeyInfoV2() {

    const [totalExpenses, setTotalExpenses] = useState<number | undefined>()
    const [totalIncomes, setTotalIncomes] = useState<number | undefined>()
    const [totalSavings, setTotalSavings] = useState<number | undefined>()
    const [currency, setCurrency] = useState("")
    const [loading, setLoading] = useState(true)
    const [incastError, setIncastError] = useState(false)

    const yearMonth = moment().format('YYYYMM');

    /**
     * Loads the totals of the month (and the salary forecast, if no salary has been received yet)
     */
    const loadData = async () => {

        // Set a timeout to start the loading
        const loadingTimer = setTimeout(() => { setLoading(true) }, 500)

        const settings = await new ExpensesAPI().getSettings();

        // Load the total expenses
        const totalExpenses = await new ExpensesAPI().getMonthTotalSpending(yearMonth, settings.currency)

        // Load the total incomes
        const { incomes } = await new ExpensesAPI().getIncomes(yearMonth)

        // If there are no salaries in the incomes, fetch a prediction for the salary
        let salaryPresent = false
        let sumIncomes = 0
        for (const income of incomes) {

            // Accumulate the income
            sumIncomes += income.amount;

            // Check if it's a salary
            if (income.category == "SALARY") salaryPresent = true
        }

        // If there is no salary, get a forecast
        let salary = 0;
        if (!salaryPresent) {
            try {
                const salaryPrediction = await new IncastAPI().forecastSalary()
                salary = salaryPrediction.amount
            }
            catch (e) {
                console.log("Error fetching Incast: ", e);
                setIncastError(true)
            }
        }

        sumIncomes += salary

        // Stop the loading timer
        clearTimeout(loadingTimer)

        // Stop the loading
        setLoading(false)

        setCurrency(settings.currency)
        setTotalExpenses(totalExpenses.total)
        setTotalIncomes(sumIncomes)
        setTotalSavings(sumIncomes - totalExpenses.total)

    }

    useEffect(() => { loadData() }, [])

    return (
        <div className="home-screen-h1 v2">
            {!incastError && <AmountBubble currency={currency} amount={totalIncomes} scale="" type="income" loading={loading} />}
            {!incastError && <AmountBubble currency={currency} amount={totalSavings} scale="" type="savings" loading={loading} />}
            <AmountBubble currency={currency} amount={totalExpenses} scale="" type={incastError ? "savings" : "expenses"} label={incastError ? "expenses" : null} loading={loading} />
        </div>
    )

}

interface AmountBubbleProps {
    currency: string;               // Currency label to show
    amount?: number;                // The amount to show
    scale: string;                  // Suffix appended to the amount (e.g. "k")
    type: string;                   // Type of bubble: "income", "savings" or "expenses"
    label?: string | null;          // Optional label overriding the type
    loading: boolean;               // True while loading (shows the loader instead of the amount)
}

/**
 * A bubble that shows an amount
 */
function AmountBubble(props: AmountBubbleProps) {

    if (props.loading === true) return (
        <div className={`amount-bubble ${props.type}`}>
            <MonkeyLoader />
        </div>
    )

    return (
        <div className={`amount-bubble ${props.type}`}>
            <div className="currency-container"><div className="currency">{props.currency}</div></div>
            <div className="amount-container"><div className="amount">{props.amount != null ? props.amount.toLocaleString("it", { maximumFractionDigits: 0 }) : ''}{props.scale}</div></div>
            {(props.type == 'savings' || props.label) && <div className="type-container"><div className="type">{props.label ? props.label : props.type}</div></div>}
            {props.type == 'income' && <div className="image-container"><MaskedSvgIcon src="/images/arrow-income.svg" alt="income" size="w-4 h-4" color="bg-dark-primary" /></div>}
            {props.type == 'expenses' && <div className="image-container"><MaskedSvgIcon src="/images/arrow-expenses.svg" alt="expenses" size="w-4 h-4" color="bg-dark-primary" /></div>}
        </div>
    )
}

'use client'

import moment from 'moment-timezone'
import { useEffect, useState } from 'react'
import { MaskedSvgIcon } from 'toto-react'
import { ExpensesAPI } from '@/api/ExpensesAPI'
import { SalaryPrediction } from '@/model/stats'
import { computeIncomeAndSavings, hasSalary } from '@/utils/incomeSavings'
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
    const [predictionError, setPredictionError] = useState(false)

    const yearMonth = moment().format('YYYYMM');

    /**
     * Loads the totals of the month (and the salary prediction, if no salary has been received yet)
     */
    const loadData = async () => {

        // Set a timeout to start the loading
        const loadingTimer = setTimeout(() => { setLoading(true) }, 500)

        const settings = await new ExpensesAPI().getSettings();

        // Load the total expenses
        const totalExpenses = await new ExpensesAPI().getMonthTotalSpending(yearMonth, settings.currency)

        // Load the total incomes
        const { incomes } = await new ExpensesAPI().getIncomes(yearMonth)

        // If there is no salary in the incomes, fetch the salary prediction
        let prediction: SalaryPrediction | null = null
        let predictionFailed = false

        if (!hasSalary(incomes)) {
            try {
                prediction = await new ExpensesAPI().getSalaryPrediction(settings.currency)
            }
            catch (e) {
                console.log("Error fetching the salary prediction: ", e);
                predictionFailed = true
            }
        }

        const { available, totalIncomes, totalSavings } = computeIncomeAndSavings({ incomes, totalExpenses: totalExpenses.total, prediction, predictionFailed })

        // Stop the loading timer
        clearTimeout(loadingTimer)

        // Stop the loading
        setLoading(false)

        setCurrency(settings.currency)
        setTotalExpenses(totalExpenses.total)
        setPredictionError(!available)
        setTotalIncomes(totalIncomes)
        setTotalSavings(totalSavings)

    }

    useEffect(() => { loadData() }, [])

    return (
        <div className="home-screen-h1 v2">
            {!predictionError && <AmountBubble currency={currency} amount={totalIncomes} scale="" type="income" loading={loading} />}
            {!predictionError && <AmountBubble currency={currency} amount={totalSavings} scale="" type="savings" loading={loading} />}
            <AmountBubble currency={currency} amount={totalExpenses} scale="" type={predictionError ? "savings" : "expenses"} label={predictionError ? "expenses" : null} loading={loading} />
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

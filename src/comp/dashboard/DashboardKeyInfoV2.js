import moment from 'moment-timezone'
import './DashboardKeyInfoV2.css'
import { ReactComponent as IncomeSVG } from '../../img/arrow-income.svg'
import { ReactComponent as ExpensesSVG } from '../../img/arrow-expenses.svg'
import ExpensesAPI from '../../services/ExpensesAPI'
import Cookies from 'universal-cookie'
import { useEffect, useState } from 'react'
import IncastAPI from '../../services/IncastAPI'
import MonkeyLoader from '../MonkeyLoader'

const cookies = new Cookies()

export function DashboardKeyInfoV2(props) {

    const [totalExpenses, setTotalExpenses] = useState()
    const [totalIncomes, setTotalIncomes] = useState()
    const [totalSavings, setTotalSavings] = useState()
    const [currency, setCurrency] = useState("")
    const [loading, setLoading] = useState(true)

    const yearMonth = moment().format('YYYYMM');

    const loadData = async () => {

        // Set a timeout to start the loading
        const loadingTimer = setTimeout(() => { setLoading(true) }, 500)

        const settings = await new ExpensesAPI().getSettings(cookies.get("user").email);

        // Load the total expenses
        const totalExpenses = await new ExpensesAPI().getMonthTotalSpending(yearMonth, settings.currency)

        // Load the total incomes
        const { incomes } = await new ExpensesAPI().getIncomes(yearMonth)

        // If there are no salaries in the incomes, fetch a prediction for the salary
        let salaryPresent = false
        let sumIncomes = 0
        for (let income of incomes) {

            // Accumulate the income
            sumIncomes += income.amount;

            // Check if it's a salary
            if (income.category == "SALARY") salaryPresent = true
        }

        // If there is no salary, get a forecast
        let salary = 0;
        if (!salaryPresent) {
            const salaryPrediction = await new IncastAPI().forecastSalary()
            salary = salaryPrediction.amount
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

    useEffect(loadData, [])

    return (
        <div className="home-screen-h1 v2">
            <AmountBubble currency={currency} amount={totalIncomes} scale="" type="income" loading={loading} />
            <AmountBubble currency={currency} amount={totalSavings} scale="" type="savings" loading={loading} />
            <AmountBubble currency={currency} amount={totalExpenses} scale="" type="expenses" loading={loading} />
        </div>
    )

}

function AmountBubble(props) {

    if (props.loading === true) return (
        <div className={`amount-bubble ${props.type}`}>
            <MonkeyLoader/>
        </div>
    )

    return (
        <div className={`amount-bubble ${props.type}`}>
            <div className="currency-container"><div className="currency">{props.currency}</div></div>
            <div className="amount-container"><div className="amount">{props.amount != null ? props.amount.toLocaleString("it", { maximumFractionDigits: 0 }) : ''}{props.scale}</div></div>
            {props.type == 'savings' && <div className="type-container"><div className="type">{props.type}</div></div>}
            {props.type == 'income' && <div className="image-container"><IncomeSVG /></div>}
            {props.type == 'expenses' && <div className="image-container"><ExpensesSVG /></div>}
        </div>
    )
}
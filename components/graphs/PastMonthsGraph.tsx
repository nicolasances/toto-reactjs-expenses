'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment';

import TotoBarChart, { BarChartDatum } from '@/components/chart/TotoBarChart';
import { ExpensesAPI } from '@/api/ExpensesAPI';
import { MonthTotal, MonthsTotalsResponse } from '@/model/stats';

import './PastMonthsGraph.css'

interface PastMonthsGraphProps {
  months?: number;      // (optional, default 10) how many months in the past to show
  maxHeight?: number;   // (optional) max height of the chart
}

/**
 * Extracts the list of month totals from the API response.
 * The API nests the list in response.months.months.
 */
function extractMonths(data?: MonthsTotalsResponse): MonthTotal[] {

  return data && data.months ? data.months.months : []
}

/**
 * Bar chart of the expenses of the past months, with the incomes as an overlay line.
 * Clicking on a bar opens the expenses of that month.
 *
 * @param {PastMonthsGraphProps} props the props
 */
export default function PastMonthsGraph(props: PastMonthsGraphProps) {

  const maxMonths = props.months ? props.months : 10;

  const router = useRouter()

  const [months, setMonths] = useState<MonthTotal[] | null>(null)
  const [preparedData, setPreparedData] = useState<BarChartDatum[] | null>(null)
  const [preparedIncomeData, setPreparedIncomeData] = useState<BarChartDatum[] | null>(null)

  /**
   * Loads the last x months of spending (just the totals)
   */
  const loadExpenses = async (targetCurrency: string) => {

    // Define how many months in the past
    const yearMonthFrom = moment().startOf('month').subtract(maxMonths, 'months').format('YYYYMM');

    const data = await new ExpensesAPI().getExpensesPerMonth(yearMonthFrom, targetCurrency)

    return extractMonths(data)

  }

  /**
   * Loads the last x months of incomes (just the totals)
   */
  const loadIncomes = async (targetCurrency: string) => {

    // Define how many months in the past
    const yearMonthFrom = moment().startOf('month').subtract(maxMonths, 'months').format('YYYYMM');

    // Get the data
    const data = await new ExpensesAPI().getIncomesPerMonth(yearMonthFrom, targetCurrency)

    return extractMonths(data)

  }

  /**
   * Prepares the expenses data for the graph to display
   */
  const prepareExpensesData = (expensesMonths: MonthTotal[]): BarChartDatum[] => {

    const data: BarChartDatum[] = [];

    for (let i = 0; i < expensesMonths.length; i++) {

      data.push({
        x: i,
        y: expensesMonths[i].amount
      })
    }

    return data;

  }

  /**
   * Prepares the data for the income line to display
   */
  const prepareIncomesData = (expensesMonths: MonthTotal[], incomeMonths: MonthTotal[]): BarChartDatum[] | null => {

    const data: BarChartDatum[] = [];

    if (incomeMonths.length == 0) return null;

    const yearMonths = expensesMonths.map((item) => item.yearMonth)

    // Function used to find an income month with the given yearmonth
    const findCorrespondingIncomeMonth = (yearMonth: string) => {

      for (const incomeMonth of incomeMonths) {

        if (incomeMonth.yearMonth == yearMonth) return incomeMonth

      }

      return null;

    }

    let i = 0;
    for (const yearMonth of yearMonths) {

      // Find the income month for that specific month
      const incomeMonth = findCorrespondingIncomeMonth(yearMonth)

      // If it doesn't exist AND IT'S NOT THE LAST MONTH, add a 0
      if (!incomeMonth && i < yearMonths.length - 1) data.push({ x: i++, y: 0 })
      // Otherwise, add the month's total income
      else if (incomeMonth != null) data.push({
        x: i++,
        y: incomeMonth.amount
      })

    }

    return data;

  }

  /**
   * Load everything
   */
  const load = async () => {

    // Load the settings
    const settings = await new ExpensesAPI().getSettings()

    // Extract the target currency
    const targetCurrency = (settings && settings.currency) ? settings.currency : "EUR"

    // Load the expenses
    const expensesMonths = await loadExpenses(targetCurrency)

    // Load the incomes
    const incomesMonths = await loadIncomes(targetCurrency)

    // Update the state and prepare the data
    setMonths(expensesMonths)
    setPreparedData(prepareExpensesData(expensesMonths))
    setPreparedIncomeData(prepareIncomesData(expensesMonths, incomesMonths))

  }

  useEffect(() => { load() }, [])

  /**
   * Create the x axis labels
   * Just show some of the months, since we expect to have many of those
   */
  const xAxisTransform = (value: number) => {

    if (months == null) return;
    if (months[value] == null) return;

    const month = months[value];
    const parsedMonth = moment(month.yearMonth + '01', 'YYYYMMDD');

    return parsedMonth.format('MMM');

  }

  /**
   * Defines the label for the value
   */
  const valueLabel = (value: number) => {

    if (value == null) return '';

    return Math.round(value).toLocaleString('it');
  }

  /**
   * Reacts to a bar click
   * @param {BarChartDatum} data the data object (as created in the prepare functions)
   */
  const onBarClick = (data: BarChartDatum) => {

    if (!months) return;

    // Navigate to the expenses of that month
    router.push('/expenses?yearMonth=' + months[data.x].yearMonth)
  }

  return (
    <div className='graph-past-months-expenses'>
      <TotoBarChart
        data={preparedData}
        lineData={preparedIncomeData}
        xAxisTransform={xAxisTransform}
        valueLabelTransform={valueLabel}
        maxHeight={props.maxHeight}
        margins={{ horizontal: 24, vertical: 12 }}
        onBarClick={onBarClick}
      />
    </div>
  )
}

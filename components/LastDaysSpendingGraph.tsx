'use client'

import { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { ExpensesAPI } from '@/api/ExpensesAPI';
import { getCurrentUser } from '@/utils/AuthUtil';
import { DayTotal } from '@/model/stats';
import TotoLineChart, { LineChartPoint, LineChartTheme } from '@/components/TotoLineChart';

// Colors of the chart
const theme: LineChartTheme = {
    background: '#00acc1',
    line: '#5ddef4',
    caps: '#5ddef4',
    area: '#007c91',
    value: '#5ddef4',
}

/**
 * Fills in the missing days
 *
 * @param days the days returned by the API
 * @param dateFrom the first day (YYYYMMDD)
 * @param numOfDays how many days to cover
 */
function fillInMissingDays(days: DayTotal[], dateFrom: string, numOfDays: number): DayTotal[] {

    let day = moment(dateFrom, 'YYYYMMDD');

    // Function to check if the day is present in the array
    const dayIsPresent = (d: string) => {
        for (let i = 0; i < days.length; i++) {
            if (days[i].date == d) return true;
        }
        return false;
    }

    // Fill the missing days
    for (let i = 0; i < numOfDays; i++) {

        if (!dayIsPresent(day.format('YYYYMMDD'))) {

            days.splice(i, 0, {
                date: day.format('YYYYMMDD'),
                amount: 0
            });
        }

        day = day.add(1, 'days');
    }

    return days;
}

/**
 * Defines the label for the value
 */
function valueLabel(value: number): string {

    if (value == null) return '';

    return '€ ' + value.toFixed(0);
}

/**
 * Line chart of the spending of the last days.
 */
export default function LastDaysSpendingGraph() {

    const [days, setDays] = useState<DayTotal[]>();

    // Loads the data to plot
    useEffect(() => {

        const user = getCurrentUser();
        if (!user) return;

        // Define how many days in the past
        const daysInPast = 8;
        const dateFrom = moment().subtract(daysInPast, 'days').format('YYYYMMDD');

        new ExpensesAPI().getExpensesPerDay(user.email, dateFrom, null).then((data) => {

            if (data == null || data.days == null) return;

            setDays(fillInMissingDays(data.days, dateFrom, daysInPast));
        })
    }, [])

    // Prepares the data for the chart
    const preparedData: LineChartPoint[] | undefined = days ? days.map((day, i) => ({ x: i, y: day.amount })) : undefined;

    /**
     * Get the x axis label
     */
    const xAxisTransform = (value: number): string | undefined => {

        if (days == null) return;
        if (days.length <= value) return;

        return moment(days[value].date, 'YYYYMMDD').format('dd');
    }

    return (
        <div className="graph-container">
            <TotoLineChart
                data={preparedData}
                maxHeight={100}
                valueLabelTransform={valueLabel}
                xAxisTransform={xAxisTransform}
                margins={{ horizontal: 12, vertical: 24 }}
                theme={theme}
            />
        </div>
    )
}

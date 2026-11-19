'use client'

import React, { useState } from 'react';
import moment, { Moment } from 'moment-timezone';

import './DatePicker.css';

interface DayPickerProps {
    year?: string;                                  // (MANDATORY) the year (YYYY) to consider when displaying the days of the month
    month?: string;                                 // (MANDATORY) the month (MM) to consider when displaying the days of the month
    onDateSelected?: (date: Moment) => void;        // (OPTIONAL) callback for the selection of a date
    defaultValue?: Moment;                          // (OPTIONAL) the default date
}

/**
 * Displays a calendar (grid) from which to pick the day.
 *
 * @param {DayPickerProps} props the props
 */
export default function DayPicker(props: DayPickerProps) {

    const [selectedDate, setSelectedDate] = useState<Moment | undefined>(props.defaultValue)

    /**
     * Selects a date and notifies the listener
     */
    const onCellClick = (date: Moment) => {

        setSelectedDate(date)

        if (props.onDateSelected) props.onDateSelected(date);

    }

    /**
     * Returns the reference month for this picker
     */
    const getReferenceMonth = (): Moment => {

        const year = props.year ? props.year : moment().format('YYYY');
        const month = props.month ? props.month : moment().format('MM');

        return moment(year + month + '01', 'YYYYMMDD');
    }

    /**
     * Calculates the days of the current month
     */
    const daysOfMonth = (): Moment[] => {

        const firstDayOfFirstWeek = getReferenceMonth().clone().startOf('week');
        const lastDayOfLastWeek = getReferenceMonth().clone().endOf('month').endOf('week');

        const calendarDays: Moment[] = [];

        let currentCalendarDay = firstDayOfFirstWeek;

        do {

            calendarDays.push(currentCalendarDay.clone());

            currentCalendarDay = currentCalendarDay.add(1, 'days');

        } while (currentCalendarDay.format('YYYYMMDD') != lastDayOfLastWeek.format('YYYYMMDD'));

        calendarDays.push(currentCalendarDay.clone());

        return calendarDays;

    }

    /**
     * Defines the days grid for the passed month and year
     */
    const grid = () => {

        const grid: React.ReactNode[] = [];

        const days = daysOfMonth();

        // Create the cells
        const elements = days.map((date) => {

            let elClass = "cell";
            if (date.format('MM') != getReferenceMonth().format('MM')) elClass += ' disabled';
            if (selectedDate && date.format('YYYYMMDD') == selectedDate.format('YYYYMMDD')) elClass += ' selected';

            return (
                <div key={date.format('YYYYMMDD')} className={elClass} onClick={() => { onCellClick(date) }}>
                    {date.format("DD")}
                </div>
            )
        })

        // Create the header
        const header = (
            <div className="row" key="header">
                {
                    days.slice(0, 7).map((date) => {
                        return (
                            <div key={"header" + date.format('dd')} className="cell header">
                                {date.format('dd')}
                            </div>
                        )
                    })
                }
            </div>
        )

        grid.push(header);

        // Organize the cells into rows
        for (let row = 0; row < days.length / 7; row++) {

            grid.push((
                <div className="row" key={"row" + row}>
                    {elements.slice(row * 7, row * 7 + 7)}
                </div>
            ))
        }

        return grid;

    }

    return (
        <div className="day-picker">
            <div className="grid-container">
                {grid()}
            </div>
        </div>
    )
}

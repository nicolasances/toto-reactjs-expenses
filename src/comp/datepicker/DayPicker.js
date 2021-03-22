import React, { Component } from 'react';
import moment from 'moment-timezone';

import './DatePicker.css';

/**
 * Displays a calendar (grid) from which to pick the day. 
 * 
 * Parameters:
 * 
 *  - year              : (MANDATORY) the year to consider when displaying the days of the month
 *  - month             : (MANDATORY) the month to consider when displaying the days of the month
 *  - onDateSelected    : (OPTIONAL) callback for the selection of a date. Will receive a moment() object.
 *  - defaultValue      : (OPTIONAL) the default date as a moment() object
 */
export default class DayPicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedDate: this.props.defaultValue
        };

        this.daysOfMonth = this.daysOfMonth.bind(this);
        this.grid = this.grid.bind(this);
        this.getReferenceMonth = this.getReferenceMonth.bind(this);
        this.onCellClick = this.onCellClick.bind(this);
    }

    onCellClick(date) {

        this.setState({
            selectedDate: date
        }, () => {
            if (this.props.onDateSelected) this.props.onDateSelected(date);
        })

    }

    /**
     * Returns the reference month for this picker as a moment() object
     */
    getReferenceMonth() {

        let year = this.props.year ? this.props.year : moment().format('YYYY');
        let month = this.props.month ? this.props.month : moment().format('MM');

        return moment(year + month + '01', 'YYYYMMDD');
    }

    /**
     * Calculates the days of the current month
     */
    daysOfMonth() {

        let firstDayOfFirstWeek = this.getReferenceMonth().clone().startOf('week');
        let lastDayOfLastWeek = this.getReferenceMonth().clone().endOf('month').endOf('week');

        let calendarDays = [];

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
    grid() {

        let grid = [];

        let daysOfMonth = this.daysOfMonth();

        // Create the cells
        let elements = daysOfMonth.map((date) => {

            let elClass = "cell";
            if (date.format('MM') != this.getReferenceMonth().format('MM')) elClass += ' disabled';
            if (this.state.selectedDate && date.format('YYYYMMDD') == this.state.selectedDate.format('YYYYMMDD')) elClass += ' selected';

            return (
                <div key={date} className={elClass} onClick={() => {this.onCellClick(date)}}>
                    {date.format("DD")}
                </div>
            )
        })

        // Create the header
        let header = (
            <div className="row" key="header">
                {
                    daysOfMonth.slice(0, 7).map((date) => {
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
        for (var row = 0; row < daysOfMonth.length / 7; row++) {

            grid.push((
                <div className="row" key={"row" + row}>
                    {elements.slice(row * 7, row * 7 + 7)}
                </div>
            ))
        }

        return grid;

    }

    render() {

        let grid = this.grid();

        return (
            <div className="day-picker">
                <div className="grid-container">
                    {grid}
                </div>
            </div>
        )
    }
}
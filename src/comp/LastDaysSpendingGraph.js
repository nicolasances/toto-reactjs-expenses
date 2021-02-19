import React, { Component } from 'react';
import ExpensesAPI from '../services/ExpensesAPI';
import TotoLineChart from './TotoLineChart';
import Cookies from 'universal-cookie';
import moment from 'moment-timezone';

const cookies = new Cookies();

export default class LastDaysSpendingGraph extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }

        this.load = this.load.bind(this);
        this.xAxisTransform = this.xAxisTransform.bind(this);
    }

    componentDidMount() {
        this.load();
    }

    /**
     * Loads the data to plot
     */
    load() {

        // Define how many days in the past
        let daysInPast = 8;
        let dateFrom = moment().subtract(daysInPast, 'days').format('YYYYMMDD');
        let targetCurrency = this.state.settings ? this.state.settings.currency : null;

        new ExpensesAPI().getExpensesPerDay(cookies.get('user').email, dateFrom, null, targetCurrency).then((data) => {

            if (data == null || data.days == null) return;

            let days = this.fillInMissingDays(data.days, dateFrom, daysInPast);

            this.setState({ days: null }, () => {
                this.setState({ days: days }, () => { this.prepareChartData() });
            })
        })
    }

    /**
     * Fills in the missing days
     */
    fillInMissingDays(days, dateFrom, numOfDays) {

        let day = moment(dateFrom, 'YYYYMMDD');

        // Function to check if the day is present in the array
        let dayIsPresent = (d) => {
            for (var i = 0; i < days.length; i++) {
                if (days[i].date == d) return true;
            }
            return false;
        }

        // Fill the missing days
        for (var i = 0; i < numOfDays; i++) {

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
     * Prepares the data for the chart
     */
    prepareChartData() {

        let preparedData = [];

        for (var i = 0; i < this.state.days.length; i++) {

            let day = this.state.days[i];

            preparedData.push({
                x: i,
                y: day.amount
            })
        }

        this.setState({ preparedData: [] }, () => { this.setState({ preparedData: preparedData }) });

    }

    /**
     * Get the x axis label
     */
    xAxisTransform(value) {

        if (this.state.days == null) return;
        if (this.state.days.length <= value) return;

        return moment(this.state.days[value].date, 'YYYYMMDD').format('dd');

    }

    /**
     * Defines the label for the value
     */
    valueLabel(value) {

        if (value == null) return '';

        return '€ ' + value.toFixed(0);

    }
    render() {

        let theme = {
            background: '#00acc1',
            line: '#5ddef4',
            caps: '#5ddef4',
            area: '#007c91',
            value: '#5ddef4',
        }

        return (
            <div className="graph-container">
                <TotoLineChart
                    data={this.state.preparedData}
                    maxHeight={100}
                    valueLabelTransform={this.valueLabel}
                    xAxisTransform={this.xAxisTransform}
                    margins={{ horizontal: 12, vertical: 24 }}
                    theme={theme}
                />
            </div>
        )
    }
}
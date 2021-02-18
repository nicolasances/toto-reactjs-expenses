import React, { Component } from 'react';
import moment from 'moment';

import ExpensesAPI from '../services/ExpensesAPI';

import './MonthSpendingBubble.css'

export default class MonthSpendingBubble extends Component {

    constructor(props) {
        super(props);

        this.state = {
            yearMonth: moment().format('YYYYMM'),
            month: moment().format('MMM'),
            spending: 0,
            currency: 'EUR'
        }

        // Bindings
        this.loadSpending = this.loadSpending.bind(this);
    }

    componentDidMount() {
        this.loadSpending();
    }

    /**
     * Loads the current month spending
     */
    loadSpending() {

        let targetCurrency = this.state.settings ? this.state.settings.currency : null;

        new ExpensesAPI().getMonthTotalSpending("nicolas.matteazzi@gmail.com", this.state.yearMonth, targetCurrency).then((data) => {

            // Animate
            if (data != null && data.total != null) this.setState({spending: data.total});

        });
    }

    render() {
        return (
            <div className="container">

                <div className="currency-container"><div className="currency">{this.state.currency}</div></div>
                <div className="amount-container"><div className="amount">{this.state.spending.toFixed(0)}</div></div>
                <div className="month-container"><div className="month">{this.state.month}</div></div>

            </div>
        )
    }

}

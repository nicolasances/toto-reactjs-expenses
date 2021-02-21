import React, { Component } from 'react';
import TitleBar from '../comp/TitleBar';
import MonthNavigator from '../comp/MonthNavigator';

import moment from 'moment-timezone';

import './ExpensesScreen.css';

export default class ExpensesScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedMonth: moment()
        }

        this.onMonthChange = this.onMonthChange.bind(this);
    }

    onMonthChange(newMonth) {
        this.setState({selectedMonth: newMonth});
    }

    render() {
        return (
            <div className="screen expenses-screen">
                <TitleBar title="Payments list" back={true} />
                <div className="month-navigator-container">
                    <MonthNavigator onMonthChange={this.onMonthChange}/>
                </div>
            </div>
        )
    }
}
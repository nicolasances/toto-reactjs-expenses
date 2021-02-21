import React, { Component } from 'react';
import TitleBar from '../comp/TitleBar';
import MonthNavigator from '../comp/MonthNavigator';

import './ExpensesScreen.css';

export default class ExpensesScreen extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="screen expenses-screen">
                <TitleBar title="Payments list" back={true} />
                <div className="month-navigator-container">
                    <MonthNavigator />
                </div>
            </div>
        )
    }
}
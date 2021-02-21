import React, { Component } from 'react';
import TitleBar from '../comp/TitleBar';
import MonthNavigator from '../comp/MonthNavigator';
import Cookies from 'universal-cookie';
import TotoList from '../comp/TotoList';
import categoriesMap from '../services/CategoriesMap';

import { ReactComponent as BankSVG } from '../img/bank.svg';
import { ReactComponent as ReconcileSVG } from '../img/reconcile.svg';

import moment from 'moment-timezone';

import './ExpensesScreen.css';
import ExpensesAPI from '../services/ExpensesAPI';

const cookies = new Cookies();

export default class ExpensesScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedMonth: moment()
        }

        this.onMonthChange = this.onMonthChange.bind(this);
        this.loadExpenses = this.loadExpenses.bind(this);
    }

    componentDidMount() {
        this.loadExpenses();
    }

    loadExpenses() {
        new ExpensesAPI().getExpenses(cookies.get('user').email, this.state.selectedMonth.format('YYYYMM')).then((data) => {
            this.setState({ expenses: data.expenses });
        })
    }

    onMonthChange(newMonth) {
        this.setState({ selectedMonth: newMonth }, () => {
            this.loadExpenses();
        });
    }

    /**
     * Extractor
     */
    dataExtractor(item) {

        let currency = item.currency;
        if (item.currency === 'EUR') currency = '€';
        else if (item.currency === 'DKK') currency = 'kr.'

        // Highlights
        let highlights = [];
        // Highlight - Consolildation icon
        if (!item.consolidated) highlights.push({
            image: (<ReconcileSVG />),
            onPress: this.onReconcilePress
        })
        // Highlight - Imported from bank statement
        if (item.additionalData && item.additionalData.source === 'bank-statement') highlights.push({
            image: (<BankSVG />)
        })

        return {
            avatar: {
                type: 'image',
                value: categoriesMap.get(item.category).image,
                size: 'l'
            },
            date: { date: item.date },
            title: item.description,
            amount: currency + ' ' + item.amount.toLocaleString('it'),
            highlights: highlights
        }

    }
    render() {
        return (
            <div className="screen expenses-screen">
                <TitleBar title="Payments list" back={true} />
                <div className="month-navigator-container">
                    <MonthNavigator onMonthChange={this.onMonthChange} />
                </div>
                <div className="expenses-list-widget">
                    <TotoList
                        data={this.state.expenses}
                        dataExtractor={this.dataExtractor}
                        onPress={this.selectExpense}
                        onAvatarClick={this.openCategoryPopup}
                    />
                </div>
            </div>
        )
    }
}
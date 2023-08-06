import React, { Component } from 'react';
import moment from 'moment';
import { useParams, withRouter } from 'react-router-dom';
import TotoIconButton from '../comp/TotoIconButton';
import categoriesMap from '../services/CategoriesMap';
import { ReactComponent as TickSVG } from '../img/tick.svg';
import { ReactComponent as DeleteSVG } from '../img/trash.svg';
import './ExpenseDetailScreen.css';
import ExpensesAPI from '../services/ExpensesAPI';
import Cookies from 'universal-cookie';
import DateSelector from '../comp/DateSelector';
import AmountSelector from '../comp/AmountSelector';
import CurrencySwitcher from '../comp/CurrencySwitcher';
import TextInput from '../comp/TextInput';
import CategoryPicker from '../comp/cateogrypicker/CategoryPicker';
import { bus as eventBus } from '../event/TotoEventBus';
import * as config from '../Config';
import TitleBar from '../comp/TitleBar';

class ExpenseDetailScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {}

        this.loadExpense = this.loadExpense.bind(this);
        this.saveExpense = this.saveExpense.bind(this);
        this.deleteExpense = this.deleteExpense.bind(this);
        this.loadAmount = this.loadAmount.bind(this);
        this.loadDate = this.loadDate.bind(this);
        this.loadCurrency = this.loadCurrency.bind(this);
        this.loadDescription = this.loadDescription.bind(this);
        this.loadCategory = this.loadCategory.bind(this);
    }

    componentDidMount() {

        this.loadExpense();

    }

    componentWillUnmount() {

    }

    /**
     * Loads the expense from the REST API
     */
    loadExpense() {

        let id = this.props.match.params.id;

        new ExpensesAPI().getExpense(id).then((expense) => {

            this.setState({
                expense: expense,
                date: moment(expense.date, 'YYYYMMDD'),
                amount: expense.amount,
                currency: expense.currency
            })

        })
    }

    /**
     * Saves the updated expense
     */
    saveExpense() {
        
        new ExpensesAPI().putExpense(this.state.expense.id, this.state.expense).then((data) => {
            this.props.history.goBack();
        })

    }

    /**
     * Deletes the current expense
     */
    async deleteExpense() {
        
        await new ExpensesAPI().deleteExpense(this.state.expense.id);
        
        this.props.history.goBack();

    }

    /**
     * Loads the currency for the CurrencySwitcher
     * @returns Promise
     */
     loadCurrency() {

        var waitForData = (success) => {
            if (this.state.expense != null) return success(this.state.expense.currency);
            setTimeout(() => { waitForData(success) }, 50);
        }

        return new Promise((success, failure) => {
            waitForData(success);
        });
    }

    /**
     * Loads the amount for the AmountSelector
     * @returns Promise
     */
    loadAmount() {

        var waitForData = (success) => {
            if (this.state.expense != null) return success(this.state.expense.amount);
            setTimeout(() => { waitForData(success) }, 50);
        }

        return new Promise((success, failure) => {
            waitForData(success);
        });
    }

    /**
     * Loads the date for the DateSelector
     * @returns Promise
     */
    loadDate() {

        var waitForData = (success) => {
            if (this.state.expense != null) return success(moment(this.state.expense.date, 'YYYYMMDD'));
            setTimeout(() => { waitForData(success) }, 50);
        }

        return new Promise((success, failure) => {
            waitForData(success);
        });

    }

    /**
     * Loads the description for the TextInput component 
     * @returns Promise
     */
    loadDescription() {

        var waitForData = (success) => {
            if (this.state.expense != null) return success(this.state.expense.description);
            setTimeout(() => { waitForData(success) }, 50);
        }

        return new Promise((success, failure) => {
            waitForData(success);
        });

    }

    /**
     * Loads the category for the CategoryPicker component 
     * @returns Promise
     */
    loadCategory() {

        var waitForData = (success) => {
            if (this.state.expense != null) return success(this.state.expense.category);
            setTimeout(() => { waitForData(success) }, 50);
        }

        return new Promise((success, failure) => {
            waitForData(success);
        });

    }

    render() {

        return (
            <div className="screen expense-detail-screen">
                <TitleBar title="Payment Detail" back={true} />

                <div className="line1">
                    <div className="dateContainer">
                        <DateSelector   initialValueLoader={this.loadDate}
                                        onDateChange={(date) => {
                                            let expense = this.state.expense;
                                            expense.date = date.format('YYYYMMDD');
                                            this.setState({ expense: expense });
                                        }}
                        />
                    </div>
                    <div className="amountContainer">
                        <AmountSelector initialValueLoader={this.loadAmount} 
                                        onAmountChange={(amt) => {
                                            let expense = this.state.expense;
                                            expense.amount = amt;
                                            this.setState({ expense: expense });
                                        }} 
                        />
                    </div>
                    <div className="currencyContainer">
                        <CurrencySwitcher   initialValueLoader={this.loadCurrency}
                                            onCurrencyChange={(c) => {
                                                let expense = this.state.expense;
                                                expense.currency = c;
                                                this.setState({ expense: expense });
                                            }} 
                                            loadFromSettings={false}
                        />
                    </div>
                </div>

                <div className="line2">
                    <TextInput  placeholder="What was this payment for?"
                                initialValueLoader={this.loadDescription}
                                align="center"
                                onTextChange={(t) => {
                                    let expense = this.state.expense;
                                    expense.description = t;
                                    this.setState({ expense: expense });
                                }} 
                    />
                </div>

                <div className="line3">
                    <CategoryPicker initialValueLoader={this.loadCategory}    
                                    onCategoryChange={(cat) => {
                                        let expense = this.state.expense;
                                        expense.category = cat;
                                        this.setState({ expense: expense });
                                    }} 
                    />
                </div>

                <div style={{ flex: 1 }}>
                </div>

                <div className="line4">
                    <div style={{ marginLeft: 6, marginRight: 6 }}><TotoIconButton image={(<TickSVG className="icon" />)} onPress={this.saveExpense} /></div>
                    <div style={{ marginLeft: 6, marginRight: 6 }}><TotoIconButton image={(<DeleteSVG className="icon" />)} onPress={this.deleteExpense} /></div>
                </div>
            </div>
        )
    }
}

export default withRouter(ExpenseDetailScreen);
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
import Checkbox from '../comp/Checkbox';

class ExpenseDetailScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {}

        this.loadExpense = this.loadExpense.bind(this);
        this.loadIncome = this.loadIncome.bind(this);
        this.saveTransaction = this.saveTransaction.bind(this);
        this.deleteExpense = this.deleteExpense.bind(this);
        this.loadAmount = this.loadAmount.bind(this);
        this.loadDate = this.loadDate.bind(this);
        this.loadCurrency = this.loadCurrency.bind(this);
        this.loadDescription = this.loadDescription.bind(this);
        this.loadCategory = this.loadCategory.bind(this);
        this.onToggleMonthly = this.onToggleMonthly.bind(this);
    }

    componentDidMount() {

        // Extract the Transaction Id
        const id = this.props.match.params.id;

        // Check if there is any additional data
        const data = this.props.location.state;

        // If the transaction is an income, load it as income
        if (data && data.income == true) this.loadIncome(id)
        else this.loadExpense(id);

    }

    /**
     * Loads the income
     * 
     * @param {string} id the id of the transaction
     */
    async loadIncome(id) {

        // Get the income
        const income = await new ExpensesAPI().getIncome(id);

        // Set the state
        this.setState({
            transaction: income,
            date: moment(income.date, 'YYYYMMDD'),
            amount: income.amount,
            currency: income.currency,
            monthly: false,
            income: true
        })

    }

    /**
     * Loads the expense from the REST API
     */
    async loadExpense(id) {

        const expense = await new ExpensesAPI().getExpense(id);

        // Update the state
        this.setState({
            transaction: expense,
            date: moment(expense.date, 'YYYYMMDD'),
            amount: expense.amount,
            currency: expense.currency,
            monthly: expense.monthly,
            income: false
        })

    }

    /**
     * Saves the updated transaction
     */
    async saveTransaction() {

        // Update the transaction
        if (this.state.income == true) await new ExpensesAPI().putIncome(this.state.transaction.id, this.state.transaction)
        else await new ExpensesAPI().putExpense(this.state.transaction.id, this.state.expense)

        // Go back 
        this.props.history.goBack();

    }

    /**
     * Toggles the recurring monthly setting
     */
    onToggleMonthly() {

        this.setState((prevState) => {
            return {
                transaction: {
                    ...prevState.transaction,
                    monthly: !prevState.monthly
                }
            }
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
            if (this.state.transaction != null) return success(this.state.transaction.currency);
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
            if (this.state.transaction != null) return success(this.state.transaction.amount);
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
            if (this.state.transaction != null) return success(moment(this.state.transaction.date, 'YYYYMMDD'));
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
            if (this.state.transaction != null) return success(this.state.transaction.description);
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
            if (this.state.transaction != null) return success(this.state.transaction.category);
            setTimeout(() => { waitForData(success) }, 50);
        }

        return new Promise((success, failure) => {
            waitForData(success);
        });

    }

    render() {

        if (!this.state.transaction) return <div className="screen expense-detail-screen"></div>

        return (
            <div className="screen expense-detail-screen">
                <TitleBar title="Transaction Detail" back={true} />

                <div className="line1">
                    <div className="dateContainer">
                        <DateSelector initialValueLoader={this.loadDate}
                            onDateChange={(date) => {
                                let transaction = this.state.transaction;
                                transaction.date = date.format('YYYYMMDD');
                                this.setState({ transaction: transaction });
                            }}
                        />
                    </div>
                    <div className="amountContainer">
                        <AmountSelector initialValueLoader={this.loadAmount}
                            onAmountChange={(amt) => {
                                let transaction = this.state.transaction;
                                transaction.amount = amt;
                                this.setState({ transaction: transaction });
                            }}
                        />
                    </div>
                    <div className="currencyContainer">
                        <CurrencySwitcher initialValueLoader={this.loadCurrency}
                            onCurrencyChange={(c) => {
                                let transaction = this.state.transaction;
                                transaction.currency = c;
                                this.setState({ transaction: transaction });
                            }}
                            loadFromSettings={false}
                        />
                    </div>
                </div>

                <div className="line2">
                    <TextInput placeholder={this.state.income == true ? "What was this income for?" : "What was this payment for?"}
                        initialValueLoader={this.loadDescription}
                        align="center"
                        onTextChange={(t) => {
                            let transaction = this.state.transaction;
                            transaction.description = t;
                            this.setState({ transaction: transaction });
                        }}
                    />
                </div>

                {this.state.income == false &&
                    <div className="line3">
                        <CategoryPicker initialValueLoader={this.loadCategory}
                            category={this.state.transaction.category}
                            onCategoryChange={(cat) => {
                                let transaction = this.state.transaction;
                                transaction.category = cat;
                                this.setState({ transaction: transaction });
                            }}
                        />
                    </div>
                }

                {this.state.income == false &&
                    <div className="line4">
                        <Checkbox onToggleFlag={this.onToggleMonthly} flag={this.state.transaction && this.state.transaction.monthly} />
                    </div>
                }

                <div style={{ flex: 1 }}>
                </div>

                <div className="line5">
                    <div style={{ marginLeft: 6, marginRight: 6 }}><TotoIconButton image={(<TickSVG className="icon" />)} onPress={this.saveTransaction} /></div>
                    {this.state.income == false && <div style={{ marginLeft: 6, marginRight: 6 }}><TotoIconButton image={(<DeleteSVG className="icon" />)} onPress={this.deleteExpense} /></div>}
                </div>
            </div>
        )
    }
}

export default withRouter(ExpenseDetailScreen);
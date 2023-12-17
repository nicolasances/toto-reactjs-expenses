import React, { Component } from 'react';
import TitleBar from '../comp/TitleBar';
import Cookies from 'universal-cookie';
import TotoList from '../comp/TotoList';
import categoriesMap from '../services/CategoriesMap';
import { ReactComponent as BankSVG } from '../img/bank.svg';
import { ReactComponent as ReconcileSVG } from '../img/reconcile.svg';
import { ReactComponent as IncomeSVG } from '../img/income.svg';
import moment from 'moment-timezone';
import './ExpensesScreen.css';
import ExpensesAPI from '../services/ExpensesAPI';
import { withRouter } from 'react-router';
import YearMonthTile from '../picker/YearMonthTile';
import ScrollPicker from '../picker/ScrollPicker';
import Popup from 'reactjs-popup';
import CategorySelectionPopup from '../comp/cateogrypicker/CategorySelectionPopup';
import querystring from 'querystring';

const cookies = new Cookies();

class ExpensesScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedMonth: this.getLastSelectedMonth(),
            categoryPopupOpen: false
        }

        this.onMonthChange = this.onMonthChange.bind(this);
        this.loadExpenses = this.loadExpenses.bind(this);
        this.loadIncomes = this.loadIncomes.bind(this);
        this.loadTransactions = this.loadTransactions.bind(this);
        this.selectExpense = this.selectExpense.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.changeExpenseCategory = this.changeExpenseCategory.bind(this);
        this.onReconcilePress = this.onReconcilePress.bind(this);
        this.dataExtractor = this.dataExtractor.bind(this);
    }

    componentDidMount() {
        this.loadTransactions();
    }


    /**
     * Returns the last used yearMonth, so that the user doesn't have to scroll continuously, when he's working on a 
     * specific month. 
     * Note that the last used month is only cached for a short duration of time, to avoid annoying user experiences.
     * @returns moment object
     */
    getLastSelectedMonth(navigation) {

        let lastUsedMonth;
        let searchParams = this.props.location.search ? querystring.parse(this.props.location.search.substring(1)) : null;

        // Check the cookies: they override everything
        if (cookies.get("expensesListYearMonth")) return moment(cookies.get("expensesListYearMonth") + "01", "YYYYMMDD");
        // Otherwise, check the navigation state
        else if (this.props.location && this.props.location.state && this.props.location.state.selectedMonth) return moment(this.props.location.state.selectedMonth + '01', "YYYYMMDD");
        // Otherwise, check if there's a query param in the URL
        else if (searchParams && searchParams.yearMonth) return moment(searchParams.yearMonth + '01', 'YYYYMMDD');
        // Otherwise, current month
        else return moment();

    }

    /**
     * Updates the cookie to store the selected year month
     * @param {moment object} yearMonth the selected year month
     */
    updateLastSelectedMonth(yearMonth) {

        cookies.set('expensesListYearMonth', yearMonth.format('YYYYMMDD'), {
            expires: moment().add(5, 'minutes').toDate()
        })
    }

    /**
     * Clear the expensesListYearMonth cookie
     * This is needed to make sure that when coming from the dashboard, cookies used when navigating months are not overriding everything. 
     * This is to avoid the behaviour of the user entering this Screen from the Home Screen and finding itself on a weird month, just because last time it was in the expenses list 
     * it was scrolling through months. Entering from the HomeScreen always has to set you on the current month
     */
    clearCookies() {
        cookies.remove("expensesListYearMonth")
    }

    /**
     * Loads all transaction of the currently selected year month
     * 
     * That is :
     *  - the expenses
     *  - the incomes
     */
    async loadTransactions() {

        // Load the expenses
        const expenses = await this.loadExpenses()

        // Load the incomes
        const incomes = await this.loadIncomes()

        // Set the incomes as "incomes"
        for (let income of incomes) income.income = true

        // Merge the two lists
        let transactions = [...expenses, ...incomes]

        // Sort the transactions
        transactions.sort((a, b) => { return a.date < b.date })

        // Update the state
        this.setState({ transactions: transactions })
    }

    /**
     * Loads all incomes of the currently selected YearMonth
     */
    async loadIncomes() {

        const data = await new ExpensesAPI().getIncomes(this.state.selectedMonth.format("YYYYMM"));

        return data.incomes

    }

    /**
     * Loads all payments of the currently selected YearMonth
     */
    async loadExpenses() {

        const data = await new ExpensesAPI().getExpenses(cookies.get('user').email, this.state.selectedMonth.format('YYYYMM'))

        return data.expenses
    }

    /**
     * Switches to a different year month
     * @param {moment object} newMonth the new month to use
     */
    onMonthChange(newMonth) {
        this.setState({ selectedMonth: newMonth }, () => {
            this.updateLastSelectedMonth(newMonth);
            this.loadTransactions();
        });
    }

    /**
     * When a user clicks on an avatar (category), it triggers the opening of a popup and the change 
     * of category. 
     * This function takes care of that! 
     * @param {expense obj} expense the expense to select
     */
    changeExpenseCategory(expense) {

        // Open the popup for the category change
        // Save the selected expense for the onCategoryChange() function
        this.setState({
            categoryPopupOpen: true,
            selectedExpense: expense
        })

    }

    /**
     * Reacts to the change of an expense's category
     * @param {string} newCategory the new category set
     */
    onCategoryChange(newCategory) {

        this.setState({ categoryPopupOpen: false });

        let expense = this.state.selectedExpense;

        if (!expense) return;

        expense.category = newCategory;

        new ExpensesAPI().putExpense(expense.id, expense).then((data) => {
            this.setState({ selectedExpense: null });
        });

    }

    /**
     * Reacts to the reconcile button click on an expense
     * @param {expense object} expense the expense for which the reconcile button (highlight) has been pressed
     */
    onReconcilePress(expense) {

        new ExpensesAPI().consolidateExpense(expense.id).then(this.loadTransactions);
    }

    selectExpense(transaction) {
        this.props.history.push('/expenses/' + transaction.id, { income: transaction.income });
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
                value: item.category ? categoriesMap.get(item.category).image : (item.income ? <IncomeSVG /> : null),
                size: 'l'
            },
            date: { date: item.date },
            title: item.description,
            monthly: item.monthly,
            amount: (item.income ? "+ " : '') + currency + ' ' + item.amount.toLocaleString('it'),
            highlights: highlights,
            style: item.income ? "income" : "payment"
        }

    }
    render() {
        return (
            <div className="screen expenses-screen">
                <TitleBar title="Payments list" back={true} onBack={this.clearCookies} newExpenseEnabled={true} selectedMonth={this.state.selectedMonth.format("YYYYMM")} />
                <div className="month-navigator-container">
                    <ScrollPicker
                        tile={<YearMonthTile />}
                        defaultValue={this.state.selectedMonth}
                        previousValue={(currentValue) => currentValue.clone().subtract(1, 'months')}
                        nextValue={(currentValue) => currentValue.clone().add(1, 'months')}
                        onSelectionChange={this.onMonthChange}
                    />
                </div>
                <div className="expenses-list-widget">
                    <TotoList
                        data={this.state.transactions}
                        dataExtractor={this.dataExtractor}
                        onPress={this.selectExpense}
                        onAvatarClick={this.changeExpenseCategory}
                    />
                </div>

                <Popup
                    on='click'
                    open={this.state.categoryPopupOpen}
                    contentStyle={{ padding: 0, backgroundColor: '#00acc1', border: 'none' }}
                    arrow={false}
                    closeOnEscape={false}
                >

                    <CategorySelectionPopup
                        onCategoryChange={this.onCategoryChange}
                        onPressClose={() => { this.setState({ categoryPopupOpen: false }) }}
                    />

                </Popup>
            </div>
        )
    }
}
export default withRouter(ExpensesScreen);
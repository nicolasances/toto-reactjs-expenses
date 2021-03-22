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
        this.selectExpense = this.selectExpense.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.changeExpenseCategory = this.changeExpenseCategory.bind(this);
        this.onReconcilePress = this.onReconcilePress.bind(this);
        this.dataExtractor = this.dataExtractor.bind(this);
    }

    componentDidMount() {
        this.loadExpenses();
    }


    /**
     * Returns the last used yearMonth, so that the user doesn't have to scroll continuously, when he's working on a 
     * specific month. 
     * Note that the last used month is only cached for a short duration of time, to avoid annoying user experiences.
     * @returns moment object
     */
    getLastSelectedMonth() {

        let lastUsedMonth;
        let searchParams = this.props.location.search ? querystring.parse(this.props.location.search.substring(1)) : null;

        if (lastUsedMonth) return moment(lastUsedMonth, 'YYYYMMDD');
        // Otherwise, check if there's a query param in the URL
        else if (searchParams && searchParams.yearMonth) return moment (searchParams.yearMonth + '01', 'YYYYMMDD');
        // Otherwise, current month
        else return moment();

    }

    /**
     * Updates the cookie to store the selected year month
     * @param {moment object} yearMonth the selected year month
     */
    updateLastSelectedMonth(yearMonth) {

        // cookies.set('expensesListYearMonth', yearMonth.format('YYYYMMDD'), {
        //     expires: moment().add(1, 'minutes').toDate()
        // })
    }

    loadExpenses() {
        new ExpensesAPI().getExpenses(cookies.get('user').email, this.state.selectedMonth.format('YYYYMM')).then((data) => {
            this.setState({ expenses: data.expenses });
        })
    }

    /**
     * Switches to a different year month
     * @param {moment object} newMonth the new month to use
     */
    onMonthChange(newMonth) {
        this.setState({ selectedMonth: newMonth }, () => {
            this.updateLastSelectedMonth(newMonth);
            this.loadExpenses();
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

        this.setState({ categoryPopupOpen : false });

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

        new ExpensesAPI().consolidateExpense(expense.id).then(this.loadExpenses);
    }

    selectExpense(expense) {
        this.props.history.push('/expenses/' + expense.id);
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
                value: item.category ? categoriesMap.get(item.category).image : null,
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
                        data={this.state.expenses}
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
                        onPressClose={() => {this.setState({categoryPopupOpen: false})}}
                        />

                </Popup>
            </div>
        )
    }
}
export default withRouter(ExpensesScreen);
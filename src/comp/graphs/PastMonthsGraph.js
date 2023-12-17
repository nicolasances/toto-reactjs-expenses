import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import moment from 'moment';

import TotoBarChart from '../../chart/TotoBarChart';
import ExpensesAPI from '../../services/ExpensesAPI';

import './PastMonthsGraph.css'
import { withRouter } from 'react-router';

const cookies = new Cookies();

class PastMonthsGraph extends Component {

  constructor(props) {
    super(props);

    this.maxMonths = props.months ? props.months : 10;

    this.state = {
      loaded: false,
      modalVisible: false,
      maxMonths: this.maxMonths,
      user: cookies.get('user'),
    }

    // Binding
    this.load = this.load.bind(this);
    this.prepareData = this.prepareData.bind(this);
    this.prepareExpensesData = this.prepareExpensesData.bind(this);
    this.prepareIncomesData = this.prepareIncomesData.bind(this);
    this.loadExpenses = this.loadExpenses.bind(this);
    this.loadIncomes = this.loadIncomes.bind(this);
    this.xAxisTransform = this.xAxisTransform.bind(this);
    this.onBarClick = this.onBarClick.bind(this);

  }

  /**
   * When the component mount
   */
  componentDidMount() {

    // Load
    this.load();

  }

  /**
   * Load everything
   */
  async load() {

    this.setState({ loaded: false });

    // Load the settings
    const settings = await new ExpensesAPI().getSettings(this.state.user.email)

    // Set state
    this.setState({ settings: settings });

    // Extract the target currency
    const targetCurrency = (settings && settings.currency) ? settings.currency : "EUR"

    // Load the expenses
    const expensesMonths = await this.loadExpenses(targetCurrency)

    // Load the incomes
    const incomesMonths = await this.loadIncomes(targetCurrency)

    // Update the state and Prepare the data
    this.setState({ months: null }, () => {

      this.setState({ loaded: true, months: expensesMonths, incomeMonths: incomesMonths }, this.prepareData);

    })


  }

  /**
   * Loads the last x months of spending (just the totals)
   */
  async loadExpenses(targetCurrency) {

    // Define how many days in the past
    let yearMonthFrom = moment().startOf('month').subtract(this.state.maxMonths, 'months').format('YYYYMM');

    const data = await new ExpensesAPI().getExpensesPerMonth(yearMonthFrom, targetCurrency)

    return data && data.months ? data.months.months : []

  }

  /**
   * Loads the last x months of incomes (just the totals)
   */
  async loadIncomes(targetCurrency) {

    // Define how many days in the past
    let yearMonthFrom = moment().startOf('month').subtract(this.state.maxMonths, 'months').format('YYYYMM');

    // Get the data
    const data = await new ExpensesAPI().getIncomesPerMonth(yearMonthFrom, targetCurrency)

    return data && data.months ? data.months.months : []

  }

  /**
   * Create the x axis labels
   * Just show some of the months, since we expect to have many of those
   */
  xAxisTransform(value) {

    if (this.state.months == null) return;
    if (this.state.months[value] == null) return;

    let month = this.state.months[value];
    let parsedMonth = moment(month.yearMonth + '01', 'YYYYMMDD');

    return parsedMonth.format('MMM');

  }

  /**
   * Prepares the data for the graph to display
   */
  prepareData() {

    // Update the list of months to use as index
    const months = this.state.months.map((item) => { return item.yearMonth })

    // Prepare the expenses graph data
    this.prepareExpensesData(months);

    // Prepare the incomes graph data
    this.prepareIncomesData(months);

  }

  /**
   * Prepares the data for the graph to display
   */
  prepareExpensesData(months) {

    let preparedData = [];

    if (!this.state.months) return;

    for (var i = 0; i < months.length; i++) {

      let month = this.state.months[i];

      preparedData.push({
        x: i,
        y: month.amount
      })
    }

    this.setState({ preparedData: null, yLines: null }, () => {
      this.setState({ preparedData: preparedData });
    })

  }

  /**
   * Prepares the data for the income graph to display
   */
  prepareIncomesData(months) {

    let preparedData = [];

    if (!this.state.months || !this.state.incomeMonths) return;

    if (this.state.incomeMonths.length == 0) return;

    // Function used to find an income month with the given yearmonth
    const findCorrespondingIncomeMonth = (incomeMonths, yearMonth) => {

      for (let incomeMonth of incomeMonths) {

        if (incomeMonth.yearMonth == yearMonth) return incomeMonth

      }

      return null;

    }

    let i = 0;
    for (let month of months) {

      // Find the income month for that specific month
      const incomeMonth = findCorrespondingIncomeMonth(this.state.incomeMonths, month)

      // If it doesn't exist AND IT'S NOT THE LAST MONTH, add a 0
      if (!incomeMonth && i < months.length - 1) preparedData.push({ x: i++, y: 0 })
      // Otherwise, add the month's total income
      else if (incomeMonth != null) preparedData.push({
        x: i++,
        y: incomeMonth.amount
      })

    }

    this.setState({ preparedIncomeData: null, yIncomeLines: null }, () => {
      this.setState({ preparedIncomeData: preparedData });
    })

  }

  /**
   * Defines the label for the value
   */
  valueLabel(value) {

    if (value == null) return '';

    return Math.round(value, 0).toLocaleString('it');
  }

  /**
   * Reacts to a bar click
   * @param {object} data the data object (as created in the prepareData() function)
   */
  onBarClick(data) {
    // Navigate to the expenses of that month
    this.props.history.push('/expenses?yearMonth=' + this.state.months[data.x].yearMonth)
  }

  render() {
    return (
      <div className='graph-past-months-expenses'>
        <TotoBarChart
          data={this.state.preparedData}
          lineData={this.state.preparedIncomeData}
          xAxisTransform={this.xAxisTransform}
          valueLabelTransform={this.valueLabel}
          maxHeight={this.props.maxHeight}
          margins={{ horizontal: 24, vertical: 12 }}
          onBarClick={this.onBarClick}
        />
      </div>
    )
  }
}

export default withRouter(PastMonthsGraph);
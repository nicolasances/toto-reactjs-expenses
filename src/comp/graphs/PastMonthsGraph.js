import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import moment from 'moment';

import TotoBarChart from '../../chart/TotoBarChart';
import ExpensesAPI from '../../services/ExpensesAPI';

import './PastMonthsGraph.css'

const cookies = new Cookies();

export default class PastMonthsGraph extends Component {

  constructor(props) {
    super(props);

    this.maxMonths = props.months ? props.months : 10;
    this.limitMonthsToShowValue = 10;

    this.state = {
      loaded: false,
      modalVisible: false,
      maxMonths: this.maxMonths,
      user: cookies.get('user'),
    }

    // Binding
    this.load = this.load.bind(this);
    this.prepareData = this.prepareData.bind(this);
    // this.valueLabel = this.valueLabel.bind(this);
    this.loadExpenses = this.loadExpenses.bind(this);
    this.xAxisTransform = this.xAxisTransform.bind(this);
    this.onExpenseCreated = this.onExpenseCreated.bind(this);

  }

  /**
   * When the component mount
   */
  componentDidMount() {

    // Load
    this.load();

  }

  /**
   * When an expense is created, reload
   */
  onExpenseCreated(event) {

    this.loadExpenses();

  }

  /**
   * Load everything
   */
  load() {

    new ExpensesAPI().getSettings(this.state.user.email).then((data) => {
      // Set state
      this.setState({settings: data}, this.loadExpenses);
    })

  }

  /**
   * Loads the last x days of spending (just the totals)
   */
  loadExpenses() {

    // Define how many days in the past
    let maxMonths = this.state.maxMonths;
    let yearMonthFrom = moment().startOf('month').subtract(maxMonths, 'months').format('YYYYMM');
    let targetCurrency = this.state.settings ? this.state.settings.currency : null;

    new ExpensesAPI().getExpensesPerMonth(this.state.user.email, yearMonthFrom, targetCurrency).then((data) => {

      if (data == null || data.months == null) {this.setState({loaded: true}); return;}

      this.setState({months: null}, () => {
        this.setState({loaded: true, months: data.months}, this.prepareData);
      })

    });

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

    return parsedMonth.format('MMM YY');

  }

  /**
   * Prepares the data for the graph to display
   */
  prepareData() {

    let preparedData = [];

    if (!this.state.months) return;

    for (var i = 0; i < this.state.months.length; i++) {

      let month = this.state.months[i];

      preparedData.push({
        x: i,
        y: month.amount
      })
    }

    this.setState({preparedData: null, yLines: null}, () => {
      this.setState({preparedData: preparedData});
    })

  }

  /**
   * Defines the label for the value
   */
  valueLabel(value) {

    if (value == null) return '';

    return Math.round(value,0).toLocaleString('it');
  }

  render() {
    return (
      <div className='graph-past-months-expenses'>
        <TotoBarChart
          data={this.state.preparedData}
          xAxisTransform={this.xAxisTransform}
          valueLabelTransform={this.valueLabel}
          maxHeight={this.props.maxHeight}
          margins={{horizontal: 24, vertical: 12}}
          />
      </div>
    )
  }
}
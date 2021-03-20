import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import TotoIconButton from '../comp/TotoIconButton';
import { ReactComponent as TickSVG } from '../img/tick.svg';
import { ReactComponent as CloseSVG } from '../img/close.svg';
import './NewExpenseScreen.css';
import ExpensesAPI from '../services/ExpensesAPI';
import Cookies from 'universal-cookie';
import DateSelector from '../comp/DateSelector';
import AmountSelector from '../comp/AmountSelector';
import CurrencySwitcher from '../comp/CurrencySwitcher';
import TextInput from '../comp/TextInput';
import CategoryPicker from '../comp/cateogrypicker/CategoryPicker';
import {bus as eventBus} from '../event/TotoEventBus';
import * as config from '../Config';

const cookies = new Cookies();

class NewExpenseScreen extends Component {

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);

    this.user = cookies.get('user');

    this.state = {
      currency: 'DKK',
      date: moment().format('YYYYMMDD'),
      category: 'VARIE',
    }

    // Bindings
    this.setDate = this.setDate.bind(this);
    this.setCurrency = this.setCurrency.bind(this);
    this.setAmount = this.setAmount.bind(this);
    this.setCategory = this.setCategory.bind(this);
    this.saveExpense = this.saveExpense.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.predictCategory = this.predictCategory.bind(this);
    this.cancel = this.cancel.bind(this);

  }

  /**
   * When the component mount
   */
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  cancel() {
    this.props.history.goBack();
  }

  /**
   * Save th expense
   */
  saveExpense() {

    let expense = {
      amount: this.state.amount,
      date: this.state.date,
      category: this.state.category,
      description: this.state.description,
      yearMonth: this.state.date.substring(0, 6),
      consolidated: false,
      currency: this.state.currency,
      user: this.user.email
    }

    new ExpensesAPI().postExpense(expense).then((data) => {

      expense.id = data.id;

      // Publish an event
      eventBus.publishEvent({name: config.EVENTS.expenseCreated, context: {expense: expense}});

      // Return back
      this.props.history.goBack();

    })

  }

  /**
   * Sets the date of the expense
   * The date passed is a Date javascript object
   */
  setDate(date) {

    this.setState({ date: moment(date).format('YYYYMMDD') });

  }

  /**
   * Sets the currency
   */
  setCurrency(c) {

    this.setState({ currency: c });
  }

  /**
   * Sets the amount
   */
  setAmount(a) {

    this.setState({ amount: a });
  }

  /**
   * Sets the category
   */
  setCategory(c) {

    this.setState({ category: c });
  }

  predictCategory() {

    // // Guess the category
    // new ERCBOD().predictCategory(this.state.description, user.userInfo.email).then((data) => {

    //   this.setState({category: data.category});

    // })

  }

  /**
   * Sets the descripton
   */
  setDescription(text) {

    // We're setting a timeout after which, if the user hasn't typed any other letter,  the category prediction will start
    // Clear the timeout: the user has typed another letter!
    // clearTimeout(this.descriptionChangeTimer)

    // Change the state
    this.setState({ description: text })

    // Start the timeout
    // this.descriptionChangeTimer = setTimeout(this.predictCategory, 400)

  }


  /**
   * Renders the home screen
   */
  render() {

    // Show save button only when the data is there!
    let saveButton;
    if (this.state.amount != null && this.state.description != null) saveButton = (
      <TotoIconButton
        image={<TickSVG className="icon" />}
        onPress={this.saveExpense}
      />
    )

    return (
      <div className="screen new-expense">

        <div className="header">New payment</div>

        <div className="line1">
          <div className="dateContainer">
            <DateSelector initialValue={moment()} onDateChange={this.setDate} />
          </div>
          <div className="amountContainer">
            <AmountSelector initialValue={0} onAmountChange={this.setAmount} />
          </div>
          <div className="currencyContainer">
            <CurrencySwitcher default="EUR" onCurrencyChange={this.setCurrency} />
          </div>
        </div>

        <div className="line2">
          <TextInput placeholder="What was this payment for?"
            align="center"
            onTextChange={this.setDescription}
          />
        </div>

        <div className="line3">
          <CategoryPicker onCategoryChange={this.setCategory} />
        </div>

        <div style={{ flex: 1 }}>
        </div>

        <div className="line4">
          <div style={{ marginLeft: 6, marginRight: 6 }}>{saveButton}</div>
          <div style={{ marginLeft: 6, marginRight: 6 }}><TotoIconButton image={(<CloseSVG className="icon" />)} onPress={this.cancel} /></div>
        </div>

      </div>
    )
  }
}

export default withRouter(NewExpenseScreen);
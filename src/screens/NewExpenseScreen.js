import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import TotoIconButton from '../comp/TotoIconButton';
import { ReactComponent as TickSVG } from '../img/tick.svg';
import { ReactComponent as CloseSVG } from '../img/close.svg';
import { ReactComponent as IncomeSVG } from '../img/income.svg';
import { ReactComponent as PaymentSVG } from '../img/payment.svg';
import './NewExpenseScreen.css';
import ExpensesAPI from '../services/ExpensesAPI';
import Cookies from 'universal-cookie';
import DateSelector from '../comp/DateSelector';
import AmountSelector from '../comp/AmountSelector';
import CurrencySwitcher from '../comp/CurrencySwitcher';
import TextInput from '../comp/TextInput';
import CategoryPicker from '../comp/cateogrypicker/CategoryPicker';
import { bus as eventBus } from '../event/TotoEventBus';
import * as config from '../Config';
import ExpCatAPI from '../services/ExpCatAPI';
import categoriesMap from '../services/CategoriesMap';
import Checkbox from '../comp/Checkbox';
import TitleBar from '../comp/TitleBar';

const cookies = new Cookies();

class NewExpenseScreen extends Component {

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);

    this.user = cookies.get('user');

    // Check if there's a selected month
    let date = moment().format('YYYYMMDD')
    if (this.props.location && this.props.location.state && this.props.location.state.selectedMonth) date = this.props.location.state.selectedMonth + "01"

    this.state = {
      currency: 'DKK',
      date: date,
      category: 'VARIE',
      payment: true       // If we set it to payment = false, it's an income
    }

    // Bindings
    this.setDate = this.setDate.bind(this);
    this.setCurrency = this.setCurrency.bind(this);
    this.setAmount = this.setAmount.bind(this);
    this.setCategory = this.setCategory.bind(this);
    this.saveTransaction = this.saveTransaction.bind(this);
    this.saveExpense = this.saveExpense.bind(this);
    this.saveIncome = this.saveIncome.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.predictCategory = this.predictCategory.bind(this);
    this.cancel = this.cancel.bind(this);
    this.onToggleMonthly = this.onToggleMonthly.bind(this);
    this.toggleTransactionType = this.toggleTransactionType.bind(this);

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
   * Save an expense
   */
  async saveExpense() {

    let expense = {
      amount: this.state.amount,
      date: this.state.date,
      category: this.state.category,
      description: this.state.description,
      yearMonth: this.state.date.substring(0, 6),
      consolidated: false,
      currency: this.state.currency,
      user: this.user.email,
      monthly: this.state.monthly
    }

    const data = await new ExpensesAPI().postExpense(expense);

    expense.id = data.id;

    // Publish an event
    eventBus.publishEvent({ name: config.EVENTS.expenseCreated, context: { expense: expense } });

  }

  /**
   * Save an income
   */
  async saveIncome() {

    let income = {
      amount: parseFloat(this.state.amount),
      date: this.state.date,
      description: this.state.description,
      currency: this.state.currency,
    }

    await new ExpensesAPI().postIncome(income);

  }

  /**
   * Save the transaction
   */
  async saveTransaction() {

    // If it's a payment, save it as expense
    if (this.state.payment == true) await this.saveExpense()
    // Otherwise save it as an income
    else await this.saveIncome();

    // Return back
    this.props.history.goBack();

  }

  toggleTransactionType() {

    this.setState((prev) => {
      return {
        payment: !prev.payment, 
        category: "VARIE"
      }
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
   * Toggles the recurring monthly setting
   */
  onToggleMonthly() {

    this.setState((prevState) => { return { monthly: !prevState.monthly } })

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

  async predictCategory() {

    if (this.state.income === true) return;

    const prediction = await new ExpCatAPI().predictCategory(this.state.description, this.user.email);

    if (prediction && prediction.category && categoriesMap.get(prediction.category)) {
      this.setState({ category: prediction.category })
    }

  }

  /**
   * Sets the descripton
   */
  setDescription(text) {

    // We're setting a timeout after which, if the user hasn't typed any other letter,  the category prediction will start
    // Clear the timeout: the user has typed another letter!
    clearTimeout(this.descriptionChangeTimer)

    // Change the state
    this.setState({ description: text })

    // Start the timeout
    this.descriptionChangeTimer = setTimeout(this.predictCategory, 400)

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
        onPress={this.saveTransaction}
      />
    )

    return (
      <div className="screen new-expense">

        <TitleBar title={this.state.payment === true ? "New payment" : "New income"}
          rightButton={
            <TotoIconButton image={this.state.payment == true ? <IncomeSVG /> : <PaymentSVG />} borders={false} size="ms" onPress={this.toggleTransactionType} />
          } />

        <div className="line1">
          <div className="dateContainer">
            <DateSelector initialValue={moment(this.state.date, "YYYYMMDD")} onDateChange={this.setDate} />
          </div>
          <div className="amountContainer">
            <AmountSelector initialValue={0} onAmountChange={this.setAmount} />
          </div>
          <div className="currencyContainer">
            <CurrencySwitcher default="EUR" onCurrencyChange={this.setCurrency} />
          </div>
        </div>

        <div className="line2">
          <TextInput placeholder={this.state.payment == true ? "What was this payment for?" : "What was this income for?"}
            align="center"
            onTextChange={this.setDescription}
          />
        </div>

        <div className="line3">
          <CategoryPicker category={this.state.category} income={this.state.payment == false} onCategoryChange={this.setCategory} />
        </div>

        {this.state.payment == true &&
          <div className="line4">
            <Checkbox onToggleFlag={this.onToggleMonthly} flag={this.state.monthly} />
          </div>
        }

        <div style={{ flex: 1 }}>
        </div>

        <div className="line5">
          {saveButton && <div style={{ marginLeft: 6, marginRight: 6 }}>{saveButton}</div>}
          <div style={{ marginLeft: 6, marginRight: 6 }}><TotoIconButton image={(<CloseSVG className="icon" />)} onPress={this.cancel} /></div>
        </div>

      </div>
    )
  }
}

export default withRouter(NewExpenseScreen);
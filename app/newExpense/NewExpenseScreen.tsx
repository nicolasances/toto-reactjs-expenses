'use client'

import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useRouter, useSearchParams } from 'next/navigation';

import TotoIconButton from '@/components/TotoIconButton';
import DateSelector from '@/components/DateSelector';
import AmountSelector from '@/components/AmountSelector';
import CurrencySwitcher from '@/components/CurrencySwitcher';
import TextInput from '@/components/TextInput';
import CategoryPicker from '@/components/categorypicker/CategoryPicker';
import Checkbox from '@/components/Checkbox';
import TitleBar from '@/components/TitleBar';
import { ExpensesAPI } from '@/api/ExpensesAPI';
import { ExpCatAPI } from '@/api/ExpCatAPI';
import { ExpenseInput, IncomeInput } from '@/model/expense';
import categoriesMap from '@/utils/CategoriesMap';
import { getCurrentUser } from '@/utils/AuthUtil';
import { bus as eventBus, EVENTS } from '@/utils/TotoEventBus';

import './NewExpenseScreen.css';

/**
 * Screen to create a new expense (payment) or income.
 * The date defaults to the first day of "?yearMonth=YYYYMM" when present, otherwise today.
 */
export default function NewExpenseScreen() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const user = getCurrentUser();

  const [date, setDate] = useState<string>(() => {

    const yearMonth = searchParams.get('yearMonth');

    return yearMonth ? yearMonth + '01' : moment().format('YYYYMMDD');
  });                                                                       // YYYYMMDD
  const [currency, setCurrency] = useState<string>('DKK');                  // ISO currency code
  const [category, setCategory] = useState<string>('VARIE');                // Category code
  const [payment, setPayment] = useState<boolean>(true);                    // If false, it's an income
  const [amount, setAmount] = useState<string | undefined>();               // Amount typed by the user (a string, as emitted by AmountSelector)
  const [description, setDescription] = useState<string | undefined>();     // Description typed by the user
  const [monthly, setMonthly] = useState<boolean | undefined>();            // Recurring monthly (payments only)

  const descriptionChangeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);   // Timer to start the category prediction
  const descriptionRef = useRef<string | undefined>(undefined);                                  // Latest description, for the prediction timer
  const paymentRef = useRef<boolean>(true);                                                      // Latest payment flag, for the prediction timer

  useEffect(() => { paymentRef.current = payment }, [payment]);

  // Clear a pending prediction on unmount
  useEffect(() => () => clearTimeout(descriptionChangeTimer.current), []);

  /**
   * Saves an expense
   */
  const saveExpense = async () => {

    const expense: ExpenseInput = {
      amount: amount as unknown as number,   // sent as emitted by AmountSelector (legacy behaviour)
      date: date,
      category: category,
      description: description as string,
      yearMonth: date.substring(0, 6),
      consolidated: false,
      currency: currency,
      user: user!.email,
      monthly: monthly
    }

    const data = await new ExpensesAPI().postExpense(expense);

    expense.id = data.id;

    // Publish an event
    eventBus.publishEvent({ name: EVENTS.expenseCreated, context: { expense: expense } });
  }

  /**
   * Saves an income
   */
  const saveIncome = async () => {

    const income: IncomeInput = {
      amount: parseFloat(String(amount)),
      date: date,
      description: description as string,
      currency: currency,
      category: category
    }

    await new ExpensesAPI().postIncome(income);
  }

  /**
   * Saves the transaction (expense or income) and goes back
   */
  const saveTransaction = async () => {

    // If it's a payment, save it as expense, otherwise as an income
    if (payment === true) await saveExpense()
    else await saveIncome();

    // Return back
    router.back();
  }

  /**
   * Switches between payment and income, resetting the category
   */
  const toggleTransactionType = () => {

    setPayment(!payment);
    setCategory('VARIE');
  }

  /**
   * Predicts the category from the description (payments only)
   */
  const predictCategory = async () => {

    if (paymentRef.current === false) return;

    const prediction = await new ExpCatAPI().predictCategory(descriptionRef.current as string, user!.email);

    if (prediction && prediction.category && categoriesMap.get(prediction.category)) {
      setCategory(prediction.category);
    }
  }

  /**
   * Sets the description and (re)starts the timer after which the category prediction starts
   *
   * @param {string} text the description
   */
  const onDescriptionChange = (text: string) => {

    // The user typed another letter: clear the timeout
    clearTimeout(descriptionChangeTimer.current);

    descriptionRef.current = text;
    setDescription(text);

    // Start the timeout
    descriptionChangeTimer.current = setTimeout(predictCategory, 400);
  }

  // Show save button only when the data is there!
  let saveButton;
  if (amount != null && description != null) saveButton = (
    <TotoIconButton
      image="/images/tick.svg"
      onPress={saveTransaction}
    />
  )

  return (
    <div className="screen new-expense">

      <TitleBar title={payment === true ? "New payment" : "New income"}
        rightButton={
          <TotoIconButton image={payment === true ? "/images/income.svg" : "/images/payment.svg"} borders={false} size="ms" onPress={toggleTransactionType} />
        } />

      <div className="line1">
        <div className="dateContainer">
          <DateSelector initialValue={moment(date, "YYYYMMDD")} onDateChange={(d: moment.Moment) => setDate(moment(d).format('YYYYMMDD'))} />
        </div>
        <div className="amountContainer">
          <AmountSelector initialValue={0} onAmountChange={(a: string) => setAmount(a)} />
        </div>
        <div className="currencyContainer">
          <CurrencySwitcher default="EUR" onCurrencyChange={(c: string) => setCurrency(c)} />
        </div>
      </div>

      <div className="line2">
        <TextInput placeholder={payment === true ? "What was this payment for?" : "What was this income for?"}
          align="center"
          onTextChange={onDescriptionChange}
        />
      </div>

      <div className="line3">
        <CategoryPicker category={category} income={payment === false} onCategoryChange={(c: string) => setCategory(c)} />
      </div>

      {payment === true &&
        <div className="line4">
          <Checkbox onToggleFlag={() => setMonthly(!monthly)} flag={monthly} />
        </div>
      }

      <div style={{ flex: 1 }}>
      </div>

      <div className="line5">
        {saveButton && <div style={{ marginLeft: 6, marginRight: 6 }}>{saveButton}</div>}
        <div style={{ marginLeft: 6, marginRight: 6 }}><TotoIconButton image="/images/close.svg" onPress={() => router.back()} /></div>
      </div>

    </div>
  )
}

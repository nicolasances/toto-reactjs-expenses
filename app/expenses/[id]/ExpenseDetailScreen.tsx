'use client'

import { useEffect, useState } from 'react';
import moment from 'moment';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import TotoIconButton from '@/components/TotoIconButton';
import DateSelector from '@/components/DateSelector';
import AmountSelector from '@/components/AmountSelector';
import CurrencySwitcher from '@/components/CurrencySwitcher';
import TextInput from '@/components/TextInput';
import CategoryPicker from '@/components/categorypicker/CategoryPicker';
import TitleBar from '@/components/TitleBar';
import Checkbox from '@/components/Checkbox';
import { ExpensesAPI } from '@/api/ExpensesAPI';
import { Expense, Income } from '@/model/expense';
import { isIncomeParam } from '@/utils/navigation';

import './ExpenseDetailScreen.css';

/**
 * Detail of an expense or an income: loads the transaction by id (income if "?income=true") and lets the user edit or delete it.
 */
export default function ExpenseDetailScreen() {

    const router = useRouter();
    const params = useParams<{ id: string }>();
    const searchParams = useSearchParams();

    const id = params.id;
    const isIncome = isIncomeParam(searchParams.get('income'));

    const [transaction, setTransaction] = useState<Expense | Income | null>(null);     // The loaded transaction, edited in place
    const [monthly, setMonthly] = useState<boolean | undefined>(false);                 // Value of "monthly" at load time (as in the legacy screen)

    /**
     * Loads the income or the expense from the REST API
     */
    useEffect(() => {

        const load = async () => {

            if (isIncome) {
                const income = await new ExpensesAPI().getIncome(id);
                setMonthly(false);
                setTransaction(income);
            }
            else {
                const expense = await new ExpensesAPI().getExpense(id);
                setMonthly(expense.monthly);
                setTransaction(expense);
            }
        }

        load();

    }, [id, isIncome]);

    /**
     * Updates fields of the transaction
     *
     * @param {Partial<Expense>} changes the fields to change
     */
    const update = (changes: Partial<Expense>) => {

        setTransaction((prev) => prev ? { ...prev, ...changes } as Expense | Income : prev);
    }

    /**
     * Saves the updated transaction
     */
    const saveTransaction = async () => {

        if (!transaction) return;

        // Update the transaction
        if (isIncome) await new ExpensesAPI().putIncome(transaction.id, transaction)
        else await new ExpensesAPI().putExpense(transaction.id, transaction)

        // Go back
        router.back();
    }

    /**
     * Toggles the recurring monthly setting
     */
    const onToggleMonthly = () => {

        update({ monthly: !monthly });
    }

    /**
     * Deletes the current expense
     */
    const deleteExpense = async () => {

        if (!transaction) return;

        await new ExpensesAPI().deleteExpense(transaction.id);

        router.back();
    }

    if (!transaction) return <div className="screen expense-detail-screen"></div>

    return (
        <div className="screen expense-detail-screen">
            <TitleBar title="Transaction Detail" back={true} />

            <div className="line1">
                <div className="dateContainer">
                    <DateSelector initialValueLoader={async () => moment(transaction.date, 'YYYYMMDD')}
                        onDateChange={(date: moment.Moment) => update({ date: date.format('YYYYMMDD') })}
                    />
                </div>
                <div className="amountContainer">
                    <AmountSelector initialValueLoader={async () => transaction.amount}
                        onAmountChange={(amt: string) => update({ amount: amt as unknown as number })}
                    />
                </div>
                <div className="currencyContainer">
                    <CurrencySwitcher initialValueLoader={async () => transaction.currency}
                        onCurrencyChange={(c: string) => update({ currency: c })}
                        loadFromSettings={false}
                    />
                </div>
            </div>

            <div className="line2">
                <TextInput placeholder={isIncome ? "What was this income for?" : "What was this payment for?"}
                    initialValueLoader={async () => transaction.description}
                    align="center"
                    onTextChange={(t: string) => update({ description: t })}
                />
            </div>

            <div className="line3">
                <CategoryPicker initialValueLoader={async () => transaction.category}
                    category={transaction.category ? transaction.category : "VARIE"}
                    income={isIncome}
                    onCategoryChange={(cat: string) => update({ category: cat })}
                />
            </div>

            {!isIncome &&
                <div className="line4">
                    <Checkbox onToggleFlag={onToggleMonthly} flag={'monthly' in transaction ? transaction.monthly : undefined} />
                </div>
            }

            <div style={{ flex: 1 }}>
            </div>

            <div className="line5">
                <div style={{ marginLeft: 6, marginRight: 6 }}><TotoIconButton image="/images/tick.svg" onPress={saveTransaction} /></div>
                {!isIncome && <div style={{ marginLeft: 6, marginRight: 6 }}><TotoIconButton image="/images/trash.svg" onPress={deleteExpense} /></div>}
            </div>
        </div>
    )
}

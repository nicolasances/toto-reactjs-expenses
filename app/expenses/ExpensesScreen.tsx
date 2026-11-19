'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'universal-cookie';
import moment, { Moment } from 'moment-timezone';
import Popup from 'reactjs-popup';

import TitleBar from '@/components/TitleBar';
import TotoList, { TotoListRowData } from '@/components/TotoList';
import YearMonthTile from '@/components/picker/YearMonthTile';
import ScrollPicker from '@/components/picker/ScrollPicker';
import CategorySelectionPopup from '@/components/categorypicker/CategorySelectionPopup';
import { ExpensesAPI } from '@/api/ExpensesAPI';
import { Transaction } from '@/model/expense';
import categoriesMap from '@/utils/CategoriesMap';
import { incomeCategoriesMap } from '@/utils/IncomeCategoriesMap';
import { getCurrentUser } from '@/utils/AuthUtil';
import { resolveSelectedYearMonth } from '@/utils/navigation';

import './ExpensesScreen.css';

const cookies = new Cookies();

/**
 * Expenses list: the expenses and incomes of the selected month.
 */
export default function ExpensesScreen() {

    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedMonth, setSelectedMonth] = useState<Moment>(() => {

        // The cookie holds a YYYYMMDD date (see updateLastSelectedMonth): resolveSelectedYearMonth wants YYYYMM
        const cookieValue = cookies.get('expensesListYearMonth');

        const yearMonth = resolveSelectedYearMonth({
            cookieYearMonth: cookieValue ? String(cookieValue).substring(0, 6) : null,
            queryYearMonth: searchParams.get('yearMonth'),
            today: new Date()
        });

        return moment(yearMonth + '01', 'YYYYMMDD');
    });
    const [transactions, setTransactions] = useState<Transaction[]>();      // The transactions of the selected month
    const [categoryPopupOpen, setCategoryPopupOpen] = useState(false);      // True when the category popup is open
    const selectedTransaction = useRef<Transaction | null>(null);           // Transaction whose category is being changed

    /**
     * Loads all transactions (expenses and incomes) of the currently selected year month
     */
    const loadTransactions = useCallback(async () => {

        const yearMonth = selectedMonth.format('YYYYMM');

        const expensesData = await new ExpensesAPI().getExpenses(getCurrentUser()!.email, yearMonth);
        const incomesData = await new ExpensesAPI().getIncomes(yearMonth);

        // Set the incomes as "incomes"
        const incomes: Transaction[] = incomesData.incomes.map((income) => ({ ...income, income: true as const }));

        // Merge the two lists and sort them
        const merged: Transaction[] = [...expensesData.expenses, ...incomes];
        merged.sort((a, b) => { return Number(a.date < b.date) });

        setTransactions(merged);

    }, [selectedMonth]);

    useEffect(() => { loadTransactions() }, [loadTransactions]);

    /**
     * Updates the cookie to store the selected year month
     *
     * @param {Moment} yearMonth the selected year month
     */
    const updateLastSelectedMonth = (yearMonth: Moment) => {

        cookies.set('expensesListYearMonth', yearMonth.format('YYYYMMDD'), {
            expires: moment().add(5, 'minutes').toDate()
        })
    }

    /**
     * Clear the expensesListYearMonth cookie
     * This is needed to make sure that when coming from the dashboard, cookies used when navigating months are not overriding everything.
     * Entering from the HomeScreen always has to set you on the current month
     */
    const clearCookies = () => {
        cookies.remove('expensesListYearMonth')
    }

    /**
     * Switches to a different year month
     *
     * @param {Moment} newMonth the new month to use
     */
    const onMonthChange = (newMonth: Moment) => {
        setSelectedMonth(newMonth);
        updateLastSelectedMonth(newMonth);
    }

    /**
     * Opens the category popup for the given transaction
     *
     * @param {Transaction} transaction the transaction whose avatar (category) was clicked
     */
    const changeExpenseCategory = (transaction: Transaction) => {

        // Save the selected transaction for onCategoryChange()
        selectedTransaction.current = transaction;
        setCategoryPopupOpen(true);
    }

    /**
     * Reacts to the change of a transaction's category
     *
     * @param {string} newCategory the new category set
     */
    const onCategoryChange = (newCategory: string) => {

        setCategoryPopupOpen(false);

        const transaction = selectedTransaction.current;

        if (!transaction) return;

        transaction.category = newCategory;

        // Update the income or the expense, based on the type
        if (transaction.income === true) {
            new ExpensesAPI().putIncome(transaction.id, transaction).then(() => { selectedTransaction.current = null; });
        }
        else {
            new ExpensesAPI().putExpense(transaction.id, transaction).then(() => { selectedTransaction.current = null; });
        }
    }

    /**
     * Reacts to the reconcile button click on a transaction
     *
     * @param {Transaction} transaction the transaction whose reconcile highlight has been pressed
     */
    const onReconcilePress = (transaction: Transaction) => {

        new ExpensesAPI().consolidateExpense(transaction.id).then(loadTransactions);
    }

    /**
     * Opens the detail of a transaction
     *
     * @param {Transaction} transaction the selected transaction
     */
    const selectExpense = (transaction: Transaction) => {

        router.push('/expenses/' + transaction.id + (transaction.income === true ? '?income=true' : ''));
    }

    /**
     * Extracts the data to show in the list for a transaction
     *
     * @param {Transaction} item the transaction
     */
    const dataExtractor = (item: Transaction): TotoListRowData<Transaction> => {

        let currency = item.currency;
        if (item.currency === 'EUR') currency = '€';
        else if (item.currency === 'DKK') currency = 'kr.'

        // Highlights
        const highlights: { image: string, onPress?: (item: Transaction) => void }[] = [];
        // Highlight - Consolidation icon
        if (!item.consolidated) highlights.push({
            image: '/images/reconcile.svg',
            onPress: onReconcilePress
        })
        // Highlight - Imported from bank statement
        if ('additionalData' in item && item.additionalData && item.additionalData.source === 'bank-statement') highlights.push({
            image: '/images/bank.svg'
        })

        return {
            avatar: {
                type: 'image' as const,
                value: item.income === true ? incomeCategoriesMap.get(item.category)!.icon : categoriesMap.get(item.category)!.icon,
                size: 'l' as const
            },
            date: { date: item.date },
            title: item.description,
            monthly: 'monthly' in item ? item.monthly : undefined,
            amount: (item.income ? '+ ' : '') + currency + ' ' + item.amount.toLocaleString('it'),
            highlights: highlights,
            style: item.income ? 'income' : 'payment'
        }
    }

    return (
        <div className="screen expenses-screen">
            <TitleBar title="Payments list" back={true} onBack={clearCookies} newExpenseEnabled={true} selectedMonth={selectedMonth.format('YYYYMM')} />
            <div className="month-navigator-container">
                <ScrollPicker
                    tile={<YearMonthTile />}
                    defaultValue={selectedMonth}
                    previousValue={(currentValue: Moment) => currentValue.clone().subtract(1, 'months')}
                    nextValue={(currentValue: Moment) => currentValue.clone().add(1, 'months')}
                    onSelectionChange={onMonthChange}
                />
            </div>
            <div className="expenses-list-widget">
                <TotoList
                    data={transactions}
                    dataExtractor={dataExtractor}
                    onPress={selectExpense}
                    onAvatarClick={changeExpenseCategory}
                />
            </div>

            <Popup
                on='click'
                open={categoryPopupOpen}
                contentStyle={{ padding: 0, backgroundColor: '#00acc1', border: 'none' }}
                arrow={false}
                closeOnEscape={false}
            >

                <CategorySelectionPopup
                    onCategoryChange={onCategoryChange}
                    income={selectedTransaction.current ? selectedTransaction.current.income === true : false}
                    onPressClose={() => { setCategoryPopupOpen(false) }}
                />

            </Popup>
        </div>
    )
}

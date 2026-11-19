'use client'

import { useCallback, useEffect, useState } from 'react';
import moment, { Moment } from 'moment-timezone';
import { useRouter } from 'next/navigation';

import { ExpensesAPI } from '@/api/ExpensesAPI';
import TitleBar from '@/components/TitleBar';
import ScrollPicker from '@/components/picker/ScrollPicker';
import YearMonthTile from '@/components/picker/YearMonthTile';
import TotoList, { TotoListRowData } from '@/components/TotoList';
import TotoIconButton from '@/components/TotoIconButton';
import categoriesMap from '@/utils/CategoriesMap';
import { getCurrentUser } from '@/utils/AuthUtil';
import { Expense } from '@/model/expense';

import './TagExpensesPicker.css';

/**
 * Properties of the ExpensesPicker
 */
export interface ExpensesPickerProps {
    tag?: string;                       // Name of the tag (not used for rendering)
    tagId: string;                      // Id of the tag to attach expenses to
    onDelete?: (tagId: string) => void; // Called when the user cancels (deletes the tag), unless noDelete is set
    noDelete?: boolean;                 // If true, shows a back button instead of the delete button
}

/**
 * Picker for the expenses to add to the Tag
 */
export default function ExpensesPicker(props: ExpensesPickerProps) {

    const router = useRouter();

    const [selectedMonth, setSelectedMonth] = useState<Moment>(moment());   // The month whose expenses are listed
    const [expenses, setExpenses] = useState<Expense[]>();                  // The expenses of the month

    /**
     * Loading of Expenses
     */
    const loadExpenses = useCallback(() => {
        new ExpensesAPI().getExpenses(getCurrentUser()!.email, selectedMonth.format('YYYYMM')).then((data) => {
            setExpenses(data.expenses)
        })
    }, [selectedMonth]);

    /**
     * Extractor
     *
     * @param {Expense} item the expense
     */
    const dataExtractor = (item: Expense): TotoListRowData<Expense> => {

        let currency = item.currency;
        if (item.currency === 'EUR') currency = '€';
        else if (item.currency === 'DKK') currency = 'kr.'

        const avatarImage = item.category ? categoriesMap.get(item.category)!.icon : undefined;

        return {
            avatar: {
                type: 'image' as const,
                value: avatarImage,
                size: 'l' as const,
                selected: item.tags && item.tags.includes(props.tagId) ? true : undefined
            },
            date: { date: item.date },
            title: item.description,
            amount: currency + ' ' + item.amount.toLocaleString('it'),
        }
    }

    /**
     * Attaches the expense to the tag, or detaches it if already attached
     *
     * @param {Expense} expense the expense to toggle
     */
    const toggleExpenseSelection = async (expense: Expense) => {

        if (!expense.tags) await new ExpensesAPI().tagExpense(expense.id, props.tagId);
        else {
            if (expense.tags.includes(props.tagId)) await new ExpensesAPI().untagExpense(expense.id, props.tagId);
            else await new ExpensesAPI().tagExpense(expense.id, props.tagId);
        }

        loadExpenses()
    }

    /**
     * Deletes the tag and goes back to the tag list
     */
    const cancel = () => {
        if (props.onDelete) props.onDelete(props.tagId)
        router.back()
    }

    /**
     * Goes back
     */
    const save = () => {
        router.back();
    }

    // Reload the expenses when the month changes
    useEffect(() => { loadExpenses() }, [loadExpenses])

    return (
        <div className="tag-expenses-picker">
            <TitleBar
                title="Add payments to tag"
                rightButton={<TotoIconButton image="/images/tick.svg" size="ms" onPress={save} />}
                back={props.noDelete}
                leftButton={props.noDelete ? null : <TotoIconButton image="/images/trash.svg" size="ms" onPress={cancel} />}
            />

            <div className="month-navigator-container">
                <ScrollPicker
                    tile={<YearMonthTile />}
                    defaultValue={selectedMonth}
                    previousValue={(currentValue: Moment) => currentValue.clone().subtract(1, 'months')}
                    nextValue={(currentValue: Moment) => currentValue.clone().add(1, 'months')}
                    onSelectionChange={(newMonth: Moment) => setSelectedMonth(newMonth)}
                />
            </div>

            <div className="expenses-list-widget">
                <TotoList
                    data={expenses}
                    dataExtractor={dataExtractor}
                    onPress={toggleExpenseSelection}
                    onAvatarClick={toggleExpenseSelection}
                />
            </div>

        </div>
    )
}

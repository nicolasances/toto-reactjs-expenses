'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import TitleBar from '@/components/TitleBar';
import LabeledValue from '@/components/LabeledValue';
import TotoIconButton from '@/components/TotoIconButton';
import TotoList, { TotoListRowData } from '@/components/TotoList';
import { ExpensesAPI } from '@/api/ExpensesAPI';
import { Expense } from '@/model/expense';
import { Tag } from '@/model/tag';
import categoriesMap from '@/utils/CategoriesMap';

import './EditTagScreen.css';

/**
 * Screen of a tag: total spent, delete / edit buttons and the tagged expenses.
 * The tag is loaded from the "tagId" and "currency" query params.
 */
export default function EditTagScreen() {

    const router = useRouter();
    const searchParams = useSearchParams();

    const tagId = searchParams.get('tagId') as string;
    const currency = searchParams.get('currency') ?? 'EUR';     // Currency to show the total in (EUR if the URL has none)

    const [tag, setTag] = useState<Tag>();                  // The loaded tag
    const [expenses, setExpenses] = useState<Expense[]>();  // The expenses attached to the tag

    /**
     * Loads the tag and the expenses attached to it
     */
    useEffect(() => {

        new ExpensesAPI().getTag(tagId, currency).then(setTag);
        new ExpensesAPI().getTagExpenses(tagId).then((data) => setExpenses(data.expenses));

    }, [tagId, currency]);

    /**
     * Deletes a tag
     */
    const deleteTag = async () => {

        await new ExpensesAPI().deleteTag(tagId);

        router.back();
    }

    /**
     * Data Extractor for the List
     *
     * @param {Expense} item the expense
     */
    const expensesDataExtractor = (item: Expense): TotoListRowData<Expense> => {

        let itemCurrency = item.currency;
        if (item.currency === 'EUR') itemCurrency = '€';
        else if (item.currency === 'DKK') itemCurrency = 'kr.'

        return {
            avatar: {
                type: 'image' as const,
                value: item.category ? categoriesMap.get(item.category)!.icon : undefined,
                size: 'l' as const
            },
            date: { date: item.date },
            title: item.description,
            amount: itemCurrency + ' ' + item.amount.toLocaleString('it'),
        }
    }

    const editTagExpenses = () => {

        router.push('/editTagExpenses?tagId=' + tagId);
    }

    if (!tag) return <div className="screen edit-tag-screen"></div>

    const amount = tag.localCurrencyAmount;

    return (
        <div className="screen edit-tag-screen">

            <TitleBar
                title={tag.name}
                back={true}
            />

            <div className="spacer"></div>

            <div className="labeled-value-container">
                <LabeledValue
                    label={`Spent on ${tag.name}`}
                    value={amount ? amount.toLocaleString("it", {
                        style: "currency",
                        currency: currency,
                        maximumFractionDigits: 2
                    }) : "Amount Not Available"}
                    textAlign="center"
                />
            </div>

            <div className="spacer"></div>

            <div className="buttons-container">
                <TotoIconButton image="/images/trash.svg" onPress={deleteTag} size="m" />
                <div className="hspace"></div>
                <TotoIconButton image="/images/edit.svg" onPress={editTagExpenses} size="m" />
            </div>

            <div className="spacer"></div>

            <div className="expenses-container">
                <TotoList
                    data={expenses}
                    dataExtractor={expensesDataExtractor}
                />
            </div>

        </div>
    )
}

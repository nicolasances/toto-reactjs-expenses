import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import TitleBar from "../../comp/TitleBar";
import LabeledValue from "../../comp/LabeledValue";
import './EditTagScreen.css'
import TotoIconButton from "../../comp/TotoIconButton";

import { ReactComponent as TrashSVG } from '../../img/trash.svg';
import { ReactComponent as PenSVG } from '../../img/edit.svg';
import ExpensesAPI from "../../services/ExpensesAPI";
import { useEffect, useState } from "react";
import TotoList from "../../comp/TotoList";
import categoriesMap from "../../services/CategoriesMap";

export default function EditTagScreen(props) {

    const location = useLocation()

    const tag = location.state.tag;
    const currency = location.state.currency;

    const history = useHistory()
    const [amount, setAmount] = useState(tag.localCurrencyAmount)
    const [expenses, setExpenses] = useState()

    const loadTag = async () => {

        const updatedTag = await new ExpensesAPI().getTag(tag.id, currency);
        
        setAmount(updatedTag.localCurrencyAmount);
    }

    /**
     * Loads the expenses attached to the specified tag
     */
    const loadExpenses = async () => {

        const data = await new ExpensesAPI().getTagExpenses(tag.id);

        setExpenses(data.expenses)

    }

    /**
     * Deletes a tag
     */
    const deleteTag = async () => {

        await new ExpensesAPI().deleteTag(tag.id);

        history.goBack();
    }

    /**
     * Data Extractor for the List
     */
    const expensesDataExtractor = (item) => {

        let currency = item.currency;
        if (item.currency === 'EUR') currency = '€';
        else if (item.currency === 'DKK') currency = 'kr.'

        return {
            avatar: {
                type: 'image',
                value: item.category ? categoriesMap.get(item.category).image : null,
                size: 'l'
            },
            date: { date: item.date },
            title: item.description,
            amount: currency + ' ' + item.amount.toLocaleString('it'),
        }

    }

    const editTagExpenses = () => {

        history.push("editTagExpenses", { tag: tag })
    }

    useEffect(loadExpenses, []);
    useEffect(loadTag, []);

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
                <TotoIconButton image={<TrashSVG />} onPress={deleteTag} size="m" />
                <div className="hspace"></div>
                <TotoIconButton image={<PenSVG />} onPress={editTagExpenses} size="m" />
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

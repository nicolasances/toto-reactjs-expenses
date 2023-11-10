import moment from "moment-timezone"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import ExpensesAPI from "../../../services/ExpensesAPI"
import TitleBar from "../../../comp/TitleBar"
import ScrollPicker from "../../../picker/ScrollPicker"
import TotoList from "../../../comp/TotoList"
import categoriesMap from "../../../services/CategoriesMap"
import Cookies from "universal-cookie"
import TotoIconButton from "../../../comp/TotoIconButton"

import { ReactComponent as TickSVG } from '../../../img/tick.svg'
import { ReactComponent as TrashSVG } from '../../../img/trash.svg'
import YearMonthTile from "../../../picker/YearMonthTile"

const cookies = new Cookies()

/**
 * Picker for the expenses to add to the Event
 */
export default function ExpensesPicker(props) {

    const [selectedMonth, setSelectedMonth] = useState(moment())
    const [expenses, setExpenses] = useState()
    const history = useHistory()

    /**
     * Loading of Expenses
     */
    const loadExpenses = () => {
        new ExpensesAPI().getExpenses(cookies.get('user').email, selectedMonth.format('YYYYMM')).then((data) => {
            setExpenses(data.expenses)
        })
    }

    /**
     * Change the month and reload expenses
     * @param {moment} newMonth 
     */
    const onMonthChange = (newMonth) => {
        setSelectedMonth(newMonth)
    }

    /**
     * Extractor
     */
    const dataExtractor = (item) => {

        let currency = item.currency;
        if (item.currency === 'EUR') currency = '€';
        else if (item.currency === 'DKK') currency = 'kr.'

        const getCategoryAvatar = (category) => {
            return category ? categoriesMap.get(category).image : null
        }

        const avatarImage = item.event == props.event ? <TickSVG /> : getCategoryAvatar(item.category);

        return {
            avatar: {
                type: 'image',
                value: avatarImage,
                size: 'l',
                selected: item.tags && item.tags.includes(props.tagId)
            },
            date: { date: item.date },
            title: item.description,
            amount: currency + ' ' + item.amount.toLocaleString('it'),
        }

    }

    /**
     * Attaches the expense to the tag 
     * @param {object} expense the expense to attach to the tag
     */
    const selectExpense = async (expense) => {

        await new ExpensesAPI().tagExpense(expense.id, props.tagId);

        loadExpenses()
    }

    /**
     * Deletes the tag and go back to tag list
     */
    const cancel = () => {
        if (props.onDelete) props.onDelete(props.tagId)
        history.goBack()
    }

    // Reload the expenses when the month changes
    useEffect(loadExpenses, [selectedMonth])

    return (
        <div className="tag-expenses-picker">
            <TitleBar
                title="Add payments to tag"
                rightButton={<TotoIconButton image={<TickSVG />} size="ms" />}
                back={props.noDelete}
                leftButton={props.noDelete ? null : <TotoIconButton image={<TrashSVG />} size="ms" onPress={cancel} />}
            />

            <div className="month-navigator-container">
                <ScrollPicker
                    tile={<YearMonthTile />}
                    defaultValue={selectedMonth}
                    previousValue={(currentValue) => currentValue.clone().subtract(1, 'months')}
                    nextValue={(currentValue) => currentValue.clone().add(1, 'months')}
                    onSelectionChange={onMonthChange}
                />
            </div>

            <div className="expenses-list-widget">
                <TotoList
                    data={expenses}
                    dataExtractor={dataExtractor}
                    onPress={selectExpense}
                />
            </div>

        </div>
    )

}
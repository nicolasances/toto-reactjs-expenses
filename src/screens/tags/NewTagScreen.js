import React, { Component, useEffect, useState } from 'react';

import "./NewTagScreen.css";
import TitleBar from '../../comp/TitleBar';
import TextInput from '../../comp/TextInput';
import moment from 'moment-timezone';
import ScrollPicker from '../../picker/ScrollPicker';
import YearMonthTile from '../../picker/YearMonthTile';
import TotoList from '../../comp/TotoList';
import ExpensesAPI from '../../services/ExpensesAPI';
import Cookies from 'universal-cookie';
import categoriesMap from '../../services/CategoriesMap';

import { ReactComponent as TickSVG } from '../../img/tick.svg';
import { ReactComponent as TrashSVG } from '../../img/trash.svg';

import TotoIconButton from '../../comp/TotoIconButton';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const cookies = new Cookies();

export default class NewTagScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedMonth: moment()
        }

        this.saveTag = this.saveTag.bind(this);
        this.deleteTag = this.deleteTag.bind(this);
        this.selectExpense = this.selectExpense.bind(this);
    }

    /**
     * Saves the tag and proceed
     * @param {string} value the tag name
     */
    async saveTag(value) {

        const response = await new ExpensesAPI().postTag(value);

        this.setState({ tag: value, tagId: response.tagId })
    }

    /**
     * Deletes the tag and untags the expenses
     * @param {string} tagId the tag Id
     */
    async deleteTag(tagId) {

        const response = await new ExpensesAPI().deleteTag(tagId);

        console.log(response);

    }

    /**
     * When selecting an expense, add this expense to the event
     */
    selectExpense() {

    }

    render() {

        if (!this.state.tagId) return <TagName onSave={this.saveTag} />

        return (
            <ExpensesPicker
                tag={this.state.tag}
                tagId={this.state.tagId}
                onDelete={this.deleteTag}
            />
        )

    }
}

/**
 * Functonal component to grab the Event name
 */
function TagName(props) {

    const [tag, setTag] = useState();

    const save = () => { if (tag && props.onSave) props.onSave(tag) }

    return (
        <div className="new-event-screen">
            <TitleBar
                title="New Tag"
                back={true}
            />

            <div className="name-container">
                <TextInput placeholder="What is the tag name?"
                    align="center"
                    onTextChange={setTag}
                />
            </div>

            <div className="buttons-container">
                <div style={{ marginLeft: 6, marginRight: 6 }}><TotoIconButton image={(<TickSVG className="icon" />)} onPress={save} /></div>
            </div>

        </div>

    )
}

/**
 * Picker for the expenses to add to the Event
 */
function ExpensesPicker(props) {

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

        // Highlights
        let highlights = [];

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
            monthly: item.monthly,
            amount: currency + ' ' + item.amount.toLocaleString('it'),
            highlights: highlights
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
        <div className="new-event-screen">
            <TitleBar
                title="Add payments to tag"
                rightButton={<TotoIconButton image={<TickSVG />} size="ms" />}
                leftButton={<TotoIconButton image={<TrashSVG/>} size="ms" onPress={cancel}/>}
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
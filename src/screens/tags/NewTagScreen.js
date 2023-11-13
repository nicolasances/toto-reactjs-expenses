import React, { Component, useEffect, useState } from 'react';

import "./NewTagScreen.css";
import TitleBar from '../../comp/TitleBar';
import TextInput from '../../comp/TextInput';
import moment from 'moment-timezone';
import ExpensesAPI from '../../services/ExpensesAPI';
import Cookies from 'universal-cookie';

import { ReactComponent as TickSVG } from '../../img/tick.svg';

import TotoIconButton from '../../comp/TotoIconButton';
import ExpensesPicker from './comp/TagExpensesPicker';

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


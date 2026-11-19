'use client'

import { useState } from 'react';

import TitleBar from '@/components/TitleBar';
import TextInput from '@/components/TextInput';
import TotoIconButton from '@/components/TotoIconButton';
import ExpensesPicker from '@/components/tag/TagExpensesPicker';
import { ExpensesAPI } from '@/api/ExpensesAPI';

import './NewTagScreen.css';

/**
 * Screen to create a tag: first asks for the name, then lets the user pick the expenses to tag.
 */
export default function NewTagScreen() {

    const [tag, setTag] = useState<string>();           // Name of the saved tag
    const [tagId, setTagId] = useState<string>();       // Id of the saved tag

    /**
     * Saves the tag and proceeds
     *
     * @param {string} value the tag name
     */
    const saveTag = async (value: string) => {

        const response = await new ExpensesAPI().postTag(value);

        setTag(value);
        setTagId(response.tagId);
    }

    /**
     * Deletes the tag and untags the expenses
     *
     * @param {string} id the tag Id
     */
    const deleteTag = async (id: string) => {

        const response = await new ExpensesAPI().deleteTag(id);

        console.log(response);
    }

    if (!tagId) return <TagName onSave={saveTag} />

    return (
        <ExpensesPicker
            tag={tag}
            tagId={tagId}
            onDelete={deleteTag}
        />
    )
}

/**
 * Properties of TagName
 */
interface TagNameProps {
    onSave: (tag: string) => void;      // Called with the tag name when the user confirms
}

/**
 * Functional component to grab the tag name
 */
function TagName({ onSave }: TagNameProps) {

    const [tag, setTag] = useState<string>();           // The name typed by the user

    const save = () => { if (tag) onSave(tag) }

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
                <div style={{ marginLeft: 6, marginRight: 6 }}><TotoIconButton image="/images/tick.svg" onPress={save} /></div>
            </div>

        </div>
    )
}

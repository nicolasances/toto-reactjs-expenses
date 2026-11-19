'use client'

import TitleBar from '@/components/TitleBar';
import TagsList from '@/components/tag/TagsList';

import './TagScreen.css';

/**
 * Tags & Events screen: the list of tags and a button to create a new one.
 */
export default function TagScreen() {

    return (
        <div className="tag-screen">
            <TitleBar title="Tags & Events" back={true} newEnabled={true} navigateTo="/newTag" />

            <div className="list-container">
                <TagsList />
            </div>
        </div>
    )
}

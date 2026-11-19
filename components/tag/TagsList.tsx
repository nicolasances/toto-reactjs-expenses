'use client'

import { useEffect, useState } from "react";
import { MaskedSvgIcon } from 'toto-react';
import Tag from "./Tag";
import { ExpensesAPI } from "@/api/ExpensesAPI";
import { Tag as TagModel } from "@/model/tag";
import { Settings } from "@/model/settings";
import './TagsList.css'

/**
 * Shows the list of tags of the user.
 */
export default function TagsList() {

    const [tags, setTags] = useState<TagModel[] | undefined>()
    const [settings, setSettings] = useState<Settings>({ currency: "EUR" });
    const [loading, setLoading] = useState(true)

    /**
     * Loads the user settings and then the tags
     */
    const loadSettings = async () => {

        setLoading(true)

        const settings = await new ExpensesAPI().getSettings();

        setSettings(settings);

        await loadTags(settings.currency);

        setLoading(false)
    }

    /**
     * Loads the tags
     */
    const loadTags = async (currency: string) => {

        const data = await new ExpensesAPI().getTags(currency)

        setTags(data.tags)

    }

    useEffect(() => { loadSettings() }, [])

    return (
        <div className="tags-list">

            {!loading && tags && tags.length > 0 && tags.map((tag) => <Tag key={`tag-${Math.random()}`} tag={tag} currency={settings.currency ? settings.currency : "EUR"} />)}

            {!loading && tags && tags.length == 0 &&
                <div className="no-tag">
                    <div className="image-container">
                        <MaskedSvgIcon src="/images/tag.svg" alt="tag" size="w-12 h-12" color="bg-dark-primary" />
                    </div>
                    <div className="text">You don&apos;t have any tags yet!</div>
                </div>
            }

            {loading &&
                [1, 2, 3, 4, 5].map((n) => {
                    return <Tag key={`tag-${Math.random()}-${n}`} />
                })
            }

        </div>
    )
}

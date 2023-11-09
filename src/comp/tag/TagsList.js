import { useEffect, useState } from "react";
import Tag from "./Tag";
import './TagsList.css'
import ExpensesAPI from "../../services/ExpensesAPI";
import Cookies from "universal-cookie";

const cookies = new Cookies()

export default function TagsList(props) {

    const [tags, setTags] = useState()
    const [settings, setSettings] = useState({ currency: "EUR" });
    const [loading, setLoading] = useState(true)

    const loadSettings = async () => {

        setLoading(true)

        const settings = await new ExpensesAPI().getSettings(cookies.get("user").email);

        setSettings(settings);

        await loadTags(settings.currency);

        setLoading(false)
    }

    /**
     * Loads the events
     */
    const loadTags = async (currency) => {

        const data = await new ExpensesAPI().getTags(currency)

        setTags(data.tags)

        console.log(data);

    }

    useEffect(loadSettings, [])

    return (
        <div className="tags-list">
            
            {!loading && tags && tags.map((tag) => <Tag key={`tag-${Math.random()}`} tag={tag} currency={settings.currency ? settings.currency : "EUR"}/>)}
            
            {loading &&
                [1, 2].map(() => {
                    return <Tag key={`tag-${Math.random()}`} />
                })
            }

        </div>
    )
}
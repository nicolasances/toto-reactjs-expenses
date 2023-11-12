import { useEffect, useState } from "react";
import Tag from "./Tag";
import './TagsList.css'
import ExpensesAPI from "../../services/ExpensesAPI";
import Cookies from "universal-cookie";
import {ReactComponent as TagSVG} from '../../img/tag.svg'

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

    }

    useEffect(loadSettings, [])

    return (
        <div className="tags-list">
            
            {!loading && tags && tags.length > 0 && tags.map((tag) => <Tag key={`tag-${Math.random()}`} tag={tag} currency={settings.currency ? settings.currency : "EUR"}/>)}

            {!loading && tags && tags.length == 0 && 
                <div className="no-tag">
                    <div className="image-container">
                        <TagSVG />
                    </div>
                    <div className="text">You don't have any tags yet!</div>
                </div>
            }
            
            {loading &&
                [1, 2, 3, 4, 5].map(() => {
                    return <Tag key={`tag-${Math.random()}`} />
                })
            }

        </div>
    )
}
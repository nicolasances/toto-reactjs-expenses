'use client'

import { useRouter } from 'next/navigation'
import moment from 'moment-timezone'
import TouchableOpacity from '@/components/TouchableOpacity'
import { currencyLabel } from '@/utils/CurrencyUtil'
import { Tag as TagModel } from '@/model/tag'
import './Tag.css'

interface TagProps {
    tag?: TagModel;         // A tag object retrieved from the /tags API (when missing, a loading placeholder is shown)
    currency?: string;      // The currency used by the user (settings)
}

/**
 * Shows a tag component
 *
 * @param {TagProps} props the props
 */
export default function Tag({ tag, currency }: TagProps) {

    const router = useRouter()

    /**
     * Opens the detail (edit) screen of the tag
     */
    const openTagDetail = () => {
        if (!tag) return
        router.push(`/editTag?tagId=${encodeURIComponent(tag.id)}&currency=${encodeURIComponent(currency ?? "")}`)
    }

    /**
     * Formats a YYYYMMDD date as "MMM YYYY"
     */
    const formatDate = (date?: string) => {

        if (!date) return ""

        return moment(date, "YYYYMMDD").format("MMM YYYY")

    }

    if (!tag) return (<LoadingTag />)

    const curr = currencyLabel(currency ?? "")

    return (
        <TouchableOpacity className="tag-box" onPress={openTagDetail}>
            <div className="tag-header">
                <div className="tag-core-info">
                    <div className="tag-name">{tag.name}</div>
                    {tag.minDate && tag.maxDate &&
                        <div className="tag-dates">
                            <div className="from">{formatDate(tag.minDate)}</div>
                            <div className="">•</div>
                            <div className="to">{formatDate(tag.maxDate)}</div>
                        </div>
                    }
                </div>
                <div className="exp-count">{tag.numExpenses}</div>
            </div>
            <div className="vfiller"></div>
            <div className="tag-amount">
                {tag.localCurrencyAmount &&
                    <div>
                        <span className="curr">{curr}</span >
                        <span className="amt">{tag.localCurrencyAmount.toLocaleString("it", { maximumFractionDigits: 2 })}</span>
                    </div>
                }
                {!tag.localCurrencyAmount &&
                    <div>
                        <span className="curr">{curr}</span >
                        <span className="amt no-value">-</span>
                    </div>
                }
            </div>
        </TouchableOpacity>
    )
}

/**
 * Placeholder shown while the tag is loading
 */
function LoadingTag() {
    return (
        <div className="tag-box loading">
            <div className="tag-header">Loading tag..</div>
            <div className="tag-amount"></div>
        </div>
    )
}

import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import TouchableOpacity from '../TouchableOpacity'
import './Tag.css'
import CurrencyUtil from '../../util/CurrencyUtil'
import moment from 'moment-timezone'

/**
 * Shows a tag component
 * 
 * @param {object} props Props
 * Properties must include: 
 *  - tag - a tag object retrieved from the /tags API
 *  - currency - the currency used by the user (settings)
 * 
 * @returns 
 */
export default function Tag(props) {

    const history = useHistory()

    const tag = props.tag

    const openTagDetail = () => {
        history.push("/editTag", { tag: tag, currency: props.currency })
    }

    const formatDate = (date) => {

        if (!date) return ""

        return moment(date, "YYYYMMDD").format("MMM YYYY")

    }

    if (!tag) return (<LoadingTag />)

    return (
        <TouchableOpacity className="tag-box" onPress={openTagDetail}>
            <div className="tag-header">
                <div className="tag-name">{tag.name}</div>
                <div className="exp-count">{tag.numExpenses}</div>
            </div>
            {tag.minDate && tag.maxDate &&
                <div className="tag-dates">
                    <div className="from">{formatDate(tag.minDate)}</div>
                    <div className="">•</div>
                    <div className="to">{formatDate(tag.maxDate)}</div>
                </div>
            }
            <div className="vfiller"></div>
            <div className="tag-amount">
                {tag.localCurrencyAmount &&
                    <div>
                        <span className="curr">{new CurrencyUtil().label(props.currency)}</span >
                        <span className="amt">{tag.localCurrencyAmount.toLocaleString("it", { maximumFractionDigits: 2 })}</span>
                    </div>
                }
                {!tag.localCurrencyAmount &&
                    <div>
                        <span className="curr">{new CurrencyUtil().label(props.currency)}</span >
                        <span className="amt no-value">-</span>
                    </div>
                }
            </div>
        </TouchableOpacity>
    )
}

function LoadingTag() {
    return (
        <div className="tag-box loading">
            <div className="tag-header">Loading tag..</div>
            <div className="tag-amount"></div>
        </div>
    )
}
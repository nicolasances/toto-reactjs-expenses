import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import TouchableOpacity from '../TouchableOpacity'
import './Tag.css'

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

    const openTagDetail = () =>  {
        history.push("/editTag", { tag: tag, currency: props.currency })
    }

    if (!tag) return (<LoadingTag/>)

    return (
        <TouchableOpacity className="tag-box" onPress={openTagDetail}>
            <div className="tag-header">
                {tag.name}
            </div>
            <div className="tag-amount">
                {tag.localCurrencyAmount && tag.localCurrencyAmount.toLocaleString("it", { style: "currency", currency: props.currency, maximumFractionDigits: 2 })}
                {!tag.localCurrencyAmount && "No data"}
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
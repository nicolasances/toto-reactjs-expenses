import './LabeledValue.css'

/**
 * Required props: 
 *  - label: string
 *  - value: formatted string
 */
export default function LabeledValue(props) {

    return (
        <div className={`labeled-value ${props.textAlign}`}>
            <div className="label">{props.label}</div>
            <div className="value">{props.value}</div>
        </div>
    )

}
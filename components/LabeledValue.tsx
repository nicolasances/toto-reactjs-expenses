'use client'

import './LabeledValue.css';

interface LabeledValueProps {
    label: string;          // The label
    value: string;          // The formatted value
    textAlign?: string;     // (OPT) css class used to align the text (as used in LabeledValue.css)
}

/**
 * Displays a value with its label.
 *
 * @param {LabeledValueProps} props the props
 */
export default function LabeledValue(props: LabeledValueProps) {

    return (
        <div className={`labeled-value ${props.textAlign}`}>
            <div className="label">{props.label}</div>
            <div className="value">{props.value}</div>
        </div>
    )

}

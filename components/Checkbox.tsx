'use client'

import { MaskedSvgIcon } from 'toto-react';
import './Checkbox.css';

interface CheckboxProps {
    flag?: boolean;                 // True if the box is checked
    label?: string;                 // (OPT, default "Monthly recurring expense") the text next to the box
    onToggleFlag?: () => void;      // (OPT) called when the checkbox is clicked
}

/**
 * A checkbox with a label.
 *
 * @param {CheckboxProps} props the props
 */
export default function Checkbox(props: CheckboxProps) {

    /**
     * Notifies the click
     */
    const toggleFlag = () => {
        if (props.onToggleFlag) props.onToggleFlag();
    }

    return (
        <div className="checkbox" onClick={toggleFlag}>
            <div className={["box", props.flag ? "flagged" : "unflagged"].join(" ")} >
                {props.flag &&
                    <MaskedSvgIcon src="/images/tick.svg" alt="checked" size="w-5 h-5" color="bg-black" />
                }
            </div>
            <div className="text">
                {props.label ? props.label : "Monthly recurring expense"}
            </div>
        </div>
    )
}

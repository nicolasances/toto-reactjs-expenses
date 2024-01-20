import React, { Component } from 'react';
import './Checkbox.css';
import { ReactComponent as TickSVG } from '../img/tick.svg'

export default function (props) {

    const toggleFlag = () => {
        if (props.onToggleFlag) props.onToggleFlag();
    }

    return (
        <div className="checkbox" onClick={toggleFlag}>
            <div className={["box", props.flag ? "flagged" : "unflagged"].join(" ")} >
                {props.flag && 
                    <TickSVG/>
                }
            </div>
            <div className="text">
                {props.label ? props.label : "Monthly recurring expense"}
            </div>
        </div>
    )
}
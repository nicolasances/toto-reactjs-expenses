import React, { Component } from 'react';
import moment from 'moment-timezone';
import './AmountSelector.css';

export default class AmountSelector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            amount: 0.0
        }

    }

    render() {
        return (
            <div className="amount-selector" onClick={() => {document.getElementById('amount-input').focus()}}>
                <div className="amount">
                    <input id="amount-input" type="number" inputMode="numeric" defaultValue={this.state.amount.toLocaleString('it-IT')} />
                </div>
            </div>
        )
    }
}
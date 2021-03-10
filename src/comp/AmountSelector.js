import React, { Component } from 'react';
import moment from 'moment-timezone';
import './AmountSelector.css';

export default class AmountSelector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            amount: 0.0
        }

        this.updateAmount = this.updateAmount.bind(this);

    }

    updateAmount(event) {

        this.setState({
            amount: event.target.value
        })
    }

    render() {
        return (
            <div className="amount-selector" onClick={() => {document.getElementById('amount-input').focus()}}>
                <div className="amount">
                    <input id="amount-input" type="number" inputMode="decimal" defaultValue={this.state.amount.toLocaleString('it-IT')} onChange={this.updateAmount}/>
                </div>
            </div>
        )
    }
}
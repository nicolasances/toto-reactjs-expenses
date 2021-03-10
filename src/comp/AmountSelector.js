import React, { Component } from 'react';
import moment from 'moment-timezone';
import './AmountSelector.css';

export default class AmountSelector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            amount: this.props.value ? this.props.value : 0
        }

        this.updateAmount = this.updateAmount.bind(this);
        this.clearValue = this.clearValue.bind(this);

    }

    updateAmount(event) {

        let isNumber = /^[0-9]+((\,|\.)([0-9])*)?$/.test(event.target.value);
        let isEmpty = event.target.value == '';

        if (isNumber)
            this.setState({
                amount: event.target.value.replace(',', '.')
            })
        else if (isEmpty)
            this.restore();
    }

    restore() {

        this.setState({
            amount: this.props.value ? this.props.value : 0
        })
    }

    clearValue() {

        this.setState({
            amount: ''
        })
    }

    render() {
        return (
            <div className="amount-selector" onClick={() => { document.getElementById('amount-input').focus() }}>
                <div className="amount">
                    <input id="amount-input"
                        type="text"
                        inputMode="decimal"
                        value={this.state.amount}
                        onChange={this.updateAmount}
                        onFocus={this.clearValue}
                        onBlur={this.updateAmount}
                    />
                </div>
            </div>
        )
    }
}
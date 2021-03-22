import React, { Component } from 'react';
import moment from 'moment-timezone';
import './AmountSelector.css';

/**
 * Form component to insert an amount
 * 
 * Parameters: 
 * 
 *  - initialValue          :   (OPT) the initial value that the selector should show
 *  - initialValueLoader    :   (OPT) a function that will load the initial value. 
 *                              The function is expected to return a Promise object that will then return the initial value when loaded
 *  - onAmountChange        :   (OPT) the callback to be notified of a change of the amount
 */
export default class AmountSelector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            amount: this.props.initialValue
        }

        this.updateAmount = this.updateAmount.bind(this);
        this.clearValue = this.clearValue.bind(this);
        this.onBlur = this.onBlur.bind(this);

    }

    componentDidMount() {

        if (this.props.initialValueLoader) this.props.initialValueLoader().then((data) => {
            this.setState({ amount: data });
        })
    }

    updateAmount(event) {

        let isNumber = /^[0-9]+((\,|\.)([0-9])*)?$/.test(event.target.value);

        if (isNumber) {
            this.setState({
                amount: event.target.value.replace(',', '.')
            }, () => {

                // Callback, if any
                if (this.props.onAmountChange) this.props.onAmountChange(this.state.amount);
            })
        }
        else this.setState({ amount: '' })
    }

    clearValue() {

        this.setState({
            amount: '',
            preClearAmount: this.state.amount
        })
    }

    onBlur() {

        if (this.state.amount == '') this.setState({
            amount: this.state.preClearAmount
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
                        onBlur={this.onBlur}
                        autoComplete="off"
                    />
                </div>
            </div>
        )
    }
}
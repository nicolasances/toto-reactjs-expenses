import React, { Component } from 'react';
import './CurrencySwitcher.css';
import Cookies from 'universal-cookie';
import ExpensesAPI from '../services/ExpensesAPI';

const cookies = new Cookies();

const availableCurrencies = ['EUR', 'DKK'];

/**
 * Form component to select a currency in a toggle way
 * 
 * Paramters:
 *  - initialValue          :   (OPT) the initial value that the selector should show
 *  - initialValueLoader    :   (OPT) a function that will load the initial value. 
 *  - default               :   (OPT, default 'EUR') default currency value, in case no currency is set in the apps settings
 *  - onCurrencyChange      :   (OPT) callback to receive the changed currency code
 *  - loadFromSettings      :   (OPT, default true) if true, the currency is loaded from the user settings (it can then be changed)
 */
export default class CurrencySwitcher extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currency: this.props.initialValue ? this.props.initialValue : (this.props.default ? this.props.default : null)
        }

        this.user = cookies.get('user');
        this.loadUserSettings = this.loadUserSettings.bind(this);
        this.nextCurrency = this.nextCurrency.bind(this);
    }

    componentDidMount() {

        if (this.props.loadFromSettings == null || this.props.loadFromSettings) this.loadUserSettings();
        // Load the initial value if an async loader is provided
        else if (this.props.initialValueLoader) this.props.initialValueLoader().then((data) => {
            this.setState({ currency: data });
        })
    }

    loadUserSettings() {

        new ExpensesAPI().getAppSettings(this.user.email).then((data) => {
            this.setState({
                currency: data && data.currency ? data.currency : 'EUR'
            }, () => {
                if (this.props.onCurrencyChange) this.props.onCurrencyChange(this.state.currency);
            })
        })

    }

    nextCurrency() {

        let currentIndex = availableCurrencies.findIndex(value => value == this.state.currency);
        let nextIndex = currentIndex + 1;

        if (nextIndex >= availableCurrencies.length) nextIndex = 0;

        this.setState({
            currency: availableCurrencies[nextIndex]
        }, () => {
            if (this.props.onCurrencyChange) this.props.onCurrencyChange(this.state.currency);
        })

    }

    render() {

        let currency = this.state.currency ? this.state.currency : this.props.initialValue;

        return (
            <div className="currency-switcher" onClick={this.nextCurrency}>
                {currency}
            </div>
        )
    }
}
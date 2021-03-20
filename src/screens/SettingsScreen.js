import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import { withRouter } from 'react-router-dom';
import TitleBar from '../comp/TitleBar';
import { ReactComponent as TickSVG } from '../img/tick.svg';
import TotoIconButton from '../comp/TotoIconButton';

import './SettingsScreen.css';
import CurrencySwitcher from '../comp/CurrencySwitcher';
import ExpensesAPI from '../services/ExpensesAPI';

const cookies = new Cookies();

class SettingsScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
        }

        this.save = this.save.bind(this);

    }

    componentDidMount() {
    }

    save() {
        new ExpensesAPI().putSettings({
            user: cookies.get('user').email,
            currency: this.state.currency
        }).then(() => {
            this.props.history.goBack();
        })
    }

    render() {
        return (
            <div className="screen settings-screen">
                <TitleBar title="App Settings" back={true} />

                <div className="setting-container">
                    <div className="label">Default currency</div>
                    <div className="currency-container">
                        <CurrencySwitcher onCurrencyChange={(c) => {this.setState({currency: c})}} />
                    </div>
                </div>

                <div style={{ display: 'flex', flex: 1 }}></div>

                <div className="button-container">
                    <div style={{ marginLeft: 6, marginRight: 6 }}><TotoIconButton image={(<TickSVG className="icon" />)} onPress={this.save} /></div>
                </div>
            </div>
        )
    }
}
export default withRouter(SettingsScreen);
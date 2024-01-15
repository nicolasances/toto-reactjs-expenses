import React, { Component, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { withRouter } from 'react-router-dom';
import TitleBar from '../comp/TitleBar';
import { ReactComponent as TickSVG } from '../img/tick.svg';
import TotoIconButton from '../comp/TotoIconButton';
import { APP_VERSION } from '../Config';

import './SettingsScreen.css';
import CurrencySwitcher from '../comp/CurrencySwitcher';
import ExpensesAPI from '../services/ExpensesAPI';
import Checkbox from '../comp/Checkbox';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const cookies = new Cookies();

export default function SettingsScreen(props) {

    const [currency, setCurrency] = useState("EUR")
    const [dashboardHighlightsVersion, setDashboardHighlightsVersion] = useState("V1")

    const history = useHistory()

    /**
     * Load the user settings
     */
    const load = async () => {

        const settings = await new ExpensesAPI().getSettings()

        setCurrency(settings.currency)
        setDashboardHighlightsVersion(settings.dashboardHighlightsVersion)
    }

    /**
     * Save the settings
     */
    const save = async () => {

        // Update the Settings
        await new ExpensesAPI().putSettings({
            currency: currency,
            dashboardHighlightsVersion: dashboardHighlightsVersion
        })

        // Go back
        history.goBack();
    }

    useEffect(load, [])

    return (
        <div className="screen settings-screen">
            <TitleBar title="App Settings" back={true} />

            <Setting label="Displayed Currency">
                <CurrencySwitcher onCurrencyChange={(c) => { setCurrency(c) }} />
            </Setting>
            <Setting label="App Version">
                <Text>{APP_VERSION}</Text>
            </Setting>
            <Setting label="Home Screen">
                <Checkbox label="Show Savings in Home screen" flag={dashboardHighlightsVersion == 'V2'} onToggleFlag={() => { setDashboardHighlightsVersion(dashboardHighlightsVersion == 'V1' ? "V2" : "V1") }} />
            </Setting>

            <div style={{ display: 'flex', flex: 1 }}></div>

            <div className="button-container">
                <div style={{ marginLeft: 6, marginRight: 6 }}><TotoIconButton image={(<TickSVG className="icon" />)} onPress={save} /></div>
            </div>
        </div>
    )
}

function Setting(props) {

    return (
        <div className="setting-container">
            <div className="label">{props.label}</div>
            <div className="currency-container">
                {props.children}
            </div>
        </div>
    )

}

function Text(props) {
    return (
        <div className="setting-text">{props.children}</div>
    )
}
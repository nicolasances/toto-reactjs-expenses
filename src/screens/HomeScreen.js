import React, { Component, useEffect, useState } from 'react';
import moment from 'moment-timezone';

import MonthSpendingBubble from "../comp/MonthSpendingBubble";
import TitleBar from '../comp/TitleBar';
import LastDaysSpendingGraph from '../comp/LastDaysSpendingGraph';

import { ReactComponent as SettingsSVG } from '../img/settings.svg';
import { ReactComponent as DiceSVG } from '../img/dice.svg';
import { ReactComponent as AddSVG } from '../img/plus.svg';
import { ReactComponent as ListSVG } from '../img/list.svg';
import { ReactComponent as TagSVG } from '../img/tag.svg';
import { ReactComponent as IdeaSVG } from '../img/idea-heart.svg';

import './Screen.css';
import './HomeScreen.css';
import TotoIconButton from '../comp/TotoIconButton';
import PastMonthsGraph from '../comp/graphs/PastMonthsGraph';
import { DashboardKeyInfoV1 } from '../comp/dashboard/DashboardKeyInfoV1';
import { DashboardKeyInfoV2 } from '../comp/dashboard/DashboardKeyInfoV2';
import ExpensesAPI from '../services/ExpensesAPI';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default function HomeScreen(props) {

    const [highlightsComponent, setHighlightsComponent] = useState(null)
    const [loading, setLoading] = useState(true)

    /**
     * Loads the settings of the user and decides which dashboard to show
     */
    const init = async () => {

        const settings = await new ExpensesAPI().getSettings(cookies.get('user').email);

        // Check if the dashboard is specified
        if (settings.dashboardHighlightsVersion && settings.dashboardHighlightsVersion == 'V2') setHighlightsComponent(<DashboardKeyInfoV2 />)
        else setHighlightsComponent(<DashboardKeyInfoV1 />)

        setLoading(false)

    }

    useEffect(init, [])

    if (loading) return <div className="screen"></div>

    return (
        <div className="screen">

            <TitleBar
                title="Payments"
                rightButton={<TotoIconButton image={(<SettingsSVG className="icon" />)} navigateTo="/settings" size="ms" borders={false} />}
            />

            {highlightsComponent}

            <div className="home-screen-h2">
                <div className="button-container"> <TotoIconButton image={(<DiceSVG className="icon" />)} navigateTo="/games" /></div>
                <div className="button-container"> <TotoIconButton image={(<TagSVG className="icon" />)} navigateTo="/tag" /></div>
                <div className="button-container"> <TotoIconButton image={(<AddSVG className="icon" />)} navigateTo="/newExpense" /></div>
                <div className="button-container"> <TotoIconButton image={(<ListSVG className="icon" />)} navigateTo="/expenses" navigationParams={{ selectedMonth: moment().format("YYYYMM") }} /></div>
                <div className="button-container"> <TotoIconButton image={(<IdeaSVG className="icon" />)} navigateTo="/insights" /></div>
            </div>

            <div className="home-graph-container">
                <PastMonthsGraph months={9} />
            </div>
        </div>
    )
}

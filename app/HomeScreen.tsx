'use client'

import { useEffect, useState } from 'react';
import moment from 'moment-timezone';

import TitleBar from '@/components/TitleBar';
import TotoIconButton from '@/components/TotoIconButton';
import PastMonthsGraph from '@/components/graphs/PastMonthsGraph';
import { DashboardKeyInfoV1 } from '@/components/dashboard/DashboardKeyInfoV1';
import { DashboardKeyInfoV2 } from '@/components/dashboard/DashboardKeyInfoV2';
import { ExpensesAPI } from '@/api/ExpensesAPI';

import './HomeScreen.css';

/**
 * Home screen: dashboard highlights, shortcuts to the main screens and the past months graph.
 */
export default function HomeScreen() {

    const [dashboardVersion, setDashboardVersion] = useState<'V1' | 'V2'>('V1')    // Which dashboard key info widget to show
    const [loading, setLoading] = useState(true)                                    // True until the settings are loaded

    /**
     * Loads the settings of the user and decides which dashboard to show
     */
    useEffect(() => {

        const init = async () => {

            const settings = await new ExpensesAPI().getSettings();

            // Check if the dashboard is specified
            setDashboardVersion(settings.dashboardHighlightsVersion === 'V2' ? 'V2' : 'V1')

            setLoading(false)
        }

        init()
    }, [])

    if (loading) return <div className="screen"></div>

    return (
        <div className="screen">

            <TitleBar
                title="Payments"
                rightButton={<TotoIconButton image="/images/settings.svg" navigateTo="/settings" size="ms" borders={false} />}
            />

            {dashboardVersion === 'V2' ? <DashboardKeyInfoV2 /> : <DashboardKeyInfoV1 />}

            <div className="home-screen-h2">
                <div className="button-container"> <TotoIconButton image="/images/dice.svg" navigateTo="/games" /></div>
                <div className="button-container"> <TotoIconButton image="/images/tag.svg" navigateTo="/tag" /></div>
                <div className="button-container"> <TotoIconButton image="/images/plus.svg" navigateTo="/newExpense" /></div>
                <div className="button-container"> <TotoIconButton image="/images/list.svg" navigateTo={"/expenses?yearMonth=" + moment().format("YYYYMM")} /></div>
                <div className="button-container"> <TotoIconButton image="/images/idea-heart.svg" navigateTo="/insights" /></div>
            </div>

            <div className="home-graph-container">
                <PastMonthsGraph months={9} />
            </div>
        </div>
    )
}

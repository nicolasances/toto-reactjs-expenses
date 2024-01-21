import './InsightsScreen.css'
import { useEffect, useState } from 'react';
import TitleBar from "../../comp/TitleBar";
import TouchableOpacity from "../../comp/TouchableOpacity";

import { ReactComponent as WarnSVG } from '../../img/warning.svg';
import { ReactComponent as ClickSVG } from '../../img/click.svg';

import ExpensesAPI from '../../services/ExpensesAPI';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { SavingsPerYearGraph } from '../../comp/graphs/SavingsPerYearGraph';
import { LifetimeSavingsBubble } from '../../comp/graphs/LifetimeSavingsBubble';
import { YearSavingsPerMonthGraph } from '../../comp/graphs/YearSavingsPerMonthGraph';

export default function InsightsScreen(props) {

    const [unconsolidatedMonths, setUnconsolidatedMonths] = useState([]);
    const [savingsPerYear, setSavingsPerYear] = useState(null);
    const [settings, setSettings] = useState(null);
    const history = useHistory();

    const init = async () => {

        if (!settings) {
            setTimeout(init, 100)
            return;
        }

        loadUnconsolidatedMonths();
        loadYearlySavings();
    }

    /**
     * Loads the user settings
     */
    const loadSettings = async () => {

        const settings = await new ExpensesAPI().getSettings()

        setSettings(settings)

    }

    /**
     * Load unconsolidated months
     */
    const loadUnconsolidatedMonths = async () => {

        const result = await new ExpensesAPI().getUnconsolidatedMonths();

        setUnconsolidatedMonths(result.unconsolidated);
    }

    /**
     * Loads the yearly savings
     */
    const loadYearlySavings = async () => {

        const result = await new ExpensesAPI().getSavingsPerYear("201801", settings.currency)

        setSavingsPerYear(result.savings);
    }

    const gotoConsolidationScreen = () => {
        history.push("/insights/consolidation")
    }

    useEffect(loadSettings, []);
    useEffect(init, [settings]);

    if (!settings) return <div className="screen"></div>

    return (
        <div className="screen insights-screen">

            <TitleBar title="Your Insights" back={true} />

            {unconsolidatedMonths.length > 0 && <WarningWidget title="Months to Consolidate" data={unconsolidatedMonths.length} onPress={gotoConsolidationScreen} />}

            <div className="insights-section row" style={{ height: '170px' }}>
                <SavingsPerYearGraph savings={savingsPerYear} currency={settings.currency} />
                <div style={{ marginLeft: "24px" }}><LifetimeSavingsBubble savings={savingsPerYear} currency={settings.currency} /></div>
            </div>

            <div className="insights-section row card" style={{ height: '140px' }}>
                <YearSavingsPerMonthGraph currency={settings.currency} />
            </div>


        </div>
    )
}

/**
 * Widget that displays a warning with a clickable behaviour
 */
function WarningWidget(props) {

    /**
     * When the warning widget is clicked..
     */
    const onClick = () => {
        if (props.onPress) props.onPress();
    }

    return (
        <TouchableOpacity className="widget raised widget-warn" onPress={onClick}>

            <div className="warn-img-container">
                <WarnSVG />
            </div>

            <div className="warn-main-body">
                <div className="warn-title">{props.title}</div>
                <div className="warn-data">{props.data}</div>
            </div>

            <div className="warn-action">
                <ClickSVG />
            </div>

        </TouchableOpacity>
    )

} 

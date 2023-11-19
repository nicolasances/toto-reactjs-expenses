import './InsightsScreen.css'
import { useEffect, useState } from 'react';
import TitleBar from "../../comp/TitleBar";
import TouchableOpacity from "../../comp/TouchableOpacity";

import { ReactComponent as WarnSVG } from '../../img/warning.svg';
import { ReactComponent as ClickSVG } from '../../img/click.svg';

import ExpensesAPI from '../../services/ExpensesAPI';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default function InsightsScreen(props) {

    const [unconsolidatedMonths, setUnconsolidatedMonths] = useState([]);
    const history = useHistory();

    /**
     * Load unconsolidated months
     */
    const loadUnconsolidatedMonths = async () => {
        const result = await new ExpensesAPI().getUnconsolidatedMonths();

        setUnconsolidatedMonths(result.unconsolidated);
    }

    const gotoConsolidationScreen = () => {
        history.push("/insights/consolidation")
    }

    useEffect(loadUnconsolidatedMonths, []);

    return (
        <div className="screen insights-screen">

            <TitleBar title="Your Insights" back={true} />

            {unconsolidatedMonths.length > 0 && <WarningWidget title="Months to Consolidate" data={unconsolidatedMonths.length} onPress={gotoConsolidationScreen} />}

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

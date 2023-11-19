import { useEffect, useState } from "react";
import moment from "moment-timezone";
import Cookies from "universal-cookie";

import './ConsolidationInsightsScreen.css'

import TitleBar from "../../../comp/TitleBar";
import ExpensesAPI from "../../../services/ExpensesAPI";
import TouchableOpacity from "../../../comp/TouchableOpacity";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const cookies = new Cookies();

export default function ConsolidationInsightsScreen(props) {

    const [unconsolidatedMonths, setUnconsolidatedMonths] = useState([]);
    const [settings, setSettings] = useState();

    /**
     * Load unconsolidated months
    */
   const loadUnconsolidatedMonths = async () => {
       if (!settings) return;
        const result = await new ExpensesAPI().getUnconsolidatedMonths(settings.currency);
        setUnconsolidatedMonths(result.unconsolidated);
    }

    /**
     * Loads the user settings
     */
    const loadSettings = async () => {
        const settings = await new ExpensesAPI().getSettings(cookies.get("user").email);
        setSettings(settings);
    }

    useEffect(loadSettings, []);
    useEffect(loadUnconsolidatedMonths, [settings]);

    return (
        <div className="screen cons-insights-screen">

            <TitleBar title={`Months to consolidate (${unconsolidatedMonths.length})`} back={true} />

            <BarList months={unconsolidatedMonths} />

        </div>
    )
}

/**
 * Displays the list of all bars for the unconsolidated months
 */
function BarList(props) {

    const unconsolidatedMonths = props.months ? props.months : [];

    let maxAmount = 0;
    if (unconsolidatedMonths.length > 1) {
        const maxAmountObj = unconsolidatedMonths.reduce((max, cur) => { return cur.totalAmount > max.totalAmount ? cur : max }, unconsolidatedMonths[0])
        maxAmount = maxAmountObj.totalAmount;
    }

    return (
        <div className="unconsolidated-list">
            {
                unconsolidatedMonths.map((month) => {
                    return (
                        <Bar yearMonth={month.yearMonth} amount={month.totalAmount} key={Math.random()} currency={month.currency} maxAmount={maxAmount} />
                    )
                })
            }
        </div>
    )
}

/**
 * Displays the bar for a specific month.
 * The bar length is proportional to the sum of expenses in the month
 */
function Bar(props) {

    const history = useHistory();

    const max = props.maxAmount;
    const percWidthThreshold = 25;

    const gotoExpenses = () => {    
        history.push(`/expenses?yearMonth=${props.yearMonth}`)
    }

    const calcWidth = (amount) => {

        const percWidth = amount * 100 / max;

        return percWidth;
    }

    const barWidth = calcWidth(props.amount)
    const monthLabel = moment(props.yearMonth + "01", "YYYYMMDD").format("MMM. YYYY");
    const currency = (props.currency == 'DKK' ? "kr." : (props.currency == "EUR" ? "€" : props.currency))

    return (
        <TouchableOpacity className="unconsolidated-month-bar-container" onPress={gotoExpenses}>
            <div className={`unconsolidated-month-bar`} style={{ width: `${barWidth}vw` }}>
                {barWidth >= percWidthThreshold && <div className="unconsolidated-month-label">{monthLabel}</div>}
            </div>
            {barWidth < percWidthThreshold &&
                <div className="unconsolidated-month-label">{monthLabel}</div>
            }
            <div className="unconsolidated-amount">
                <span className="currency">{currency}</span>{props.amount.toLocaleString("it", { maximumFractionDigits: 2 })}
            </div>
        </TouchableOpacity>
    )

}
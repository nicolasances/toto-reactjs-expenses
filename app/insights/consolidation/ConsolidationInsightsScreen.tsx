'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment-timezone';

import './ConsolidationInsightsScreen.css';

import TitleBar from '@/components/TitleBar';
import TouchableOpacity from '@/components/TouchableOpacity';
import { ExpensesAPI } from '@/api/ExpensesAPI';
import { Settings } from '@/model/settings';

/**
 * A month that still has unconsolidated transactions
 */
interface UnconsolidatedMonth {
    yearMonth: string;      // YYYYMM
    totalAmount: number;    // Sum of the expenses of the month
    currency: string;       // ISO currency code
}

/**
 * Screen listing the months that still have to be consolidated
 */
export default function ConsolidationInsightsScreen() {

    const [unconsolidatedMonths, setUnconsolidatedMonths] = useState<UnconsolidatedMonth[]>([]);
    const [settings, setSettings] = useState<Settings>();

    // Loads the user settings
    useEffect(() => {

        const loadSettings = async () => {
            const loadedSettings = await new ExpensesAPI().getSettings();
            setSettings(loadedSettings);
        };

        loadSettings();
    }, []);

    // Loads the unconsolidated months, once the settings are available
    useEffect(() => {

        if (!settings) return;

        const loadUnconsolidatedMonths = async () => {
            const result = await new ExpensesAPI().getUnconsolidatedMonths(settings.currency);
            setUnconsolidatedMonths(result.unconsolidated);
        };

        loadUnconsolidatedMonths();
    }, [settings]);

    return (
        <div className="screen cons-insights-screen">

            <TitleBar title={`Months to consolidate (${unconsolidatedMonths.length})`} back={true} />

            <BarList months={unconsolidatedMonths} />

        </div>
    );
}

/**
 * Props of the BarList
 */
interface BarListProps {
    months?: UnconsolidatedMonth[];     // The unconsolidated months
}

/**
 * Displays the list of all bars for the unconsolidated months
 */
function BarList({ months }: BarListProps) {

    const unconsolidatedMonths = months ? months : [];

    let maxAmount = 0;
    if (unconsolidatedMonths.length > 1) {
        const maxAmountObj = unconsolidatedMonths.reduce((max, cur) => { return cur.totalAmount > max.totalAmount ? cur : max; }, unconsolidatedMonths[0]);
        maxAmount = maxAmountObj.totalAmount;
    }

    return (
        <div className="unconsolidated-list">
            {
                unconsolidatedMonths.map((month) => {
                    return (
                        <Bar yearMonth={month.yearMonth} amount={month.totalAmount} key={Math.random()} currency={month.currency} maxAmount={maxAmount} />
                    );
                })
            }
        </div>
    );
}

/**
 * Props of the Bar
 */
interface BarProps {
    yearMonth: string;      // The month, YYYYMM
    amount: number;         // Total of the month
    currency: string;       // ISO currency code
    maxAmount: number;      // Largest amount among all months (defines the 100% width)
}

/**
 * Displays the bar for a specific month.
 * The bar length is proportional to the sum of expenses in the month
 */
function Bar({ yearMonth, amount, currency, maxAmount }: BarProps) {

    const router = useRouter();

    const percWidthThreshold = 25;

    /**
     * Opens the expenses of the month
     */
    const gotoExpenses = () => {
        router.push(`/expenses?yearMonth=${yearMonth}`);
    };

    const calcWidth = (value: number) => {

        const percWidth = value * 100 / maxAmount;

        return percWidth;
    };

    const barWidth = calcWidth(amount);
    const monthLabel = moment(yearMonth + "01", "YYYYMMDD").format("MMM. YYYY");
    const currencyLabel = (currency == 'DKK' ? "kr." : (currency == "EUR" ? "€" : currency));

    return (
        <TouchableOpacity className="unconsolidated-month-bar-container" onPress={gotoExpenses}>
            <div className={`unconsolidated-month-bar`} style={{ width: `${barWidth}vw` }}>
                {barWidth >= percWidthThreshold && <div className="unconsolidated-month-label">{monthLabel}</div>}
            </div>
            {barWidth < percWidthThreshold &&
                <div className="unconsolidated-month-label">{monthLabel}</div>
            }
            <div className="unconsolidated-amount">
                <span className="currency">{currencyLabel}</span>{amount.toLocaleString("it", { maximumFractionDigits: 2 })}
            </div>
        </TouchableOpacity>
    );
}

'use client';

import './InsightsScreen.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MaskedSvgIcon } from 'toto-react';
import TitleBar from '@/components/TitleBar';
import TouchableOpacity from '@/components/TouchableOpacity';
import { ExpensesAPI } from '@/api/ExpensesAPI';
import { Settings } from '@/model/settings';
import { SavingEntry } from '@/model/stats';
import { SavingsPerYearGraph } from '@/components/graphs/SavingsPerYearGraph';
import { LifetimeSavingsBubble } from '@/components/graphs/LifetimeSavingsBubble';
import { YearSavingsPerMonthGraph } from '@/components/graphs/YearSavingsPerMonthGraph';
import { MonthlyCategorySpending } from '@/components/graphs/MonthlyCategorySpending';

/**
 * Screen with the insights of the user: savings per year, per month and monthly category spending.
 */
export default function InsightsScreen() {

    const [unconsolidatedMonths, setUnconsolidatedMonths] = useState<any[]>([]);
    const [savingsPerYear, setSavingsPerYear] = useState<SavingEntry[]>();
    const [settings, setSettings] = useState<Settings | null>(null);
    const router = useRouter();

    // Loads the user settings
    useEffect(() => {

        const loadSettings = async () => {
            const loadedSettings = await new ExpensesAPI().getSettings();
            setSettings(loadedSettings);
        };

        loadSettings();
    }, []);

    // Once the settings are available, loads the unconsolidated months and the yearly savings
    useEffect(() => {

        if (!settings) return;

        const loadUnconsolidatedMonths = async () => {
            const result = await new ExpensesAPI().getUnconsolidatedMonths(settings.currency);
            setUnconsolidatedMonths(result.unconsolidated);
        };

        const loadYearlySavings = async () => {
            const result = await new ExpensesAPI().getSavingsPerYear("201801", settings.currency);
            setSavingsPerYear(result.savings);
        };

        loadUnconsolidatedMonths();
        loadYearlySavings();
    }, [settings]);

    /**
     * Opens the screen with the months to consolidate
     */
    const gotoConsolidationScreen = () => {
        router.push("/insights/consolidation");
    };

    if (!settings) return <div className="screen"></div>;

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

            <div className="insights-section row" style={{ height: '240px' }}>
                <MonthlyCategorySpending currency={settings.currency} monthsDepth={9} />
            </div>

        </div>
    );
}

/**
 * Props of the WarningWidget
 */
interface WarningWidgetProps {
    title: string;              // Title of the warning
    data: number;               // Number displayed under the title
    onPress?: () => void;       // Called when the widget is clicked
}

/**
 * Widget that displays a warning with a clickable behaviour
 */
function WarningWidget({ title, data, onPress }: WarningWidgetProps) {

    /**
     * When the warning widget is clicked..
     */
    const onClick = () => {
        if (onPress) onPress();
    };

    return (
        <TouchableOpacity className="widget raised widget-warn" onPress={onClick}>

            <div className="warn-img-container">
                <MaskedSvgIcon src="/images/warning.svg" alt="warning" size="w-8 h-8" color="bg-toto-background" />
            </div>

            <div className="warn-main-body">
                <div className="warn-title">{title}</div>
                <div className="warn-data">{data}</div>
            </div>

            <div className="warn-action">
                <MaskedSvgIcon src="/images/click.svg" alt="open" size="w-5 h-5" color="bg-toto-background" />
            </div>

        </TouchableOpacity>
    );
}

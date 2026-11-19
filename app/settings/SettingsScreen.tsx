'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import TitleBar from '@/components/TitleBar';
import TotoIconButton from '@/components/TotoIconButton';
import CurrencySwitcher from '@/components/CurrencySwitcher';
import Checkbox from '@/components/Checkbox';
import { ExpensesAPI } from '@/api/ExpensesAPI';
import { APP_VERSION } from '@/Config';

import './SettingsScreen.css';

/**
 * Settings screen: displayed currency, app version and home screen dashboard version.
 */
export default function SettingsScreen() {

    const router = useRouter();

    const [currency, setCurrency] = useState<string>('EUR')                                                          // Displayed currency
    const [dashboardHighlightsVersion, setDashboardHighlightsVersion] = useState<string | undefined>('V1')          // Dashboard key info version

    /**
     * Load the user settings
     */
    useEffect(() => {

        const load = async () => {

            const settings = await new ExpensesAPI().getSettings()

            setCurrency(settings.currency)
            setDashboardHighlightsVersion(settings.dashboardHighlightsVersion)
        }

        load()
    }, [])

    /**
     * Save the settings and go back
     */
    const save = async () => {

        // Update the Settings
        await new ExpensesAPI().putSettings({
            currency: currency,
            dashboardHighlightsVersion: dashboardHighlightsVersion
        })

        // Go back
        router.back();
    }

    return (
        <div className="screen settings-screen">
            <TitleBar title="App Settings" back={true} />

            <Setting label="Displayed Currency">
                <CurrencySwitcher onCurrencyChange={(c: string) => { setCurrency(c) }} />
            </Setting>
            <Setting label="App Version">
                <Text>{APP_VERSION}</Text>
            </Setting>
            <Setting label="Home Screen">
                <Checkbox label="Show Savings in Home screen" flag={dashboardHighlightsVersion === 'V2'} onToggleFlag={() => { setDashboardHighlightsVersion(dashboardHighlightsVersion === 'V1' ? 'V2' : 'V1') }} />
            </Setting>

            <div style={{ display: 'flex', flex: 1 }}></div>

            <div className="button-container">
                <div style={{ marginLeft: 6, marginRight: 6 }}><TotoIconButton image="/images/tick.svg" onPress={save} /></div>
            </div>
        </div>
    )
}

/**
 * Properties of a Setting row
 */
interface SettingProps {
    label: string;                      // Label of the setting
    children: React.ReactNode;          // The control of the setting
}

/**
 * A labeled row of the settings screen
 */
function Setting({ label, children }: SettingProps) {

    return (
        <div className="setting-container">
            <div className="label">{label}</div>
            <div className="currency-container">
                {children}
            </div>
        </div>
    )
}

/**
 * Properties of a Text
 */
interface TextProps {
    children: React.ReactNode;          // The text to show
}

/**
 * Read-only text of the settings screen
 */
function Text({ children }: TextProps) {

    return (
        <div className="setting-text">{children}</div>
    )
}

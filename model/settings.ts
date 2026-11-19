/**
 * User settings of the expenses app.
 */
export interface Settings {
    currency: string;                       // The user's preferred currency (ISO code)
    dashboardHighlightsVersion?: string;    // Which version of the dashboard key info widget to show
    [key: string]: any;                     // Other settings
}

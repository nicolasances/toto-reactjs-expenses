export const APIS = {
  expenses: process.env.REACT_APP_EXPENSES_API_ENDPOINT, 
  expensesV2: process.env.REACT_APP_EXPENSES_V2_API_ENDPOINT, 
  auth: process.env.REACT_APP_AUTH_API_ENDPOINT,
  expcat: process.env.REACT_APP_EXPCAT_API_ENDPOINT, 
  games: process.env.REACT_APP_GAMES_API_ENDPOINT, 
}

export const APP_VERSION = "1.9.0"


export const EVENTS = {
  userInfoChanged: 'userInfoChanged', // User info received from Google
  expenseCreated: 'expenseCreated', // An expense has been created
  expenseDeleted: 'expenseDeleted', // An expense has been deleted
  expenseUpdated: 'expenseUpdated', // An expense has been updated
  settingsUpdated: 'settingsUpdated', // the settings have been updated
  appSettingsUpdated: 'appSettingsUpdated', // THE APP SETTINGS HAVE BEEN UPATED
  demoFinished: 'demoFinished', // the demo is finished
}

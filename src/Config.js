export const APIS = {
  expenses: process.env.REACT_APP_EXPENSES_API_ENDPOINT
}


export const EVENTS = {
  userInfoChanged: 'userInfoChanged', // User info received from Google
  expenseCreated: 'expenseCreated', // An expense has been created
  expenseDeleted: 'expenseDeleted', // An expense has been deleted
  expenseUpdated: 'expenseUpdated', // An expense has been updated
  settingsUpdated: 'settingsUpdated', // the settings have been updated
  appSettingsUpdated: 'appSettingsUpdated', // THE APP SETTINGS HAVE BEEN UPATED
  demoFinished: 'demoFinished', // the demo is finished
}

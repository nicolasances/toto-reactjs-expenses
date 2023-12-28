import TotoAPI from './TotoAPI';

export default class GamesAPI {

  /**
   * Tags the expense
   * @param {string} expenseId id of the expense being tagged
   * @param {string} tagId tqg to add to the expense
   */
  async uploadKud(year, month, kudFile) {

    const formData = new FormData()
    formData.append('file', kudFile);
    formData.append('year', year);
    formData.append('month', month);

    return new TotoAPI().fetch('games', '/games/kuddoc/upload', {
      method: 'POST',
      body: formData
    }).then((response) => response.json());

  }

  /**
   * Signals that a KUD is missing and that the user won't be able to upload it
   * @param {string} year the year
   * @param {string} month the last month of the KUD
   */
  async signalMissingKud(year, month) {

    return new TotoAPI().fetch('games', '/games/kuddoc/missing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ year: year, month: month })
    }).then((response) => response.json());

  }

  /**
   * Gets any Game status
   * 
   * @param {string} gameId the id of the game (e.g. rekoncile, cattie, kupload...)
   */
  async getGameStatus(gameId) {

    return new TotoAPI().fetch('games', `/games/${gameId}`).then((response) => response.json());

  }

  /**
   * Gets the next round for the Rekoncile Game
   * 
   * @param roundsToSkip (default null) pass a number, if you want to skip some expenses
   * 
   * @returns 
   */
  async getRekoncileNextRound(roundsToSkip) {

    return new TotoAPI().fetch('games', `/games/rekoncile/next?roundsToSkip=${roundsToSkip}`).then((response) => response.json());

  }

  /**
   * Posts a reconciliation to the Rekoncile Game
   * 
   * @param {*} kudPayment the kud payment  
   * @param {*} totoTransaction the toto transaction
   * @returns 
   */
  async postRekonciliation(kudPayment, totoTransaction) {

    return new TotoAPI().fetch('games', '/games/rekoncile/reconciliations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        kudPayment: kudPayment,
        totoTransaction: totoTransaction
      })
    }).then((response) => response.json());

  }

  /**
   * Creates a TotoExpense with the proivded Kud Payment and 
   * reconciles the two automatically
   * 
   * @param {*} kudPayment the kud payment  
   * @returns 
   */
  async createTotoExpenseAndReconcile(kudPayment) {

    return new TotoAPI().fetch('games', '/games/rekoncile/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ kudPayment: kudPayment })
    }).then((response) => response.json());

  }

  /**
   * Invalidates the kud payment
   * @param {*} kudPayment the kyd pyament
   * @returns 
   */
  async invalidateKudPayment(kudPayment) {

    return new TotoAPI().fetch('games', '/games/rekoncile/invalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ kudTransactionId: kudPayment.id })
    }).then((response) => response.json());


  }

  /**
   * Retrieves the overview of all games and the player's level
   * @returns the Games Overview
   */
  async getGamesOverview() {

    return new TotoAPI().fetch('games', `/games`).then((response) => response.json());

  }

  /**
   * Retrieves the next round of Cattie Game
   */
  async getCattieNextRound() {

    return new TotoAPI().fetch('games', `/games/cattie/next`).then((response) => response.json());

  }

  /**
   * Submit a chosen category in the Cattie game
   * 
   * @param totoExpense the toto expense, as received from the backend
   * @param chosenCategory the user-chosen category
   */
  async submitCattieChoice(totoExpense, chosenCategory) {

    return new TotoAPI().fetch('games', '/games/cattie/selections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ expense: totoExpense, chosenCategory: chosenCategory })
    }).then((response) => response.json());

  }


}

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

  async getKuploadGameStatus() {

    return new TotoAPI().fetch('games', `/games/kupload`)
      .then((response) => response.json());

  }

  /**
   * Retrieves the overview of all games and the player's level
   * @returns the Games Overview
   */
  async getGamesOverview() {

    return new TotoAPI().fetch('games', `/games`).then((response) => response.json());

  }

}

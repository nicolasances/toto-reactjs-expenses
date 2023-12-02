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

  getKuploadGameStatus() {

    return new TotoAPI().fetch('games', `/games/kupload`)
      .then((response) => response.json());

  }

}

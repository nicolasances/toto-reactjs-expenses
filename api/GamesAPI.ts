import { TotoAPI, jsonRequest } from './TotoAPI';
import { Expense } from '@/model/expense';
import { CattieRound, GamesOverview, GamesWriteResponse, GameStatus, InkomeRound, KudIncome, KudPayment, RekoncileRound, TotoTransaction } from '@/model/games';

/**
 * API to access the games microservice.
 *
 * Endpoints, query strings and payloads are the same as in the pre-TypeScript app.
 */
export class GamesAPI {

  /**
   * Uploads a KUD (bank statement) document.
   *
   * @param {string} year the year of the KUD
   * @param {string} month the last month of the KUD
   * @param {File} kudFile the document
   */
  async uploadKud(year: string, month: string, kudFile: File): Promise<GamesWriteResponse> {

    const formData = new FormData();
    formData.append('file', kudFile);
    formData.append('year', year);
    formData.append('month', month);

    // No headers: the browser sets the multipart Content-Type (with boundary) itself
    return new TotoAPI().fetchJson('games', '/games/kuddoc/upload', { method: 'POST', body: formData });
  }

  /**
   * Signals that a KUD is missing and that the user won't be able to upload it.
   *
   * @param {string} year the year
   * @param {string} month the last month of the KUD
   */
  async signalMissingKud(year: string, month: string): Promise<GamesWriteResponse> {

    return new TotoAPI().fetchJson('games', '/games/kuddoc/missing', jsonRequest('POST', { year: year, month: month }));
  }

  /**
   * Gets any Game status.
   *
   * @param {string} gameId the id of the game (e.g. rekoncile, cattie, kupload...)
   */
  async getGameStatus<T = GameStatus>(gameId: string): Promise<T> {

    return new TotoAPI().fetchJson('games', `/games/${gameId}`);
  }

  /**
   * Gets the next round for the Rekoncile Game.
   *
   * @param {number} roundsToSkip the number of rounds to skip, if you want to skip some expenses
   */
  async getRekoncileNextRound(roundsToSkip: number): Promise<RekoncileRound> {

    return new TotoAPI().fetchJson('games', `/games/rekoncile/next?roundsToSkip=${roundsToSkip}`);
  }

  /**
   * Gets the next round for the Inkome Game.
   *
   * @param {number} roundsToSkip the number of rounds to skip, if you want to skip some incomes
   */
  async getInkomeNextRound(roundsToSkip: number): Promise<InkomeRound> {

    return new TotoAPI().fetchJson('games', `/games/inkome/next?roundsToSkip=${roundsToSkip}`);
  }

  /**
   * Posts a reconciliation to the Rekoncile Game.
   *
   * @param {KudPayment} kudPayment the kud payment
   * @param {TotoTransaction} totoTransaction the toto transaction
   */
  async postRekonciliation(kudPayment: KudPayment, totoTransaction: TotoTransaction): Promise<GamesWriteResponse> {

    return new TotoAPI().fetchJson('games', '/games/rekoncile/reconciliations', jsonRequest('POST', {
      kudPayment: kudPayment,
      totoTransaction: totoTransaction
    }));
  }

  /**
   * Posts a reconciliation to the Inkome Game.
   *
   * @param {KudIncome} kudIncome the kud income
   * @param {TotoTransaction} totoTransaction the toto transaction
   * @param {string} category the chosen category for the income
   */
  async postIncomeReconciliation(kudIncome: KudIncome, totoTransaction: TotoTransaction, category: string): Promise<GamesWriteResponse> {

    return new TotoAPI().fetchJson('games', '/games/inkome/reconciliations', jsonRequest('POST', {
      kudIncome: kudIncome,
      totoTransaction: totoTransaction,
      category: category
    }));
  }

  /**
   * Creates a TotoExpense with the provided Kud Payment and reconciles the two automatically.
   *
   * @param {KudPayment} kudPayment the kud payment
   */
  async createTotoExpenseAndReconcile(kudPayment: KudPayment): Promise<GamesWriteResponse> {

    return new TotoAPI().fetchJson('games', '/games/rekoncile/expenses', jsonRequest('POST', { kudPayment: kudPayment }));
  }

  /**
   * Creates a TotoIncome with the provided Kud Income and reconciles the two automatically.
   *
   * @param {KudIncome} kudIncome the kud income
   * @param {string} category the chosen category for the income
   */
  async createTotoIncomeAndReconcile(kudIncome: KudIncome, category: string): Promise<GamesWriteResponse> {

    return new TotoAPI().fetchJson('games', '/games/inkome/incomes', jsonRequest('POST', {
      kudIncome: kudIncome,
      category: category
    }));
  }

  /**
   * Invalidates the kud payment.
   *
   * @param {KudPayment} kudPayment the kud payment
   */
  async invalidateKudPayment(kudPayment: KudPayment): Promise<GamesWriteResponse> {

    return new TotoAPI().fetchJson('games', '/games/rekoncile/invalidate', jsonRequest('POST', { kudTransactionId: kudPayment.id }));
  }

  /**
   * Invalidates the kud income.
   *
   * @param {KudIncome} kudIncome the kud income
   */
  async invalidateKudIncome(kudIncome: KudIncome): Promise<GamesWriteResponse> {

    return new TotoAPI().fetchJson('games', '/games/inkome/invalidate', jsonRequest('POST', { kudTransactionId: kudIncome.id }));
  }

  /**
   * Retrieves the overview of all games and the player's level.
   */
  async getGamesOverview(): Promise<GamesOverview> {

    return new TotoAPI().fetchJson('games', `/games`);
  }

  /**
   * Retrieves the next round of Cattie Game.
   */
  async getCattieNextRound(): Promise<CattieRound> {

    return new TotoAPI().fetchJson('games', `/games/cattie/next`);
  }

  /**
   * Submit a chosen category in the Cattie game.
   *
   * @param {Expense} totoExpense the toto expense, as received from the backend
   * @param {string} chosenCategory the user-chosen category
   */
  async submitCattieChoice(totoExpense: Expense, chosenCategory: string): Promise<GamesWriteResponse> {

    return new TotoAPI().fetchJson('games', '/games/cattie/selections', jsonRequest('POST', { expense: totoExpense, chosenCategory: chosenCategory }));
  }

}

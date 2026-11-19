/**
 * Data model of the Toto Games API (microservice "games").
 *
 * Fields were inferred from how the pre-TypeScript screens used them. Fields marked optional are
 * either genuinely optional or not confirmed against the backend: verify them before relying on them.
 */

import { Expense, Income } from '@/model/expense';

/**
 * A payment found in the user's bank statement (KUD, "kontoudskrift").
 */
export interface KudPayment {
    id: string;                     // Id of the KUD transaction
    date: string;                   // Date of the payment, YYYYMMDD
    text: string;                   // Text of the payment, as written in the statement
    amount: number;                 // Amount of the payment
    currency?: string;              // ISO currency code
    [key: string]: any;             // Other fields returned by the backend (sent back as they are)
}

/**
 * An income found in the user's bank statement (KUD, "kontoudskrift").
 */
export interface KudIncome {
    id: string;                     // Id of the KUD transaction
    date: string;                   // Date of the income, YYYYMMDD
    text: string;                   // Text of the income, as written in the statement
    amount: number;                 // Amount of the income
    currency?: string;              // ISO currency code
    [key: string]: any;             // Other fields returned by the backend (sent back as they are)
}

/**
 * A Toto transaction (expense or income) that can be reconciled with a KUD transaction.
 */
export type TotoTransaction = Expense | Income;

/**
 * Next round of the Rekoncile game.
 */
export interface RekoncileRound {
    kudPayment: KudPayment;         // The KUD payment to reconcile
    candidates: Expense[];          // Toto expenses that may match the KUD payment
}

/**
 * Next round of the Inkome game.
 */
export interface InkomeRound {
    kudIncome: KudIncome;           // The KUD income to reconcile
    candidates: Income[];           // Toto incomes that may match the KUD income
}

/**
 * Next round of the Cattie game.
 */
export interface CattieRound {
    transaction: Expense;           // The expense whose category has to be confirmed
    suggestedCategory: string;      // Category code suggested by Toto
}

/**
 * A KUD that the user has not uploaded yet.
 */
export interface MissingKud {
    year: number | string;          // Year of the KUD
    month: number | string;         // Last month covered by the KUD (1-12, possibly not zero-padded)
}

/**
 * Score of a player in a game, or overall.
 */
export interface GameProgress {
    score: number;                  // Points scored
    maxScore: number;               // Maximum achievable points
    percCompletion: number;         // Completion, in percentage
}

/**
 * Status of a game, as returned by GET /games/{gameId}.
 */
export interface GameStatus extends Partial<GameProgress> {
    finished?: boolean;             // True if there is nothing left to play
    [key: string]: any;             // Game-specific fields
}

/**
 * Status of the Kupload game.
 */
export interface KuploadGameStatus extends GameProgress {
    missingKuds: MissingKud[];      // KUDs still to be uploaded, the first one is the next round
    numMissingKuds: number;         // Number of missing KUDs
    finished?: boolean;             // True if there is nothing left to play
}

/**
 * Status of a game inside the games overview.
 */
export interface GameStatusEntry {
    gameKey: string;                // Id of the game: kupload, rekoncile, cattie or inkome
    gameStatus: GameStatus;         // Status of the game
}

/**
 * A player level.
 */
export interface Level {
    id: string;                     // Id of the level (fishy, monkey, cake, birdie, robot, rocket, galaxy, heavenly)
    title: string;                  // Name of the level
    desc: string;                   // Description of the level
}

/**
 * Points that delimit a level.
 */
export interface LevelPoints {
    minScore: number;               // Score at which the level starts
    passScore: number;              // Score needed to reach the next level
}

/**
 * The player's level and progress.
 */
export interface PlayerLevel {
    level: Level;                   // Current level
    progress: GameProgress;         // Overall score of the player
    levelPoints: LevelPoints;       // Points of the current level
}

/**
 * Overview of all games and of the player's level.
 */
export interface GamesOverview {
    playerLevel: PlayerLevel;       // The player's level and progress
    gamesStatuses: GameStatusEntry[];   // Status of every game
}

/**
 * Generic response of the games write calls (reconciliations, invalidations, uploads...).
 */
export interface GamesWriteResponse {
    [key: string]: any;             // Fields returned by the API
}

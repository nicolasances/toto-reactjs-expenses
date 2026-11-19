'use client';

import TitleBar from '@/components/TitleBar';
import './RekoncileGameScreen.css';
import { GamesAPI } from "@/api/GamesAPI";
import { Expense } from '@/model/expense';
import { GamesOverview, RekoncileRound } from '@/model/games';

import { useEffect, useRef, useState } from 'react';
import ExpenseListItem from '@/components/ExpenseListItem';
import categoriesMap from '@/utils/CategoriesMap';
import TotoList, { TotoListRowData } from '@/components/TotoList';
import MonkeyLoader from '@/components/MonkeyLoader';
import PlayerProgressWidget from '../widgets/PlayerProgressWidget';
import { LevelUpWidget } from '../widgets/LevelUpWidget';
import { GameFinished } from '../widgets/GameFinished';
import RekoncileOption from '../widgets/RekoncileOption';

/**
 * The Rekoncile game: the user matches a bank statement payment with a Toto expense
 */
export default function RekoncileGameScreen() {

    const [loading, setLoading] = useState(false);
    const [creatingExpense, setCreatingExpense] = useState(false);
    const [overview, setOverview] = useState<GamesOverview>();
    const [roundData, setRoundData] = useState<RekoncileRound>();
    const [roundsToSkip, setRoundsToSkip] = useState(0);
    const [playerLevelId, setPlayerLevelId] = useState<string | null>(null);
    const [levelUp, setLevelUp] = useState(false);
    const [finished, setFinished] = useState(false);

    const previousPlayerLevelId = useRef<string | null | undefined>(undefined);

    /**
     * Loads the games overview, including the player's level
     */
    const loadOverview = async () => {

        const loadedOverview = await new GamesAPI().getGamesOverview();

        setOverview(loadedOverview);

        previousPlayerLevelId.current = playerLevelId;

        setPlayerLevelId(loadedOverview.playerLevel.level.id);

        // Check if the game is finished
        for (const game of loadedOverview.gamesStatuses) {

            if (game.gameKey == 'rekoncile') setFinished(!!game.gameStatus.finished);
        }
    };

    /**
     * Loads the next round of this game.
     *
     * If there are rounds to skip, it will pass that number to the backend
     * in order to skip all the Kud Transactions that the user can't reconcile
     */
    const loadNextRound = async (loaderSensitivity?: number) => {

        // Set Loading only if the loading is slower than 300ms
        const loadingTimer = setTimeout(() => { setLoading(true); }, loaderSensitivity ? loaderSensitivity : 300);

        // Load the game status
        const nextRound = await new GamesAPI().getRekoncileNextRound(roundsToSkip);

        // Clear the timeout if it hasn't triggered yet
        clearTimeout(loadingTimer);

        // Set the Round Data
        if (nextRound && nextRound.kudPayment) setRoundData(nextRound);

        // Stop the loading
        setLoading(false);
    };

    /**
     * When the candidate is selected, this method will send the information back to
     * the Game backend and move to the next round.
     *
     * @param {Expense} candidate the selected candidate
     */
    const onCandidateSelected = async (candidate: Expense) => {

        const gamesAPI = new GamesAPI();

        // Pass the candidate to the backend
        await gamesAPI.postRekonciliation(roundData!.kudPayment, candidate);

        // Update the score
        loadOverview();

        // Move to the next round
        loadNextRound();
    };

    /**
     * When the user cannot reconcile, and wants to pass this round to go to the next one
     */
    const onPass = () => {

        // Increase the number of rounds to skip
        setRoundsToSkip((prev) => prev + 1);
    };

    /**
     * When the user decides to create a Toto Expense because of missing candidates
     */
    const onCreateExpense = async () => {

        // Set Loading only if the loading is slower than 300ms
        const loadingTimer = setTimeout(() => { setCreatingExpense(true); }, 400);

        // Create the expense, passing the Kud Payment
        await new GamesAPI().createTotoExpenseAndReconcile(roundData!.kudPayment);

        // Clear the timeout if it hasn't triggered yet
        clearTimeout(loadingTimer);

        // Stop loading
        setCreatingExpense(false);

        // Update the score
        loadOverview();

        // Move to the next round
        loadNextRound(700);
    };

    /**
     * Invalidates the current kud payment
     */
    const onInvalidate = async () => {

        // Invalidate the Kud Payment
        await new GamesAPI().invalidateKudPayment(roundData!.kudPayment);

        // Update the score
        loadOverview();

        // Move to the next round
        loadNextRound(700);
    };

    /**
     * Extractor
     */
    const dataExtractor = (item: Expense): TotoListRowData<Expense> => {

        let currency = item.currency;
        if (item.currency === 'EUR') currency = '€';
        else if (item.currency === 'DKK') currency = 'kr.';

        // Highlights
        const highlights: NonNullable<TotoListRowData<Expense>['highlights']> = [];

        return {
            avatar: {
                type: 'image' as const,
                value: item.category ? categoriesMap.get(item.category)!.icon : undefined,
                size: 'l' as const
            },
            date: { date: item.date },
            title: item.description,
            monthly: item.monthly,
            amount: currency + ' ' + item.amount.toLocaleString('it', { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
            highlights: highlights
        };
    };

    // Initial load: the player level (the first round is loaded by the roundsToSkip effect below)
    useEffect(() => {
        loadOverview();
    }, []);

    // Loads a round at start and every time the user skips one
    useEffect(() => {
        loadNextRound();
    }, [roundsToSkip]);

    // Checks whether a level up animation is needed and controls it
    useEffect(() => {

        // If we just loaded for the first time the current status, no level up occurred
        if (previousPlayerLevelId.current == null) return;

        // If the player level did not change, no animation is needed
        if (previousPlayerLevelId.current == playerLevelId) return;

        console.log("Level Up occurred!");

        // Trigger the animation
        setLevelUp(true);
    }, [playerLevelId]);

    return (
        <div className="screen rekoncile-screen">

            <TitleBar title="The ReKoncile Game" back={true}></TitleBar>

            <LevelUpWidget level={overview ? overview.playerLevel.level.title : ""} show={levelUp} onClose={() => { setLevelUp(false); }} />

            {overview && overview.playerLevel &&
                <div className="progress-container">
                    <PlayerProgressWidget label="Your Overall Score" progress={overview.playerLevel.progress} levelPoints={overview.playerLevel.levelPoints} />
                </div>
            }

            {!loading && finished && <GameFinished />}

            {!loading && !finished && roundData &&
                <div className="game-body">

                    <div className="goal">Find a match for the following transaction</div>

                    <ExpenseListItem data={{
                        avatar: {
                            value: '/images/question.svg',
                            size: 'l'
                        },
                        date: {
                            date: roundData.kudPayment.date,
                            showYear: true
                        },
                        title: roundData.kudPayment.text,
                        amount: roundData.kudPayment.amount
                    }} />

                    <div className="candidates-container">
                        <div className="title">{roundData.candidates.length > 0 ? "Choose among these candidates" : (creatingExpense ? "Creating the Toto Expense..." : "No candidates, but ask me to create the Toto Expense!")}</div>

                        {creatingExpense &&
                            <div className="buttons-container">
                                <MonkeyLoader fill="var(--color-dark-primary)" />
                            </div>
                        }

                        <div className="list-container">
                            {!creatingExpense &&
                                <TotoList
                                    data={roundData.candidates}
                                    dataExtractor={dataExtractor}
                                    onPress={onCandidateSelected}
                                />
                            }
                        </div>

                        {!creatingExpense &&
                            <div className="options-container">
                                <RekoncileOption
                                    title="Create it"
                                    text="None of the candidates fits. Create a new one."
                                    image="/images/plus.svg"
                                    onPress={onCreateExpense}
                                />
                                <RekoncileOption
                                    title="Skip"
                                    text="I'm not really sure, just skip it for now."
                                    image="/images/next.svg"
                                    secondary={true}
                                    onPress={onPass}
                                />
                                <RekoncileOption
                                    title="Invalid"
                                    text="I don't want this payment to be tracked."
                                    image="/images/trash.svg"
                                    tertiary={true}
                                    onPress={onInvalidate}
                                />
                            </div>
                        }

                    </div>

                </div>
            }

        </div>
    );
}

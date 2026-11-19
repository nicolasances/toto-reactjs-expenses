'use client';

import './InkomeGameScreen.css';
// The option boxes of this game use the "rekoncile-option" class, styled in the Rekoncile screen's CSS
import '../rekoncile/RekoncileGameScreen.css';
import { GamesAPI } from "@/api/GamesAPI";
import { Income } from '@/model/expense';
import { InkomeRound } from '@/model/games';

import { useEffect, useRef, useState } from 'react';
import ExpenseListItem from '@/components/ExpenseListItem';
import TotoList, { TotoListRowData } from '@/components/TotoList';
import MonkeyLoader from '@/components/MonkeyLoader';
import { GenericGameScreen, GenericGameScreenHandle } from '../GenericGameScreen';
import CategoryPicker from '@/components/categorypicker/CategoryPicker';
import RekoncileOption from '../widgets/RekoncileOption';

const ACTIONS = {
    create: "create",
    reconcile: "reconcile"
};

/**
 * The Inkome game: the user matches a bank statement income with a Toto income
 */
export default function InkomeGameScreen() {

    const [loading, setLoading] = useState(false);
    const [creatingIncome, setCreatingIncome] = useState(false);
    const [roundData, setRoundData] = useState<InkomeRound>();
    const [roundsToSkip, setRoundsToSkip] = useState(0);
    const [category, setCategory] = useState("VARIE");
    const [action, setAction] = useState<string | null>(null);
    const [chosenCandidate, setChosenCandidate] = useState<Income | null>(null);

    const genericScreenRef = useRef<GenericGameScreenHandle>(null);

    /**
     * Loads the next round of this game.
     *
     * If there are rounds to skip, it will pass that number to the backend
     * in order to skip all the Kud Transactions that the user can't reconcile
     */
    const loadNextRound = async (loaderSensitivity?: number) => {

        // Reset Data
        setChosenCandidate(null);
        setAction(null);
        setCategory("VARIE");

        // Set Loading only if the loading is slower than 300ms
        const loadingTimer = setTimeout(() => { setLoading(true); }, loaderSensitivity ? loaderSensitivity : 300);

        // Load the game status
        const nextRound = await new GamesAPI().getInkomeNextRound(roundsToSkip);

        // Clear the timeout if it hasn't triggered yet
        clearTimeout(loadingTimer);

        // Set the Round Data
        if (nextRound && nextRound.kudIncome) setRoundData(nextRound);

        genericScreenRef.current?.loadOverview();

        // Stop the loading
        setLoading(false);
    };

    /**
     * When the candidate is selected, the user is asked to choose the category
     *
     * @param {Income} candidate the selected candidate
     */
    const onCandidateSelected = async (candidate: Income) => {

        // Update the candidate
        setChosenCandidate(candidate);

        // Set the chosen action
        setAction(ACTIONS.reconcile);
    };

    /**
     * When the user cannot reconcile, and wants to pass this round to go to the next one
     */
    const onPass = () => {

        // Increase the number of rounds to skip
        setRoundsToSkip((prev) => prev + 1);
    };

    /**
     * When the user decides to create a Toto Income because of missing candidates
     */
    const onCreateIncome = async () => {

        // Set the user chosen action to "create"
        setAction(ACTIONS.create);
    };

    /**
     * Invalidates the current kud income
     */
    const onInvalidate = async () => {

        // Invalidate the Kud Income
        await new GamesAPI().invalidateKudIncome(roundData!.kudIncome);

        // Move to the next round
        loadNextRound(700);
    };

    /**
     * When the user selects a category, the following happens:
     * - The category is updated
     * - The chosen action (create expense or reconcile) is executed
     * - The chosen category is passed alongisde the action
     */
    const onChooseCategory = async (chosenCategory: string) => {

        // Update the category
        setCategory(chosenCategory);

        // Execute the action based on the chosen action (create or reconcile)
        if (action == ACTIONS.create) createIncome(chosenCategory);
        else if (action == ACTIONS.reconcile) reconcileIncome(chosenCategory);
    };

    /**
     * Creates the income in Toto and reconciles it
     *
     * @param {string} chosenCategory the chosen category
     */
    const createIncome = async (chosenCategory: string) => {

        // Set Loading only if the loading is slower than 300ms
        const loadingTimer = setTimeout(() => { setCreatingIncome(true); }, 400);

        // Create the income, passing the Kud Income
        await new GamesAPI().createTotoIncomeAndReconcile(roundData!.kudIncome, chosenCategory);

        // Clear the timeout if it hasn't triggered yet
        clearTimeout(loadingTimer);

        // Stop loading
        setCreatingIncome(false);

        // Move to the next round
        loadNextRound(700);
    };

    /**
     * Reconciles the income with the chosen candidate
     *
     * @param {string} chosenCategory the chosen category
     */
    const reconcileIncome = async (chosenCategory: string) => {

        // Set Loading only if the loading is slower than 300ms
        const loadingTimer = setTimeout(() => { setCreatingIncome(true); }, 400);

        // Pass the candidate to the backend
        await new GamesAPI().postIncomeReconciliation(roundData!.kudIncome, chosenCandidate!, chosenCategory);

        // Clear the timeout if it hasn't triggered yet
        clearTimeout(loadingTimer);

        // Move to the next round
        loadNextRound(700);
    };

    /**
     * Extractor
     */
    const dataExtractor = (item: Income): TotoListRowData<Income> => {

        let currency = item.currency;
        if (item.currency === 'EUR') currency = '€';
        else if (item.currency === 'DKK') currency = 'kr.';

        return {
            avatar: {
                type: 'image' as const,
                value: '/images/question.svg',
                size: 'l' as const
            },
            date: { date: item.date },
            title: item.description,
            amount: currency + ' ' + item.amount.toLocaleString('it', { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
        };
    };

    // Loads a round at start and every time the user skips one
    useEffect(() => {
        loadNextRound();
    }, [roundsToSkip]);

    return (
        <GenericGameScreen title="The Inkome Game" key="inkome" ref={genericScreenRef}>

            {!loading && roundData &&
                <div className="inkome-screen">

                    <div className="goal">Find a match for the following transaction</div>

                    <ExpenseListItem data={{
                        avatar: {
                            value: '/images/question.svg',
                            size: 'l'
                        },
                        date: {
                            date: roundData.kudIncome.date,
                            showYear: true
                        },
                        title: roundData.kudIncome.text,
                        amount: roundData.kudIncome.amount
                    }} />

                    {!action &&
                        <div className="candidates-container">
                            <div className="title">{roundData.candidates.length > 0 ? "Choose among these candidates" : (creatingIncome ? "Creating the Toto Expense..." : "No candidates, but ask me to create the Toto Expense!")}</div>

                            {creatingIncome &&
                                <div className="buttons-container">
                                    <MonkeyLoader fill="var(--color-dark-primary)" />
                                </div>
                            }

                            <div className="list-container">
                                {!creatingIncome &&
                                    <TotoList
                                        data={roundData.candidates}
                                        dataExtractor={dataExtractor}
                                        onPress={onCandidateSelected}
                                    />
                                }
                            </div>

                            {!creatingIncome &&
                                <div className="options-container">
                                    <RekoncileOption
                                        title="Create it"
                                        text="None of the candidates fits. Create a new one."
                                        image="/images/plus.svg"
                                        onPress={onCreateIncome}
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
                    }

                    {action &&
                        <div className="category-selection">
                            <CategoryPicker
                                category={category}
                                label="Choose the category"
                                income={true}
                                onCategoryChange={onChooseCategory}
                            />
                        </div>
                    }

                </div>
            }

        </GenericGameScreen>
    );
}

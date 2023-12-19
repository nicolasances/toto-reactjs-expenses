import TitleBar from '../../../comp/TitleBar'
import './RekoncileGameScreen.css'
import GamesAPI from "../../../services/GamesAPI"

import { ReactComponent as AddSVG } from '../../../img/plus.svg'
import { ReactComponent as QuestionSVG } from '../../../img/question.svg'
import { ReactComponent as NextSVG } from '../../../img/next.svg'

import TouchableOpacity from '../../../comp/TouchableOpacity'
import { useEffect, useRef, useState } from 'react';
import moment from 'moment-timezone'
import TotoIconButton from '../../../comp/TotoIconButton'
import GameSummary from '../widgets/GameStatusWidget'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import ExpenseListItem from '../../../comp/ExpenseListItem'
import categoriesMap from '../../../services/CategoriesMap'
import TotoList from '../../../comp/TotoList'
import TotoButton from '../../../comp/TotoButton'
import MonkeyLoader from '../../../comp/MonkeyLoader'

const Status = {
    notUploaded: "not-uploaded",
    uploading: "uploading",
    uploaded: "uploaded"
}

const padMonth = (month) => {
    if (String(month).trim().length == 1) return `0${month}`
    return month;
}

export default function RekoncileGameScreen(props) {

    // State variable: status of the upload
    const [loading, setLoading] = useState(false);
    const [creatingExpense, setCreatingExpense] = useState(false)
    const [gameStatus, setGameStatus] = useState({ score: 0, maxScore: 0, percCompletion: 0, missingKuds: [], numMissingKuds: 0 })
    const [roundData, setRoundData] = useState()
    const [roundsToSkip, setRoundsToSkip] = useState(0)

    const history = useHistory();

    /**
     * Load the game
     * Load the next round of the game
     */
    const initialLoad = async () => {

        // Update the Game Status
        updateScore();

        // Load the game and the next round
        loadNextRound();

    }

    /**
     * Update the game score
     * To do that, the method reloads the game and update the score
     */
    const updateScore = async () => {

        // Load the game status
        const status = await new GamesAPI().getRekoncileGameStatus();

        // Update the status
        setGameStatus(status);

    }

    /**
     * Loads the next round of this game. 
     * 
     * If there are rounds to skip, it will pass that number to the backend
     * in order to skip all the Kud Transactions that the user can't reconcile
     */
    const loadNextRound = async (loaderSensitivity) => {

        // Set Loading only if the loading is slower than 300ms 
        const loadingTimer = setTimeout(() => { setLoading(true) }, loaderSensitivity ? loaderSensitivity : 300)

        // Load the game status
        const nextRound = await new GamesAPI().getRekoncileNextRound(roundsToSkip)

        // Clear the timeout if it hasn't triggered yet
        clearTimeout(loadingTimer)

        // Set the Round Data
        setRoundData(nextRound);

        // Stop the loading 
        setLoading(false)

    }

    /**
     * When the candidate is selected, this method will send the information back to
     * the Game backend and move to the next round.
     * 
     * @param {object} candidate the selected candidate
     */
    const onCandidateSelected = async (candidate) => {

        const gamesAPI = new GamesAPI()

        // Pass the candidate to the backend
        await gamesAPI.postRekonciliation(roundData.kudPayment, candidate)

        // Update the score
        updateScore()

        // Move to the next round
        loadNextRound()
    }

    /**
     * When the user cannot reconcile, and wants to pass this round to go to the next one
     */
    const onPass = () => {

        // Increase the number of rounds to skip
        setRoundsToSkip((prev) => prev + 1);

    }

    /**
     * When the user decides to create a Toto Expense because of missing candidates
     */
    const onCreateExpense = async () => {

        // Set Loading only if the loading is slower than 300ms 
        const loadingTimer = setTimeout(() => { setCreatingExpense(true) }, 400)

        // Create the expense, passing the Kud Payment
        await new GamesAPI().createTotoExpenseAndReconcile(roundData.kudPayment)

        // Clear the timeout if it hasn't triggered yet
        clearTimeout(loadingTimer)

        // Stop loading
        setCreatingExpense(false);

        // Update the score
        updateScore();

        // Move to the next round
        loadNextRound(700)

    }

    useEffect(initialLoad, [])
    useEffect(loadNextRound, [roundsToSkip])

    /**
     * Extractor
     */
    const dataExtractor = (item) => {

        let currency = item.currency;
        if (item.currency === 'EUR') currency = '€';
        else if (item.currency === 'DKK') currency = 'kr.'

        // Highlights
        let highlights = [];

        return {
            avatar: {
                type: 'image',
                value: item.category ? categoriesMap.get(item.category).image : null,
                size: 'l'
            },
            date: { date: item.date },
            title: item.description,
            monthly: item.monthly,
            amount: currency + ' ' + item.amount.toLocaleString('it', { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
            highlights: highlights
        }

    }

    return (
        <div className="screen rekoncile-screen">

            <TitleBar title="The ReKoncile Game" back={true}></TitleBar>

            <GameSummary loading={loading} score={gameStatus.score} total={gameStatus.maxScore} goal={`Keep reKonciling transactions!`} />

            {!loading && roundData &&
                <div className="game-body">

                    <div className="goal">Find a match for the following transaction</div>

                    <ExpenseListItem data={{
                        avatar: {
                            type: 'image',
                            value: <QuestionSVG />,
                            size: 'l'
                        },
                        date: { date: roundData.kudPayment.date },
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
                                <TouchableOpacity className="option" onPress={onCreateExpense}>
                                    <div className="text">
                                        {roundData.candidates.length > 0 ? "If none fit, I can create a Toto Expense for you" : "Create automatically a Toto Expense"}
                                    </div>
                                    <div className="image"><TotoIconButton image={<AddSVG />} size="s" /></div>
                                </TouchableOpacity>
                                <TouchableOpacity className="option" onPress={onPass}>
                                    <div className="text">If you're not sure, you can pass for now..</div>
                                    <div className="image"><TotoIconButton image={<NextSVG />} size="s" /></div>
                                </TouchableOpacity>
                            </div>
                        }

                    </div>

                </div>
            }

        </div>
    )
}

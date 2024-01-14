import TitleBar from '../../../comp/TitleBar'
import './InkomeGameScreen.css'
import GamesAPI from "../../../services/GamesAPI"

import { ReactComponent as AddSVG } from '../../../img/plus.svg'
import { ReactComponent as QuestionSVG } from '../../../img/question.svg'
import { ReactComponent as NextSVG } from '../../../img/next.svg'
import { ReactComponent as TrashSVG } from '../../../img/trash.svg'

import TouchableOpacity from '../../../comp/TouchableOpacity'
import { useEffect, useRef, useState } from 'react';
import ExpenseListItem from '../../../comp/ExpenseListItem'
import TotoList from '../../../comp/TotoList'
import MonkeyLoader from '../../../comp/MonkeyLoader'
import { GenericGameScreen } from '../GenericGameScreen'
import CategoryPicker from '../../../comp/cateogrypicker/CategoryPicker'

const ACTIONS = {
    create: "create", 
    reconcile: "reconcile"
}

export default function InkomeGameScreen(props) {

    // State variable: status of the upload
    const [loading, setLoading] = useState(false);
    const [creatingIncome, setCreatingIncome] = useState(false)
    const [roundData, setRoundData] = useState()
    const [roundsToSkip, setRoundsToSkip] = useState(0)
    const [category, setCategory] = useState("VARIE")
    const [action, setAction] = useState(null)
    const [chosenCandidate, setChosenCandidate] = useState(null)

    const genericScreenRef = useRef()

    /**
     * Load the game
     * Load the next round of the game
     */
    const initialLoad = async () => {

        // Load the game and the next round
        loadNextRound();

    }

    /**
     * Loads the next round of this game. 
     * 
     * If there are rounds to skip, it will pass that number to the backend
     * in order to skip all the Kud Transactions that the user can't reconcile
     */
    const loadNextRound = async (loaderSensitivity) => {

        // Reset Data
        setChosenCandidate(null)
        setAction(null)
        setCategory("VARIE")

        // Set Loading only if the loading is slower than 300ms 
        const loadingTimer = setTimeout(() => { setLoading(true) }, loaderSensitivity ? loaderSensitivity : 300)

        // Load the game status
        const nextRound = await new GamesAPI().getInkomeNextRound(roundsToSkip)

        // Clear the timeout if it hasn't triggered yet
        clearTimeout(loadingTimer)

        // Set the Round Data
        if (nextRound && nextRound.kudIncome) setRoundData(nextRound);

        genericScreenRef.current.loadOverview()

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

        // Update the candidate
        setChosenCandidate(candidate)

        // Set the chosen action
        setAction(ACTIONS.reconcile)
    }

    /**
     * When the user cannot reconcile, and wants to pass this round to go to the next one
     */
    const onPass = () => {

        // Increase the number of rounds to skip
        setRoundsToSkip((prev) => prev + 1);

    }

    /**
     * When the user decides to create a Toto Income because of missing candidates
     */
    const onCreateIncome = async () => {

        // Set the user chosen action to "create"
        setAction(ACTIONS.create)

    }

    /**
     * Invalidates the current kud payment
     */
    const onInvalidate = async () => {

        // Create the expense, passing the Kud Payment
        await new GamesAPI().invalidateKudIncome(roundData.kudIncome)

        // Move to the next round
        loadNextRound(700)

    }

    /**
     * When the user selects a category, the following happens: 
     * - The category is updated
     * - The chosen action (create expense or reconcile) is executed
     * - The chosen category is passed alongisde the action
     */
    const onChooseCategory = async (chosenCategory) => {

        // Update the category
        setCategory(chosenCategory)

        // Execute the action based on the chosen action (create or reconcile)
        if (action == ACTIONS.create) createIncome(chosenCategory)
        else if (action == ACTIONS.reconcile) reconcileIncome(chosenCategory)

    }

    /**
     * Creates the income in Toto and reconciles it
     * 
     * @param {string} chosenCategory the chosen category
     */
    const createIncome = async (chosenCategory) => {

        // Set Loading only if the loading is slower than 300ms 
        const loadingTimer = setTimeout(() => { setCreatingIncome(true) }, 400)

        // Create the expense, passing the Kud Payment
        await new GamesAPI().createTotoIncomeAndReconcile(roundData.kudIncome, chosenCategory)

        // Clear the timeout if it hasn't triggered yet
        clearTimeout(loadingTimer)

        // Stop loading
        setCreatingIncome(false);

        // Move to the next round
        loadNextRound(700)
    }

    /**
     * Reconciles the income with the chosen candidate
     * 
     * @param {string} chosenCategory the chosen category
     */
    const reconcileIncome = async (chosenCategory) => {

        // Set Loading only if the loading is slower than 300ms 
        const loadingTimer = setTimeout(() => { setCreatingIncome(true) }, 400)

        // Pass the candidate to the backend
        await new GamesAPI().postIncomeReconciliation(roundData.kudIncome, chosenCandidate, chosenCategory)

        // Clear the timeout if it hasn't triggered yet
        clearTimeout(loadingTimer)

        // Move to the next round
        loadNextRound(700)
    }

    /**
     * Extractor
     */
    const dataExtractor = (item) => {

        let currency = item.currency;
        if (item.currency === 'EUR') currency = '€';
        else if (item.currency === 'DKK') currency = 'kr.'

        return {
            avatar: {
                type: 'image',
                value: <QuestionSVG />,
                size: 'l'
            },
            date: { date: item.date },
            title: item.description,
            amount: currency + ' ' + item.amount.toLocaleString('it', { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
        }

    }

    useEffect(initialLoad, [])
    useEffect(loadNextRound, [roundsToSkip])

    return (
        // <div className="screen inkome-screen">
        <GenericGameScreen title="The Inkome Game" key="inkome" ref={genericScreenRef}>

            {!loading && roundData &&
                <div className="inkome-screen">

                    <div className="goal">Find a match for the following transaction</div>

                    <ExpenseListItem data={{
                        avatar: {
                            type: 'image',
                            value: <QuestionSVG />,
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
                                        image={<AddSVG />}
                                        onPress={onCreateIncome}
                                    />
                                    <RekoncileOption
                                        title="Skip"
                                        text="I'm not really sure, just skip it for now."
                                        image={<NextSVG />}
                                        secondary={true}
                                        onPress={onPass}
                                    />
                                    <RekoncileOption
                                        title="Invalid"
                                        text="I don't want this payment to be tracked."
                                        image={<TrashSVG />}
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
    )
}


const COLORS = [
    { bck: "#FFCC70", color: "#22668D" },
    { bck: "#FFFADD", color: "#22668D" },
    { bck: "#8ECDDD", color: "#104D71" },
    { bck: "#22668D", color: "#FFCC70" },
    { bck: "#264653", color: "#e9c46a" },
    { bck: "#efd3d7", color: "#912c3b" },
    { bck: "#faa307", color: "#370617" },
    { bck: "#335c67", color: "#fff3b0" },
    { bck: "#136f63", color: "#f7dba7" }
]

const PRIMARY_COLOR = { bck: "#FFCC70", color: "#22668D" }
const SECONDARY_COLOR = { bck: "#264653", color: "#e9c46a" }
const TERTIARY_COLOR = { bck: "#22668D", color: "#FFCC70" }

/**
 * An Option box
 */
function RekoncileOption(props) {

    let color = PRIMARY_COLOR;
    if (props.secondary) color = SECONDARY_COLOR;
    else if (props.tertiary) color = TERTIARY_COLOR;

    const bck = color.bck
    const front = color.color;

    return (
        <TouchableOpacity className="rekoncile-option" style={{ backgroundColor: bck, color: front }} onPress={props.onPress}>

            <div className="icon-container">
                {props.image}
            </div>

            <div className="option-title">{props.title}</div>
            <div className="option-text">{props.text}</div>

        </TouchableOpacity>
    )

}
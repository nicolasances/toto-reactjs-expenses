import TitleBar from '../../../comp/TitleBar'
import './RekoncileGameScreen.css'
import GamesAPI from "../../../services/GamesAPI"

import { ReactComponent as AddSVG } from '../../../img/plus.svg'
import { ReactComponent as QuestionSVG } from '../../../img/question.svg'
import { ReactComponent as NextSVG } from '../../../img/next.svg'
import { ReactComponent as TrashSVG } from '../../../img/trash.svg'

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
import PlayerProgressWidget from '../widgets/PlayerProgressWidget'
import { LevelUpWidget } from '../widgets/LevelUpWidget'

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
    const [overview, setOverview] = useState();
    const [roundData, setRoundData] = useState()
    const [roundsToSkip, setRoundsToSkip] = useState(0)
    const [playerLevelId, setPlayerLevelId] = useState(null)
    const [levelUp, setLevelUp] = useState(false)

    const previousPlayerLevelId = useRef()

    /**
     * Load the game
     * Load the next round of the game
     */
    const initialLoad = async () => {

        // Get the Overall Player Level
        loadOverview();

        // Load the game and the next round
        loadNextRound();

    }

    /**
     * Loads the games overview, including the player's level
     */
    const loadOverview = async () => {

        const overview = await new GamesAPI().getGamesOverview();

        setOverview(overview)

        previousPlayerLevelId.current = playerLevelId

        setPlayerLevelId(overview.playerLevel.level.id)

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
        loadOverview()

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
        loadOverview();

        // Move to the next round
        loadNextRound(700)

    }

    /**
     * Invalidates the current kud payment
     */
    const onInvalidate = async () => {

        // Create the expense, passing the Kud Payment
        await new GamesAPI().invalidateKudPayment(roundData.kudPayment)

        // Update the score
        loadOverview();

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

    /**
     * This method checks whether a level up animation is needed and controls it
     */
    const levelUpAnimation = () => {

        // If we just loaded for the first time the current status, no level up occurred
        if (previousPlayerLevelId.current == null) return;

        // If the player level did not change, no animation is needed
        if (previousPlayerLevelId.current == playerLevelId) return;

        console.log("Level Up occurred!");

        // Trigger the animation
        setLevelUp(true)

    }

    useEffect(initialLoad, [])
    useEffect(loadNextRound, [roundsToSkip])
    useEffect(levelUpAnimation, [playerLevelId])

    return (
        <div className="screen rekoncile-screen">

            <TitleBar title="The ReKoncile Game" back={true}></TitleBar>

            <LevelUpWidget show={levelUp} onClose={() => { setLevelUp(false) }} />

            {overview && overview.playerLevel &&
                <div className="progress-container">
                    <PlayerProgressWidget label="Your Overall Score" progress={overview.playerLevel.progress} levelPoints={overview.playerLevel.levelPoints} />
                </div>
            }

            {!loading && roundData &&
                <div className="game-body">

                    <div className="goal">Find a match for the following transaction</div>

                    <ExpenseListItem data={{
                        avatar: {
                            type: 'image',
                            value: <QuestionSVG />,
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
                                    image={<AddSVG/>}
                                    onPress={onCreateExpense}
                                />
                                <RekoncileOption
                                    title="Skip"
                                    text="I'm not really sure, just skip it for now."
                                    image={<NextSVG/>}
                                    secondary={true}
                                    onPress={onPass}
                                />
                                <RekoncileOption
                                    title="Invalid"
                                    text="I don't want this payment to be tracked."
                                    image={<TrashSVG/>}
                                    tertiary={true}
                                    onPress={onInvalidate}
                                />
                                {/* <TouchableOpacity className="option" onPress={onCreateExpense}>
                                    <div className="text">
                                        {roundData.candidates.length > 0 ? "If none fit, I can create a Toto Expense for you" : "Create automatically a Toto Expense"}
                                    </div>
                                    <div className="image"><TotoIconButton image={<AddSVG />} size="s" /></div>
                                </TouchableOpacity>
                                <TouchableOpacity className="option" onPress={onPass}>
                                    <div className="text">If you're not sure, you can pass for now..</div>
                                    <div className="image"><TotoIconButton image={<NextSVG />} size="s" /></div>
                                </TouchableOpacity> */}
                            </div>
                        }

                    </div>

                </div>
            }

        </div>
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
import TitleBar from '../../../comp/TitleBar'
import './RekoncileGameScreen.css'
import GamesAPI from "../../../services/GamesAPI"

import { ReactComponent as UploadSVG } from '../../../img/upload-cloud.svg'
import { ReactComponent as TickSVG } from '../../../img/tick.svg'
import { ReactComponent as StopSVG } from '../../../img/stop.svg'
import { ReactComponent as ConfusedSVG } from '../../../img/confused.svg'
import { ReactComponent as QuestionSVG } from '../../../img/question.svg'

import TouchableOpacity from '../../../comp/TouchableOpacity'
import { useEffect, useRef, useState } from 'react';
import moment from 'moment-timezone'
import TotoIconButton from '../../../comp/TotoIconButton'
import GameSummary from '../widgets/GameStatusWidget'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import ExpenseListItem from '../../../comp/ExpenseListItem'
import categoriesMap from '../../../services/CategoriesMap'
import TotoList from '../../../comp/TotoList'

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
    const [gameStatus, setGameStatus] = useState({ score: 0, maxScore: 0, percCompletion: 0, missingKuds: [], numMissingKuds: 0 })
    const [roundData, setRoundData] = useState()

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
     * Loads the next round of this game
     */
    const loadNextRound = async () => {

        // Set Loading only if the loading is slower than 300ms 
        const loadingTimer = setTimeout(() => { setLoading(true) }, 300)

        // Load the game status
        const nextRound = await new GamesAPI().getRekoncileNextRound()

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

        // Get the updated status
        const status = await gamesAPI.getRekoncileGameStatus()

        // Update the status
        setGameStatus(status)

        // Move to the next round
        const nextRound = await gamesAPI.getRekoncileNextRound();

        // Set the new round data
        setRoundData(nextRound);
    }

    /**
     * When the user has successfully completed a game and wants to keep playing.
     * This method loads the next Kud to upload
     */
    const onContinue = () => {

        // Load the next game round
        loadNextRound();

    }

    /**
     * When the user decides to stop playing
     * Go back
     */
    const onStop = () => {

        history.goBack();

    }

    useEffect(initialLoad, [])

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
                        <div className="title">Choose among these candidates</div>
                        
                        <div className="list-container">

                            <TotoList
                                data={roundData.candidates}
                                dataExtractor={dataExtractor}
                                onPress={onCandidateSelected}
                            />

                        </div>
                    </div>

                </div>
            }

        </div>
    )
}

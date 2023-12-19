import TitleBar from '../../../comp/TitleBar'
import './KuploadGameScreen.css'
import GamesAPI from "../../../services/GamesAPI"

import { ReactComponent as UploadSVG } from '../../../img/upload-cloud.svg'
import { ReactComponent as TickSVG } from '../../../img/tick.svg'
import { ReactComponent as StopSVG } from '../../../img/stop.svg'
import { ReactComponent as ConfusedSVG } from '../../../img/confused.svg'
import { ReactComponent as PartySVG } from '../../../img/party.svg'
import { ReactComponent as FlagSVG } from '../../../img/goal.svg'
import TouchableOpacity from '../../../comp/TouchableOpacity'
import { useEffect, useRef, useState } from 'react';
import moment from 'moment-timezone'
import TotoIconButton from '../../../comp/TotoIconButton'
import GameSummary from '../widgets/GameStatusWidget'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const Status = {
    notUploaded: "not-uploaded",
    uploading: "uploading",
    uploaded: "uploaded"
}

const padMonth = (month) => {
    if (String(month).trim().length == 1) return `0${month}`
    return month;
}

export default function KuploadGameScreen(props) {

    // State variable: status of the upload
    const [uploadStatus, setUploadStatus] = useState(Status.notUploaded)
    const [loading, setLoading] = useState(false);
    const [kudDate, setKudDate] = useState({ year: "", month: "", firstDate: moment(), lastDate: moment() })
    const [gameStatus, setGameStatus] = useState({ score: 0, maxScore: 0, percCompletion: 0, missingKuds: [], numMissingKuds: 0 })
    const [finished, setFinished] = useState(false)

    const history = useHistory();

    const fileInputRef = useRef(null);

    /**
     * Load the game
     * Load the next round of the game
     */
    const initialLoad = async () => {

        // Load the game and the next round
        loadNextRound();

    }

    /**
     * Update the game score
     * To do that, the method reloads the game and update the score
     */
    const updateScore = async () => {

        // Load the game status
        const status = await new GamesAPI().getKuploadGameStatus();

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
        const status = await new GamesAPI().getKuploadGameStatus();

        // Clear the timeout if it hasn't triggered yet
        clearTimeout(loadingTimer)

        // Update the Game Status
        setGameStatus(status);

        // Stop the loading 
        setLoading(false)

        // Reset the upload Status
        setUploadStatus(Status.notUploaded);

        // Get the new date for missing kuds
        if (status && status.missingKuds && status.missingKuds.length > 1) {

            const firstMissingKud = status.missingKuds[0];
            const paddedMonth = padMonth(firstMissingKud.month);
            const fmkDate = moment(`${firstMissingKud.year}.${paddedMonth}.01`, "YYYY.MM.DD")

            setKudDate({
                year: String(firstMissingKud.year),
                month: paddedMonth,
                firstDate: fmkDate.clone().add(-2, "months"),
                lastDate: fmkDate,
            })
        }
        else {
            setFinished(true)
        }


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

    /**
     * When the user cannot find the Kud for that month
     * Move to the next available month, and tell the backend that this one is not available.
     */
    const onMissingKud = async () => {

        // Signal that the KUD is missing
        await new GamesAPI().signalMissingKud(kudDate.year, kudDate.month);

        // Load the next game round
        loadNextRound();

    }

    const onUploadPressed = () => {

        // Only allow the upload when the doc is not being uploaded or already uploaded
        if (uploadStatus == Status.notUploaded) fileInputRef.current.click();

    }

    const onFileChange = async (event) => {

        // Update the status to uploading
        setUploadStatus(Status.uploading);

        // Get the file
        const selectedFile = event.target.files[0];

        // Upload the file
        await new GamesAPI().uploadKud(kudDate.year, kudDate.month, selectedFile);

        // Update the status to uploaded
        setUploadStatus(Status.uploaded);

        // Update the game score
        updateScore();

    };

    useEffect(initialLoad, [])

    return (
        <div className="screen kupload-screen">

            <TitleBar title="The Kupload Game" back={true}></TitleBar>

            <GameSummary loading={loading} score={gameStatus.score} total={gameStatus.maxScore} goal={`You have ${gameStatus.numMissingKuds} documents to upload!`} />

            {/* <GameGoal/> */}

            {!loading &&
                <div className="game-body">
                    <div className="goal">
                        {!finished && <div className="goal-title">Upload your Kontoudskfrift for the period</div>}
                        {!finished && <div className="goal-date">{kudDate.firstDate.format("MMMM")} - {kudDate.lastDate.format("MMMM")} {kudDate.year}</div>}
                        {finished && <div className="goal-date">Well done!</div>}
                        {finished && <div className="goal-date">You don't have any more documents to upload for now!</div>}
                    </div>

                    {finished && 
                        <div className='finished'>
                            <PartySVG/>
                        </div>
                    }

                    {!finished &&
                        <div className={`kud-upload-container ${uploadStatus}`}>
                            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={onFileChange} />
                            <KudUpload onPress={onUploadPressed} status={uploadStatus} />
                        </div>
                    }

                    {!finished && uploadStatus == Status.notUploaded &&
                        <div className="actions-box">
                            <TotoIconButton image={<ConfusedSVG />} size="ms" label="It's missing" onPress={onMissingKud} />
                        </div>
                    }

                    {!finished && uploadStatus == Status.uploaded &&
                        <div className="next">
                            <div className="congrats">Congratulations!</div>
                            <div className="points">You scored 20 pts!</div>
                            <div className="question">Do you want to continue playing?</div>
                            <div className="actions-box">
                                <TotoIconButton image={<StopSVG />} size="ms" label="I'm done" onPress={onStop} />
                                <TotoIconButton image={<TickSVG />} size="ms" label="Yeah!" onPress={onContinue} />
                            </div>
                        </div>
                    }

                    <div style={{ flex: 1 }}></div>

                    <div className="buttons-container">
                        {/* {uploadStatus == Status.notUploaded && <TotoIconButton image={<QuestionSVG />} size="ms" label="How" />} */}
                    </div>

                </div>
            }

        </div>
    )
}

function GameGoal(props) {

    return (
        <div className="game-goal">
            <div className="goal-label"><FlagSVG /><div>The Game Goal</div></div>
            <div className="desc">Upload all the Kontoudskfrift documents you received on eboks so that Toto can make sure you're not missing anything!</div>
        </div>
    )
}

function KudUpload(props) {

    const onPress = () => {
        if (props.onPress) props.onPress();
    }

    let icon = <UploadSVG />
    if (props.status == Status.uploaded) icon = <TickSVG />

    let status = ""
    if (props.status == Status.uploading) status = "Uploading.."
    else if (props.status == Status.uploaded) status = "Uploaded!"

    return (
        <div className="kud-upload-area">
            <div className="kud-upload-wider-container">
                <div className="kud-upload-border">
                    <TouchableOpacity className="kud-upload" onPress={onPress}>
                        <div className="upload-icon">{icon}</div>
                    </TouchableOpacity>
                </div>
            </div>
            <div className="upload-status">
                {status}
            </div>
        </div>
    )
}
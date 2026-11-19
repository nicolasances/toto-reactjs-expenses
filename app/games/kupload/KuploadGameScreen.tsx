'use client';

import TitleBar from '@/components/TitleBar';
import './KuploadGameScreen.css';
import { GamesAPI } from '@/api/GamesAPI';
import { GamesOverview, KuploadGameStatus } from '@/model/games';

import { MaskedSvgIcon } from 'toto-react';
import TouchableOpacity from '@/components/TouchableOpacity';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import moment from 'moment-timezone';
import TotoIconButton from '@/components/TotoIconButton';
import { useRouter } from 'next/navigation';
import PlayerProgressWidget from '../widgets/PlayerProgressWidget';
import { GameFinished } from '../widgets/GameFinished';

const Status = {
    notUploaded: "not-uploaded",
    uploading: "uploading",
    uploaded: "uploaded"
};

/**
 * Pads a month with a leading zero (e.g. 3 becomes 03)
 *
 * @param month the month, as number or string
 */
const padMonth = (month: number | string): string => {
    if (String(month).trim().length == 1) return `0${month}`;
    return String(month);
};

/**
 * Period of the KUD to upload
 */
interface KudDate {
    year: string;               // The year of the KUD
    month: string;              // The last month of the KUD, zero-padded
    firstDate: moment.Moment;   // First month covered by the KUD
    lastDate: moment.Moment;    // Last month covered by the KUD
}

/**
 * The Kupload game: the user uploads the bank statements (KUD) that are still missing
 */
export default function KuploadGameScreen() {

    // State variable: status of the upload
    const [uploadStatus, setUploadStatus] = useState(Status.notUploaded);
    const [loading, setLoading] = useState(false);
    const [overview, setOverview] = useState<GamesOverview>();
    const [kudDate, setKudDate] = useState<KudDate>({ year: "", month: "", firstDate: moment(), lastDate: moment() });
    const [finished, setFinished] = useState(false);

    const router = useRouter();

    const fileInputRef = useRef<HTMLInputElement>(null);

    /**
     * Update the game score
     * To do that, the method reloads the game and update the score
     */
    const updateScore = async () => {

        const loadedOverview = await new GamesAPI().getGamesOverview();

        setOverview(loadedOverview);
    };

    /**
     * Loads the next round of this game
     */
    const loadNextRound = async () => {

        // Set Loading only if the loading is slower than 300ms
        const loadingTimer = setTimeout(() => { setLoading(true); }, 300);

        // Load the game status
        const status = await new GamesAPI().getGameStatus<KuploadGameStatus>("kupload");

        // Clear the timeout if it hasn't triggered yet
        clearTimeout(loadingTimer);

        // Stop the loading
        setLoading(false);

        // Reset the upload Status
        setUploadStatus(Status.notUploaded);

        // Get the new date for missing kuds
        if (status && status.missingKuds && status.missingKuds.length > 0) {

            const firstMissingKud = status.missingKuds[0];
            const paddedMonth = padMonth(firstMissingKud.month);
            const fmkDate = moment(`${firstMissingKud.year}.${paddedMonth}.01`, "YYYY.MM.DD");

            setKudDate({
                year: String(firstMissingKud.year),
                month: paddedMonth,
                firstDate: fmkDate.clone().add(-2, "months"),
                lastDate: fmkDate,
            });
        }
        else {
            setFinished(true);
        }
    };

    /**
     * When the user has successfully completed a game and wants to keep playing.
     * This method loads the next Kud to upload
     */
    const onContinue = () => {

        // Load the next game round
        loadNextRound();
    };

    /**
     * When the user decides to stop playing
     * Go back
     */
    const onStop = () => {

        router.back();
    };

    /**
     * When the user cannot find the Kud for that month
     * Move to the next available month, and tell the backend that this one is not available.
     */
    const onMissingKud = async () => {

        // Signal that the KUD is missing
        await new GamesAPI().signalMissingKud(kudDate.year, kudDate.month);

        // Load the next game round
        loadNextRound();
    };

    /**
     * When the upload area is pressed: opens the file selection
     */
    const onUploadPressed = () => {

        // Only allow the upload when the doc is not being uploaded or already uploaded
        if (uploadStatus == Status.notUploaded) fileInputRef.current?.click();
    };

    /**
     * When a file has been selected: uploads it
     */
    const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {

        // Update the status to uploading
        setUploadStatus(Status.uploading);

        // Get the file
        const selectedFile = event.target.files![0];

        // Upload the file
        await new GamesAPI().uploadKud(kudDate.year, kudDate.month, selectedFile);

        // Update the status to uploaded
        setUploadStatus(Status.uploaded);

        // Update the game score
        updateScore();
    };

    // Initial load: the score and the next round
    useEffect(() => {
        updateScore();
        loadNextRound();
    }, []);

    return (
        <div className="screen kupload-screen">

            <TitleBar title="The Kupload Game" back={true}></TitleBar>

            {overview && overview.playerLevel &&
                <div className="progress-container">
                    <PlayerProgressWidget label="Your Overall Score" progress={overview.playerLevel.progress} levelPoints={overview.playerLevel.levelPoints} />
                </div>
            }

            {!loading &&
                <div className="game-body">
                    <div className="goal">
                        {!finished && <div className="goal-title">Upload your Kontoudskfrift for the period</div>}
                        {!finished && <div className="goal-date">{kudDate.firstDate.format("MMMM")} - {kudDate.lastDate.format("MMMM")} {kudDate.year}</div>}
                    </div>

                    {finished &&
                        <GameFinished />
                    }

                    {!finished &&
                        <div className={`kud-upload-container ${uploadStatus}`}>
                            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={onFileChange} />
                            <KudUpload onPress={onUploadPressed} status={uploadStatus} />
                        </div>
                    }

                    {!finished && uploadStatus == Status.notUploaded &&
                        <div className="actions-box">
                            <TotoIconButton image="/images/confused.svg" size="ms" label="It's missing" onPress={onMissingKud} />
                        </div>
                    }

                    {!finished && uploadStatus == Status.uploaded &&
                        <div className="next">
                            <div className="congrats">Congratulations!</div>
                            <div className="points">You scored 20 pts!</div>
                            <div className="question">Do you want to continue playing?</div>
                            <div className="actions-box">
                                <TotoIconButton image="/images/stop.svg" size="ms" label="I'm done" onPress={onStop} />
                                <TotoIconButton image="/images/tick.svg" size="ms" label="Yeah!" onPress={onContinue} />
                            </div>
                        </div>
                    }

                </div>
            }

        </div>
    );
}

/**
 * Props of the KudUpload
 */
interface KudUploadProps {
    onPress?: () => void;       // Called when the upload area is pressed
    status: string;             // Upload status: not-uploaded, uploading or uploaded
}

/**
 * The upload area, with the upload status
 */
function KudUpload({ onPress: onPressProp, status: uploadStatus }: KudUploadProps) {

    /**
     * When the area is pressed
     */
    const onPress = () => {
        if (onPressProp) onPressProp();
    };

    const uploaded = uploadStatus == Status.uploaded;

    let status = "";
    if (uploadStatus == Status.uploading) status = "Uploading..";
    else if (uploaded) status = "Uploaded!";

    return (
        <div className="kud-upload-area">
            <div className="kud-upload-wider-container">
                <div className="kud-upload-border">
                    <TouchableOpacity className="kud-upload" onPress={onPress}>
                        <div className="upload-icon">
                            <MaskedSvgIcon
                                src={uploaded ? "/images/tick.svg" : "/images/upload-cloud.svg"}
                                alt={uploaded ? "uploaded" : "upload"}
                                size="w-16 h-16"
                                color={uploaded ? "bg-white/80" : "bg-toto-background"}
                            />
                        </div>
                    </TouchableOpacity>
                </div>
            </div>
            <div className="upload-status">
                {status}
            </div>
        </div>
    );
}

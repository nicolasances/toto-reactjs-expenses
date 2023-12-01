import TitleBar from '../../../comp/TitleBar'
import './KuploadGameScreen.css'
import GamesAPI from "../../../services/GamesAPI"

import { ReactComponent as UploadSVG } from '../../../img/upload-cloud.svg'
import { ReactComponent as TickSVG } from '../../../img/tick.svg'
import TouchableOpacity from '../../../comp/TouchableOpacity'
import { useRef, useState } from 'react';

const Status = {
    notUploaded: "not-uploaded",
    uploading: "uploading",
    uploaded: "uploaded"
}

export default function KuploadGameScreen(props) {

    const year = "2018";
    const month = "03"

    const [uploadStatus, setUploadStatus] = useState(Status.notUploaded)

    const fileInputRef = useRef(null);

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
        await new GamesAPI().uploadKud(year, month, selectedFile);

        // Update the status to uploaded
        setUploadStatus(Status.uploaded);

    };

    return (
        <div className="screen kupload-screen">

            <TitleBar title="The Kupload Game" back={true}></TitleBar>

            <div className="game-body">
                <div className="goal">
                    <div className="goal-title">Upload your Kontoudskfrift for the period</div>
                    <div className="goal-date">July-September 2023</div>
                </div>

                <div className={`kud-upload-container ${uploadStatus}`}>
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={onFileChange} />
                    <KudUpload onPress={onUploadPressed} status={uploadStatus} />
                </div>

                <div className="instructions">
                    <div className="instructions-title">How?</div>
                    <div className="text">It's easy, follow these simple steps!</div>
                    <ol>
                        <li>Go on eboks</li>
                        <li>Look for the Kontoudskfrift document that you received around September 2023<br />The document will contain all transactions occurred in July, August and September 2023.
                        </li>
                        <li>Download the document</li>
                        <li>Upload it here by clicking on the button above</li>
                    </ol>
                </div>

            </div>

        </div>
    )
}

function KudUpload(props) {

    const onPress = () => {
        if (props.onPress) props.onPress();
    }

    let icon = <UploadSVG />
    if (props.status == Status.uploaded) icon = <TickSVG />

    return (
        <div className="kud-upload-wider-container">
            <div className="kud-upload-border">
                <TouchableOpacity className="kud-upload" onPress={onPress}>
                    <div className="upload-icon">{icon}</div>
                </TouchableOpacity>
            </div>
        </div>
    )
}
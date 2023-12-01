import './GamesScreen.css'
import TitleBar from "../../comp/TitleBar";

import { ReactComponent as UploadSVG } from '../../img/upload.svg'
import TouchableOpacity from '../../comp/TouchableOpacity';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default function GamesScreen(props) {

    return (
        <div className="screen games-screen">

            <TitleBar title="Toto Games" back={true} />

            <div className="games-container">
                <Game gamePage="kupload" />
            </div>

        </div>
    )
}

function Game(props) {

    const history = useHistory()

    const onPress = () => {
        if (props.gamePage) history.push(`/games/${props.gamePage}`)
    }

    return (
        <TouchableOpacity className="game" onPress={onPress}>

            <div className="image-container">
                <UploadSVG />
            </div>

            <div className="title-container">
                <b>The Kupload</b> Game
            </div>

        </TouchableOpacity>
    )
}
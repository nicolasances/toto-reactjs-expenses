import './GamesScreen.css'
import TitleBar from "../../comp/TitleBar";

import { ReactComponent as UploadSVG } from '../../img/upload.svg'
import TouchableOpacity from '../../comp/TouchableOpacity';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import PlayerLevelWidget from './widgets/PlayerLevelWidget';
import GamesAPI from '../../services/GamesAPI';
import { useEffect, useState } from 'react';

const COLORS = [
    {bck: "#FFCC70", color: "#22668D"}, 
    {bck: "#FFFADD", color: "#22668D"}, 
    {bck: "#8ECDDD", color :"#22668D"}, 
    {bck: "#22668D", color: "#FFCC70"}
]

export default function GamesScreen(props) {

    const [overview, setOverview] = useState();

    const initialLoad = async () => {

        const overview = await new GamesAPI().getGamesOverview();

        setOverview(overview)

    }

    useEffect(initialLoad, []);

    return (
        <div className="screen games-screen">

            <TitleBar title="Toto Games" back={true} />

            {overview != null &&
                <div className="content">
                    <PlayerLevelWidget playerLevel={overview.playerLevel} />

                    <div className="games-container">
                        <Game gamePage="kupload"  />
                    </div>
                </div>
            }

        </div>
    )
}

function Game(props) {

    const history = useHistory()

    const onPress = () => {
        if (props.gamePage) history.push(`/games/${props.gamePage}`)
    }

    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const bck = color.bck
    const front = color.color;

    return (
        <TouchableOpacity className="game" onPress={onPress}  >

            <div className="image-container" style={{color: front, backgroundColor: bck}}>
                <UploadSVG />
            </div>

            <div className="title-container" >
                <b>The Kupload</b> Game
            </div>

        </TouchableOpacity>
    )
}
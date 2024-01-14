import './GamesScreen.css'
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import { ReactComponent as UploadSVG } from '../../img/games/games/kupload.svg'
import { ReactComponent as RekoncileSVG } from '../../img/games/games/rekoncile.svg'
import { ReactComponent as CattieSVG } from '../../img/cat.svg'
import { ReactComponent as InkomeSVG } from '../../img/games/games/inkome.svg'

import monkeyZenAnimation from '../../lottie/anim-zen-monkey.json'

import Lottie from "lottie-react";
import GamesAPI from '../../services/GamesAPI';
import TitleBar from "../../comp/TitleBar";
import TouchableOpacity from '../../comp/TouchableOpacity';
import PlayerLevelWidget from './widgets/PlayerLevelWidget';
import PlayerProgressWidget from './widgets/PlayerProgressWidget';

const COLORS = [
    { bck: "#FFCC70", color: "#22668D" },
    { bck: "#FFFADD", color: "#22668D" },
    { bck: "#8ECDDD", color: "#22668D" },
    { bck: "#22668D", color: "#FFCC70" },
    { bck: "#FFCC70", color: "#22668D" },
    { bck: "#A94438", color: "#E4DEBE" },
    { bck: "#B138D0", color: "#FFE7C1" },
]

const GAME_LABELS = {
    kupload: "The Kupload",
    rekoncile: "Rekoncile",
    cattie: "The Cattie", 
    inkome: "Inkome"
}

const GAME_IMAGES = {
    kupload: <UploadSVG />,
    rekoncile: <RekoncileSVG />,
    cattie: <CattieSVG />, 
    inkome: <InkomeSVG />
}

export default function GamesScreen(props) {

    const [overview, setOverview] = useState();
    const [loading, setLoading] = useState(false)

    const initialLoad = async () => {

        const timer = setTimeout(() => { setLoading(true) }, 600)

        const overview = await new GamesAPI().getGamesOverview();

        clearTimeout(timer);

        setOverview(overview)

        setLoading(false)

    }

    useEffect(initialLoad, []);

    return (
        <div className="screen games-screen">

            <TitleBar title="Toto Games" back={true} />

            {overview == null && loading &&
                <div className="content">
                    <div className="loading-container">
                        <Lottie animationData={monkeyZenAnimation} loop={true} autoplay={true} />
                    </div>
                    <div className="loading-title">Your games are loading..</div>
                </div>
            }

            {overview != null &&
                <div className="content">

                    <PlayerLevelWidget playerLevel={overview.playerLevel} />

                    <PlayerProgressWidget progress={overview.playerLevel.progress} levelPoints={overview.playerLevel.levelPoints} lottieOn={false} />

                    <div className="games-section">
                        <div className="title">Available Games</div>

                        <div className="games-container">
                            {overview && overview.gamesStatuses.map((game) => {
                                if (!game.gameStatus.finished) {
                                    return (
                                        <Game gamePage={game.gameKey} gameName={GAME_LABELS[game.gameKey]} image={GAME_IMAGES[game.gameKey]} key={Math.random()} />
                                    )
                                }
                            })}
                        </div>
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

            <div className="image-container" style={{ color: front, backgroundColor: bck }}>
                {props.image}
            </div>

            <div className="title-container" >
                <b>{props.gameName}</b> Game
            </div>

        </TouchableOpacity>
    )
}
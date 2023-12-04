import './PlayerLevelWidget.css'
import { ReactComponent as FishSVG } from '../../../img/games/fishy.svg'
import { ReactComponent as MonkeySVG } from '../../../img/games/monkey.svg'
import { ReactComponent as CakeSVG } from '../../../img/games/cake.svg'

const IMAGES = {
    fishy: { img: <FishSVG /> },
    monkey: { img: <MonkeySVG /> },
    cake: { img: <CakeSVG /> },
}

export default function PlayerLevelWidget(props) {

    const playerLevel = props.playerLevel.level;

    const icon = IMAGES[playerLevel.id]

    return (
        <div className="player-level-widget">

            <div className="icon-container">
                <div className="icon-border">
                    <div className="icon">{icon.img}</div>
                </div>
            </div>

            <div className="text-container">
                <div className="title">{playerLevel.title}</div>
                <div className="desc">{playerLevel.desc}</div>
            </div>
        </div>
    )

}
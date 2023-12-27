import './PlayerLevelWidget.css'
import { ReactComponent as FishSVG } from '../../../img/games/fishy.svg'
import { ReactComponent as MonkeySVG } from '../../../img/games/monkey.svg'
import { ReactComponent as CakeSVG } from '../../../img/games/cake.svg'
import { ReactComponent as BirdieSVG } from '../../../img/games/bird.svg'
import { ReactComponent as RobotSVG } from '../../../img/games/robot.svg'
import { ReactComponent as RocketSVG } from '../../../img/games/rocket.svg'
import { ReactComponent as GalaxySVG } from '../../../img/games/galaxy.svg'
import { ReactComponent as HeavenlySVG } from '../../../img/games/heavenly.svg'

const IMAGES = {
    fishy: { img: <FishSVG /> },
    monkey: { img: <MonkeySVG /> },
    cake: { img: <CakeSVG /> },
    birdie: { img: <BirdieSVG /> },
    robot: { img: <RobotSVG /> },
    rocket: { img: <RocketSVG /> },
    galaxy: { img: <GalaxySVG /> },
    heavenly: { img: <HeavenlySVG /> },
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
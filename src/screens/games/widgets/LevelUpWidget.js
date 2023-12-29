import Lottie from "lottie-react";
import levelUpAnimation from '../../../lottie/anim-level-up.json';
import './LevelUpWidget.css';
import { useEffect, useRef } from "react";
import TotoIconButton from "../../../comp/TotoIconButton";
import { ReactComponent as CloseSVG } from '../../../img/close.svg'

/**
 * Widget that shows a Level Up Animation
 * --------------------------------------------
 * Properties: 
 * 
 *  - show           : (boolean, default false). Shows the animation
 *  - level          : (string, mandatory). The name (label) of the level that the player just reached
 * 
 *  - onClose        : (callback, mandatory). Called when the close button is pressed
 * 
 */
export function LevelUpWidget(props, ref) {

    const lottieRef = useRef(null)

    if (!props.show) return (<div></div>)

    return (
        <div className="level-up-widget">

            <Lottie
                lottieRef={lottieRef}
                animationData={levelUpAnimation}
                loop={true}
                autoplay={true}
            />

            <div className="lup" >
                Level Up!
            </div>

            <div className="desc">
                <p>Congratulations!</p>
                <p>You have leveled up your Data Quality!<br/> You have now reached level </p>
                <p className="big">{props.level}</p>
            </div>

            <div style={{ flex: 1 }}></div>

            <div className="buttons">
                <TotoIconButton image={<CloseSVG />} onPress={props.onClose} />
            </div>

        </div>
    )
}
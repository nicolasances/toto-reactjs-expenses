import Lottie from 'lottie-react'
import monkeyDanceAnimation from '../../../lottie/anim-happy.json'
import successAnim from '../../../lottie/anim-success.json'
import './GameFinished.css'

export function GameFinished(props) {

    return (
        <div className="game-finished">

            <div className="main">
                <div className="anim">
                    <Lottie animationData={successAnim} />
                </div>
                <div className="text">The Game is Finished!</div>
                <div className="subtext">(for now..)</div>
            </div>

            <div className="finished-monkey">
                <Lottie animationData={monkeyDanceAnimation} loop={true} />
            </div>

        </div>
    )
}
'use client';

import Lottie from 'lottie-react';
import monkeyDanceAnimation from '@/assets/lottie/anim-happy.json';
import successAnim from '@/assets/lottie/anim-success.json';
import './GameFinished.css';

/**
 * Widget shown when the game has no more rounds to play
 */
export function GameFinished() {

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
    );
}

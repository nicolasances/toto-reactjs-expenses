import './GameStatusWidget.css'

import { ReactComponent as RunningSVG } from '../../../img/running.svg'
import { useEffect, useRef, useState } from 'react';

export default function GameSummary(props) {

    const icon = <RunningSVG />

    const progressRef = useRef(null);

    const completion = (100 * props.score / props.total);
    const loading = props.loading;

    // Animate the progress bar
    useEffect(() => {

        const timeoutId = setTimeout(() => {
            if (progressRef.current) {
                progressRef.current.style.width = `${completion}%`;
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    })

    return (
        <div className="gamesummary">
            <div className="score-box">
                {loading && <div className="progress loading"></div>}
                {!loading && <div className="progress" ref={progressRef} style={{ width: '0%', transition: 'width 1s ease-in-out' }}></div>}
                <div className="icon-box">
                    {icon}
                </div>
                <div className="score">
                    <div className="current">{loading ? ".." : props.score}</div> <div className="total">/ {loading ? ".." : props.total} pts</div>
                </div>
                <div className="text-box">
                    {loading ? "Loading.." : props.goal}
                </div>
            </div>
        </div>
    )
}
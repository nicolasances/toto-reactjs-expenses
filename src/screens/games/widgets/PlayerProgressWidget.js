import './PlayerProgressWidget.css'
import TotoIconButton from '../../../comp/TotoIconButton';
import { ReactComponent as HelpSVG } from '../../../img/question.svg';
import { useEffect, useRef } from 'react';

export default function PlayerProgressWidget(props) {

    const progressRef = useRef(null)

    let progress = props.progress;
    if (!progress) progress = { score: 0, maxScore: 0, percCompletion: 0 }

    const completionPerc = progress.percCompletion;

    // Animate the progress bar
    useEffect(() => {

        const timeoutId = setTimeout(() => {
            if (progressRef.current) {
                progressRef.current.style.width = `${completionPerc}%`;
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    })


    return (
        <div className="player-progress-widget">

            <div className="progress-bar">
                <div className="bar" ref={progressRef} style={{ width: `0%`, transition: 'width 1s ease-in-out' }}>
                    <div className="progress-text">{progress.score}<span>pts.</span></div>
                </div>
                <div className="progress-text target">{progress.maxScore}<span>pts.</span></div>
            </div>

            <TotoIconButton image={<HelpSVG />} size="ss" />

        </div>
    )
}
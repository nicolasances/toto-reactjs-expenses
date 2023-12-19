import './PlayerProgressWidget.css'
import TotoIconButton from '../../../comp/TotoIconButton';
import { ReactComponent as HelpSVG } from '../../../img/question.svg';
import { useEffect, useRef } from 'react';

export default function PlayerProgressWidget(props) {

    const progressRef = useRef(null)

    let progress = props.progress;
    if (!progress) progress = { score: 0, maxScore: 0, percCompletion: 0 }

    let levelPoints = props.levelPoints;
    if (!levelPoints) levelPoints = { minScore: 0, passScore: 100000 }

    // Calculate the score relative to the level
    const relativeScore = progress.score - levelPoints.minScore;

    // Calculate the number of points that the level has
    const levelNumPoints = levelPoints.passScore - levelPoints.minScore;

    // Calculate the completion in percentage relative to the Level
    const completionPerc = Math.floor((100 * relativeScore) / levelNumPoints)

    /**
     * Animation for a change in the score
     */
    const triggerAnimation = () => {

        progressRef.current.style.backgroundColor = '#588e17'
        
        setTimeout(() => {
            progressRef.current.style.width = `${completionPerc}%`;
        }, 100)
        
        setTimeout(() => {
            progressRef.current.style.backgroundColor = 'var(--color-dark-primary)'
        }, 1100)
    }

    useEffect(triggerAnimation, [props.progress])


    return (
        <div className="player-progress-widget-container">
            
            {props.label && <div className="label">{props.label}</div>}

            <div className="player-progress-widget">

                <div className="progress-bar">
                    <div className="bar" ref={progressRef} style={{ width: `0%` }}>
                        <div className="progress-text">{progress.score}<span>pts.</span></div>
                    </div>
                    <div className="progress-text target">{levelPoints.passScore}<span>pts.</span></div>
                </div>

                <TotoIconButton image={<HelpSVG />} size="ss" />

            </div>
        </div>
    )
}
'use client';

import './PlayerProgressWidget.css';
import TotoIconButton from '@/components/TotoIconButton';
import { useEffect, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import animationHearts from "@/assets/lottie/anim-hearts.json";
import { GameProgress, LevelPoints } from '@/model/games';

/**
 * Props of the PlayerProgressWidget
 */
interface PlayerProgressWidgetProps {
    progress?: GameProgress;        // The score of the player (defaults to an empty score)
    levelPoints?: LevelPoints;      // The points delimiting the current level (defaults to 0 - 100000)
    label?: string;                 // Label displayed above the progress bar
    lottieOn?: boolean;             // (default true) Activates the lottie animation
}

/**
 * Progress bar of the player's score within the current level
 */
export default function PlayerProgressWidget({ progress: progressProp, levelPoints: levelPointsProp, label, lottieOn }: PlayerProgressWidgetProps) {

    const progressRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<LottieRefCurrentProps>(null);

    let progress = progressProp;
    if (!progress) progress = { score: 0, maxScore: 0, percCompletion: 0 };

    let levelPoints = levelPointsProp;
    if (!levelPoints) levelPoints = { minScore: 0, passScore: 100000 };

    // Calculate the score relative to the level
    const relativeScore = progress.score - levelPoints.minScore;

    // Calculate the number of points that the level has
    const levelNumPoints = levelPoints.passScore - levelPoints.minScore;

    // Calculate the completion in percentage relative to the Level
    const completionPerc = Math.floor((100 * relativeScore) / levelNumPoints);

    // Animation for a change in the score
    useEffect(() => {

        // Triggers the Lottie animation
        if (lottieOn == null || lottieOn === true) animationRef.current?.goToAndPlay(0);

        if (progressRef.current) progressRef.current.style.backgroundColor = '#588e17';

        const widthTimeout = setTimeout(() => {
            if (progressRef.current) progressRef.current.style.width = `${completionPerc}%`;
        }, 100);

        const colorTimeout = setTimeout(() => {
            if (progressRef.current) progressRef.current.style.backgroundColor = 'var(--color-dark-primary)';
        }, 500);

        return () => {
            clearTimeout(widthTimeout);
            clearTimeout(colorTimeout);
        };
    }, [progressProp, completionPerc, lottieOn]);

    return (
        <div className="player-progress-widget-container">

            {label && <div className="label">{label}</div>}

            <div className="lottie-container">
                <Lottie animationData={animationHearts} loop={false} lottieRef={animationRef} autoplay={false} />
            </div>

            <div className="player-progress-widget">

                <div className="progress-bar">
                    <div className="bar" ref={progressRef} style={{ width: `0%` }}>
                        <div className="progress-text">{progress.score}<span>pts.</span></div>
                    </div>
                    <div className="progress-text target">{levelPoints.passScore}<span>pts.</span></div>
                </div>

                <TotoIconButton image="/images/question.svg" size="ss" />

            </div>
        </div>
    );
}

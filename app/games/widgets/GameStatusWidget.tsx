'use client';

import './GameStatusWidget.css';

import { useEffect, useRef } from 'react';
import { MaskedSvgIcon } from 'toto-react';

/**
 * Props of the GameSummary
 */
interface GameSummaryProps {
    score: number;          // Current score
    total: number;          // Total points that can be scored
    loading?: boolean;      // True while the data is loading
    goal?: string;          // Description of the goal of the game
}

/**
 * Summary of the score in a game, with an animated progress bar
 */
export default function GameSummary({ score, total, loading, goal }: GameSummaryProps) {

    const progressRef = useRef<HTMLDivElement>(null);

    const completion = (100 * score / total);

    // Animate the progress bar
    useEffect(() => {

        const timeoutId = setTimeout(() => {
            if (progressRef.current) {
                progressRef.current.style.width = `${completion}%`;
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    });

    return (
        <div className="gamesummary">
            <div className="score-box">
                {loading && <div className="progress loading"></div>}
                {!loading && <div className="progress" ref={progressRef} style={{ width: '0%', transition: 'width 1s ease-in-out' }}></div>}
                <div className="icon-box">
                    <MaskedSvgIcon src="/images/running.svg" alt="running" size="w-6 h-6" color="bg-accent" />
                </div>
                <div className="score">
                    <div className="current">{loading ? ".." : score}</div> <div className="total">/ {loading ? ".." : total} pts</div>
                </div>
                <div className="text-box">
                    {loading ? "Loading.." : goal}
                </div>
            </div>
        </div>
    );
}

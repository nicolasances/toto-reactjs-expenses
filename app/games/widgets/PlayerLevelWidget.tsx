'use client';

import './PlayerLevelWidget.css';
import { MaskedSvgIcon } from 'toto-react';
import { PlayerLevel } from '@/model/games';

const IMAGES: Record<string, string> = {
    fishy: '/images/games/fishy.svg',
    monkey: '/images/games/monkey.svg',
    cake: '/images/games/cake.svg',
    birdie: '/images/games/bird.svg',
    robot: '/images/games/robot.svg',
    rocket: '/images/games/rocket.svg',
    galaxy: '/images/games/galaxy.svg',
    heavenly: '/images/games/heavenly.svg',
};

/**
 * Props of the PlayerLevelWidget
 */
interface PlayerLevelWidgetProps {
    playerLevel: PlayerLevel;   // The player's level and progress
}

/**
 * Widget that shows the current level of the player, with its icon, title and description
 */
export default function PlayerLevelWidget({ playerLevel }: PlayerLevelWidgetProps) {

    const level = playerLevel.level;

    const icon = IMAGES[level.id];

    return (
        <div className="player-level-widget">

            <div className="icon-container">
                <div className="icon-border">
                    <div className="icon"><MaskedSvgIcon src={icon} alt={level.title} size="w-8 h-8" color="bg-accent" /></div>
                </div>
            </div>

            <div className="text-container">
                <div className="title">{level.title}</div>
                <div className="desc">{level.desc}</div>
            </div>
        </div>
    );
}

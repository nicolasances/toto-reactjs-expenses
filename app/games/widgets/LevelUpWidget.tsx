'use client';

import Lottie from "lottie-react";
import levelUpAnimation from '@/assets/lottie/anim-level-up.json';
import './LevelUpWidget.css';
import TotoIconButton from "@/components/TotoIconButton";

/**
 * Props of the LevelUpWidget
 */
interface LevelUpWidgetProps {
    show?: boolean;             // (default false) Shows the animation
    level: string;              // The name (label) of the level that the player just reached
    onClose: () => void;        // Called when the close button is pressed
}

/**
 * Widget that shows a Level Up Animation
 */
export function LevelUpWidget({ show, level, onClose }: LevelUpWidgetProps) {

    if (!show) return (<div></div>);

    return (
        <div className="level-up-widget">

            <Lottie
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
                <p className="big">{level}</p>
            </div>

            <div style={{ flex: 1 }}></div>

            <div className="buttons">
                <TotoIconButton image="/images/close.svg" onPress={onClose} />
            </div>

        </div>
    );
}

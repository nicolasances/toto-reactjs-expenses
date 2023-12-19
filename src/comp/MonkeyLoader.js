import './MonkeyLoader.css'
import { ReactComponent as MonkeySVG } from '../img/toto-monkey.svg'

/**
 * Animated Monkey loading SVG
 * 
 * @param {object} props Properties, which can contain: 
 * 
 *  - size (in px): default 32px
 * 
 *  - fill: default none
 * 
 * @returns 
 */
export default function MonkeyLoader(props) {

    let size = props.size;
    if (!size) size = 32

    let fill = props.fill;
    if (!fill) fill = 'var(--color-dark-primary)'

    return (
        <div className="monkey-loader">
            <MonkeySVG style={{ width: `${size}px`, height: "auto", fill: fill }} />
        </div>
    )
}
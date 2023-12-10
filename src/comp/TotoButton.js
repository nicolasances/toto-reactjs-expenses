import './TotoButton.css'
import TouchableOpacity from './TouchableOpacity'

export default function TotoButton(props) {

    return (
        <div className="toto-button">
            <TouchableOpacity className="button-container" onPress={props.onPress}>
                {props.title}
            </TouchableOpacity>
        </div>
    )
}
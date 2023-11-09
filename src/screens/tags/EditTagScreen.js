import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import TitleBar from "../../comp/TitleBar";
import LabeledValue from "../../comp/LabeledValue";
import './EditTagScreen.css'
import TotoIconButton from "../../comp/TotoIconButton";

import {ReactComponent as TrashSVG} from '../../img/trash.svg';
import {ReactComponent as PenSVG} from '../../img/edit.svg';
import ExpensesAPI from "../../services/ExpensesAPI";

export default function EditTagScreen(props) {

    const location = useLocation()
    const history = useHistory()

    const tag = location.state.tag;
    const currency = location.state.currency;

    let tagAmount = "No Amount Available";
    if (tag.localCurrencyAmount) {
        tagAmount = tag.localCurrencyAmount.toLocaleString("it", {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 2
        })
    }

    const deleteTag = async () => {
        
        await new ExpensesAPI().deleteTag(tag.id);

        history.goBack();
    }

    return (
        <div className="screen edit-tag-screen">

            <TitleBar
                title={tag.name}
                back={true}
            />

            <div className="spacer"></div>

            <div className="labeled-value-container">
                <LabeledValue
                    label={`Spent on ${tag.name}`}
                    value={tagAmount}
                    textAlign="center"
                />
            </div>

            <div style={{display: "flex", flex: 1}}></div>

            <div className="buttons-container">
                <TotoIconButton image={<TrashSVG/>} onPress={deleteTag} size="m" />
            </div>

        </div>
    )
}

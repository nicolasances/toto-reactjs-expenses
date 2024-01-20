import './LifetimeSavingsBubble.css'

export function LifetimeSavingsBubble(props) {

    if (!props.savings) return <div></div>

    // Calculate the total of savings
    let total = 0;

    for (let saving of props.savings) {

        total += saving.saving

    }

    return (
        <div className="lifetime-savings-bubble">
            <div className="label">Total</div>
            <div className={`value ${Math.abs(total) >= 1000000 ? "small" : "medium"}`}>{total.toLocaleString("it", {maximumFractionDigits: 0})}</div>
            <div className="currency">DKK</div>
        </div>
    )
}
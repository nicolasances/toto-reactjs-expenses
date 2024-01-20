import LastDaysSpendingGraph from '../LastDaysSpendingGraph'
import MonthSpendingBubble from '../MonthSpendingBubble'
import './DashboardKeyInfoV1.css'

export function DashboardKeyInfoV1(props) {

    return (
        <div className="home-screen-h1">
            <div style={{ flex: 1 }}><LastDaysSpendingGraph /></div>
            <div style={{ flex: 0.5, alignItems: "center" }}><MonthSpendingBubble /></div>
        </div>
    )

}
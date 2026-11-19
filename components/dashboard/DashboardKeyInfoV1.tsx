'use client'

import LastDaysSpendingGraph from '@/components/LastDaysSpendingGraph'
import MonthSpendingBubble from '@/components/MonthSpendingBubble'
import './DashboardKeyInfoV1.css'

/**
 * Dashboard key info, version 1: the last days spending graph and the month spending bubble.
 */
export function DashboardKeyInfoV1() {

    return (
        <div className="home-screen-h1">
            <div style={{ flex: 1 }}><LastDaysSpendingGraph /></div>
            <div style={{ flex: 0.5, alignItems: "center" }}><MonthSpendingBubble /></div>
        </div>
    )

}

/**
 * A point that takes part in the computation of the y scale of a chart
 */
export interface ScalePoint {
    y: number;      // The y value of the point
}

/**
 * Computes the maximum y value that the y scale of a chart needs to cover.
 *
 * Bars and the overlay line share the same y scale, so both need to be considered:
 * - If an overlay line value is higher than every bar, it determines the max (otherwise the point would be drawn outside of the chart)
 * - If there is no data at all, the max is 0
 *
 * @param {ScalePoint[]} barData - the data of the bars
 * @param {ScalePoint[] | null} lineData - (optional) the data of the overlay line
 *
 * @returns {number} the highest y value across bars and line
 */
export function computeYMax(barData: ScalePoint[], lineData?: ScalePoint[] | null): number {

    const allPoints = [...barData, ...(lineData ?? [])];

    if (allPoints.length === 0) return 0;

    return Math.max(...allPoints.map((point) => point.y));
}

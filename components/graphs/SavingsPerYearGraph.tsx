'use client'

import { useEffect, useRef } from "react"
import * as d3 from 'd3'
import { SavingEntry } from '@/model/stats'
import './TotoGraph.css'
import './SavingsPerYearGraph.css'

interface SavingsPerYearGraphProps {
    savings?: SavingEntry[] | null;     // The savings of each year
    currency?: string;                  // The currency code, shown in the title
}

/**
 * A bar graph of the savings of each year.
 *
 * @param {SavingsPerYearGraphProps} props the props
 */
export function SavingsPerYearGraph(props: SavingsPerYearGraphProps) {

    const graphRef = useRef<HTMLDivElement>(null)

    const savings = props.savings;

    /**
     * Builds the SVG graph
     */
    const buildGraph = () => {

        const container = graphRef.current

        if (!container) return;

        // Remove any existing SVG elements
        d3.select(container).select('svg').remove();

        if (!savings) return;

        const margin = { top: 40, right: 0, bottom: 30, left: 0 };
        const width = container.clientWidth - margin.left - margin.right;
        const height = container.clientHeight - margin.top - margin.bottom;

        const svg: any = d3
            .select(container)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale: any = d3.scaleBand().range([0, width]).padding(0.1);
        const yScale: any = d3.scaleLinear().range([height, 0]);

        xScale.domain(savings.map((d) => String(d.year)));
        yScale.domain([d3.min(savings, (d) => d.saving), d3.max(savings, (d) => d.saving)]);

        svg
            .append('line')
            .attr('class', 'zero-line') // Add a class to the line
            .attr('x1', 0)
            .attr('y1', yScale(0))
            .attr('x2', width)
            .attr('y2', yScale(0))

        svg
            .selectAll('.bar')
            .data(savings)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d: any) => xScale(String(d.year)))
            .attr('width', xScale.bandwidth())
            .attr('y', () => yScale(0)) // Initially set the y to 0 for positive savings, for the animation
            .attr('height', 0) // Set initial height to 0
            .style('fill', (d: any) => (d.saving >= 0 ? 'var(--color-dark-primary)' : 'var(--color-light-primary)'))
            .transition().duration(600)
            .attr('y', (d: any) => (d.saving >= 0 ? yScale(d.saving) : yScale(0)))
            .attr('height', (d: any) => Math.abs(yScale(0) - yScale(d.saving)))

        // Add labels for each bar
        svg
            .selectAll('.bar-label')
            .data(savings)
            .enter()
            .append('text')
            .attr('class', 'bar-label')
            .attr('x', (d: any) => xScale(String(d.year)) + xScale.bandwidth() / 2)
            .attr('y', -20) // Position above the y=0 line
            .attr('text-anchor', 'middle')
            .text((d: any) => d.year);

        // Add the labels for the savings
        svg
            .selectAll('.bar-label-savings')
            .data(savings)
            .enter()
            .append('text')
            .attr('class', 'bar-label bar-label-savings')
            .attr('x', (d: any) => xScale(String(d.year)) + xScale.bandwidth() / 2)
            .attr('y', (d: any) => (d.saving >= 0 ? yScale(d.saving) - 5 : yScale(0) - 5)) // Adjust label position
            .attr('text-anchor', 'middle')
            .text((d: any) => `${(d.saving / 1000).toFixed(0)}k`);

    }

    useEffect(buildGraph, [savings])

    return (
        <div ref={graphRef} className="totograph savingsperyear" >
            <div className="title">Savings per year <span className="small">({props.currency})</span></div>
        </div>
    )

}

import { useEffect, useRef, useState } from "react"
import * as d3 from 'd3'
import './TotoGraph.css'
import './SavingsPerYearGraph.css'
import ExpensesAPI from "../../services/ExpensesAPI"

export function SavingsPerYearGraph(props) {

    const [savings, setSavings] = useState(null)

    const graphRef = useRef(null)

    const loadSavings = async () => {

        const result = await new ExpensesAPI().getSavingsPerYear("201801", props.currency)

        setSavings(result.savings);
    }

    /**
     * Builds the SVG graph
     */
    const buildGraph = () => {

        if (!savings) return;

        const margin = { top: 40, right: 0, bottom: 30, left: 0 };
        const width = graphRef.current.clientWidth - margin.left - margin.right;
        const height = graphRef.current.clientHeight - margin.top - margin.bottom;

        // Remove any existing SVG elements
        d3.select(graphRef.current).select('svg').remove();

        const svg = d3
            .select(graphRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleBand().range([0, width]).padding(0.1);
        const yScale = d3.scaleLinear().range([height, 0]);

        xScale.domain(savings.map((d) => d.year));
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
            .attr('x', (d) => xScale(d.year))
            .attr('width', xScale.bandwidth())
            .attr('y', (d) => yScale(0)) // Initially set the y to 0 for positive savings, for the animation
            .attr('height', (d) => d.saving >= 0 ? 0 : 0) // Set initial height to 0
            .style('fill', (d) => (d.saving >= 0 ? 'var(--color-dark-primary)' : 'var(--color-light-primary)'))
            .transition().duration(600)
            .attr('y', (d) => (d.saving >= 0 ? yScale(d.saving) : yScale(0)))
            .attr('height', (d) => Math.abs(yScale(0) - yScale(d.saving)))

        // Add labels for each bar
        svg
            .selectAll('.bar-label')
            .data(savings)
            .enter()
            .append('text')
            .attr('class', 'bar-label')
            .attr('x', (d) => xScale(d.year) + xScale.bandwidth() / 2)
            .attr('y', -20) // Position above the y=0 line
            .attr('text-anchor', 'middle')
            .text((d) => d.year);
           
        // Add the labels for the savings
        svg
            .selectAll('.bar-label-savings')
            .data(savings)
            .enter()
            .append('text')
            .attr('class', 'bar-label bar-label-savings')
            .attr('x', (d) => xScale(d.year) + xScale.bandwidth() / 2)
            .attr('y', (d) => (d.saving >= 0 ? yScale(d.saving) - 5 : yScale(0) - 5)) // Adjust label position
            .attr('text-anchor', 'middle')
            .text((d) => `${(d.saving / 1000).toFixed(0)}k`);

    }

    useEffect(loadSavings, [])
    useEffect(buildGraph, [savings])

    return (
        <div ref={graphRef} className="totograph savingsperyear" >
            <div className="title">Savings per year</div>
        </div>
    )

}
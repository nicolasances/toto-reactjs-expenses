import moment from "moment-timezone"
import { useEffect, useRef, useState } from "react"
import ExpensesAPI from "../../services/ExpensesAPI"
import * as d3 from 'd3';
import './TotoGraph.css'
import './YearSavingsPerMonthGraph.css'
import TouchableOpacity from "../TouchableOpacity";

/**
 * This component displays a graph that shows, given a specific year, the savings for each month 
 * as a line chart. 
 * 
 * The default behaviour is to show the current year. 
 * 
 * The user is able to switch between years
 */
export function YearSavingsPerMonthGraph(props) {

    // Sate variables
    const [year, setYear] = useState(moment().format("YYYY"))
    const [savings, setSavings] = useState(null)
    const [yearSelectorVisible, setYearSelectorVisible] = useState(false);

    // Valid years
    const years = []
    for (let i = 2018; i <= parseInt(moment().format('YYYY')); i++) {
        years.push(i)
    }

    // Currency to consider
    const currency = props.currency;

    // Ref to the graph
    const svgRef = useRef();

    /**
     * Builds the graph
     */
    const buildGraph = () => {

        if (!savings) return;

        const container = svgRef.current;
        const margin = { top: 40, right: 0, bottom: 60, left: 0 };
        const width = container.clientWidth - margin.left - margin.right;
        const height = container.clientHeight - margin.top - margin.bottom;

        // Clear any existing SVG content
        d3.select(container).select('svg').remove();

        const svg = d3.select(container)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Extract months and corresponding savings
        const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
        const monthlySavings = months.map(month => {
            const dataPoint = savings.find(entry => entry.month === month);
            return dataPoint ? dataPoint.saving : 0;
        });

        // Set up scales
        const xScale = d3.scaleBand()
            .domain(months)
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([d3.min(monthlySavings), d3.max(monthlySavings)])
            .range([height, 0]);

        // Draw line
        const line = d3.line()
            .x((d, i) => xScale(months[i]) + xScale.bandwidth() / 2)
            .y(d => yScale(d));

        svg.append('path')
            .datum(monthlySavings)
            .attr('fill', 'none')
            .attr('stroke', 'var(--color-light-primary)')
            .attr('stroke-width', 2)
            .attr('d', line);

        // Draw dots and labels
        svg.selectAll('circle')
            .data(monthlySavings)
            .enter()
            .append('circle')
            .attr('cx', (d, i) => xScale(months[i]) + xScale.bandwidth() / 2)
            .attr('cy', d => yScale(d))
            .attr('r', 4)
            .attr('fill', d => (d < 0 ? '#c64343' : 'var(--color-light-primary)')) // Set color based on negative or positive savings

        svg.selectAll('text')
            .data(monthlySavings)
            .enter()
            .append('text')
            .text(d => d3.format('.1f')(d / 1000) + "k") // Format savings in thousands
            .attr('x', (d, i) => xScale(months[i]) + xScale.bandwidth() / 2)
            .attr('y', d => (d >= 0 ? yScale(d) - 10 : yScale(d) + 20))
            .attr('text-anchor', 'middle')
            .classed('label', true); // Add a CSS class 'label'

        // Draw x-axis labels at the top
        const labelYOffset = 30; // Offset to avoid overlap with highest value label
        svg.selectAll('.month-label')
            .data(months)
            .enter()
            .append('text')
            .text(d => moment(`${year}${d}01`).format('MMM'))
            .attr('x', (d, i) => xScale(d) + xScale.bandwidth() / 2)
            .attr('y', -labelYOffset) // Adjust the y-position for top labels
            .attr('text-anchor', 'middle')
            .attr('fill', 'var(--color-light-primary)')
            .classed('month-label', true); // Add a CSS class 'month-label'

    }

    /**
     * Load the savings of the year
     */
    const loadYear = async () => {

        if (!currency) return;

        const response = await new ExpensesAPI().getSavingsOfYear(year, currency);

        setSavings(response.savings)

    }

    /**
     * Shows the years selector
     */
    const showYearSelector = () => {

        setYearSelectorVisible(true)

        const container = svgRef.current;

        // Clear any existing SVG content
        d3.select(container).select('svg').remove();

    }

    const onChangeYear = (selectedYear) => {

        setYear(selectedYear)
        setYearSelectorVisible(false)
    }

    useEffect(loadYear, [currency, year])
    useEffect(buildGraph, [savings])

    return (
        <div className="totograph yearsavingspermonth" ref={svgRef}>

            <div className="header">
                <div className="graph-title">Year savings</div>
                <TouchableOpacity className="year-selector" onPress={showYearSelector}>{year}</TouchableOpacity>
            </div>

            {yearSelectorVisible &&

                <YearPicker years={years} onSelectYear={onChangeYear} />

            }

        </div>
    )

}

function YearPicker(props) {

    return (
        <div className="yearpicker">
            {props.years.map((item) => {
                return (
                    <div className="year-container" key={Math.random()}>
                        <TouchableOpacity onPress={() => { props.onSelectYear(item) }} className="year">
                            {item}
                        </TouchableOpacity>
                    </div>

                )
            })}
        </div>
    )
}
'use client'

import moment from "moment-timezone"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import * as d3 from 'd3';
import { ExpensesAPI } from "@/api/ExpensesAPI"
import TouchableOpacity from "@/components/TouchableOpacity";
import { SavingEntry } from "@/model/stats";
import './TotoGraph.css'
import './YearSavingsPerMonthGraph.css'

interface YearSavingsPerMonthGraphProps {
    currency?: string;      // The currency to consider (the graph loads only once it is set)
}

/**
 * This component displays a graph that shows, given a specific year, the savings for each month
 * as a line chart.
 *
 * The default behaviour is to show the current year.
 *
 * The user is able to switch between years
 *
 * @param {YearSavingsPerMonthGraphProps} props the props
 */
export function YearSavingsPerMonthGraph(props: YearSavingsPerMonthGraphProps) {

    // State variables
    const [year, setYear] = useState(moment().format("YYYY"))
    const [savings, setSavings] = useState<SavingEntry[] | null>(null)
    const [yearSelectorVisible, setYearSelectorVisible] = useState(false);

    const router = useRouter()

    // Valid years
    const years: number[] = []
    for (let i = 2018; i <= parseInt(moment().format('YYYY')); i++) {
        years.push(i)
    }

    // Currency to consider
    const currency = props.currency;

    // Ref to the graph
    const svgRef = useRef<HTMLDivElement>(null);

    /**
     * When the user clicks on a specific month
     */
    const onMonthClick = (amount: number) => {

        if (!savings) return;

        // Indices are 0-based
        let i = 0;
        let found = false
        for (i = 0; i < savings.length; i++) {
            if (savings[i].saving == amount) {
                found = true;
                break;
            }
        }

        if (!found) return;

        i++;

        // Convert to year month
        const paddedMonth = String(i).length == 1 ? `0${i}` : i;
        const yearMonth = `${year}${paddedMonth}`

        // Go to expenses list
        router.push(`/expenses?yearMonth=${yearMonth}`)

    }

    /**
     * Builds the graph
     */
    const buildGraph = () => {

        const container = svgRef.current;

        if (!container) return;

        // Clear any existing SVG content
        d3.select(container).select('svg').remove();

        if (!savings) return;

        const margin = { top: 40, right: 0, bottom: 60, left: 0 };
        const width = container.clientWidth - margin.left - margin.right;
        const height = container.clientHeight - margin.top - margin.bottom;

        const svg: any = d3.select(container)
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
        const xScale: any = d3.scaleBand()
            .domain(months)
            .range([0, width])
            .padding(0.1);

        const yScale: any = d3.scaleLinear()
            .domain([d3.min(monthlySavings) ?? 0, d3.max(monthlySavings) ?? 0])
            .range([height, 0]);

        // Draw line
        const line: any = d3.line()
            .x((d: any, i: number) => xScale(months[i]) + xScale.bandwidth() / 2)
            .y((d: any) => yScale(d));

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
            .attr('cx', (d: any, i: number) => xScale(months[i]) + xScale.bandwidth() / 2)
            .attr('cy', (d: any) => yScale(d))
            .attr('r', 4)
            .attr('fill', (d: any) => (d < 0 ? '#c64343' : 'var(--color-light-primary)')) // Set color based on negative or positive savings
            .on('click', (event: any, d: any) => { onMonthClick(d) })

        svg.selectAll('text')
            .data(monthlySavings)
            .enter()
            .append('text')
            .text((d: any) => d3.format('.1f')(d / 1000) + "k") // Format savings in thousands
            .attr('x', (d: any, i: number) => xScale(months[i]) + xScale.bandwidth() / 2)
            .attr('y', (d: any) => (d >= 0 ? yScale(d) - 10 : yScale(d) + 20))
            .attr('text-anchor', 'middle')
            .classed('label', true) // Add a CSS class 'label'
            .on('click', (event: any, d: any) => { onMonthClick(d) })

        // Draw x-axis labels at the top
        const labelYOffset = 30; // Offset to avoid overlap with highest value label
        svg.selectAll('.month-label')
            .data(months)
            .enter()
            .append('text')
            .text((d: any) => moment(`${year}${d}01`).format('MMM'))
            .attr('x', (d: any) => xScale(d) + xScale.bandwidth() / 2)
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
        if (container) d3.select(container).select('svg').remove();

    }

    /**
     * When the user selects a year
     */
    const onChangeYear = (selectedYear: number) => {

        setYear(String(selectedYear))
        setYearSelectorVisible(false)
    }

    useEffect(() => { loadYear() }, [currency, year])
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

interface YearPickerProps {
    years: number[];                        // The selectable years
    onSelectYear: (year: number) => void;   // Called with the year the user picked
}

/**
 * Lets the user pick one of the years
 */
function YearPicker(props: YearPickerProps) {

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

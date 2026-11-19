'use client'

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import './TotoBarChart.css';

/**
 * A point of the bar chart (or of the overlay line)
 */
export interface BarChartDatum {
    x: number;              // The x value
    y: number;              // The y value
    temporary?: boolean;    // If true, highlights this element as a temporary one
}

/**
 * Theme of the bar chart
 */
export interface BarChartTheme {
    background: string;     // Background color
    bar: string;            // Color of the bars
    value: string;          // Color of the value text
    xLabel: string;         // Color of the x labels
    line: string;           // Color of the overlay line
}

interface TotoBarChartProps {
    data?: BarChartDatum[] | null;                              // The data to create the chart with
    lineData?: BarChartDatum[] | null;                          // (optional) data to draw a line on top of the bars, sharing the x axis
    valueLabelTransform?: (value: number) => string;            // (optional) transforms the value to be displayed on the bar (top part)
    valueImage?: (datum: BarChartDatum, index: number) => string | null;    // (optional, currently not rendered, as in the legacy component) image to display
    xAxisTransform?: (value: number) => string | undefined;     // (optional) generates the label to put on the bar (bottom part) from the x value
    theme?: BarChartTheme;                                      // (optional) colors of the chart (default: the standard colors)
    margins?: { horizontal: number; vertical: number };         // (optional) margins to be applied
    maxHeight?: number;                                         // (optional) max height of the chart
    onBarClick?: (data: BarChartDatum) => void;                 // (optional) callback called when clicking on a bar
}

const DEFAULT_THEME: BarChartTheme = {
    background: '#00acc1',
    bar: '#007c91',
    value: 'rgba(0,0,0,0.7)',
    xLabel: '#5ddef4',
    line: '#5ddef4'
}

/**
 * Creates a bar chart (optionally with an overlay line).
 *
 * @param {TotoBarChartProps} props the props
 */
export default function TotoBarChart(props: TotoBarChartProps) {

    const containerRef = useRef<HTMLDivElement>(null)

    // Always-fresh props, for the callbacks used by d3 handlers
    const propsRef = useRef(props)
    propsRef.current = props

    /**
     * Reacts to the click of a bar
     */
    const onBarClick = (event: any, data: BarChartDatum) => {

        if (propsRef.current.onBarClick) {

            // Change the opacity
            event.target.classList.add("touched");
            setTimeout(() => {
                event.target.classList.remove("touched");

                setTimeout(() => {
                    // Call the callback
                    if (propsRef.current.onBarClick) propsRef.current.onBarClick(data);
                }, 10);

            }, 10)

        }
    }

    useEffect(() => {

        const container = containerRef.current
        const data = props.data
        const lineData = props.lineData

        // Clear any previous drawing (also avoids doubles with StrictMode)
        if (container) d3.select(container).selectAll('svg').remove();

        if (!container || !data) return;

        // Width and height
        const width = container.offsetWidth;
        let height = container.offsetHeight;
        if (height === 0) height = 250;
        if (props.maxHeight && height > props.maxHeight) height = props.maxHeight;

        // Margins
        let marginH = 12;
        // Override defaults if props.margins is passed
        if (props.margins) { marginH = props.margins.horizontal; }

        // Text margins
        const textPaddingV = 18;

        // Colors
        const theme = props.theme ? props.theme : DEFAULT_THEME;

        const svg: any = d3.select(container).append('svg').attr('width', width).attr('height', height);

        // Create ranges
        const yMax = d3.max(data, (d) => { return d.y });

        // Update the scales
        const x: any = d3.scaleBand().paddingInner(0.05).range([marginH, width - marginH]).domain(data.map((d) => { return String(d.x) }));
        const y: any = d3.scaleLinear().range([textPaddingV, height - textPaddingV - 20]).domain([0, yMax ?? 0]);
        const fontScale: any = d3.scaleLinear().range([6, 11]).domain([24, 4]);

        // Bars
        if (data.length > 0) {
            svg.selectAll('.bar').data(data).enter().append('rect')
                .attr('class', 'bar')
                .attr('x', (d: any) => { return x(String(d.x)) })
                .attr('y', height)
                .attr('width', x.bandwidth())
                .attr('height', 0)
                .on('click', (e: any, d: any) => { onBarClick(e, d); })
                .transition()
                .attr('y', (d: any) => { return height - y(d.y) })
                .attr('height', (d: any) => { return y(d.y) })
                .attr('fill', theme.bar)
        }

        // Lines (it could be that there is no line data)
        if (lineData) {

            const line: any = d3.line()
                .x((d: any) => { return x(String(d.x)) + x.bandwidth() / 2 })
                .y((d: any) => { return height - y(d.y) })

            svg.append('g').append('path').datum(lineData)
                .attr('d', line)
                .attr('fill', 'none')
                .attr('stroke-width', 2)
                .attr('stroke', theme.line);

            // Add a point
            svg.selectAll('.point').data(lineData).enter().append('circle')
                .attr('class', 'point')
                .attr('cx', (d: any) => { return x(String(d.x)) + x.bandwidth() / 2 })
                .attr('cy', (d: any) => { return height - y(d.y) })
                .attr('r', 4)
                .attr('fill', theme.line)
        }

        // Text
        const valueLabelTransform = props.valueLabelTransform
        if (valueLabelTransform && data.length > 0) {

            svg.selectAll('.valuelabel').data(data).enter().append('text')
                .attr('class', 'valuelabel')
                .attr('x', (d: any) => { return x(String(d.x)) + x.bandwidth() / 2 })
                .attr('y', (d: any) => { return height - y(d.y) - 6 })
                .attr('fill', theme.value)
                .attr('font-size', fontScale(data.length))
                .style('text-anchor', 'middle')
                .text((d: any) => { return valueLabelTransform(d.y) })
        }

        // X Labels
        const xAxisTransform = props.xAxisTransform
        if (xAxisTransform && data.length > 0) {

            svg.selectAll('.xlabel').data(data).enter().append('text')
                .attr('class', 'xlabel')
                .attr('x', (d: any) => { return x(String(d.x)) + x.bandwidth() / 2 })
                .attr('y', height - 6)
                .attr('fill', theme.xLabel)
                .attr('font-size', fontScale(data.length))
                .style('text-anchor', 'middle')
                .text((d: any) => { return xAxisTransform(d.x) })
        }

        return () => { d3.select(container).selectAll('svg').remove() }

    }, [props.data, props.lineData])

    return (
        <div ref={containerRef} className="toto-bar-chart">
        </div>
    )
}

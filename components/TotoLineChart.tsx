'use client'

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

/**
 * A point of the line chart.
 */
export interface LineChartPoint {
  x: number;                    // The x value
  y: number;                    // The y value
  temporary?: boolean;          // (OPT) if true, highlights this element as a temporary one
}

/**
 * Colors of the line chart.
 */
export interface LineChartTheme {
  background: string;           // Background color (used to fill the caps)
  line: string;                 // Color of the line
  caps: string;                 // Color of the caps (value points)
  area: string;                 // Color of the area (used when area is true)
  value: string;                // Color of the value texts
}

interface TotoLineChartProps {
  data?: LineChartPoint[];                                          // The data to plot
  maxHeight?: number;                                               // (OPT, default 250) the max height of the graph
  valueLabelTransform?: (value: number) => string;                  // (OPT) transforms the value to the label shown on top of each point
  xAxisTransform?: (value: number) => string | undefined;           // (OPT) generates the label to put under each x value
  showValuePoints?: boolean;                                        // (OPT, default true) shows the value points (circles)
  area?: boolean;                                                   // (OPT, default false) true to show the graph as an area
  theme?: LineChartTheme;                                           // (OPT, default the standard colors) the colors of the chart
  margins?: { horizontal: number; vertical: number };               // (OPT) margins to be applied
}

// Default colors
const defaultTheme: LineChartTheme = {
  background: '#00acc1',
  line: '#007c91',
  caps: '#007c91',
  area: '#007c91',
  value: 'rgba(0,0,0,0.7)',
}

/**
 * Creates a line chart. It is RESPONSIVE: the height is taken from the height of the wrapping element.
 *
 * @param {TotoLineChartProps} props the props
 */
export default function TotoLineChart(props: TotoLineChartProps) {

  const containerRef = useRef<HTMLDivElement>(null);

  // Redraws on every render, like the legacy component did
  useEffect(() => {

    const container = containerRef.current;
    const data = props.data;

    if (!container || !data) return;

    // Remove the previous graph
    d3.select(container).selectAll('svg').remove();

    // Width and height
    const width = container.offsetWidth;
    let height = container.offsetHeight;
    if (height === 0) height = 250;
    if (props.maxHeight && height > props.maxHeight) height = props.maxHeight;

    // Margins
    let marginV = 12;
    let marginH = 12;
    if (props.margins) { marginH = props.margins.horizontal; marginV = props.margins.vertical; }
    if (props.xAxisTransform) marginV += 6;

    // Text margins
    const textPaddingV = 12;
    const textPaddingH = -12;

    // Colors
    const theme = props.theme ? props.theme : defaultTheme;

    const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);

    // Create ranges
    // Define the min and max x values
    const xMin = d3.min(data, (d) => d.x);
    const xMax = d3.max(data, (d) => d.x);

    // Define the max y value
    const yMax = d3.max(data, (d) => d.y);

    // Update the scales
    const x = d3.scaleLinear().range([marginH - textPaddingH, width - marginH + textPaddingH]).domain([xMin as number, xMax as number]);
    const y = d3.scaleLinear().range([height - marginV, marginV + textPaddingV]).domain([0, yMax as number]);

    if (data.length === 0) return;

    // Lines
    const line = d3.line<LineChartPoint>()
      .x((d) => x(d.x))
      .y((d) => y(d.y));

    svg.append('g').append('path').datum(data)
      .attr('d', line)
      .attr('fill', props.area ? theme.area : 'none')
      .attr('stroke-width', 2)
      .attr('stroke', theme.line);

    // Caps
    if (props.showValuePoints == null || props.showValuePoints) svg.selectAll('.cap').data(data).enter().append('circle')
      .attr('class', 'cap')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', 3.5)
      .style('stroke-width', 2)
      .style('stroke', theme.caps)
      .style('fill', theme.background);

    // Value labels
    const valueLabelTransform = props.valueLabelTransform;
    if (valueLabelTransform) svg.selectAll('.value').data(data).enter().append('text')
      .attr('class', 'value')
      .attr('x', (d) => x(d.x))
      .attr('y', (d) => { if (d.y === 0) return null; return y(d.y) - textPaddingV })
      .attr('fill', theme.value)
      .style('text-anchor', 'middle')
      .style('font-size', 12)
      .text((d) => valueLabelTransform(d.y));

    // X Labels
    const xAxisTransform = props.xAxisTransform;
    if (xAxisTransform) svg.selectAll('.xLabel').data(data).enter().append('text')
      .attr('class', 'xLabel')
      .attr('x', (d) => x(d.x))
      .attr('y', height)
      .attr('fill', theme.value)
      .style('text-anchor', 'middle')
      .style('font-size', 10)
      .text((d) => xAxisTransform(d.x) ?? '');
  })

  return (
    <div ref={containerRef} className='toto-line-chart'>
    </div>
  )
}

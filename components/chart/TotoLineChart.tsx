'use client'

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

/**
 * A point of the line chart
 */
export interface LineChartDatum {
  x: number;              // The x value
  y: number;              // The y value
  temporary?: boolean;    // If true, highlights this element as a temporary one
}

/**
 * Theme of the line chart
 */
export interface LineChartTheme {
  background: string;     // Background color
  line: string;           // Color of the line
  caps: string;           // Color of the caps (value points)
  area: string;           // Color of the area (when shown as an area)
  value: string;          // Color of the value text
}

interface TotoLineChartProps {
  data?: LineChartDatum[] | null;                             // The data to create the chart with
  maxHeight?: number;                                         // (optional, default 250) sets the max height of the graph
  valueLabelTransform?: (value: number) => string;            // (optional) transforms the value to be displayed (top part)
  xAxisTransform?: (value: number) => string | undefined;     // (optional) generates the x axis label (bottom part) from the x value
  showValuePoints?: boolean;                                  // (optional, default true) shows the value points (circles)
  area?: boolean;                                             // (optional, default false) true to show the graph as an area
  theme?: LineChartTheme;                                     // (optional) colors of the chart (default: the standard colors)
  margins?: { horizontal: number; vertical: number };         // (optional) margins to be applied
}

const DEFAULT_THEME: LineChartTheme = {
  background: '#00acc1',
  line: '#007c91',
  caps: '#007c91',
  area: '#007c91',
  value: 'rgba(0,0,0,0.7)',
}

/**
 * Creates a line chart.
 *
 * This component is RESPONSIVE: the height is taken from the height of the wrapping element.
 *
 * @param {TotoLineChartProps} props the props
 */
export default function TotoLineChart(props: TotoLineChartProps) {

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {

    const container = containerRef.current
    const data = props.data

    // Clear any previous drawing (also avoids doubles with StrictMode)
    if (container) d3.select(container).selectAll('svg').remove();

    if (!container || !data) return;

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
    const theme = props.theme ? props.theme : DEFAULT_THEME;

    const svg: any = d3.select(container).append('svg').attr('width', width).attr('height', height);

    // Create ranges
    // Define the min and max x values
    const xMin = d3.min(data, (d) => { return d.x });
    const xMax = d3.max(data, (d) => { return d.x });

    // Define the max y value
    const yMax = d3.max(data, (d) => { return d.y });

    // Update the scales
    const x: any = d3.scaleLinear().range([marginH - textPaddingH, width - marginH + textPaddingH]).domain([xMin ?? 0, xMax ?? 0]);
    const y: any = d3.scaleLinear().range([height - marginV, marginV + textPaddingV]).domain([0, yMax ?? 0]);

    // Lines
    if (data.length > 0) {

      // Properties
      let fill = 'none';
      if (props.area) fill = theme.area;

      const line: any = d3.line()
        .x((d: any) => { return x(d.x) })
        .y((d: any) => { return y(d.y) })

      svg.append('g').append('path').datum(data)
        .attr('d', line)
        .attr('fill', fill)
        .attr('strokeWidth', 2)
        .attr('stroke', theme.line);
    }

    // Caps
    if ((props.showValuePoints == null || props.showValuePoints) && data.length > 0) {

      svg.selectAll('.cap').data(data).enter().append('circle')
        .attr('class', 'cap')
        .attr('cx', (d: any) => { return x(d.x) })
        .attr('cy', (d: any) => { return y(d.y) })
        .attr('r', 3.5)
        .style('strokeWidth', 2)
        .style('stroke', theme.caps)
        .style('fill', theme.background)
    }

    // Text
    const valueLabelTransform = props.valueLabelTransform
    if (valueLabelTransform && data.length > 0) {

      svg.selectAll('.value').data(data).enter().append('text')
        .attr('class', 'value')
        .attr('x', (d: any) => { return x(d.x) })
        .attr('y', (d: any) => { if (d.y === 0) return; return y(d.y) - textPaddingV })
        .attr('fill', theme.value)
        .style('text-anchor', 'middle')
        .style('font-size', 10)
        .text((d: any) => { return valueLabelTransform(d.y) })
    }

    // X Labels
    const xAxisTransform = props.xAxisTransform
    if (xAxisTransform && data.length > 0) {

      svg.selectAll('.xLabel').data(data).enter().append('text')
        .attr('class', 'xLabel')
        .attr('x', (d: any) => { return x(d.x) })
        .attr('y', height)
        .attr('fill', theme.value)
        .style('text-anchor', 'middle')
        .style('font-size', 10)
        .text((d: any) => { return xAxisTransform(d.x) })
    }

    return () => { d3.select(container).selectAll('svg').remove() }

  }, [props.data])

  return (
    <div ref={containerRef} className='toto-line-chart'>
    </div>
  )
}

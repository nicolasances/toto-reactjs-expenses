import React, { Component } from 'react';
import * as d3 from "d3";

/**
 * Creates a line chart
 *
 * NOTE THE FOLLOWING
 *
 * 1. This component is RESPONSIVE: the height will be taken from the height of the wrapping element
 *
 *
 * Requires the following:
 * - data                   : the data to create the chart in the following form:
 *                            [ { x: numeric, x value,
 *                                y: numeric, y value,
 *                                temporary: boolean, optional, if true will highlight this element as a temporary one
 *                              }, {...} ]
 * - maxHeight              : (optional, default 250) sets the max height of the graph
 * - valueLabelTransform    : (optional) a function (value) => {transforms the value to be displayed on the bar (top part)}
 * - xAxisTransform         : (optional) a function to be called with the x axis value to generate a label to put on the bar (bottom part)
 * - moreSpaceForXLabels    : UNSUPPORTED (optional, default false) pass true if the x axis label needs extra space (e.g. ends up in two lines)
 * - showValuePoints        : (optional, default true), shows the value points (circles)
 * - valuePointsBackground  : UNSUPPORTED (optional, default THEME color), defines the background color of the value points (Circles)
 * - valuePointsSize        : UNSUPPORTED (optional, default 6), defines the radius of the circle value points
 * - leaveMargins           : UNSUPPORTED (optional, default true), leave a 24 margin horizontally on each side of tthe graph
 * - yLines                 : UNSUPPORTED (optional) the y values for which to draw a horizontal line (to show the scale)
 *                            if passed, it's an [y1, y2, y3, ...]
 *                            each value will correspond to a horizontal line
 * - yLinesNumberLocale     : UNSUPPORTED (optional) the locale to use to format the number with toLocaleString('<locale>') ... e,g. 'it'
 * - valueLabelColor        : UNSUPPORTED (optional, default COLOR_TEXT) the color of the value labels
 *
 * - area                   : (optional, default false) true to show the graph as an area
 * - theme                  : (optional, default the standard colors) it is an object {
 *                              background    : color, default THEME
 *                              line          : color, default THEME_DARK
 *                              caps          : color, default THEME_DARK
 *                              area          : color, default 'none'
 *                              value         : color for the value text, default TEXT
 *                            }
 * - margins                : (optional) margins to be applied. It's an object {
 *                              horizontal    : horizontal margin (number, e.g. 12)
 *                              vertical      : vertical margin
 *                            }
*/
export default class TotoLineChart extends Component {

  constructor(props) {
    super(props);

    this.compId = 'toto-line-chart-' + Math.round(Math.random()*10000);

  }

  /**
   * When mounted
   */
  componentDidMount() {

    // Width and height
    this.width = document.getElementById(this.compId).offsetWidth;
    this.height = document.getElementById(this.compId).offsetHeight;
    if (this.height === 0) this.height = 250;
    if (this.props.maxHeight && this.height > this.props.maxHeight) this.height = this.props.maxHeight;

    // Margins
    this.marginV = 12;
    this.marginH = 12;
    if (this.props.margins) { this.marginH = this.props.margins.horizontal; this.marginV = this.props.margins.vertical; }
    if (this.props.xAxisTransform) this.marginV += 6;

    // Text margins
    this.textPaddingV = 12;
    this.textPaddingH = -12;

    // Colors
    this.theme = {
      background: '#00acc1',
      line: '#007c91',
      caps: '#007c91',
      area: '#007c91',
      value: 'rgba(0,0,0,0.7)',
    }
    if (this.props.theme) this.theme = this.props.theme;

  }

  /**
   * Creates the whole graph
   */
  createGraph(data) {

    if (!data) return;

    if (this.svg) this.svg.remove();

    this.svg = d3.select('#' + this.compId).append('svg').attr('width', this.width).attr('height', this.height);

    // Create ranges
    // Define the min and max x values
    let xMin = d3.min(data, (d) => {return d.x});
    let xMax = d3.max(data, (d) => {return d.x});

    // Define the min and max y values
    // let yMin = d3.min(data, (d) => {return d.y});
    let yMax = d3.max(data, (d) => {return d.y});

    // Update the scales
    this.x = d3.scaleLinear().range([this.marginH - this.textPaddingH, this.width - this.marginH + this.textPaddingH]).domain([xMin, xMax]);
    this.y = d3.scaleLinear().range([this.height - this.marginV, this.marginV + this.textPaddingV]).domain([0, yMax]);

    // Lines
    this.createLines(data);
    // Caps
    if (this.props.showValuePoints == null || this.props.showValuePoints) this.createCaps(data);
    // Text
    if (this.props.valueLabelTransform) this.createValueLabels(data);
    // X Labels
    if (this.props.xAxisTransform) this.createXAxis(data);

  }

  /**
   * Creates the lines
   */
  createLines(data) {

    if (!data || data.length === 0) return;

    // Properties
    let fill = 'none';
    if (this.props.area) fill = this.theme.area;

    var line = d3.line()
      .x((d) => {return this.x(d.x)})
      .y((d) => {return this.y(d.y)})

    this.svg.append('g').append('path').datum(data)
      .attr('d', line)
      .attr('fill', fill)
      .attr('stroke-width', 2)
      .attr('stroke', this.theme.line);

  }

  /**
   * Create the caps
   */
  createCaps(data) {

    if (!data || data.length === 0) return;

    this.svg.selectAll('.cap').data(data).enter().append('circle')
      .attr('class', 'cap')
      .attr('cx', (d) => {return this.x(d.x)})
      .attr('cy', (d) => {return this.y(d.y)})
      .attr('r', 3.5)
      .style('stroke-width', 2)
      .style('stroke', this.theme.caps)
      .style('fill', this.theme.background)

  }

  /**
   * Create the value labels
   */
  createValueLabels(data) {

    if (!data || data.length === 0) return;

    this.svg.selectAll('.value').data(data).enter().append('text')
      .attr('class', 'value')
      .attr('x', (d) => {return this.x(d.x)})
      .attr('y', (d) => {if (d.y === 0) return; return this.y(d.y) - this.textPaddingV})
      .attr('fill', this.theme.value)
      .style('text-anchor', 'middle')
      .style('font-size', 12)
      .text((d) => {return this.props.valueLabelTransform(d.y)})

  }

  /**
   * Create the x axis labels
   */
  createXAxis(data) {

    if (!data || data.length === 0) return;

    this.svg.selectAll('.xLabel').data(data).enter().append('text')
      .attr('class', 'xLabel')
      .attr('x', (d) => {return this.x(d.x)})
      .attr('y', this.height)
      .attr('fill', this.theme.value)
      .style('text-anchor', 'middle')
      .style('font-size', 10)
      .text((d) => {return this.props.xAxisTransform(d.x)})

  }


  render() {

    this.createGraph(this.props.data);

    return (
      <div id={this.compId} className='toto-line-chart'>
      </div>
    )
  }
}
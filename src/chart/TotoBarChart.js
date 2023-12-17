import React, { Component } from 'react';
import * as d3 from "d3";

import './TotoBarChart.css';

/**
 * Creates a bar chart
 * Requires the following:
 * - data                : the data to create the chart in the following form:
 *                         [ { x: numeric, x value,
 *                            y: numeric, y value,
 *                            temporary: boolean, optional, if true will highlight this element as a temporary one
 *                          }, {...} ]
 * - valueLabelTransform : (optional) a function(value) => {transforms the value to be displayed on the bar (top part)}
 * - valueImage          : (optional) a function(value) => {svg image to display}
 * - xAxisTransform      : (optional, default null) a function to be called with the x axis value to generate a label to put on the bar (bottom part)
 * - xLabelImgLoader     : UNSUPPORTED (optional, default null) a function(datum) => {return the image to be put as an Image source}. This allows to put an image instead of text as a x axis label
 * - xLabelMode          : UNSUPPORTED (optional) specifies the mode in which the x labels are shown:
 *                           - if 'when-changed' the x label is shown only when the value changes
 * - xLabelWidth         : UNSUPPORTED (optional) specified is the label width has to be set or should be unlimited
 *                         default: limited to the bar width
 *                           - if 'unlimited' it won't be limited to the bar width
 * - barSpacing          : UNSUPPORTED (optional) the spacing between bars. Default 2
 * - maxBarWidth         : UNSUPPORTED (optional, default none) the maximum width of a bar
 * - yLines              : (UNSUPPORTED optioanl) the y values for which to draw a horizontal line (to show the scale)
 *                         if passed, it's an [y1, y2, y3, ...]
 *                         each value will correspond to a horizontal line
 * - minY                : UNSUPPORTED (optional) the minimum y value to consider as the "lowest" value, when defining the SCALE
 * - overlayLineData     : UNSUPPORTED (optipnal) the data to draw a line chart on top of the bar chart
 *                         it's an [{x, y}, {x, y}, ...]
 *                         note that the x axis is the same as the one used for the barchart, so it follows the same scale
 * - overlayMinY         : UNSUPPORTED (optional) the minimum y value to consider as the "lowest" value of the overlay line, when defining the SCALE
 * - theme               : (optional, default the standard colors) it is an object {
 *                            background    : color, default THEME
 *                            bar           : color, default THEME_DARK
 *                            value         : color for the value text, default TEXT
 *                            xLabel        : color for the x label, default THEME_LIGHT
 *                          }
 * - margins              : (optional) margins to be applied. It's an object {
 *                            horizontal    : horizontal margin (number, e.g. 12)
 *                            vertical      : vertical margin
 *                          }
 * - maxHeight            : (optional) max height of the chart
 * - onBarClick           : (opt) a callback function to be called when clicking on a bar
 */
export default class TotoBarChart extends Component {

    constructor(props) {
        super(props);

        this.compId = 'toto-bar-chart-' + Math.round(Math.random() * 10000);

        // Bindings
        this.createGraph = this.createGraph.bind(this);
        this.createLine = this.createLine.bind(this);
        this.createBars = this.createBars.bind(this);
        this.createXAxis = this.createXAxis.bind(this);
        this.onBarClick = this.onBarClick.bind(this);
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
        this.marginH = 12;
        this.marginV = 12;
        // Override defaults if props.margins is passed
        if (this.props.margins) { this.marginH = this.props.margins.horizontal; this.marginV = this.props.margins.vertical; }
        if (this.props.xAxisTransform) this.marginV += 6;

        // Text margins
        this.textPaddingV = 18;

        // Colors
        this.theme = {
            background: '#00acc1',
            bar: '#007c91',
            value: 'rgba(0,0,0,0.7)',
            xLabel: '#5ddef4',
            line: '#5ddef4'
        }
        if (this.props.theme) this.theme = this.props.theme;

    }

    /**
     * Creates the whole graph
     */
    createGraph(data, lineData) {

        if (!data) return;

        if (this.svg) this.svg.remove();

        this.svg = d3.select('#' + this.compId).append('svg').attr('width', this.width).attr('height', this.height);

        // Create ranges
        // Define the min and max y values
        // let yMin = d3.min(data, (d) => {return d.y});
        this.yMax = d3.max(data, (d) => { return d.y });

        // Update the scales
        this.x = d3.scaleBand().paddingInner(0.05).range([this.marginH, this.width - this.marginH]).domain(data.map((d) => { return d.x }));
        this.y = d3.scaleLinear().range([this.textPaddingV, this.height - this.textPaddingV]).domain([0, this.yMax]);
        this.fontScale = d3.scaleLinear().range([6, 11]).domain([24, 4]);

        // Bars
        this.createBars(data);

        // Lines 
        this.createLine(lineData);

        // Text
        if (this.props.valueLabelTransform) this.createValueLabels(data);

        // X Labels
        if (this.props.xAxisTransform) this.createXAxis(data);

    }

    /**
     * Creates a line with line data, if any
     */
    createLine(data) {

        // It could be that there is no line data
        if (!data) return;

        // Properties
        let fill = 'none';

        // Create the line
        var line = d3.line()
            .x((d) => { return this.x(d.x) + this.x.bandwidth() / 2 })
            .y((d) => { return this.height - this.y(d.y) })

        this.svg.append('g').append('path').datum(data)
            .attr('d', line)
            .attr('fill', fill)
            .attr('stroke-width', 2)
            .attr('stroke', this.theme.line);

        // Add a point 
        this.svg.selectAll('.point').data(data).enter().append('circle')
            .attr('class', 'point')
            .attr('cx', (d) => { return this.x(d.x) + this.x.bandwidth() / 2 })
            .attr('cy', (d) => { return this.height - this.y(d.y) })
            .attr('r', 4)
            .attr('fill', this.theme.line)

    }

    /**
     * Creates the bars
     */
    createBars(data) {

        if (!data || data.length === 0) return;

        this.svg.selectAll('.bar').data(data).enter().append('rect')
            .attr('class', 'bar')
            .attr('x', (d) => { return this.x(d.x) })
            .attr('y', this.height)
            .attr('width', this.x.bandwidth())
            .attr('height', 0)
            .on('click', (e, d) => { this.onBarClick(e, d); })
            .transition()
            .attr('y', (d) => { return this.height - this.y(d.y) })
            .attr('height', (d) => { return this.y(d.y) })
            .attr('fill', this.theme.bar)

    }

    /**
     * Create x labels
     */
    createXAxis(data) {

        if (!data || data.length === 0) return;

        this.svg.selectAll('.xlabel').data(data).enter().append('text')
            .attr('class', 'xlabel')
            .attr('x', (d) => { return this.x(d.x) + this.x.bandwidth() / 2 })
            .attr('y', this.height - 6)
            .attr('fill', this.theme.xLabel)
            .attr('font-size', this.fontScale(data.length))
            .style('text-anchor', 'middle')
            .text((d) => { return this.props.xAxisTransform(d.x) })

    }

    /**
     * Create value labels
     */
    createValueLabels(data) {

        if (!data || data.length === 0) return;

        this.svg.selectAll('.valuelabel').data(data).enter().append('text')
            .attr('class', 'valuelabel')
            .attr('x', (d) => { return this.x(d.x) + this.x.bandwidth() / 2 })
            .attr('y', (d) => { return this.height - this.y(d.y) - 6 })
            .attr('fill', this.theme.value)
            .attr('font-size', this.fontScale(data.length))
            .style('text-anchor', 'middle')
            .text((d) => { return this.props.valueLabelTransform(d.y) })

    }

    /**
     * Creates the images to be displayed
     */
    createImages(data) {

        if (!data || data.length === 0) return;

        var images = data.map((item, index) => {

            let size = 12;
            let xLabelHeight = (this.props.xAxisTransform ? 6 + this.fontScale(data.length) : 0)
            let valueLabelPos = this.height - this.y(item.y) - 6;
            let color = this.theme.xLabel;

            let posx = this.x(item.x) + this.x.bandwidth() / 2 - size / 2;
            let posy = this.height - 6 - xLabelHeight - size;

            if (xLabelHeight + size + 6 >= this.y(item.y)) posy = valueLabelPos - this.fontScale(data.length) - 18;

            let img = this.props.valueImage(item, index);
            if (img == null) img = require('../img/question.svg');

            // return (<SVG key={'TotoBarImg-' + index} style={{ position: 'absolute', color: color, left: posx, top: posy, width: size + 'px', height: size + 'px' }} src={img} className='image' />)
            return;
        });

        return images;

    }

    /**
     * Reacs to the click of a bar
     */
    onBarClick(event, data) {

        if (this.props.onBarClick) {

            // Change the opacity
            event.target.classList.add("touched");
            setTimeout(() => {
                event.target.classList.remove("touched");

                setTimeout(() => {
                    // Call the callback
                    this.props.onBarClick(data);
                }, 10);

            }, 10)

        }
    }

    render() {

        this.createGraph(this.props.data, this.props.lineData);

        let images;
        if (this.props.valueImage) images = this.createImages(this.props.data);

        return (
            <div id={this.compId} className="toto-bar-chart">
                {images}
            </div>
        )
    }
}
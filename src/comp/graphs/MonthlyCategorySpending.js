import './MonthlyCategorySpending.css'
import { useEffect, useState, useRef } from "react";
import ExpensesAPI from "../../services/ExpensesAPI";
import moment from "moment";
import * as d3 from 'd3'
import CategoryPicker from "../cateogrypicker/CategoryPicker";

/**
 * This component generates a graph using D3.js to visualize the spending per category for each month.
 * It displays the data as a line chart with each line representing a different category. Responsive.
 */
export function MonthlyCategorySpending({ currency, monthsDepth = 6 }) {

    const [totals, setTotals] = useState(null);
    const [category, setCategory] = useState('SUPERMERCATO');
    const [avgCategorySpend, setAvgCategorySpend] = useState(null);

    const graphRef = useRef(null)
    const secondGraphRef = useRef(null)


    const onChangeCategory = (category) => {
        setCategory(category);

        const filteredTotals = filterCategory(totals, category);

        // Fix missing data points in the totals            
        const fixedTotals = fixMissingDataPoints(filteredTotals);

        buildGraph(fixedTotals);
        buildYearlyGraph(avgCategorySpend, category);

    }

    const loadData = async () => {

        const avgCategorySpend = await loadAvgMonthlyCatSpend();
        const monthlyCategorySpend = await loadCategorySpendingPerMonth();

        setTotals(monthlyCategorySpend);
        setAvgCategorySpend(avgCategorySpend);

        const filteredTotals = filterCategory(monthlyCategorySpend, category);

        // Fix missing data points in the totals            
        const fixedTotals = fixMissingDataPoints(filteredTotals);

        buildGraph(fixedTotals, avgCategorySpend);
        buildYearlyGraph(avgCategorySpend, category);
    }

    const loadAvgMonthlyCatSpend = async () => {

        const data = await new ExpensesAPI().getCategoriesAvgMonthlySpendPerYear("201801", currency)

        return data;
    }

    /**
     * Retrieves the spending per category for each month starting monthsDepth months ago
     * and ending with the current month.
     */
    const loadCategorySpendingPerMonth = async () => {

        const now = new Date();
        const startDate = moment(new Date(now.getFullYear(), now.getMonth() - (monthsDepth - 1), 1)).format('YYYYMM');
        const totals = await new ExpensesAPI().getCategoryTotalsPerMonth(startDate, currency);

        return totals
    }

    /**
     * Function that filters the totals to only extract the specified category (category)
     */
    const filterCategory = (totals, category) => {
        if (!totals || !totals.categories) {
            return null;
        }

        const filteredCategory = totals.categories.find(c => c.category === category);
        if (!filteredCategory) {
            return null;
        }

        return {
            categories: [filteredCategory]
        };
    };

    /**
     * Fixes missing data points in the data array.
     * 
     * The "totals" parameter is an object with the following structure:
     * {categories: [{category: "", months: [{yearMonth: "", amount: 0}, ...]}, ...]}
     * 
     * The months array has an ordered list of months (format YYYYMM). Some months can be missing and this function fills the missing months with a zero amount. 
     */
    const fixMissingDataPoints = (totals) => {
        if (!totals || !totals.categories) {
            return totals;
        }

        const allMonths = [];
        const now = moment();
        for (let i = 0; i < monthsDepth; i++) {
            allMonths.push(now.clone().subtract(i, 'months').format('YYYYMM'));
        }
        allMonths.reverse();

        totals.categories.forEach(category => {
            const monthMap = new Map(category.months.map(monthData => [moment(monthData.yearMonth, "YYYYMM").format("YYYYMM"), monthData.amount]));

            const filledMonths = allMonths.map(month => ({
                yearMonth: month,
                amount: monthMap.has(month) ? monthMap.get(month) : 0
            }));

            category.months = filledMonths;
        });

        return totals;
    }


    /**
     * Generates the D3.js line chart graph based on the category totals per month.
     * 
     * The graph is instered in the `graphRef` div.
     * 
     * The "totals" parameter is an object wiht the following structure:
     * {categories: [{category: "", months: [{yearMonth: "", amount: 0}, ...]}, ...]}
     * 
     * There should be no legend. 
     * There should be no left axis.
     * The bottom axis should have no line, and only show the labels of the year Month in format (MM.YY)
     * The line of each category should have a small filled circle for every data point. 
     * Put the amount on top of the circle. The amount should be in k (so divided by 1000) and max 1 decimal
     * 
     */
    const buildGraph = (totals) => {

        if (!totals) {
            return;
        }

        // Clear any existing SVG elements
        d3.select(graphRef.current).select("svg").remove();

        // Set up the SVG canvas dimensions
        const margin = { top: 44, right: 30, bottom: 20, left: 15 };
        
        const width = graphRef.current.clientWidth - margin.left - margin.right;
        const height = graphRef.current.clientHeight - margin.top - margin.bottom;

        const svg = d3.select(graphRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Parse the data into a format suitable for D3
        const data = totals.categories.map(categoryData => ({
            category: categoryData.category,
            values: categoryData.months.map(monthData => ({
                month: moment(monthData.yearMonth, "YYYYMM").toDate(),
                total: monthData.amount
            }))
        }));

        // Set up scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(data.flatMap(d => d.values), d => d.month))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([d3.min(data, d => d3.min(d.values, v => v.total)), d3.max(data, d => d3.max(d.values, v => v.total))])
            .range([height - 5, 0]);

        // Add lines for each category
        const line = d3.line()
            .x(d => xScale(d.month))
            .y(d => yScale(d.total));

        // Limit the number of x-axis ticks to "monthsDepth"
        const xAxis = d3.axisBottom(xScale)
            .ticks(monthsDepth)
            .tickFormat(d3.timeFormat("%b"))

        svg.append("g")
            .attr("transform", `translate(0,-${height})`)
            .attr("class", "x-axis")
            .call(xAxis)
            .selectAll("text") // Select all x-axis labels
            .style("font-size", "9px"); // Set the font size to smaller
            
        svg.selectAll("path, line") // Remove axis line and ticks
            .remove()


        data.forEach(categoryData => {
            // Draw the line
            svg.append("path")
                .datum(categoryData.values)
                .attr("fill", "none")
                .attr("stroke", 'var(--color-light-primary)')
                .attr("stroke-width", 2)
                .attr("d", line);

            // Add circles for each data point
            svg.selectAll(`.circle-${categoryData.category}`)
                .data(categoryData.values)
                .enter()
                .append("circle")
                .attr("cx", d => xScale(d.month))
                .attr("cy", d => yScale(d.total))
                .attr("r", 4)
                .attr("fill", 'var(--color-light-primary)');

            // Add text labels for each data point
            svg.selectAll(`.label-${categoryData.category}`)
                .data(categoryData.values)
                .enter()
                .append("text")
                .attr("x", d => xScale(d.month))
                .attr("y", d => yScale(d.total) - 10)
                .attr("text-anchor", "middle")
                .attr("font-size", "10px")
                .attr("fill", "var(--color-dark-primary)")
                .text(d => (d.total / 1000).toFixed(1) + 'k')
                .style("font-size", "8px"); // Set the font size to smaller
        });
    }


    /**
     * Uses D3js to draw a bar chart that shows for the targetCategory and for each year the average monthly spend.
     * 
     * The y axis is not shown, there is no legend, the x axis only shows the label, not any line. 
     * 
     * @param {} data an object formatted like so: {categories: [{category: "", avgMonthlySpend: [{year: number, amount: number}, ...]}, ...]}
     */
    const buildYearlyGraph = (data, targetCategory) => {

        if (!data || !data.categories) {
            return;
        }

        // Clear any existing SVG elements
        d3.select(secondGraphRef.current).select("svg").remove();

        // Set up the SVG canvas dimensions
        const margin = { top: 20, right: 30, bottom: 20, left: 15 };
        const width = secondGraphRef.current.clientWidth - margin.left - margin.right;
        const height = secondGraphRef.current.clientHeight - margin.top - margin.bottom;

        const svg = d3.select(secondGraphRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Filter data for the target category
        const categoryData = data.categories.find(c => c.category === targetCategory);
        if (!categoryData || !categoryData.avgMonthlySpend) {
            return;
        }

        // Parse the data into a format suitable for D3
        const parsedData = categoryData.avgMonthlySpend.map(d => ({
            year: d.year,
            amount: d.amount
        }));

        // Set up scales
        const xScale = d3.scaleBand()
            .domain(parsedData.map(d => d.year))
            .range([0, width])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(parsedData, d => d.amount)])
            .range([height, 0]);

        // Add bars
        svg.selectAll(".bar")
            .data(parsedData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.year))
            .attr("y", d => yScale(d.amount))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d.amount))
            .attr("fill", "var(--color-dark-primary)");

        // Add text labels for each bar
        svg.selectAll(".label")
            .data(parsedData)
            .enter()
            .append("text")
            .attr("x", d => xScale(d.year) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d.amount) - 5)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill", "var(--color-light-primary)")
            .text(d => (d.amount / 1000).toFixed(1) + 'k')
            .style("font-weight", "bold")
            

        // Add x-axis
        const xAxis = d3.axisBottom(xScale);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .selectAll("path, line") // Remove axis line and ticks
            .remove();

    }

    useEffect(() => { loadData() }, []);

    return (
        <div className="monthly-category-spending">
            <div className="row">
                <div className="title">Category spend & Yearly Average Spend</div>
                <CategoryPicker size='xxs' hideLabel={true} category={category} onCategoryChange={onChangeCategory} />
            </div>
            <div ref={graphRef} className="totograph" >
            </div>
            <div ref={secondGraphRef} className="totograph" >
            </div>
        </div>
    )
}
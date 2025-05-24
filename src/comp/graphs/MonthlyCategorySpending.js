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
export function MonthlyCategorySpending({ currency, topCategorries = 3 }) {

    const [totals, setTotals] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [category, setCategory] = useState('SUPERMERCATO');
    const graphRef = useRef(null)

    const onChangeCategory = (category) => {
        setCategory(category);
        setSelectedCategory(category);

        const filteredTotals = filterCategory(totals, category);

        // Fix missing data points in the totals            
        const fixedTotals = fixMissingDataPoints(filteredTotals);

        buildGraph(fixedTotals);

    }

    /**
     * Retrieves the spending per category for each month starting 5 months ago
     * and ending with the current month.
     */
    const loadCategorySpendingPerMonth = async () => {
        try {
            const now = new Date();
            const startDate = moment(new Date(now.getFullYear(), now.getMonth() - 5, 1)).format('YYYYMM');
            const totals = await new ExpensesAPI().getCategoryTotalsPerMonth(startDate, currency);

            setTotals(totals);

            const filteredTotals = filterCategory(totals, category);

            // Fix missing data points in the totals            
            const fixedTotals = fixMissingDataPoints(filteredTotals);

            buildGraph(fixedTotals);

        } catch (error) {
            console.error('Failed to load category spending:', error);
        }
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
        for (let i = 0; i < 6; i++) {
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
        const margin = { top: 40, right: 30, bottom: 30, left: 10 };
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
            .range([height, 0]);

        // Add bottom axis with no line and labels in "MM.YY" format
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickFormat(d3.timeFormat("%b"))
            )
            .selectAll("path, line") // Remove axis line and ticks
            .remove();

        // Add lines for each category
        const line = d3.line()
            .x(d => xScale(d.month))
            .y(d => yScale(d.total));


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
                .text(d => (d.total / 1000).toFixed(1) + 'k');
        });
    }

    useEffect(() => { loadCategorySpendingPerMonth() }, []);

    return (
        <div className="monthly-category-spending">
            <div className="row">
                <div className="title">Spend by Category <span className="small">({currency})</span></div>
                <CategoryPicker size='xxs' hideLabel={true} category={category} onCategoryChange={onChangeCategory} />
            </div>
            <div ref={graphRef} className="totograph savingsperyear" >
            </div>
        </div>
    )
}
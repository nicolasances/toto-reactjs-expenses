'use client'

import { useEffect, useState, useRef } from "react";
import moment from "moment";
import * as d3 from 'd3'
import { ExpensesAPI } from "@/api/ExpensesAPI";
import CategoryPicker from "@/components/categorypicker/CategoryPicker";
import { CategoriesAvgMonthlySpendResponse, CategoryTotalsPerMonthResponse } from "@/model/stats";
import './MonthlyCategorySpending.css'

interface MonthlyCategorySpendingProps {
    currency?: string;      // The currency to show the amounts in
    monthsDepth?: number;   // (optional, default 6) how many months to show, ending with the current month
}

/**
 * This component generates a graph using D3.js to visualize the spending per category for each month.
 * It displays the data as a line chart with each line representing a different category. Responsive.
 *
 * @param {MonthlyCategorySpendingProps} props the props
 */
export function MonthlyCategorySpending({ currency, monthsDepth = 6 }: MonthlyCategorySpendingProps) {

    const [totals, setTotals] = useState<CategoryTotalsPerMonthResponse | null>(null);
    const [category, setCategory] = useState('SUPERMERCATO');
    const [avgCategorySpend, setAvgCategorySpend] = useState<CategoriesAvgMonthlySpendResponse | null>(null);

    const graphRef = useRef<HTMLDivElement>(null)
    const secondGraphRef = useRef<HTMLDivElement>(null)

    /**
     * When the user picks a different category: redraws both graphs
     */
    const onChangeCategory = (category: string) => {
        setCategory(category);

        const filteredTotals = filterCategory(totals, category);

        // Fix missing data points in the totals
        const fixedTotals = fixMissingDataPoints(filteredTotals);

        buildGraph(fixedTotals);
        buildYearlyGraph(avgCategorySpend, category);

    }

    /**
     * Loads the data and builds the graphs
     */
    const loadData = async () => {

        const avgCategorySpend = await loadAvgMonthlyCatSpend();
        const monthlyCategorySpend = await loadCategorySpendingPerMonth();

        setTotals(monthlyCategorySpend);
        setAvgCategorySpend(avgCategorySpend);

        const filteredTotals = filterCategory(monthlyCategorySpend, category);

        // Fix missing data points in the totals
        const fixedTotals = fixMissingDataPoints(filteredTotals);

        buildGraph(fixedTotals);
        buildYearlyGraph(avgCategorySpend, category);
    }

    /**
     * Loads the average monthly spend per category, for each year
     */
    const loadAvgMonthlyCatSpend = async () => {

        const data = await new ExpensesAPI().getCategoriesAvgMonthlySpendPerYear("201801", currency ?? "")

        return data;
    }

    /**
     * Retrieves the spending per category for each month starting monthsDepth months ago
     * and ending with the current month.
     */
    const loadCategorySpendingPerMonth = async () => {

        const now = new Date();
        const startDate = moment(new Date(now.getFullYear(), now.getMonth() - (monthsDepth - 1), 1)).format('YYYYMM');
        const totals = await new ExpensesAPI().getCategoryTotalsPerMonth(startDate, currency ?? "");

        return totals
    }

    /**
     * Function that filters the totals to only extract the specified category (category)
     */
    const filterCategory = (totals: CategoryTotalsPerMonthResponse | null, category: string): CategoryTotalsPerMonthResponse | null => {
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
    const fixMissingDataPoints = (totals: CategoryTotalsPerMonthResponse | null) => {
        if (!totals || !totals.categories) {
            return totals;
        }

        const allMonths: string[] = [];
        const now = moment();
        for (let i = 0; i < monthsDepth; i++) {
            allMonths.push(now.clone().subtract(i, 'months').format('YYYYMM'));
        }
        allMonths.reverse();

        totals.categories.forEach(category => {
            const monthMap = new Map(category.months.map(monthData => [moment(monthData.yearMonth, "YYYYMM").format("YYYYMM"), monthData.amount]));

            const filledMonths = allMonths.map(month => ({
                yearMonth: month,
                amount: monthMap.has(month) ? monthMap.get(month) as number : 0
            }));

            category.months = filledMonths;
        });

        return totals;
    }


    /**
     * Generates the D3.js line chart graph based on the category totals per month.
     *
     * The graph is inserted in the `graphRef` div.
     *
     * There should be no legend.
     * There should be no left axis.
     * The bottom axis should have no line, and only show the labels of the year Month in format (MM.YY)
     * The line of each category should have a small filled circle for every data point.
     * Put the amount on top of the circle. The amount should be in k (so divided by 1000) and max 1 decimal
     */
    const buildGraph = (totals: CategoryTotalsPerMonthResponse | null) => {

        const container = graphRef.current

        if (!container) return;

        // Clear any existing SVG elements
        d3.select(container).select("svg").remove();

        if (!totals || !totals.categories) {
            return;
        }

        // Set up the SVG canvas dimensions
        const margin = { top: 44, right: 30, bottom: 20, left: 15 };

        const width = container.clientWidth - margin.left - margin.right;
        const height = container.clientHeight - margin.top - margin.bottom;

        const svg: any = d3.select(container)
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
        const xScale: any = d3.scaleTime()
            .domain(d3.extent(data.flatMap(d => d.values), d => d.month) as [Date, Date])
            .range([0, width]);

        const yScale: any = d3.scaleLinear()
            .domain([d3.min(data, d => d3.min(d.values, v => v.total)) ?? 0, d3.max(data, d => d3.max(d.values, v => v.total)) ?? 0])
            .range([height - 5, 0]);

        // Add lines for each category
        const line: any = d3.line()
            .x((d: any) => xScale(d.month))
            .y((d: any) => yScale(d.total));

        // Limit the number of x-axis ticks to "monthsDepth"
        const xAxis: any = d3.axisBottom(xScale)
            .ticks(monthsDepth)
            .tickFormat(d3.timeFormat("%b") as any)

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
                .attr("cx", (d: any) => xScale(d.month))
                .attr("cy", (d: any) => yScale(d.total))
                .attr("r", 4)
                .attr("fill", 'var(--color-light-primary)');

            // Add text labels for each data point
            svg.selectAll(`.label-${categoryData.category}`)
                .data(categoryData.values)
                .enter()
                .append("text")
                .attr("x", (d: any) => xScale(d.month))
                .attr("y", (d: any) => yScale(d.total) - 10)
                .attr("text-anchor", "middle")
                .attr("font-size", "10px")
                .attr("fill", "var(--color-dark-primary)")
                .text((d: any) => (d.total / 1000).toFixed(1) + 'k')
                .style("font-size", "8px"); // Set the font size to smaller
        });
    }


    /**
     * Uses D3js to draw a bar chart that shows for the targetCategory and for each year the average monthly spend.
     *
     * The y axis is not shown, there is no legend, the x axis only shows the label, not any line.
     *
     * @param {CategoriesAvgMonthlySpendResponse} data an object formatted like so: {categories: [{category: "", avgMonthlySpend: [{year: number, amount: number}, ...]}, ...]}
     * @param {string} targetCategory the category to draw
     */
    const buildYearlyGraph = (data: CategoriesAvgMonthlySpendResponse | null, targetCategory: string) => {

        const container = secondGraphRef.current

        if (!container) return;

        // Clear any existing SVG elements
        d3.select(container).select("svg").remove();

        if (!data || !data.categories) {
            return;
        }

        // Set up the SVG canvas dimensions
        const margin = { top: 20, right: 30, bottom: 20, left: 15 };
        const width = container.clientWidth - margin.left - margin.right;
        const height = container.clientHeight - margin.top - margin.bottom;

        const svg: any = d3.select(container)
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
        const xScale: any = d3.scaleBand()
            .domain(parsedData.map(d => String(d.year)))
            .range([0, width])
            .padding(0.2);

        const yScale: any = d3.scaleLinear()
            .domain([0, d3.max(parsedData, d => d.amount) ?? 0])
            .range([height, 0]);

        // Add bars
        svg.selectAll(".bar")
            .data(parsedData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d: any) => xScale(String(d.year)))
            .attr("y", (d: any) => yScale(d.amount))
            .attr("width", xScale.bandwidth())
            .attr("height", (d: any) => height - yScale(d.amount))
            .attr("fill", "var(--color-dark-primary)");

        // Add text labels for each bar
        svg.selectAll(".label")
            .data(parsedData)
            .enter()
            .append("text")
            .attr("x", (d: any) => xScale(String(d.year)) + xScale.bandwidth() / 2)
            .attr("y", (d: any) => yScale(d.amount) - 5)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill", "var(--color-light-primary)")
            .text((d: any) => (d.amount / 1000).toFixed(1) + 'k')
            .style("font-weight", "bold")


        // Add x-axis
        const xAxis: any = d3.axisBottom(xScale);

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

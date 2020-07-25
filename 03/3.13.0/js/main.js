/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

const margin = {left: 100, right: 20, top: 10, bottom: 80}
const width = 600 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const g = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("style", "background:lightblue")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

// X Label
g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - margin.top)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month")

// Y Label
g.append("text")
    .attr("class", "y axis-label")
    .attr("x", -(height/2))
    .attr("y", -margin.left*.6)
    .attr("font-size", "20px")
    .attr("font-weight", "500")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue (grey) + Profit (pink)")


;(async function run() {
    const data = await d3.json("data/revenues.json")

    const x = d3.scaleBand()
        .domain(data.map(d => d.month))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3)

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.revenue)])
        .range([height, 0])


    const xAxisCall = d3.axisBottom(x)

    g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxisCall)
        .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)")

    const yAxisCall = d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d => `$${d}`)

    g.append("g")
        .attr("class", "y-axis")
        .call(yAxisCall)


    const rects = g.selectAll("rect").data(data)

    rects.enter()
        .append("rect")
        .attr("x", d => x(d.month))
        .attr("y", d => y(d.revenue))
        .attr("width", x.bandwidth()*.5)
        .attr("height", (d) => height - y(d.revenue))
        .attr("fill", 'grey')

    rects.enter()
        .append("rect")
        .attr("x", d => x(d.month) + x.bandwidth()*.5)
        .attr("y", d => y(d.profit))
        .attr("width", x.bandwidth()*.5)
        .attr("height", (d) => height - y(d.profit))
        .attr("fill", (d, i) => {
            return 'pink'
        })
})()
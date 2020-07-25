/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.8 - Activity: Your first visualization!
*/

/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.7 - Loading external data
*/

(async function run() {
    const data = await d3.json("data/buildings.json")
    console.log(data)

    const svg = d3.select("#chart-area").append("svg")
        .attr("width", 400)
        .attr("height", 400)

    const rects = svg.selectAll("rect").data(data)

    rects.enter()
        .append("rect")
        .attr("x", (d, i) => (i * 50))
        .attr("y", 0)
        .attr("width", 25)
        .attr("height", (d, i) => d.height)
        .attr("fill", (d, i) => {
            return (i + 1) % 2 === 0 ? "green" : "blue"
        })
})()
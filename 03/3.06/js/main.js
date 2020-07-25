/*
*    main.js
*    Mastering Data Visualization with D3.js
*    3.6 - Band scales
*/


var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", "400")
    .attr("height", "400")

d3.json("data/buildings.json").then(function (data) {
    console.log(data)

    data.forEach(function (d) {
        d.height = +d.height
    })

    var x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, 400])
        .paddingInner(0.3)
        .paddingOuter(0.3)

    console.log('x("Burj Khalifa")', x("Burj Khalifa"))

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.height)])
        .range([0, 400])

    var rects = svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", 0)
        .attr("x", function (d) {
            return x(d.name)
        })
        .attr("width", x.bandwidth)
        .attr("height", function (d) {
            return y(d.height)
        })
        .attr("fill", function (d) {
            return "grey"
        })

})
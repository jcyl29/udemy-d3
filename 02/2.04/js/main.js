/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.4 - Adding SVGs with D3
*/

var svg = d3.select("#chart-area").append("svg")
    .attr("width", 400)
    .attr("height", 400)

var circle = svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 70)
    .attr("height", 110)
    .attr("fill", "hotpink")

svg.append('ellipse').attr("cx", 100).attr("cy", 20).attr('rx', 10).attr('ry', 20).attr('fill', 'blue')
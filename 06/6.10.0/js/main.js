/*
*    main.js
*    Mastering Data Visualization with D3.js
*    CoinStats
*/

const margin = {left: 80, right: 100, top: 50, bottom: 100},
    height = 500 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right

const svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

// Time parser for x-scale
const parseTime = d3.timeParse("%d/%m/%Y")
const formatTime = d3.timeFormat("%m-%d-%y")

// Scales
const x = d3.scaleTime().range([0, width])
const y = d3.scaleLinear().range([height, 0])

// basic transition animation
const t = () => d3.transition().duration(1000)

// Axis generators
const xAxisCall = d3.axisBottom().ticks(4)
const yAxisCall = d3.axisLeft()
    .ticks(9)
    .tickFormat(d => {
        // .2 is part of the "precision" specifier part of
        // https://github.com/d3/d3-format
        // the s is a type value meaning
        // decimal notation with an SI prefix, rounded to significant digits.
        const formatSi = d3.format(".2s") // example result: formatSi(1000000000) => 1.0G
        const s = formatSi(d)
        const lastChar = s.substr[-1]
        switch (lastChar) {
            case "G":
                return s.replace('G', 'B')
            case "k":
                return s.replace('k', 'K')
        }
        return s
    })

// Axis groups
const xAxis = g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height})`)
const yAxis = g.append("g")
    .attr("class", "y axis")

// Y-Axis label
yAxis.append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", -170)
    .attr("fill", "#5D6971")
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Population")

// Line path generator
const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value))

const initToolTip = (g, data) => {
    const bisectDate = d3.bisector(d => d.date).left

    const mousemove = function () {
        const x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0
        focus.attr("transform", `translate(${x(d.date)},${y(d.value)})`)
        focus.select("text").text(() => d3.format('$,.2f')(d.value))
        focus.select(".x-hover-line").attr("y2", height - y(d.value))
        focus.select(".y-hover-line").attr("x2", -x(d.date))
    }

    const focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none")

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height)

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", 0)
        .attr("x2", width)

    focus.append("circle")
        .attr("r", 7.5)

    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em")

    g.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function () {
            focus.style("display", 'block')
        })
        .on("mouseout", function () {
            focus.style("display", "none")
        })
        .on("mousemove", mousemove)
}

$("#date-slider").slider({
    range: true,
    max: parseTime("31/10/2017").getTime(),  // in milliseconds
    min: parseTime("12/5/2013").getTime(),  // in milliseconds
    step: 86400000, // One day in milliseconds
    values: [parseTime("12/5/2013").getTime(), parseTime("31/10/2017").getTime()],
    stop: (event, ui) => {
        console.log('ui.values', ui.values)
        $("#dateLabel1").text(formatTime(new Date(ui.values[0])))
        $("#dateLabel2").text(formatTime(new Date(ui.values[1])))
        update()
    }
})

$("#coin-select").change((e) => {
    console.log('coin-select', e.target.value)
    update()
})

$("#var-select").change((e) => {
    console.log('var-select', e.target.value)
    update()
})

const update = () => {
    // Filter data based on selections
    const coin = $("#coin-select").val()
    const yValue = $("#var-select").val()
    const sliderValues = $("#date-slider").slider("values")

    console.log('slidervalues', sliderValues)

    const data = filteredData[coin]
    // Data cleaning
    data.forEach(d => {
        d.value = d[yValue]
    })

    // filter data from date range from values provided from slider
    const dataToRender = data.filter(d =>
        d.date.getTime() >= sliderValues[0] && d.date.getTime() <= sliderValues[1]
    )

    // Set scale domains
    x.domain(d3.extent(dataToRender, function (d) {
        return d.date
    }))
    y.domain([d3.min(dataToRender, function (d) {
        return d.value
    }) / 1.005,
        d3.max(dataToRender, function (d) {
            return d.value
        }) * 1.005])

    // Generate axes once scales have been set
    xAxis.call(xAxisCall.scale(x))
    yAxis.call(yAxisCall.scale(y))

    const renderedLine = g.select('.line')

    if (renderedLine.size() === 0) {
        // Add line to chart
        g.append("path")
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("stroke-with", "3px")
            .attr("d", line(dataToRender))
    } else {
        // update the existing line
        renderedLine.transition(t).attr('d', line(dataToRender))
    }

    const yAxisNameMap = {
        price_usd: "Price (USD)",
        market_cap: "Market Capitalization (USD)",
        '24h_vol': "24 Hour Trading Volume (USD)"
    }

    yAxis.select('.axis-title').text(yAxisNameMap[yValue])

    initToolTip(g, dataToRender)
}

const filteredData = {}

;(async function run() {
    const rawData = await d3.json("data/coins.json")

    Object.keys(rawData).forEach(coin => {
        filteredData[coin] = rawData[coin].filter(d => d.price_usd)
        filteredData[coin].forEach(d => {
            d.price_usd = parseFloat(d.price_usd, 10)
            d["24h_vol"] = parseFloat(d["24h_vol"], 10)
            d.market_cap = parseFloat(d.market_cap, 10)
            d.date = parseTime(d.date)
        })
    })

    console.log(filteredData)
    update()
})()
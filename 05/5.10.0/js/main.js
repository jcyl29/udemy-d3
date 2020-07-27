/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

const margin = {left: 80, right: 20, top: 50, bottom: 100}
const height = 500 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right

const g = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("style", "background: white")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

// X Label
g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - margin.top)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("GDP Per Capita ($)")

// Y Label
g.append("text")
    .attr("class", "y axis-label")
    .attr("x", -(height / 2))
    .attr("y", -margin.left * .6)
    .attr("font-size", "20px")
    .attr("font-weight", "500")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Life Expectancy (Years)")

const yearLabel = g.append("text")
    .attr("class", "year axis-label")
    .attr("x", width - margin.left - margin.right)
    .attr("y", height - margin.top)
    .attr("font-size", "20px")
    .attr("font-weight", "500")
    .attr("fill", "darkslategray")


// instructor's way
var area = d3.scaleLinear()
    .range([25 * Math.PI, 1500 * Math.PI])
    .domain([2000, 1400000000])

// my way to make scale for the population
const populationAreaScale = d3.scaleLinear()
    .range([1, 3000000])
    .domain([1, 1400000000])


const continentColor = d3.scaleOrdinal(d3.schemePastel1)

const areaToRadius = area => Math.sqrt(area / Math.PI)

const x = d3.scaleLog()
    .base(10)
    .domain([142, 150000])
    .range([0, width])

const xAxisCall = d3.axisBottom(x)
    .tickValues([400, 4000, 40000])
    .tickFormat(d3.format("$~s")) // $40k
    // .tickFormat(d3.format("$,")) // $40,000
// d3.format returns a function, which is passed to .tickFormat, https://github.com/d3/d3-format
// this expression is the same: .tickFormat(tickValue => d3.format("$")(tickValue))

g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxisCall)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "12")
    .attr("text-anchor", "end")


const y = d3.scaleLinear()
    .domain([0, 90])
    .range([height, 0])

const yAxisCall = d3.axisLeft(y)

g.append("g")
    .attr("class", "y-axis")
    .call(yAxisCall)


const filteredCountries = countries => countries.filter(countryData => {
    if (!countryData.income || !countryData.life_exp) {
        // console.log(`country ${countryData.country} missing data`)
        return false
    }

    return countryData.income && countryData.life_exp
})

const update = data => {
        const t = d3.transition().duration(100)

        const countryData = data.countries
        // the data method as a 2nd argument which is a "keying" function
        // i.e. it tell D3 which item is a unique datum in between update calls
        // A key function may be specified to control which datum is assigned to which element,
        // replacing the default join-by-index.
        // https://stackoverflow.com/questions/38805912/d3js-what-does-it-mean-when-the-2nd-param-in-data-is-a-function/38806391
        const circles = g.selectAll("circle").data(filteredCountries(countryData), (d) => {
            return d.country
        })

        circles.join("circle")
            .transition(t)
            .attr("cx", d => x(d.income))
            .attr("cy", d => y(d.life_exp))
            .attr("r", d => {
                console.log("areaToRadius(d.population)", areaToRadius(d.population), "populationAreaScale(areaToRadius(d.population))", populationAreaScale(areaToRadius(d.population)), "sqrt(area(d.population", area(d.population), 'd.population', d.population, 'Math.sqrt(area(d.population) / Math.PI)', Math.sqrt(area(d.population) / Math.PI))
                // return Math.sqrt(area(d.population) / Math.PI)  <-- instructor's way
                return populationAreaScale(areaToRadius(d.population))
            })
            .attr("fill", d => continentColor(d.continent))
            .attr("id", d => d.country)

        yearLabel.text(`Year: ${data.year}`)
    }


;(async function run() {
    const data = await d3.json("data/data.json")

    console.log(data)
    let yearIndex = 0
    d3.interval(() => {
        // At the end of our data, loop back
        yearIndex = yearIndex < (data.length - 1) ? yearIndex + 1 : 0
        update(data[yearIndex])
    }, 100)

    update(data[0])
})()
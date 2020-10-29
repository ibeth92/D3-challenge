// Set height and width for svg
let svgWidth = 960;
let svgHeight = 500;

let margin = {
        top: 60,
        right: 60,
        bottom: 60,
        left: 60,
};
// Set width and height for chart 
let width = svgWidth - margin.left- margin.right;
let height = svgHeight - margin.top - margin.bottom;
// Create svg wrapper
let svg = d3
    .select(`#scatter`)
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
// Append svg group
let chartGroup = svg
    .append("g")
    .attr("transfrom", `translate{$margin.left}, ${margin.top})`);
    d3.csv("./assets/data/data.csv").then(function(censusData){
        console.log(censusData);
    
        censusData.forEach(function(data){
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
        });
    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d.poverty),
        d3.max(censusData, d => d.poverty)])
        .range([0, width]);
    let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.healthcare)])
        .range([height, 0]);
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);
    
    let drawLine = d3.line()
            .x(selectData => xLinearScale(selectData.poverty))
            .y(selectData => yLinearScale(selectData.healthcare));
    
    chartGroup.append("g")
        .classed("axis", true)
        .call(leftAxis);
    });
function renderAxes()

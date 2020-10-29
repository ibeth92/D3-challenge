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
let chartWidth = svgWidth - margin.left- margin.right;
let chartHeight = svgHeight - margin.top - margin.bottom;
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


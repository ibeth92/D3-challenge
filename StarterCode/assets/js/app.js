// Set height and width for svg
// Use hair metal activity as code example
let svgWidth = 960;
let svgHeight = 500;
// Set margins
let margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

// Set width and height for chart 
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper
// Append SVG group to hold chart
let svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append chart SVG group
// Shift by left and top margins
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Set up x and y Axis labels
let chartData = null;
let chosenXAxis = 'poverty'
let chosenYAxis = 'healthcare'
let xAxisLabels = ["poverty", "age", "income"]; 
let yAxisLabels = ["obesity", "smokes", "healthcare"];
let labelsTitle = { "poverty": "In Poverty (%)", 
                    "age": "Age (Median)", 
                    "income": "Household Income (Median)",
                    "obesity": "Obese (%)", 
                    "smokes": "Smokes (%)", 
                    "healthcare": "Lacks Healthcare (%)" };

// Set up x scale
function xScale(healthData,chosenXAxis){
  let xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d=>d[chosenXAxis])*0.9, d3.max(healthData,d=>d[chosenXAxis])*1.1])
      .range([0,width])
  return xLinearScale;
}

// Set up y scale
function yScale(healthData, chosenYAxis) {

// Create linear scale
  let yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenYAxis]) * .9,d3.max(healthData, d => d[chosenYAxis]) * 1.1 ])
      .range([height, 0]);
  return yLinearScale;
}

// Set up function to update xAxis 
// Transition by clicking on x axis label
function renderXAxes(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
  return xAxis;
}

// Set up function to update yAxis 
// Transition by clicking on y axis label
function renderYAxes(newYScale, yAxis) {
    let leftAxis = d3
        .axisLeft(newYScale);
        yAxis
        .transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

// Set up function to render circles 
function renderCircles(chosenCircles, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    chosenCircles
        .transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return chosenCircles;
}

// Set up function to update text in circles as they render
// Set up to transition to new text
function renderText(chosenCircleText, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    chosenCircleText
        .transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
    return chosenCircleText;
}

// Set up function to update chosen circles using tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
// Set up x axis
    if (chosenXAxis === "poverty") {
        let xlabel = "Poverty: ";
    }
    else if (chosenXAxis === "income") {
        let xlabel = "Median Income: "
    }
    else {
        let xlabel = "Age: "
    }
  
// Set up y axis
    if (chosenYAxis === "healthcare") {
        let ylabel = "Lacks Healthcare: ";
    }
    else if (chosenYAxis === "smokes") {
        let ylabel = "Smokers: "
    }
    else {
        let ylabel = "Obesity: "
    }
    let toolTip = d3
    .tip()
    .attr("class", "tooltip")
    .style("background", "black")
    .style("color", "white")
    .offset([120, -60])
    .html(function(d) {
        if (chosenXAxis === "age") {
// Format yAxis tooltip labels as percentages
// Display age as integer
return (`${d.state}<hr>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
} else if (chosenXAxis !== "poverty" && chosenXAxis !== "age") {
// Display income as dollars
  return (`${d.state}<hr>${xlabel}$${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
} else {
// Display poverty as percentage
  return (`${d.state}<hr>${xlabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`);
}      
});



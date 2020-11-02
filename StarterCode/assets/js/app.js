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
let svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append chart SVG group
// Shift by left and top margins
let allCharts = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Set up x and y Axis labels
let dataCharts = null;
let chosenXAxis = 'poverty'
let chosenYAxis = 'healthcare'
let xAxisLabels = ["poverty", "age", "income"]; 
let yAxisLabels = ["obesity", "smokes", "healthcare"];
let titleLabels = { "poverty": "In Poverty (%)", 
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
function yScale(healthcareData, chosenYAxis) {

// Create linear scale
  let yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthcareData, d => d[chosenYAxis]) * .9,d3.max(healthcareData, d => d[chosenYAxis]) * 1.1 ])
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
function renderText(chosencircleText, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    chosencircleText
        .transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
    return chosencircleText;
}

// Set up function to update chosen circles using tooltip
function updateToolTip(chosenXAxis, chosenYAxis, chosenCircles) {

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
        let ylabel = "Healthcare: ";
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
                return (`${d.state}<hr>${xlabel}$${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
                } else {
                return (`${d.state}<hr>${xlabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`);
                }      
        });

// Call on tooltip to perform follwing functions
        chosenCircles.call(toolTip);
// Mouseon event
        chosenCircles.on("mouseover", function(data) {
            toolTip.show(data, this);
        })

// Mouseout event
        .on("mouseout", function(data,index) {
        toolTip
        .hide(data)
        });
    return chosenCircles;
    }

// Import data from CSV
d3.csv("assets/data/data.csv")
    .then(function(healthData) {
// Parse data using chosen parameters
    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
    });
    
// Set up linear scale function
    let xLinearScale = xScale(healthData, chosenXAxis);
    let yLinearScale = yScale(healthData, chosenYAxis);
    
// Set up xy axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);
    
// Append x axis
    let xAxis = allCharts
        .append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

// Append y axis
    let yAxis = allCharts
        .append("g")
        .classed("y-axis", true)
        .call(leftAxis);

// Create circles
    let chosenCircles = allCharts
        .selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "15")
        .attr("fill", "green")
        .attr("opacity", ".5");
    
// Import abbreviated text to circles
    let chosencircleText = allCharts
        .selectAll()
        .data(healthData)
        .enter()
        .append("text")
        .text(d => (d.abbr))
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .style("font-size", "11px")
        .style("text-anchor", "middle")
        .style('fill', 'black');
// Append chart 
    let chartLabels = allCharts
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    let povertyLabel = chartLabels
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "poverty") 
        .classed("active", true)
        .text("In Poverty (%)");
    let healthcareLabel = chartLabels
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", (margin.left) * 2.8)
        .attr("y", 0 - (height+12))
        .attr("value", "healthcare") 
        .classed("active", true)
        .text("Lacks Healthcare (%)");
    let ageLabel = chartLabels
        .append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age") 
        .classed("inactive", true)
        .text("Age (Median)");
    let smokeLabel = chartLabels
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", (margin.left) * 2.8)
        .attr("y", 0 - (height +32))
        .attr("value", "smokes") 
        .classed("inactive", true)
        .text("Smokes (%)");
    let incomeLabel = chartLabels
        .append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income") 
        .classed("inactive", true)
        .text("Household Income (Median)");
    
    let obesityLabel = chartLabels
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", (margin.left) * 2.8)
        .attr("y", 0 - (height +52))
        .attr("value", "obesity") 
        .classed("inactive", true)
        .text("Obesity (%)");

// Use update tooltip function 
     chosenCircles = updateToolTip(chosenXAxis, chosenYAxis, chosenCircles);
    
// Click on x axis
     chartLabels
        .selectAll("text")
        .on("click", function() {
// Retrieve value
       let value = d3
        .select(this)
        .attr("value");
       console.log(value)
     
// Select x axes
       if (true) {
           if (value === "poverty" || value === "age" || value === "income") {
// Change chosenXAxis to value
            chosenXAxis = value;
// Update x scale for new data
            xLinearScale = xScale(healthData, chosenXAxis);
// Render new x axis
            xAxis = renderXAxes(xLinearScale, xAxis);
// Update circles with new x values
            chosenCircles = renderCircles(chosenCircles, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
// Update tool tip
            chosenCircles = updateToolTip(chosenXAxis, chosenYAxis, chosenCircles);
// Update circles text with new text
            chosencircleText = renderText(chosencircleText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
 // Change classes
            if (chosenXAxis === "poverty") {
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
    
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenXAxis === "age"){
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true)
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }}
            else {
                chosenYAxis = value;
// Update y scale 
            yLinearScale = yScale(healthData, chosenYAxis);
// Update y axis 
            yAxis = renderYAxes(yLinearScale, yAxis);
// Update circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
// Update tool tips with new data
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
// Update circles text 
            circletextGroup = renderText(circletextGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
// Update classes
            if (chosenYAxis === "healthcare") {
                healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
                smokeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
            else if (chosenYAxis === "smokes"){
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
            else {
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
                }
            } 
        }
    });
});




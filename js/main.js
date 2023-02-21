/*
D3 Code 
Joao & Pratheek 
Modified: 02/20/2023
*/

//###############################################################
// Reading data from a file 
// So far we've seen how to use hardcoded data. Now, we will 
// look at plotting data read in from a file. To read data from 
// another file, you will need to set up a python simple server
// in the same directory as your code and data. To do this:
//  (1) Open your terminal or command line 
//  (2) Navigate to the directory your code is in 
//  (3) Run the command (it will vary slightle depending on how 
//      python is set up for you): python3 -m http.server
//  (4) You will see: 
//        Serving HTTP on :: port 8000 (http://[::]:8000/) ...
//  (5) Naviage to localhost:8000 in the browser to see your
//      webpage
//###############################################################

// First, we need a frame  
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// Let's do another example, with a scale 
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

const FRAME1 = d3.select("#vis1")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

// builds scatter plot
function build_interative_scatter() {

// read data and create plot
d3.csv("data/scatter-data.csv").then((data) => {

  // find max X
  const MAX_X2 = d3.max(data, (d) => { return parseInt(d.x); });
          // Note: data read from csv is a string, so you need to
          // cast it to a number if needed 

  // find max Y
  const MAX_Y2 = d3.max(data, (d) => { return parseInt(d.y); });
  
  // Define scale functions that maps our data values 
  // (domain) to pixel values (range)
  const X_SCALE2 = d3.scaleLinear() 
                    .domain([0, 10]) // add some padding  
                    .range([0, VIS_WIDTH]); 

  const Y_SCALE2 = d3.scaleLinear() 
                    .domain([10, 0]) // add some padding  
                    .range([0, VIS_HEIGHT]); 

  // Use X_SCALE to plot our points
  FRAME1.selectAll("points")  
      .data(data) // passed from .then  
      .enter()       
      .append("circle")  
        .attr("cx", (d) => { return (X_SCALE2(d.x) + MARGINS.left); }) 
        .attr("cy", (d) => { return (Y_SCALE2(d.y) + MARGINS.top); })  
        .attr("r", 10)
        .attr("class", "point");

  // Tooltip
  const TOOLTIP = d3.select("#vis1")
                      .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);

  function handleMouseover(event, d) {
    d3.select(this)
      .attr("fill", "blueviolet")
    TOOLTIP.style("opacity", 1);
  }

  function handleMouseleave(event, d) {
    d3.select(this)
      .attr("fill", "black")
    TOOLTIP.style("opacity", 1);
  }

  function handleClick(event, d) {
    const circle = d3.select(this);
    const border = circle.attr("stroke-width") == "5";
    circle.attr("stroke-width", border ? "0" : "5")
          .attr("stroke", border ? "none" : "red");
  }

  // Add event listeners
  FRAME1.selectAll(".point")
          .on("mouseover", handleMouseover) //add event listeners
          .on("mouseleave", handleMouseleave)
          .on("click", handleClick);

  // Add an X-axis to the vis  
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE2).ticks(8)) 
          .attr("font-size", '20px');

  // Add Y-axis to the vis  
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + MARGINS.top + ")") 
        .call(d3.axisLeft(Y_SCALE2).ticks(8)) 
          .attr("font-size", '20px'); 

  });

}

// Call function 
build_interative_scatter();


const rightColumn = d3.select(".right-column");

rightColumn.append("p")
  .attr("id", "previous-click")
  .text("Last Point Clicked: ")
  .style("margin-bottom", "20px");

const form = rightColumn.append("form")
  .attr("id", "coordinates");

const xLabel = form.append("label")
  .attr("for", "x-coordinate")
  .text("Select the x-coordinate for the point you want to add:");

const xSelect = form.append("select")
  .attr("id", "x-value")
  .text("name", "x-coordinate");

xSelect.selectAll("option")
  .data([1, 2, 3, 4, 5, 6, 7, 8, 9])
  .enter()
  .append("option")
    .attr("value", (d) => d)
    .text((d, i) => i+1);

form.append("p")
  .style("margin-bottom", "20px");

const yLabel = form.append("label")
  .attr("for", "y-coordinate")
  .text("Select the y-coordinate for the point you want to add:");

const ySelect = form.append("select")
  .attr("id", "y-value")
  .text("name", "y-coordinate")
  .style("margin-bottom", "20px");

ySelect.selectAll("option")
  .data([1, 2, 3, 4, 5, 6, 7, 8, 9])
  .enter()
  .append("option")
    .attr("value", (d) => d)
    .text((d, i) => i+1);

rightColumn.append("button")
  .attr("type", "button")
  .attr("id", "subButton")
  .text("Add Point")
  .on("click", addPoint);

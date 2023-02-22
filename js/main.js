/*
D3 Code 
Joao & Pratheek 
Modified: 02/21/2023
*/

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
  const MAX_X = d3.max(data, (d) => { return parseInt(d.x); });
          // Note: data read from csv is a string, so you need to
          // cast it to a number if needed 

  // find max Y
  const MAX_Y = d3.max(data, (d) => { return parseInt(d.y); });
  
  // Define scale functions that maps our data values 
  // (domain) to pixel values (range)
  const X_SCALE = d3.scaleLinear() 
                    .domain([0, 10])
                    .range([0, VIS_WIDTH]); 

  const Y_SCALE = d3.scaleLinear() 
                    .domain([10, 0]) 
                    .range([0, VIS_HEIGHT]); 

  // Use X_SCALE to plot our points
  FRAME1.selectAll("circle")  
      .data(data)
      .enter()       
      .append("circle")  
        .attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left); }) 
        .attr("cy", (d) => { return (Y_SCALE(d.y) + MARGINS.top); })  
        .attr("r", 10)
        .attr("class", "point");

  // Add event listeners
  FRAME1.selectAll("circle")
          .on("mouseover", handleMouseover)
          .on("mouseleave", handleMouseleave)
          .on("click", handleClick);

  // Add an X-axis to the vis  
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE).ticks(8)) 
          .attr("font-size", '20px');

  // Add Y-axis to the vis  
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + MARGINS.top + ")") 
        .call(d3.axisLeft(Y_SCALE).ticks(8)) 
          .attr("font-size", '20px'); 

  });
}

// Call function 
build_interative_scatter();

function handleMouseover(event, d) {
  d3.select(this)
    .attr("fill", "blueviolet");
}

function handleMouseleave(event, d) {
  d3.select(this)
    .attr("fill", "black");
}

function handleClick(event, d) {
  const circle = d3.select(this);
  const border = circle.attr("stroke-width") == "5";
  circle.attr("stroke-width", border ? "0" : "5")
        .attr("stroke", border ? "none" : "red");

  d3.select("#previous-click").text("Last Point Clicked: (" + d.x + "," + d.y + ")");
}

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

function handleAddPoint() {

  const X_SCALE = d3.scaleLinear() 
                    .domain([0, 10])
                    .range([0, VIS_WIDTH]); 

  const Y_SCALE = d3.scaleLinear() 
                    .domain([10, 0]) 
                    .range([0, VIS_HEIGHT]);

  const xValue = d3.select("#x-value").node().value;
  const yValue = d3.select("#y-value").node().value;

  const newData = { x: xValue, y: yValue };

  FRAME1.append("circle")
        .attr("cx", X_SCALE(newData.x) + MARGINS.left) 
        .attr("cy", Y_SCALE(newData.y) + MARGINS.top)  
        .attr("r", 10)
        .attr("class", "point")
          .on("mouseover", handleMouseover)
          .on("mouseleave", handleMouseleave)
          .on("click", function(event, d) {
            
            const circle = d3.select(this);
            const border = circle.attr("stroke-width") == "5";
            
            circle.attr("stroke-width", border ? "0" : "5")
                  .attr("stroke", border ? "none" : "red");

            d3.select("#previous-click").text("Last Point Clicked: (" + newData.x + "," + newData.y + ")");
          });
}

const addButton = rightColumn.append("button")
  .attr("id", "button")
  .text("Add Point");

addButton.on("click", handleAddPoint);
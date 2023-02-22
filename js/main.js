/*
D3 Code 
Joao & Pratheek 
Modified: 02/21/2023
*/

// First, we need a frame  
const FRAME_HEIGHT = 600;
const FRAME_WIDTH = 600; 
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

// new FRAME
const FRAME2 = d3.select("#vis2")
                  .append("svg")
                  .attr("height", FRAME_HEIGHT)
                  .attr("width", FRAME_WIDTH)
                  .attr("class", "frame"); 
                
// builds bar graph
function build_interative_bar_graph() {

// read data and create plot
d3.csv("data/bar-data.csv").then((data2) => {

  // find max X
  const MAX_X2 = d3.max(data2, (d) => d.category);
          // Note: data read from csv is a string, so you need to
          // cast it to a number if needed 

  // find max Y
  const MAX_Y2 = d3.max(data2, (d) => { return parseInt(d.amount); });
  
  // Define scale functions that maps our data values 
  // (domain) to pixel values (range)
  const X_SCALE2 = d3.scaleBand() 
                    .domain(["A", "B", "C", "D", "E", "F", "G"])
                    .range([0, VIS_WIDTH])
                    .padding(0.2);

  const Y_SCALE2 = d3.scaleLinear() 
                    .domain([MAX_Y2, 0]) 
                    .range([0, VIS_HEIGHT]); 

  // Use X_SCALE to plot our points
  FRAME2.selectAll("rect")  
      .data(data2)
      .enter()       
      .append("rect")  
        .attr("x", (d) => { return (X_SCALE2(d.category) + MARGINS.left); }) 
        .attr("y", (d) => { return (Y_SCALE2(d.amount) + MARGINS.top); }) 
        .attr("width", X_SCALE2.bandwidth())
        .attr("height", (d) => VIS_HEIGHT - Y_SCALE2(parseInt(d.amount)))
        .attr("fill", "dodgerblue");

  // Tooltip

    // To add a tooltip, we will need a blank div that we 
    // fill in with the appropriate text. Be use to note the
    // styling we set here and in the .css
    const TOOLTIP = d3.select("#vis2")
                        .append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0); 

    // Define event handler functions for tooltips
    function handleMouseover(event, d) {
      d3.select(this)
        .attr("fill", "orange");
    }

    function handleMousemove(event, d) {
      // position the tooltip and fill in information 
      TOOLTIP.html("Category: " + d.category + "<br>Amonut: " + d.amount)
              .style("left", page.X + "px")
              .style("top", page.Y + "px"); 
    }

    function handleMouseleave(event, d) {
      d3.select(this)
        .attr("fill", "dodgerblue");
    } 

  // Add event listeners
  FRAME2.selectAll("rect")
        .on("mouseover", handleMouseover) //add event listeners
        .on("mousemove", handleMousemove)
        .on("mouseleave", handleMouseleave);    

  // Add an X-axis to the vis  
  FRAME2.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE2)) 
          .attr("font-size", '20px');

  // Add Y-axis to the vis  
  FRAME2.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + MARGINS.top + ")") 
        .call(d3.axisLeft(Y_SCALE2)) 
          .attr("font-size", '20px'); 
  });
}

// Call function 
build_interative_bar_graph();
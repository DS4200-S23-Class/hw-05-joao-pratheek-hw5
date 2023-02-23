/*
D3 Code 
Joao & Pratheek 
Modified: 02/21/2023
*/

// dimensions of the frame  
const FRAME_HEIGHT = 600;
const FRAME_WIDTH = 600;

// margins of the Frame 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// sets dimensions of visualizations within the frame
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

// selects the vis1 element, appends an svg element
// and gives it attributes
const FRAME1 = d3.select("#vis1")
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

// builds scatter plot
function build_interative_scatter() {

// reads data from the csv file
d3.csv("data/scatter-data.csv").then((data) => {

  // finds max X value in the csv data
  // cast to int type because it's a string in the csv
  const MAX_X = d3.max(data, (d) => { return parseInt(d.x); });

  // finds max Y value in the csv data
  // cast to int type because it's a string in the csv
  const MAX_Y = d3.max(data, (d) => { return parseInt(d.y); });
  
  // defines scale function that maps X data values 
  // (domain) to pixel values (range)
  const X_SCALE = d3.scaleLinear() 
                    .domain([0, 10])
                    .range([0, VIS_WIDTH]); 

  // defines scale function that maps Y data values 
  // (domain) to pixel values (range)
  const Y_SCALE = d3.scaleLinear() 
                    .domain([10, 0]) 
                    .range([0, VIS_HEIGHT]); 

  // uses X and Y scales to plot the points
  FRAME1.selectAll("circle")  
      .data(data)
      .enter()       
      .append("circle")  
        .attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left); }) 
        .attr("cy", (d) => { return (Y_SCALE(d.y) + MARGINS.top); })  
        .attr("r", 10)
        .attr("class", "point");

  // adds event listeners
  FRAME1.selectAll("circle")
          .on("mouseover", handleMouseover)
          .on("mouseleave", handleMouseleave)
          .on("click", handleClick);

  // adds an X-axis to the vis  
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE)) 
          .attr("font-size", '20px');

  // adds a Y-axis to the vis  
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + MARGINS.top + ")") 
        .call(d3.axisLeft(Y_SCALE)) 
          .attr("font-size", '20px'); 
  });
}

// calls function 
build_interative_scatter();

// defines event handler function for a mouse hover
function handleMouseover(event, d) {
  d3.select(this)
    .attr("fill", "blueviolet");
}

// defines event handler function for a mouse removal
function handleMouseleave(event, d) {
  d3.select(this)
    .attr("fill", "black");
}

// defines event handler function for a mouse click
function handleClick(event, d) {
  const circle = d3.select(this);
  const border = circle.attr("stroke-width") == "5";
  circle.attr("stroke-width", border ? "0" : "5")
        .attr("stroke", border ? "none" : "red");

  // updates text with coordinates of circle that was last clicked
  d3.select("#previous-click").text("Last Point Clicked: (" + d.x + "," + d.y + ")");
}

// selects the right-column element and stores it as a constant 
const rightColumn = d3.select(".right-column");

// appends the paragraph element to the right-column element
// gives it an id, text, and a 20px margin from the bottom
rightColumn.append("p")
  .attr("id", "previous-click")
  .text("Last Point Clicked: ")
  .style("margin-bottom", "20px");

// appends the form element to the right-column element and stores it as a constant
// gives it an id
const form = rightColumn.append("form")
  .attr("id", "coordinates");

// appends the label element to the form element and stores it as a constant
// and gives it an attribute value to match the select tag name and a text
const xLabel = form.append("label")
  .attr("for", "x-coordinate")
  .text("Select the x-coordinate for the point you want to add:");

// appends the select element to the form element and stores it as a constant
// gives it an id and name
const xSelect = form.append("select")
  .attr("id", "x-value")
  .text("name", "x-coordinate");

// appends each X-coordinate 1-9 to one option element
// and updates the text values to reflect this
xSelect.selectAll("option")
  .data([1, 2, 3, 4, 5, 6, 7, 8, 9])
  .enter()
  .append("option")
    .attr("value", (d) => d)
    .text((d, i) => i+1);

// appends the paragraph element to the form element
// and gives it a 20px margin from the bottom
form.append("p")
  .style("margin-bottom", "20px");

// appends the label element to the form element and stores it as a constant
// and gives it an attribute value to match the select tag name and a text
const yLabel = form.append("label")
  .attr("for", "y-coordinate")
  .text("Select the y-coordinate for the point you want to add:");

// appends the select element to the form element and stores it as a constant
// gives it an id, name, and a 20px margin from the bottom
const ySelect = form.append("select")
  .attr("id", "y-value")
  .text("name", "y-coordinate")
  .style("margin-bottom", "20px");

// appends each Y-coordinate 1-9 to one option element
// and updates the text values to reflect this
ySelect.selectAll("option")
  .data([1, 2, 3, 4, 5, 6, 7, 8, 9])
  .enter()
  .append("option")
    .attr("value", (d) => d)
    .text((d, i) => i+1);

// defines event handler for adding a new point to the scatter
function handleAddPoint() {

  const X_SCALE = d3.scaleLinear() 
                    .domain([0, 10])
                    .range([0, VIS_WIDTH]); 

  const Y_SCALE = d3.scaleLinear() 
                    .domain([10, 0]) 
                    .range([0, VIS_HEIGHT]);

  // stores the X and Y coordinates that were selected by the user as a constant
  const xCoord = d3.select("#x-value").node().value;
  const yCoord = d3.select("#y-value").node().value;

  // creates a constant that has properties of X and Y coordinates
  const newData = { x: xCoord, y: yCoord };

  // appends a new circle to FRAME1
  // and passes
  FRAME1.append("circle")
        .attr("cx", X_SCALE(newData.x) + MARGINS.left) 
        .attr("cy", Y_SCALE(newData.y) + MARGINS.top)  
        .attr("r", 10)
        .attr("class", "point")
          .on("mouseover", handleMouseover)
          .on("mouseleave", handleMouseleave)
          .on("click", function(event, d) { // rewriting the handleClick function
                                            // to redefine constants
            
            const circle = d3.select(this);
            const border = circle.attr("stroke-width") == "5";
            
            circle.attr("stroke-width", border ? "0" : "5")
                  .attr("stroke", border ? "none" : "red");

            // updates text with coordinates of new circle that was last clicked
            d3.select("#previous-click").text("Last Point Clicked: (" + newData.x + "," + newData.y + ")");
          });
}

// appends button element to the right-column element and stores it as a constant
// gives it an id and text
const button = rightColumn.append("button")
  .attr("id", "button")
  .text("Add Point");

// adds event listener for a mouse click on the button
button.on("click", handleAddPoint);

// selects the vis1 element, appends an svg element
// and gives it attributes
const FRAME2 = d3.select("#vis2")
                  .append("svg")
                  .attr("height", FRAME_HEIGHT)
                  .attr("width", FRAME_WIDTH)
                  .attr("class", "frame"); 
                
// builds bar graph
function build_interative_bar_graph() {

// reads data from the csv file
d3.csv("data/bar-data.csv").then((data2) => {

  // finds max Y value in the csv data
  // cast to int type because it's a string in the csv
  const MAX_Y2 = d3.max(data2, (d) => { return parseInt(d.amount); });
  
  // defines scale function that maps X data values 
  // (domain) to pixel values (range)
  const X_SCALE2 = d3.scaleBand() 
                    .domain(["A", "B", "C", "D", "E", "F", "G"])
                    .range([0, VIS_WIDTH])
                    .padding(0.2);

  // defines scale function that maps Y data values 
  // (domain) to pixel values (range)
  const Y_SCALE2 = d3.scaleLinear() 
                    .domain([100, 0]) 
                    .range([0, VIS_HEIGHT]); 

  // uses X and Y scales to plot the rectangles
  FRAME2.selectAll("rect")  
      .data(data2)
      .enter()       
      .append("rect")  
        .attr("x", (d) => { return (X_SCALE2(d.category) + MARGINS.left); }) 
        .attr("y", (d) => { return (Y_SCALE2(d.amount) + MARGINS.top); }) 
        .attr("width", X_SCALE2.bandwidth())
        .attr("height", (d) => VIS_HEIGHT - Y_SCALE2(parseInt(d.amount)))
        .attr("fill", "dodgerblue");

    // creates a new constant, selects the vis2 element, appends a div, 
    // and adds a class tooltip
    const TOOLTIP = d3.select("#vis2")
                        .append("div")
                          .attr("class", "tooltip"); 

    // defines event handler function for a mouse hover
    function handleMouseover(event, d) {
      d3.select(this)
        .attr("fill", "orange");
    }

    // defines event handler function for a mouse moving
    function handleMousemove(event, d) {
      TOOLTIP.html("Category: " + d.category + "<br>Amount: " + d.amount)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px")
          .style("opacity", 1); 
    }

    // defines event handler function for a mouse removal
    function handleMouseleave(event, d) {
      d3.select(this)
        .attr("fill", "dodgerblue")
        TOOLTIP.style("opacity", 0);
    } 

  // adds event listeners
  FRAME2.selectAll("rect")
        .on("mouseover", handleMouseover)
        .on("mousemove", handleMousemove)
        .on("mouseleave", handleMouseleave);    

  // adds an X-axis to the vis  
  FRAME2.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE2)) 
          .attr("font-size", '20px');

  // adds a Y-axis to the vis  
  FRAME2.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + MARGINS.top + ")") 
        .call(d3.axisLeft(Y_SCALE2)) 
          .attr("font-size", '20px'); 
  });
}

// calls function 
build_interative_bar_graph();
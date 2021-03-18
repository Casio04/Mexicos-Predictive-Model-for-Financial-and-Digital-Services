

// A function that create the plot for a given variable:
function init(selectedVar) {
    d3.select("svg").remove();
    d3.selectAll("#Commercial-Branches").style("background-color","black");
    d3.selectAll("#Commercial-Branches").style("color","white");
    d3.select("#Bar-Title").text(selectedVar)
    
    var widthdiv = document.getElementById('my_dataviz').clientWidth;
    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 30, bottom: 70, left: 60 },
        width = (widthdiv) - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    


    // Initialize the X axis
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.2);
    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
    
       
    // Initialize the Y axis
    var y = d3.scaleLinear()
        .range([height, 0]);
    var yAxis = svg.append("g")
        .attr("class", "myYaxis")
    // Reading data from API
    d3.json("../api_h").then(function (data) {
       
        // X axis
        x.domain(data.map(function (d) { return d.Year; }))
        xAxis.transition().duration(1000).call(d3.axisBottom(x))

        // Add Y axis
        y.domain([0, d3.max(data, function (d) { return +d[selectedVar] })]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y));

        // Define the div for the tooltip
var div = d3.select("body").append("div")	
.attr("class", "tooltip")				
.style("opacity", 0);

        var bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .on('mouseover', function (event, d) {
                const[x, y] = d3.pointer(event);
                tooltip
                  .html(
                    `<div>Country: ${d.Year}</div><div>Value: ${d.Com}</div>`
                  )
                  .style('visibility', 'visible')
                  .style("left", (x) + "px")
                  .style("top", (y) + "px");
                  console.log(x+" "+ y)

                d3.select(this).transition().attr('fill', "blue");

            })
            .on('mouseout', function () {
                tooltip.html(``).style('visibility', 'hidden');
                d3.select(this).transition().attr('fill', "#69b3a2");
            });

        // update bars
        bars
            .transition()
            .duration(1000)
            .attr("x", function (d) { return x(d.Year); })
            .attr("y", function (d) { return y(d[selectedVar]); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d[selectedVar]); })
            .attr("fill", "#69b3a2")
            .text(function(d) { 
            return d.Year;
            })
        
            tooltip = d3
            .select('body')
            .append('div')
            .attr('class', 'd3-tooltip')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('visibility', 'hidden')
            .style('padding', '10px')
            .style('background', 'rgba(0,0,0,0.6)')
            .style('border-radius', '4px')
            .style('color', '#fff')
            .text('a simple tooltip');
            
    })
    
};


init('Commercial-Branches');

function redraw() {
    selectedVar = 'Commercial-Branches'
    d3.select("svg").remove();

    var widthdiv = document.getElementById('my_dataviz').clientWidth;
    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 30, bottom: 70, left: 60 },
        width = (widthdiv) - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    


    // Initialize the X axis
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.2);
    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
    
       
    // Initialize the Y axis
    var y = d3.scaleLinear()
        .range([height, 0]);
    var yAxis = svg.append("g")
        .attr("class", "myYaxis")
    // Reading data from API
    d3.json("../api_h").then(function (data) {
       
        // X axis
        x.domain(data.map(function (d) { return d.Year; }))
        xAxis.transition().duration(1000).call(d3.axisBottom(x))

        // Add Y axis
        y.domain([0, d3.max(data, function (d) { return +d[selectedVar] })]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y));

        // Define the div for the tooltip
var div = d3.select("body").append("div")	
.attr("class", "tooltip")				
.style("opacity", 0);

        var bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .on('mouseover', function (event, d) {
                const[x, y] = d3.pointer(event);
                tooltip
                  .html(
                    `<div>Country: ${d.Year}</div><div>Value: ${d.Com}</div>`
                  )
                  .style('visibility', 'visible')
                  .style("left", (x) + "px")
                  .style("top", (y) + "px");
                  console.log(x+" "+ y)

                d3.select(this).transition().attr('fill', "blue");

            })
            .on('mouseout', function () {
                tooltip.html(``).style('visibility', 'hidden');
                d3.select(this).transition().attr('fill', "#69b3a2");
            });

        // update bars
        bars
            .transition()
            .duration(1000)
            .attr("x", function (d) { return x(d.Year); })
            .attr("y", function (d) { return y(d[selectedVar]); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d[selectedVar]); })
            .attr("fill", "#69b3a2")
            .text(function(d) { 
            return d.Year;
            })
        
            tooltip = d3
            .select('body')
            .append('div')
            .attr('class', 'd3-tooltip')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('visibility', 'hidden')
            .style('padding', '10px')
            .style('background', 'rgba(0,0,0,0.6)')
            .style('border-radius', '4px')
            .style('color', '#fff')
            .text('a simple tooltip');
            
    })
}

// A function that update the plot for a given variable:
function update(selectedVar) {
    d3.select("svg").remove();
    d3.selectAll(".variables").style("background-color","white");
    d3.selectAll(".variables").style("color","black");
    d3.selectAll(".variables").style("border-color","black");
    d3.select("#Bar-Title").text(selectedVar);
    let thisone = "#" + selectedVar
    console.log(thisone)
    d3.select(thisone).style("background-color","black")
    d3.select(thisone).style("border-color","white");
    d3.select(thisone).style("color","white");
    var widthdiv = document.getElementById('my_dataviz').clientWidth;
    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 30, bottom: 70, left: 60 },
        width = (widthdiv) - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    


    // Initialize the X axis
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.2);
    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
    
       
    // Initialize the Y axis
    var y = d3.scaleLinear()
        .range([height, 0]);
    var yAxis = svg.append("g")
        .attr("class", "myYaxis")
    // Reading data from API
    d3.json("../api_h").then(function (data) {
       
        // X axis
        x.domain(data.map(function (d) { return d.Year; }))
        xAxis.transition().duration(1000).call(d3.axisBottom(x))

        // Add Y axis
        y.domain([0, d3.max(data, function (d) { return +d[selectedVar] })]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y));

        // Define the div for the tooltip
var div = d3.select("body").append("div")	
.attr("class", "tooltip")				
.style("opacity", 0);

        var bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .on('mouseover', function (event, d) {
                const[x, y] = d3.pointer(event);
                tooltip
                  .html(
                    `<div>Country: ${d.Year}</div><div>Value: ${d.Com}</div>`
                  )
                  .style('visibility', 'visible')
                  .style("left", (x) + "px")
                  .style("top", (y) + "px");
                  console.log(x+" "+ y)

                d3.select(this).transition().attr('fill', "blue");

            })
            .on('mouseout', function () {
                tooltip.html(``).style('visibility', 'hidden');
                d3.select(this).transition().attr('fill', "#69b3a2");
            });

        // update bars
        bars
            .transition()
            .duration(1000)
            .attr("x", function (d) { return x(d.Year); })
            .attr("y", function (d) { return y(d[selectedVar]); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d[selectedVar]); })
            .attr("fill", "#69b3a2")
            .text(function(d) { 
            return d.Year;
            })
        
            tooltip = d3
            .select('body')
            .append('div')
            .attr('class', 'd3-tooltip')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('visibility', 'hidden')
            .style('padding', '10px')
            .style('background', 'rgba(0,0,0,0.6)')
            .style('border-radius', '4px')
            .style('color', '#fff')
            .text('a simple tooltip');
            
    })
};

window.onresize = redraw;
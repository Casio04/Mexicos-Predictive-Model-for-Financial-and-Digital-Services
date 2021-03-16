

// A function that create / update the plot for a given variable:
function init(selectedVar) {
    d3.select("svg").remove();
    d3.selectAll("#Cajeros").style("background-color","#69b3a2");
    
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
        x.domain(data.map(function (d) { return d.Anio; }))
        xAxis.transition().duration(1000).call(d3.axisBottom(x))

        // Add Y axis
        y.domain([0, d3.max(data, function (d) { return +d[selectedVar] })]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y));

        // variable u: map data to existing bars
        var u = svg.selectAll("rect")
            .data(data)

        // update bars
        u
            .enter()
            .append("rect")
            .merge(u)
            .transition()
            .duration(1000)
            .attr("x", function (d) { return x(d.Anio); })
            .attr("y", function (d) { return y(d[selectedVar]); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d[selectedVar]); })
            .attr("fill", "#69b3a2")
    })

};

init('Cajeros');

function redraw() {
    selectedVar = 'Cajeros'
    d3.select("svg").remove();

    var widthdiv = document.getElementById('my_dataviz').clientWidth;
    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 30, bottom: 70, left: 60 },
        width = (widthdiv) - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    // console.log(widthdiv)
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
    d3.json("../api_h").then(function (data) {
        // let states_list =  [...new Set(data.map(d => d.Anio))]

        // X axis
        x.domain(data.map(function (d) { return d.Anio; }))
        xAxis.transition().duration(1000).call(d3.axisBottom(x))

        // Add Y axis
        y.domain([0, d3.max(data, function (d) { return +d[selectedVar] })]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y));

        // variable u: map data to existing bars
        var u = svg.selectAll("rect")
            .data(data)

        // update bars
        u
            .enter()
            .append("rect")
            .merge(u)
            // .transition()
            // .duration(1000)
            .attr("x", function (d) { return x(d.Anio); })
            .attr("y", function (d) { return y(d[selectedVar]); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d[selectedVar]); })
            .attr("fill", "#69b3a2")
        console.log(data)
    })
}


// A function that create / update the plot for a given variable:
function update(selectedVar) {
    d3.select("svg").remove();
    d3.selectAll(".variables").style("background-color","white");
    let thisone = "#" + selectedVar
    console.log(thisone)
    d3.select(thisone).style("background-color","#69b3a2");
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
        x.domain(data.map(function (d) { return d.Anio; }))
        xAxis.transition().duration(1000).call(d3.axisBottom(x))

        // Add Y axis
        y.domain([0, d3.max(data, function (d) { return +d[selectedVar] })]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y));

        // variable u: map data to existing bars
        var u = svg.selectAll("rect")
            .data(data)

        // update bars
        u
            .enter()
            .append("rect")
            .merge(u)
            .transition()
            .duration(1000)
            .attr("x", function (d) { return x(d.Anio); })
            .attr("y", function (d) { return y(d[selectedVar]); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d[selectedVar]); })
            .attr("fill", "#69b3a2")
    })

};

window.onresize = redraw;
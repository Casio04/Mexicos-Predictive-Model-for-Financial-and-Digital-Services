var config = {responsive: true}
let data = [
    {"Variable tested": "Credit Card", "Predicted":0.3396, "Actual":0.3741, "% Variation": -0.09, "MSE*": 0.01},
    {"Variable tested": "Debit Card", "Predicted":1.7463, "Actual":1.7192, "% Variation": 0.015, "MSE*": 0.24},
    {"Variable tested": "Mobile Banking", "Predicted":0.6982, "Actual":0.54, "% Variation": 0.29, "MSE*": 0.01},
    {"Variable tested": "PC", "Predicted":0.5504, "Actual":0.5136, "% Variation": 0.07, "MSE*":0.001},
    {"Variable tested": "Streaming", "Predicted":0.2392, "Actual":0.3037, "% Variation": -0.21, "MSE*":0.001}
]
var values = [
    ['Credit Card', 'Debit Card', 'Mobile Banking', 'PC', 'Streaming'],
    [0.3396,1.7463,0.6982,0.5504,0.2392],
    [0.3741,1.7192,0.54,0.5136,0.3037],
    [-0.09,0.015,0.29,0.07,-0.21]]


    function tabulate(data, columns) {
		var table = d3.select("#table")
		var thead = table.append('thead')
		var	tbody = table.append('tbody');

		// append the header row
		thead.append('tr')
		  .selectAll('th')
		  .data(columns).enter()
		  .append('th')
          .attr("class","table-active")
		    .text(function (column) { return column; });

		// create a row for each object in the data
		var rows = tbody.selectAll('tr')
		  .data(data)
		  .enter()
		  .append('tr')
          ;

		// create a cell in each row for each column
		var cells = rows.selectAll('td')
		  .data(function (row) {
		    return columns.map(function (column) {
		      return {column: column, value: row[column]};
		    });
		  })
		  .enter()
		  .append('td')
		    .text(function (d) { return d.value; });

	  return table;
	}

	// render the table(s)
	tabulate(data, ['Variable tested', 'Predicted','Actual','% Variation', 'MSE*']); // 2 column table



// var data = [{
//     type: 'table',
//     columnorder: [1,2,3,4],
//     columnwidth: [1500,1000,1000,1000],
//     header: {
//         values: [["<b>Variable tested</b>"], ["<b>Predicted</b>"],
//                     ["<b>Actual</b>"], ["<b>% Variation</b>"]],
//         align: "center",
//         line: {width: 1, color: 'black'},
//         fill: {color: "grey"},
//         font: {family: "Helvetica", size: 16, color: "white"}
//     },
//     cells: {
//         values: values,
//         align: "center",
//         height: 30,
//         line: {color: "black", width: 1},
//         font: {family: "Helvetica", size: 16, color: ["black"]}
//     }
//     }]

// Plotly.newPlot('table', data, config);
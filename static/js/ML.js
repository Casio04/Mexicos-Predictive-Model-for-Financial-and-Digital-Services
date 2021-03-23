// Variable for responsive plotly charts
var config = {responsive: true,
	displayModeBar: false}

function init(){
    // Reading data from API
    d3.json("../api_mun").then(function(data){
        let states_list =  [...new Set(data.map(d => d.NOMBRE_ENTIDAD))]
        // Create empty array
        let states =[]
        
        // Push every state from the data
        data.forEach(function(d){
            states.push(d.NOMBRE_ENTIDAD)
        })
        // Insert states into dropdown
        
        let state_selection = d3.select("#stateSelector")
        .selectAll("option")
        state_selection.data(states_list)
        .enter()
        .append("option")
        .merge(state_selection)
        .attr("value", d =>d)
        .text(d=>d)
        state_selection.exit().remove()

		let selection = d3.select("#modelSelector")
		.selectAll("option")
		selection.data(models)
		.enter()
		.append("option")
		.merge(selection)
		.attr("value", d =>d)
		.text(d=>d)
		selection.exit().remove()

		let value = document.getElementById("modelSelector").value
		let state = document.getElementById("stateSelector").value
		selector(value)
		munUpdate(state)

    })
}


// Creating arrays with the data needed for the machine learning demonstration
let data = [
    {"Variable tested": "Credit Card", "Predicted":0.3396, "Actual":0.3741, "% Variation": -0.09, "MSE*": 0.01, "R<sup>2</sup>**":0.80},
    {"Variable tested": "Debit Card", "Predicted":1.7463, "Actual":1.7192, "% Variation": 0.015, "MSE*": 0.24,"R<sup>2</sup>**":0.70},
    {"Variable tested": "Mobile Banking", "Predicted":0.6982, "Actual":0.54, "% Variation": 0.29, "MSE*": 0.01,"R<sup>2</sup>**":0.61},
    {"Variable tested": "PC", "Predicted":0.5504, "Actual":0.5136, "% Variation": 0.07, "MSE*":0.001,"R<sup>2</sup>**":0.90},
    {"Variable tested": "Streaming", "Predicted":0.2392, "Actual":0.3037, "% Variation": -0.21, "MSE*":0.001,"R<sup>2</sup>**":0.87}
]
var values = [
    ['Credit Card', 'Debit Card', 'Mobile Banking', 'PC', 'Streaming'],
    [0.3396,1.7463,0.6982,0.5504,0.2392],
    [0.3741,1.7192,0.54,0.5136,0.3037],
    [-0.09,0.015,0.29,0.07,-0.21]]

// creating function to populate table with results
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
		    .html(function (column) { return column; });

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
	tabulate(data, ['Variable tested', 'Predicted','Actual','% Variation', 'MSE*',"R<sup>2</sup>**"]); // 2 column table


// Modify the variables used for each model
function selector(model){
	
	let variable_list = []
	let value_list = []
	let sum = 0
	for (const [key, value] of Object.entries(eval(pair_models[model]))) {
		d3.select("#" + key).text(value)
		sum += 1
		variable_list.push(key)
		value_list.push(value)
	  }
	if(sum === 5){
		d3.select("#v6").attr("class", "labelhidden")
		d3.select("#var6").attr("class", "myInput inputhidden")
		d3.select("#v7").attr("class", "labelhidden")
		d3.select("#var7").attr("class", "myInput inputhidden")
	}else if(sum === 6){
		d3.select("#v6").attr("class", "")
		d3.select("#var6").attr("class", "myInput")
		d3.select("#v7").attr("class", "labelhidden")
		d3.select("#var7").attr("class", "myInput inputhidden")
	}else{
		d3.select("#v6").attr("class", "")
		d3.select("#var6").attr("class", "myInput")
		d3.select("#v7").attr("class", "")
		d3.select("#var7").attr("class", "myInput")
	}
	erasedata()
	cleanmodel()
	model_values()
}

// limiting input to a range of 0 to 10 
function handleChange(input) {
	let initial = document.getElementById(input.id).defaultValue
	if(parseFloat(input.value) > (parseFloat(initial) + 1)){input.value = parseFloat(initial) + 1}
    if (input.value < 0){input.value = 0};
  }

// running function to calculate prediction from model


function munUpdate(state){
	cleanmodel()
	d3.select("#testing").html('')
	d3.json("/api_ML_" +state).then(function(data){
		let mun = data[0].NOMBRE_MUNICIPIO
		let selection = d3.select("#testing")
		.selectAll("option")
		selection.data(data)
		.enter()
		.append("option")
		.merge(selection)
		.attr("value", d=>d.NOMBRE_MUNICIPIO)
		.text(d=>d.NOMBRE_MUNICIPIO)
		selection.exit().remove()
		model_values()
	})	
	
	
}

function runModel(){
	
	let state = document.getElementById("stateSelector").value
	let mun = document.getElementById("testing").value
	
	let original_list = []
	let input_list = []
	d3.json("/api_ML_" + state).then(function(data){
		
		let mun_data = data.filter(d=>d.NOMBRE_MUNICIPIO === mun)[0]
		
		
		
		for(i = 1; i<8; i++){
			let classvalue = document.getElementById("var"+i)
			let test = classvalue.classList.contains("inputhidden")
			if (test === false){
				
				let var_name = document.getElementById("v"+i).innerHTML
				let var_db = ML_list[var_name]
				if(mun_data[var_db] === ""){
					console.log("empty")
				}
				input_list.push(document.getElementById("var"+i).value)
				original_list.push(mun_data[var_db])
				
			}
		}
	})

	let model = document.getElementById("modelSelector").value
	let result
	let sum = 0

	// get the sum of elements in a model to know how many variables I need for each API
	for (const [key, value] of Object.entries(eval(pair_models[model]))) {
		sum += 1
	  }
	
	// On each if, the sum gives us the number of variables to be considered. The variables need a number value, so they are filled with
	// 0 if left blank, and then the variables are passed on the string for the api call
	if(sum === 5){

		let v1 = document.getElementById("var1").value
		let v2 = document.getElementById("var2").value
		let v3 = document.getElementById("var3").value
		let v4 = document.getElementById("var4").value
		let v5 = document.getElementById("var5").value
		if(v1.length === 0){v1 = 0}
		if(v2.length === 0){v2 = 0}
		if(v3.length === 0){v3 = 0}
		if(v4.length === 0){v4 = 0}
		if(v5.length === 0){v5 = 0}


		for (const [key, value] of Object.entries(pair_models)) {
			if(value === pair_models[model]){
				d3.json("/" + value + "_"+v1+"_"+v2+"_"+v3+"_"+v4+"_"+v5).then(function(data){
					result = data.Predicted
					showresult(result)
				})
			}
		}	
	}else if(sum === 6){

		let v1 = document.getElementById("var1").value
		let v2 = document.getElementById("var2").value
		let v3 = document.getElementById("var3").value
		let v4 = document.getElementById("var4").value
		let v5 = document.getElementById("var5").value
		let v6 = document.getElementById("var6").value
		if(v1.length === 0){v1 = 0}
		if(v2.length === 0){v2 = 0}
		if(v3.length === 0){v3 = 0}
		if(v4.length === 0){v4 = 0}
		if(v5.length === 0){v5 = 0}
		if(v6.length === 0){v6 = 0}

		for (const [key, value] of Object.entries(pair_models)) {
			if(value === pair_models[model]){
				d3.json("/" + value + "_"+v1+"_"+v2+"_"+v3+"_"+v4+"_"+v5+"_"+v6).then(function(data){
					result = data.Predicted
					showresult(result)
				})
			}
		}	
	}else{

		let v1 = document.getElementById("var1").value
		let v2 = document.getElementById("var2").value
		let v3 = document.getElementById("var3").value
		let v4 = document.getElementById("var4").value
		let v5 = document.getElementById("var5").value
		let v6 = document.getElementById("var6").value
		let v7 = document.getElementById("var7").value
		if(v1.length === 0){v1 = 0}
		if(v2.length === 0){v2 = 0}
		if(v3.length === 0){v3 = 0}
		if(v4.length === 0){v4 = 0}
		if(v5.length === 0){v5 = 0}
		if(v6.length === 0){v6 = 0}
		if(v7.length === 0){v7 = 0}

		for (const [key, value] of Object.entries(pair_models)) {
			if(value === pair_models[model]){
				d3.json("/" + value + "_"+v1+"_"+v2+"_"+v3+"_"+v4+"_"+v5+"_"+v6+"_"+v7).then(function(data){
					result = data.Predicted
					showresult(result)
				})
			}
		}
	}
}

function model_values(){
	cleanmodel()
	let mun = document.getElementById("testing").value
	let state = document.getElementById("stateSelector").value
	
	d3.json("/api_ML_" + state).then(function(data){
		
		let mun_data = data.filter(d=>d.NOMBRE_MUNICIPIO === mun)[0]
		let model = document.getElementById("modelSelector").value
		let model_var = ML_list[model]
		let label = document.getElementById("modelSelector").value

		d3.select("#v0").text(label)
		document.getElementById("var0").value = parseFloat(mun_data[model_var]).toFixed(2)

		for(i = 1; i<8; i++){
			let classvalue = document.getElementById("var"+i)
			let test = classvalue.classList.contains("inputhidden")
			if (test === false){
				
				let var_name = document.getElementById("v"+i).innerHTML
				let var_db = ML_list[var_name]
				
				document.getElementById("var"+i).defaultValue =parseFloat(mun_data[var_db]).toFixed(2); 		
				document.getElementById("var"+i).value =parseFloat(mun_data[var_db]).toFixed(2); 		
			}
		}
		

	})
	
}

function erasedata(){
	for(i=1; i< 8; i++){
		document.getElementById("var"+i).value = ''
	}
}

function showresult(result){
	let state = document.getElementById("stateSelector").value
	let mun = document.getElementById("testing").value
	let current = parseFloat(document.getElementById("var0").value).toFixed(2)
	// d3.select("#result").text(parseFloat(result).toFixed(2))

	d3.json("/api_ML_" + state).then(function(data){
		
		let mun_data = data.filter(d=>d.NOMBRE_MUNICIPIO === mun)[0]

		let current = document.getElementById("var0").value
		let model_label = document.getElementById("v0").innerHTML
		let original_values = []
		let input_values = []
		let label_list = []

		original_values.push(current)
		input_values.push(parseFloat(result).toFixed(2))
		label_list.push(model_label)
		

		for(i = 1; i<8; i++){
			let classvalue = document.getElementById("var"+i)
			let test = classvalue.classList.contains("inputhidden")
			if (test === false){
				let new_value = document.getElementById("var" + i).value				
				let var_name = document.getElementById("v"+i).innerHTML
				let old_value = ML_list[var_name]
				original_values.push(parseFloat(mun_data[old_value]).toFixed(2))
				input_values.push(parseFloat(new_value).toFixed(2))
				label_list.push(var_name)
							
			}
		}

		var data2 = [
			{
			  type: "indicator",
			  mode: "number+gauge+delta",
		// Predicted value
			  value: result,
			  domain: { x: [0, 2], y: [0, 2] },
			  title: '',
		// Actual value
			  delta: { reference: current},
			  gauge: {
				shape: "bullet",
				axis: { range: [null, result + 0.5] },
				threshold: {
				  line: { color: "red", width: 3 },
				  thickness: 0.75,
		// Actual value
				  value: current
				},
				steps: [
				  { range: [0, result + 0.5], color:  "#D1ECE5" },
				]
			  }
			}
		  ];

		  
	
		  var trace1 = {
			x: label_list,
			y: original_values,
			type: 'bar',
			name: 'Current value',
			marker: {
			  color: '#CECECE',
			  opacity: 0.8,
			}
		  };

		  var layout ={
			autosize:true,
			plot_bgcolor: "white",
			height:100,
			margin:{
				l:100,
				t:20,
				r:100,
				b:20
			}
		  }
		  
		  var trace2 = {
			x: label_list,
			y: input_values,
			type: 'bar',
			name: 'Predicted value',
			marker: {
			  color: ['#BD0707','#69b3a2','#69b3a2','#69b3a2','#69b3a2','#69b3a2','#69b3a2','#69b3a2'],
			  opacity: 1
			}
		  };
		  
		  var data = [trace1, trace2];
		  
		  var layout1 = {
			title: '',
			xaxis: {
			  tickangle: 30
			},
			legend:{
				x:0.4,
				y:1.1,
				font: {
					family: 'Helvetica',
					size: 18,
					color: '#000'
				  },
			},
			margin:{
				b:100,
				t:20
			},
			barmode: 'group'
		  };
		  
		Plotly.newPlot('barchart', data, layout1, config);  
		Plotly.newPlot('gauge', data2, layout, config);
		
		let percentage = parseFloat(((parseFloat(result) / parseFloat(current)) -1)*100).toFixed(2)

		d3.select("#title")
		.html('<h3>Machine Learning model for ' + model_label + ' in ' + mun)
		d3.select("#text1")
		.html('<p style="text-align:left";> Considering the written values, you can see how the model was affected from its original situation. <br>The red line shows us the current (real) value, while the green bar represents the forecast ')
		d3.select("#text2")
		.html('<p>The ' + model_label + ' availability is currently on <b>' + current + '</b>, while the predicted value is now located at <b>' + parseFloat(result).toFixed(2) + '</b>.<br><h5><b> This would represent a change of '+ parseFloat(((parseFloat(result) / parseFloat(current)) -1)*100).toFixed(2) + '%</b></h5>') 
		
		if(model_label == "Streaming"){
			d3.select("#text3")
		.html('<p style="text-align:justify";><b style="text-align:center;">Final Advice: </b>If the percent change is above 25%, you should consider this is a good bussines opportunity.<br><b>Note: </b>For a better predictive result, you should consider variations in the explanatory variables based on your professional experience and any other source of information you consider relevant</p>')
		}else{
			d3.select("#text3")
		.html('<p style="text-align:justify";><b style="text-align:center;">Final Advice: </b>If the percent change is above 10%, you should consider this is a good bussines opportunity.<br><b>Note: </b>For a better predictive result, you should consider variations in the explanatory variables based on your professional experience and any other source of information you consider relevant. <br>Finally, always have in mind these model is based on historical data following certain patterns, which could change anytime in the future.</p>')
		}
		
		
	})

	
}

function cleanmodel(){
	d3.select("#title").html('Please change the variables to the values that you want and click on Calculate to see our reccomendation')
	d3.select("#text1").html('')
	d3.select("#gauge").html('')
	d3.select("#text2").html('')
	d3.select("#barchart").html('')
	d3.select("#text3").html('')
}


init()
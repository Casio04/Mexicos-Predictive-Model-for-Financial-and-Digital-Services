// Variable for responsive plotly charts
var config = {responsive: true}

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
}

// limiting input to a range of 0 to 10 
function handleChange(input) {
    if (input.value < 0) input.value = 0;
    if (input.value > 10) input.value = 10;
  }

// running function to calculate prediction from model


function munUpdate(state){
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
		model_values(mun)
	})	
	
}

function runModel(){
	
	let state = document.getElementById("stateSelector").value
	let mun = document.getElementById("testing").value
	
	let original_list = []
	let input_list = []
	d3.json("/api_ML_" + state).then(function(data){
		
		let mun_data = data.filter(d=>d.NOMBRE_MUNICIPIO === mun)[0]
		console.log(mun_data)
		
		for(i = 1; i<8; i++){
			let classvalue = document.getElementById("var"+i)
			let test = classvalue.classList.contains("inputhidden")
			if (test === false){
				
				let var_name = document.getElementById("v"+i).innerHTML
				let var_db = ML_list[var_name]
				input_list.push(document.getElementById("var"+i).value)
				original_list.push(mun_data[var_db])
				
			}
		}
		console.log(original_list)				
		console.log(input_list)
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

function model_values(mun){
	let state = document.getElementById("stateSelector").value
	
	d3.json("/api_ML_" + state).then(function(data){
		
		let mun_data = data.filter(d=>d.NOMBRE_MUNICIPIO === mun)[0]
		
		
		for(i = 1; i<8; i++){
			let classvalue = document.getElementById("var"+i)
			let test = classvalue.classList.contains("inputhidden")
			if (test === false){
				
				let var_name = document.getElementById("v"+i).innerHTML
				let var_db = ML_list[var_name]
				
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
	d3.select("#result").text(parseFloat(result).toFixed(2))
}

init()
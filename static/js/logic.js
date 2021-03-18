var config = {responsive: true}
// Function to initiate dropdown with states name and product types
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
        
        let selection = d3.select("#stateDrop")
        .selectAll("option")
        selection.data(states_list)
        .enter()
        .append("option")
        .merge(selection)
        .attr("value", d =>d)
        .text(d=>d)
        selection.exit().remove()

        // Getting the first state in the arrawy and calling the function to update by default this value on the first loaf
        let firstResult = states[0]
        stateChanged(firstResult)

        let state = document.getElementById("stateDrop").value
        let municipalities = data.filter(d=>d.NOMBRE_ENTIDAD === state)

        let mun_list = d3.select("#munChoice")
        .selectAll("option")
        mun_list.data(municipalities)
        .enter()
        .append("option")
        .merge(mun_list)
        .attr("value", d =>d.NOMBRE_MUNICIPIO)
        .text(d=>d.NOMBRE_MUNICIPIO)
        mun_list.exit().remove()
    })
}

function queryFill(){
    d3.select("#munChoice").html('')
    d3.select("#pieplot").html('')
    let value = document.getElementById("queryChoice").value
    let service = document.getElementById("serviceChoice").value
    if(value === "1"){
        d3.select("#responsive-header").html("<h4>Select a Municpality</h4>")
        let state = document.getElementById("stateDrop").value
            
        d3.json("../api_mun").then(function(data){
            let municipalities = data.filter(d=>d.NOMBRE_ENTIDAD === state)

            let mun_list = d3.select("#munChoice")
            .selectAll("option")
            mun_list.data(municipalities)
            .enter()
            .append("option")
            .merge(mun_list)
            .attr("value", d =>d.NOMBRE_MUNICIPIO)
            .text(d=>d.NOMBRE_MUNICIPIO)
            mun_list.exit().remove()
        })
    }else{
        d3.select("#responsive-header").html("<h4>Select a Service</h4>")
        let queryList = []
        
        if(service === "1"){
            queryList = digital
        }else if(service === "2"){
            queryList = financial
        }else if(service === "3"){
            queryList = savings
        }else{
            queryList = loans
        }

        let mun_list = d3.select("#munChoice")
        .selectAll("option")
        mun_list.data(queryList)
        .enter()
        .append("option")
        .merge(mun_list)
        .attr("value", d=>d)
        .text(d=>d)
        mun_list.exit().remove()
        
    }
    chart()
}

var mymap = L.map('map').setView([22.76843, -102.58141], 5);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(mymap);

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
// Defining function for updating state color depending on the inclusion data

function digital_map(){
    // ----------------------------------------------- LEAFLET MAP --------------------------------------------------------------------
    
    try{
        mymap.removeLayer(geojson)
        document.querySelectorAll('.info').forEach(function(a){
            a.remove()
        })
        // mymap.setView([22.849294981948546, -102.68634458318647], 5)
    }
    catch{}

    function getColor(d) {
        return d > 0.7      ? '#0E4D64' :
            d > 0.6      ? '#137177' :
            d > 0.50     ? '#188977' :
            d > 0.40     ? '#39A96B' :
            d > 0.30     ? '#74C67A' :
                                '#BFE1B0';
    }
    
    function highlightFeature(e) {
        let layer = e.target;
    
        layer.setStyle({
            weight: 3,
            color: '#FFFFFF',
            dashArray: '',
            fillOpacity: .7
        });
    
        info.update(layer.feature.properties)
    
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }
    
    // Function to zoom the state when hovered
    function zoomToFeature(e) {
        mymap.fitBounds(e.target.getBounds());
    }
    
    // Function to reset view on mouseout
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update()
    }
    
    var info = L.control();
    
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };
    
    info.update = function (props) {
        this._div.innerHTML = '<h4>Municipality information</h4>' +  (props ?
            '<b>' + props.NOMBRE_ENTIDAD + '</b><br />Municipality: ' + props.NOMBRE_MUNICIPIO + '</b><br />Total population: ' + formatNumber(props.POBTOT) + 
            '<br />National ranking: ' + props.RANKING +
            '<br />Inclusion percentage: ' + parseFloat(props.INCLUSION_MUN * 100).toFixed(0)+'%'
            : 'Hover over a state');
    };
    
    
    // Adding the legend control to show the meaning of each color
    var legend = L.control({position: 'bottomleft'});
    
    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 0.30, 0.40, 0.50, 0.60, 0.70],
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        div.innerHTML += '<b>% of inclusion </b><hr>'
    
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i]+ 0.01) + '"></i> ' +
                grades[i] *100 + (grades[i + 1] * 100? '&ndash;' + grades[i + 1] * 100 + '<br>' : '+');
        }
    
        return div;
    };
    // If a layer is already added and the user picks another state, the past layer will be gone and the map will be centered again
   

    // Getting the state value and reading the data
    let state = document.getElementById("stateDrop").value
    let url = ("../api_municipios/" + state)
    d3.json(url).then(function(data){
        d3.select("#graph-header")
        .text("Distribution of Digital Services by State - " + data[0].features[0].properties.NOMBRE_ENTIDAD)
        let zoom = zoom_properties[data[0].features[0].properties.NOMBRE_ENTIDAD]
        // Getting the type of polygon from the selected data
        let type = data[0].features[0].geometry.type
        
        // Obtaining the first pair of coordinates from the selected state so we can position our map there.
        // Depending on the type of polygon, the retrieve is made differently
       if(type === "Polygon"){
        var coords = data[0].features[0].geometry.coordinates[0][0]
       }else{
        // Type: Multipolygon
        var coords = data[0].features[0].geometry.coordinates[0][0][0]
       }
       
        // Update the center of the map with more zoom
       mymap.setView([coords[1],coords[0]], zoom , animate = true)  
       
        // Adding style to the choroplet layer
        function style(feature) {
            return {
                fillColor: getColor(feature.properties.INCLUSION_MUN),
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.8
            };
        }
    
        // Adding behaviour to the map by calling the previously defined functinos
        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }     
        
        // Adding the geojson layer with the choroplet options
        geojson = L.geoJson(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(mymap);
    
        info.addTo(mymap);
        legend.addTo(mymap);
        
    // ----------------------------------------------Plotly function-------------------------------------------------------------------
    let colors = ['rgba(93, 164, 214, 0.5)', 'rgba(255, 144, 14, 0.5)', 'rgba(44, 160, 101, 0.5)', 'rgba(255, 65, 54, 0.5)', 'rgba(207, 114, 255, 0.5)', 'rgba(127, 96, 0, 0.5)', 'rgba(255, 140, 184, 0.5)', 'rgba(79, 90, 117, 0.5)', 'rgba(222, 223, 0, 0.5)'];    
    // Creating layout options
        layout = {
            yaxis: {
                autorange: true,
                showgrid: true,
                zeroline: true,
                dtick: 5,
                gridcolor: 'rgb(255, 255, 255)',
                gridwidth: 1,
                boxpoints: "all",
                zerolinecolor: 'rgb(255, 255, 255)',
                zerolinewidth: 2
            },
            margin: {
                l: 40,
                r: 30,
                b: 80,
                t: 20
            },
            paper_bgcolor: 'rgb(243, 243, 243)',
            plot_bgcolor: 'rgb(243, 243, 243)',
            showlegend: false
        };

        //  Create the Traces
        var xData = ['Television', 'Radio',
                'Fixed<br>Telphone', 'Cellphone',
                'Paid TV', 'Video Games<br>Console',
                'Internet', 'Streaming<br>Services', 'Computer'];

                let plotly = d3.select("#plot").html('')
                // Filtering the data by state needed
                let state = document.getElementById("stateDrop").value;
                
                let entity = data
                // Creating the array of arrays for each box
                var yData = [
                    entity.map(val => val.features[0].properties.VPH_TV/val.features[0].properties.TVIVPARHAB*100),
                    entity.map(val => val.features[0].properties.VPH_RADIO/val.features[0].properties.TVIVPARHAB*100),
                    entity.map(val => val.features[0].properties.VPH_TELEF/val.features[0].properties.TVIVPARHAB*100),
                    entity.map(val => val.features[0].properties.VPH_CEL/val.features[0].properties.TVIVPARHAB*100),
                    entity.map(val => val.features[0].properties.VPH_STVP/val.features[0].properties.TVIVPARHAB*100),
                    entity.map(val => val.features[0].properties.VPH_CVJ/val.features[0].properties.TVIVPARHAB*100),
                    entity.map(val => val.features[0].properties.VPH_INTER/val.features[0].properties.TVIVPARHAB*100),
                    entity.map(val => val.features[0].properties.VPH_SPMVPI/val.features[0].properties.TVIVPARHAB*100),
                    entity.map(val => val.features[0].properties.VPH_PC/val.features[0].properties.TVIVPARHAB*100),
                ]
                
                let data1 = []
                // Appending each piece of data for every variable
                for ( let i = 0; i < xData.length; i ++ ) {
                    let result = {
                        type: 'box',
                        y: yData[i],
                        name: xData[i],
                        jitter: 0.5,
                        whiskerwidth: 0.2,
                        fillcolor: colors,
                        marker: {
                            size: 6
                        },
                        line: {
                            width: 3
                        }
                    };
                    data1.push(result);
                }
            
                Plotly.newPlot('plot', data1, layout, config)

        console.log("ok")
        
    })
    
}

function financial_map(){
    // ----------------------------------------------- LEAFLET MAP --------------------------------------------------------------------
    try{
        mymap.removeLayer(geojson)
        document.querySelectorAll('.info').forEach(function(a){
            a.remove()
        })
        // mymap.setView([22.849294981948546, -102.68634458318647], 5)
    }
    catch{}

    function getColor2(d) {
        return d > 3000000     ? '#0C0575' :
            d > 2000000      ? '#0C00C2' :
            d > 1000000    ? '#005DC2' :
            d > 500000  ? '#0083C2' :
            d > 100000     ? '#00B6D4' :
                                '#5AE4E9';
    }
    
    function highlightFeature(e) {
        let layer = e.target;
    
        layer.setStyle({
            weight: 3,
            color: '#FFFFFF',
            dashArray: '',
            fillOpacity: .7
        });
    
        info.update(layer.feature.properties)
    
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }
    
    // Function to zoom the state when hovered
    function zoomToFeature(e) {
        mymap.fitBounds(e.target.getBounds());
    }
    
    // Function to reset view on mouseout
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update()
    }
    
    var info = L.control();
    
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };
    
    info.update = function (props) {
        this._div.innerHTML = '<h4>Municipality information</h4>' +  (props ?
            '<b>' + props.NOMBRE_ENTIDAD + '</b><br />Municipality: ' + props.NOMBRE_MUNICIPIO + '</b><br />EAP: ' + formatNumber(props.PEA) + 
            '<br />Banking (All types): ' + formatNumber(d3.sum([props.Sucursales_BC, props.Sucursales_BD, props.Sucursales_Socap, props.Sucursales_Sofipo ]))  +
            '<br />Correspondents ' + formatNumber(props.Corresponsales) +
            '<br />ATM: ' + formatNumber(props.ATM) + 
            '<br />POS: ' + formatNumber(props.TPV) +
            '<br />Mobile Banking: ' + formatNumber(props.Contratos_BM)
            : 'Hover over a state');
    };
    
    
    // Adding the legend control to show the meaning of each color
    var legend = L.control({position: 'bottomleft'});
    
    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 100000, 500000, 1000000, 2000000, 3000000],
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        div.innerHTML += '<b>Mobile Banking </b><br><p style="text-align:center; font-size: 14px">In Thousands<hr>'
    
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor2(grades[i]+0.01) + '"></i> ' +
                (grades[i]/1000) + (grades[i + 1] / 1000 ? '&ndash;' + grades[i + 1] / 1000 + '<br>' : '+');
        }
    
        return div;
    };
    // If a layer is already added and the user picks another state, the past layer will be gone and the map will be centered again
   

    // Getting the state value and reading the data
    let state = document.getElementById("stateDrop").value
    let url = ("../api_municipios/" + state)
    d3.json(url).then(function(data){
        d3.select("#graph-header").text("Distribution of Financial Services by State - " + data[0].features[0].properties.NOMBRE_ENTIDAD)
        let zoom = zoom_properties[data[0].features[0].properties.NOMBRE_ENTIDAD]
        // Getting the type of polygon from the selected data
        let type = data[0].features[0].geometry.type
        
        // Obtaining the first pair of coordinates from the selected state so we can position our map there.
        // Depending on the type of polygon, the retrieve is made differently
       if(type === "Polygon"){
        var coords = data[0].features[0].geometry.coordinates[0][0]
       }else{
        // Type: Multipolygon
        var coords = data[0].features[0].geometry.coordinates[0][0][0]
       }
       
        // Update the center of the map with more zoom
       mymap.setView([coords[1],coords[0]], zoom , animate = true)  
       
        // Adding style to the choroplet layer
        function style(feature) {
            return {
                fillColor: getColor2(feature.properties.Contratos_BM),
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.8
            };
        }
    
        // Adding behaviour to the map by calling the previously defined functinos
        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }     
        
        // Adding the geojson layer with the choroplet options
        geojson = L.geoJson(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(mymap);
    
        info.addTo(mymap);
        legend.addTo(mymap);
        
    // ----------------------------------------------Plotly function-------------------------------------------------------------------
    let colors = ['rgba(93, 164, 214, 0.5)', 'rgba(255, 144, 14, 0.5)', 'rgba(44, 160, 101, 0.5)', 'rgba(255, 65, 54, 0.5)', 'rgba(207, 114, 255, 0.5)', 'rgba(127, 96, 0, 0.5)', 'rgba(255, 140, 184, 0.5)', 'rgba(79, 90, 117, 0.5)', 'rgba(222, 223, 0, 0.5)'];    
    // Creating layout options
        layout = {
            yaxis: {
                autorange: true,
                showgrid: true,
                zeroline: true,
                dtick: 5,
                gridcolor: 'rgb(255, 255, 255)',
                gridwidth: 1,
                boxpoints: "all",
                zerolinecolor: 'rgb(255, 255, 255)',
                zerolinewidth: 2
            },
            margin: {
                l: 40,
                r: 30,
                b: 80,
                t: 20
            },
            paper_bgcolor: 'rgb(243, 243, 243)',
            plot_bgcolor: 'rgb(243, 243, 243)',
            showlegend: false
        };

        //  Create the Traces
        var xData = ['Private Banking', 'Development Banking',
                'SOCAP', 'SOFIPO',
                'Correspondents', 'ATM',
                'POS', 'Establishments <br> with POS'];

                let plotly = d3.select("#plot").html('')
                // Filtering the data by state needed
                let state = document.getElementById("stateDrop").value;
                
                let entity = data
                // Creating the array of arrays for each box
                var yData = [
                    entity.map(val => val.features[0].properties.Sucursales_BC/val.features[0].properties.PEA*100),
                    entity.map(val => val.features[0].properties.Sucursales_BD/val.features[0].properties.PEA*100),
                    entity.map(val => val.features[0].properties.Sucursales_Socap/val.features[0].properties.PEA*100),
                    entity.map(val => val.features[0].properties.Sucursales_Sofipo/val.features[0].properties.PEA*100),
                    entity.map(val => val.features[0].properties.Corresponsales/val.features[0].properties.PEA*100),
                    entity.map(val => val.features[0].properties.ATM/val.features[0].properties.PEA*100),
                    entity.map(val => val.features[0].properties.TPV/val.features[0].properties.PEA*100),
                    entity.map(val => val.features[0].properties.Establecimientos_TPV/val.features[0].properties.PEA*100),
                    // entity.map(val => val.features[0].properties.Contratos_BM_dem/val.features[0].properties.PEA*100),
                ]
                
                let data1 = []
                // Appending each piece of data for every variable
                for ( let i = 0; i < xData.length; i ++ ) {
                    let result = {
                        type: 'box',
                        y: yData[i],
                        name: xData[i],
                        jitter: 0.5,
                        whiskerwidth: 0.2,
                        fillcolor: colors,
                        marker: {
                            size: 6
                        },
                        line: {
                            width: 3
                        }
                    };
                    data1.push(result);
                }
            
                Plotly.newPlot('plot', data1, layout, config)

        console.log("ok")
        
    })
    
}

function savings_map(){
    // ----------------------------------------------- LEAFLET MAP --------------------------------------------------------------------
    try{
        mymap.removeLayer(geojson)
        document.querySelectorAll('.info').forEach(function(a){
            a.remove()
        })
        // mymap.setView([22.849294981948546, -102.68634458318647], 5)
    }
    catch{}

    function getColor3(d) {
        return d > 8000000     ? '#D52B0C' :
            d > 5000000      ? '#D55E0C' :
            d > 2000000    ? '#D38900' :
            d > 1000000 ? '#D3A600' :
            d > 500000     ? '#CDC306' :
                                '#DCD662';
    }
    
    function highlightFeature(e) {
        let layer = e.target;
    
        layer.setStyle({
            weight: 3,
            color: '#FFFFFF',
            dashArray: '',
            fillOpacity: .7
        });
    
        info.update(layer.feature.properties)
    
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }
    
    // Function to zoom the state when hovered
    function zoomToFeature(e) {
        mymap.fitBounds(e.target.getBounds());
    }
    
    // Function to reset view on mouseout
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update()
    }
    
    var info = L.control();
    
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };
    
    info.update = function (props) {
        this._div.innerHTML = '<h4>Municipality information</h4>' +  (props ?
            '<b>' + props.NOMBRE_ENTIDAD + '</b><br />Municipality: ' + props.NOMBRE_MUNICIPIO + '</b><br />EAP: ' + formatNumber(props.PEA) + 
            '<br />Level 1 Accounts: ' + props.Cuentas_T1 +
            '<br />Level 2 Acccounts: ' + formatNumber(props.Cuentas_T2) +
            '<br />Level 3 Accounts: ' + formatNumber(props.Cuentas_T3) + 
            '<br />Traditional Accounts: ' + formatNumber(props.Cuentas_Trad) +
            '<br />Savings Accounts: ' + formatNumber(props.Cuentas_Ah) +
            '<br />Time deposits: ' + formatNumber(props.Dep_plazo) +
            '<br />Debit Cards: ' + formatNumber(props.T_debito) 
            : 'Hover over a state');
    };
    
    
    // Adding the legend control to show the meaning of each color
    var legend = L.control({position: 'bottomleft'});
    
    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 500000, 1000000, 2000000, 5000000, 8000000],
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        div.innerHTML += '<b>Debit Cards </b><br><i style="text-align:center">Thousands</i><hr>'
    
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor3(grades[i] + 0.01) + '"></i> ' +
                (grades[i]/1000) + (grades[i + 1] / 1000 ? '&ndash;' + grades[i + 1] / 1000 + '<br>' : '+');
        }
    
        return div;
    };
    // If a layer is already added and the user picks another state, the past layer will be gone and the map will be centered again
   

    // Getting the state value and reading the data
    let state = document.getElementById("stateDrop").value
    let url = ("../api_municipios/" + state)
    d3.json(url).then(function(data){
        d3.select("#graph-header").text("Distribution of Savings Accounts by State - " + data[0].features[0].properties.NOMBRE_ENTIDAD)
        let zoom = zoom_properties[data[0].features[0].properties.NOMBRE_ENTIDAD]
        // Getting the type of polygon from the selected data
        let type = data[0].features[0].geometry.type
        
        // Obtaining the first pair of coordinates from the selected state so we can position our map there.
        // Depending on the type of polygon, the retrieve is made differently
       if(type === "Polygon"){
        var coords = data[0].features[0].geometry.coordinates[0][0]
       }else{
        // Type: Multipolygon
        var coords = data[0].features[0].geometry.coordinates[0][0][0]
       }
       
        // Update the center of the map with more zoom
       mymap.setView([coords[1],coords[0]], zoom , animate = true)  
       
        // Adding style to the choroplet layer
        function style(feature) {
            return {
                fillColor: getColor3(feature.properties.T_debito),
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.8
            };
        }
    
        // Adding behaviour to the map by calling the previously defined functinos
        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }     
        
        // Adding the geojson layer with the choroplet options
        geojson = L.geoJson(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(mymap);
    
        info.addTo(mymap);
        legend.addTo(mymap);
        
    // ----------------------------------------------Plotly function-------------------------------------------------------------------
    let colors = ['rgba(93, 164, 214, 0.5)', 'rgba(255, 144, 14, 0.5)', 'rgba(44, 160, 101, 0.5)', 'rgba(255, 65, 54, 0.5)', 'rgba(207, 114, 255, 0.5)', 'rgba(127, 96, 0, 0.5)', 'rgba(255, 140, 184, 0.5)', 'rgba(79, 90, 117, 0.5)', 'rgba(222, 223, 0, 0.5)'];    
    // Creating layout options
        layout = {
            yaxis: {
                autorange: true,
                showgrid: true,
                zeroline: true,
                dtick: 5,
                gridcolor: 'rgb(255, 255, 255)',
                gridwidth: 1,
                boxpoints: "all",
                zerolinecolor: 'rgb(255, 255, 255)',
                zerolinewidth: 2
            },
            margin: {
                l: 40,
                r: 30,
                b: 80,
                t: 20
            },
            paper_bgcolor: 'rgb(243, 243, 243)',
            plot_bgcolor: 'rgb(243, 243, 243)',
            showlegend: false
        };

        //  Create the Traces
        var xData = ['Level 1', 'Level 2',
                'Level 3', 'Traditional',
                'Savings Accounts', 'Time Deposits'];

                let plotly = d3.select("#plot").html('')
                // Filtering the data by state needed
                let state = document.getElementById("stateDrop").value;
                
                let entity = data
                // Creating the array of arrays for each box
                var yData = [
                    entity.map(val => val.features[0].properties.Cuentas_T1/val.features[0].properties.PEA*100),
                    entity.map(val => val.features[0].properties.Cuentas_T2/val.features[0].properties.PEA*100),
                    entity.map(val => val.features[0].properties.Cuentas_T3/val.features[0].properties.PEA*100),
                    entity.map(val => val.features[0].properties.Cuentas_Trad/val.features[0].properties.PEA*100),
                    entity.map(val => val.features[0].properties.Cuentas_Ah/val.features[0].properties.PEA*100),
                    entity.map(val => val.features[0].properties.Dep_plazo/val.features[0].properties.PEA*100),
                    // entity.map(val => val.features[0].properties.T_debito/val.features[0].properties.PEA*100),
                ]
                
                let data1 = []
                // Appending each piece of data for every variable
                for ( let i = 0; i < xData.length; i ++ ) {
                    let result = {
                        type: 'box',
                        y: yData[i],
                        name: xData[i],
                        jitter: 0.5,
                        whiskerwidth: 0.2,
                        fillcolor: colors,
                        marker: {
                            size: 6
                        },
                        line: {
                            width: 3
                        }
                    };
                    data1.push(result);
                }
            
                Plotly.newPlot('plot', data1, layout, config)

        console.log("ok")
        
    })
    
}

function credits_map(){
    // ----------------------------------------------- LEAFLET MAP --------------------------------------------------------------------
    try{
        mymap.removeLayer(geojson)
        document.querySelectorAll('.info').forEach(function(a){
            a.remove()
        })
        // mymap.setView([22.849294981948546, -102.68634458318647], 5)
    }
    catch{}

    function getColor4(d) {
        return d > 200000     ? '#8400FF' :
            d > 150000      ? '#9F00FF' :
            d > 100000    ? '#CA00FF' :
            d > 50000 ? '#ED51FF' :
            d > 10000     ? '#F165EE' :
                                '#F28BEA';
    }
    
    function highlightFeature(e) {
        let layer = e.target;
    
        layer.setStyle({
            weight: 3,
            color: '#FFFFFF',
            dashArray: '',
            fillOpacity: .7
        });
    
        info.update(layer.feature.properties)
    
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }
    
    // Function to zoom the state when hovered
    function zoomToFeature(e) {
        mymap.fitBounds(e.target.getBounds());
    }
    
    // Function to reset view on mouseout
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update()
    }
    
    var info = L.control();
    
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };
    
    info.update = function (props) {
        this._div.innerHTML = '<h4>Municipality information</h4>' +  (props ?
            '<b>' + props.NOMBRE_ENTIDAD + '</b><br />Municipality: ' + props.NOMBRE_MUNICIPIO + '</b><br />EAP: ' + formatNumber(props.PEA) + 
            '<br />Credit Cards: ' + formatNumber(props.T_cred) +
            '<br />Mortgage: ' + formatNumber(props.C_hip) +
            '<br />Group credit: ' + formatNumber(props.C_grup) + 
            '<br />Personal credit: ' + formatNumber(props.Personal) +
            '<br />Payroll credit: ' + formatNumber(props.Nomina) +
            '<br />Automobile: ' + formatNumber(props.Automotriz) +
            '<br />ABCD: ' + formatNumber(props.ABCD) 
            : 'Hover over a state');
    };
    
    
    // Adding the legend control to show the meaning of each color
    var legend = L.control({position: 'bottomleft'});
    
    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10000, 50000, 100000, 150000, 200000],
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        div.innerHTML += '<b>Personal Credits </b><br><i style="text-align:center">Thousands</i><hr>'
    
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor4(grades[i]+0.01) + '"></i> ' +
                (grades[i]/1000) + (grades[i + 1] / 1000 ? '&ndash;' + grades[i + 1] / 1000 + '<br>' : '+');
        }
    
        return div;
    };
    // If a layer is already added and the user picks another state, the past layer will be gone and the map will be centered again
   

    // Getting the state value and reading the data
    let state = document.getElementById("stateDrop").value
    let url = ("../api_municipios/" + state)
    d3.json(url).then(function(data){
        d3.select("#graph-header").text("Distribution of Loans Accounts by State - " + data[0].features[0].properties.NOMBRE_ENTIDAD)
        let zoom = zoom_properties[data[0].features[0].properties.NOMBRE_ENTIDAD]
        // Getting the type of polygon from the selected data
        let type = data[0].features[0].geometry.type
        
        // Obtaining the first pair of coordinates from the selected state so we can position our map there.
        // Depending on the type of polygon, the retrieve is made differently
       if(type === "Polygon"){
        var coords = data[0].features[0].geometry.coordinates[0][0]
       }else{
        // Type: Multipolygon
        var coords = data[0].features[0].geometry.coordinates[0][0][0]
       }
       
        // Update the center of the map with more zoom
       mymap.setView([coords[1],coords[0]], zoom , animate = true)  
       
        // Adding style to the choroplet layer
        function style(feature) {
            return {
                fillColor: getColor4(feature.properties.Personal),
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.8
            };
        }
    
        // Adding behaviour to the map by calling the previously defined functinos
        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }     
        
        // Adding the geojson layer with the choroplet options
        geojson = L.geoJson(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(mymap);
    
        info.addTo(mymap);
        legend.addTo(mymap);
        
    // ----------------------------------------------Plotly function-------------------------------------------------------------------
    let colors = ['rgba(93, 164, 214, 0.5)', 'rgba(255, 144, 14, 0.5)', 'rgba(44, 160, 101, 0.5)', 'rgba(255, 65, 54, 0.5)', 'rgba(207, 114, 255, 0.5)', 'rgba(127, 96, 0, 0.5)', 'rgba(255, 140, 184, 0.5)', 'rgba(79, 90, 117, 0.5)', 'rgba(222, 223, 0, 0.5)'];    
    // Creating layout options
        layout = {
            yaxis: {
                autorange: true,
                showgrid: true,
                zeroline: true,
                dtick: 5,
                gridcolor: 'rgb(255, 255, 255)',
                gridwidth: 1,
                boxpoints: "all",
                zerolinecolor: 'rgb(255, 255, 255)',
                zerolinewidth: 2
            },
            margin: {
                l: 40,
                r: 30,
                b: 80,
                t: 20
            },
            paper_bgcolor: 'rgb(243, 243, 243)',
            plot_bgcolor: 'rgb(243, 243, 243)',
            showlegend: false
        };

        //  Create the Traces
        var xData = ['Credit Cards', 'Mortgage',
                'Group Credit', 'Personal Credit',
                'Payroll credit', 'Automobile', 'ABCD'];

                let plotly = d3.select("#plot").html('')
                // Filtering the data by state needed
                let state = document.getElementById("stateDrop").value;
                
                let entity = data
                // Creating the array of arrays for each box
                var yData = [
                    entity.map(val => val.features[0].properties.T_cred/val.features[0].properties.PEA*100),
                    entity.map(val => val.features[0].properties.C_hip/val.features[0].properties.PEA*100),
                    entity.map(val => val.features[0].properties.C_grup/val.features[0].properties.PEA*100),
                    entity.map(val => val.features[0].properties.Personal/val.features[0].properties.PEA*100),
                    entity.map(val => val.features[0].properties.Nomina/val.features[0].properties.PEA*100),
                    entity.map(val => val.features[0].properties.Automotriz/val.features[0].properties.PEA*100),
                    entity.map(val => val.features[0].properties.ABCD/val.features[0].properties.PEA*100),
                ]
                
                let data1 = []
                // Appending each piece of data for every variable
                for ( let i = 0; i < xData.length; i ++ ) {
                    let result = {
                        type: 'box',
                        y: yData[i],
                        name: xData[i],
                        jitter: 0.5,
                        whiskerwidth: 0.2,
                        fillcolor: colors,
                        marker: {
                            size: 6
                        },
                        line: {
                            width: 3
                        }
                    };
                    data1.push(result);
                }
            
                Plotly.newPlot('plot', data1, layout, config)

        console.log("ok")
        
    })
    
}

function chart(){
    
    let colors = ['#0F38E7','#E78E0F','#34E70F','#8F0FE7','#E73D0F','#825C25','#EC4AD8','#949394','#D4E448']
    let service = document.getElementById("serviceChoice").options[document.getElementById("serviceChoice").selectedIndex].text
    let service_value = document.getElementById("serviceChoice").value
    let query = document.getElementById("queryChoice").value
    let donut_values = []
    let labels = []
    
    d3.json("../api_mun").then(function(data){
        let mun = document.getElementById("munChoice").value
        let state = document.getElementById("stateDrop").value
        let filtered_data = data.filter(d=>d.NOMBRE_MUNICIPIO === mun)
        let filtered_state = data.filter(d=>d.NOMBRE_ENTIDAD === state)
        if(query === "1"){
            d3.select("#pieplot").text("")
            if(service_value==="1"){
                digital_list.forEach(function(list){
                donut_values.push(d3.sum(filtered_data, d=>d[list]))
                })
                digital.forEach(function(d){
                    labels.push(d)
                })
            }else if (service_value === "2"){
                financial_list.forEach(function(list){
                donut_values.push(d3.sum(filtered_data, d=>d[list]))
                })
                finanical_no_POS.forEach(function(d){
                    labels.push(d)
                })
            }else if(service_value === "3"){
                savings_list.forEach(function(list){
                donut_values.push(d3.sum(filtered_data, d=>d[list]))
                })
                savings.forEach(function(d){
                    labels.push(d)
                })
            }else{
                loans_list.forEach(function(list){
                donut_values.push(d3.sum(filtered_data, d=>d[list]))
                })
                loans.forEach(function(d){
                    labels.push(d)
                })
            }
            let digital_data = [{
                values: donut_values,
                labels: labels,
                domain: {column: 0},
                hoverinfo: 'label+value',
                hole: .4,
                type: 'pie',
                marker:{
                    colors: ultimateColors[parseInt(service_value)-1]
                },
            }]
            
            let digital_layout = {
                autosize: true,
                title: '',
                paper_bgcolor: '#eaeaea',
                plot_bgcolor: '#eaeaea',
                font: {
                    family: 'Helvetica, monospace',
                    size: 12},
                annotations: [
                {
                    font: {
                    size: 20
                    },
                    showarrow: false,
                    text: '',
                    x: 0.17,
                    y: 0.5
                }],
                // showlegend: false,
            };
            d3.select("#distributionChart").text(service + ' composition in ' + mun)
            Plotly.newPlot('pieplot', digital_data, digital_layout, config)
        }else{
            d3.select("#pieplot").html("")
            
            let service_choice = document.getElementById("munChoice").value
            let services_values = []
            let service_mun = []
            filtered_state.forEach(function(d){
                service_mun.push(d.NOMBRE_MUNICIPIO)
                services_values.push(d[services_list[service_choice]])
            })
            var trace1 = {
                x: service_mun,
                y: services_values,
                marker: {
                  color: 'rgba(55,128,191,0.6)',
                },
                type: 'bar'
              };

            var data = [trace1]
            var layout = {
                title: '',
                paper_bgcolor: '#eaeaea',
                plot_bgcolor: '#eaeaea',
                font:{
                  family: 'Raleway, sans-serif'
                },
                showlegend: false,
                xaxis: {
                  tickangle: -90,
                  automargin: true
                },
                yaxis: {
                  zeroline: false,
                  gridwidth: 2                  
                },
                bargap :0.05
              };
            d3.select("#distributionChart").text(service_choice + ' service distribution in ' + state)
            Plotly.newPlot('pieplot', data, layout, config)
        }
    })
}

function description(){
    let service = document.getElementById("serviceChoice").value
    d3.select("#Description")
    .html(description_list[service])
}

function serviceChanged(service){
    let value = document.getElementById("queryChoice").value
    
    if(service === "1"){
        digital_map()
    }else if(service === "2"){
        financial_map()
    }else if(service === "3"){
        savings_map()
    }else{
        credits_map()
    }
    description()
    
    if(value === "2"){
        
        queryFill(value)
    }else{
        
    }
    chart()
}


function subqueryFill(){
    chart()
}


function stateChanged(){
    queryFill()
    let service = document.getElementById("serviceChoice").value
    serviceChanged(service)
    description()
    chart()
}

init()
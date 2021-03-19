let y = ['Commercial Branches', 'Development Branches', 'Cooperative Branches', 'Financial Popular Branches', 'Total Branches', 'Correspondents', 'ATM', 'Mobile Points of Sale (MP)', 'MP in business', 'Mobile Banking Contracts', 'Accounts L1', 'Accounts L2', 'Accounts L3', 'Accounts Traditionals', 'Saving Accounts', 'Term Deposits', 'Debit Card', 'Credit Card', 'Mortgage Credit', 'Group Credit', 'Personal Credit', 'Payroll Credit', 'Car Credit', 'Durable Goods Credit', 'MB Transactions', 'ATM Trans']
let x = ['Population', 'Female Pop.','Male Pop.','Active Pop.','Total Households','Radio','TV','PC','Fixed Telephone.','Cellphone','Internet','Pay TV', 'Streaming', 'V. Game Console']
var config = {responsive: true}


let col = data.map(d=>d.columns)

//  Check your filtered movie titles.
let ind = data.map(d=>d.index)


let corr = data.map(d=>d.data)


let  data1 = [
    {
      z: corr[0],
      zmin: -0.10,
      zmax:0.7, 
      x: x,
      y: y,
      type: 'heatmap',
      colorscale: 'Viridis'
    //   hoverongaps: false
    }
  ];
  let layout = {
      title : "",
      xaxis: {
			  tickangle: 30
			},
      font: {
        // family: 'Courier New, monospace',
        size: 12,
        color: 'Black'
      },
      autosize: true,
      margin: {
        l: 200,
        r: 50,
        b: 140,
        t: 50,
        pad: 4
      },
      paper_bgcolor: '#eaeaea',
      plot_bgcolor: '#eaeaea' 
    }
  Plotly.newPlot('heatmap', data1, layout, config);
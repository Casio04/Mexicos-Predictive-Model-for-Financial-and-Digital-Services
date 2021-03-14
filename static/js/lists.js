let digital_list = ['VPH_TV', 'VPH_RADIO', 'VPH_TELEF','VPH_CEL','VPH_STVP','VPH_CVJ','VPH_INTER','VPH_SPMVPI','VPH_PC']
let financial_list = ['Sucursales_BC','Sucursales_BD','Sucursales_Socap','Sucursales_Sofipo','Corresponsales','ATM']
let savings_list = ['Cuentas_T1','Cuentas_T2','Cuentas_T3','Cuentas_Trad','Cuentas_Ah','Dep_plazo','T_debito']
let loans_list = ['T_cred','C_hip','C_grup','Personal','Nomina','Automotriz','ABCD']

let digital =['Television','Radio','Fixed Telephone', 'Cellphone','Paid TV','Videogames','Internet','Streaming services','PC']
let financial = ['Private Banking', 'Development Banking', 'SOCAP', 'SOFIPO', 'Correspondents','ATM','Points of Sale','Establishments with POS', 'Mobile Banking']
let savings = ['Level 1','Level 2','Level 3','Traditional Accounts','Savings','Time Deposits','Debit Cards']
let loans = ['Credit Cards','Mortgage','Group credit','Personal credit','Payroll credit','Automobile','ABCD']
let finanical_no_POS = ['Private Banking', 'Development Banking', 'SOCAP', 'SOFIPO', 'Correspondents','ATM']

let ultimateColors = [
    ['#0F38E7','#E78E0F','#34E70F','#E73D0F','#8F0FE7','#825C25','#EC4AD8','#949394','#D4E448'],
    ['#0F38E7','#E78E0F','#34E70F','#E73D0F','#8F0FE7','#825C25','#EC4AD8','#949394'],
    ['#0F38E7','#E78E0F','#34E70F','#E73D0F','#8F0FE7','#825C25','#D4E448'],
    ['#0F38E7','#E78E0F','#34E70F','#E73D0F','#8F0FE7','#825C25','#EC4AD8']
  ];

let services_list = {
  'Television':'VPH_TV', 'Radio':'VPH_RADIO', 'Fixed Telephone':'VPH_TELEF','Cellphone':'VPH_CEL',
  'Paid TV':'VPH_STVP','Videogames':'VPH_CVJ','Internet':'VPH_INTER','Streaming services':'VPH_SPMVPI','PC':'VPH_PC',
  'Private Banking':'Sucursales_BC','Development Banking':'Sucursales_BD','SOCAP':'Sucursales_Socap','SOFIPO':'Sucursales_Sofipo',
  'Correspondents': 'Corresponsales','ATM':'ATM','Points of Sale':'TPV','Establishments with POS':'Establecimientos_TPV','Mobile Banking':'Contratos_BM',
  'Level 1': 'Cuentas_T1', 'Level 2': 'Cuentas_T2', 'Level 3':'Cuentas_T3', 'Traditional Accounts':'Cuentas_Trad','Savings':'Cuentas_Ah',
  'Time Deposits':'Dep_plazo','Debit Cards':'T_debito','Credit Cards':'T_cred','Mortgage':'C_hip','Group credit':'C_grup',
  'Personal credit':'Personal','Payroll credit':'Nomina','Automobile':'Automotriz','ABCD':'ABCD'
}
let population_list = ["All","Urban","Semi-Urban","Metropolis","Semi-Metropolis","In Transition","Rural"]
let zoom_properties = {
  "Aguascalientes": 8, "Baja California": 6, "Baja California Sur": 6,
  "Campeche":7, "Coahulia de Zaragoza": 7, "Colima": 9, "Chiapas": 7,
  "Chihuahua": 6, "Ciudad de México": 10, "Durango": 7, "Guanajuato": 8,
  "Guerrero": 7, "Hidalgo": 8, "Jalisco": 7, "México": 8, 
  "Michoacán de Ocampo": 8, "Morelos": 9, "Nayarit": 7, "Nuevo León": 7,
  "Oaxaca": 8, "Puebla": 8, "Querétaro": 8, "Quintana Roo": 7, 
  "San Luis Potosí": 7, "Sinaloa": 7, "Sonora": 6, "Tabasco": 8, 
  "Tamaulipas": 7, "Tlaxcala": 10, "Veracruz de Ignacio de la Llave": 7,
  "Yucatán": 8, "Zacatecas":7
}

let description_list = {"1": "<p>Digital inclusion tells us how likely is for a family to have access to electronics and digital services. <br> Overall, the ranking represents an average for all the services included, which are shown on the graphs below. It is very important to mention that most of the families have access to at least one TV and a cellphone, no matter the type of population. <br> Furthermore, only Mexico City achieves a score near 7, which might look good, but it shows the overall sertback the country currently has.</p>",
"2": "<p>Financial services are described as the different types of baking services offered throughout the country, according to the following: <br> <b>Private Banking</b> - the one that we all know.<br> <b>Development banking</b> - Specialized banking targetting certain activities to endure nation's growth. <br> <b>SOCAP</b> - Financial institutions willing to give access on remote communities and rural areas, forming cooperative societies. <br><b>SOFIPO</b> - They offer similar services to private banks, however, they're nonprofit companies willing to help the popular sector. <br><b>Correspondents</b> - Commercial spots authorized by private banking to extend their coverage on specific areas. Very useful for far located places where a bank by itself is way too much for the possible requested services. <br><b>Point of Sale</b> - Refers to wireless or mobile payment terminals. The other services are self- explanatory</p>",
"3": "<p>Savings Accounts refers to the various possibilites customers have to save their money or even invest it. <br><b>Level 1</b> - Low risk accounts, limited to make deposits up to 750 UDIS per account, with a cash limit of 1000 UDIS. On this account, there is no need to identify the account holder. <br><b>Level 2</b> - Accounts with deposits up to 3000 UDIS per month. On this level are also identified the accounts used as government aid in social programs. <br><b>Level 3</b> - Accounts limited to deposits up to 10,000 UDIS per month. <br><b>Traditional account</b> - Requires full authentication from the holder, and it is not limited in any amount.<br><b> Time deposits</b> - Sum of money handled to a financial institution with the purpose of generating a return to the owner.</p>",
"4": "<p>Loans accounts shows all the availble credits citizens can request for. <br><b>Payroll credit</b> - Loan that can be asked to some financial institutions (banks overall) where they monthly payment is 'secured' by withdrawing it from the employee payroll, before he is able to use it. <br><b>Groupal credit</b> - Some financial institutions offer credits to certain groups of people that have specific objectives. For example, a group of entrepreneurs looking to open their first store. <br><b>ABCD</b> - Credits used tyipically to get consumer durables, like a fridge or a blender. The credtis from department stores, credit cards and even automobile credits can be considered in this sector.</p>"}

const API_KEY = "pk.eyJ1Ijoicm9kZ3Vhcm5lcm9zIiwiYSI6ImNrazdrcDJkaTAyZjQybm5zdmlyNWl3bDAifQ.VUdkQ9iFNmXi7MHIoxqYeA"
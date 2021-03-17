import pymongo
from flask import Flask, render_template, jsonify
import json
from bson import json_util
import pickle
import pandas as pd
import numpy as np

app = Flask(__name__)

# Define local or cloud connection
conn = 'mongodb://localhost:27017/'
# conn = "mongodb+srv://BetaTeam:beta@projectcluster.xoh37.mongodb.net/inclusion_financiera?retryWrites=true&w=majority"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/index.html")
def index_2():
    return render_template("index.html")

@app.route("/background.html")
def index3():
    return render_template("background.html")

@app.route("/eduardo.html")
def tableau():
    return render_template("eduardo.html")

@app.route("/state.html")
def mun_view():
    return render_template("state.html")

@app.route("/mLearning.html")
def machine_learning():
    return render_template("mLearning.html")

@app.route("/api_states")
def states():

    client = pymongo.MongoClient(conn)
    db = client.inclusion_financiera    
    estados = db.estados.find()
    
    states_list = []
    for estado in estados:
        states_list.append(estado)
        
    client.close()
    return json.dumps(json.loads(json_util.dumps(states_list)))

@app.route("/api_mun")
def municipalities():
   
    client = pymongo.MongoClient(conn)
    db = client.inclusion_financiera
    municipios = db.municipios.find()
    
    mun_list = []
    for mun in municipios:
        mun_list.append(mun)
    
    client.close()
    return json.dumps(json.loads(json_util.dumps(mun_list)))

@app.route("/api_municipios/<state>")
def coordinates(state):
    
    client = pymongo.MongoClient(conn)
    db = client.inclusion_financiera
    
    municipios = db.municipios_coords.find({"features.properties.NOMBRE_ENTIDAD": state},{'_id': False})
    mun_list = []
    for mun in municipios:
        mun_list.append(mun)
    
    client.close()

    return json.dumps(mun_list)

@app.route('/api_h')
def get_h():

    client = pymongo.MongoClient(conn)
    db = client.inclusion_financiera
    # Store the entire team collection in a list
    periodos = db.historical.find()

    per_list = []
    for per in periodos:
        per_list.append(per)

    client.close()
    # # Return the template with the teams list passed in
    return json.dumps(json.loads(json_util.dumps(per_list)))

@app.route('/api_ML_<state>')
def ML_model(state):
    client = pymongo.MongoClient(conn)
    db = client.inclusion_financiera
    # Store the entire team collection in a list
    model = db.MLmodel.find({"NOMBRE_ENTIDAD": state},{'_id': False})

    m_list = []
    for m in model:
        m_list.append(m)

    client.close()
    # # Return the template with the teams list passed in
    return json.dumps(json.loads(json_util.dumps(m_list)))

@app.route("/creditcard_<v1>_<v2>_<v3>_<v4>_<v5>_<v6>_<v7>")
def credit_card(v1,v2,v3,v4,v5,v6,v7):

    modelload = pickle.load(open('static/ML models/model_credit_cards.pkl','rb'))
    predicted = modelload.predict([[v1,v2,v3,v4,v5,v6,v7]])
    credit_dict = {
        "Predicted":predicted[0][0],
    }
    return json.dumps(credit_dict)

@app.route("/debitcard_<v1>_<v2>_<v3>_<v4>_<v5>_<v6>_<v7>")
def debit_card(v1,v2,v3,v4,v5,v6,v7):
    
    modelload = pickle.load(open('static/ML models/model_debit_cards.pkl','rb'))
    predicted = modelload.predict([[v1,v2,v3,v4,v5,v6,v7]])
    debit_dict = {
        "Predicted":predicted[0][0]
    }
    return json.dumps(debit_dict)

@app.route("/mobilebanking_<v1>_<v2>_<v3>_<v4>_<v5>")
def mobile_banking(v1,v2,v3,v4,v5):

    modelload = pickle.load(open('static/ML models/model_MB_contracts.pkl','rb'))    
    predicted = modelload.predict([[v1,v2,v3,v4,v5]])
    mobile = {
        "Predicted":predicted[0][0]
    }
    return json.dumps(mobile)

@app.route("/PC_<v1>_<v2>_<v3>_<v4>_<v5>_<v6>")
def PC(v1,v2,v3,v4,v5,v6):

    modelload = pickle.load(open('static/ML models/model_PC.pkl','rb'))    
    predicted = modelload.predict([[v1,v2,v3,v4,v5,v6]])
    computer = {
        "Predicted":predicted[0][0],
    }
    return json.dumps(computer)

@app.route("/streaming_<v1>_<v2>_<v3>_<v4>_<v5>_<v6>")
def streaming(v1,v2,v3,v4,v5,v6):

    modelload = pickle.load(open('static/ML models/model_Streaming.pkl','rb'))    
    predicted = modelload.predict([[v1,v2,v3,v4,v5,v6]])
    computer = {
        "Predicted":predicted[0][0],
    }
    return json.dumps(computer)

# Set route



if __name__=="__main__":
    app.debug = True
    app.run()
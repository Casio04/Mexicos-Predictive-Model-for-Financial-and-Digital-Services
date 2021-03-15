import pymongo
from flask import Flask, render_template, jsonify
import json
from bson import json_util
import pickle
import pandas as pd
import numpy as np

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/index.html")
def index_2():
    return render_template("index.html")

@app.route("/carlos.html")
def mun_view():
    return render_template("carlos.html")

@app.route("/api_states")
def states():
   
    conn = 'mongodb://localhost:27017/'
    client = pymongo.MongoClient(conn)
    db = client.inclusion_financiera
    estados = db.estados.find()
    # print(estados)
    states_list = []
    for estado in estados:
        states_list.append(estado)
    # json_sates = json.dumps(list([i[0] for i in states_list]))
    # client.close()
    return json.dumps(json.loads(json_util.dumps(states_list)))

@app.route("/api_mun")
def municipalities():
   
    conn = 'mongodb://localhost:27017/'
    client = pymongo.MongoClient(conn)
    db = client.inclusion_financiera
    municipios = db.municipios.find()
    # print(estados)
    mun_list = []
    for mun in municipios:
        mun_list.append(mun)
    # json_sates = json.dumps(list([i[0] for i in states_list]))
    # client.close()
    return json.dumps(json.loads(json_util.dumps(mun_list)))

@app.route("/api_municipios/<state>")
def coordinates(state):
    conn = 'mongodb://localhost:27017/'
    client = pymongo.MongoClient(conn)
    db = client.inclusion_financiera
    # db = client.inclusion_digital
    municipios = db.municipios_coords.find({"features.properties.NOMBRE_ENTIDAD": state},{'_id': False})
    mun_list = []
    for mun in municipios:
        mun_list.append(mun)
    
    client.close()

    # json_result = json.dumps(list([i[0] for i in mun_list]))
    return json.dumps(mun_list)

@app.route("/rodrigo.html")
def machine_learning():
    return render_template("rodrigo.html")

@app.route("/creditcard_<v1>_<v2>_<v3>_<v4>_<v5>_<v6>_<v7>")
def credit_card(v1,v2,v3,v4,v5,v6,v7):

    modelload = pickle.load(open('static/ML models/model_credit_cards.pkl','rb'))
    predicted = modelload.predict([[v1,v2,v3,v4,v5,v6,v7]])
    credit_dict = {
        "Predicted":predicted[0][0],
    }
    return json.dumps(credit_dict)

@app.route("/debitcard__<v1>_<v2>_<v3>_<v4>_<v5>_<v6>_<v7>")
def debit_card(v1,v2,v3,v4,v5,v6,v7):
    
    modelload = pickle.load(open('static/ML models/model_debit_cards.pkl','rb'))
    predicted = modelload.predict([[v1,v2,v3,v4,v5,v6,v7]])
    debit_dict = {
        "Predicted":predicted[0][0],
    }
    return json.dumps(debit_dict)

@app.route("/mobilebanking_<v1>_<v2>_<v3>_<v4>_<v5>")
def mobile_banking(v1,v2,v3,v4,v5):

    modelload = pickle.load(open('static/ML models/model_MB_contracts.pkl','rb'))    
    predicted = modelload.predict([[v1,v2,v3,v4,v5]])
    mobile = {
        "Predicted":predicted[0][0],
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


if __name__=="__main__":
    app.debug = True
    app.run()
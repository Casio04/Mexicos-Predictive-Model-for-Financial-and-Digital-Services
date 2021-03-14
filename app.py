import pymongo
from flask import Flask, render_template, jsonify
import json
from bson import json_util

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

if __name__=="__main__":
    app.debug = True
    app.run()
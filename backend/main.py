from flask import Flask, json, request, session
from flask_session import Session
from flask_cors import CORS, cross_origin
from fdtd_test import test_fdtd, processJson
from munch import DefaultMunch

api = Flask(__name__)
api.config["SESSION_PERMANENT"] = False
api.config["SESSION_TYPE"] = "filesystem"
api.config['CORS_HEADERS'] = 'Content-Type'
Session(api)
cors = CORS(api)

@api.route('/gettest', methods=['POST'])
@cross_origin()
def getTest():
    inJson = request.json
    #return json.dumps(test_fdtd())
    res = processJson(DefaultMunch.fromDict(inJson))
    return json.dumps(res)
#api.run()
if __name__ == "__main__":
    api.run(host='0.0.0.0')
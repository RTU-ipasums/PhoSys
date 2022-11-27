from flask import Flask, json, request
from flask_cors import CORS, cross_origin
from fdtd_test import test_fdtd, processJson

api = Flask(__name__)
api.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(api)

@api.route('/api/gettest', methods=['POST'])
@cross_origin()
def getTest():
    inJson = request.json
    #return json.dumps(test_fdtd())
    res = processJson(inJson)
    return json.dumps(res)
api.run()
#if __name__ == "__main__":
    #from waitress import serve
    #serve(api, host="127.0.0.1", port=5000)
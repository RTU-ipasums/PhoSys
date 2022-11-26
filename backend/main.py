from flask import Flask, json
from flask_cors import CORS, cross_origin
from fdtd_test import test_fdtd

api = Flask(__name__)
api.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(api)

@api.route('/gettest', methods=['GET'])
@cross_origin()
def getTest():
    return json.dumps(test_fdtd())

if __name__ == '__main__':
    api.run()
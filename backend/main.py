from gevent import monkey
monkey.patch_all()

from flask import Flask, json, request, session
from flask_session import Session
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS, cross_origin
from fdtd_test import test_fdtd, processJson
from munch import DefaultMunch

api = Flask(__name__)
if api.debug:
    from werkzeug.middleware.profiler import ProfilerMiddleware
    #api.wsgi_app = ProfilerMiddleware(api.wsgi_app, sort_by=('tottime',), restrictions=(5,),)
    
api.config["SESSION_PERMANENT"] = False
api.config["SESSION_TYPE"] = "filesystem"
api.config['CORS_HEADERS'] = 'Content-Type'
Session(api)
socketio = SocketIO(api, cors_allowed_origins='*')
cors = CORS(api)

@socketio.on('sim_data')
@cross_origin()
def handl_sim(inJson):
    res = processJson(DefaultMunch.fromDict(inJson))
    emit('canvas', res)
    return 'OK'

@api.route('/gettest', methods=['POST'])
@cross_origin()
def getTest():
    inJson = request.json
    res = processJson(DefaultMunch.fromDict(inJson))
    #return json.dumps(test_fdtd())
    return json.dumps(res)
#api.run()
if __name__ == "__main__":
    api.run(host='0.0.0.0')
import gevent
from gevent import monkey
monkey.patch_all()

from flask import Flask, json, request, session, copy_current_request_context
from flask_session import Session
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS, cross_origin
from fdtd_test import test_fdtd, processJson, stepGrid
import fdtd_test
from munch import DefaultMunch

api = Flask(__name__)
if api.debug:
    fdtd_test.debug = True
    from werkzeug.middleware.profiler import ProfilerMiddleware
    #api.wsgi_app = ProfilerMiddleware(api.wsgi_app, sort_by=('tottime',), restrictions=(5,),)
else:
    fdtd_test.debug = False
    
api.config["SESSION_PERMANENT"] = False
api.config["SESSION_TYPE"] = "filesystem"
api.config['CORS_HEADERS'] = 'Content-Type'
Session(api)
socketio = SocketIO(api, cors_allowed_origins='*')
cors = CORS(api)

@socketio.on('sim_data')
@cross_origin()
def handl_sim(inJson):
    views, grid, count = processJson(DefaultMunch.fromDict(inJson))
    emit('canvas', {"views":views})
    print(views)
    session['grid'] = grid

    generate_frames(count)
    return 'OK'

@socketio.on('generate_frames')
@cross_origin()
def generate_frames(count):
    grid = session.get('grid')

    @copy_current_request_context
    def sendStep():
        for i in range(count):
            views = stepGrid(grid)# TODO
            emit('frame', {"views":views})
            gevent.sleep(0.0000001)# idk why

    gevent.spawn(sendStep)
    session['grid'] = grid
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
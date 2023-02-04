from flask import Flask, json, request, session
from flask_session import Session
from flask_sse import sse
from flask_cors import CORS, cross_origin
from fdtd_test import test_fdtd, processJson
from munch import DefaultMunch

api = Flask(__name__)
api.register_blueprint(sse, url_prefix='/stream')
api.config["REDIS_URL"] = "redis://cache:6379"
if api.debug:
    api.config["REDIS_URL"] = "redis://localhost:6379"
    from werkzeug.middleware.profiler import ProfilerMiddleware
    #api.wsgi_app = ProfilerMiddleware(api.wsgi_app, sort_by=('tottime',), restrictions=(5,),)
    
api.config["SESSION_PERMANENT"] = False
api.config["SESSION_TYPE"] = "filesystem"
api.config['CORS_HEADERS'] = 'Content-Type'
Session(api)
cors = CORS(api)

@api.route('/resp')
@cross_origin()
def resp():
    sse.publish({"message": "Hello!"}, type='greeting')
    return "200"

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
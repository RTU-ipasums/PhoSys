<h1 align="center">
  <br>
  <a><img src="https://user-images.githubusercontent.com/47260097/222973916-7ca2e9d3-a7bd-4917-8164-0fdc84df400b.png" alt="Logo" width="100%"/></a>
  <br>
  Phosys
  <br>
  <img src="https://img.shields.io/github/actions/workflow/status/RTU-ipasums/PhoSys/testing-linting.yml"/>
</h1>

<h4 align="center"> A simple to use, web-based photonics simulator. Based on <a href="https://github.com/flaport">flaport's<a/> <a href="https://github.com/flaport/fdtd">fdtd<a/> library.</h4>

## How To Use
A demo page is currently hosted on [phosys.lv](https://phosys.lv)

## How to host
To run this application, you'll need [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) and Python 3.10+ installed on your computer.
Optionally you can use Conda to create an isolated environment with the commmand `conda create -n phosys python=3.3.0` and activate it each time with:
```
conda activate
conda activate phosys
```

After cloning the repository open two terminals and run:
```
cd frontend
npm i
npm run dev
```
And:
```
cd backend
pip install -r requirements.txt
flask --app main.py --debug run
```
(`npm i` and `pip install` are only required to update/install)

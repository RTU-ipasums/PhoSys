<h1 align="center">
  <br>
  <a><img src="https://user-images.githubusercontent.com/47260097/222973916-7ca2e9d3-a7bd-4917-8164-0fdc84df400b.png" alt="Logo" width="100%"/></a>
  <br>
  Phosys
  <br>
</h1>

<h4 align="center"> A simple to use, web-based photonics simulator. Based on <a href="https://github.com/flaport">flaport's<a/> <a href="https://github.com/flaport/fdtd">fdtd<a/> library.</h4>

# Motivation

# How To Use
A demo page is currently hosted on [phosys.lv](https://phosys.lv)

# How to host
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

# Technical description

## Directory structure
The directory structure is very simple. All frontend code is in the "frontend" directory, all backend code is in the "backend" directory.

## UI Design
splitplanes/
konva/
mpld3/
vue/
![UI overview](https://user-images.githubusercontent.com/47260097/242680617-3a3ae81e-4771-4708-8262-22a1ea9c170f.png)

The PhoSys user interface consists of 4 main parts:
  * [Toolbar](#toolbar)
  * [Properties panel](#properties-panel)
  * [Canvas](#canvas)
  * [Simulation result panel](#simulation-result-panel)

The interface was made with the [VueJS](https://vuejs.org/) JavaScript framework and the Vue [Splitpanes](https://antoniandre.github.io/splitpanes/) component, which were used to create a responsive and modern UI with user resizable panels. Additionally the [Font Awesome](https://fontawesome.com/) icon library was used for some icons.

The UI is split up into 5 Vue components. Furthermore, there is a Vue component for each type of object in the "shapes" subdirectory.

  * App.vue - The main component that has the toolbar and all other components
  * Draw.vue - The canvas component, this component also uses shape components from the "shapes" subdirectory
  * Properties.vue - The properties panel component
  * Result.vue - The component responsible for showing the result of the simulation
  * SeekBar.vue - The component that has all of the controls for simulation playback

### Simulation JSON file structure

## Toolbar
The toolbar contains useful icons for interacting with the canvas and simulation
|Name|Icon|Description|
| ----------- | ----------- | ------- |
|Save icon|![Save icon](https://user-images.githubusercontent.com/47260097/242689299-983d4c0e-eee7-465b-aaed-611c875b2f06.png)|Opens a diaglog to save the current canvas objects in a json file to a local directory for later importing
|Open icon|![Save icon](https://user-images.githubusercontent.com/47260097/242695808-ce8223f5-8fd9-4b8b-9116-d8de09c0bb9a.png)|Opens dialog to load simulation saved with the save icon
|Rectangle object|![Rectangle object](https://user-images.githubusercontent.com/47260097/242697239-baa9d372-ca79-4761-bc75-f2cef457d596.png)| Adds a rectangular object to the canvas
|Point source light|![Pointsource object](https://user-images.githubusercontent.com/47260097/242698558-5d3787ea-684d-4112-9d56-84f09d0bd25e.png)| Adds a point source object to the canvas
|Line source light|![Linesource object](https://user-images.githubusercontent.com/47260097/242699052-40405256-b446-4196-b256-0aa6c75eb4ea.png)| Adds a line source object to the canvas
|Launch|![Launch icon](https://user-images.githubusercontent.com/47260097/242705768-16eb77bd-590a-44d8-af62-92733ebd2db3.png)| Sends a request to the server to start the FDTD simulation with the objects added to the canvas

## Properties panel

## Canvas
This is the most important part of the PhoSys user interface. The simulation canvas is used for adding objects to the simulation.
## Simulation result panel

## Backend design

# Simulation examples (screenshots and json files)

# Limitations and future plans

# License
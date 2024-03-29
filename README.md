<h1 align="center">
  <br>
  <a><img src="https://user-images.githubusercontent.com/47260097/222973916-7ca2e9d3-a7bd-4917-8164-0fdc84df400b.png" alt="Logo" width="100%"/></a>
  <br>
  PhoSys
  <br>
  <img src="https://img.shields.io/github/actions/workflow/status/RTU-ipasums/PhoSys/testing-linting.yml"/>
</h1>

<h4 align="center"> A simple to use, web-based electromagnetics simulator. Based on <a href="https://github.com/flaport">Flaport's<a/> <a href="https://github.com/flaport/fdtd">fdtd<a/> library.</h4>

PhoSys is an open-source, web-based FDTD electromagnetic wave simulator. The project's primary objective is to assist teachers, students, and individuals interested in studying photonics or electromagnetic waves by offering a visualization tool for various electromagnetic phenomena in a simple and intuitive manner. Although the functionality is currently limited due to being in the early stages of development, you can still create visually interesting simulations using the three fundamental objects: point sources, line sources, and rectangle objects.

# Motivation

We decided to create PhoSys because one day, during a physics class about electromagnetic waves, our team had a discussion and couldn't agree on a certain question. We wanted to resolve this question by simulating the problem, but we soon realized that there weren't any easy-to-use tools available. The simulation tools we found were either too complicated and expensive, like [Ansys Lumerical](https://www.ansys.com/products/photonics/fdtd), or too basic and didn't allow us to check what we wanted, like the [simulations provided by the University of Colorado Boulder](https://phet.colorado.edu/).

# How to use
**A demo page is currently hosted on [phosys.lv](https://phosys.lv). No setup required.** 

Although mobile use is supported, it is highly recommended to use a desktop device.

# How to host
To run this application, you'll need [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) and Python 3.10+ installed on your computer.
Optionally you can use Conda to create an isolated environment with the command `conda create -n phosys python=3.3.0` and activate it each time with:
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
The directory structure is very simple. All frontend code is in the `frontend` directory, all backend code is in the `backend` directory.

## UI Design
![UI overview](https://user-images.githubusercontent.com/47260097/242680617-3a3ae81e-4771-4708-8262-22a1ea9c170f.png)

The PhoSys user interface consists of 4 main parts:
  * [Toolbar](#toolbar)
  * [Properties panel](#properties-panel)
  * [Canvas](#canvas)
  * [Simulation result panel](#simulation-result-panel)

The interface was made with the [VueJS](https://vuejs.org/) JavaScript framework and the Vue [Splitpanes](https://antoniandre.github.io/splitpanes/) component, which were used to create a responsive and modern UI with user resizable panels. Additionally, the [Font Awesome](https://fontawesome.com/) icon library was used for some icons.

The UI is split up into 5 Vue components. Furthermore, there is a Vue component for each type of object in the `shapes` subdirectory.

  * `App.vue` - The main component that has the toolbar and all other components
  * `Draw.vue` - The canvas component, this component also uses shape components from the `shapes` subdirectory
  * `Properties.vue` - The properties panel component
  * `Result.vue` - The component responsible for showing the result of the simulation
  * `SeekBar.vue` - The component that has all of the controls for simulation playback

## Toolbar
The toolbar contains useful icons for interacting with the canvas and simulation.
|Name|Icon|Description|
| ----------- | ----------- | ------- |
|Save icon|![Save icon](https://user-images.githubusercontent.com/47260097/242689299-983d4c0e-eee7-465b-aaed-611c875b2f06.png)|Opens a dialog to save the current canvas objects in a JSON file to a local directory for later importing
|Open icon|![Save icon](https://user-images.githubusercontent.com/47260097/242695808-ce8223f5-8fd9-4b8b-9116-d8de09c0bb9a.png)|Opens dialog to load simulation saved with the save icon
|Rectangle object|![Rectangle object](https://user-images.githubusercontent.com/47260097/242697239-baa9d372-ca79-4761-bc75-f2cef457d596.png)| Adds a rectangular object to the canvas
|Point source light|![Pointsource object](https://user-images.githubusercontent.com/47260097/242698558-5d3787ea-684d-4112-9d56-84f09d0bd25e.png)| Adds a point source object to the canvas
|Line source light|![Linesource object](https://user-images.githubusercontent.com/47260097/242699052-40405256-b446-4196-b256-0aa6c75eb4ea.png)| Adds a line source object to the canvas
|Launch|![Launch icon](https://user-images.githubusercontent.com/47260097/242705768-16eb77bd-590a-44d8-af62-92733ebd2db3.png)| Sends a request to the server to start the FDTD simulation with the objects added to the canvas

## Properties panel
The properties panel lists all of the properties of the selected object or global simulation properties if a single object isn't selected. It also has additional information about the object, such as its position and name.

Here is a list of all the properties that are currently editable by the user:
### Global properties
  * Permittivity
  * Permeability
### Rectangle object
  * Permittivity
  * Conductivity
### Point source
  * Wavelength
  * Amplitude
  * Phase shift
### Line source
  * Wavelength
  * Amplitude
  * Phase shift

## Canvas
This is the most important part of the PhoSys user interface. The simulation canvas is used for adding objects to the simulation, all objects placed in the grey canvas rectangle will be simulated.

Here is a list of features the canvas editor currently supports:
  * Scene navigation (pan and zoom with left-click and scroll wheel)
  * Multi-touch zooming on mobile
  * Object adding and deleting with <kbd>Del</kbd>
  * Multi-object selection while holding <kbd>⇧ Shift</kbd>
  * Object transformation (moving, scaling and rotating)
  * Incremental object moving with arrow keys
  * Rotation snapping while holding <kbd>Ctrl</kbd>
  * Object copy/paste with <kbd>Ctrl</kbd> + <kbd>C</kbd> and <kbd>Ctrl</kbd> + <kbd>V</kbd>
  
PhoSys uses the [Konva.js](https://konvajs.org/) JavaScript library to draw objects to a canvas. Konva additionally provides an easy way of adding object transformation control, but all other features had to be added on top.

### Object data storage
All information necessary to draw and simulate an object is stored in a JavaScript object called `data` defined in the `data.js` file. This object also contains information about global simulation properties.
Whenever a shape icon in the toolbar is clicked, an object from the `defaultObjects.js` file is added to the `shapes` array in the `data` object. The `Draw.vue` component passes shape properties from the `shapes` array to their respective shape components. Each of these components update their respective properties after they have been transformed in the Konva canvas to ensure the data accurately represents what is being shown on the canvas.

All shapes have a property `name` that allows them to be uniquely identified in the canvas. Each shape also stores information about their properties, which gets displayed in the properties panel.

Storing the information about objects in this centralized way allows for easy loading/saving of canvas objects and a simple way to send object information to the server without including any unnecessary data.

## Simulation result panel

This panel is used for displaying the result of the simulation received from the server.

### Simulation result
The client receives a matplotlib graph of the result, which gets converted to HTML with the [mpld3](https://mpld3.github.io/) library. The result canvas supports zooming and panning. The frames of the result of the simulation are saved in a local array.
### Simulation playback controls

![Playback controls](https://user-images.githubusercontent.com/47260097/242866407-41118bca-abd9-46ee-8c6f-572d3b040b70.png)

1. Current frame number
2. Simulation playback framerate (experimental)
3. Playback controls. From left-to-right: 
    * Go to beginning
    * Previous frame
    * Play/pause
    * Next frame
    * Go to end
4. Seek bar. Used for scrubbing through the simulation. Because the simulation generates sequentially, you can only seek to already generated frames
5. Final frame number. Determines the final frame to which the simulation will generate. This can be set manually or by pressing play again after the simulation reaches the final frame, in which case it will keep generating forever

## Backend API design
The backend uses the [Flask](https://flask.palletsprojects.com) python web framework and the [Socket.io](https://socket.io) library to make an API that continuously sends data to the client with the WebSocket API. Additionally, [uWSGI](https://uwsgi-docs.readthedocs.io/en/latest/) is used to serve this API and [nginx](https://www.nginx.com/) is used for routing. The whole application is containerized with [Docker](https://docs.docker.com) and [Docker compose](https://docs.docker.com/compose/). The API is hosted on [Cloudflare](https://www.cloudflare.com/).

When the server receives the JSON object with the information about placement of objects, it parses this data and starts the FDTD simulation. As mentioned before the server uses an electromagnetic FDTD simulation based on [Flaport's](https://github.com/flaport) [fdtd](https://github.com/flaport/fdtd) library. More information on how the simulation works is available on the library's GitHub page. 

The simulation generates a [matplotlib](https://matplotlib.org/) graph that contains representations of scene objects and sends it to the client. When the client sends a socket message to generate a certain number of frames, the server continuously starts sending the results of the electromagnetic simulation as Base64-encoded images.

# Simulation examples
## **Double slit experiment**
[JSON file](/examples/doubleslit.json)

![Double slit](https://user-images.githubusercontent.com/47260097/243102886-a5eb21ec-2645-436e-9fde-5df3d68e50d2.png)

## **Double double slit experiment**
[JSON file](/examples/doubledoubleslit.json)

![Double double slit](https://user-images.githubusercontent.com/47260097/243102982-bb79c46d-66c4-425d-bd9f-d0410f4fff27.png)

## **Reflection**
[JSON file](/examples/lightbounce.json)

![Reflection](https://user-images.githubusercontent.com/47260097/243102922-ddcb5790-0189-419c-9ed8-5f89d3627994.png)

## **Fiber optics**
[JSON file](/examples/wire.json)

![Fiber optics](https://user-images.githubusercontent.com/47260097/243102962-143c83f7-d0ab-46e8-a51a-96ac0ffbb6e8.png)

## **Phased array**
[JSON file](/examples/phased_radar7.json)

![Phased array](https://user-images.githubusercontent.com/47260097/243102995-eba11928-7ac5-4fa7-bf7d-0196929d9df7.png)

# Limitations and future plans

PhoSys is currently in development, so bugs and other issues are to be expected.
Known bugs:
 * Placing objects outside of the grey canvas box will give errors
 * Simulation result playback is sometimes unstable
 * Placing objects on top of each other sometimes causes problems

Some of the features we plan to add in the future:
 * More advanced shapes (polygons and curved surfaces, so lenses could be simulated) 
 * More precise control over object positioning, ability to set defined size and position
 * Result exporting to mp4
 * Setting a pulse to source objects
 * Signal detectors
 * Unit of measurement selection for properties
 * Improved UI with windowing system
 * Ability to change simulation resolution/canvas size
 * Ability to run the simulation locally with WASM and WebGPU
 * More visualization tools
 * Ability to hide objects in the results panel

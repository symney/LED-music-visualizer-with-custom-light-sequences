# LED Visualizer
<br>This is a python webserver that allows you to control a sequence of led lights with custom commands all from your phone. Unlike store bought versions of typical LED lights, you actually have control of every led in the strip and each light can change color on a full range of RGB. While the alexa skill is private, if published, the lights server can accept alexa commands (visible in the alexa demo)!<br>
<br>
The coolest part about this project however is that it can create light sequences based off the waveform of a song<br>
Project is a work in progress.



<h1>Working Features</h1>
* Changing the color of all the lights at once (FULL RGB)<br>
* Changing the color of specific lights of choice<br>
* Saving and presetting colors<br>
* Creating a visual representation of the volume spikes within the song<br>

<h1>Non Working features</h1>
* Making the music visualization button more user friendly<br>
* Making the music visualization represent frequecy, notes, instruments, etc <br>
* Creating preset patterns instead of just colors including gradients and basic multi color sequences<br>
* Optimizing the music visualization aspect of the project to work on the raspberry pi's limited hardware<br>
* making the Alexa skill widely available<br>

<h1> Video Demo's</h1>
Alexa Demo: https://www.youtube.com/watch?v=FkUgFsIhVAY<br>
PIN 18 Light Visualization demo: https://www.youtube.com/watch?v=fJEWPVKAbS4<br>
Web App Demo: https://www.youtube.com/watch?v=6mnmuUjLy4Y<br>

<h1> How it works</h1>
A web server is created on the raspberry pi that displays the dashboard via a Flask Server in Python. Then by sending get requests and post requests respectiely, you can change the color,open the music visualizer, and save colors. 

<h1> Installation</h1>
* Create an account with ngrok first to generate your auth token <br>
* Clone the repository onto the linux machine<br>
* run the installation script in the installation scripts folder (do not run the ngrok one)<br>
*<br>
*<br>
*<br>
*<br>
*<br>
*<br>




# LED Visualizer
<br>This is a python webserver that allows you to control a sequence of led lights with custom commands all from your phone. Unlike store bought versions of typical LED lights, you actually have control of every led in the strip and each light can change color on a full range of RGB. While the alexa skill is private, if published, the lights server can accept alexa commands (visible in the alexa demo)!<br>
<br>
The coolest part about this project however is that it can create light sequences based off the waveform of a song<br>
Project is a work in progress.

<h1> Video Demo's</h1>
Alexa Demo: https://www.youtube.com/watch?v=FkUgFsIhVAY<br>
PIN 18 Light Visualization demo: https://www.youtube.com/watch?v=fJEWPVKAbS4<br>
Web App Demo: https://www.youtube.com/watch?v=6mnmuUjLy4Y<br>

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

<h1> How it works</h1>
A web server is created on the raspberry pi that displays the dashboard via a Flask Server in Python. Then by sending get requests and post requests respectiely, you can change the color,open the music visualizer, and save colors. 

<h1> What you will need</h1>
* A raspberry pi (preferably 4 works on 3 but can have slight performance issues with the songs if not using the song provided, has not been tested on any lower spec) <br><br>
* WS2812B lights<br>
* A power supply (at max brightness each light can out put .1 amps and multiply that by how many lights you have. For example I have 150 lights on mine which would be a max output of 15amps (this is lower for lower brightnesses) and my power supply is rated for 20amps also the GPIO pins out put 3.3 volts and the lights are used to 5v. Other projects include a level shifter to fix this issue but i never ended up needing one to make the project work.<br><br>
* optional an AC power cord to connect to the power supply (some power supplies do not come with an ac adapter and you have to make one. worst case scenario cut an ac power cord and connect the white wire to power and the black one to ground<br>

<h1> Installation</h1>
* Create an account with ngrok first to generate your auth token <br>
* Clone the repository onto the linux machine<br>
* run the all_install.sh script in the installation scripts folder (do not run the ngrok one)<br>
* change the directory to the python folder and run the init_db.py file<br>
* switch back to the previous directory and run sudo ./start.sh<br>
* copy the ngrok link and paste in your browser to access (the site was built for mobile so make sure to set developer settings in the browser to mobile view or copy link into mobile phone<br>

<h1> Circuit Diagram and instructions</h1>
<img src="https://user-images.githubusercontent.com/53664279/225862662-df604721-6674-43b0-b8c1-95ca2c320a85.png">
<br>
*** Where the blue square are the lights the psu is the power supply and the green wire is the data wire from the lights and rpi is the raspberry pi***<br>
1) connect the green wire of the lights to GPIO 21 (for fun connect it to GPIO 18)<br>
2) connect ground of the pi and ground of the lights to the ground of the power supply (you need common grounds for this to work<br>
3) connect the power of the lights to the power of the power supply<br>

<h1>Usage Notes about pin 18</h1>
So pin 18 is used for clock frequency signals or something really specifc like that and to get it to work properly you have to disable sound (I think its like and external speaker output). However, if you connect the data pin to pin 18 without disabling sound, change the color of the lights atleast once, and then play music on the raspberry pi, then for some reason the signal of the lights matches the signal of the music being output onto the pin and a really cool light show appears. However, ONCE YOU PLAY MUSIC ON THE DEVICE WHILE CONNECTED TO PIN 18 YOU WILL NO LONGER BE ABLE TO CHANGE THE COLOR OF THE LIGHTS IF YOU DO IT WONT CHANGE TO THE PROPER COLOR AND PLAYING MUSIC AFTER THIS ATTEMPT TO CHANGE THE LIGHTS AGAIN WILL EITHER RESULT IN NO SOUND OUTPUT AND ERRORS OR STATIC.THE DEVICE MUST BE RESTARTED. Any help in solving this issue without a restart and keeping the light show would be great :)


<h1>Usage Notes about headless raspberry pi install</h1>
***I definetly had some trouble with a headless install so ill give a little psuedo tutorial on it here***<br>
* use the raspberry pi installer to install the OS (MAKE SURE YOU ENABLE SSH in the advanced settings)<br><br>
* Next make sure to enable ICS on your HOME machine and to make it run on start up (internet connectivity settings, this enables you to share your internet connection to the raspberry pi with an ethernet cable, you can google this its not that hard)<br><br>
* connect to your raspberry pi with a usb to ethernet adapter and connect an ethernet cord to your computer<br><br>
* ssh into the pi with ssh@pi.raspberrypi.local (this is the pi's host name you can also replace it with the ip but in my experience this will be the easiest way to connect)<br><br>
* the default password should be raspberry for the pi account and you should be in<br><br>
* if your raspberry pi still has no internet restart the ics service on windows it can say its running but not work properly. Restarting it always fixes this issue<br><br><br>
* side note if you have access to your internet routers admin portal,you can confgure the raspberry pi to have wifi set up on it in the os installer. Then find the local ip address on your admin portal the ssh pi@*local address*



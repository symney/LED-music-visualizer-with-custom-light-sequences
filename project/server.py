from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import time
import numpy as np
import RPi.GPIO as GPIO
import redis
import random

import pyaudio
import wave
import time
import sys

#redis setup plus stop function for lights
r = redis.Redis()
r.set('in', "False")
r.set('out', "False")
def stop():
    print("running stop")
    if str(r.get("out"))=="b'True'":
        r.set("out","False")
        while str(r.get("in"))=="b'True'":
            pass
        r.set("out","False")
    print("ending stop")

#Raspberry pi board setup
gpio_pin=10
GPIO.setmode(GPIO.BCM)
GPIO.setup(gpio_pin, GPIO.IN,pull_up_down=GPIO.PUD_UP)
GPIO.setup(gpio_pin, GPIO.OUT)
GPIO.output(gpio_pin,0)
def getState():
    if GPIO.input(gpio_pin):
        return True
    else:
        return False

# LED strip configuration:

import neopixel
import board
p1=None
LED_COUNT   = 150     # Number of LED pixels.
LED_PIN     = board.D18    # GPIO pin
LED_BRIGHTNESS = 1  # LED brightness
LED_ORDER = neopixel.GRB # order of LED colours. May also be RGB, GRBW, or RGBW
proc=None

# Create NeoPixel object with appropriate configuration.
strip="pop"
strip = neopixel.NeoPixel(LED_PIN, LED_COUNT, brightness = LED_BRIGHTNESS, auto_write=False, pixel_order = LED_ORDER)

#Schema Setups
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)

class Sets(db.Model):
    name= db.Column(db.String(200), nullable=False)
    types= db.Column(db.String(200), nullable=False)
    desc= db.Column(db.String(1000), nullable=False)
    values=db.Column(db.String(1000), nullable=False,primary_key=True)
    def __repr__(self):
        return '<Task %r>' % self.name

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r


@app.route('/')
def index():
    presets = Sets.query.all()
    presets.reverse()
    if len(presets)==0:
        presets = None
    

    return render_template('picker.html',final={"state":getState(),"presets":presets,"count":LED_COUNT})

@app.route('/state')
def state():
    GPIO.output(gpio_pin,not getState())
    return "Success"
@app.route('/set')
def color():
    stop()
    types=""
    if request.args["types"]=="color":
        arr=request.args["values"].split(" ")
        print(arr)
        color_set=[int(arr[0]),int(arr[1]),int(arr[2])]
        if "start" in request.args:
            start=int(request.args["start"])-1
            stops=int(request.args["stop"])
            for led in range(start,stops):
                strip[led]=color_set
        else:
            strip.fill(color_set)
        strip.show()
    elif request.args["types"]=="grad":
        pass
    elif request.args["types"]=="patt":
        pass
    elif request.args["types"]=="link":
        pass
    elif request.args["types"]=="multi":
        pass
    
    return redirect("/")

@app.route('/stop')
def solostop():
    stop()
    return "Everything Stopped"
@app.route("/music")
def music():
    stop()
    r.set('out', "True")
    #'{}.wav'.format(catalog[random.randint(0,4)])
    wf = wave.open("letgo.wav", 'rb')

    # instantiate PyAudio (1)
    p = pyaudio.PyAudio()

    # define callback (2)
    def callback(in_data, frame_count, time_info, status):
        data = wf.readframes(frame_count)
        byte=int(data[0])
        #print(int(data[0]))
        print(r.get('out'))
        if not str(r.get('out'))=="b'True'":
            print("aborted")
            return (data, pyaudio.paAbort)
        strip.fill([0,0,0])
        color_set=[255,0,0]
        vol=int((byte*10)/255)
        for led in range(0,vol):
            strip[led]=color_set
        #strip.show()

            
        return (data, pyaudio.paContinue)

    # open stream using callback (3)
    stream = p.open(format=p.get_format_from_width(wf.getsampwidth()),
                    channels=wf.getnchannels(),
                    rate=wf.getframerate(),
                    output=True,
                    stream_callback=callback)

    # start the stream (4)
    stream.start_stream()
    return "success?"

    # wait for stream to finish (5)
    while stream.is_active():
        pass


    # stop stream (6)
    stream.stop_stream()
    stream.close()
    wf.close()

    # close PyAudio (7)
    p.terminate()

@app.route('/superfade')
def superfades():
    stop()
    values=[255,0,0]
    idx=1
    it=1
    r.set('in', "True")
    r.set('out', "True")
    sep=0
    sep_it=1
    while str(r.get('out'))=="b'True'":
        if values[idx]>254:
            it=-1
        else:
            it=1
        num=0
        while num <255 and num >=0 and str(r.get('out'))=="b'True'":
            print(num)
            values[idx]+=it
            print(values)
            strip.fill(values)
            if sep>LED_COUNT:
                sep_it=-1
            elif sep<0:
                sep_it=1
            sep+=sep_it
            strip[(sep)%LED_COUNT]=(255,255,255)
            strip.show()
            time.sleep(.005)
            num+=1
        idx-=1
        if idx<0:
            idx=2
    r.set('in',"False")
    return redirect("/")

@app.route('/save',methods=['POST'])
def save():
    name = request.form['name']
    desc = request.form['desc']
    red = request.form['red']
    green = request.form['green']
    blue = request.form['blue']
    types=request.form['types']
    values=red+" "+green+" "+blue
    color = Sets(name=name,desc=desc,types=types,values=values)

    
    try:
        
        results=Sets.query.filter_by(name=name).all()
        if len(results)>0:
            return 'Name Already Taken',201
        results=Sets.query.get_or_404(values)
        print(results)
        return 'Value Scheme Matches Preset With Name: {}'.format(results.name),201
    except Exception as e:
        print(e)
        try:
            db.session.add(color)
            db.session.commit()
            return "Success   {}".format(values),200
        except Exception as e:
            print(e)
            return 'There was an issue adding your task',500
@app.route('/delete',methods=['DELETE'])
def delete():
    print("asdff")
    values=request.args["values"]
    values = Sets.query.get_or_404(values)
    
    try:
        db.session.delete(values)
        db.session.commit()
        return "Success",200
    except Exception as e:
        print(e)
        return 'There Was an error',500

@app.route('/update', methods=['PUT'])
def update():
    sets = Sets.query.get_or_404(request.args["values"])
    copy=Sets(name=sets.name,desc=sets.desc,types=sets.types,values=sets.values)
    copy.name=request.form["name"]
    copy.values=request.form["red"]+" "+request.form["green"]+" "+request.form["blue"]
    copy.desc=request.form["desc"]
    
    
    try:
        
        results=Sets.query.filter_by(name=copy.name).all()
        if len(results)>0 and (not copy.name==sets.name):
            return 'Name Already Taken',201
        results=Sets.query.get_or_404(copy.values)
        if not results.values==sets.values:
            print(results)
            return 'Value Scheme Matches Preset With Name: {}'.format(results.name),201
        raise Exception("everything is fine")
    except Exception as e:
        print("Error {} \n -------------------".format(e))
        try:
            sets.name=copy.name
            sets.desc=copy.desc
            sets.values=copy.values
            db.session.commit()
            return "Success",200
        except Exception as e:
            print(e)
            return 'There was an issue modifying your task',500



if __name__ == "__main__":
    app.run(debug=True,port=80,host="0.0.0.0")

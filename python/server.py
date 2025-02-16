from flask import Flask, render_template, url_for, request, redirect
import os
from flask_ask import Ask, request as requesty, session, question, statement
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import time
import RPi.GPIO as GPIO
import redis
import random

import pyaudio
import wave
import time
import sys
import signal

wf=None
stream=None
p=None
fps=60
frames=1
last=time.time()
def frame_counter():
    global fps
    global last
    global frames
    if time.time()-last>=1:
        last=time.time()
        print(frames)
        frames=0
    frames+=1

#next is to calculate frames per second and by frames i mean light sequences a second
#timer
#redis setup plus stop function for lights

r = redis.Redis()
r.set('in', "False")
r.set('out', "False")

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


def stop():
    global wf
    global stream
    global p
    print("running stop")
    if str(r.get("out"))=="b'True'":
        r.set("out","False")
        while str(r.get("in"))=="b'True'":
            pass
        r.set("out","False")
    if stream is not None:
        print(stream)
        # close PyAudio (7)
        stream.stop_stream()
        stream.close()
        wf.close()
        p.terminate()
        p=None
        wf=None
        stream=None
    print("ending stop")

# LED strip configuration:

import board
import neopixel

LED_COUNT   = 150     # Number of LED pixels.
LED_PIN     = board.D21   # GPIO pin
LED_BRIGHTNESS = 1  # LED brightness
LED_ORDER = neopixel.GRB # order of LED colours. May also be GRBW, GRBW, or RGB

# Create NeoPixel object with appropriate configuration.
strip = neopixel.NeoPixel(LED_PIN, LED_COUNT, brightness = LED_BRIGHTNESS, auto_write=False, pixel_order = LED_ORDER)

def signal_handler(one,two):
    global strip
    stop()
    print(strip)
    strip.deinit()
    gpio_pin=18
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(gpio_pin, GPIO.OUT)
    GPIO.output(gpio_pin,0)
    print("shutting down the server")
    sys.exit(0)
signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGHUP, signal_handler)
signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGQUIT, signal_handler)


#Schema Setups
app = Flask(__name__)
ask = Ask(app, "/")
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
def color(amazon=None,arg=None):
    stop()
    args=None
    if amazon is None:
        args=request.args
    else:
        args=arg
    
    if args["types"]=="color":
        arr=args["values"].split(" ")
        print(arr)
        color_set=[int(arr[0]),int(arr[1]),int(arr[2])]
        if "start" in args:
            start=int(args["start"])-1
            stops=int(args["stop"])
            for led in range(start,stops):
                strip[led]=color_set
        else:
            strip.fill(color_set)
        strip.show()
    elif args["types"]=="grad":
        pass
    elif args["types"]=="patt":
        pass
    elif args["types"]=="link":
        pass
    elif args["types"]=="multi":
        pass
    
    return "success"

@app.route('/stop')
def solostop():
    stop()
    return "Everything Stopped"
@app.route("/music")
def music():
    global wf
    global stream
    global p
    catalog=["fantasy","goshas","home","letgo","whip","artic"]
    stop()
    r.set('out', "True")
    strip.fill([0,0,0])
    #'{}.wav'.format(catalog[random.randint(0,4)])
    wf = wave.open("music/giveme.wav", 'rb')
    # instantiate PyAudio (1)
    p = pyaudio.PyAudio()
    print(wf.getframerate())
    # define callback (2)
    def callback(in_data, frame_count, time_info, status):
        frame_counter()
        data = wf.readframes(frame_count)
        byte=int(data[0])
        if not str(r.get('out'))=="b'True'":
            print("aborted")
            return (data, pyaudio.paAbort)
        vol=int((byte*75)/255)
        for led in range(50,-1,-1):
            strip[led+1]=strip[led]
        if vol>50:
            strip[0]=[vol,vol,vol]
        else:
            strip[0]=[0,0,0]
        strip.show()
        return (data, pyaudio.paContinue)

    # open stream using callback (3)
    stream = p.open(format=p.get_format_from_width(wf.getsampwidth()),
                    channels=wf.getnchannels(),
                    rate=wf.getframerate(),
                    output=True,
                    stream_callback=callback,
                    frames_per_buffer=512)#this is the chunk

    # start the stream (4)
    # send response that stream has started
    # the rest of the logic while streaming is in the call back
    stream.start_stream()
    return "success?"
    

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
            frame_counter()
            #print(num)
            values[idx]+=it
            #print(values)
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



#----------------------------START OF AMAZON INTENTS----------------------------------------------------------
@ask.launch
def launch():
    speech_text = 'Welcome to solara the yonathan is a bitch and kiro is an incel fuck'
    return question(speech_text).reprompt(speech_text).simple_card(speech_text)
 
@ask.intent('ChangeColorIntent')
def ColorChangeIntent(red,green,blue,name,start,finish):
    args={}
    args["types"]="color"
    args["value"]=None
    error_string="."
    color_string=""
    range_string=""

    if start is not None:
        args["start"]=start
        range_string+="from light {} ".format(start)
    
    if finish is not None:
        args["stop"]=finish
        range_string+="to light {} ".format(finish)



    if name is not None:
        query = Sets.query.filter_by(name=name).first()
        if query is None:
            args["values"]='255 60 54'
            color_string="changing the color to neon pink"
            error_string+=" The color you selected was not in our database."
        else:
            args["values"]=query.values
            print(query.values)
            color_string="changing the color to {}".format(name)
    elif red is not None and green is not None and blue is not None:
       args["values"]="{} {} {}".format(red,green,blue)
       color_string="changing the color to {} {} {}".format(red,green,blue)
    else:
        args["values"]='0 0 255'
        color_string="changing the color to neon pink"
        error_string+=" No color was specified."
    final_string="{} {} {}".format(color_string,range_string,error_string)
    

    try:
        color(True,args)
        return statement(final_string)
    except Exception as e:
        print(e)
        return statement("there was an unforseen error")
 
@ask.intent('AMAZON.HelpIntent')
def help():
    speech_text = 'You can say hello to me!'
    return question(speech_text).reprompt(speech_text).simple_card('HelloWorld', speech_text)
 
 
@ask.session_ended
def session_ended():
    return "{}", 200

if __name__ == '__main__':
    if 'ASK_VERIFY_REQUESTS' in os.environ:
        #verify = str(os.environ.get('ASK_VERIFY_REQUESTS', '')).lower()
        #if verify == 'false':
        pass
    app.config['ASK_VERIFY_REQUESTS'] = True
    context = ('cert.pem', 'key.pem')#certificate and key files
    app.run(debug=False, ssl_context=context,host='0.0.0.0')

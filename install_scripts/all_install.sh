sudo apt update 2>./apt_update_error.txt &&
sudo apt install python3 2>./python3_error.txt &&
sudo apt install python3-pip 2>./pip_error.txt &&
sudo pip3 install pip --upgrade 2>./pip_update_error.txt &&
sudo ./install_ngrok.sh 2>./ngrok_error.txt &&
sudo apt install redis 2>./redis_error.txt &&
sudo pip3 install adafruit-circuitpython-neopixel 2>./neopixel_error.txt &&
sudo pip3 install flask_ask==0.8.8 2>./flask_ask_error.txt &&
sudo pip3 install flask_sqlalchemy 2>./flask_sqlalchemy_error.txt &&
sudo pip3 install redis 2>./redis_error.txt &&
sudo apt install python3-pyaudio 2>./pyaudio_eror.txt
cd ../python;
sudo python3 init_db.py

sudo apt update 2>./apt_update_error.txt &&
sudo apt install python3 2>./python3_error.txt &&
sudo apt install python3-pip 2>./pip_error.txt &&
sudo bash ./install_ngrok.sh 2>./ngrok_error.txt &&
sudo apt install redis 2>./redis_error.txt &&
sudo pip3 install adafruit-circuitpython-neopixel --break-system-package  2>./neopixel_error.txt &&
sudo pip3 install flask_ask==0.8.8 --break-system-package 2>./flask_ask_error.txt &&
sudo pip3 install flask_sqlalchemy --break-system-package  2>./flask_sqlalchemy_error.txt &&
sudo pip3 install flask==2.2.5 --break-system-package  2>./flask_error.txt &&
sudo pip3 install redis --break-system-package  2>./redis_error.txt &&
sudo apt install python3-pyaudio 2>./pyaudio_eror.txt
cd ../python;
sudo python3 init_db.py

redis-server;
echo -e "Create an account and paste your ngrok authtoken here after you paste hit enter then control d: \n" &&
ngrok config add-authtoken `cat authtoken.txt`;
cd python
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365;
sudo python3 server.py &
ngrok http https://localhost:5000

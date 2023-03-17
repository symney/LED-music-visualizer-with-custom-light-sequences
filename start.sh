redis-server;


if test -e "./authtoken.txt"; then
echo "found the ngrok auth token. Using that."
ngrok config add-authtoken `cat authtoken.txt`;

else
echo "Did not find the ngrok auth token";
echo -e "Create an account and paste your ngrok authtoken here after you paste hit enter then control d: \n" &&
ngrok config add-authtoken `cat `;
fi


cd python
if test -e "./key.pem" && test -e "./cert.pem"; then
echo "found the ssl certficate files"
else
echo "did not fid the ssl certificate files making them now";
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365;
fi
sudo python3 server.py &
ngrok http https://localhost:5000

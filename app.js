const http = require('http');
const oprf = require('oprf');
const sodium = require('libsodium-wrappers-sumo');
const express = require('express');
const app = express();
const hostname = '127.0.0.1';
const port = 3000;

/**
 * Set up 2 servers
 * 
 * Send post request to server (google: post request express node)
 app.post("....") etc. 
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  _init_();
  res.send("index.html"); //use a html tag with a static file. 
});
*/
app.use(express.static('front-end'));
app.get('/', function(req,res) {
  res.render('index');
})
app.listen(3000, () => {
  console.log(`Listening at port 3000`);
  _init_();
});
/**
 * 0.) Make git ignore
 * 1.) initailisze umbral
 * 2.) generate the following keys (look at generate key function)
 * 3.) encrypt the data (encryptDataA) -> add extra fields call json.stringafy
 * 4.) use some data structure to simulate (add entries)
 * tips: Umbral documentation page [end-to-end demo, Encryption] 
 * for encrypt Data use a random string for json
 * Check back in  
 */
async function _init_() {
    await sodium.ready; //initializing sodium
    const _oprf = new oprf.OPRF(sodium); //initializing the oprf
    const sk = _oprf.generateRandomScalar(); //server key generation
    const input = 'hello';
    const masked = _oprf.maskInput(input); //client mask generation
    // console.log( masked.point );
    // const salted = _oprf.scalarMult(masked.point, sk); //Server randomness to client input
    // console.log( "Salt that " + salted );
    const unmasked = _oprf.unmaskInput(masked.point, masked.mask); //client unmasking output of server
    console.log('asdf' + unmasked);

}   

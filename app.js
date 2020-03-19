const http = require('http');
const oprf = require('oprf');
import { Umbral, IEncryptedData, IEncrypted, IMalformed, IKey, IDecrypted, IEncryptedMap, IOCDataMap } from 'umbral';
const sodium = require('libsodium-wrappers-sumo');
const express = require('express');
const app = express();
const hostname = '127.0.0.1';
const port = 3000;
const umbral = require('umbral');


// badgeID -> OPRF -> Shamirs Keys -> Output to clientn
// Name 
// Date
// Place
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

function updateDict(encryptedDict, newDict) {
  for (let matchingIndex in newDict) {
    if (!(matchingIndex in encryptedDict)) {
      encryptedDict[matchingIndex] = newDict[matchingIndex];
    } else {
      const OCMap = encryptedDict[matchingIndex];

      for (let oc in OCMap) {
        encryptedDict[matchingIndex][oc].push(newDict[matchingIndex][oc][0]);
      }
    }
  }
}

// await _sodium.ready;
// const _umbral = new Umbral(_sodium);
const userKeyPair = _sodium.crypto_box_keypair();
var [publicKeys, privateKeys] = generateKeys(2);
const perpBadge = 1234;
const lastName = 'Jenkins';
const region = 'Washington DC';
const district = 4;
const id = {perpBadge, region, district, lastName};
const perfID = JSON.stringify(id);

const randId = performOPRF(perpId);
const encryptedDataA = _umbral.encryptData([randId], { perpId, userId: 'Alice' }, publicKeys, userKeyPair.privateKey);
updateDict(encryptedDict, encryptedDataA.encryptedMap);

const encryptedDataB = _umbral.encryptData([randId], { perpId, userId: 'Bob' }, publicKeys, userKeyPair.privateKey);
updateDict(encryptedDict, encryptedDataB.encryptedMap);

for (let index in encryptedDict) {
  for (let oc in encryptedDict[index]) {
    const encrypted = encryptedDict[index][oc];
    const decrypted = _umbral.decryptData(encrypted, publicKeys[oc], privateKeys[oc]);
  }
}

function performOPRF(input) {
  const oprf = new OPRF(_sodium);
  const sk = oprf.generateRandomScalar();
  const masked = oprf.OPRF.maskInput(input);
  const salted = oprf.scalarMult(masked.point, sk);
  const unmasked = oprf.unmaskInput(salted, masked.mask);

  return new Uint8Array(unmasked);
}  

function generateKeys(n) {
  const privateKeys = {};
  const publicKeys = {};
  for (let i = 0; i < n; i++) {
    const keyPair = _sodium.crypto_box_keypair();
    const id = createRandString();

    publicKeys[id] = keyPair.publicKey;
    privateKeys[id] = keyPair.privateKey;
  }

  return [publicKeys, privateKeys];
}


// let encryptedDict: IEncryptedMap = {};

// await _sodium.ready;
// const _umbral = new Umbral(_sodium);

// const userKeyPair = _sodium.crypto_box_keypair();

// var [publicKeys, privateKeys] = generateKeys(1);

// const perpId = createRandString();
// let userId = createRandString();
// const randId: Uint8Array = performOPRF(perpId);

// const encryptedDataA: IEncrypted = _umbral.encryptData([randId], userId, JSON.stringify({ perpId, userId }), publicKeys, userKeyPair.privateKey);
// updateDict(encryptedDict, encryptedDataA.encryptedMap);
function generateRand(input, _oprf){
  const sk = _oprf.generateRandomScalar();

  const masked = _oprf.maskInput(input); //client mask generation

  const salted = _oprf.scalarMult(masked.point, sk); //Server randomness to client input
  
  return _oprf.unmaskInput(masked.point, masked.mask); //unmasked randomness 
}


/**
 * 0.) Make git ignore DONE
 * 1.) initailisze umbral DONE
 * 2.) generate the following keys (look at generate key function) DONE
 * 3.) encrypt the data (encryptDataA) -> add extra fields call json.stringafy DONE
 * 4.) use some data structure to simulate (add entries) DONE
 * tips: Umbral documentation page [end-to-end demo, Encryption] 
 * for encrypt Data use a random string for json
 * Check back in  
 */
async function _init_() {
    let encryptedDict = {};
    await sodium.ready; //initializing sodium
    const _oprf = new oprf.OPRF(sodium); //initializing the oprf
    const _umbral = new umbral.Umbral(sodium);
     //server key generation
    const userKeyPair = _sodium.crypto_box_keypair();
    
    const time = "22:30"
    const badge = "00000";
    const place = "Provdence, RI"
    const randPlace = generateRand(badge, _oprf);
    const randTime = generateRand(time, _oprf);
    const randPlace = generateRand(place, _oprf);
  

    const userId = 'Seny';


    var [publicKeys, privateKeys] = generateKeys(1);

    const encryptedDataTime = _umbral.encryptData([randTime], userId, JSON.stringify({ userId, badge, place, time }), publicKeys, userKeyPair.privateKey);
    const encryptedDataBadge = _umbral.encryptData([randBadge], userId, JSON.stringify({ userId, badge, place, time }), publicKeys, userKeyPair.privateKey);
    const encryptedDataPlace = _umbral.encryptData([randPlace], userId, JSON.stringify({ userId, badge, place, time }), publicKeys, userKeyPair.privateKey);
    //updateDict(encryptedDict, encryptedDataA.encryptedMap);
  
    console.log(encryptedDataTime);
    console.log(encryptedDataBadge);
    console.log(encryptedDataPlace);

} 




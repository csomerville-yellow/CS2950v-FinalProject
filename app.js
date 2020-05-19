//import { Umbral, IEncryptedData, IEncrypted, IMalformed, IKey, IDecrypted, IEncryptedMap, IOCDataMap } from 'umbral';

const http = require('http');
const ORPF = require('oprf');
//const crypto = require('crypto');
const sodium = require('libsodium-wrappers-sumo');
const express = require('express');
const app = express();
const hostname = '127.0.0.1';
const port = 3000;
const umbral = require('umbral');


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

function getRandom(max){
  return Math.floor(Math.random() * Math.floor(max));
}

function createRandString(){

  const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
      "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  let name = "";
  for (let i = 0; i < Math.random(128); i++) {
      const index = getRandom(alphabet.length);
      name += alphabet[index];
  }

  if (name === "") {
      name = "XXXXXX";
  }
  return name;
}

function performOPRF(input) {
  const oprf = new OPRF(_sodium);
  const sk = oprf.generateRandomScalar();
  const masked = oprf.OPRF.maskInput(input);
  const salted = oprf.scalarMult(masked.point, sk);
  const unmasked = oprf.unmaskInput(salted, masked.mask);

  return new Uint8Array(unmasked);
}  

function generateKeys(n, sodium) {
  const privateKeys = {};
  const publicKeys = {};
  for (let i = 0; i < n; i++) {
    const keyPair = sodium.crypto_box_keypair();
    const id = createRandString();

    publicKeys[id] = keyPair.publicKey;
    privateKeys[id] = keyPair.privateKey;
  }

  return [publicKeys, privateKeys];
}


function generateRand(input, oprf /*secK*/){
  
  const key = oprf.generateRandomScalar();
  // console.log(in)
  // End-2-End protocol
  const maskedPoint = oprf.hashToPoint("input");
  //console.log(maskedPoint)
  const encodedP1 = oprf.encodePoint(maskedPoint.point, 'UTF-8');

  //console.log(encodedP1)
  //const decodedP1 = oprf.decodePoint(encodedP1, 'UTF-8');
  //const saltedPoint = oprf.scalarMult(/*decodedP1,*/ key);
 // const encodedP2 = oprf.encodePoint(saltedPoint, 'ASCII');

  //const decodedP2 = oprf.decodePoint(encodedP2, 'ASCII');
  return //oprf.unmaskPoint(/*decodedP2,*/ maskedPoint.mask);

  // const masked = _oprf.maskInput(input); //client mask generation

  // const salted = _oprf.scalarMult(masked.point, secK); //Server randomness to client input
  
  // return _oprf.unmaskInput(salted, masked.mask); //unmasked randomness 

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
    await sodium.ready; //initializing sodium
    
  //const _oprf = new OPRF(); //initializing the oprf
    // await _oprf.ready;
    const _umbral = new umbral.Umbral(sodium);
    // const sk = _oprf.generateRandomScalar();
    //console.log(sk)
     //server key generation
    const userKeyPair = sodium.crypto_box_keypair();
    
    const time = "22:30"
    const badge = "00000";
    const place = "Provdence, RI"
    //const randBadge = generateRand(badge, _oprf);
      /* crypto.createHmac("sha256", <plaintext> )
                 .update(body)
                 .digest('base64') */
    //const randTime = generateRand(time, _oprf);
   
    //const randPlace = generateRand(place, _oprf);
  
  //Make another for comparing user
    const userId1 = 'Seny';
    const userId2 = 'Alice';
    var encryptedDict = {}

   // var [publicKeys, privateKeys] = generateKeys(1, sodium)
   const keyPair = sodium.crypto_box_keypair();
   

   var intArr = new Array(32).fill(0); 
   
   var timeArr = new Uint8Array(intArr);
   const encryptedDataTime1 = _umbral.encryptData([timeArr], userId1, JSON.stringify({ userId1, badge, place, time }), [keyPair.publicKey], userKeyPair.privateKey);
   var timeShare = Object.keys(encryptedDataTime1.encryptedMap)[0];
   const eTimeShare = encryptedDataTime1.encryptedMap[timeShare];
   
   //Encrypted Time for user2
  //  const encryptedDataTime2 = _umbral.encryptData([timeArr], userId2, JSON.stringify({ userId2, badge, place, time }), [keyPair.publicKey], userKeyPair.privateKey);
  //  var timeShare2 = Object.keys(encryptedDataTime2.encryptedMap)[0]
  //  updateDict(encryptedDict, encryptedDataTime2.encryptedMap)
  //  //Checking if they match
  //   console.log(encryptedDict)
  //   const decrypted = _umbral.decryptData(encryptedDict, keyPair.publicKey, userKeyPair.privateKey);
  //   console.log(decrypted)
    var badgeArr = new Uint8Array(intArr);
    const encryptedDataBadge1 = _umbral.encryptData([badgeArr], userId1, JSON.stringify({ userId1, badge, place, time }), [keyPair.publicKey], userKeyPair.privateKey);
    var badgeShare = Object.keys(encryptedDataBadge1.encryptedMap)[0];
    const eBadgeShare = encryptedDataBadge1.encryptedMap[badgeShare]


    var placeArr = new Uint8Array(intArr);
    const encryptedDataPlace = _umbral.encryptData([placeArr], userId1, JSON.stringify({ userId1, badge, place, time }), [keyPair.publicKey], userKeyPair.privateKey);
     var placeShare = Object.keys(encryptedDataPlace.encryptedMap)[0];
    const ePlaceShare = encryptedDataBadge1.encryptedMap[placeShare]
    //console.log(keyPair.publicKey)
    //console.log(encryptedDataTime.encryptedMap);
    var shares = [eTimeShare, eBadgeShare, ePlaceShare]

    
      console.log("Key share for time: \n")
      console.log(shares[0])
      console.log("\n")
      console.log("Key share for badge: \n")
      console.log(shares[1])
      console.log("\n")
      console.log(shares[2])
      console.log("Key share for place: \n")
      console.log("\n")
    
    // console.log("Encrypted Time \n")
    // console.log(encryptedDataTime);
    // //console.log(encryptedDataBadge);
    // console.log("Encrypted Place \n")
    // console.log(encryptedDataPlace);


    
} 


_init_();




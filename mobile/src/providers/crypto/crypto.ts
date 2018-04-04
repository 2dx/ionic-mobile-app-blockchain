import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as base32 from 'hi-base32';
import CryptoJS from 'crypto-js';
declare var require: any

/*
  Generated class for the CryptoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CryptoProvider {

  constructor(public http: HttpClient) {
  }

  toHexString(byteArray) {
    return Array.prototype.map.call(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
  }
  toByteArray(hexString) {
    var result = [];
    while (hexString.length >= 2) {
      result.push(parseInt(hexString.substring(0, 2), 16));
      hexString = hexString.substring(2, hexString.length);
    }
    return new Uint8Array(result);
  }

  sk2pk(sk){
    const nacl = require('ecma-nacl');
    const seed = this.toByteArray(sk);
    const kp = nacl.signing.generate_keypair(seed);
    const pk = this.toHexString(kp.pkey);
    const CryptoJS = require('crypto-js');
    const sha512hash = CryptoJS.SHA512(CryptoJS.enc.Hex.parse(pk)).toString(CryptoJS.enc.Hex);
    const ripemd160hash = CryptoJS.RIPEMD160(CryptoJS.enc.Hex.parse(sha512hash)).toString(CryptoJS.enc.Hex);
    const digest = '64' + ripemd160hash
    const digestHash = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(digest)).toString(CryptoJS.enc.Hex);
    const checksum = digestHash.substr(0,8)
    const base32str = base32.encode(this.toByteArray(digest+checksum));
    return {"publicKey":pk, "address":base32str};
  };



  pk2addr(pk){
    const CryptoJS = require('crypto-js');
    const sha512hash = CryptoJS.SHA512(CryptoJS.enc.Hex.parse(pk)).toString(CryptoJS.enc.Hex);
    const ripemd160hash = CryptoJS.RIPEMD160(CryptoJS.enc.Hex.parse(sha512hash)).toString(CryptoJS.enc.Hex);
    const digest = '64' + ripemd160hash
    const digestHash = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(digest)).toString(CryptoJS.enc.Hex);
    const checksum = digestHash.substr(0,8)
    const base32str = base32.encode(this.toByteArray(digest+checksum));
    return base32str;
  }

  sign(data, sk){
    const nacl = require('ecma-nacl');
    const seed = this.toByteArray(sk);
    const kp = nacl.signing.generate_keypair(seed);
    const msgSig = nacl.signing.signature(this.toByteArray(data), kp.skey);
    return this.toHexString(msgSig);
  };

  epoch(){
    var date = new Date();
    var a = date.getTime();
    var b = Math.floor( a / 1000 );
    return b - 1519830000;
  }
  date(timeStamp){
    return new Date((timeStamp+1519830000)*1000);
  }
  date_f(timeStamp){
    var d_ = new Date((timeStamp+1519830000)*1000);
    var y = d_.getFullYear().toString();
    var m = (d_.getMonth() + 1).toString();
    var d = d_.getDate().toString();
    var w = d_.getDay().toString();
    var hr = d_.getHours().toString();
    var mn = d_.getMinutes().toString();
    var sc = d_.getSeconds().toString();
    if (m.length==1) {
      m = '0' + m;
    }
    if (d.length==1) {
      d = '0' + d;
    }
    if (hr.length==1) {
      hr = '0' + hr;
    }
    if (mn.length==1) {
      mn = '0' + mn;
    }
    if (sc.length==1) {
      sc = '0' + sc;
    }
    return y + '年' + m + '月' + d + '日' + hr + '時' + mn + '分' + sc + '秒'
  }

	// k = this.Nacl.crypto_sign_keypair();
	// m = this.Nacl.encode_utf8("message");
	// signed_m = this.Nacl.crypto_sign(m, k.signSk);
	// m1 = this.Nacl.crypto_sign_open(signed_m, k.signPk);
	// console.log("message" === this.Nacl.decode_utf8(m1)); // always true
}

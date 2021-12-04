import CRYPTO from 'crypto-js';
import MD5 from 'crypto-js/md5';
import SHA1 from 'crypto-js/sha1';
import SHA256 from 'crypto-js/sha256';
import SHA512 from 'crypto-js/sha512';

export default class Api {
  constructor() {
    this.crypto = CRYPTO;
    this.md5 = MD5;
    this.sha1 = SHA1;
    this.sha256 = SHA256;
    this.sha512 = SHA512;
  }

  static readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', (evt) => {
        resolve(evt.target.result);
      });
      reader.addEventListener('error', (evt) => {
        reject(evt.target.error);
      });
      reader.readAsArrayBuffer(file);
    });
  }

  getHash(buffer, cryptoFn) {
    const wordArray = this.crypto.lib.WordArray.create(buffer);
    return cryptoFn(wordArray).toString(this.crypto.enc.Hex);
  }
}

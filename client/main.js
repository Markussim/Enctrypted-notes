// An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
var key = "ÖÖ";

// Convert text to bytes
var text = "Text may be any length you wish, no padding is required.";

//decrypt(encrypt(text, key), key);

function encrypt(text, key) {
  key = aesjs.utils.utf8.toBytes(CryptoJS.MD5(key));

  var textBytes = aesjs.utils.utf8.toBytes(text);

  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var encryptedBytes = aesCtr.encrypt(textBytes);

  var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  console.log(encryptedHex);

  return encryptedHex;
}

function decrypt(etext, key) {
  key = aesjs.utils.utf8.toBytes(CryptoJS.MD5(key));

  var encryptedBytes = aesjs.utils.hex.toBytes(etext);

  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var decryptedBytes = aesCtr.decrypt(encryptedBytes);

  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  console.log(decryptedText);

  return decryptedText;
}

document.getElementById("input").oninput = () => {
  encrypt(
    document.getElementById("input").value,
    document.getElementById("password").value
  );
};

document.getElementById("password").oninput = () => {
  encrypt(
    document.getElementById("input").value,
    document.getElementById("password").value
  );
};

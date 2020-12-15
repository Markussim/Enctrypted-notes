// An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
var key = "ÖÖ";

// Convert text to bytes
var text = "Text may be any length you wish, no padding is required.";

//decrypt(encrypt(text, key), key);

let outputField = document.getElementById("main");

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

  var decryptedJson = JSON.parse(aesjs.utils.utf8.fromBytes(decryptedBytes));

  let hashed = CryptoJS.MD5(decryptedJson.text).toString();

  console.log(CryptoJS.MD5(decryptedJson.text).toString());

  if (hashed == decryptedJson.hash) {
    return decryptedJson.text;
  } else {
    return false;
  }
}

if (document.getElementById("submit")) {
  document.getElementById("submit").onclick = () => {
    saveNote();
  };
}

function saveNote() {
  let request = new XMLHttpRequest();
  let name = document.getElementById("name").value;

  let savedJson = JSON.stringify({
    text: document.getElementById("input").value,
    hash: CryptoJS.MD5(document.getElementById("input").value).toString(),
  });

  let eNote = encrypt(savedJson, document.getElementById("password").value);

  request.open("POST", "/", true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(`name=${name}&text=${eNote}`);
  request.onreadystatechange = function () {
    if (request.status == 403) {
      outputField.innerText = "Name already in use";
    } else if (request.status == 200) {
      outputField.innerText = "Saved your note securly in the cloud";
    }
  };
}

function getNote() {
  let ptag = document.createElement("p");
  ptag.id = "noteText";
  fetch("/getNote?noteName=" + document.getElementById("getName").value)
    .then((response) => response.json())
    .then((data) => {
      let decryptJson = decrypt(
        data.text,
        document.getElementById("getPass").value
      );

      if (decryptJson) {
        document.getElementById("outPut").innerHTML = "";
        ptag.innerText = decryptJson;
        document.getElementById("outPut").appendChild(ptag);
      } else {
        document.getElementById("outPut").innerHTML = "";
        ptag.innerText = "Wrong password";
        document.getElementById("outPut").appendChild(ptag);
      }
    })
    .catch(() => {
      document.getElementById("outPut").innerHTML = "";
      ptag.innerText = "Wrong password";
      document.getElementById("outPut").appendChild(ptag);
    });
}

if (document.getElementById("getSubmit")) {
  document.getElementById("getSubmit").onclick = () => {
    getNote();
  };
}

const fs = require('fs');
const request = require('request');
const readline = require("readline");
const { stdin, stdout } = require("process");
const args = process.argv.splice(2);

const showError = (err, res) => {
  console.log(`Error: ${err}`);
  res && console.log(`Status code: ${res.statusCode}`);
  process.exit();
};

const showFileSummary = (path) => {
  fs.stat(path, (err, stats) => {
    if (err) return showError(err);
    console.log(`Downloaded and saved ${stats.size} bytes to ${path}.`);
    process.exit();
  });
};

const writeFile = (path, body) => {
  fs.writeFile(path, body, (err) => {
    if (err) return showError(err);
    showFileSummary(path);
  });
};

const sendRequest = (url, path) => {
  request(url, (err, res, body) => {
    if (err) return showError(err, res);
    writeFile(path, body);
  });
};

const askOverwritePermission = (url, path) => {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  rl.question("This path already exists. Do you want to overwrite the file? (Y or N and then enter key)?\n", (input) => {
    const answer = input.toLowerCase();
    if (answer === "n") return process.exit();
    if (answer === "y") sendRequest(url, path);
  });
};

const fetchPage = (input) => {
  const url = input[0];
  const path = input[1];

  fs.stat(path, (err, stats) => {
    if (stats) return askOverwritePermission(url, path);
    sendRequest(url, path);
  });

};

fetchPage(args);


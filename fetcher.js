const fs = require('fs');
const request = require('request');
const args = process.argv.splice(2);

const showError = (err) => {
  console.log(`Error: ${err}`);
};

const downloadPage = (input) => {
  const url = input[0];
  const path = input[1];

  request(url, (err, res, body) => {

    if (err) {
      console.log(`Error: ${err} \n Status code: ${res}`);
      return;
    }

    fs.writeFile(path, body, (err) => {
      if (err) {
        showError(err);
        return;
      }

      fs.stat(path, (err, stats) => {
        if (err) {
          showError(err);
          return;
        }

        console.log(`Downloaded and saved ${stats.size} bytes to ${path}.`);
      });

    });

  });

};

downloadPage(args);


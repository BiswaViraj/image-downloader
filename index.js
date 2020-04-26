const rp = require("request-promise");
const $ = require("cheerio");
const request = require("request");
const fs = require("fs");
const path = require("path");
const homedir = require("os").homedir();

const url = process.argv[2];
console.log(process.argv[2]);
const downloadImg = (imgURL, imgTitle, folderName) => {
  // stream the response and save it to the folder
  let folder = "imageDownloads";
  let subFolder = folderName.replace(/ /g, "");
  const output = path.resolve(
    homedir,
    `./${folder}/${subFolder}/${imgTitle}.png`
  );
  let dir = `${homedir}/${folder}/${subFolder}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(path.join(homedir, folder, subFolder));
  }

  request
    .get(imgURL)
    .on("error", function (error) {
      try {
      } catch (error) {
        console.error(error);
      }
    })
    .pipe(fs.createWriteStream(output));
};
rp(url)
  .then(function (html) {
    let pageTitle = $("title", html).text();
    // select all img tag and loop over them
    $("img", html).each((i, elem) => {
      // get the src attribute
      let srcURL = elem.attribs.src;
      // update the img URL
      let downURL = srcURL.startsWith("http") ? srcURL : url + srcURL;
      let imgTitle = elem.attribs.alt;
      imgTitle = imgTitle ? imgTitle : i;

      downloadImg(downURL, imgTitle, pageTitle);
    });
  })
  .catch(function (err) {
    console.error(err);
  });


const autoFilename = true;
const prefix = "cekic-ve-gul-S01";
let count = 0;
const fs = require('fs');
const path = require('path');
let lineFilename = "";

const DiacriticsMap = require('./diacritics-map');


function isValidUrl(urlString) {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
    return !!urlPattern.test(urlString);
}

function sanitize(str){
    str = str.replace(/[^\u0000-\u007E]/g, (a) => DiacriticsMap[a] || a);
    str = str.replaceAll(" ","-");
    str = str.replaceAll(".","-");
    str = str.replaceAll("--","-");
    return str.trim();
}


function getEpisode(num){
    return num < 10 ? `0${num}` : String(num);
}

function getFileName(url){
    return url.split('\\').pop().split('/').pop();    
}

function getFileExtension(filename){
    return filename.split('.').pop();
}

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./files/index.txt')
});

lineReader.on('line', function (line) {
    console.log('Line from file:', getFileName(line).trim());

    if (isValidUrl(line)){
        count++

        const filename = getFileName(line).trim();
        const episode = getEpisode(count);
        const extension = getFileExtension(filename);
        let fullFilename = "";

        if (autoFilename){
            fullFilename = sanitize(lineFilename)+"."+extension;
        }
        else{
            fullFilename = `${prefix}E${episode}.${extension}`;
        }


        fs.cp(path.resolve(__dirname, `files/${filename}`), path.resolve(__dirname, `files/renamed/${fullFilename}`),(err)=>{
            console.log(err)
        });
    }
    else{
        lineFilename  = line.split("#EXTINF:-1,")[1]
    }


});

lineReader.on('close', function () {
    console.log('all done, son');
});
const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');

const convert = (filepath = './customer-data.csv') => {
    
    var buff = [];

    var ext = path.extname(filepath);
    var jsonExt = '.json';
    var filename = path.basename(filepath).replace(ext, '');
    var dirname = path.dirname(filepath);
    var srcfile = path.join(__dirname, dirname, filename + ext);
    
    // print the banner
     console.info('--------------------------------------------------------------');
    var str = fs.readFileSync('banner.txt', 'utf-8');
    console.log(str);

    // Log starting of convertion
    console.info('\t\t\tWelcome to CSV2JSON Converter');
    console.info('---------------------------------------------------------------');
    console.info('Generated JSON file shall be in the same folder \nand holds the same name of CSV file with .json extension\n');

    // checkfile exists
    if(!fs.existsSync(srcfile)) {
        console.error(`ERROR: File ${filepath} not found\n`);
        return -1;
    }

    console.info(`Converting ${filepath} to JSON...`);

    const loadCSV = (filepath, callback) => {
        const inst = csv().fromFile(filepath);

        inst.on('json', (jsonObj, rowIndex) => {
            buff.push(jsonObj);
            //console.log(jsonObj);
        });

        inst.on('end', () => {
            var output = JSON.stringify(buff, null, 2);
            callback(null, output);
            console.log(`Converting ${filename} is complete.`);
        });

        inst.on('error', (error) => {
            console.log(error);
        });
    };


    // save file    
    loadCSV(filepath, (error, data) => {
        if(error) return console.log(error);
        var targetFile = path.join(__dirname, dirname, filename + jsonExt);
        fs.writeFileSync(targetFile, data);
        console.log(`Saving ${targetFile}...`);
    });
};

convert(process.argv[2]);

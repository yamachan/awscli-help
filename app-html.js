'use strict';
const fs = require('fs');
const config = require('./config.js');
const { version } = require('os');

if (process.argv.length !== 4) {
    console.log('app-html.js (ver' + config.get().join(', ') + ')');
    console.log('\tConvert from a JSON/JavaScript file to HTML files, sub tool of of aws-cli SHLT.');
    console.log('\tby ' + config.app_author);
    console.log('\n\tnode app-html.js [JSON/JS file] [html folder]');
    console.log('\tnode app-html.js awscli.js html');
    return;
}

const app_name = 'app-html';
const json_file = process.argv[2];
const output_dir = process.argv[3];
const output_file = output_dir + '/' + json_file;

if (!json_file || !fs.existsSync(json_file) || !output_dir || !fs.existsSync(output_dir) ) {
    console.error(app_name + ': invalid arguments');
    return -1;
}

// ----- Init -----

let json_text = fs.existsSync(json_file) ? fs.readFileSync(json_file).toString().replace(/^let awscli\s?=\s?/, '') : '{}';
let json = JSON.parse(json_text);

if (!json.ver || !json.children) {
    console.error(app_name + ': invalid data object');
    return -1;
}
console.log(app_name + ': version = ' + json.ver);

// ----- Internal Functions -----

function _createFile(_fname, _text) {
    if (!!_fname && !!_text) {
        fs.writeFileSync(output_dir + '/' + _fname.replace(/ /, '_') + '.html', _text);
        console.log(app_name + '._createFile: ' + _fname);
    }
}

// ----- Process -----

let services = json.services.filter(s => s != 'help');
let commands = [];
services.forEach(s => {
    let service = json.children[s];
    commands.push(s);
    _createFile(service.cmd, service.text);
    for (let ss in service.children) {
        let sub_service = service.children[ss];
        commands.push(sub_service.cmd);
        _createFile(sub_service.cmd, sub_service.text);
    }
})

// ----- Output -----

let ret = {ver: json.ver, children: commands};
fs.writeFileSync(output_file, 'let awscli = ' + JSON.stringify(ret) + ';');
console.log(app_name + ': output_file = ' + output_file);

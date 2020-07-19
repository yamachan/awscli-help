'use strict';
const fs = require('fs');
const { execSync } = require('child_process');
const help2obj = require('./help2obj.js');

const app_version = '1.00';
const app_update = '2020-07-18';
const app_repository = 'github.com/yamachan/awscli-help';
if (process.argv.length !== 3) {
    console.log('app.js (ver' + [app_version, app_update, app_repository].join(', ') + ')');
    console.log('\tCreate or update help contents of aws-cli tool as a JSON/JavaScript file.');
    console.log('\tby Toshio Yamashita (@yamachan360)');
    console.log('\n\tnode app.js [JSON/JS file]')
    console.log('\n\tnode app.js awscli.js')
    return;
}
const json_file = process.argv[2];

// ----- Init -----

let json_text = fs.existsSync(json_file) ? fs.readFileSync(json_file).toString().replace(/^let awscli\s?=\s?/, '') : '{}';
let json = JSON.parse(json_text);
const version_full = execSync('aws --version').toString().replace(/\s+$/, '');
const version = version_full.split(' ')[0];

if (json && json.ver === version) {
    console.log('Same version: ' + version);
    return;
}

// ----- Process -----

let obj = help2obj('', version, json);

// ----- Output -----

fs.writeFileSync(json_file, (json_file.endsWith('.js') ? 'let awscli = ' : '') + JSON.stringify(obj));

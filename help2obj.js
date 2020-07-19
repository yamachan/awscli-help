'use strict';
module.exports = exports = help2obj.help2obj = help2obj

const { execSync } = require('child_process');

function help2obj(_cmd, _ver, _old){
    if (typeof _cmd !== 'string') {
        return {};
    }
    let stdout_text;
    try {
        stdout_text = execSync('aws ' + _cmd + ' help').toString();
    } catch(e) {
        return { error: e, cmd: _cmd, ver: _ver };
    }

    let pos_s = Math.max(stdout_text.lastIndexOf('Available Services'), stdout_text.lastIndexOf('Available Commands'));
    let services = [];
    let children = _old && _old.children ? _old.children : {};
    if (pos_s >= 0) {
        pos_s = stdout_text.indexOf('****', pos_s) + 18;
        let pos_e = stdout_text.indexOf('****', pos_s);
        pos_e = pos_e < 0 ? stdout_text.length : pos_e;
        services = pos_s < 18 ? [] : stdout_text.substring(pos_s, pos_e)
            // Quick hack for "ec2 describe-local-gateway-route-table-virtual-interface-group-associations"
            .replace(/\n\s?(\* [a-z0-9-]*[a-z0-9]-)\s+([a-z0-9-]+)\s?\n/g,"\n$1$2\n")
            .split('\n')
            .filter(s => s.startsWith('* '))
            .map(s => s.replace(/^\*\s+/, '').replace(/\s*$/, ''));
        for (const pos in services) {
            let key = services[pos];
            let service_old = children[key];
            if ((!service_old || service_old.ver !== _ver) && key !== 'help') { // (!_cmd || _cmd.startsWith('ec2')) && 
                children[key] = help2obj(_cmd + ' ' + key, _ver, service_old);
                console.log("help2obj (UPDATE): " + _cmd + ' ' + key);
            } else {
                console.log("help2obj (SKIP): " + _cmd + ' ' + key);
            }
        }
    }

    return {
        cmd: _cmd.trim(),
        ver: _ver,
        text: stdout_text,
        services: services,
        children: children
    };
}

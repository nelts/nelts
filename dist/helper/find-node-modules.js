"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const findup = require("findup-sync");
function findNodeModules(options) {
    if (typeof options === 'string') {
        options = {
            cwd: options
        };
    }
    options = require('merge')({
        cwd: process.cwd(),
        searchFor: 'node_modules',
        relative: true
    }, options);
    var modulesArray = [];
    var searchDir = options.cwd;
    var modulesDir;
    var duplicateFound = false;
    do {
        modulesDir = findup(options.searchFor, { cwd: searchDir });
        if (modulesDir !== null) {
            var foundModulesDir = formatPath(modulesDir, options);
            duplicateFound = (modulesArray.indexOf(foundModulesDir) > -1);
            if (!duplicateFound) {
                modulesArray.push(foundModulesDir);
                searchDir = path.join(modulesDir, '../../');
            }
        }
    } while (modulesDir && !duplicateFound);
    return modulesArray;
}
exports.default = findNodeModules;
function formatPath(modulesDir, options) {
    if (options.relative) {
        return path.relative(options.cwd, modulesDir);
    }
    else {
        return modulesDir;
    }
}

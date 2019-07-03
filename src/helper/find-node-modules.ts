import * as path from 'path';
import * as findup from 'findup-sync';

type findNodeModulesOptions = {
  cwd?: string,
  relative?: boolean,
  searchFor?: string,
}

/**
 * Finds all parents node_modules directories and returns them in an array.
 *
 * @param {object} options An object containing objects. Read the readme or
 *                         the source code.
 */
export default function findNodeModules(options: findNodeModulesOptions) {
  if (typeof options === 'string') {
		options = {
			cwd: options
		};
  }
  options = require('merge')({
		cwd: process.cwd(), // The directory to start the search from
		searchFor: 'node_modules', // I see no reason to change this
		relative: true // If false, returns absolute paths
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


function formatPath(modulesDir: string, options: findNodeModulesOptions) {
	if (options.relative) {
		return path.relative(options.cwd, modulesDir);
	} else {
		return modulesDir;
	}
}
#!/usr/bin/env node

import * as path from "path";
import * as fs from 'fs';

import { convert } from "./converter/convert";
import { createTsAstProject } from "./create-ts-ast-project";
import Project from "ts-simple-ast";

const ArgumentParser = require('argparse').ArgumentParser;


const parser = new ArgumentParser( {
	version: require( '../package.json' ).version,
	addHelp: true,
	description: 'Angular AOT Fixer. Runs a series of transformations on your source files that will make your code AOT compilation compatible.'
} );
parser.addArgument( 'directory', {
	help: 'The directory of your project, or the directory that contains your @Component classes'
} );

const args = parser.parseArgs();
const absolutePath = path.resolve( args.directory );

if( !fs.lstatSync( absolutePath ).isDirectory() ) {
	console.error( `${absolutePath} is not a directory. Please provide a directory` );
	process.exit( 1 );
} else {
	console.log( `Processing ${absolutePath}` );
}

const tsAstProject = createTsAstProject( absolutePath );

// Convert
console.log( 'Converting source files. This may take a few minutes depending on how many files are being converted...' );
const convertedTsAstProject = convert( tsAstProject );

// Print output files
console.log( 'Outputting .ts files:' );
printSourceFilesList( convertedTsAstProject, '  ' );

// Save output files
convertedTsAstProject.saveSync();


/**
 * Private helper to print out the source files list in the given `astProject`
 * to the console.
 */
function printSourceFilesList( astProject: Project, indent = '' ) {
	astProject.getSourceFiles().forEach( sf => {
		console.log( `${indent}${sf.getFilePath()}` );
	} );
}
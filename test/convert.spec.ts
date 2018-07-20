import { expect } from 'chai';
import { createTsAstProject } from "../src/create-ts-ast-project";
import { convert } from "../src/converter/convert";
import { SourceFile } from "ts-simple-ast";
import * as fs from "fs";

describe( 'convert()', () => {

	it( `when the template is a string literal, should resolve the html 
	     text correctly and change private properties to public`,
	() => {
		runTest( `${__dirname}/fixture/template-string-literal` );
	} );


	it( `when the template is a variable in the file, should resolve the
	     html text correctly`,
	() => {
		runTest( `${__dirname}/fixture/template-as-var` );
	} );


	it( `when the templateUrl is a variable in the file, should resolve the
	     html file correctly`,
	() => {
		runTest( `${__dirname}/fixture/template-url-as-var` );
	} );


	it( `when the templateUrl is a relative path, should correctly resolve the 
	     html file`,
	() => {
		runTest( `${__dirname}/fixture/template-url-string-literal-as-relative-path` );
	} );


	it( `when the templateUrl is a full path from the project's root directory,
	     should still correctly resolve the html file, and the fix the path
	     to be relative to the component file`,
	() => {
		runTest( `${__dirname}/fixture/template-url-from-project-root` );
	} );


	it( `should change every property/method found to be used in an HTML 
	     template into a public property/method`,
	() => {
		runTest( `${__dirname}/fixture/properties-and-methods-in-html` );
	} );


	it( `if properties and methods do not specify an access modifier (which
	     defaults to 'public'), do not change the access modifier`,
	() => {
		runTest( `${__dirname}/fixture/properties-without-scope-modifiers` );
	} );


	it( `if a getter's scope is modified to become public, it should also
	     modify the related setter (and vice-versa)`,
	() => {
		runTest( `${__dirname}/fixture/getters-and-setters` );
	} );

} );


/**
 * Runs a test of the conversion utility by passing it a directory that has
 * two subdirectories:
 *
 * - input
 * - expected
 *
 * The `input` directory will be converted, and then compared to the
 * `expected` directory.
 *
 * @param {string} absolutePath Absolute path to the directory which has
 *   `input` and `expected` subdirectories.
 */
function runTest( absolutePath: string ) {
	// First, make sure the directory passed exists
	if( !fs.lstatSync( absolutePath ).isDirectory() ) {
		throw new Error( absolutePath + ' is not a directory' );
	}

	const inputFilesProject = createTsAstProject( absolutePath + '/input' );
	const expectedFilesProject = createTsAstProject( absolutePath + '/expected' );

	const convertedInputProject = convert( inputFilesProject );

	const convertedSourceFiles = convertedInputProject.getSourceFiles();
	const expectedSourceFiles = expectedFilesProject.getSourceFiles();
	const convertedSourceFilePaths = convertedInputProject.getSourceFiles().map( sf => sf.getFilePath() );
	const expectedSourceFilePaths = expectedFilesProject.getSourceFiles().map( sf => sf.getFilePath() );

	// First, make sure that there are the same number of files in the converted
	// and expected projects (and that they're both greater than 0 to make sure
	// we actually read some files!)
	if(
		convertedSourceFiles.length > 0
		&& expectedSourceFiles.length > 0
		&& convertedSourceFiles.length !== expectedSourceFiles.length
	) {
		throw new Error( `
			The number of converted source files (${convertedSourceFiles.length})
			does not match the number of expected source files (${expectedSourceFiles.length}).
			
			Converted source files:
			  ${convertedSourceFilePaths.join( '\n  ' )}
			  
			Expected source files:
			  ${expectedSourceFilePaths.join( '\n  ' )}
		`.replace( /^\t*/gm, '' ) )
	}

	// Now check each converted source file against the expected output file
	convertedSourceFiles.forEach( ( convertedSourceFile: SourceFile ) => {
		const expectedSourceFilePath = convertedSourceFile.getFilePath().replace( /([\\\/])input[\\\/]/, '$1expected$1' );
		const expectedSourceFile = expectedFilesProject.getSourceFile( expectedSourceFilePath );

		if( !expectedSourceFile ) {
			throw new Error( `
				The converted source file (below) does not have a matching 'expected' file: 
				  '${convertedSourceFile.getFilePath()}'
				  
				Tried to find matching expected file: 
				  '${expectedSourceFilePath}'
			`.replace( /^\t*/gm, '' ) );
		}

		expect( convertedSourceFile.getFullText() )
			.to.equal( expectedSourceFile!.getFullText() );
	} );


}

import * as path from 'path';
import { createTsAstProject } from "./create-ts-ast-project";
import { convert } from "./converter/convert";
import Project from "ts-simple-ast";

/**
 * Asynchronously fixes an Angular project's files for AOT compatibility.
 * Returns a Promise.
 */
export async function fixAotCompatibility( sourceFilesPath: string ): Promise<void> {
	const convertedTsAstProject = doConvert( sourceFilesPath );

	// Save output files
	return convertedTsAstProject.save();
}

/**
 * Synchronously fixes an Angular project's files for AOT compatibility.
 * Returns a Promise.
 */
export function fixAotCompatibilitySync( sourceFilesPath: string ) {
	const convertedTsAstProject = doConvert( sourceFilesPath );

	// Save output files
	convertedTsAstProject.saveSync();
}


/**
 * Performs the actual conversion given a `sourceFilesPath`, and returning a
 * `ts-simple-ast` Project with the converted source files.
 */
function doConvert( sourceFilesPath: string ): Project {
	const absolutePath = path.resolve( sourceFilesPath );

	const tsAstProject = createTsAstProject( absolutePath );
	return convert( tsAstProject );
}
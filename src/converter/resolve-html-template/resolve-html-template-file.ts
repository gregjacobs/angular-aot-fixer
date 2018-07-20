import * as fs from "fs";
import * as path from "path";

const TraceError = require( 'trace-error' );

/**
 * Attempts to find the .html file referenced by a `templateUrl` for a
 * component.
 *
 * First looks for the path relative to the source file, such as in this
 * case:
 *
 *     @Component( {
 *         templateUrl: './my-component.html
 *     } )
 *
 * However, some projects define the templateUrl as something like this:
 *
 *     @Component( {
 *         templateUrl: 'projectRoot/app/path/to/my-component.html
 *     } )
 *
 * In the above case, we'll walk up the directory structure until we can
 * match that entire path.
 *
 * @param sourceFileDirectoryPath The path to the *directory* that the
 *   component's .ts file lives under.
 * @param templateUrl The value of the `templateUrl` property in the
 *   \@Component decorator
 */
export function resolveHtmlTemplateFile( sourceFileDirectoryPath: string, templateUrl: string ): string {
	// First, try relative reference if the templateUrl starts with a '.'
	if( templateUrl.startsWith( '.' ) ) {
		const pathByRelative = path.resolve( sourceFileDirectoryPath, templateUrl );
		if( fs.existsSync( pathByRelative ) ) {
			return fs.readFileSync( pathByRelative, 'utf8' );
		}

		throw new TraceError( `
			Could not find the .html file referenced by the templateUrl:
			    '${templateUrl}'
			    
			Looked for the .html file at path:
			    ${pathByRelative}
		`.trim().replace( /^\t*/gm, '' ) );

	} else {
		// No relative reference ('.') in the templateUrl, try walking up
		// the directory tree to match the file based on the full url from
		// the project root (second example in jsdoc)
		let currentDir = sourceFileDirectoryPath;
		const searchedPaths: string[] = [];

		while( !isSystemRootDir( currentDir ) ) {
			const pathToHtml = path.resolve( sourceFileDirectoryPath + '/', templateUrl );

			if( fs.existsSync( pathToHtml ) ) {
				return fs.readFileSync( pathToHtml, 'utf8' );

			} else {
				searchedPaths.push( pathToHtml );
			}

			currentDir = path.resolve( currentDir, '..' );
		}

		throw new TraceError( `
			Could not find the .html file referenced by the templateUrl:
			    '${templateUrl}'
			    
			Looked for the .html file at path(s):
			    ${searchedPaths.join( '\n    ' )}
		`.trim().replace( /^\t*/gm, '' ) );
	}
}

function isSystemRootDir( path: string ): boolean {
	return path === '/' || /^[A-Z]:\\$/.test( path );
}
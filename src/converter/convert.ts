import Project, { ClassDeclaration } from "ts-simple-ast";
import { filterOutNodeModules } from "./filter-out-node-modules";
import { findComponentClasses } from "./find-component-classes";
import { resolveHtmlTemplate } from "./resolve-html-template/resolve-html-template";

const TraceError = require( 'trace-error' );

/**
 * Applies AOT compatibility transformations to the source files.
 */
export function convert( tsAstProject: Project ): Project {
	// Filter out any node_modules files that accidentally got included
	tsAstProject = filterOutNodeModules( tsAstProject );

	// Find all Component classes. These are classes adorned with the
	// @Component decorator.
	const componentClasses = findComponentClasses( tsAstProject );

	// TODO: Filter out all non-@Component .ts files from the project for
	// output

	componentClasses.forEach( ( componentClass: ClassDeclaration ) => {
		processComponentClass( componentClass );
	} );

	// Filter out any node_modules files that accidentally got included by an import.
	// We don't want to modify these when we save the project, and typescript's
	// lib.d.ts file somehow seems to get included
	tsAstProject = filterOutNodeModules( tsAstProject );

	return tsAstProject;
}


/**
 * Processes the @Component classes to find their .html text, and make
 * properties public.
 */
function processComponentClass( componentClass: ClassDeclaration ) {
	try {
		doProcessComponentClass( componentClass );

	} catch( error ) {
		throw new TraceError( `
			An error occurred while processing source file:
			    ${componentClass.getSourceFile().getFilePath()}
			    
			Processing class: ${componentClass.getName()}
		`.trim().replace( /^\t*/gm, '' ), error );
	}
}


function doProcessComponentClass( componentClass: ClassDeclaration ) {
	const componentDecorator = componentClass.getDecorator( 'Component' )!;

	let template = resolveHtmlTemplate( componentDecorator );

	console.log( 'template: ', template );
}




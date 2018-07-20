import { Decorator, Node, ObjectLiteralElementLike, TypeGuards, VariableDeclaration } from "ts-simple-ast";
import { resolveHtmlTemplateFile } from "./resolve-html-template-file";
import { getStringLiteralAssignmentFromRelatedVar } from "./get-string-literal-assignment-from-related-var";

const TraceError = require( 'trace-error' );

/**
 * Given the @Component decorator node, resolves the HTML template text
 * from either the `template` property or the `templateUrl`.
 */
export function resolveHtmlTemplate( componentDecorator: Decorator ): string | null {
	const callExpr = componentDecorator.getCallExpression();

	if( !callExpr ) {
		throw new TraceError( `
			The @Component decorator found was not a function call. Make sure to 
			have the @Component decorator in the form:
			
			@Component( { ... } )
			export class MyComponent { ... }
		`.trim().replace( /^\t*/gm, '' ) );
	}

	const objLiteralArg = callExpr.getArguments()[ 0 ];
	if( !TypeGuards.isObjectLiteralExpression( objLiteralArg ) ) {
		throw new TraceError( `
			The @Component decorator found did not contain an object literal
			argument. Make sure to have the @Component decorator in the form:
			
			@Component( { ... } )
			export class MyComponent { ... }
		`.trim().replace( /^\t*/gm, '' ) );
	}

	// If it is a templateUrl, resolve the file and retrieve its text
	const templateProp = objLiteralArg.getProperty( 'template' );
	const templateUrlProp = objLiteralArg.getProperty( 'templateUrl' );

	if( templateProp ) {
		return getStringLiteralFromProp( templateProp );

	} else if( templateUrlProp ) {
		const templateUrl = getStringLiteralFromProp( templateUrlProp );

		const sourceFileDirectoryPath = componentDecorator.getSourceFile().getDirectoryPath();
		return resolveHtmlTemplateFile( sourceFileDirectoryPath, templateUrl );

	} else {
		// the component doesn't have a `template` or `templateUrl`,
		// return null
		return null;
	}
}


/**
 * Attempts to resolve the string associated with given the `template` or
 * 'templateUrl' property's ObjectLiteralElementLike node (which can be a
 * PropertyAssignment, a ShorthandPropertyAssignment, etc.).
 *
 * Finds the string if we have it inline as a string literal:
 *
 *     @Component( {
 *         template: '<div></div>'
 *     } )
 *
 * Or if its in a variable:
 *
 *     const template = '<div></div>';
 *
 *     @Component( {
 *         template: template
 *     } )
 *
 * And even if it is a shorthand property assignment:
 *
 *     const template = '<div></div>';
 *
 *     @Component( {
 *         template
 *     } )
 */
function getStringLiteralFromProp( templateProp: ObjectLiteralElementLike ): string {
	if( TypeGuards.isShorthandPropertyAssignment( templateProp ) ) {
		// Find the variable's string literal initializer
		const identifier = templateProp.getNameNode();

		return getStringLiteralAssignmentFromRelatedVar( identifier );

	} else if( TypeGuards.isPropertyAssignment( templateProp ) ) {
		const initializer = templateProp.getInitializerOrThrow();

		if(
			TypeGuards.isStringLiteral( initializer )
			|| TypeGuards.isNoSubstitutionTemplateLiteral( initializer )
		) {
			return initializer.getLiteralValue();

		} else if( TypeGuards.isIdentifier( initializer ) ) {
			return getStringLiteralAssignmentFromRelatedVar( initializer );
		}
	}

	throw new TraceError( `
		Tried to find the HTML template's text given the @Component property:
		    ${templateProp.getText()}
		    
		The template/templateUrl property must either have a string literal 
		value, or must reference a variable by name in the same file.
	`.trim().replace( /^\t*/gm, '' ) );
}
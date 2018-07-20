import { Identifier, Node, TypeGuards, VariableDeclaration } from "ts-simple-ast";
const TraceError = require( 'trace-error' );

/**
 * Helper method given an `Identifier`, tries to find the assignment to that
 * identifier in the same source file and returns its StringLiteral assignment.
 * For example:
 *
 *     const htmlTemplate = '<div>...</div>';
 *
 *     @Component( {
 *         template: htmlTemplate
 *     } )
 *     export class MyComponent {}
 *
 * If the method is called with the Identifier for `htmlTemplate`, it returns
 * the string '<div>...</div>'.
 *
 * If the identifier cannot be found, or it was assigned to something other than
 * a StringLiteral, the method throws.
 */
export function getStringLiteralAssignmentFromRelatedVar( identifier: Identifier ): string {
	const definitionNodes = identifier.getDefinitionNodes();  // find its definition
	const variableDeclaration = definitionNodes
		.find( ( node: Node ): node is VariableDeclaration => {
			return TypeGuards.isVariableDeclaration( node );
		} );

	if( !variableDeclaration ) {
		throw new TraceError( `
			Could not find a variable declaration for the 'template' or 'templateUrl' variable:
			    ${identifier.getText()}
		`.trim().replace( /^\t*/gm, '' ) );
	}

	const initializer = variableDeclaration.getInitializer();
	if(
		!initializer
		|| (
			!TypeGuards.isStringLiteral( initializer )
			&& !TypeGuards.isNoSubstitutionTemplateLiteral( initializer )
		)
	) {
		throw new TraceError( `
			The variable declaration for the 'template' or 'templateUrl' variable: '${identifier.getText()}'
			must be assigned to a string literal. 
			
			Ex: const myTemplate = '<div>...</div>'; 
			
			Saw the following variable initializer text instead:
			    ${variableDeclaration.getText()}
		`.trim().replace( /^\t*/gm, '' ) );
	}

	return initializer.getLiteralValue();
}
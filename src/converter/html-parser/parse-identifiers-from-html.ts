import { union } from "../../util/set-utils";
import { parseIdentifiersFromExpr } from "./parse-identifiers-from-expr";

const htmlparser = require( "htmlparser2" );

/**
 * Parses an HTML file and returns the identifiers (class properties) used in
 * it.
 */
export function parseIdentifiersFromHtml( html: string ): Set<string> {
	const identifiersUsedInHtml = new Set<string>();

	var parser = new htmlparser.Parser( {
		onopentag: onOpenTag,
		ontext: onText
	}, { decodeEntities: true } );
	parser.write( html );
	parser.end();

	// If we parsed the special identifier $event, remove it from the Set
	identifiersUsedInHtml.delete( '$event' );

	return identifiersUsedInHtml;


	function onOpenTag( tagName: string, attrs: {[attr: string]: string} ) {
		const attrNames = Object.keys( attrs );

		attrNames.forEach( ( attrName: string ) => {
			const value = attrs[ attrName ];

			// @Input or @Output properties are always an expression
			if( attrName.startsWith( '[' ) || attrName.startsWith( '(' ) ) {
				const identifiers = parseIdentifiersFromExpr( value );
				addIdentifiers( identifiers );

			} else {
				// We may have {{ variableName }} in the attribute's value string,
				// so we need to parse that
				const identifiers = parseIdentifiersFromInterpolationString( value );
				addIdentifiers( identifiers );
			}
		} );
	}

	function onText( text: string ) {
		const identifiers = parseIdentifiersFromInterpolationString( text );
		addIdentifiers( identifiers );
	}


	// Adds the given `identifiers` to the overall Set
	function addIdentifiers( identifiers: Set<string> ) {
		identifiers.forEach( identifier => {
			identifiersUsedInHtml.add( identifier );
		} );
	}

}


/**
 * Given a string with interpolation {{ and }} tokens, parses the expression
 * from each of them and returns the identifiers found within them.
 */
function parseIdentifiersFromInterpolationString( text: string ): Set<string> {
	const interpolationExpressions = ( text.match( /\{\{([\s\S]*?)\}\}/g ) || [] )
		.map( expr => expr.replace( /^\{\{|\}\}$/g, '' ) );  // remove the surrounding {{ and }}

	return interpolationExpressions.reduce( ( identifiers: Set<string>, expr: string ) => {
		return union( identifiers, parseIdentifiersFromExpr( expr ) );
	}, new Set<string>() );
}
import 'mocha';
import { expect } from 'chai'
import { parseIdentifiersFromHtml as doParseIdentifiersFromHtml } from "./parse-identifiers-from-html";

describe( 'parseIdentifiersFromHtml()', () => {

	// Helper function for tests which returns an array of the identifiers
	// out of the Set
	function parseIdentifiersFromHtml( html: string ): string[] {
		const identifiers = doParseIdentifiersFromHtml( html );

		return [ ...identifiers ];
	}


	it( `given a variety of HTML expressions, should parse the correct identifiers
	     from them`,
	() => {
		expect( parseIdentifiersFromHtml( `
			<div>No Identifiers here</div>
			<span class="not-an-identifier"></span>
		` ) )
			.to.deep.equal( [] );

		expect( parseIdentifiersFromHtml( `
			<div>{{ myProp }}</div>
		` ) )
			.to.deep.equal( [ 'myProp' ] );

		expect( parseIdentifiersFromHtml( `
			<my-component [some-input]="myProp"></my-component>
		` ) )
			.to.deep.equal( [ 'myProp' ] );

		expect( parseIdentifiersFromHtml( `
			<my-component [some-output]="myProp"></my-component>
		` ) )
			.to.deep.equal( [ 'myProp' ] );

		expect( parseIdentifiersFromHtml( `
			<my-component [some-input]="a" [some-output]="b( $event )"></my-component>
		` ) )
			.to.deep.equal( [ 'a', 'b' ] );

		expect( parseIdentifiersFromHtml( `
			<my-component some-attr="a {{b}} {{c}}"></my-component>
		` ) )
			.to.deep.equal( [ 'b', 'c' ] );

		expect( parseIdentifiersFromHtml( `
			Hello {{ world }}.
			The answer is: {{ a + b }}
		` ) )
			.to.deep.equal( [ 'world', 'a', 'b' ] );
	} );

} );
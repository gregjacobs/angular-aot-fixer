import 'mocha';
import { expect } from 'chai'
import { parseIdentifiersFromExpr } from "./parse-identifiers-from-expr";

describe( 'parseIdentifiersFromHtml()', () => {

	// Helper function for tests which returns an array of the identifiers
	// from the Set
	function parseIdentifiers( sourceText: string ) {
		const identifiers = parseIdentifiersFromExpr( sourceText );

		return [ ...identifiers ];
	}

	it( `should return the correct "top-level" identifiers for a variety of
	     different expressions`,
	() => {
		expect( parseIdentifiers( `abc` ) ).to.deep.equal( [ 'abc' ] );
		expect( parseIdentifiers( `abc(123)` ) ).to.deep.equal( [ 'abc' ] );
		expect( parseIdentifiers( `abc.def` ) ).to.deep.equal( [ 'abc' ] );
		expect( parseIdentifiers( `abc[def]` ) ).to.deep.equal( [ 'abc', 'def' ] );
		expect( parseIdentifiers( `abc(def)` ) ).to.deep.equal( [ 'abc', 'def' ] );
		expect( parseIdentifiers( `abc + def` ) ).to.deep.equal( [ 'abc', 'def' ] );
		expect( parseIdentifiers( `+abc` ) ).to.deep.equal( [ 'abc' ] );
		expect( parseIdentifiers( `abc(def, ghi)` ) ).to.deep.equal( [ 'abc', 'def', 'ghi' ] );
		expect( parseIdentifiers( `abc(def.a, ghi.b)` ) ).to.deep.equal( [ 'abc', 'def', 'ghi' ] );
		expect( parseIdentifiers( `abc = 1; def = ghi;` ) ).to.deep.equal( [ 'abc', 'def', 'ghi' ] );
		expect( parseIdentifiers( `a.b = d.e` ) ).to.deep.equal( [ 'a', 'd' ] );
	} );

} );
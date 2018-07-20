import Project, { Identifier, PropertyAccessExpression, SyntaxKind, TypeGuards } from "ts-simple-ast";

/**
 * Given an expression, parses the identifiers used from it.
 *
 * The algorithm here works by finding all Identifier nodes that:
 *
 * 1. Do *not* have a parent as a PropertyAccessExpression or
 *    ElementAccessExpression, or
 * 2. If the Identifier's parent is a PropertyAccessExpression or an
 *    ElementAccessExpression, then the Identifier must be in the 'expression'
 *    property of the parent node. This will identify the 'abc' vs. the 'def'
 *    in the following:
 *       `abc.def`    `abc['def']`
 * 3. If the identifier is directly inside an ElementAccessExpression's
 *    `argumentExpression. This will identify the 'def' in:
 *       `abc[def]`
 * 4. Special case for Angular html templates: one can use `this.prop` in
 *    the template where normally just `prop` is used. This method finds
 *    these as well.
 */
export function parseIdentifiersFromExpr( expr: string ): Set<string> {
	const ast = createAst( expr );

	const identifiers = ast.getDescendantsOfKind( SyntaxKind.Identifier );
	return identifiers.reduce( ( identifiersSet: Set<string>, identifier: Identifier ) => {
		const parent = identifier.getParent()!;

		if( TypeGuards.isPropertyAccessExpression( parent ) ) {
			const propAccess = parent as PropertyAccessExpression;  // for clarity

			// If the expression (left-hand-side) of the PropertyAccess is the
			// identifier, it's a "top level" identifier
			if( propAccess.getExpression() === identifier ) {
				identifiersSet.add( identifier.getText() );

			// Special case for retrieving `this.prop`, which can be used in
			// Angular html templates in place of just `prop`. Add `prop` to the
			// set in this case as well
			} else if(
				TypeGuards.isThisExpression( propAccess.getExpression() )
				&& propAccess.getNameNode() === identifier
			) {
				identifiersSet.add( identifier.getText() );
			}

		} else if( TypeGuards.isElementAccessExpression( parent ) ) {
			// If the expression (left-hand-side) of the ElementAccess is the
			// identifier, OR the argument of the ElementAccess is the
			// identifier, then it's a "top level" identifier
			if(
				parent.getExpression() === identifier
				|| parent.getArgumentExpression() === identifier
			) {
				identifiersSet.add( identifier.getText() );
			}

		} else {
			// any other parent of the identifier (not a PropertyAccess or
			// ElementAccess) must mean that the identifier is used at a "top
			// level" (for instance, as an operand to any BinaryExpression, or
			// simply inside an ExpressionStatement)
			identifiersSet.add( identifier.getText() );
		}

		return identifiersSet;
	}, new Set<string>() );
}


function createAst( text: string ) {
	const tsAstProject = new Project();

	return tsAstProject.createSourceFile( 'temp.ts', text );
}
import { ClassDeclaration, MethodDeclaration, Scope, TypeGuards } from "ts-simple-ast";

const TraceError = require( 'trace-error' );

/**
 * Finds any methods which have the @HostListener decorator and marks them as
 * public if they are protected or private.
 *
 * Also, if the @HostListener is trying to pass an argument to the method and
 * the method doesn't expect that argument, the argument is removed from
 * the @HostListener. This would otherwise result in an AOT TypeScript error.
 * Example:
 *
 *     @HostListener( 'window:resize', [ '$event' ] )
 *     onResize() {
 *         // ...
 *     }
 *
 * Is changed to:
 *
 *     @HostListener( 'window:resize' )
 *     onResize() {
 *         // ...
 *     }
 */
export function fixHostListenerMethods( classDeclaration: ClassDeclaration ) {
	const hostListenerMethods = classDeclaration
		.getMethods()
		.filter( ( method: MethodDeclaration ) => {
			return !!method.getDecorator( 'HostListener' );
		} );

	hostListenerMethods.forEach( ( method: MethodDeclaration ) => {
		// The method must be public for Angular to access it
		if( method.hasScopeKeyword() && method.getScope() !== Scope.Public ) {
			method.setScope( Scope.Public );
		}

		fixHostListenerArguments( method );
	} );
}


/**
 * Removes any arguments from the @HostListener call that do not have matching
 * method parameters.
 * For example:
 *
 *     @HostListener( 'window:resize', [ '$event' ]  // <-- $event will be removed since its not expected by onResize()
 *     onResize() {}
 */
function fixHostListenerArguments( method: MethodDeclaration ) {
	const hostListenerDecorator = method.getDecorator( 'HostListener' )!;

	const callExpr = hostListenerDecorator.getCallExpression();
	if( !callExpr ) {
		throw new TraceError( `
			An error occurred while trying to fix the @HostListener for
			the method: '${method.getName()}'.
			
			Expected the @HostListener to be a function call. Make sure that
			the Syntax is something along the lines of:
			    @HostListener( 'window:resize' )
		`.trim().replace( /^\t*/gm, '' ) );
	}

	const listenerArgumentsArray = callExpr.getArguments()[ 1 ];  // ex: [ '$event' ]
	if( !listenerArgumentsArray ) {
		return;  // no arguments, nothing to do
	}
	if( !TypeGuards.isArrayLiteralExpression( listenerArgumentsArray ) ) {
		return;  // not an array, nothing to do
	}

	const numArguments = listenerArgumentsArray.getElements().length;
	const numMethodParameters = method.getParameters().length;

	if( numMethodParameters === 0 ) {
		callExpr.removeArgument( 1 );  // remove the arguments array entirely

	} else if( numMethodParameters < numArguments ) {
		// Remove the elements in reverse order
		for( let i = numArguments - 1; i >= numMethodParameters; i-- ) {
			listenerArgumentsArray.removeElement( i );
		}
	}
}
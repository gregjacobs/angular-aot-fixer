import { ClassDeclaration, ParameterDeclaration, Scope } from "ts-simple-ast";

/**
 * Given a Set of properties/methods to mark as 'public', modifies the given
 * class to make those properties public.
 */
export function markClassPropertiesPublic(
	classDeclaration: ClassDeclaration,
	propsToMarkPublic: Set<string>
) {
	propsToMarkPublic.forEach( propName => {
		const classMember = classDeclaration.getInstanceMember( propName );

		if( classMember ) {
			classMember.setScope( Scope.Public );

		} else {
			// See if the property was defined by a constructor parameter, such
			// as:
			//     constructor( private prop: any ) {}

			const constructorParam = findConstructorParam( classDeclaration, propName );
			if( constructorParam && constructorParam.hasScopeKeyword() ) {
				constructorParam.setScope( Scope.Public );
			}
		}
	} );
}


/**
 * Finds a constructor's ParameterDeclaration by name.
 */
function findConstructorParam(
	classDeclaration: ClassDeclaration,
	paramName: string
): ParameterDeclaration | undefined {
	const constructors = classDeclaration.getConstructors();

	// Assume there is only one constructor, as that is the usual for
	// an Angular component
	const constructor = ( constructors || [] )[ 0 ];

	if( constructor ) {
		return constructor.getParameters()
			.find( ( p: ParameterDeclaration ) => p.getName() === paramName );
	} else {
		return undefined;
	}
}
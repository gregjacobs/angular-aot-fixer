import { ClassDeclaration, ClassInstanceMemberTypes, ParameterDeclaration, Scope } from "ts-simple-ast";

/**
 * Given a Set of properties/methods to mark as 'public', modifies the given
 * class to make those properties public.
 */
export function markClassPropertiesPublic(
	classDeclaration: ClassDeclaration,
	propsToMarkPublic: Set<string>
) {
	propsToMarkPublic.forEach( propName => {
		// We need to find *all* of the class members with this name. This could
		// include, for instance, a getter and a setter that both need to be
		// modified to become public
		const classMembers = classDeclaration
			.getInstanceMembers()
			.filter( ( member: ClassInstanceMemberTypes ) => {
				return member.getName() === propName;
			} );

		if( classMembers.length > 0 ) {
			// node: don't modify if there is currently no scope keyword - it
			// defaults to 'public', and can cause issues if there is a getter
			// that we make public while a setter has no modifier. This causes
			// a TypeScript compilation error that the getter and setter do not
			// have the same access modifier
			classMembers.forEach( ( classMember: ClassInstanceMemberTypes ) => {
				if( classMember.hasScopeKeyword() ) {
					classMember.setScope( Scope.Public );
				}
			} );

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
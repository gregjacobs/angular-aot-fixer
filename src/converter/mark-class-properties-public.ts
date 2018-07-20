import { ClassDeclaration } from "ts-simple-ast";

/**
 * Given a Set of properties/methods to mark as 'public', modifies the given
 * class to make those properties public.
 */
export function markClassPropertiesPublic(
	classDeclaration: ClassDeclaration,
	propsToMarkPublic: Set<string>
) {

}
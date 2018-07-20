import Project, { ClassDeclaration, SourceFile } from "ts-simple-ast";

/**
 * Given a Project, removes all files that do not include an @Component class.
 */
export function filterOutNonComponentClasses(
	tsAstProject: Project,
	componentClasses: ClassDeclaration[]
): Project {
	// First, get a Set of the source files which include an @Component class
	const componentSourceFiles = componentClasses
		.reduce( ( sourceFiles: Set<SourceFile>, componentClass: ClassDeclaration ) => {
			return sourceFiles.add( componentClass.getSourceFile() );
		}, new Set<SourceFile>() );

	// Remove source files that don't contain an @Component class
	tsAstProject.getSourceFiles().forEach( sourceFile => {
		if( !componentSourceFiles.has( sourceFile ) ) {
			tsAstProject.removeSourceFile( sourceFile );
		}
	} );

	return tsAstProject;
}
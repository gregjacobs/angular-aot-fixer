import Project, { ClassDeclaration, SourceFile } from "ts-simple-ast";

/**
 * Finds each class in the project that is adorned with the @Component
 * decorator.
 */
export function findComponentClasses( tsAstProject: Project ): ClassDeclaration[] {
	return tsAstProject
		.getSourceFiles()
		.reduce( ( componentClasses: ClassDeclaration[], sourceFile: SourceFile ) => {
			const fileComponentClasses = sourceFile.getClasses()
				.filter( ( currentClass: ClassDeclaration ) => {
					return !!currentClass.getDecorator( 'Component' );
				} );

			componentClasses.push( ...fileComponentClasses );
			return componentClasses;
		}, [] );
}
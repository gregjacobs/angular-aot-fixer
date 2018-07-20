@Component( {
	templateUrl: `properties-and-methods-in-html.html`
} )
export class PropertiesAndMethodsInHtml {
	private propInInterpolation = 1;
	private childPropInInterpolation = 2;  // should *not* be marked as public

	private propInInputAttribute = 3;
	private propInOutputAttribute = 4;

	private propInMultiStatementOutputAttribute = 5;

	private propInNgIf = true;
	private propInNgFor = [ 1, 2, 3 ];

	private realPrivateProp1 = 1;
	private realPrivateProp2 = 2;

	constructor(
		private dependencyInInterpolation: any,
		private dependencyInInputAttribute: any,
		private dependencyInOutputAttribute: any,
		private realPrivateDependency: any
	) {}

	private methodInInputAttribute() {}
	private methodInOutputAttribute() {}

	private methodInMultiStatementOutputAttribute() {}

	private methodInNgFor() {}

	private realPrivateMethod1() {}
	private realPrivateMethod2() {}
}
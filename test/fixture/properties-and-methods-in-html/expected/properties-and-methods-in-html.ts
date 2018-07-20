@Component( {
	templateUrl: `properties-and-methods-in-html.html`
} )
export class PropertiesAndMethodsInHtml {
	public propInInterpolation = 1;
	private childPropInInterpolation = 2;  // should *not* be marked as public

	public propInInputAttribute = 3;
	public propInOutputAttribute = 4;

	public propInMultiStatementOutputAttribute = 5;

	public propInNgIf = true;
	public propInNgFor = [ 1, 2, 3 ];

	private realPrivateProp1 = 1;
	private realPrivateProp2 = 2;

	constructor(
		public dependencyInInterpolation: any,
		public dependencyInInputAttribute: any,
		public dependencyInOutputAttribute: any,
		private realPrivateDependency: any
	) {}

	public methodInInputAttribute() {}
	public methodInOutputAttribute() {}

	public methodInMultiStatementOutputAttribute() {}

	public methodInNgFor() {}

	private realPrivateMethod1() {}
	private realPrivateMethod2() {}
}
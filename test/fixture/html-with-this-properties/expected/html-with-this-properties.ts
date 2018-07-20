@Component( {
	template: `
		<my-component [input]="this.prop1" (click)="this.method()">
			{{ this.prop2 }}
		</my-component>
	`
} )
export class HtmlWithThisProperties {
	public prop1: any;
	public prop2: any;
	public method() {}

	private realPrivateProp: any;
	private realPrivateMethod() {}
}
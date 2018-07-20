@Component( {
	template: `
		<my-component [input]="this.prop1" (click)="this.method()">
			{{ this.prop2 }}
		</my-component>
	`
} )
export class HtmlWithThisProperties {
	private prop1: any;
	private prop2: any;
	private method() {}

	private realPrivateProp: any;
	private realPrivateMethod() {}
}
@Component( {
	template: '<div>{{ prop1 }} {{ method1() }}</div>'
} )
export class TemplateStringLiteral {
	prop1 = 1;  // should not get 'public' keyword
	prop2 = 2;

	method1() {}  // should not get 'public' keyword
}
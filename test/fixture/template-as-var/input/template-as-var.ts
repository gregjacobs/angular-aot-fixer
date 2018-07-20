const myTemplate = '<div>{{ prop1 }}</div>';

@Component( {
	template: myTemplate
} )
export class TemplateAsVarShorthand {
	private prop1 = 1;
	private prop2 = 2;
}
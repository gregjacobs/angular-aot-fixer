const myTemplate = '<div>{{ prop1 }}</div>';

@Component( {
	template: myTemplate
} )
export class TemplateAsVarShorthand {
	public prop1 = 1;
	private prop2 = 2;
}
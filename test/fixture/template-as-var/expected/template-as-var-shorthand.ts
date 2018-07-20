const template = '<div>{{ prop1 }}</div>';

@Component( {
	template
} )
export class TemplateAsVarShorthand {
	public prop1 = 1;
	private prop2 = 2;
}
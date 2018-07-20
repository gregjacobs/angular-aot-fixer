import { Component } from '@angular/core';

@Component( {
	templateUrl: './template-url-as-var.html'
} )
export class TemplateUrlAsVarShorthand {
	public prop1 = 1;
	private prop2 = 2;
}
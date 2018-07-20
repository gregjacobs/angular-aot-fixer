@Component( {
	template: `<div (click)="prop2='hello'">{{ prop1 }}</div> {{ prop3 }}`
} )
export class GettersAndSetters {
	public set prop1( prop1: string ) {   // setter should become 'public' even though its not used
		this.prop1 = prop1;
	}
	public get prop1() {   // should become public
		return this._prop1;
	}

	public set prop2( prop2: string ) {   // setter should become 'public' even though its not used
		this.prop2 = prop2;
	}
	public get prop2() {   // should become public
		return this._prop2;
	}

	set prop3( prop3: string ) {   // access modifier should *not* be changed (since it's public by default)
		this.prop3 = prop3;
	}
	get prop3() {   // access modifier should *not* be changed (since it's public by default)
		return this._prop3;
	}

	private set realPrivateProp( realPrivateProp: string ) {  // should stay private
		this._realPrivateProp = realPrivateProp;
	}
	private get realPrivateProp() {  // should stay private
		return this._realPrivateProp;
	}

	private _prop1: string;  // should remain 'private'
	private _prop2: string;  // should remain 'private'
	private _prop3: string;  // should remain 'private'
	private _realPrivateProp: string;  // should remain 'private'
}
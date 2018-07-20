@Component( {
	template: `Hello, World`
} )
export class HostListener {

	@HostListener( 'window:resize' )
	private onResize1() {}

	@HostListener( 'window:resize', [ '$event' ] )  // [ '$event' ] should be removed in this case
	private onResizeWithMissingParam() {}

	@HostListener( 'window:resize', [ '$event' ] )  // '$event' should remain in this case
	private onResizeWithExpectedParam1( event: any ) {}

	@HostListener( 'window:resize', [ '$event', 'arg2' ] )  // 'arg2' should be removed
	private onResizeWithExpectedParam2( event: any ) {}

	@HostListener( 'window:resize', [ '$event', 'arg2', 'arg3' ] )  // 'arg2' and 'arg3' should be removed
	private onResizeWithExpectedParam3( event: any ) {}

	@HostListener( 'window:resize' )
	public onResizeThatsAlreadyPublic() {}   // should be unchanged

	@HostListener( 'window:resize' )
	onResizeThatsAlreadyPublicByDefault() {}   // should be unchanged

}
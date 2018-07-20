@Component( {
	template: `Hello, World`
} )
export class HostListener {

	@HostListener( 'window:resize' )
	public onResize1() {}

	@HostListener( 'window:resize' )  // [ '$event' ] should be removed in this case
	public onResizeWithMissingParam() {}

	@HostListener( 'window:resize', [ '$event' ] )  // '$event' should remain in this case
	public onResizeWithExpectedParam1( event: any ) {}

	@HostListener( 'window:resize', [ '$event' ] )  // 'arg2' should be removed
	public onResizeWithExpectedParam2( event: any ) {}

	@HostListener( 'window:resize', [ '$event' ] )  // 'arg2' and 'arg3' should be removed
	public onResizeWithExpectedParam3( event: any ) {}

	@HostListener( 'window:resize' )
	public onResizeThatsAlreadyPublic() {}   // should be unchanged

	@HostListener( 'window:resize' )
	onResizeThatsAlreadyPublicByDefault() {}   // should be unchanged

}
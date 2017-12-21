var params = {
	canv1Start: 30,
	canv2Start: 226,
	dClipping1: 0.45,
	dClipping2: 0.6,
	flrClipping1: 0.33,
	flrClipping2: 0.33,
	xLeftClip1: 0.2,
	xRightClip1: 0.55,
	xLeftClip2: 0.45,
	xRightClip2: 0.75
};


function initGui() {
	// dat.GUI

	var gui = new dat.GUI( { width: 300 } );

	var folderCanv1 = gui.addFolder( 'Canvas1' );
	folderCanv1.add( params, 'canv1Start', 0, 256 ).step( 1 ).onChange( function( value ) { setCanvasPosition(); } );
	folderCanv1.add( params, 'dClipping1', 0.0, 1.0 ).step( 0.01 ).onChange( function( value ) { updateMaterial(); } );
	folderCanv1.add( params, 'flrClipping1', 0.0, 1.0 ).step( 0.01 ).onChange( function( value ) { updateMaterial(); } );
	folderCanv1.add( params, 'xLeftClip1', 0.0, 1.0 ).step( 0.01 ).onChange( function( value ) { updateMaterial(); } );
	folderCanv1.add( params, 'xRightClip1', 0.0, 1.0 ).step( 0.01 ).onChange( function( value ) { updateMaterial(); } );
	folderCanv1.open();

	var folderCanv2 = gui.addFolder( 'Canvas2' );
	folderCanv2.add( params, 'canv2Start', 0, 256 ).step( 1 ).onChange( function( value ) { setCanvasPosition(); } );
	folderCanv2.add( params, 'dClipping2', 0.0, 1.0 ).step( 0.01 ).onChange( function( value ) { updateMaterial(); } );
	folderCanv2.add( params, 'flrClipping2', 0.0, 1.0 ).step( 0.01 ).onChange( function( value ) { updateMaterial(); } );
	folderCanv2.add( params, 'xLeftClip2', 0.0, 1.0 ).step( 0.01 ).onChange( function( value ) { updateMaterial(); } );
	folderCanv2.add( params, 'xRightClip2', 0.0, 1.0 ).step( 0.01 ).onChange( function( value ) { updateMaterial(); } );
	folderCanv2.open();

}


function setCanvasPosition() {
	canv1XStart = params.canv1Start;
	canv2XStart = params.canv2Start;
} 


function updateMaterial() {
	if (typeof material !== 'undefined') {
		material.uniforms.dClipping1.value = params.dClipping1;
		material.uniforms.dClipping2.value = params.dClipping2;
		material.uniforms.flrClipping1.value = params.flrClipping1;
		material.uniforms.flrClipping2.value = params.flrClipping2;
		material.uniforms.xLeftClip1.value = params.xLeftClip1;
		material.uniforms.xRightClip1.value = params.xRightClip1;
		material.uniforms.xLeftClip2.value = params.xLeftClip2;
		material.uniforms.xRightClip2.value = params.xRightClip2;
	} else {
		dClipping1 = params.dClipping1;
		dClipping2 = params.dClipping2;
		flrClipping1 = params.flrClipping1;
		flrClipping2 = params.flrClipping2;
		xLeftClip1 = params.xLeftClip1;
		xRightClip1 = params.xRightClip1;
		xLeftClip2 = params.xLeftClip2;
		xRightClip2 = params.xRightClip2;
	}
}
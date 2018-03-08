var params = {
	dClipping1: 0.45,
	flrClipping1: 0.33,
	xLeftClip1: 0.1,
	xRightClip1: 1.0
};


function initGui() {

	// dat.GUI
	var gui = new dat.GUI( { width: 300 } );

	var folderCanv1 = gui.addFolder( 'Canvas1' );
	folderCanv1.add( params, 'dClipping1', 0.0, 1.0 ).step( 0.01 ).onChange( function( value ) { updateMaterial(); } );
	folderCanv1.add( params, 'flrClipping1', 0.0, 1.0 ).step( 0.01 ).onChange( function( value ) { updateMaterial(); } );
	folderCanv1.add( params, 'xLeftClip1', 0.0, 1.0 ).step( 0.01 ).onChange( function( value ) { updateMaterial(); } );
	folderCanv1.add( params, 'xRightClip1', 0.0, 1.0 ).step( 0.01 ).onChange( function( value ) { updateMaterial(); } );
	folderCanv1.open();
}


function updateMaterial() {
	if (typeof material !== 'undefined') {
		material.uniforms.dClipping1.value = params.dClipping1;
		material.uniforms.flrClipping1.value = params.flrClipping1;
		material.uniforms.xLeftClip1.value = params.xLeftClip1;
		material.uniforms.xRightClip1.value = params.xRightClip1;
	} else {
		dClipping1 = params.dClipping1;
		flrClipping1 = params.flrClipping1;
		xLeftClip1 = params.xLeftClip1;
		xRightClip1 = params.xRightClip1;
	}
}
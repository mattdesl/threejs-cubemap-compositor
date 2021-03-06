var BaseOneMaterial = require('./BaseOne');

var defaults = require('lodash.defaults');
var clonedeep = require('lodash.clonedeep');

var uniforms = {
	"cubeMap": { type: "t", value: null },
	"flipX": { type: "f", value: - 1 }
}

var vertexShader = [
	"varying vec3 vWorldPosition;",

	THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

	"void main() {",

	"	vWorldPosition = (modelMatrix * vec4( position, 1.0 )).xyz;",

	"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		THREE.ShaderChunk[ "logdepthbuf_vertex" ],

	"}"

].join("\n");

var fragmentShader = [

	"uniform samplerCube cubeMap;",
	"uniform float flipX;",

	"varying vec3 vWorldPosition;",

	THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

	"void main() {",

	"	gl_FragColor = textureCube( cubeMap, vec3( flipX * vWorldPosition.x, vWorldPosition.yz ) );",

		THREE.ShaderChunk[ "logdepthbuf_fragment" ],

	'	float fhdri_brightness = ceil(min(255.0, max(gl_FragColor.r, max(gl_FragColor.g, max(gl_FragColor.b, 1.0)))));',
	'	if(fhdri_brightness > 1.0) {',
	'		gl_FragColor.rgb /= fhdri_brightness;',
	'	}',
	// '	gl_FragColor.rgb = clamp(gl_FragColor.rgb, 0.0, 0.99);',
	'	gl_FragColor.a = 1.0 - ((fhdri_brightness - 1.0) / 255.0);',
	// '	gl_FragColor.a = 1.0;',
	// '	gl_FragColor.rgb = vec3(fhdri_brightness / 255.0);',

	// (floor(dot(l, n) * 4.0) + 1.0)/4.0;


	"}"

].join("\n");

function CubeMapEncodeFakeHdriMaterial(params) {
	params = params || {};
	defaults(params, {
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		uniforms: clonedeep(uniforms),
		side: THREE.DoubleSide
	});
	BaseOneMaterial.call(this, params);

}

CubeMapEncodeFakeHdriMaterial.prototype = Object.create(BaseOneMaterial.prototype);

module.exports = CubeMapEncodeFakeHdriMaterial;
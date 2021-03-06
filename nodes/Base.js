var Signal = require('signals').Signal;
var config = require('../config');

function CubeMapNodeBase(renderer, material, format, type) {
	type = type || config.textureType;
	this.renderer = renderer;
	var camera = new THREE.CubeCamera(0.1, 2, 256, type, format);
	var scene = new THREE.Scene();
	var cubeGeomtry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
	var cube = new THREE.Mesh(cubeGeomtry, material);
	scene.add(cube);
	scene.add(camera);
	var texture = camera.renderTarget;

	this.camera = camera;
	this.scene = scene;
	this.material = material;
	this.texture = texture;
	this.updateSignal = new Signal();

	this.update = this.update.bind(this);

	this.automaticUpdate = true;
}

CubeMapNodeBase.prototype.update = function(force) {
	if(!this.automaticUpdate && !force) return;
	this.camera.updateCubeMap(this.renderer, this.scene);
	this.updateSignal.dispatch();
}

module.exports = CubeMapNodeBase;
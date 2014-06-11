window.onload = init;

function init() {

	var canvas = document.getElementById('canvas');

	// Check support.
	if (BABYLON.Engine.isSupported()) {

		// Load the Babylon engine.
		var engine = new BABYLON.Engine(canvas, true);

		var scene = createScene(engine);

		// Attach the camera to the scene
		scene.activeCamera.attachControl(canvas);

		// Once the scene is loaded, register a render loop to render it.
		engine.runRenderLoop(function () {
			scene.render();
		});

		// Resize.
		window.addEventListener('resize', function () {
			engine.resize();
		});

	} else {
		window.alert('Your web browser is not supported.');
	}

}


function createScene(engine) {
	var scene = new BABYLON.Scene(engine);
	var light = new BABYLON.PointLight('Omni', new BABYLON.Vector3(100, 100, 0), scene);
	var camera = new BABYLON.ArcRotateCamera('camera', 0, 0.8, 100, new BABYLON.Vector3.Zero(), scene);

	var box1 = BABYLON.Mesh.CreateBox('box', 6.0, scene);
	var box2 = BABYLON.Mesh.CreateBox('box', 6.0, scene);

	box2.parent = box1;

	box1.position.x = -10;
	box2.position.x = 10;

	box1.rotation.x = Math.PI/4;

	return scene;
}
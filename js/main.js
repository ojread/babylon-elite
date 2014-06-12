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

		// When click event is fired.
		window.addEventListener("click", function (evt) {
			// Try to pick an object.
			var pickResult = scene.pick(evt.clientX, evt.clientY);
			if (pickResult.hit) {
				// Get the object that was clicked. 
				console.log(pickResult.pickedMesh);
			}

		});

	} else {
		window.alert('Your web browser is not supported.');
	}

}


function createScene(engine) {
	var scene = new BABYLON.Scene(engine);

	var light = new BABYLON.PointLight('Omni', new BABYLON.Vector3(100, 100, 0), scene);
	//var camera = new BABYLON.ArcRotateCamera('camera', 0, 0.8, 100, new BABYLON.Vector3.Zero(), scene);
	

	var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -15), scene);
	//Set the ellipsoid around the camera for collisions.
	//freeCamera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

	var floor = BABYLON.Mesh.CreatePlane('floor', 50, scene);
	floor.rotation.x = Math.PI/2;
	floor.position.y = -5;


	var box1 = BABYLON.Mesh.CreateBox('box1', 6.0, scene);
	var box2 = BABYLON.Mesh.CreateBox('box2', 6.0, scene);

	box1.position.x = -10;
	box2.position.x = 10;

	box1.rotation.x = Math.PI/4;

	/*
	// Create an animation.
	var anim = new BABYLON.Animation(
		'anim',
		'scaling.y',
		30,
		BABYLON.Animation.ANIMATIONTYPE_FLOAT,
		BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
	);

	// Key values to animate between.
	var animKeys = [];
	animKeys.push({ frame: 0, value: 1 });
	animKeys.push({ frame: 20, value: 0.2 });
	animKeys.push({ frame: 100, value: 1 });

	anim.setKeys(animKeys);
	box1.animations.push(anim);

	scene.beginAnimation(box1, 0, 100, true);*/

	scene.gravity = new BABYLON.Vector3(0, -9.81, 0);

	camera.applyGravity = true;
	camera.checkCollisions = true;

	// Enable Collisions
	scene.collisionsEnabled = true;

	// And declare which meshes could be in collision with our camera.
	floor.checkCollisions = true;
	box1.checkCollisions = true;
	box2.checkCollisions = true;

	box1.applyGravity = true;
	box2.applyGravity = true;



	// Particle emitter.
	var fountain = BABYLON.Mesh.CreateBox('fountain', 1.0, scene);
	var particleSystem = new BABYLON.ParticleSystem('particles', 2000, scene);
	
	particleSystem.emitter = fountain;
	particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0);
    particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0);

	particleSystem.particleTexture = new BABYLON.Texture('img/star.png', scene);
	//particleSystem.textureMask = new BABYLON.Color4(0.1, 0.8, 0.8, 1.0);

	particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
	particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
	particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

	particleSystem.minSize = 0.1;
	particleSystem.maxSize = 0.5;

	particleSystem.minLifeTime = 0.3;
	particleSystem.maxLifeTime = 1.5;

	particleSystem.emitRate = 1000;

	particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

	particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

	particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
	particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

	particleSystem.minAngularSpeed = 0;
	particleSystem.maxAngularSpeed = Math.PI;

	particleSystem.minEmitPower = 1;
	particleSystem.maxEmitPower = 3;

	particleSystem.updateSpeed = 0.005;

	particleSystem.start();




	// Skybox
	var skybox = BABYLON.Mesh.CreateBox('skybox', 100.0, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial('skybox', scene);
	skyboxMaterial.backFaceCulling = false;
	skybox.material = skyboxMaterial;

	// Stop the skybox from reflecting light.
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

	// Apply textures from skybox directory.
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("img/skybox/skybox", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;


	return scene;
}
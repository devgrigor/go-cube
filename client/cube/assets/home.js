'use strict';
function initCube(){
	var three = THREE;
	var back_color = new THREE.Color( 0x112000 );
	var loader = new THREE.TextureLoader();
	loader.crossOrigin = 'anonymous';
	// adding scene with correct background
	if(screen.width < 568) {
		var texture = loader.load( './images/00.jpg' );
	} else {
		var texture = loader.load( './images/00.jpg' );	
	}	
	
	var scene = new three.Scene();
	//scene.background = texture;
	var mouse = new THREE.Vector2();

	var camera = new three.PerspectiveCamera(80, window.innerWidth/window.innerHeight, 0.3, 1000);

	var renderer = new three.WebGLRenderer({ antialias: false, alpha: true});
	raycaster = new THREE.Raycaster();
	// set background color of the scene
	renderer.setClearColor( 0xffffff, 0);

	// Debuging the status of animation 
	// stats = new Stats();

	// resising the entire scene 
	if(window.innerWidth < 767) {
		console.log('sadsadsadasd');
		renderer.setSize(window.innerWidth, window.innerHeight);
	} else {
		renderer.setSize(window.innerWidth, window.innerHeight - 70);	
	}
	

	var container = document.getElementById('graph_scene');
	container.appendChild(renderer.domElement);

	var geometry = new three.BoxGeometry(3, 3, 3);

	// creating necessary textures
	var texture_1 = loader.load('./images/00.jpg'); // portfolio
	var texture_2 = loader.load('./images/00.jpg'); // about us
	var texture_3 = loader.load('./images/00.jpg'); // our team
	var texture_4 = loader.load('./images/01.jpg'); // vacancies
	var texture_5 = loader.load('./images/00.jpg'); // contact us
	var texture_6 = loader.load('./images/00.jpg'); // services
	

	// creating a material with 6 sides for cube
	var material = new three.MultiMaterial([
	    new three.MeshBasicMaterial({
	        map: texture_1
	    }),
	    new three.MeshBasicMaterial({
	        //color: 0xff0000
	        map: texture_2
	    }),
	    new three.MeshBasicMaterial({
	        //color: 0x0000ff,
	        map: texture_3
	    }),
	    new three.MeshBasicMaterial({
	        map: texture_4
	    }),
	    new three.MeshBasicMaterial({
	        map: texture_5
	    }),
	    new three.MeshBasicMaterial({
	        map: texture_6
	    })
	]);
	/* */

	// creating and setting up cube
	window.cube = new three.Mesh(geometry, material);
	cube.rotation.x = Math.PI/6;
	cube.rotation.y = Math.PI/4;
	scene.add(cube);

	camera.position.z = 5;

	/* */
	var isDragging = false;
	var previousMousePosition = {
	    x: 0,
	    y: 0
	};

	// dragging starts here also used to identify the click or mouse up in the future
	$(renderer.domElement).on('mousedown', function(e) {
	    // preventing issue with mobile devices
	    if(isDragging){
	    	return;
	    }

	    isDragging = true;
	    window.down_pos_x = e.offsetX;
	    window.down_pos_y = e.offsetY;
	}).
	// draging starts here on mobile but the second use is to make first position to prevent position change on move
	on('touchstart', function(e){
		isDragging = true;
		previousMousePosition.x = e.touches[0].clientX;
		previousMousePosition.y = e.touches[0].clientY;
	})
	.on('mousemove', function(e) {
	    var deltaMove = {
	        x: e.offsetX-previousMousePosition.x,
	        y: e.offsetY-previousMousePosition.y
	    };

	    if(isDragging) {
	        var deltaRotationQuaternion = new three.Quaternion()
	            .setFromEuler(new three.Euler(
	                toRadians(deltaMove.y * 0.5),
	                toRadians(deltaMove.x * 0.5),
	                0,
	                'XYZ'
	            ));
	        
	        cube.quaternion.multiplyQuaternions(deltaRotationQuaternion, cube.quaternion);
	    } else {
	    	updateAnimationStatus(e);
	    }
	    
	    previousMousePosition = {
	        x: e.offsetX,
	        y: e.offsetY
	    };
	})
	// spining the cube on mobile page
	.on('touchmove', function(e){
		e.preventDefault();
		if(previousMousePosition.x == 0 && previousMousePosition.y) {
			previousMousePosition.x = e.touches[0].clientX;
			previousMousePosition.y = e.touches[0].clientY;
		}

		var deltaMove = {
	        x: e.touches[0].clientX-previousMousePosition.x,
	        y: e.touches[0].clientY-previousMousePosition.y
	    };

	    if(isDragging) {
	            
	        var deltaRotationQuaternion = new three.Quaternion()
	            .setFromEuler(new three.Euler(
	                toRadians(deltaMove.y * 0.3),
	                toRadians(deltaMove.x * 0.3),
	                0,
	                'XYZ'
	            ));

	        cube.quaternion.multiplyQuaternions(deltaRotationQuaternion, cube.quaternion);
	    } else {
	    	updateAnimationStatus(e);
	    }
	    
	    previousMousePosition = {
	        x: e.touches[0].clientX,
	        y: e.touches[0].clientY
	    };
	});

	$('body').on('click', '#graph_scene>canvas', function(e){
		// checking if the click was not mouse up after drag
		if(e.offsetX == window.down_pos_x && e.offsetY == window.down_pos_y) {
			mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( (e.clientY + 70) / window.innerHeight) * 2 + 1;

			// callback for cube click hanling
			onCubeClick(e);
		}
	});
	/* */

	$(document).on('mouseup', function(e) {
	    isDragging = false;
	}).on('touchend', function(e){
		isDragging = false;
	});

	function onCubeClick(e ) {
	    e.preventDefault();	    
		
	    // Raycaster is class in tree js for picking objects from scene
	    raycaster.setFromCamera( mouse, camera );
	    var intersects = raycaster.intersectObjects( scene.children );

	    if(intersects[0]){
	    	window.clicked_on_cube = true;
	    	// rotateCubeToFace(intersects[0]);
	    	goToPage(intersects[0].face.materialIndex);	
	    }
	    
		return ;
	}

	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function(){
	    return  window.requestAnimationFrame ||
	        window.webkitRequestAnimationFrame ||
	        window.mozRequestAnimationFrame ||
	        function(callback) {
	            window.setTimeout(callback, 1000 / 60);
	        };
	})();

	var lastFrameTime = new Date().getTime() / 1000;
	var totalGameTime = 0;
	
	function update(dt, t) {	    
	    setTimeout(function() {
	        var currTime = new Date().getTime() / 1000;
	        var dt = currTime - (lastFrameTime || currTime);
	        totalGameTime += dt;
	        
	        update(dt, totalGameTime);
	    
	        lastFrameTime = currTime;
	    }, 0);
	}


	function render() {
		if(window.clicked_on_cube){
			cube.scale.x += 0.01;
			cube.scale.y += 0.01;
			cube.scale.z += 0.01;			
		} else {
			if(!window.stop_anim && !isDragging){
				cube.rotation.y += 0.01;	
			}			
		}
	    renderer.render(scene, camera);
	    
	    requestAnimFrame(render);
	}

	render();
	update(0, totalGameTime);

	function toRadians(angle) {

		return angle * (Math.PI / 180);
	}

	function toDegrees(angle) {
		return angle * (180 / Math.PI);
	}

	// function identifying the page to go o , probably will be added some animation later
	function  goToPage(page){
		switch(page) {
			case 0:
			cube.rotation.x = 1.7380982870964403;
			cube.rotation.y = 4.715887999814;
			cube.rotation.z = 1.6732201224581131;
			
			setTimeout(function(){
				window.location = 'portfolio';
			}, 1000);
			
			console.log('portfolio');
			break;

			case 1:
			cube.rotation.x = 1.7380982870964403;
			cube.rotation.y = 1.503415887999814;
			cube.rotation.z = -1.6732201224581131;
			setTimeout(function(){
				window.location = 'about-us';
			}, 1000);
			
			console.log('about us');
			break;

			case 2:
			cube.rotation.x = 1.5;
			cube.rotation.y = 0;
			cube.rotation.z = 0;
			setTimeout(function(){
				window.location = 'our-team';
			}, 1000);
			
			console.log('our team');
			break;

			case 3:
			cube.rotation.x = -1.5842122477234202;
			cube.rotation.y = 6.5417970736950044;
			cube.rotation.z = 0.048105029552876766;


			setTimeout(function(){
				window.location = 'vacancies';
			}, 1000);
			console.log('vacancies');
			break;

			case 4:
			cube.rotation.x = 0;
			cube.rotation.y = 0;
			cube.rotation.z = 0;
			setTimeout(function(){
				window.location = 'contact-us';
			}, 1000);
			
			console.log('contact us');
			break;

			case 5:
			cube.rotation.x = 3;
			cube.rotation.y = 0;
			cube.rotation.z = 3;
			setTimeout(function(){
				window.location = 'services';
			}, 1000);
			
			console.log('services');
			break;
		}
	}

	function rotateCubeToFace(obj){
		console.log(obj.point);
		cube.lookAt(obj.point);
		cube.rotation.x += obj.point.x;
		cube.rotation.y += obj.point.x;
		cube.rotation.z += obj.point.z;
		var deltaRotationQuaternion = new three.Quaternion()
            .setFromEuler(new three.Euler(
                obj.point.x,
                obj.point.y,
                0,
                'XYZ'
            ));

        //cube.quaternion.multiplyQuaternions(deltaRotationQuaternion, cube.quaternion);
		return ;
	}

	function updateAnimationStatus(e) {
		mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( (e.clientY + 70) / window.innerHeight) * 2 + 1;

		raycaster.setFromCamera( mouse, camera );
	    var intersects = raycaster.intersectObjects( scene.children );
	    
	    if(intersects[0]){
	    	$('#graph_scene').css('cursor','pointer');
	    	window.stop_anim = true;
	    } else {
	    	$('#graph_scene').css('cursor','default');
	    	window.stop_anim = false;
	    }			
	}


}

// loading cube on load
$(function(){
	$('#graph_scene').html('');
	initCube();
});

// needed for landscape or if tester desides to test on different sizes without reloading :)
$(window).on('resize', function(){
	console.log('resized');
	$('#graph_scene').html('');
	initCube();
});
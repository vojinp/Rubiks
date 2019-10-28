var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.setClearColor( 0xffffff, 1 );

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );

var controls = new THREE.OrbitControls( camera );

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 10, 10, 10 );
controls.update();
addLights();
var cubes = [];

var rotationGroup, rotationAxis, rotationDirection = true, rotationKey, isMoving;

var leftColumn = { cubes: [], axis: 'x'};
var middleColumn = { cubes: [], axis: 'x'};
var rightColumn = { cubes: [], axis: 'x'};
var topRow = { cubes: [], axis: 'y'};
var middleRow = { cubes: [], axis: 'y'};
var bottomRow = { cubes: [], axis: 'y'};
var front = { cubes: [], axis: 'z'};
var middle = { cubes: [], axis: 'z'};
var back = { cubes: [], axis: 'z'};

addGroup();
for (var i = 0; i < 3; i++) {
	for (var j = 0; j < 3; j++) {
		for (var k = 0; k < 3; k++) {
			var geometry = new THREE.BoxGeometry( 1, 1, 1 );
			var material = new THREE.MeshLambertMaterial( { vertexColors: THREE.FaceColors } );			
			var cube = new THREE.Mesh( geometry, material );

			cube.position.x += (i-1) * 1.1;
			cube.position.y += (j-1) * 1.1;
			cube.position.z += (k-1) * 1.1;
			scene.add( cube );

			// var geo = new THREE.EdgesGeometry( cube.geometry );
			// var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 5 } );
			// var wireframe = new THREE.LineSegments( geo, mat );
			// wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
			// cube.add( wireframe );

			//top
			if (j === 2) {
				cube.geometry.faces[5].color.set('red');
				cube.geometry.faces[4].color.set('red');
				topRow.cubes.push(cube);
				cube.geometry.faces[6].color.set('black');
				cube.geometry.faces[7].color.set('black');
			} 
			//middle
			else if (j === 1) {
				middleRow.cubes.push(cube);
				cube.geometry.faces[5].color.set('black');
				cube.geometry.faces[4].color.set('black');
				cube.geometry.faces[6].color.set('black');
				cube.geometry.faces[7].color.set('black');
			} 
			//bottom
			else if (j === 0) {
				cube.geometry.faces[6].color.set('orange');
				cube.geometry.faces[7].color.set('orange');
				bottomRow.cubes.push(cube);
				cube.geometry.faces[5].color.set('black');
				cube.geometry.faces[4].color.set('black');
			}

			//left
			if (i === 0) {
				cube.geometry.faces[2].color.set('blue');
				cube.geometry.faces[3].color.set('blue'); 
				leftColumn.cubes.push(cube);
				cube.geometry.faces[0].color.set('black');
				cube.geometry.faces[1].color.set('black');
			} 
			//middle
			else if (i === 1) {
				middleColumn.cubes.push(cube);
				cube.geometry.faces[0].color.set('black');
				cube.geometry.faces[1].color.set('black');
				cube.geometry.faces[2].color.set('black');
				cube.geometry.faces[3].color.set('black');
			} 
			//right
			else if (i === 2) {
				cube.geometry.faces[0].color.set('green');
				cube.geometry.faces[1].color.set('green'); 
				rightColumn.cubes.push(cube);
				cube.geometry.faces[2].color.set('black');
				cube.geometry.faces[3].color.set('black');
			}

			//back
			if (k === 0) {
				cube.geometry.faces[10].color.set(0xF5F5F5);
				cube.geometry.faces[11].color.set(0xF5F5F5);
				back.cubes.push(cube);
				cube.geometry.faces[8].color.set('black');
				cube.geometry.faces[9].color.set('black');
			} 
			//middle
			else if (k === 1) {
				middle.cubes.push(cube);
				cube.geometry.faces[8].color.set('black');
				cube.geometry.faces[9].color.set('black');
				cube.geometry.faces[10].color.set('black');
				cube.geometry.faces[11].color.set('black');
			} 
			//front
			else if (k === 2) {
				cube.geometry.faces[8].color.set('yellow');
				cube.geometry.faces[9].color.set('yellow');
				front.cubes.push(cube); 
				cube.geometry.faces[10].color.set('black');
				cube.geometry.faces[11].color.set('black');
			}
			cube.geometry.colorsNeedUpdate = true;

			cubes.push(cube);
			
		}
	}
}
// rotate(topRow, false);
// setTimeout(function() {
// 	rotate(topRow, false);
// 	setTimeout(function() {
// 		rotate(middle, false);
// 		setTimeout(function() {
// 			rotate(rightColumn, false);
// 			setTimeout(function() {
// 				rotate(bottomRow, true);
// 				setTimeout(function() {
// 					rotate(leftColumn, true);
// 					setTimeout(function() {
// 						rotate(front, true);
// 					}, 1000);
// 				}, 1000);
// 			}, 1000);
// 		}, 1000);
// 	}, 1000);
// }, 1000);


function rotate({cubes, axis}, direction) {
	rotationGroup.add(...cubes);
	rotationAxis = axis;
	rotationDirection = direction;
}

function stopRotation() {
	while(rotationGroup.children.length > 0){ 
		var cube = rotationGroup.children[0];
		if (rotationAxis === 'x') {
			if (cube.position.y === 0 && cube.position.z === 0) {

			} else if (cube.position.y === cube.position.z) {
				if (cube.position.y === 1.1) {
					rotationDirection ? topRow.cubes = removeAndAddToGroup(cube, topRow.cubes, bottomRow.cubes) : front.cubes = removeAndAddToGroup(cube, front.cubes, back.cubes);
				} else {
					rotationDirection ? bottomRow.cubes = removeAndAddToGroup(cube, bottomRow.cubes, topRow.cubes) : back.cubes = removeAndAddToGroup(cube, back.cubes, front.cubes);
				}
				rotationDirection ? cube.position.y = -cube.position.y : cube.position.z = -cube.position.z;
			} else if (cube.position.y === -cube.position.z) {
				if (cube.position.z === 1.1) {
					rotationDirection ? front.cubes = removeAndAddToGroup(cube, front.cubes, back.cubes) : bottomRow.cubes = removeAndAddToGroup(cube, bottomRow.cubes, topRow.cubes);
				} else {
					rotationDirection ? back.cubes = removeAndAddToGroup(cube, back.cubes, front.cubes) : topRow.cubes = removeAndAddToGroup(cube, topRow.cubes, bottomRow.cubes);
				}
				rotationDirection ? cube.position.z = -cube.position.z : cube.position.y = -cube.position.y;
			} else if (cube.position.y === 0) {
				if (cube.position.z === 1.1) {
					front.cubes = removeAndAddToGroup(cube, front.cubes, middle.cubes);
					middleRow.cubes = rotationDirection ? removeAndAddToGroup(cube, middleRow.cubes, bottomRow.cubes) : removeAndAddToGroup(cube, middleRow.cubes, topRow.cubes);
				} else {
					back.cubes = removeAndAddToGroup(cube, back.cubes, middle.cubes);
					middleRow.cubes = rotationDirection ? removeAndAddToGroup(cube, middleRow.cubes, topRow.cubes) : removeAndAddToGroup(cube, middleRow.cubes, bottomRow.cubes);
				}
				var temp;
				if (rotationDirection) {
					temp = cube.position.y;
					cube.position.y = -cube.position.z;
					cube.position.z = temp;
				} else {
					temp = cube.position.y;
					cube.position.y = cube.position.z;
					cube.position.z = temp;
				}
				
			} else {
				if (cube.position.y === 1.1) {
					middle.cubes = rotationDirection ? removeAndAddToGroup(cube, middle.cubes, front.cubes) : removeAndAddToGroup(cube, middle.cubes, back.cubes);
					topRow.cubes = removeAndAddToGroup(cube, topRow.cubes, middleRow.cubes);
				} else {
					middle.cubes = rotationDirection ? removeAndAddToGroup(cube, middle.cubes, back.cubes) : removeAndAddToGroup(cube, middle.cubes, front.cubes);
					bottomRow.cubes = removeAndAddToGroup(cube, bottomRow.cubes, middleRow.cubes);
				}
				var temp;
				if (rotationDirection) {
					temp = cube.position.y;
					cube.position.y = cube.position.z;
					cube.position.z = temp;
				} else {
					temp = cube.position.y;
					cube.position.y = cube.position.z;
					cube.position.z = -temp;
				}
			}
		} else if (rotationAxis === 'y') {
			if (cube.position.x === 0 && cube.position.z === 0) {

			} else if (cube.position.x === cube.position.z) {
				if (cube.position.x === 1.1) {
					rotationDirection ? front.cubes = removeAndAddToGroup(cube, front.cubes, back.cubes) : rightColumn.cubes = removeAndAddToGroup(cube, rightColumn.cubes, leftColumn.cubes);
				} else {
					rotationDirection ? back.cubes = removeAndAddToGroup(cube, back.cubes, front.cubes) : leftColumn.cubes = removeAndAddToGroup(cube, leftColumn.cubes, rightColumn.cubes);
				}
				rotationDirection ? cube.position.z = -cube.position.z : cube.position.x = -cube.position.x;
			} else if (cube.position.x === -cube.position.z) {
				if (cube.position.x === 1.1) {
					rotationDirection ? rightColumn.cubes = removeAndAddToGroup(cube, rightColumn.cubes, leftColumn.cubes) : back.cubes = removeAndAddToGroup(cube, back.cubes, front.cubes);
				} else {
					rotationDirection ? leftColumn.cubes = removeAndAddToGroup(cube, leftColumn.cubes, rightColumn.cubes) : front.cubes = removeAndAddToGroup(cube, front.cubes, back.cubes);
				}
				rotationDirection ? cube.position.x = -cube.position.x : cube.position.z = -cube.position.z;
			} else if (cube.position.z === 0) {
				if (cube.position.x === 1.1) {
					middle.cubes = rotationDirection ? removeAndAddToGroup(cube, middle.cubes, back.cubes) : removeAndAddToGroup(cube, middle.cubes, front.cubes);
					rightColumn.cubes = removeAndAddToGroup(cube, rightColumn.cubes, middleColumn.cubes);
				} else {
					middle.cubes = rotationDirection ? removeAndAddToGroup(cube, middle.cubes, front.cubes) : removeAndAddToGroup(cube, middle.cubes, back.cubes);
					leftColumn.cubes = removeAndAddToGroup(cube, leftColumn.cubes, middleColumn.cubes);
				}
				var temp;
				if (rotationDirection) {
					temp = cube.position.x;
					cube.position.x = cube.position.z;
					cube.position.z = -temp;
				} else {
					temp = cube.position.x;
					cube.position.x = cube.position.z;
					cube.position.z = temp;
				}
			} else {
				if (cube.position.z === 1.1) {
					front.cubes = removeAndAddToGroup(cube, front.cubes, middle.cubes);
					middleColumn.cubes = rotationDirection ? removeAndAddToGroup(cube, middleColumn.cubes, rightColumn.cubes) : removeAndAddToGroup(cube, middleColumn.cubes, leftColumn.cubes);
				} else {
					back.cubes = removeAndAddToGroup(cube, back.cubes, middle.cubes);
					middleColumn.cubes = rotationDirection ? removeAndAddToGroup(cube, middleColumn.cubes, leftColumn.cubes) : removeAndAddToGroup(cube, middleColumn.cubes, rightColumn.cubes);
				}
				var temp;
				if (rotationDirection) {
					temp = cube.position.x;
					cube.position.x = cube.position.z;
					cube.position.z = temp;
				} else {
					temp = cube.position.x;
					cube.position.x = -cube.position.z;
					cube.position.z = temp;
				}
			}
		} if (rotationAxis === 'z') {
			if (cube.position.x === 0 && cube.position.y === 0) {

			} else if (cube.position.x === cube.position.y) {
				if (cube.position.x === 1.1) {
					rotationDirection ? rightColumn.cubes = removeAndAddToGroup(cube, rightColumn.cubes, leftColumn.cubes) : topRow.cubes = removeAndAddToGroup(cube, topRow.cubes, bottomRow.cubes);

				} else {
					rotationDirection ? leftColumn.cubes = removeAndAddToGroup(cube, leftColumn.cubes, rightColumn.cubes) : bottomRow.cubes = removeAndAddToGroup(cube, bottomRow.cubes, topRow.cubes);
				}
				rotationDirection ? cube.position.x = -cube.position.x : cube.position.y = -cube.position.y;
			} else if (cube.position.x === -cube.position.y) {
				if (cube.position.x === 1.1) {
					rotationDirection ? bottomRow.cubes = removeAndAddToGroup(cube, bottomRow.cubes, topRow.cubes) : rightColumn.cubes = removeAndAddToGroup(cube, rightColumn.cubes, leftColumn.cubes);
				} else {
					rotationDirection ? topRow.cubes = removeAndAddToGroup(cube, topRow.cubes, bottomRow.cubes) : leftColumn.cubes = removeAndAddToGroup(cube, leftColumn.cubes, rightColumn.cubes);
				}
				rotationDirection ? cube.position.y = -cube.position.y : cube.position.x = -cube.position.x;
			} else if (cube.position.y === 0) {
				if (cube.position.x === 1.1) {
					middleRow.cubes = rotationDirection ? removeAndAddToGroup(cube, middleRow.cubes, topRow.cubes) : removeAndAddToGroup(cube, middleRow.cubes, bottomRow.cubes);
					rightColumn.cubes = removeAndAddToGroup(cube, rightColumn.cubes, middleColumn.cubes);
				} else {
					middleRow.cubes = rotationDirection ? removeAndAddToGroup(cube, middleRow.cubes, bottomRow.cubes) : removeAndAddToGroup(cube, middleRow.cubes, topRow.cubes);
					leftColumn.cubes = removeAndAddToGroup(cube, leftColumn.cubes, middleColumn.cubes);
				}
				var temp;
				if (rotationDirection) {
					temp = cube.position.x;
					cube.position.x = cube.position.y;
					cube.position.y = temp;
				} else {
					temp = cube.position.x;
					cube.position.x = cube.position.y;
					cube.position.y = -temp;
				}
				
			} else {
				if (cube.position.y === 1.1) {
					topRow.cubes = removeAndAddToGroup(cube, topRow.cubes, middleRow.cubes);
					middleColumn.cubes = rotationDirection ? removeAndAddToGroup(cube, middleColumn.cubes, leftColumn.cubes) : removeAndAddToGroup(cube, middleColumn.cubes, rightColumn.cubes);
				} else {
					bottomRow.cubes = removeAndAddToGroup(cube, bottomRow.cubes, middleRow.cubes);
					middleColumn.cubes = rotationDirection ? removeAndAddToGroup(cube, middleColumn.cubes, rightColumn.cubes) : removeAndAddToGroup(cube, middleColumn.cubes, leftColumn.cubes);
				}
				var temp;
				if (rotationDirection) {
					temp = cube.position.x;
					cube.position.x = -cube.position.y;
					cube.position.y = temp;
				} else {
					temp = cube.position.x;
					cube.position.x = cube.position.y;
					cube.position.y = temp;
				}
			}
		}
		scene.add(cube)
		swapColors(cube)
		cube.geometry.colorsNeedUpdate = true;
	}

	rotationGroup.rotation.set(0,0,0);

	function removeAndAddToGroup(cube, removeGroup, addGroup) {
		removeGroup = removeGroup.filter(function(value, index, arr){
			return value.uuid !== cube.uuid
		});
		addGroup.push(cube);
		return removeGroup;
	}

	function swapColors(cube) {
		var temp;
		var sides = [];
		if (rotationAxis === 'x') {
			sides = [4, 10, 6, 8];
		} else if (rotationAxis === 'y') {
			sides = [8, 2, 10, 0];
		} else if (rotationAxis === 'z') {
			sides = [4, 0, 6, 2];
		}
		if (!rotationDirection) {
			sides.reverse();
		}
		temp = JSON.parse(JSON.stringify(cube.geometry.faces[sides[0]].color));
		for(let i in sides) {
			try {
				cube.geometry.faces[sides[i]].color.set(cube.geometry.faces[sides[+i + 1]].color);
				cube.geometry.faces[sides[i]+ 1].color.set(cube.geometry.faces[sides[+i + 1]].color);
			} catch {
				cube.geometry.faces[sides[i]].color.set(temp);
				cube.geometry.faces[sides[i]+ 1].color.set(temp);
			}
		}
	}
}

function addGroup() {
	rotationGroup = new THREE.Mesh( new THREE.BoxGeometry( 0,0,0 ) );
	rotationGroup.material.visible = false;
	scene.add( rotationGroup );
}

function addLights() {
	for (var i = -2; i <= 2; i+= 1) {
		for (var j = -2; j <= 2; j+= 1) {
			for (var k = -2; k <= 2; k+= 2) {
				// if (i !== 0 && j !== 0 && k !== 0)
				// 	continue;
				var light = new THREE.PointLight( 0xffffff, 0.5, 5 );
				light.position.set( i, j, k );
				scene.add( light );
			}
		}
	}
	
}

var onKeyDown = function ( event ) {
	var key;
	var isShift;
	if (window.event) {
		key = window.event.keyCode;
		isShift = !!window.event.shiftKey; // typecast to boolean
	} else {
		key = ev.which;
		isShift = !!ev.shiftKey;
	}
	if (isMoving) return;
	
	switch ( event.keyCode ) {
		case 70: // f
			rotate(front, isShift);
			break;
		case 66: // b
			rotate(back, isShift);
			break;
		case 76: // l
			rotate(leftColumn, isShift);
			break;
		case 82: // r
			rotate(rightColumn, isShift);
			break;
		case 85: // u
			rotate(topRow, isShift);
			break;
		case 68: // d
			rotate(bottomRow, isShift);
			break;
		default:
			break;
	}
};
document.addEventListener( 'keydown', onKeyDown, false );

function animate() {
	requestAnimationFrame( animate );
	if (rotationGroup.children.length > 0) {
		isMoving = true;
	}
	if (rotationDirection) {
		rotationGroup.rotation[rotationAxis] += 0.04;
		if (rotationGroup.rotation[rotationAxis] >= Math.PI / 2) {
			rotationGroup.rotation[rotationAxis] = Math.PI / 2;
			stopRotation();
			rotationAxis = null;
			isMoving = false;
		}
	} else {
		rotationGroup.rotation[rotationAxis] -= 0.04;
		if (rotationGroup.rotation[rotationAxis] <=  -Math.PI / 2) {
			rotationGroup.rotation[rotationAxis] = -Math.PI / 2;
			stopRotation();
			rotationAxis = null;
			isMoving = false;
		}
	} 

	
	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();

	renderer.render( scene, camera );

}
animate();
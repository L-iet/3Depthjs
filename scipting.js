let engine = Matter.Engine.create();
let render = Matter.Render.create({
	element: document.body,
	engine: engine,
	options:{
		width: window.innerWidth,
		height: window.innerHeight,
		wireframes: false,
		background:"rgb(220, 220, 220)"
	}
});

let layer0_b =[
	[1,1,0,1,1,1,1,1,1,1,1,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,0,1,1,1],
	[1,1,1,0,0,1,1,0,0,0,0,0,1],
	[1,0,0,0,0,1,1,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,1,1,1,1,0,0,1,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,0,0,0,0,1],
	[1,1,1,0,0,0,0,1,0,0,1,1,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1]];

var cam_offset = Matter.Vector.create(0,0);

var bricks = [];

var boxA = Matter.Bodies.polygon(170, 100, 8, 30, {restitution: 0.4, render:{fillStyle: "rgb(52, 152, 219)"} }); //rgb(52, 152, 219)

var leftbtn = document.getElementById("left-arrow");
var rightbtn = document.getElementById("right-arrow");

let keymap = {
	"up":false,
	"down":false,
	"left":false,
	"right":false,
	't': false,
	'g':false
}


var wrapper = document.getElementById('counter');
var counter;
var count = 0;
var leftouch = false; var rightouch = false;


function display_layer(cam_offset, layer_b){
	layer_b.forEach(function(row, ind){
		row.forEach(function(block, ind2){
			if(layer_b[ind][ind2] == 1){
				let brick = Matter.Bodies.rectangle(ind2*40 + 30 + cam_offset.x, ind*40 + 30 + cam_offset.y, 40, 40, {isStatic: true, render: {fillStyle:"rgb(149, 165, 166)"} });
				bricks.push(brick);
			}
		})
	})
}

function move_layer(cam_offset, direction, layer_b){
	bricks.forEach(function (brick, ind){
		Matter.Composite.remove(engine.world, brick)
	});
	bricks = []
	Matter.Composite.remove(engine.world, boxA)
	display_layer(cam_offset, layer_b)
	Matter.Body.setPosition(boxA, Matter.Vector.add(boxA.position, direction))
	Matter.World.add(engine.world, [boxA, ...bricks]);
}

display_layer(cam_offset, layer0_b);

leftbtn.addEventListener("touchstart",
		function(){
			leftouch = true;
		});
leftbtn.addEventListener("touchend",
		function(){
			leftouch = false;
		});

/*leftbtn.addEventListener("mousedown",
		function(){
			leftouch = true
		});*/

/*leftbtn.addEventListener("mouseup",
		function(){
			leftouch = false
		});*/

rightbtn.addEventListener("touchstart",
		function(){
			rightouch = true
		});
rightbtn.addEventListener("touchend",
		function(){
			rightouch = false
		});
/*rightbtn.addEventListener("mousedown",
		function(){
			rightouch = true
		});*/
/*rightbtn.addEventListener("mouseup",
		function(){
			rightouch = false
		});*/

setInterval(function(){
	if (leftouch) {
		Matter.Body.applyForce(boxA, boxA.position, {x:-0.01, y:0});
	}
	if (rightouch){
		Matter.Body.applyForce(boxA, boxA.position, {x:0.01, y:0});
	}
}, 1);


document.addEventListener("keydown", (event) => {
	if (event.key == "ArrowRight")
		keymap["right"] = true;
	else if (event.key == "ArrowLeft")
		keymap["left"] = true;
	else if (event.key == "ArrowUp")
		keymap["up"] = true;
	else if (event.key == 't')
		keymap['t'] = true;
	else if (event.key == 'g')
		keymap['g'] = true;
	
})

document.addEventListener("keyup", (event) => {
	if (event.key == "ArrowRight")
		keymap["right"] = false;
	else if (event.key == "ArrowLeft")
		keymap["left"] = false;
	else if (event.key == "ArrowUp")
		keymap["up"] = false;
	else if (event.key == 't')
		keymap['t'] = false;
	else if (event.key == 'g')
		keymap['g'] = false;
})


Matter.World.add(engine.world, [boxA, ...bricks]);
Matter.Runner.run(engine);
function updateRender(){
	if (keymap["right"])Matter.Body.applyForce(boxA, boxA.position, {x: 0.01, y: 0}); // Matter.Body.setVelocity(boxA, {x:0.01, y:0}); //
	else if (keymap["left"]) Matter.Body.applyForce(boxA, boxA.position, {x:-0.01, y:0});
	else if (keymap["up"]) Matter.Body.applyForce(boxA, boxA.position, {x:0, y:-0.01});
	if (keymap['t']) {
		direction = Matter.Vector.create(0, 6)
		cam_offset = Matter.Vector.add(cam_offset,direction);
		move_layer(cam_offset, direction, layer0_b);
	}

	if (keymap['g']){
		direction = Matter.Vector.create(0, -6)
		cam_offset = Matter.Vector.add(cam_offset, direction);
		move_layer(cam_offset, direction, layer0_b);
	}

	requestAnimationFrame(updateRender);
}
window.requestAnimationFrame(updateRender)

Matter.Render.run(render);


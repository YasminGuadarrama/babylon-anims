var canvas = document.getElementById("renderCanvas");
var meshlist = [];
var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };
var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    var newsphere = createSphere(0, 1, 1, 2);
    newsphere.material = hexMat("#5D3FD3");
    
    var newbox = createBox(1, 2, 3, 2, 2, 2);
    newbox.material = hexMat("#7393B3");


    var anim_1 = {subj: newsphere.position, prop: 'x', val: 3};
    var anim_2 = {subj: newsphere.material, prop: 'alpha', val: 2};
    var anim_3 = {subj: newbox.rotation, prop: 'z', val: Math.PI*2};
    var anim_4 = {subj: newbox.rotation, prop: 'y', val: Math.sin(Math.PI)};
    var anim_5 = {subj: newbox.material, prop: 'alpha', val: 0};
    var anim_6 = {subj: newsphere.position, prop: 'alpha', val: 0};
    var anim_7 = {subj: newbox.rotation, prop: 'y', val: Math.cos(Math.PI)};
    var anim_8 = {subj: newbox.material, prop: 'x', val: 3};
    var anims = [anim_1, anim_2, anim_3, anim_4, anim_5, anim_6, anim_7, anim_8];

    animate(anims, scene, 3, true);
    
    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    return scene;
};
window.initFunction = async function () {
    var asyncEngineCreation = async function () {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = createScene();
};
initFunction().then(() => {
    sceneToRender = scene
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});



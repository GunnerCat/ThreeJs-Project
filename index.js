import * as THREE from './three.js/three.js/build/three.module.js';
import * as tGeo from './three.js/three.js/examples/jsm/geometries/TextGeometry.js';
import * as tFont from './three.js/three.js/examples/jsm/loaders/FontLoader.js';
import * as controlLib from './three.js/three.js/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from './three.js/three.js/examples/jsm/loaders/GLTFLoader.js'

let scene,renderer,camera,control,mouse

let init = () =>{
    scene = new THREE.Scene()

    let fov=45
    let ratio = window.innerWidth/window.innerHeight
    camera = new THREE.PerspectiveCamera(fov, ratio)
    camera.position.set(0,-50,70)
    camera.lookAt(0,0,0)

    renderer = new THREE.WebGLRenderer ({
        antialias:true,
    })

    renderer.setSize(window.innerWidth,window.innerHeight)
    document.body.appendChild(renderer.domElement)

    control = new controlLib.OrbitControls(camera,renderer.domElement)
    renderer.shadowMap.enabled = true
}

let createSkyBox=()=>{
    scene.background = new THREE.CubeTextureLoader()
	.setPath( './assets/skybox' )
    .load( [
		'/px.jpg',
		'/nx.jpg',
		'/py.jpg',
		'/ny.jpg',
		'/pz.jpg',
		'/nz.jpg'
	] );
}
let createAmbientLight=()=>{
    let ambientLight = new THREE.AmbientLight(0xffffff,1)
    return ambientLight
}

let createPointLight=()=>{
    let pointLight = new THREE.PointLight(0xffffff,1)
    pointLight.castShadow=true
    return pointLight
}
let createlightHelper = (light)=>{
    let helper = ""
    if(light.type=="PointLight"){
        return new THREE.PointLightHelper(light)
    }
}
let createCircle=()=>{
    let geometry= new THREE.CircleGeometry(14.5,40)
    let texture = new THREE.TextureLoader().load('./assets/texture/snowtexture.png')
    let material= new THREE.MeshStandardMaterial({
        side:THREE.DoubleSide,
        map:texture,
    })
    const circle = new THREE.Mesh(geometry,material)
    circle.receiveShadow=true
    return circle
}
let createCylinder=()=>{
    let geometry = new THREE.CylinderGeometry(15,20,4,8)
    let material = new THREE.MeshBasicMaterial({
        color:0x000000,
    })
    let base = new THREE.Mesh(geometry,material)

    return base
}

let createString=()=>{
    let string = new tGeo.TextGeometry("test")
}
let createGlobe=()=>{
    let geometry = new THREE.SphereGeometry(14.5,32,16,1,6.3,1.1,3)
    let material = new THREE.MeshLambertMaterial({
        transparent:true,
        // side:THREE.DoubleSide,
        opacity:0.4
    })
    let globe = new THREE.Mesh(geometry,material)
    
    return globe

}
let createSphere=(radius)=>{
    let geometry=new THREE.SphereGeometry(radius,32,6)
    let material = new THREE.MeshStandardMaterial({
        color:0xffffff
    })
    let snowMan = new THREE.Mesh(geometry,material)
    snowMan.castShadow=true
    return snowMan
}
let createSnowmanButton=()=>{
    let geometry=new THREE.SphereGeometry(0.1,32,6)
    let material = new THREE.MeshBasicMaterial({
        color:0x000000
    })
    let snowMan = new THREE.Mesh(geometry,material)
    snowMan.castShadow=true
    return snowMan
}
let createCone=(radius,height,radSeg,color)=>{
    let geometry=new THREE.ConeGeometry(radius,height,radSeg)
    let material = new THREE.MeshBasicMaterial({
        color:color
    })
    let cone = new THREE.Mesh(geometry,material)
    cone.castShadow=true
    return cone

}

let createText=()=>{
    let loader = new tFont.FontLoader()
    loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/droid/droid_sans_bold.typeface.json',font=>{
        let TextGeometry = new tGeo.TextGeometry("Snowman",{
            font: font,
            size: 2,
            height: 0,
   
        })

        let textMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
        let text = new THREE.Mesh(TextGeometry, textMaterial)
        text.position.set(2,-19,-2.5)
        text.rotateX(1)
        text.rotateY(0.37)
        text.rotateZ(0.2)
        scene.add(text)
    })
}
let createBox=()=>{
    let geometry = new THREE.BoxGeometry(0.5,7,0.5)
    let material = new THREE.MeshPhongMaterial({
        color:0x3f301d,
    })
    let box = new THREE.Mesh(geometry,material)
    box.castShadow=true
    return box
}

let keyListener = (e) =>{
    let keyCode = e.keyCode
    
    if(keyCode==32 && (camera.position.x!=0 || camera.position.y!=-50)){
        camera.position.set(0,-50,70)
    }
    
    if(keyCode==32 && camera.position.z>10){
        let delay = setInterval(()=>{
            if(camera.position.z > 10){
             camera.position.z-=0.5
            }else{
             clearInterval(delay);
            }
         }, 10)
    }

    
}
let snowfall=(snow)=>{
    let delay = setInterval(()=>{
        if(snow.position.z >0){
         snow.position.z-=0.1
        }else{
         clearInterval(delay);
        }
     }, 10)
}

let createSnow=(snow)=>{
    snow.position.set(Math.floor(Math.random()*20)-10,Math.floor(Math.random()*20)-10,Math.floor(Math.random()*15))
    scene.add(snow)
}
let onMouseClick=()=>{
    const raycasting = new THREE.Raycaster()
    raycasting.setFromCamera(mouse,camera)
    
    const intersect = raycasting.intersectObjects(scene.children)
    if(intersect.length > 0){
        let snow=[10]
        for (let l = 1; l <=100; l++) {
            snow[l] = createSphere(0.1)
            createSnow(snow[l])
            snowfall(snow[l])
        }             
    }
}

let addEventListener = () =>{
    document.addEventListener("keydown", keyListener)
    document.addEventListener("click", onMouseClick)
}

let loadItem = () =>{
    const loader = new GLTFLoader()
    loader.load('assets/model/scene.gltf', (gltf) =>
        {
            let obj = gltf.scene
            obj.scale.set(20,20,20)
            obj.position.set(-69, 50, -1)
            obj.rotateX(Math.PI/2)
            obj.castShadow = true
            obj.receiveShadow = true
            scene.add(obj)
        }
        )
    }
    
    

window.onmousemove = (e) => {
    mouse = new THREE.Vector2()
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
}

window.onresize = () => {
    renderer.setSize(innerWidth, innerHeight)
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectMatrix()
}

window.onload=()=>{
    init()
    createSkyBox()
    let ambientLight = createAmbientLight()
    scene.add(ambientLight)
    

    //light
    let pointLight = createPointLight()
    pointLight.position.set(0, 0, 10)
    scene.add(pointLight)

    //ground
    let ground = createCircle()
    scene.add(ground)
    //base
    let base = createCylinder()
    base.name="base"
    base.position.set(0,0,-2.1)
    base.rotateX(1.57)
    scene.add(base)
    //globe
    let globe = createGlobe()
    globe.name="globe"
    globe.position.set(0,0,2)
    globe.rotateX(1.57)
    globe.rotateZ(3.1)
    scene.add(globe)

    //snowman parts
    let baseSnowman = createSphere(1.5)
    baseSnowman.position.set(8,-5,1)
    scene.add(baseSnowman)
    let midSnowman= createSphere(1)
    midSnowman.position.set(8,-5,3)
    scene.add(midSnowman)
    let upperSnowman= createSphere(0.8)
    upperSnowman.position.set(8,-5,4)
    scene.add(upperSnowman)

    let snowmanEye= createSnowmanButton()
    snowmanEye.position.set(7.7,-5.8,4.3)
    scene.add(snowmanEye)
    let snowmanEye2= createSnowmanButton()
    snowmanEye2.position.set(8.2,-5.8,4.3)
    scene.add(snowmanEye2)
    
    let snowmanNose =createCone(0.15,0.5,32,0xFFA500)
    snowmanNose.position.set(8,-5.8,4)
    snowmanNose.rotateX(Math.PI )
    scene.add(snowmanNose)
    
    let snowmanButton1= createSnowmanButton()
    snowmanButton1.position.set(8,-6,2.5)
    scene.add(snowmanButton1)
    let snowmanButton2= createSnowmanButton()
    snowmanButton2.position.set(8,-6,3)
    scene.add(snowmanButton2)
    let snowmanButton3= createSnowmanButton()
    snowmanButton3.position.set(8,-6,3.5)
    scene.add(snowmanButton3)
    createText()

    //tree
    let trunk1 = createBox()
    trunk1.rotateX(Math.PI/2)
    trunk1.position.set(-7,5,0)
    scene.add(trunk1)

    let trunk2 = createBox()
    trunk2.rotateX(Math.PI/2)
    trunk2.position.set(-9,2,0)
    scene.add(trunk2)
    let leaf1 = createCone(1.5,5,32,0x32612D)
    leaf1.rotateX(Math.PI/2)
    leaf1.position.set(-7,5,6)
    scene.add(leaf1)
    let leaf2 = createCone(1.5,5,32,0x32612D)
    leaf2.rotateX(Math.PI/2)
    leaf2.position.set(-9,2,6)
    scene.add(leaf2)

    //snow


    //House
    loadItem()
    
    // let text = createText()


    
    addEventListener();
    // text.position.set(0,0,3)
    // text.rotateX(1)
    // text.rotateY(0.37)
    // text.rotateZ(0.2)
    // scene.add(text)
    let render=()=>{
        requestAnimationFrame(render)
        camera.lookAt(0,0,0)
        renderer.render(scene,camera)
        // renderer.setAnimationLoop(animate())
    }
    render()
    control.update()

}

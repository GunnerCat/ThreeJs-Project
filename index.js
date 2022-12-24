import * as THREE from './three.js/three.js/build/three.module.js';
import * as tGeo from './three.js/three.js/examples/jsm/geometries/TextGeometry.js';
import * as tFont from './three.js/three.js/examples/jsm/loaders/FontLoader.js';
import * as controlLib from './three.js/three.js/examples/jsm/controls/OrbitControls.js'

let scene,renderer,camera,control

let init = () =>{
    scene = new THREE.Scene()

    let fov=45
    camera = new THREE.PerspectiveCamera(fov)
    camera.position.set(0,-50,20)
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
    const skyBox = new THREE.Mesh()
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
let createSnowman=(radius)=>{
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

let render=()=>{
    requestAnimationFrame(render)
    renderer.render(scene,camera)
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
    base.position.set(0,0,-2.1)
    base.rotateX(1.57)
    scene.add(base)
    //globe
    let globe = createGlobe()
    globe.position.set(0,0,2)
    globe.rotateX(1.57)
    globe.rotateZ(3.1)
    scene.add(globe)
    //snowman parts
    let baseSnowman = createSnowman(1.5)
    baseSnowman.position.set(5,-5,1)
    scene.add(baseSnowman)
    let midSnowman= createSnowman(1)
    midSnowman.position.set(5,-5,3)
    scene.add(midSnowman)
    let upperSnowman= createSnowman(0.8)
    upperSnowman.position.set(5,-5,4)
    scene.add(upperSnowman)

    let snowmanEye= createSnowmanButton()
    snowmanEye.position.set(4.7,-5.8,4.3)
    scene.add(snowmanEye)
    let snowmanEye2= createSnowmanButton()
    snowmanEye2.position.set(5.2,-5.8,4.3)
    scene.add(snowmanEye2)
    
    let snowmanNose =createCone(0.15,0.5,32,0xFFA500)
    snowmanNose.position.set(5,-5.8,4)
    scene.add(snowmanNose)
    
    let snowmanButton1= createSnowmanButton()
    snowmanButton1.position.set(5,-6,2.5)
    scene.add(snowmanButton1)
    let snowmanButton2= createSnowmanButton()
    snowmanButton2.position.set(5,-6,3)
    scene.add(snowmanButton2)
    let snowmanButton3= createSnowmanButton()
    snowmanButton3.position.set(5,-6,3.5)
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

    // let text = createText()

    // text.position.set(0,0,3)
    // text.rotateX(1)
    // text.rotateY(0.37)
    // text.rotateZ(0.2)
    // scene.add(text)


    render()
    control.update()

}
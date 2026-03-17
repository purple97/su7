import * as THREE from 'three';
import { Car } from './Car';
import { StartRoom } from './StartRoom';
//@ts-ignore
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export class World {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private car?: Car;
    private startRoom: StartRoom;

    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        this.scene = scene;
        this.camera = camera;
        this.startRoom = new StartRoom(scene, camera);
        this.setup();
    }

    private setup(): void {
        // 添加地面
        this.createGround();
        // 添加环境光和平行光
        this.createLights();
    }

    // 恢复原有的简单地面材质
    private createGround(): void {
        const groundGeometry = new THREE.PlaneGeometry(100, 100);  // 加大地面

        // 使用 MeshPhysicalMaterial 实现反光地面
        const groundMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x888888,       // 浅灰色，更容易看到影子
            roughness: 0.15,       // 略微粗糙
            metalness: 0.3,       // 增加金属感
            reflectivity: 0.6,    // 反射强度
            clearcoat: 0.3,       // 清漆层
            clearcoatRoughness: 0.1,
        });

        // const textureLoader = new THREE.TextureLoader();

        // textureLoader.load('/texture/t_floor_normal.webp', (normalMap) => {
        //     normalMap.wrapS = THREE.RepeatWrapping;
        //     normalMap.wrapT = THREE.RepeatWrapping;
        //     normalMap.repeat.set(4, 4);
        //     groundMaterial.normalMap = normalMap;
        //     groundMaterial.normalScale.set(0.3, 0.3);
        // });

        // textureLoader.load('/texture/t_floor_roughness.webp', (roughnessMap) => {
        //     roughnessMap.wrapS = THREE.RepeatWrapping;
        //     roughnessMap.wrapT = THREE.RepeatWrapping;
        //     roughnessMap.repeat.set(4, 4);
        //     groundMaterial.roughnessMap = roughnessMap;
        //     groundMaterial.roughnessMapIntensity = 0.5;
        // });

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        ground.receiveShadow = true;

        ground.scale.set(2, 2, 2);

        this.scene.add(ground);

        // 不再设置黑色背景，让背景保持 SceneManager 中的设置
        // 移除 fog 或者使用不那么黑的值
        // this.scene.fog = new THREE.Fog(0x111111, 20, 50);
    }

    private createLights(): void {
        // 环境光 - 提供基础照明
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        // 主平行光 - 模拟太阳光
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(5, 5, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 20;
        mainLight.shadow.radius = 8;
        mainLight.shadow.bias = -0.001;
        this.scene.add(mainLight);

        // 添加冷色调平行光
        const coldLight = new THREE.DirectionalLight(0x6495ED, 0.3);
        coldLight.position.set(-3, 4, -2);
        this.scene.add(coldLight);

        // 添加上方聚光灯 - 从头顶照射汽车
        const topLight = new THREE.SpotLight(0xffffff, 30);  // 强度30
        topLight.position.set(0, 6, 0);  // 提高位置
        topLight.target.position.set(0, 0, 0);  // 照射到汽车位置
        topLight.angle = Math.PI / 5;  // 扩大照射角度
        topLight.penumbra = 0.3;  // 边缘柔和度
        topLight.decay = 1.5;  // 衰减
        topLight.distance = 15;  // 照射距离
        topLight.castShadow = true;
        topLight.shadow.mapSize.width = 2048;  // 提高阴影质量
        topLight.shadow.mapSize.height = 2048;
        topLight.shadow.bias = -0.0001;
        this.scene.add(topLight);
        this.scene.add(topLight.target);

        // 调整雾效果 - 注释掉，避免再次添加 fog
        // if (this.scene.background instanceof THREE.Color) {
        //     this.scene.fog = new THREE.Fog(this.scene.background, 20, 60);
        // }
    }

    public addCar(carGltf: GLTF): void {
        this.car = new Car(this.scene, carGltf);
    }

    public update(time: number): void {
        // 更新汽车
        this.car?.update();
        // 更新 StartRoom（反射效果）
        this.startRoom.update(time);
    }
} 
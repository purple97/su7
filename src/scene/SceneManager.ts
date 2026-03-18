import * as THREE from "three";
import { World } from '../world/World';
//@ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//@ts-ignore
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';

export class SceneManager {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
    private composer: EffectComposer;
    private container: HTMLElement;
    private world: World;

    constructor(container: HTMLElement) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);

        // 初始化相机
        this.camera = new THREE.PerspectiveCamera(
            50,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(3, 2, 3);
        this.camera.lookAt(0, 0, 0);

        // 初始化渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        container.appendChild(this.renderer.domElement);

        // 设置后期处理
        this.setupPostProcessing();

        // 初始化控制器
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // 初始化世界
        this.world = new World(this.scene, this.camera);

        // 处理窗口大小变化
        window.addEventListener('resize', this.handleResize.bind(this));

        // 开始动画循环
        this.animate();

        this.setupLights();
    }

    private setupLights() {
        // 添加环境光以补充整体照明
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);  // 增加环境光强度
        this.scene.add(ambientLight);
    }

    public addCar(carGltf: GLTF): void {
        this.world.addCar(carGltf);
    }

    private setupPostProcessing(): void {
        // 创建效果合成器
        this.composer = new EffectComposer(this.renderer);

        // 添加渲染通道
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // 添加景深效果
        const bokehPass = new BokehPass(this.scene, this.camera, {
            focus: 3.0,      // 减小焦点距离，使汽车更清晰
            aperture: 0.0005, // 减小光圈，降低模糊程度
            maxblur: 0.005,  // 减小最大模糊值
            width: this.container.clientWidth,
            height: this.container.clientHeight
        });
        this.composer.addPass(bokehPass);
    }

    private handleResize(): void {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.composer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    private animate(): void {
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        // 传入时间参数用于反射更新
        this.world.update(performance.now() / 1000);
        this.composer.render();
    }
} 
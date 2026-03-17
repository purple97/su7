import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { ReflectFloorMaterial } from '../materials/ReflectFloorMaterial';

export class StartRoom {
    private scene: THREE.Scene;
    private room: THREE.Group | null = null;
    private envMap: THREE.Texture | null = null;
    private lights: THREE.Light[] = [];
    private floorMaterial: ReflectFloorMaterial | null = null;
    private renderTarget: THREE.WebGLRenderTarget | null = null;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;

    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        this.scene = scene;
        this.camera = camera;
        // 创建渲染器用于反射渲染
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.init();
    }

    private async init(): Promise<void> {
        // 创建渲染目标
        this.renderTarget = new THREE.WebGLRenderTarget(
            window.innerWidth,
            window.innerHeight,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                colorSpace: THREE.SRGBColorSpace
            }
        );

        await Promise.all([
            this.loadEnvironmentMap(),
            this.loadRoom()
        ]);
        this.setupLights();
    }

    private setupLights(): void {
        // 清除之前的灯光
        this.lights.forEach(light => this.scene.remove(light));
        this.lights = [];

        // 创建多个方向的平行光
        const directionalLights = [
            { position: [5, 10, 5], intensity: 1.0, color: 0xffffff },    // 主光源
            { position: [-5, 8, -5], intensity: 0.6, color: 0xffffff },   // 背光
            { position: [5, 6, -5], intensity: 0.4, color: 0xffffff },    // 侧光1
            { position: [-5, 6, 5], intensity: 0.4, color: 0xffffff }     // 侧光2
        ];

        directionalLights.forEach(({ position, intensity, color }) => {
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(position[0], position[1], position[2]);

            // 只让主光源产生阴影，避免多重阴影计算
            if (position[1] === 10) {  // 主光源
                light.castShadow = true;
                light.shadow.mapSize.width = 2048;
                light.shadow.mapSize.height = 2048;
                light.shadow.camera.near = 1;
                light.shadow.camera.far = 30;
                light.shadow.radius = 4;
                light.shadow.bias = -0.0001;

                // 设置平行光的阴影相机范围
                const shadowCameraSize = 10;
                light.shadow.camera.left = -shadowCameraSize;
                light.shadow.camera.right = shadowCameraSize;
                light.shadow.camera.top = shadowCameraSize;
                light.shadow.camera.bottom = -shadowCameraSize;
            }

            this.lights.push(light);
        });

        // 环境光 - 提供基础环境照明
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);  // 降低环境光强度
        this.lights.push(ambientLight);

        // 添加所有灯光到场景
        this.lights.forEach(light => this.scene.add(light));

        // 设置场景的基础颜色
        // this.scene.background = new THREE.Color(0x1a1a1a);
    }

    private async loadEnvironmentMap(): Promise<void> {
        // 创建临时渲染器用于生成环境贴图
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();

        // 加载HDR环境贴图
        const rgbeLoader = new RGBELoader();
        try {
            const hdrTexture = await rgbeLoader.loadAsync('/texture/t_env_light.hdr');
            hdrTexture.mapping = THREE.EquirectangularReflectionMapping;

            // 生成预处理的环境贴图
            const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;
            hdrTexture.dispose();

            // 设置场景的环境贴图
            this.envMap = envMap;
            this.scene.environment = envMap;

            // 设置场景背景（可选）
            // this.scene.background = envMap;
        } catch (error) {
            console.error('加载环境贴图失败:', error);
        }

        // 清理
        pmremGenerator.dispose();
        renderer.dispose();
    }

    private async loadRoom(): Promise<void> {
        const gltfLoader = new GLTFLoader();
        const roomGltf = await gltfLoader.loadAsync('/mesh/sm_startroom.raw.gltf');
        this.room = roomGltf.scene;

        // 加载房间的环境光遮蔽贴图
        const textureLoader = new THREE.TextureLoader();
        const aoTexture = await textureLoader.loadAsync('/texture/t_startroom_ao.raw.jpg');
        const lightTexture = await textureLoader.loadAsync('/texture/t_startroom_light.raw.jpg');

        if (this.room) {
            // 创建反射地板材质
            this.floorMaterial = new ReflectFloorMaterial();

            // 打印所有 mesh 名字用于调试
            const meshNames: string[] = [];

            // 设置房间材质 - 通过 mesh 名字或位置判断是否是地板
            this.room.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    meshNames.push(child.name || 'unnamed');

                    // 检查是否是地板：名字包含 floor/ground/plane/reflec 或 y 位置接近 0
                    const isFloor = (child.name && /floor|ground|plane|reflec/i.test(child.name)) ||
                        (child.position.y === 0 && child.rotation.x === -Math.PI / 2);

                    if (isFloor) {
                        // 地板使用反射材质
                        child.material = this.floorMaterial;
                    } else if (child.name && /light/i.test(child.name)) {
                        // 灯光物体：增强发光效果
                        const material = new THREE.MeshPhysicalMaterial({
                            color: 0xffffff,
                            emissive: new THREE.Color(0xffffff),
                            emissiveIntensity: 2.0,  // 增强发光强度
                            toneMapped: false  // 避免发光被色调映射压制
                        });
                        child.material = material;
                    } else {
                        // 其他部分使用标准材质
                        const material = new THREE.MeshPhysicalMaterial({
                            color: 0xffffff,
                            metalness: 0.0,
                            roughness: 0.5,
                            envMapIntensity: 1.0,
                            aoMap: aoTexture,
                            aoMapIntensity: 1.0,
                            emissiveMap: lightTexture,
                            emissive: new THREE.Color(0xffffff),
                            emissiveIntensity: 1.0
                        });
                        child.material = material;
                    }
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            console.log('StartRoom mesh names:', meshNames);

            // 隐藏 StartRoom 的地板，只用 World 的大地面
            this.room.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    if (child.name && /floor|ground|plane|reflec/i.test(child.name)) {
                        child.visible = false;
                    }
                }
            });

            // 调整房间位置和大小
            this.room.scale.set(1, 1, 1);
            this.room.position.set(0, 0, 0);
            this.room.rotation.y = Math.PI;

            this.scene.add(this.room);
        }
    }

    public update(time: number): void {
        // StartRoom 的 update 暂时不需要做什么
        // 反射功能已禁用
    }

    public dispose(): void {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.renderTarget) {
            this.renderTarget.dispose();
        }
        if (this.room) {
            this.scene.remove(this.room);
        }
        if (this.envMap) {
            this.envMap.dispose();
        }
        this.lights.forEach(light => {
            this.scene.remove(light);
            if (light instanceof THREE.SpotLight || light instanceof THREE.PointLight) {
                light.shadow.map?.dispose();
            }
        });
    }

    public onWindowResize(): void {
        if (this.renderTarget) {
            this.renderTarget.setSize(window.innerWidth, window.innerHeight);
        }
        if (this.floorMaterial) {
            this.floorMaterial.uniforms.uMipmapTextureSize.value.set(
                window.innerWidth,
                window.innerHeight
            );
        }
    }
}

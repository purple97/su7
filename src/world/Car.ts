import * as THREE from 'three';
//@ts-ignore
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
//@ts-ignore
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

export class Car {
    private model: THREE.Group;
    private scene: THREE.Scene;
    private modelParts: THREE.Object3D[] = [];
    private bodyMat?: THREE.MeshStandardMaterial;
    private wheelModel?: THREE.Group;
    private textureLoader: THREE.TextureLoader;
    private speed: number = 1; // 速度参数

    constructor(scene: THREE.Scene, carGltf: GLTF) {
        console.log('Car类初始化，接收到的GLTF模型:', carGltf);
        this.scene = scene;
        this.model = carGltf.scene;
        this.textureLoader = new THREE.TextureLoader();

        // 收集模型的所有部件并设置阴影
        this.model.traverse((child) => {
            this.modelParts.push(child);
            if (child instanceof THREE.Mesh) {
                // 设置阴影
                child.castShadow = true;
                child.receiveShadow = true;

                // 如果是标准材质，确保正确的阴影设置
                if (child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.shadowSide = THREE.FrontSide;
                    child.material.envMapIntensity = 0.5;
                }
            }
        });

        this.setup();
    }

    private async setup(): Promise<void> {
        await this.loadTextures();
        this.setupBodyMaterial();
        await this.setupEnvironment();
        this.setupTransform();
        this.setupWheels();
    }

    // 设置车身材质
    private setupBodyMaterial(): void {
        // 获取车身模型（索引2）
        const body = this.modelParts[2] as THREE.Mesh;
        const bodyMat = body.material as THREE.MeshStandardMaterial;
        // 创建新的PBR材质，添加AO贴图
        // const bodyMat = new THREE.MeshPhysicalMaterial({
        //     color: new THREE.Color("#26d6e9"),
        //     metalness: 0.6,        // 金属度 - 控制材质的金属感，0为非金属，1为金属
        //     roughness: 0.3,        // 粗糙度 - 控制材质的光滑程度，0为镜面反射，1为完全漫反射
        //     clearcoat: 0.8,        // 清漆强度 - 控制表面清漆层的厚度，用于汽车漆面效果
        //     clearcoatRoughness: 0.2, // 清漆粗糙度 - 控制清漆层的光滑程度
        //     envMapIntensity: 0.5,  // 环境贴图强度 - 控制环境反射的强度
        //     reflectivity: 0.5,     // 反射率 - 控制材质对光线的反射程度
        //     transparent: false,     // 透明度 - 是否启用透明效果
        //     side: THREE.FrontSide, // 渲染面 - 只渲染正面，优化性能
        //     aoMap: this.textures?.aoMap, // 添加AO贴图
        //     aoMapIntensity: 0.1,         // 设置AO强度
        // });
        bodyMat.color = new THREE.Color("#26d6e9"); // 默认蓝色

        this.bodyMat = bodyMat;

        // 应用到车身
        body.material = bodyMat;

        // 为所有网格添加AO贴图
        this.modelParts.forEach((item) => {
            if (item instanceof THREE.Mesh) {
                const material = item.material as THREE.MeshStandardMaterial;
                if (material && this.textures?.aoMap) {
                    material.aoMap = this.textures.aoMap;
                    material.aoMapIntensity = 0;
                    // material.needsUpdate = true;
                }
            }
        });

        body.castShadow = true;
        body.receiveShadow = true;
        bodyMat.needsUpdate = true;
        console.log('设置车身材质完成:', body.name);
    }

    private async loadTextures(): Promise<void> {
        // 加载必要的贴图
        const [aoMap, decal] = await Promise.all([
            this.textureLoader.loadAsync('/texture/t_car_body_AO.raw.jpg'),
            this.textureLoader.loadAsync('/texture/decal.png')
        ]);

        this.textures = {
            aoMap,
            decal
        };
    }

    private async setupEnvironment(): Promise<void> {
        // 注意：我们不再在这里设置环境贴图，而是使用StartRoom中设置的环境贴图
        // 只需确保材质正确响应环境贴图即可
        if (this.bodyMat) {
            this.bodyMat.needsUpdate = true;
        }
    }

    private setupTransform(): void {
        // 设置位置和大小
        this.model.scale.set(1, 1, 1);
        this.model.position.set(0, 0.05, 0); // 轻微抬高，避免阴影问题
        this.model.rotation.y = Math.PI / 4; // 旋转45度，更好地展示车身

        // 添加到场景
        this.scene.add(this.model);
        console.log('汽车模型已添加到场景');
    }

    private setupWheels(): void {
        // 获取车轮模型（索引35）
        const Wheel = this.modelParts[35] as THREE.Group;
        this.wheelModel = Wheel;
    }

    // 更新方法，用于动画等
    public update(): void {
        // 旋转展示
        // this.model.rotation.y += 0.003;

        // 更新轮子旋转
        this.updateWheels();
    }

    // 更新轮子旋转
    private updateWheels(): void {
        if (this.wheelModel) {
            this.wheelModel.children.forEach((child) => {
                child.rotateZ(-this.speed * 0.03);
            });
        }
    }
    private setBodyEnvmapIntensity(value: number) {
        if (this.bodyMat) {
            this.bodyMat.envMapIntensity = value;
        }
    }

    // 设置速度
    public setSpeed(speed: number): void {
        this.speed = speed;
    }

    // 设置位置
    public setPosition(x: number, y: number, z: number): void {
        this.model.position.set(x, y, z);
    }

    // 设置旋转
    public setRotation(x: number, y: number, z: number): void {
        this.model.rotation.set(x, y, z);
    }

    // 设置缩放
    public setScale(scale: number): void {
        this.model.scale.set(scale, scale, scale);
    }

    // 设置车身颜色
    public setColor(color: string): void {
        if (this.bodyMat) {
            this.bodyMat.color = new THREE.Color(color);
            this.bodyMat.needsUpdate = true;
        }
    }

    private textures?: {
        aoMap: THREE.Texture;
        decal: THREE.Texture;
    };
}
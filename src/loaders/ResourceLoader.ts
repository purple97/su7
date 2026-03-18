import * as THREE from "three";
//@ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
//@ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
//@ts-ignore
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
//@ts-ignore
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { resources } from '../resources';

export interface LoadingProgress {
    url: string;
    loaded: number;
    total: number;
}

export class ResourceLoader {
    private loadingManager: THREE.LoadingManager;
    private textureLoader: THREE.TextureLoader;
    private gltfLoader: GLTFLoader;
    private fbxLoader: FBXLoader;
    private rgbeLoader: RGBELoader;
    private audioLoader: THREE.AudioLoader;
    public resources: Map<string, any>;

    constructor(
        onComplete: () => void,
        onProgress?: (progress: LoadingProgress) => void
    ) {
        console.log('ResourceLoader初始化');
        this.resources = new Map();
        this.loadingManager = new THREE.LoadingManager(
            // 加载完成回调
            () => {
                console.log('LoadingManager完成回调触发');
                console.log('当前已加载的资源:', Array.from(this.resources.keys()));
                onComplete();
            },
            // 加载进度回调
            (url, loaded, total) => {
                const progress = {
                    url,
                    loaded,
                    total
                };
                onProgress?.(progress);
            },
            // 错误回调
            (url) => {
                console.error('加载资源失败:', url);
            }
        );

        this.initLoaders();
    }

    private async initLoaders(): Promise<void> {
        this.textureLoader = new THREE.TextureLoader(this.loadingManager);
        this.gltfLoader = new GLTFLoader(this.loadingManager);

        // 设置Meshopt解码器
        this.gltfLoader.setMeshoptDecoder(MeshoptDecoder);

        this.fbxLoader = new FBXLoader(this.loadingManager);
        this.rgbeLoader = new RGBELoader(this.loadingManager);
        this.audioLoader = new THREE.AudioLoader(this.loadingManager);
    }

    public loadResources(): void {
        console.log('开始加载资源列表:', resources);
        resources.forEach(resource => {
            console.log(`准备加载资源: ${resource.name}, 类型: ${resource.type}, 路径: ${resource.path}`);
            switch (resource.type) {
                case 'texture':
                    this.textureLoader.load(resource.path, (texture) => {
                        console.log(`纹理加载完成: ${resource.name}`);
                        this.resources.set(resource.name, texture);
                    });
                    break;
                case 'gltfModel':
                    this.gltfLoader.load(
                        resource.path,
                        (gltf) => {
                            console.log(`GLTF模型加载完成: ${resource.name}`, gltf);
                            this.resources.set(resource.name, gltf);
                        },
                        (progress) => {
                            console.log(`GLTF模型加载进度 ${resource.name}:`, (progress.loaded / progress.total * 100).toFixed(2) + '%');
                        },
                        (error) => {
                            console.error(`GLTF模型加载失败 ${resource.name}:`, error);
                        }
                    );
                    break;
                case 'fbxModel':
                    this.fbxLoader.load(resource.path, (fbx) => {
                        console.log(`FBX模型加载完成: ${resource.name}`);
                        this.resources.set(resource.name, fbx);
                    });
                    break;
                case 'hdrTexture':
                    this.rgbeLoader.load(resource.path, (texture) => {
                        console.log(`HDR纹理加载完成: ${resource.name}`);
                        this.resources.set(resource.name, texture);
                    });
                    break;
                case 'audio':
                    this.audioLoader.load(resource.path, (buffer) => {
                        console.log(`音频加载完成: ${resource.name}`);
                        this.resources.set(resource.name, buffer);
                    });
                    break;
            }
        });
    }

    public getResource(name: string): any {
        const resource = this.resources.get(name);
        console.log(`获取资源 ${name}:`, resource);
        return resource;
    }
} 

//@ts-ignore
import { FBXLoader } from 'three/addons/loaders/FBXLoader';
//@ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

import { DRACOLoader } from 'three/addons/loaders/DRACOLoader'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'; // 添加 MeshoptDecoder 导入

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// 压缩模型格式
function CreateDRACO(loader, path) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(path);
    // dracoLoader.setDecoderConfig({ type: 'js' });
    dracoLoader.preload();
    loader.setDRACOLoader(dracoLoader)
}

/* 
* 加载器 - 加载gltf模型
*/
export async function loaderGLTF(url) {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder); // 在加载之前设置 MeshoptDecoder
    CreateDRACO(loader, '/src/p/su7/assets/')
    return new Promise((resolve, reject) => loader.load(url, (res) => {
        console.log(res);
        if (res.scene) {
            res.scene.animations = res.animations;
            return resolve(res.scene)
        } else {
            console.error('加载的模型没有场景');
            return reject(new Error('加载的模型没有场景'));
        }
    }, undefined, reject))
}

/* 
* 加载器 - 加载fbx模型
*/
export async function loaderFBX(url) {
    const loader = new FBXLoader();
    return new Promise((resolve, reject) => loader.load(url, resolve, undefined, reject))
}

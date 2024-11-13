
//@ts-ignore
import { FBXLoader } from 'three/addons/loaders/FBXLoader';
//@ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

import { DRACOLoader } from 'three/addons/loaders/DRACOLoader'

// 压缩模型格式
function CreateDRACO(loader, path) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(path);
    // dracoLoader.setDecoderConfig({ type: 'js' });
    dracoLoader.preload();
    loader.setDRACOLoader(dracoLoader);
}

/* 
* 加载器 - 加载gltf模型
*/
export async function loaderGLTF(url) {
    const loader = new GLTFLoader();
    // CreateDRACO(loader, '/src/p/su7/assets/')
    return new Promise((resolve, reject) => loader.load(url, (res) => {
        console.log('----')
        res.scene.animations = res.animations;
        return resolve(res.scene)
    }, undefined, reject))
}

/* 
* 加载器 - 加载fbx模型
*/
export async function loaderFBX(url) {
    const loader = new FBXLoader();
    return new Promise((resolve, reject) => loader.load(url, resolve, undefined, reject))
}
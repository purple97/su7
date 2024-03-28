
//@ts-ignore
import { FBXLoader } from 'three/addons/loaders/FBXLoader';
//@ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

/* 
* 加载器 - 加载gltf模型
*/
export async function loaderGLTF(url) {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => loader.load(url, (res) => {
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
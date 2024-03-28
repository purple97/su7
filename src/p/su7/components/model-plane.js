import { Model, loaderGLTF } from '@br/three/'


function CreatePlaneModel(fbx) {
    const target = new Model(fbx, {
        animaScripts: [{
            start: 200,
            end: 1200,
            rotation: { x: 0.5, y: 5.6, z: [0, 0.3, 0] },
            position: { y: [0, -0.3, 0] },
            scale: { x: [1, 1.2, 1], y: [1, 1.2, 1] }
        }]
    });

    // 设置模型大小
    target.scale.set(1, 1, 1);
    target.translateY(0)
    target.rotation.x = 0.4
    target.rotation.y = 6.8

    // 动态添加动画脚本
    target.addAS({
        start: 1900,
        end: 2900,
        rotation: { x: 0.3, y: 7.7, z: [-0.2, -0.9, 0] },
        position: { x: [0.1, 0.3], y: [-0.1, -0.4, 0] }
    }).addAS({
        start: 2900,
        end: 4100,
        position: { x: -0.4 }
    })

    return target
}


export default async function PlaneModel() {
    return loaderGLTF('../su7/assets/stylized_plane.glb').then(CreatePlaneModel)
}
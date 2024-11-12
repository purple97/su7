import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
    Model,
    CreateScene,
    loaderFBX,
    loaderGLTF,
} from '@br/three/'
import GUI from '@br/three/gui'
import PlaneModel from './model-plane'


function InitThreeScene(ele) {

    const canvas = new CreateScene({
        width: window.innerWidth,
        height: window.innerHeight
    })

    canvas.append(ele)
    // 改变相机距离
    canvas.camera.position.z = 3.7;
    //
    let target = null
    //
    const gui = new GUI()
    gui.addColor(canvas.lights[0], 'color', 'color').name('设置光的颜色');
    gui.add(canvas.lights[0], 'intensity', 0, 3, 0.01).name('设置光源强度');
    gui.add(canvas.lights[0].position, 'x', 0, 100, 1).name('设置光源x');
    gui.add(canvas.lights[0].position, 'y', 0, 100, 1).name('设置光源y');
    gui.add(canvas.lights[0].position, 'z', 0, 100, 1).name('设置光源z');


    PlaneModel().then((_target) => {
        target = _target
        // gui.add(target.rotation, 'x', 0, 6, 0.001).name('设置X轴旋转');
        // gui.add(target.rotation, 'y', 0, 6, 0.001).name('设置Y轴旋转');
        // gui.add(target.rotation, 'z', -6, 6, 0.001).name('设置Z轴旋转');
        // gui.add(target.position, 'z', -2, 2, 0.01).name('设置Z轴位置');
        canvas.addModel(target)
    })
    /* 
    * 动画运行时间轴 挂载到 window scroll 事件上
    */
    window.addEventListener('scroll', () => {
        target && target.runAnimaScript(window.scrollY);
    }, { passive: true })


    // 启动引擎，运行模型自带动画
    canvas.startEngine();
}





const Three = () => {
    const ThreeContentRef = useRef(null);

    useEffect(() => {
        if (ThreeContentRef.current) {
            InitThreeScene(ThreeContentRef.current)

            // loaderFBX('../parallaxis/public/Walking.fbx').then((res) => {
            //     InitThreeScene(ThreeContentRef.current, res);
            // })
        }
    }, [])


    return <div ref={ThreeContentRef} id="__ThreeContent"></div>
}


export default Three
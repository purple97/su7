import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js';
import { ChangeMaterialEmissive, setAnimationMixer } from './utils'

/* 
* 创建模型，对传入的模型进行加工
* @param {THREE.Object3D} target 模型
* @param {Object} opstion 配置项
*/
class Model {
    constructor(target, opstion) {
        this.target = target
        this.opstion = opstion
        this.setModel(this.target)
        this.clock = new THREE.Clock();
        this.animationScriptMark = [];
        if (opstion.animaScripts) {
            this.addAnimaScript(opstion.animaScripts)
        }
        this.target.update = () => {
            this.target.mixer.update(this.clock.getDelta());
        }
        this.target.addAS = this.target.addAnimaScript = this.addAnimaScript.bind(this)
        this.target.runAnimaScript = this.runAnimaScript.bind(this)
        return this.target
    }

    setModel(target) {
        Model.ChangeMaterialEmissive(target)
        Model.setAnimationMixer(target)
    }

    static ChangeMaterialEmissive(target) {
        target.traverse(item => {
            if (item instanceof THREE.Mesh) {
                // item.material = new THREE.MeshPhongMaterial(target.children[1].material);
                // item.material.emissive = new THREE.Color(1, 1, 1);
                // item.material.emissiveIntenaity = 1;
                // item.material.emissiveMap = item.material.map;
                item.castShadow = true;
                item.receiveShadow = true;
            }
        })
    }

    static setAnimationMixer(target) {
        target.mixer = new THREE.AnimationMixer(target);
        target.mixer.clipAction(target.animations[0]).play();
    }

    /* 
    * 添加动画脚本
    * @param {Object} scriptInfo 动画脚本信息
    * @param {Int} scriptInfo.start 动画脚本开始时间
    * @param {Int} scriptInfo.end 动画脚本结束时间
    * @param {Object} scriptInfo<key> 动画脚本, 例如
    *      @param {Number} scriptInfo<key>.x  x轴位置
    *      @param {Number} scriptInfo<key>.y  y轴位置
    */
    addAnimaScript(scriptInfo) {
        if (Array.isArray(scriptInfo)) {
            scriptInfo.forEach(info => {
                this.animationScriptMark.push({
                    start: info.start,
                    end: info.end,
                    script: info,
                    action: null
                });
            })
        } else {
            this.animationScriptMark.push({
                start: scriptInfo.start,
                end: scriptInfo.end,
                script: scriptInfo,
                action: null
            });
        }
        return this.target
    }

    /* 
    * 运行动画脚本， 动画补间在这里创建并运行
    */
    runAnimaScript(scrollProgress) {
        const self = this;
        self.animationScriptMark.forEach(item => {
            if (scrollProgress > item.start && scrollProgress < item.end) {
                if (!item.action) {
                    item.action = new TWEEN.Tween(self.target).to(item.script, item.end - item.start)
                    item.action.easing(TWEEN.Easing.Linear.None)
                    item.action.start(item.start);
                }
                item.action.update(scrollProgress);
            }
        })
        return self.target
    }
}


export default Model
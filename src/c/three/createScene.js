import * as THREE from 'three';


/* 
* 创建场景（画布）， 附带创建相机、光源
* 可以通过 addModel方法添加模型到场景，模型会自动更新(动画)
* startEngine 启动渲染引擎渲染模型动画
* @param {Object} opstion 配置项
* @param {Number} opstion.width 画布宽度
* @param {Number} opstion.height 画布高度
*/
class createScene {
    constructor(opstion) {
        this.opstion = opstion;
        const {
            width = 800,
            height = 800,
            camera,
            lights
        } = this.opstion;
        // 场景
        this.scene = new THREE.Scene();
        this.camera = camera || new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);

        if (lights) {
            this.lights = lights
        } else {
            //环境光
            const ambientLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 1.5);
            // 添加太阳光
            const light = new THREE.DirectionalLight(0xFFFFFF, 2);
            light.position.set(0, 0, 10);
            this.lights = [ambientLight, light]
        }

        // 渲染器
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.models = []
        this.engineCallbacks = []
        this.clock = new THREE.Clock();
        this.renderer.setSize(width, height);
        this.renderer.setClearAlpha(0);

        this.addLights()
    }

    append(ele) {
        this.ele = ele
        ele.appendChild(this.renderer.domElement);
    }

    addLights() {
        if (Array.isArray(this.lights)) {
            this.lights.forEach(item => this.scene.add(item))
        } else if (this.lights) {
            this.scene.add(this.lights)
        }
    }

    addModel(model) {
        this.models.push(model)
        this.scene.add(model)
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    engine() {
        const scrollProgress = window.scrollY;
        if (this.engineCallback) {
            this.engineCallback(scrollProgress, this.opstion)
        }
        if (this.models.length > 0) {
            this.models.forEach(model => model.update())
        }
        this.render();
        requestAnimationFrame(this.engine.bind(this));
    }

    startEngine(callback) {
        this.engineCallback = callback
        this.engine()
    }

}

export default createScene
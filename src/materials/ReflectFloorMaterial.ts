import * as THREE from 'three';
import vertexShader from '../shaders/ReflecFloor/vertex.glsl';
import fragmentShader from '../shaders/ReflecFloor/fragment.glsl';

/**
 * 反射地板材质选项
 */
interface ReflectFloorMaterialOptions {
    /** 基础颜色 */
    baseColor?: THREE.Color;
    /** 反射强度 (0-1) */
    reflectivity?: number;
    /** 粗糙度 (0-1) */
    roughness?: number;
}

/**
 * 反射地板材质
 *
 * 这是一个自定义的 ShaderMaterial，用于实现地面反射效果。
 * 主要用于 StartRoom 场景中，让地板能够反射汽车模型，增强视觉效果。
 *
 * 工作原理：
 * 1. 通过 setReflectTexture() 设置反射贴图（通常是场景的渲染目标）
 * 2. 通过 setReflectMatrix() 设置反射矩阵
 * 3. 在 fragment shader 中根据反射矩阵计算每个像素的反射颜色
 *
 * 使用示例：
 * ```typescript
 * const floorMaterial = new ReflectFloorMaterial({
 *     baseColor: new THREE.Color(0x888888),  // 地板基础颜色
 *     reflectivity: 0.5,                     // 反射强度
 *     roughness: 0.3                         // 粗糙度
 * });
 *
 * // 每帧更新反射
 * floorMaterial.setReflectTexture(renderTarget.texture);
 * floorMaterial.setReflectMatrix(reflectMatrix);
 * floorMaterial.update(time);
 * ```
 */
export class ReflectFloorMaterial extends THREE.ShaderMaterial {
    constructor(options: ReflectFloorMaterialOptions = {}) {
        const {
            /** 默认浅灰色地板 */
            baseColor = new THREE.Color(0x888888),
            /** 反射强度默认 0.5 */
            reflectivity = 0.5,
            /** 粗糙度默认 0.3 */
            roughness = 0.3
        } = options;

        super({
            vertexShader,
            fragmentShader,
            uniforms: {
                /** 颜色（目前固定白色） */
                uColor: { value: new THREE.Color("#ffffff") },
                /** 速度（用于动画效果） */
                uSpeed: { value: 1.0 },
                /** 反射矩阵 */
                uReflectMatrix: { value: new THREE.Matrix4() },
                /** 反射贴图（场景渲染结果） */
                uReflectTexture: { value: null },
                /** 反射强度 */
                uReflectIntensity: { value: 25.0 },
                /** 贴图大小（用于 mipmap） */
                uMipmapTextureSize: {
                    value: new THREE.Vector2(window.innerWidth, window.innerHeight)
                },
                /** 时间（用于动画） */
                iTime: { value: 0 },
                /** 基础颜色 */
                uBaseColor: { value: baseColor },
                /** 反射率 */
                uReflectivity: { value: reflectivity },
                /** 粗糙度 */
                uRoughness: { value: roughness }
            },
            /** 启用透明（用于反射效果） */
            transparent: true,
            /** 双面渲染 */
            side: THREE.DoubleSide
        });
    }

    /**
     * 更新材质
     * @param time - 当前时间（秒）
     */
    public update(time: number) {
        this.uniforms.iTime.value = time;
    }

    /**
     * 设置反射贴图
     * @param texture - 反射贴图（通常是 WebGLRenderTarget 的 texture）
     */
    public setReflectTexture(texture: THREE.Texture) {
        this.uniforms.uReflectTexture.value = texture;
    }

    /**
     * 设置反射矩阵
     * @param matrix - 反射矩阵（投影矩阵 * 视图矩阵的逆矩阵）
     */
    public setReflectMatrix(matrix: THREE.Matrix4) {
        this.uniforms.uReflectMatrix.value = matrix;
    }

    /**
     * 设置速度（用于动画效果）
     * @param speed - 速度值
     */
    public setSpeed(speed: number) {
        this.uniforms.uSpeed.value = speed;
    }

    /**
     * 设置反射强度
     * @param intensity - 反射强度
     */
    public setReflectIntensity(intensity: number) {
        this.uniforms.uReflectIntensity.value = intensity;
    }

    /**
     * 设置颜色
     * @param color - 颜色
     */
    public setColor(color: THREE.Color) {
        this.uniforms.uColor.value = color;
    }
}

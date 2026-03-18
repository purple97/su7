uniform vec3 uBaseColor;
uniform float uReflectivity;
uniform float uRoughness;
uniform float uSpeed;
uniform mat4 uReflectMatrix;
uniform sampler2D uReflectTexture;
uniform float uReflectIntensity;
uniform vec2 uMipmapTextureSize;
uniform float iTime;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    // 基础颜色
    vec3 baseColor = uBaseColor;

    // 检查反射纹理是否有效
    float texWidth = float(textureSize(uReflectTexture, 0).x);

    if (texWidth > 0.0) {
        // 计算反射向量
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        vec3 reflectDir = reflect(-viewDir, normal);

        // 计算反射UV坐标
        vec4 reflectCoord = uReflectMatrix * vec4(vWorldPosition + reflectDir * 0.1, 1.0);
        vec2 reflectUv = reflectCoord.xy / reflectCoord.w * 0.5 + 0.5;

        // 采样反射纹理
        vec4 reflectColor = texture2D(uReflectTexture, reflectUv);

        // 计算菲涅尔效应
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 5.0);

        // 混合基础颜色和反射颜色
        vec3 finalColor = mix(baseColor, reflectColor.rgb, fresnel * uReflectIntensity);

        // 应用粗糙度
        finalColor = mix(finalColor, baseColor, uRoughness);

        // 添加动态效果
        float wave = sin(vWorldPosition.x * 2.0 + iTime * uSpeed) * 0.5 + 0.5;
        finalColor *= 1.0 + wave * 0.2;

        gl_FragColor = vec4(finalColor, 1.0);
    } else {
        // 没有反射纹理，显示基础颜色
        gl_FragColor = vec4(baseColor, 1.0);
    }
}

import React, { useEffect, useState } from "react";
import "./style.css";
import { ResourceLoader, SceneManager, LoadingProgress } from './index';

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        const container = document.getElementById('sketch');
        if (!container) return;

        const sceneManager = new SceneManager(container);

        const resourceLoader = new ResourceLoader(
            () => {
                console.log('资源加载完成回调触发');
                const carResource = resourceLoader.getResource('sm_car');
                console.log('获取到的汽车资源:', carResource);
                if (carResource) {
                    console.log('添加汽车到场景');
                    sceneManager.addCar(carResource);
                } else {
                    console.warn('未找到汽车资源');
                }
                setIsLoading(false);
            },
            (progress) => {
                const percentage = (progress.loaded / progress.total) * 100;
                console.log(`加载进度: ${percentage.toFixed(2)}%`, progress.url);
                setLoadingProgress(percentage);
            }
        );

        console.log('开始加载资源');
        resourceLoader.loadResources();
    }, []);

    return (
        <>
            <div id="sketch" className="sketch-container" />
            {isLoading && (
                <div className="loader-screen">
                    <div className="loading-container">
                        <div className="loading">
                            {'LOADING'.split('').map((letter, i) => (
                                <span key={i} style={{ "--i": i } as React.CSSProperties}>
                                    {letter}
                                </span>
                            ))}
                        </div>
                        <div className="progress">
                            {loadingProgress.toFixed(0)}%
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default App;

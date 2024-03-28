

export function getWaveScale(progress, min, max) {
    const bf = max - min;
    return 1 + (bf / 2 - Math.abs(progress - bf)) / 500;
}

import * as THREE from 'three';

export function lerp(value, from_min, from_max, to_min, to_max)
{
	return (to_min + (to_max - to_min) * ((value - from_min) / (from_max - from_min)));
}

export function colorLerp(value, from_min, from_max, color0, color1)
{
    const factor = THREE.MathUtils.clamp((value - from_min) / (from_max - from_min), 0, 1);
    return new THREE.Color(
        THREE.MathUtils.lerp(color0.r, color1.r, factor),
        THREE.MathUtils.lerp(color0.g, color1.g, factor),
        THREE.MathUtils.lerp(color0.b, color1.b, factor)
    );
}

export function degToRad(degrees)
{
    return (degrees * Math.PI / 180);
}

export function radToDeg(radians)
{
    return (radians * 180 / Math.PI);
}

export function calculate2DSpeed(deltaX, deltaZ)
{
    return (Math.sqrt(deltaX * deltaX + deltaZ * deltaZ));
}

export function deriveXspeed(speed, angle)
{
    let speedX = speed * Math.sin(angle);
    if (speedX > -0.001 && speedX < 0.001)
        speedX = 0;
    return (speedX);
}

export function deriveZspeed(speed, angle)
{
    let speedZ = speed * Math.cos(angle);
    if (speedZ > -0.001 && speedZ < 0.001)
        speedZ = 0;
    return (speedZ);
}

export function within2Pi(rad)
{
    if (rad < 0)
    {
        rad += (Math.PI * 2);
    }
    else if (rad > (Math.PI * 2))
    {
        rad -= (Math.PI * 2);
    }
    return (rad);
}

export function vector2DToAngle(deltaX, deltaZ)
{
    let rad = Math.atan2(deltaX, deltaZ);
    rad = within2Pi(rad);
    return (rad);
}

export function setMinAngle(degrees)
{
    return (degToRad(degrees));
}

export function setMaxAngle(degrees)
{
    return (Math.PI - degToRad(degrees));
}

export function widthPercentage(percentage)
{
    return (window.innerWidth * percentage / 100);
}
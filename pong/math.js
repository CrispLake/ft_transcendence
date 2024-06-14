export function lerp(value, from_min, from_max, to_min, to_max)
{
	return (to_min + (to_max - to_min) * ((value - from_min) / (from_max - from_min)));
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

export function vector2DToAngle(deltaX, deltaZ)
{
    return (Math.abs(Math.atan2(-deltaX, -deltaZ)));
}

export function deriveXspeed(speed, angle)
{
    return (speed * Math.sin(angle));
}

export function deriveZspeed(speed, angle)
{
    return (speed * Math.cos(angle));
}

export function setMinAngle(degrees)
{
    return (degToRad(degrees));
}

export function setMaxAngle(degrees)
{
    return (Math.PI - degToRad(degrees));
}

export function reduceRGB(color, amount) {
	let r = (color >> 16) & 0xFF;
	let g = (color >> 8) & 0xFF;
	let b = color & 0xFF;
	r = Math.max(0, r - amount);
	g = Math.max(0, g - amount);
	b = Math.max(0, b - amount);
   return (r << 16) | (g << 8) | b;
}

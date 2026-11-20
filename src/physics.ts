export type SlitMode = 'both' | 'upper' | 'lower'
export type Parameters = { wavelength: number; separation: number; width: number; distance: number; mode: SlitMode }
export const baseline: Parameters = { wavelength: 550e-9, separation: .30e-3, width: .05e-3, distance: 1.5, mode: 'both' }
export const sinc = (x: number) => Math.abs(x) < 1e-10 ? 1 : Math.sin(x) / x
export const angleAt = (y: number, D: number) => Math.atan(y / D)
export const fringeWidth = (p: Parameters) => p.wavelength * p.distance / p.separation
export const wavelengthColor = (nm: number) => {let r=0,g=0,b=0;if(nm<440){r=-(nm-440)/60;b=1}else if(nm<490){g=(nm-440)/50;b=1}else if(nm<510){g=1;b=-(nm-510)/20}else if(nm<580){r=(nm-510)/70;g=1}else if(nm<645){r=1;g=-(nm-645)/65}else r=1;return `rgb(${Math.round(255*Math.pow(Math.max(0,r),.8))},${Math.round(255*Math.pow(Math.max(0,g),.8))},${Math.round(255*Math.pow(Math.max(0,b),.8))})`}
export const intensityAt = (y: number, p: Parameters) => {const s=Math.sin(angleAt(y,p.distance)),alpha=Math.PI*p.width*s/p.wavelength,envelope=sinc(alpha)**2;if(p.mode!=='both')return envelope;return envelope*Math.cos(Math.PI*p.separation*s/p.wavelength)**2}
export const measurementAt = (y:number,p:Parameters) => {const theta=angleAt(y,p.distance),path=p.separation*Math.sin(theta),phase=2*Math.PI*path/p.wavelength,I=intensityAt(y,p);return {theta,path,phase,intensity:I,order:path/p.wavelength,classification:I>.82?'bright':I<.12?'dark':'intermediate'}}

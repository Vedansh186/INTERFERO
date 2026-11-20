# INTERFERO

An interactive Young's Double-Slit Experiment laboratory built with React, TypeScript, Canvas, and Vite.

Run: `npm install` then `npm run dev`. Check it with `npm test` and `npm run build`.

The detector uses the finite-slit Fraunhofer model: `I/I0 = (sin(alpha)/alpha)^2 cos^2(delta)`, with `alpha = pi*a*sin(theta)/lambda`, `delta = pi*d*sin(theta)/lambda`, and exact screen geometry `theta = atan(y/D)`. The reported fringe width `beta = lambda*D/d` is clearly a small-angle prediction.

The static build is generated in `dist/` by `npm run build`. No deployment has been performed.

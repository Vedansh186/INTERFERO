# INTERFERO
### An Interactive Wave Optics Laboratory
<img width="2172" height="724" alt="Interfero Wave Logo" src="https://github.com/user-attachments/assets/ff416d32-3b42-4c96-b725-5f16ebc1accd" />

**Visualize interference. Explore diffraction. Understand the physics of light.**

INTERFERO is an interactive web-based physics laboratory designed to simulate and explore **Young's Double-Slit Experiment (YDSE)** through real-time visualization, mathematical modelling, and experimental controls.

The platform allows users to investigate the behaviour of coherent light waves, observe interference patterns, manipulate experimental parameters, and analyse intensity distributions through an interactive virtual apparatus.

---

## Preview

<img width="1900" height="827" alt="image" src="https://github.com/user-attachments/assets/b92214e4-7b00-4e8e-836d-439a47643b41" />


*The INTERFERO interactive wave optics laboratory.*

---

## Overview

Young's Double-Slit Experiment demonstrates the wave nature of light through the phenomenon of interference. Despite being a fundamental experiment in wave optics, understanding the relationship between wave propagation, path difference, phase difference, and intensity can be challenging through static diagrams alone.

INTERFERO addresses this by providing an interactive environment where these physical principles can be explored visually and quantitatively.

Users can modify experimental parameters, observe the resulting changes in interference patterns, and inspect measurements at different positions on the detection screen.

## Key Features

### 1. Interactive Double-Slit Apparatus
- Real-time visualization of the experimental setup.
- Animated wavefront propagation.
- Configurable slit arrangement.
- Interactive detection screen with a movable measurement cursor.
- Visual representation of interference intensity.

### 2. Experimental Controls

Modify the fundamental parameters of the experiment:

| Parameter | Description |
|---|---|
| Wavelength (λ) | Controls the wavelength of incident light |
| Slit Separation (d) | Distance between the two slits |
| Slit Width (a) | Width of each slit |
| Screen Distance (D) | Distance between the slits and detection screen |
| Slit Configuration | Select both slits, upper slit, or lower slit |

### 3. Real-Time Measurements

The measurement panel calculates physical quantities based on the selected screen position:

- Angular position (θ)
- Path difference (Δ)
- Phase difference (φ)
- Normalized intensity (I/I₀)
- Fringe classification

### 4. Intensity Distribution

An interactive intensity graph represents the interference pattern across the detection screen.

The visualization incorporates the diffraction envelope, allowing users to investigate the combined effects of interference and diffraction.

### 5. Experiment Presets

Explore predefined experimental configurations:

- Green Light Baseline
- Blue Light
- Red Light
- Wide Slit Separation
- Long Screen Distance
- Diffraction Envelope

### 6. Virtual Observation Notebook

- Record experimental measurements.
- Compare measured positions with theoretical fringe positions.
- Maintain an observation table.
- Export recorded observations in CSV format.

### 7. Project Information

The platform includes a dedicated project credits section, technology information, and links to the developer's professional and open-source profiles.

---

## Physics Behind INTERFERO

The simulation is based on the mathematical principles of Young's Double-Slit Experiment.

### Fringe Width

For small angular deviations, the fringe width is given by:

$$
\boxed{\beta = \frac{\lambda D}{d}}
$$

Where:

- β = Fringe width
- λ = Wavelength of light
- D = Distance between the slits and screen
- d = Separation between the slits

### Path Difference

The path difference between waves arriving at a point on the screen is:

$$
\Delta = d\sin\theta
$$

The angular position is calculated using:

$$
\theta = \tan^{-1}\left(\frac{y}{D}\right)
$$

### Phase Difference

The phase difference between the interfering waves is:

$$
\phi = \frac{2\pi\Delta}{\lambda}
$$

### Intensity Distribution

The simulation uses the combined interference and single-slit diffraction intensity model:

$$
\frac{I}{I_0} =
\left(\frac{\sin\alpha}{\alpha}\right)^2
\cos^2\delta
$$

Where:

$$
\alpha = \frac{\pi a\sin\theta}{\lambda}
$$

$$
\delta = \frac{\pi d\sin\theta}{\lambda}
$$

This allows the simulation to represent the diffraction envelope alongside the interference fringes.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| TypeScript | Application logic and type safety |
| Vite | Development environment and build tooling |
| HTML5 Canvas API | Real-time optical visualization |
| CSS3 | Styling, responsive layout and animations |
| JavaScript | Mathematical calculations and interactions |

---

## Getting Started

Follow these instructions to run INTERFERO locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/INTERFERO.git
```

**2. Navigate to the project directory**

```bash
cd INTERFERO
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

Open the local URL displayed in your terminal to access the application.

### Production Build

To generate an optimized production build:

```bash
npm run build
```

The production files will be generated inside the `dist/` directory.

---

## Project Structure

```text
INTERFERO/
│
├── public/
│
├── src/
│   ├── App.tsx          # Main application and UI
│   ├── physics.ts       # Physics calculations
│   ├── index.css        # Application styling
│   └── ...
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

*The structure above represents the primary application files.*

---

## Screenshots


### Interactive Apparatus

<img width="1775" height="863" alt="image" src="https://github.com/user-attachments/assets/c04328ef-3c0a-475c-8abe-12c81d00956c" />


*Real-time visualization of the double-slit experiment.*

### Experimental Controls

<img width="355" height="677" alt="image" src="https://github.com/user-attachments/assets/caf632af-4b1a-4521-9752-26ef031b0823" />


*Adjusting wavelength, slit separation, slit width and screen distance.*

### Intensity Distribution

![Intensity Graph](docs/images/intensity-graph.png)

*Visualizing the resulting interference and diffraction pattern.*

### Measurement Analysis

<img width="1160" height="472" alt="image" src="https://github.com/user-attachments/assets/20faa2e5-f0ac-4000-bfba-a6102d4f3665" />


*Real-time measurement of path difference, phase and intensity.*

### Experiment Presets

<img width="1520" height="542" alt="image" src="https://github.com/user-attachments/assets/08ff12b6-dad9-442b-a3dc-817ba2aee74b" />

*Preconfigured experimental scenarios.*


## Applications

INTERFERO can be used as an educational visualization tool for:

- Understanding Young's Double-Slit Experiment.
- Exploring the wave nature of light.
- Studying constructive and destructive interference.
- Investigating single-slit diffraction envelopes.
- Understanding the relationship between experimental parameters and fringe width.
- Supporting introductory wave optics laboratory demonstrations.

---

## Future Scope

Potential extensions to the platform include:

- More advanced optical experiments.
- Enhanced experimental data analysis.
- Additional visualization modes.
- Improved measurement and comparison tools.
- Expanded educational documentation.

---

## Credits

**Developed by:** Vedansh Sharma  
**Institution:** Jaypee Institute of Information Technology, Noida  
**Branch:** Mathematics and Computing

INTERFERO was developed as an interactive educational project exploring the principles of wave optics through web technologies and computational visualization.

### Connect

- LinkedIn: [Vedansh Sharma](YOUR_LINKEDIN_URL)
- GitHub: [GitHub Profile](YOUR_GITHUB_URL)

---

*INTERFERO — Making the invisible behaviour of light visible.*

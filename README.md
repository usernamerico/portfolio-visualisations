# Portfolio — Visualisations 3D & Outils Créatifs

Portfolio de 28 projets créatifs combinant visualisations 3D, animations interactives et outils de production.

🌐 **Site en ligne :** [Voir le portfolio](https://VOTRE-USERNAME.github.io/portfolio-visualisations/)

---

## Contenu

### 🐙 Série Poulpe — Canvas 2D (6 variations)
| Fichier | Description |
|---|---|
| `poulpe.html` | Version originale — rotation souris, 4 Z-buckets, dégradé cyan→bleu |
| `poulpe2.html` | Responsive — touch/mouse, inertie, DevicePixelRatio |
| `poulpe3.html` | Holographique — double-pass glow, TypedArrays, 260 sections |
| `poulpe4.html` | Matrice particules — 12 000 points, 8 tentacules analytiques |
| `poulpe6.html` | Premium — maillage 3D, 950 sections × 12 segments |
| `poulpeMAX.html` | Version MAX — dégradés HSL dynamiques, 60 FPS stable |

### 🌐 WebGL / Three.js
| Fichier | Description |
|---|---|
| `pieuvre_3d.html` | Surface de révolution Three.js — 600 × 64 slices |
| `pieuvre_projection.html` | Projection perspective pure x'=X/Z, zoom scroll |
| `lpflogod.html` | Logo LPF 3D — reconstruction particulaire |

### 💎 Holographique — CSS 3D
| Fichier | Description |
|---|---|
| `3D.html` | 20 calques SVG, parallaxe souris, glow progressif |
| `3D_responsive.html` | Version mobile avec gyroscope (DeviceOrientationEvent) |

### 🎞 Animations
| Fichier | Description |
|---|---|
| `KERING-front.html` | Logo Kering en 6 000 particules, wave scan 10 sec |

### 🛠 Outils
| Fichier | Description |
|---|---|
| `MicroPerf-Rico.html` | Générateur de motifs microperforation SVG |
| `bible_materiaux_RICO.html` | Base de données matériaux & finitions |
| `lpf-preflight-RICO.html` | Outil de preflight pour production |

---

## Stack Technologique

- **Canvas 2D** — Projections matricielles, particles systems, TypedArrays
- **WebGL / Three.js r128** — BufferGeometry, LineSegments, additive blending
- **CSS 3D** — preserve-3d, translateZ, mix-blend-mode: screen
- **JavaScript pur** — Pas de framework, performances optimisées 60 FPS

---

## Utilisation

Tous les fichiers sont autonomes (single-file HTML). Ouvrez directement dans un navigateur ou via le wiki :

```
index.html → wiki de navigation avec liens vers tous les projets
```

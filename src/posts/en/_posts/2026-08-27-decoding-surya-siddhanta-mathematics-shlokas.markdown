---
lng_pair: id_27-08-2026-surya-siddhanta-audit
title: "Decoding the Surya Siddhanta: Mathematical Proofs, Sanskrit Shlokas, and Zero-Lookup Ephemeris Engineering"
author: khumnath
category: astronomy
tags: [ surya siddhanta, vedic astronomy, sanskrit shlokas, ephemeris, mathematics, panchang, ahargana, algorithms, audit ]
img: ":solar-system.webp"
date: 2026-08-27 22:00:00 +0545
#published: false
---

## Introduction

The **Surya Siddhanta** (सूर्यसिद्धान्त) is one of the most venerable and mathematically profound astronomical treatises in human history. Passed down through classical Vedic astronomy, it established a complete, self-contained system of celestial mechanics capable of predicting planetary positions, lunar phases, solar and lunar eclipses, planetary conjunctions, and seasonal calendar cycles (*Kalanirnaya*) across millions of years.

![1st verse of the 1st chapter of the Surya Siddhanta, 1847 Sanskrit manuscript edition](/assets/img/posts/surya_siddhanta_manuscript_1847.jpg)

In contemporary software development, many calendar applications resort to static, pre-calculated lookup tables to display dates, Tithis, and festival timings. While functional for short spans, hardcoded tables fail to capture the underlying celestial mechanics and cannot extrapolate dynamically across millennia.

To bring the authentic mathematics of the *Surya Siddhanta* into the modern computational era, I built the **Surya Siddhanta Audit Project**—a high-fidelity, zero-lookup realization of the canonical Siddhantic engine in pure TypeScript. 

- **Interactive Calculation Engine:** [khumnath.com.np/surya-siddhanta-audit](https://khumnath.com.np/surya-siddhanta-audit)
- **API Documentation & Shastric Proofs:** [khumnath.com.np/surya-siddhanta-audit/api/index.html](https://khumnath.com.np/surya-siddhanta-audit/api/index.html)

In this article, we dive deep into the fundamental mathematical formulas of the *Surya Siddhanta*, cross-referencing each algorithm with its original Sanskrit shlokas and modern astronomical equivalents.

---

## 1. The Nine Systems of Measurement (*Nava Manani*)

The fourteenth chapter (*Manadhyaya*) of the *Surya Siddhanta* opens with a classification of how time is measured across physical and celestial domains.

```
+-------------------------------------------------------------------------+
|                  Siddhantic Proof: Manadhyaya (Ch. XIV, v.1-2)          |
+-------------------------------------------------------------------------+
| Sanskrit (Devanagari):                                                  |
| ब्राह्मं दिव्यं तथा पित्र्यं प्राजापत्यं च गौरवम्‌।                     |
| सौरञ्च सावनं चान्द्रमाक्षं मानानि वै नव।।                                |
|                                                                         |
| Translation (Burgess):                                                  |
| "The Brahma, the Divya, the Pitrya, the Prajapatya, the Gaurava         |
| (Jovian), the Saura (solar), the Savana (civil), the Chandra (lunar),   |
| and the Nakshatra (sidereal) — these are the nine systems of            |
| measurement."                                                           |
+-------------------------------------------------------------------------+
```

```
                        ┌───────────────────────────────┐
                        |   The 9 Time Systems (Mana)   |
                        └───────────────┬───────────────┘
                                        │
        ┌───────────────┬───────────────┼───────────────┬───────────────┐
        ▼               ▼               ▼               ▼               ▼
 ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
 │ Saura Mana  │ │ Chandra Mana│ │ Savana Mana │ │NakshatraMana│ │ Gaurava Mana│
 │(Solar Year) │ │(Lunar Month)│ │(Civil Days) │ │(Sidereal Day│ │(Jupiter Year│
 └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

These nine *Manas* serve distinct functional purposes:
1. **Saura (Solar Time):** Measured by the Sun's transit across the 12 zodiac signs (*Rashis*). Used for defining solar months, seasons (*Ritus*), and the solar year.
2. **Chandra (Lunar Time):** Measured by lunar phases (*Tithis* and *Shukla/Krishna Pakshas*). Used for religious festivals, fasts, and intercalary month (*Adhika Masa*) calculations.
3. **Savana (Civil Terrestrial Time):** Measured from sunrise to sunrise (*Ahoratra*). Used for daily civil accounting, planetary weekdays (*Vara*), and the *Ahargana* day-count.
4. **Nakshatra (Sidereal Time):** Measured by the rotation of the celestial sphere relative to fixed stars (1 Sidereal Day = 60 *Ghatis* = ~23h 56m 4s). Used for determining planetary mean velocities.
5. **Gaurava / Barhaspatya (Jovian Time):** Measured by the mean transit of Jupiter through a zodiac sign (~1 Jovian year), forming the 60-year *Samvatsara* cycle.
6. **Divya, Pitrya, Prajapatya, Brahma:** Cosmic macro-units used for celestial and geological timescales (e.g., 1 Divine Year of the Gods = 360 Solar Years; 1 Kalpa = 1,000 Mahayugas = 4.32 Billion Years = 1 Daytime of Brahma).

---

## 2. Cosmic Constants & The Mahayuga Model

In Siddhantic astronomy, celestial speeds are defined as integral counts of complete sidereal revolutions (*Bhaganas*) completed in one **Mahayuga** (4,320,000 solar years).

```
+-------------------------------------------------------------------------+
|             Siddhantic Proof: Madhyamadhikara (Ch. I, v.29-34)          |
+-------------------------------------------------------------------------+
| Sanskrit (Devanagari):                                                  |
| युगे सूर्यबुधशुक्राणां खचतुष्करदार्णवाः।                                |
| कुजार्किगुरुशीघ्राणां भगणाः पूर्वयायिनाम्॥                              |
|                                                                         |
| Translation (Burgess):                                                  |
| "In a Mahayuga, the revolutions of the Sun, Mercury, and Venus are      |
| 4,320,000. For the Sighra (conjunction) points of Mars, Saturn, and     |
| Jupiter, the revolutions are also the same."                            |
+-------------------------------------------------------------------------+
```

### 2.1 The Sanskrit Word-Numeral Code (*Katapayadi / Bhutasamkhya*)

In verse 29, the number **4,320,000** is encoded poetically as **ख-चतुष्-करद-अर्णवाः** (*Kha-chatus-karada-arnavah*):
- *Kha* (ख) = Sky / Zero (00)
- *Chatus* (चतुष्) = Four (4)
- *Rada* (रद) = Teeth = 32
- *Arnava* (अर्णव) = Oceans = 4
- Read in reverse order (*Ankasya Vama Gati*): **43,20,000**.

### 2.2 Planetary Revolutions in a Mahayuga

| Body / Orbital Point | Sanskrit Term | Revolutions per Mahayuga (R<sub>i</sub>) |
| :--- | :--- | :--- |
| **Sun (Surya)** | सूर्य | 4,320,000 |
| **Moon (Chandra)** | चन्द्र | 57,753,336 |
| **Lunar Apogee** | मन्दोच्च | 488,203 |
| **Lunar Node (Rahu)** | पातः / राहु | -232,238 (Retrograde) |
| **Mercury Sighra** | बुध-शीघ्र | 17,937,060 |
| **Venus Sighra** | शुक्र-शीघ्र | 7,022,376 |
| **Mars (Mangala)** | भौम / कुज | 2,296,832 |
| **Jupiter (Guru)** | बृहस्पति / गुरु | 364,220 |
| **Saturn (Shani)** | शनि / मन्द | 146,568 |
| **Civil Days (Savana Dina)** | सावन दिन | **1,582,237,828** |

From these discrete counts, the length of the mean sidereal year is derived purely by division:

```text
Mean Sidereal Year = 1,582,237,828 / 4,320,000 = 365.25875648 Civil Days
                   = 365 days, 6 hours, 12 minutes, 36.56 seconds
```

---

## 3. The Ahargana Algorithm: Deriving Civil Days Elapsed

The cornerstone of zero-lookup astronomy is the **Ahargana** (अहर्गण—literally *"heap of days"*). It represents the exact count of mean civil days that have elapsed from the cosmic epoch of Kaliyuga (midnight of February 18, 3102 BCE Julian) to the target date.

```
+-------------------------------------------------------------------------+
|             Siddhantic Proof: Madhyamadhikara (Ch. I, v.45-51)          |
+-------------------------------------------------------------------------+
| Sanskrit (Devanagari):                                                  |
| सौरमासाः कृतगुणा युगेऽधिमासकैर्युताः।                                  |
| भवन्ति चान्द्रमासास्ते तिथिभिर्गुणिताः पृथक्॥                            |
| अधिमासावमोनास्ताः सावनं द्युगणं विदुः॥                                   |
+-------------------------------------------------------------------------+
```

### 3.1 Mathematical Formulation of Ahargana

The computation proceeds through five sequential steps:

1. **Calculate Elapsed Solar Months (M<sub>solar</sub>):**
   ```text
   M_solar = (Elapsed Kali Solar Years × 12) + Current Solar Month Index
   ```

2. **Compute Intercalary Months (Adhika Masa: M<sub>adhika</sub>):**
   In a Mahayuga, the number of extra lunar months over solar months is:
   ```text
   Adhika Months in Yuga = Lunar Revolutions - Solar Revolutions
                         = 57,753,336 - 4,320,000 = 53,433,336 lunar months
   Adhika Months = 53,433,336 - (4,320,000 × 12) = 1,593,336
   M_adhika = floor( (M_solar × 1,593,336) / 51,840,000 )
   ```

3. **Compute Elapsed Lunar Days (Tithis: T<sub>elapsed</sub>):**
   ```text
   M_lunar = M_solar + M_adhika
   T_elapsed = (M_lunar × 30) + Current Tithi Index
   ```

4. **Compute Omitted Lunar Days (Avama / Kshaya Dina: D<sub>avama</sub>):**
   Because a synodic lunar month (~29.53 days) is shorter than 30 civil days, omitted days accumulate:
   ```text
   Total Tithis in Yuga = 57,753,336 × 30 = 1,732,600,080
   Total Civil Days in Yuga = 1,582,237,828
   Total Omitted Tithis in Yuga = 1,732,600,080 - 1,582,237,828 = 150,362,252
   D_avama = floor( (T_elapsed × 150,362,252) / 1,732,600,080 )
   ```

5. **Final Ahargana (Civil Days Elapsed: A):**
   ```text
   Ahargana (A) = T_elapsed - D_avama
   ```

With $A$ known, the mean longitude (λ̄<sub>i</sub>) of any celestial body is obtained instantly:

```text
λ̄_i = ( (A × R_i) / 1,582,237,828 × 360° ) mod 360°
```

---

## 4. Epicyclic Geometry: Manda and Sighra Corrections

Mean positions represent uniform circular motion around the Earth. To compute true observed coordinates (*Spashta Graha*), the *Surya Siddhanta* applies **Epicycles of Anomaly** (*Manda* and *Sighra*).

```
                      Mean Planet (M)
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
    Manda Samskara (Eccentricity)  Sighra Samskara (Parallax)
             │                           │
      Equation of Center          Heliocentric to Geocentric
             ▼                           ▼
    True-Mean Planet (M')         True Observed Planet (λ_true)
```

```
+-------------------------------------------------------------------------+
|             Siddhantic Proof: Spashtadhikara (Ch. II, v.1-4, v.43)      |
+-------------------------------------------------------------------------+
| Sanskrit (Devanagari):                                                  |
| अदृश्यरूपाः कालस्य मूर्तयो भगणाश्रिताः।                                 |
| शीघ्रमन्दोच्चपाताख्या ग्रहाणां गतिहेतवः॥                                |
| तद्वातवशगाद् बद्धाः प्रागपक्कृष्टिमूर्तयः।                            |
| खेचरा विचरन्त्येवं स्वमार्गेण यथायथम्॥                                  |
+-------------------------------------------------------------------------+
```

### 4.1 The Manda Equation of Center (Orbital Eccentricity)

The Manda epicycle corrects for the elliptical eccentricity of the planetary orbit:

1. **Mean Anomaly (Kendra: θ<sub>manda</sub>):**
   ```text
   θ_manda = λ̄_planet - λ_apogee (Mandoccha)
   ```

2. **Variable Epicycle Circumference (C<sub>m</sub>):**
   The *Surya Siddhanta* defines variable epicycle dimensions that contract at the solstices (*Ojha/Yugma Pada*):
   ```text
   C_m = C_even - (C_even - C_odd) × |sin(θ_manda)|
   ```

3. **Manda Equation (Manda Phala: μ):**
   Using the classical radius of the trigonometry circle ($R = 3438'$):
   ```text
   sin(μ) = (C_m / 360°) × sin(θ_manda)
   True-Mean Longitude (λ') = λ̄_planet - μ
   ```

### 4.2 The Sighra Correction (Heliocentric Parallax)

For the planets (Mars, Mercury, Jupiter, Venus, Saturn), the second epicycle (*Sighra*) converts heliocentric coordinates into geocentric coordinates by modeling Earth's orbital baseline:

```text
θ_sighra = λ_sighra_point - λ'_planet
tan(σ) = (r_sighra × sin(θ_sighra)) / (R + r_sighra × cos(θ_sighra))
λ_true = λ' + σ
```

---

## 5. The Five Limbs of Panchanga Derived Without Static Tables

Once true longitudes λ<sub>Sun</sub>(t) and λ<sub>Moon</sub>(t) are computed dynamically from Ahargana, the five limbs of the Panchanga are derived formulaically in real time:

```typescript
// Example from surya-siddhanta-audit/src/lib/surya-siddhanta/calendar/calendar.ts

export function calculateTithi(sunLong: number, moonLong: number): TithiInfo {
  // Angular separation between Moon and Sun
  const elongation = normalizeAngle(moonLong - sunLong);
  
  // Each Tithi represents exactly 12 degrees (720 arcminutes)
  const tithiFraction = elongation / 12.0;
  const tithiIndex = Math.floor(tithiFraction) + 1;
  const remainingFraction = 1.0 - (tithiFraction - Math.floor(tithiFraction));

  return {
    index: tithiIndex,
    name: TITHI_NAMES[tithiIndex - 1],
    paksha: tithiIndex <= 15 ? 'Shukla' : 'Krishna',
    pakshaTithiIndex: tithiIndex <= 15 ? tithiIndex : tithiIndex - 15,
    remainingFraction
  };
}
```

```typescript
export function calculateNakshatra(moonLong: number): NakshatraInfo {
  // Each Nakshatra spans exactly 13 degrees 20 minutes (800 arcminutes)
  const nakshatraSpan = 13.333333333333334;
  const nakshatraFraction = normalizeAngle(moonLong) / nakshatraSpan;
  const nakshatraIndex = Math.floor(nakshatraFraction) + 1;
  const pada = Math.floor((nakshatraFraction - Math.floor(nakshatraFraction)) * 4) + 1;

  return {
    index: nakshatraIndex,
    name: NAKSHATRA_NAMES[nakshatraIndex - 1],
    pada,
    ruler: NAKSHATRA_RULERS[nakshatraIndex - 1]
  };
}
```

---

## 6. Modern Theoretical Replacements for Observational Reality

To understand why modern *Drik* ephemerides achieve sub-arcsecond observational precision where classical models show secular drift, we can examine the specific modern mathematical formulations that replace ancient Siddhantic epicycles.

```
+-------------------------------------------------------------------------+
|      Bridging Classical Approximations to Modern Celestial Mechanics     |
+------------------------------+------------------------------------------+
| Classical Siddhantic Model   | Modern Theoretical Replacement           |
+------------------------------+------------------------------------------+
| • Fixed Manda Epicycles      | • Kepler's Equation & True Anomaly (ν)   |
| • Single Lunar Epicycle      | • Multi-Term Lunar Theory (ELP-2000)     |
|   (Lacks 3-Body Terms)       |   (Evection, Variation, Annual Equation) |
| • Linear Ahargana Constants  | • VSOP87 Analytical Perturbation Series  |
| • Fixed Geocentric Framework | • Nutation (Δψ) & Stellar Aberration (κ) |
| • Canonical Zero Point       | • High-Precision IAU / Lahiri Ayanamsa   |
+------------------------------+------------------------------------------+
```

### 6.1 Kepler's Equation & Orbital Ellipses (Replacing Manda Epicycles)

The classical *Manda* epicycle is a first-order sine approximation of orbital eccentricity. In modern celestial mechanics, the true position on an elliptical orbit is derived by solving **Kepler's Transcendental Equation**:

1. **Mean Anomaly to Eccentric Anomaly (E):**
   ```text
   M = E - e × sin(E)
   ```
   Solved iteratively via the **Newton-Raphson method**:
   ```text
   E_{k+1} = E_k - ( (E_k - e × sin(E_k) - M) / (1 - e × cos(E_k)) )
   ```

2. **Eccentric Anomaly to True Anomaly (ν):**
   ```text
   tan(ν / 2) = sqrt( (1 + e) / (1 - e) ) × tan(E / 2)
   ```
   or via the classical analytical Equation of Center expansion:
   ```text
   Equation of Center (ν - M) = (2e - (1/4)e³) × sin(M) + (5/4)e² × sin(2M) + (13/12)e³ × sin(3M) + ...
   ```

---

### 6.2 Major Lunar Perturbation Series (Replacing the Single Lunar Epicycle)

Because the Moon orbits Earth while both orbit the Sun, the Moon experiences intense gravitational three-body perturbations. While the *Surya Siddhanta* models the Moon with a single uniform epicycle, modern lunar theory (such as **ELP-2000/82** and **Brown's Theory**) computes the true longitude as a superposition of harmonic terms:

```text
λ_Moon = L_mean 
       + 6.2888° × sin(M')           [1. Principal Equation of Center (e = 0.0549)]
       + 1.2740° × sin(2D - M')      [2. Evection: Solar distortion of lunar eccentricity]
       + 0.6583° × sin(2D)           [3. Variation: Gravitational acceleration at syzygies]
       - 0.1856° × sin(M)            [4. Annual Equation: Earth-Sun orbital distance variation]
       - 0.1143° × sin(2F)           [5. Reduction to Ecliptic: 5.14° orbital inclination]
       + (hundreds of micro-perturbation terms...)
```

Where the fundamental lunar arguments are:
- **M'**: Moon's Mean Anomaly
- **M**: Sun's Mean Anomaly
- **D**: Mean Elongation of Moon from Sun (λ<sub>Moon</sub> - λ<sub>Sun</sub>)
- **F**: Moon's Mean Argument of Latitude (distance from ascending node)

---

### 6.3 Planetary Perturbations (VSOP87 Series)

For the planets (Mercury through Saturn), mutual gravitational pulls cause orbital parameters to oscillate. Modern ephemerides express heliocentric coordinates through **Poisson series**:

```text
Longitude L(t) = ∑_{k=0}^{n} t^k × [ ∑_j A_{j,k} × cos(B_{j,k} + C_{j,k} × t) ]
```

This accounts for complex gravitational resonances, such as the **5:2 mean-motion orbital resonance between Jupiter and Saturn** (*The Great Inequality*).

---

### 6.4 Nutation and Stellar Aberration

To convert heliocentric coordinates into true geocentric apparent coordinates observed from Earth's moving surface:

1. **Nutation in Longitude (Δψ):** Accounts for Earth's axial wobble driven by the Moon's 18.6-year nodal cycle:
   ```text
   Δψ = -17.20" × sin(Ω) - 1.32" × sin(2L_Sun) - 0.23" × sin(2L_Moon) + 0.21" × sin(2Ω)
   ```
2. **Stellar Aberration (κ):** Accounts for the finite speed of light combined with Earth's orbital velocity (v / c ≈ 20.4955"):
   ```text
   Δλ_aberration = -20.4955" × cos(λ_apparent - λ_Sun) / cos(β)
   ```

---

### 6.5 Modern Nirayana Sidereal Transformation

To obtain the true Vedic Nirayana longitude (used for Tithi, Nakshatra, and Rashi ingresses), modern engines subtract the high-precision **Chitrapaksha / Lahiri Ayanamsa**:

```text
λ_Nirayana = ( λ_Sayana (Apparent Tropical) - Ayanamsa_Lahiri(T) ) mod 360°
```

Where the IAU precession model defines Ayanamsa as a function of Julian centuries (*T*) from J2000.0:

```text
Ayanamsa_Lahiri(T) = 23° 51' 25.53" + 5029.0966" × T + 1.1120" × T² + ...
```

---

## Conclusion

The *Surya Siddhanta* is far more than an ancient mythological text; it is an axiomatic, deterministic mathematical engine of celestial mechanics. By formalizing its verses into a transparent, zero-lookup TypeScript architecture, we preserve and celebrate the scientific ingenuity of classical Indian and Nepali astronomy while providing modern developers and researchers with reproducible, verifiable timekeeping tools.

Explore the live audit engine and documentation:
- 🌐 **Interactive Calculator & Audit Dashboard:** [khumnath.com.np/surya-siddhanta-audit](https://khumnath.com.np/surya-siddhanta-audit)
- 📖 **Complete API & Sanskrit Proofs Documentation:** [khumnath.com.np/surya-siddhanta-audit/api/index.html](https://khumnath.com.np/surya-siddhanta-audit/api/index.html)
- 💻 **Open Source C++ Core Engine:** [github.com/khumnath/nepdate](https://github.com/khumnath/nepdate)

---

### References
1. *Surya-Siddhanta: A Text-Book of Hindu Astronomy*, Translated by Rev. Ebenezer Burgess, Edited by Phanindralal Gangooly (1860 / 1935).
2. *The Surya Siddhanta*, Sanskrit Original with Commentary of Pandit Bapudeva Sastri (1861).
3. Ketkar, Venkatesh Bapuji (Bapu Ketkar). *Ketaki Grahaganitam* (केतकी ग्रहगणितम्) & *Jyotirganita* (1890 / 1930).
4. Cross, Donald. *Astronomy Engine* (NASA JPL Vector Integrations), 2018–2024.
5. Rao, S. Balachandra. *Indian Astronomy: An Introduction*, Universities Press (2000).

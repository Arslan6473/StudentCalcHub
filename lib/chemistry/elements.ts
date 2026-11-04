/**
 * IUPAC abridged standard atomic weights (CIAAW), generated from
 * https://www.ciaaw.org/abridged-atomic-weights.htm — checked 2026-11-04.
 * Only elements with a standard atomic weight are listed; the ones without one
 * (no stable isotopes, e.g. Tc, Pm, Po) are in NO_STANDARD_WEIGHT instead of a guessed value.
 */
export const ATOMIC_MASSES: Record<string, number> = {
  H: 1.0080, // 1 hydrogen
  He: 4.0026, // 2 helium
  Li: 6.94, // 3 lithium
  Be: 9.0122, // 4 beryllium
  B: 10.81, // 5 boron
  C: 12.011, // 6 carbon
  N: 14.007, // 7 nitrogen
  O: 15.999, // 8 oxygen
  F: 18.998, // 9 fluorine
  Ne: 20.180, // 10 neon
  Na: 22.990, // 11 sodium
  Mg: 24.305, // 12 magnesium
  Al: 26.982, // 13 aluminium
  Si: 28.085, // 14 silicon
  P: 30.974, // 15 phosphorus
  S: 32.06, // 16 sulfur
  Cl: 35.45, // 17 chlorine
  Ar: 39.95, // 18 argon
  K: 39.098, // 19 potassium
  Ca: 40.078, // 20 calcium
  Sc: 44.956, // 21 scandium
  Ti: 47.867, // 22 titanium
  V: 50.942, // 23 vanadium
  Cr: 51.996, // 24 chromium
  Mn: 54.938, // 25 manganese
  Fe: 55.845, // 26 iron
  Co: 58.933, // 27 cobalt
  Ni: 58.693, // 28 nickel
  Cu: 63.546, // 29 copper
  Zn: 65.38, // 30 zinc
  Ga: 69.723, // 31 gallium
  Ge: 72.630, // 32 germanium
  As: 74.922, // 33 arsenic
  Se: 78.971, // 34 selenium
  Br: 79.904, // 35 bromine
  Kr: 83.798, // 36 krypton
  Rb: 85.468, // 37 rubidium
  Sr: 87.62, // 38 strontium
  Y: 88.906, // 39 yttrium
  Zr: 91.222, // 40 zirconium
  Nb: 92.906, // 41 niobium
  Mo: 95.95, // 42 molybdenum
  Ru: 101.07, // 44 ruthenium
  Rh: 102.91, // 45 rhodium
  Pd: 106.42, // 46 palladium
  Ag: 107.87, // 47 silver
  Cd: 112.41, // 48 cadmium
  In: 114.82, // 49 indium
  Sn: 118.71, // 50 tin
  Sb: 121.76, // 51 antimony
  Te: 127.60, // 52 tellurium
  I: 126.90, // 53 iodine
  Xe: 131.29, // 54 xenon
  Cs: 132.91, // 55 caesium
  Ba: 137.33, // 56 barium
  La: 138.91, // 57 lanthanum
  Ce: 140.12, // 58 cerium
  Pr: 140.91, // 59 praseodymium
  Nd: 144.24, // 60 neodymium
  Sm: 150.36, // 62 samarium
  Eu: 151.96, // 63 europium
  Gd: 157.25, // 64 gadolinium
  Tb: 158.93, // 65 terbium
  Dy: 162.50, // 66 dysprosium
  Ho: 164.93, // 67 holmium
  Er: 167.26, // 68 erbium
  Tm: 168.93, // 69 thulium
  Yb: 173.05, // 70 ytterbium
  Lu: 174.97, // 71 lutetium
  Hf: 178.49, // 72 hafnium
  Ta: 180.95, // 73 tantalum
  W: 183.84, // 74 tungsten
  Re: 186.21, // 75 rhenium
  Os: 190.23, // 76 osmium
  Ir: 192.22, // 77 iridium
  Pt: 195.08, // 78 platinum
  Au: 196.97, // 79 gold
  Hg: 200.59, // 80 mercury
  Tl: 204.38, // 81 thallium
  Pb: 207.2, // 82 lead
  Bi: 208.98, // 83 bismuth
  Th: 232.04, // 90 thorium
  Pa: 231.04, // 91 protactinium
  U: 238.03, // 92 uranium
}

/** Real elements that IUPAC gives no standard atomic weight. */
export const NO_STANDARD_WEIGHT: ReadonlySet<string> = new Set([
  'Tc', 'Pm', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Np', 'Pu', 'Am', 'Cm',
  'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs',
  'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og',
])

/** Avogadro constant (exact, SI 2019), particles per mole. */
export const AVOGADRO = 6.02214076e23

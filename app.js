const odTable = {
  0.5: 21.3,
  0.75: 26.7,
  1: 33.4,
  1.5: 48.3,
  2: 60.3,
  3: 88.9,
  4: 114.3,
  5: 141.3,
  6: 168.3,
  8: 219.1,
  10: 273.1,
  12: 323.9,
  14: 355.6,
  16: 406.4,
  18: 457.0,
  20: 508.0,
  22: 559.0,
  24: 610.0,
  26: 660.4,
  28: 711.2,
  30: 762.0,
  32: 812.8,
  34: 863.6,
  36: 914.4,
  38: 965.2,
  40: 1016.0,
  42: 1066.8,
  44: 1117.6,
  46: 1168.4,
  48: 1219.2,
};

const manualSizeExclusions = new Set([1.25, 2.5, 3.5, 5]);

const rawSteelByYear = {
  2021: 64.75,
  2022: 70.9,
  2023: 57.4,
  2024: 52.2,
  2025: 55.05,
  2026: 56.5,
};

const coatingFactors = {
  Yes: { median: 2.3, p90: 3.8, source: "Coated pipe factor" },
  No: { median: 1.8, p90: 2.7, source: "Non-coated pipe factor" },
};

const bomGroupDefinitions = [
  { name: "Pipe Group", keywords: ["pipe"] },
  {
    name: "Fitting Group",
    keywords: [
      "nipple",
      "elbow 90",
      "elbow 45",
      "elbow",
      "red tee",
      "equal tee",
      "tee",
      "con reducer",
      "con. reducer",
      "ecc reducer",
      "ecc. reducer",
      "reducer",
      "swage conc",
      "swage.conc",
      "cap",
      "cplng full",
      "cplng half",
      "cplng red",
      "coupling",
    ],
  },
  {
    name: "Flange Group",
    keywords: [
      "s.w. flange",
      "sw flange",
      "w.n. flange",
      "wn flange",
      "blind flange",
      "spacer & blind",
      "spacer and blind",
      "spacer",
      "spade",
      "flange",
      "flng.fig.8",
      "fig.8",
      "spcr",
      "bln",
    ],
  },
  {
    name: "Valves Group",
    keywords: ["gate valve", "globe valve", "check valve", "ball valve", "plug valve", "butterfly valve", "valve"],
  },
  { name: "Bolt Group", keywords: ["stud with nuts", "stud", "bolt"] },
  { name: "Gasket Group", keywords: ["gasket"] },
  { name: "Trap/Strainer Group", keywords: ["trap steam", "trap", "strainer temp", "strainer perm", "strainer"] },
  { name: "Other Group", keywords: [] },
];

const componentAliasMap = [
  {
    standardCode: "FIGURE_8_FLANGE",
    standardName: "Figure 8 Flange",
    group: "Flange Group",
    aliases: ["FIGURE-8", "FIGURE 8", "FIG.8 FL", "FIG 8 FL", "FIG.8 FLANGE", "FIG 8 FLANGE"],
  },
  {
    standardCode: "EQUAL_TEE",
    standardName: "Equal Tee",
    group: "Fitting Group",
    aliases: ["T.Equal", "Equal Tee", "Equal. T", "Equal .T", "Equal T", "EQ Tee", "EQ. TEE"],
  },
  {
    standardCode: "REDUCING_TEE",
    standardName: "Reducing Tee",
    group: "Fitting Group",
    aliases: ["T.RED", "RED.T", "RED. Tee", "Reducing Tee", "Reduc. Tee", "Reduc. T.", "Reducing T", "Red Tee", "Red. T"],
  },
  {
    standardCode: "WELD_NECK_FLANGE",
    standardName: "Weld Neck Flange",
    group: "Flange Group",
    aliases: ["FLANG WN", "WN Flange", "Weld Neck Flange", "Well neck flange", "WN Flng", "WN FLG", "WNRF", "WN RF"],
  },
  {
    standardCode: "CONCENTRIC_REDUCER",
    standardName: "Concentric Reducer",
    group: "Fitting Group",
    aliases: [
      "CON.RED",
      "CON RED",
      "CON. RED",
      "CONC.RED",
      "CONC RED",
      "CONC. RED",
      "CONCENTRIC RED",
      "CONCENTRIC REDUCER",
      "CONC REDUCER",
      "CON. REDUCER",
      "CON REDUCER",
      "CONC. REDUCER",
      "CONCENTRIC REDU.",
      "CONC. REDU.",
      "CON REDU.",
      "CONCENTRIC REDN",
      "CONC REDN",
      "CON. REDN",
      "CONCENTRIC REDUCING",
      "REDUCER CONC",
      "REDUCER CON.",
      "REDUCER CONCENTRIC",
      "REDUCE CONC",
      "REDUCE CON.",
      "REDUCE CONCENTRIC",
      "REDUCE (CONC.)",
      "REDUC. CONC",
      "REDUC. CON.",
      "REDUCING CONCENTRIC",
      "RED. CONC",
      "RED CONC",
      "RED. CON.",
      "RED CON.",
    ],
  },
  {
    standardCode: "WELDOLET",
    standardName: "Weldolet",
    group: "Fitting Group",
    aliases: ["WELDOLET", "WELD OLET", "WELD-O-LET", "WELDLET"],
  },
];

const componentFactorMaster = [
  { group: "Pipe Group", component: "Pipe", uom: "M", factor: 1, autoCostAllowed: true, confidence: "High" },
  { group: "Pipe Group", component: "ERW/HFW Pipe", uom: "M", factor: 1, autoCostAllowed: true, confidence: "High" },
  { group: "Pipe Group", component: "SAW Pipe", uom: "M", factor: 1, autoCostAllowed: true, confidence: "High" },
  { group: "Pipe Group", component: "Seamless Pipe", uom: "M", factor: 1, autoCostAllowed: true, confidence: "High" },
  { group: "Fitting Group", component: "Nipple", uom: "NOS", factor: 0.16, autoCostAllowed: true, confidence: "Medium" },
  { group: "Fitting Group", component: "45 Degree Elbow", uom: "NOS", factor: 0.35, autoCostAllowed: true, confidence: "Medium" },
  { group: "Fitting Group", component: "90 Degree Elbow", uom: "NOS", factor: 0.55, autoCostAllowed: true, confidence: "Medium" },
  { group: "Fitting Group", component: "Elbow", uom: "NOS", factor: 0.55, autoCostAllowed: true, confidence: "Medium" },
  { group: "Fitting Group", component: "Equal Tee", uom: "NOS", factor: 0.55, autoCostAllowed: true, confidence: "Medium" },
  { group: "Fitting Group", component: "Reducing Tee", uom: "NOS", factor: 0.4, autoCostAllowed: true, confidence: "Medium" },
  { group: "Fitting Group", component: "Tee", uom: "NOS", factor: 0.55, autoCostAllowed: true, confidence: "Medium" },
  { group: "Fitting Group", component: "Concentric Reducer", uom: "NOS", factor: 0.3, autoCostAllowed: true, confidence: "Medium" },
  { group: "Fitting Group", component: "Eccentric Reducer", uom: "NOS", factor: 0.3, autoCostAllowed: true, confidence: "Medium" },
  { group: "Fitting Group", component: "Reducer", uom: "NOS", factor: 0.3, autoCostAllowed: true, confidence: "Medium" },
  { group: "Fitting Group", component: "Concentric Swage", uom: "NOS", factor: 0.8, autoCostAllowed: true, confidence: "Low" },
  { group: "Fitting Group", component: "Eccentric Swage", uom: "NOS", factor: 0.8, autoCostAllowed: true, confidence: "Low" },
  { group: "Fitting Group", component: "Cap", uom: "NOS", factor: 0.25, autoCostAllowed: true, confidence: "Medium" },
  { group: "Fitting Group", component: "Coupling", uom: "NOS", factor: 0.45, autoCostAllowed: true, confidence: "Medium" },
  { group: "Fitting Group", component: "Full Coupling", uom: "NOS", factor: 0.45, autoCostAllowed: true, confidence: "Medium" },
  { group: "Fitting Group", component: "Half Coupling", uom: "NOS", factor: 0.35, autoCostAllowed: true, confidence: "Medium" },
  { group: "Fitting Group", component: "Reducing Coupling", uom: "NOS", factor: 0.35, autoCostAllowed: true, confidence: "Medium" },
  { group: "Fitting Group", component: "Union", uom: "NOS", factor: 0.35, autoCostAllowed: true, confidence: "Low" },
  { group: "Fitting Group", component: "Weldolet", uom: "NOS", factor: 0.55, autoCostAllowed: true, confidence: "Low" },
  { group: "Flange Group", component: "Flange", uom: "NOS", factor: 0.8, autoCostAllowed: true, confidence: "Medium" },
  { group: "Flange Group", component: "Socket Weld Flange", uom: "NOS", factor: 0.8, autoCostAllowed: true, confidence: "Medium" },
  { group: "Flange Group", component: "Slip-On Flange", uom: "NOS", factor: 0.7, autoCostAllowed: true, confidence: "Medium" },
  { group: "Flange Group", component: "Weld Neck Flange", uom: "NOS", factor: 0.85, autoCostAllowed: true, confidence: "Medium" },
  { group: "Flange Group", component: "Blind Flange", uom: "NOS", factor: 0.65, autoCostAllowed: true, confidence: "Medium" },
  { group: "Flange Group", component: "Threaded Flange", uom: "NOS", factor: 0.55, autoCostAllowed: true, confidence: "Low" },
  { group: "Flange Group", component: "Lap Joint Flange", uom: "NOS", factor: 0.7, autoCostAllowed: true, confidence: "Low" },
  { group: "Flange Group", component: "Figure 8 Flange", uom: "NOS", factor: 0.85, autoCostAllowed: true, confidence: "Low" },
  { group: "Flange Group", component: "Spacer", uom: "NOS", factor: 0.55, autoCostAllowed: true, confidence: "Low" },
  { group: "Flange Group", component: "Spade / Blind", uom: "NOS", factor: 0.55, autoCostAllowed: true, confidence: "Low" },
  { group: "Valves Group", component: "Gate Valve", uom: "NOS", factor: 6.25, autoCostAllowed: true, confidence: "Low" },
  { group: "Valves Group", component: "Globe Valve", uom: "NOS", factor: 8.125, autoCostAllowed: true, confidence: "Low" },
  { group: "Valves Group", component: "Check Valve", uom: "NOS", factor: 5.625, autoCostAllowed: true, confidence: "Low" },
  { group: "Valves Group", component: "Ball Valve", uom: "NOS", factor: 6.875, autoCostAllowed: true, confidence: "Low" },
  { group: "Valves Group", component: "Plug Valve", uom: "NOS", factor: 7.5, autoCostAllowed: true, confidence: "Low" },
  { group: "Valves Group", component: "Butterfly Valve", uom: "NOS", factor: 3.125, autoCostAllowed: true, confidence: "Low" },
  { group: "Valves Group", component: "Valve", uom: "NOS", factor: 6.875, autoCostAllowed: true, confidence: "Low" },
  { group: "Bolt Group", component: "Stud with Nuts", uom: "SET", factor: 0.2, autoCostAllowed: true, confidence: "Low" },
  { group: "Bolt Group", component: "Stud", uom: "NOS", factor: 0.02, autoCostAllowed: true, confidence: "Low" },
  { group: "Bolt Group", component: "Bolt", uom: "NOS", factor: 0.02, autoCostAllowed: true, confidence: "Low" },
  { group: "Gasket Group", component: "Gasket", uom: "NOS", factor: 0.06, autoCostAllowed: true, confidence: "Medium" },
  { group: "Trap/Strainer Group", component: "Steam Trap", uom: "NOS", factor: 2.5, autoCostAllowed: true, confidence: "Low" },
  { group: "Trap/Strainer Group", component: "Trap", uom: "NOS", factor: 2.5, autoCostAllowed: true, confidence: "Low" },
  { group: "Trap/Strainer Group", component: "Temporary Strainer", uom: "NOS", factor: 0.35, autoCostAllowed: true, confidence: "Low" },
  { group: "Trap/Strainer Group", component: "Permanent Strainer", uom: "NOS", factor: 2.0, autoCostAllowed: true, confidence: "Low" },
  { group: "Trap/Strainer Group", component: "Strainer", uom: "NOS", factor: 1.5, autoCostAllowed: true, confidence: "Low" },
  { group: "Other Group", component: "Unclassified", uom: "NOS", factor: 0.0, autoCostAllowed: true, confidence: "Low" },
  { group: "Other Group", component: "Other", uom: "NOS", factor: 0.0, autoCostAllowed: true, confidence: "Low" },
];

const pressureClassMultipliers = {
  150: 1.0,
  300: 2.5375,
  600: 5.709375,
  900: 9.515625,
  1500: 15.225,
  2500: 22.8375,
};

const flangePressureClassMultipliers = {
  150: 1.0,
  300: 1.45,
  600: 3.0,
  900: 4.7,
  1500: 8.0,
  2500: 16.0,
};

const valvePressureClassMultipliers = {
  150: 1.0,
  300: 2.175,
  600: 4.4,
  900: 5.2,
  1500: 8.7,
  2500: 14.4,
};

const valveGateBasePricingBands = [
  { min: 0.5, max: 4, weightCoefficient: 13.13, exponent: 0.87, conversionFactor: 4.2 },
  { min: 6, max: 12, weightCoefficient: 2.0, exponent: 2, conversionFactor: 3.7 },
  { min: 14, max: 24, weightCoefficient: 2.25, exponent: 2, conversionFactor: 3.35 },
  { min: 26, max: 48, weightCoefficient: 3.1, exponent: 2, conversionFactor: 3.0 },
];

const flangeWeightP50Multipliers = {
  WNRF: { small: 3.7, medium: 3.7, large: 3.7 },
  BLRF: { small: 2.9, medium: 2.9, large: 2.9 },
  SORF: { small: 2.71, medium: 2.38, large: 3.3 },
};

const flangeEquivalentPipeFallbackScale = 0.4;

const builtInFlangeWeightFallbacks = {
  'WNRF|150#|0.5"': { weight: 0.48, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|150#|0.75"': { weight: 0.71, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|150#|1"': { weight: 1.01, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|150#|1.5"': { weight: 1.72, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|150#|2"': { weight: 2.58, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|150#|3"': { weight: 4.92, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|150#|4"': { weight: 6.84, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|150#|6"': { weight: 10.6, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|150#|8"': { weight: 17.6, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|150#|10"': { weight: 24.0, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|150#|12"': { weight: 36.5, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|150#|14"': { weight: 48.4, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|150#|16"': { weight: 60.6, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|150#|18"': { weight: 68.3, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|150#|20"': { weight: 84.5, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|150#|22"': { weight: 102.0, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|150#|24"': { weight: 115.0, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|600#|0.5"': { weight: 0.87, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|600#|0.75"': { weight: 1.45, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|600#|1"': { weight: 1.76, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|600#|1.5"': { weight: 3.49, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|600#|2"': { weight: 4.36, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|600#|3"': { weight: 8.53, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|600#|4"': { weight: 17.4, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|600#|6"': { weight: 34.9, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|600#|8"': { weight: 53.9, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|600#|10"': { weight: 86.5, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|600#|12"': { weight: 103.0, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|600#|14"': { weight: 158.0, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|600#|16"': { weight: 219.0, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|600#|18"': { weight: 252.0, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|600#|20"': { weight: 313.0, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|600#|22"': { weight: 380.0, standard: "ANSI B16.5 built-in fallback" },
  'WNRF|600#|24"': { weight: 444.0, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|150#|0.5"': { weight: 0.8, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|150#|0.75"': { weight: 0.9, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|150#|1"': { weight: 1.0, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|150#|1.5"': { weight: 1.4, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|150#|2"': { weight: 1.6, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|150#|3"': { weight: 4.1, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|150#|4"': { weight: 7.7, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|150#|6"': { weight: 11.8, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|150#|8"': { weight: 20.4, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|150#|10"': { weight: 31.8, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|150#|12"': { weight: 50.0, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|150#|14"': { weight: 60.0, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|150#|16"': { weight: 77.0, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|150#|18"': { weight: 95.0, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|150#|20"': { weight: 123.0, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|150#|22"': { weight: 151.0, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|150#|24"': { weight: 187.0, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|600#|0.5"': { weight: 0.76, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|600#|0.75"': { weight: 1.28, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|600#|1"': { weight: 1.6, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|600#|1.5"': { weight: 3.25, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|600#|2"': { weight: 1.15, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|600#|3"': { weight: 8.44, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|600#|4"': { weight: 17.3, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|600#|6"': { weight: 36.1, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|600#|8"': { weight: 58.9, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|600#|10"': { weight: 97.5, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|600#|12"': { weight: 124.0, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|600#|14"': { weight: 151.0, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|600#|16"': { weight: 214.0, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|600#|18"': { weight: 272.0, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|600#|20"': { weight: 349.0, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|600#|22"': { weight: 437.0, standard: "ANSI B16.5 built-in fallback" },
  'BLRF|600#|24"': { weight: 533.0, standard: "ANSI B16.5 built-in fallback" },
  'SORF|150#|0.5"': { weight: 0.8, standard: "ANSI B16.5 built-in fallback" },
  'SORF|150#|0.75"': { weight: 0.9, standard: "ANSI B16.5 built-in fallback" },
  'SORF|150#|1"': { weight: 1.0, standard: "ANSI B16.5 built-in fallback" },
  'SORF|150#|1.5"': { weight: 1.4, standard: "ANSI B16.5 built-in fallback" },
  'SORF|150#|2"': { weight: 2.3, standard: "ANSI B16.5 built-in fallback" },
  'SORF|150#|3"': { weight: 3.6, standard: "ANSI B16.5 built-in fallback" },
  'SORF|150#|4"': { weight: 5.9, standard: "ANSI B16.5 built-in fallback" },
  'SORF|150#|6"': { weight: 8.6, standard: "ANSI B16.5 built-in fallback" },
  'SORF|150#|8"': { weight: 13.6, standard: "ANSI B16.5 built-in fallback" },
  'SORF|150#|10"': { weight: 19.5, standard: "ANSI B16.5 built-in fallback" },
  'SORF|150#|12"': { weight: 29.1, standard: "ANSI B16.5 built-in fallback" },
  'SORF|150#|14"': { weight: 38.6, standard: "ANSI B16.5 built-in fallback" },
  'SORF|150#|16"': { weight: 42.2, standard: "ANSI B16.5 built-in fallback" },
  'SORF|150#|18"': { weight: 54.5, standard: "ANSI B16.5 built-in fallback" },
  'SORF|150#|20"': { weight: 70.0, standard: "ANSI B16.5 built-in fallback" },
  'SORF|150#|22"': { weight: 72.0, standard: "ANSI B16.5 built-in fallback" },
  'SORF|150#|24"': { weight: 95.0, standard: "ANSI B16.5 built-in fallback" },
  'SORF|600#|0.5"': { weight: 0.74, standard: "ANSI B16.5 built-in fallback" },
  'SORF|600#|0.75"': { weight: 1.27, standard: "ANSI B16.5 built-in fallback" },
  'SORF|600#|1"': { weight: 1.52, standard: "ANSI B16.5 built-in fallback" },
  'SORF|600#|1.5"': { weight: 2.96, standard: "ANSI B16.5 built-in fallback" },
  'SORF|600#|2"': { weight: 3.62, standard: "ANSI B16.5 built-in fallback" },
  'SORF|600#|3"': { weight: 7.0, standard: "ANSI B16.5 built-in fallback" },
  'SORF|600#|4"': { weight: 14.5, standard: "ANSI B16.5 built-in fallback" },
  'SORF|600#|6"': { weight: 28.7, standard: "ANSI B16.5 built-in fallback" },
  'SORF|600#|8"': { weight: 43.4, standard: "ANSI B16.5 built-in fallback" },
  'SORF|600#|10"': { weight: 70.3, standard: "ANSI B16.5 built-in fallback" },
  'SORF|600#|12"': { weight: 84.2, standard: "ANSI B16.5 built-in fallback" },
  'SORF|600#|14"': { weight: 98.7, standard: "ANSI B16.5 built-in fallback" },
  'SORF|600#|16"': { weight: 142.0, standard: "ANSI B16.5 built-in fallback" },
  'SORF|600#|18"': { weight: 173.0, standard: "ANSI B16.5 built-in fallback" },
  'SORF|600#|20"': { weight: 220.0, standard: "ANSI B16.5 built-in fallback" },
  'SORF|600#|22"': { weight: 292.0, standard: "ANSI B16.5 built-in fallback" },
  'SORF|600#|24"': { weight: 398.0, standard: "ANSI B16.5 built-in fallback" },
};

const flangeStandardPriority = [
  "ANSI B16.5",
  "BS 3293",
  "ANSI B16.47-API 605",
  "ANSI B16.47-MSS SP-44",
];

let flangeWeightModel = null;
let flangeWeightModelStatus = "loading";

const metricCoarsePitch = {
  6: 1.0,
  8: 1.25,
  10: 1.5,
  12: 1.75,
  14: 2.0,
  16: 2.0,
  18: 2.5,
  20: 2.5,
  22: 2.5,
  24: 3.0,
  27: 3.0,
  30: 3.5,
  33: 3.5,
  36: 4.0,
  39: 4.0,
  42: 4.5,
  45: 4.5,
  48: 5.0,
  52: 5.0,
  56: 5.5,
  60: 5.5,
  64: 6.0,
};

const studBoltPricingBasis = {
  densityKgM3: 7850,
  studCorrectionFactor: 1,
  nutCorrectionFactor: 0.95,
  numberOfNuts: 2,
  commercialRawToFinishedFactor: 2.5,
};

// Maximum across-flats and thickness values from the ASME B18.2.4.6M metric
// heavy-hex table. The 0.95 nut correction below accounts for the simplified hex geometry.
const metricHeavyHexNutDimensions = {
  12: { acrossFlatsMm: 21.0, thicknessMm: 12.3 },
  14: { acrossFlatsMm: 24.0, thicknessMm: 14.3 },
  16: { acrossFlatsMm: 27.0, thicknessMm: 17.1 },
  18: { acrossFlatsMm: 30.0, thicknessMm: 18.9 },
  20: { acrossFlatsMm: 34.0, thicknessMm: 20.7 },
  22: { acrossFlatsMm: 36.0, thicknessMm: 23.6 },
  24: { acrossFlatsMm: 41.0, thicknessMm: 24.2 },
  27: { acrossFlatsMm: 46.0, thicknessMm: 27.5 },
  30: { acrossFlatsMm: 50.0, thicknessMm: 30.7 },
  33: { acrossFlatsMm: 55.0, thicknessMm: 33.6 },
  36: { acrossFlatsMm: 60.0, thicknessMm: 36.6 },
  39: { acrossFlatsMm: 65.0, thicknessMm: 39.0 },
  42: { acrossFlatsMm: 70.0, thicknessMm: 42.0 },
  45: { acrossFlatsMm: 75.0, thicknessMm: 45.0 },
  48: { acrossFlatsMm: 80.0, thicknessMm: 48.0 },
  52: { acrossFlatsMm: 85.0, thicknessMm: 52.0 },
  56: { acrossFlatsMm: 90.0, thicknessMm: 56.0 },
  64: { acrossFlatsMm: 100.0, thicknessMm: 64.0 },
};

const genericComponentFallbackFactors = {
  "Pipe Group": { component: "Generic Pipe", uom: "M", factor: 1, confidence: "Medium" },
  "Fitting Group": { component: "Generic Fitting P80", uom: "NOS", factor: 0.55, confidence: "Low" },
  "Flange Group": { component: "Generic Flange P80", uom: "NOS", factor: 0.85, confidence: "Low" },
  "Valves Group": { component: "Generic Valve P80", uom: "NOS", factor: 7.5, confidence: "Low" },
  "Bolt Group": { component: "Generic Bolt Set P80", uom: "SET", factor: 0.2, confidence: "Low" },
  "Gasket Group": { component: "Generic Gasket P80", uom: "NOS", factor: 0.06, confidence: "Low" },
  "Trap/Strainer Group": { component: "Generic Trap/Strainer P80", uom: "NOS", factor: 2.5, confidence: "Low" },
};

const dnToNps = {
  15: 0.5,
  20: 0.75,
  25: 1,
  40: 1.5,
  50: 2,
  80: 3,
  100: 4,
  150: 6,
  200: 8,
  250: 10,
  300: 12,
  350: 14,
  400: 16,
  450: 18,
  500: 20,
  550: 22,
  600: 24,
  650: 26,
  700: 28,
  750: 30,
  800: 32,
  850: 34,
  900: 36,
  950: 38,
  1000: 40,
  1050: 42,
  1100: 44,
  1150: 46,
  1200: 48,
};

const scheduleThicknessTable = {
  0.5: { "5S": 1.65, "5": 1.65, "10S": 2.11, "10": 2.11, "40S": 2.77, STD: 2.77, HVY: 3.25, "40": 2.77, "80S": 3.73, XS: 3.73, "80": 3.73, "160": 4.75, XXS: 7.47 },
  0.75: { "5S": 1.65, "5": 1.65, "10S": 2.11, "10": 2.11, "40S": 2.87, STD: 2.87, HVY: 3.25, "40": 2.87, "80S": 3.91, XS: 3.91, "80": 3.91, "160": 5.54, XXS: 7.82 },
  1: { "5S": 1.65, "5": 1.65, "10S": 2.77, "10": 2.77, "40S": 3.38, STD: 3.38, HVY: 4.05, "40": 3.38, "80S": 4.55, XS: 4.55, "80": 4.55, "160": 6.35, XXS: 9.09 },
  1.5: { "5S": 1.65, "5": 1.65, "10S": 2.77, "10": 2.77, "40S": 3.68, STD: 3.68, HVY: 4.05, "40": 3.68, "80S": 5.08, XS: 5.08, "80": 5.08, "160": 7.14, XXS: 10.16 },
  2: { "5S": 1.65, "5": 1.65, "10S": 2.77, "10": 2.77, "40S": 3.91, STD: 3.91, HVY: 4.47, "40": 3.91, "80S": 5.54, XS: 5.54, "80": 5.54, "160": 8.71, XXS: 11.07 },
  3: { "5S": 2.11, "5": 2.11, "10S": 3.05, "10": 3.05, "40S": 5.49, STD: 5.49, HVY: 4.85, "40": 5.49, "80S": 7.62, XS: 7.62, "80": 7.62, "160": 11.13, XXS: 15.24 },
  4: { "5S": 2.11, "5": 2.11, "10S": 3.05, "10": 3.05, "40S": 6.02, STD: 6.02, HVY: 5.4, "40": 6.02, "80S": 8.56, XS: 8.56, "80": 8.56, "120": 11.13, "160": 13.49, XXS: 17.12 },
  5: { HVY: 5.4 },
  6: { "5S": 2.77, "5": 2.77, "10S": 3.4, "10": 3.4, "40S": 7.11, STD: 7.11, HVY: 5.4, "40": 7.11, "80S": 10.97, XS: 10.97, "80": 10.97, "120": 14.27, "160": 18.24, XXS: 21.95 },
  8: { "5S": 2.77, "5": 2.77, "10S": 3.76, "10": 3.76, "20": 6.35, "30": 7.04, "40S": 8.18, STD: 8.18, "40": 8.18, "60": 10.31, "80S": 12.7, XS: 12.7, "80": 12.7, "100": 15.06, "120": 18.24, "140": 20.62, "160": 23.01, XXS: 22.23 },
  10: { "5S": 3.4, "5": 3.4, "10S": 4.19, "10": 4.19, "20": 6.35, "30": 7.8, "40S": 9.27, STD: 9.27, "40": 9.27, "60": 12.7, "80S": 12.7, XS: 12.7, "80": 15.06, "100": 18.24, "120": 21.41, "140": 25.4, "160": 28.58, XXS: 25.4 },
  12: { "5S": 3.96, "5": 4.19, "10S": 4.57, "10": 4.57, "20": 6.35, "30": 8.38, "40S": 9.53, STD: 9.53, "40": 10.31, "60": 14.27, "80S": 12.7, XS: 12.7, "80": 17.45, "100": 21.41, "120": 25.4, "140": 28.58, "160": 33.32, XXS: 25.4 },
  14: { "5S": 3.96, "10S": 4.78, "10": 6.35, "20": 7.92, "30": 9.53, STD: 9.53, "40": 11.13, XS: 12.7, "60": 15.06, "80": 19.05, "100": 23.8, "120": 27.76, "140": 31.75, "160": 35.71 },
  16: { "5S": 4.19, "10S": 4.78, "10": 6.35, "20": 7.92, "30": 9.53, STD: 9.53, "40": 12.7, XS: 12.7, "60": 16.66, "80": 21.41, "100": 26.19, "120": 30.94, "140": 36.53, "160": 40.46 },
  18: { "5S": 4.19, "10S": 4.78, "10": 6.35, "20": 7.92, STD: 9.53, "30": 11.13, XS: 12.7, "40": 14.27, "60": 19.05, "80": 23.8, "100": 29.36, "120": 34.93, "140": 39.67, "160": 45.24 },
  20: { "5S": 4.78, "10S": 5.54, "10": 6.35, STD: 9.53, "20": 9.35, "30": 12.7, XS: 12.7, "40": 15.06, "60": 20.62, "80": 26.19, "100": 32.54, "120": 38.1, "140": 44.45, "160": 49.99 },
  22: { "5S": 4.78, "10S": 5.54, "10": 6.35, STD: 9.53, "20": 9.35, "30": 12.7, XS: 12.7, "40": 15.88, "60": 22.23, "80": 28.57, "100": 34.92, "120": 41.27, "140": 47.62, "160": 53.97 },
  24: { "5S": 5.54, "10S": 6.35, "10": 6.35, STD: 9.53, "20": 9.35, XS: 12.7, "30": 14.27, "40": 17.45, "60": 24.59, "80": 30.94, "100": 38.89, "120": 46.02, "140": 52.37, "160": 59.51 },
  26: { "10": 7.92, STD: 9.53, "20": 12.7, XS: 12.7 },
  28: { "10": 7.92, STD: 9.53, "20": 12.7, XS: 12.7, "30": 15.87 },
  30: { "10": 7.92, STD: 9.53, "20": 12.7, XS: 12.7, "30": 15.87 },
  32: { "10": 7.92, STD: 9.53, "20": 12.7, XS: 12.7, "30": 15.87, "40": 17.45 },
  34: { "10": 7.92, STD: 9.53, "20": 12.7, XS: 12.7, "30": 15.87, "40": 17.45 },
  36: { "10": 7.92, STD: 9.53, "20": 12.7, XS: 12.7, "30": 15.87, "40": 19.05 },
  38: { STD: 9.53, XS: 12.7 },
  40: { STD: 9.53, XS: 12.7 },
  42: { STD: 9.53, XS: 12.7 },
  44: { STD: 9.53, XS: 12.7 },
  46: { STD: 9.53, XS: 12.7 },
  48: { STD: 9.53, XS: 12.7 },
};

const bomColumnAliases = {
  size: ["size", "nps", "pipesize", "nominalsize", "diameter", "dia"],
  thickness: [
    "thickness",
    "thk",
    "thck",
    "schthckrating",
    "schedulethicknessrating",
    "wallthickness",
    "wallthk",
    "thkmm",
    "thicknessmm",
  ],
  length: ["length", "lengthm", "qty", "quantity", "totalm", "meter", "metre", "m"],
  uom: [
    "uom",
    "unitmnos",
    "unitmnoss",
    "unitofmeasure",
    "unit",
    "uommnos",
    "quantitymnos",
    "quantitymnoss",
    "qtymnos",
    "qtymnoss",
    "quantityunit",
    "qtyuom",
  ],
  item: ["items", "item", "itemdescription", "description", "shorttext"],
  coating: ["coating", "coated", "coatingscope", "lining", "pe"],
  spec: ["material", "materials", "materialdescription", "materialspec", "spec", "description", "items"],
  rawOverride: ["rawsteelrskg", "rawsteel", "rawsteelrate", "rawsteelprice"],
  factorOverride: ["estimatefactoroverride", "factoroverride", "factor", "estimatefactor"],
};

const elements = {
  projectDescription: document.querySelector("#project-description"),
  projectNumber: document.querySelector("#project-number"),
  year: document.querySelector("#year"),
  size: document.querySelector("#size"),
  thicknessMode: document.querySelector("#thickness-mode"),
  thicknessLabel: document.querySelector("#thickness-label"),
  thickness: document.querySelector("#thickness"),
  scheduleField: document.querySelector("#schedule-field"),
  schedule: document.querySelector("#schedule"),
  length: document.querySelector("#length"),
  spec: document.querySelector("#spec"),
  materialBasis: document.querySelector("#material-basis"),
  materialGradeFamily: document.querySelector("#material-grade-family"),
  materialStandardOutput: document.querySelector("#material-standard-output"),
  rawMaterialBasisOutput: document.querySelector("#raw-material-basis-output"),
  rawMaterialRangeOutput: document.querySelector("#raw-material-range-output"),
  recommendedRateOutput: document.querySelector("#recommended-rate-output"),
  coating: document.querySelector("#coating"),
  rawOverride: document.querySelector("#raw-override"),
  factorOverride: document.querySelector("#factor-override"),
  factorCsOutput: document.querySelector("#factor-cs-output"),
  addLine: document.querySelector("#add-line-button"),
  addComponent: document.querySelector("#add-component-button"),
  resetComponent: document.querySelector("#reset-component-button"),
  componentGroup: document.querySelector("#component-group"),
  componentType: document.querySelector("#component-type"),
  componentSize: document.querySelector("#component-size"),
  componentSizeLabel: document.querySelector("#component-size-label"),
  componentRating: document.querySelector("#component-rating"),
  componentRatingField: document.querySelector("#component-rating-field"),
  componentMaterial: document.querySelector("#component-material"),
  componentQuantity: document.querySelector("#component-quantity"),
  componentUom: document.querySelector("#component-uom"),
  componentWarning: document.querySelector("#component-warning"),
  componentOutputGroup: document.querySelector("#component-output-group"),
  componentOutputStatus: document.querySelector("#component-output-status"),
  componentMaterialCategory: document.querySelector("#component-material-category"),
  componentRawRate: document.querySelector("#component-raw-rate"),
  componentFactor: document.querySelector("#component-factor"),
  componentUnitRate: document.querySelector("#component-unit-rate"),
  componentNormalTotal: document.querySelector("#component-normal-total"),
  componentP90Total: document.querySelector("#component-p90-total"),
  componentBasis: document.querySelector("#component-basis"),
  themeToggle: document.querySelector("#theme-toggle"),
  print: document.querySelector("#print-button"),
  exportCsv: document.querySelector("#export-csv-button"),
  bomReport: document.querySelector("#bom-report-button"),
  bomExcelReport: document.querySelector("#bom-excel-report-button"),
  bomReportPreview: document.querySelector("#bom-report-preview"),
  bomReportFrame: document.querySelector("#bom-report-frame"),
  bomReportPrint: document.querySelector("#bom-report-print-button"),
  bomReportClose: document.querySelector("#bom-report-close-button"),
  reset: document.querySelector("#reset-button"),
  sideNav: document.querySelector("#side-nav"),
  sideBrandHome: document.querySelector("#side-brand-home"),
  sideNavToggle: document.querySelector("#side-nav-toggle"),
  sideNavLinks: document.querySelectorAll(".side-nav nav a"),
  bomFile: document.querySelector("#bom-file"),
  bomDropZone: document.querySelector("#bom-drop-zone"),
  bomStatus: document.querySelector("#bom-status"),
  bomProgress: document.querySelector("#bom-progress"),
  bomProgressRing: document.querySelector("#bom-progress-ring"),
  bomProgressCount: document.querySelector("#bom-progress-count"),
  bomProgressTitle: document.querySelector("#bom-progress-title"),
  bomProgressDetail: document.querySelector("#bom-progress-detail"),
  bomProgressPercent: document.querySelector("#bom-progress-percent"),
  successMessage: document.querySelector("#success-message"),
  reportGenerated: document.querySelector("#report-generated"),
  overrideReviewCard: document.querySelector("#override-review-card"),
  overrideReviewList: document.querySelector("#override-review-list"),
  factorSource: document.querySelector("#factor-source"),
  warning: document.querySelector("#warning"),
  odMm: document.querySelector("#od-mm"),
  weightKgm: document.querySelector("#weight-kgm"),
  totalWeight: document.querySelector("#total-weight"),
  rawSteel: document.querySelector("#raw-steel"),
  medianFactor: document.querySelector("#median-factor"),
  medianRsKg: document.querySelector("#median-rs-kg"),
  medianRsM: document.querySelector("#median-rs-m"),
  medianTotal: document.querySelector("#median-total"),
  p90Factor: document.querySelector("#p90-factor"),
  p90RsKg: document.querySelector("#p90-rs-kg"),
  p90RsM: document.querySelector("#p90-rs-m"),
  p90Total: document.querySelector("#p90-total"),
  pipeBasisMaterial: document.querySelector("#pipe-basis-material"),
  pipeBasisSizeWall: document.querySelector("#pipe-basis-size-wall"),
  pipeBasisCoating: document.querySelector("#pipe-basis-coating"),
  pipeBasisRaw: document.querySelector("#pipe-basis-raw"),
  pipeBasisFactor: document.querySelector("#pipe-basis-factor"),
  pipeBasisFinishedRate: document.querySelector("#pipe-basis-finished-rate"),
  pipeBasisRiskReserve: document.querySelector("#pipe-basis-risk-reserve"),
  pipeBasisP90Uplift: document.querySelector("#pipe-basis-p90-uplift"),
  pipeBasisP90Total: document.querySelector("#pipe-basis-p90-total"),
  lineItemsBody: document.querySelector("#line-items-body"),
  lineCount: document.querySelector("#line-count"),
  categoryCount: document.querySelector("#category-count"),
  categoryLineCheck: document.querySelector("#category-line-check"),
  categoryTables: document.querySelector("#category-tables"),
  sortButtons: document.querySelectorAll(".sort-button"),
  summaryWeight: document.querySelector("#summary-weight"),
  summaryMedian: document.querySelector("#summary-median"),
  summaryP90: document.querySelector("#summary-p90"),
  whatIfBase: document.querySelector("#whatif-base"),
  whatIfLow: document.querySelector("#whatif-low"),
  whatIfHigh: document.querySelector("#whatif-high"),
  whatIfRange: document.querySelector("#whatif-range"),
  whatIfDriver: document.querySelector("#whatif-driver"),
  whatIfChart: document.querySelector("#whatif-chart"),
  whatIfBody: document.querySelector("#whatif-body"),
  whatIfScope: document.querySelector("#whatif-scope"),
  whatIfScopeNote: document.querySelector("#whatif-scope-note"),
  whatIfToggles: document.querySelectorAll(".whatif-toggle"),
  whatIfSortButtons: document.querySelectorAll(".whatif-sort-button"),
  bomGroupCount: document.querySelector("#bom-group-count"),
  bomGroupTables: document.querySelector("#bom-group-tables"),
  rawSteelSlider: document.querySelector("#raw-steel-slider"),
  rawSteelSliderValue: document.querySelector("#raw-steel-slider-value"),
  rawSteelSliderRate: document.querySelector("#raw-steel-slider-rate"),
  rawSteelSliderBase: document.querySelector("#raw-steel-slider-base"),
  rawSteelSliderThumb: document.querySelector("#raw-steel-slider-thumb"),
  rawSteelSliderProgress: document.querySelector("#raw-steel-slider-progress"),
  rawMaterialSliderPanel: document.querySelector("#raw-material-slider-panel"),
  pipeFactorSlider: document.querySelector("#pipe-factor-slider"),
  pipeFactorSliderValue: document.querySelector("#pipe-factor-slider-value"),
  pipeFactorSliderRate: document.querySelector("#pipe-factor-slider-rate"),
  pipeFactorSliderBase: document.querySelector("#pipe-factor-slider-base"),
  pipeFactorSliderThumb: document.querySelector("#pipe-factor-slider-thumb"),
  pipeFactorSliderProgress: document.querySelector("#pipe-factor-slider-progress"),
  pipeFactorSliderPanel: document.querySelector("#pipe-factor-slider-panel"),
  componentFactorSlider: document.querySelector("#component-factor-slider"),
  componentFactorSliderValue: document.querySelector("#component-factor-slider-value"),
  componentFactorSliderRate: document.querySelector("#component-factor-slider-rate"),
  componentFactorSliderBase: document.querySelector("#component-factor-slider-base"),
  componentFactorSliderThumb: document.querySelector("#component-factor-slider-thumb"),
  componentFactorSliderProgress: document.querySelector("#component-factor-slider-progress"),
  componentFactorSliderPanel: document.querySelector("#component-factor-slider-panel"),
};

const lineItems = [];
const bomGroupItems = [];
let materialSpecificationRows = [];
let materialSpecificationStatus = "loading";
let rawMaterialPriceLibrary = [];
let rawMaterialPriceLibraryStatus = "loading";
let flangeWeightModelPromise = null;
let successTimer;
let inputError = "";
let sortState = { key: "", direction: "asc" };
let whatIfSortState = { key: "", direction: "asc" };

function setSideNavCollapsed(isCollapsed) {
  if (!elements.sideNav || !elements.sideNavToggle) return;

  document.body.classList.toggle("side-nav-collapsed", isCollapsed);
  elements.sideNav.setAttribute("aria-hidden", "false");
  elements.sideNavToggle.setAttribute("aria-expanded", String(!isCollapsed));
  elements.sideNavToggle.setAttribute(
    "aria-label",
    isCollapsed ? "Expand section navigation" : "Collapse section navigation"
  );
}

function setActiveSideNavLink(hash) {
  elements.sideNavLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === hash);
  });
}

function updateActiveSideNavOnScroll() {
  const sectionLinks = Array.from(elements.sideNavLinks)
    .map((link) => ({
      link,
      section: document.querySelector(link.getAttribute("href")),
    }))
    .filter((item) => item.section);

  const activeItem = sectionLinks
    .filter((item) => item.section.getBoundingClientRect().top <= 140)
    .pop() || sectionLinks[0];

  if (activeItem) setActiveSideNavLink(activeItem.link.getAttribute("href"));
}

const builtInMaterialSpecificationRows = [
  {
    id: "MS-001",
    basic_material_of_construction: "Carbon Steel",
    pipes: {
      material_standard: [
        "A 53Gr.A/B",
        "A106Gr.A/B/C",
        "A671/A672",
        "API 5LGr. A25,P/A/B",
        "IS-1239 BLACK",
        "IS-3589 GR.330",
      ],
    },
  },
  {
    id: "MS-002",
    basic_material_of_construction: "Low Temp.CS",
    pipes: { material_standard: ["A333 Gr.1", "A333 Gr.6"] },
  },
  {
    id: "MS-003",
    basic_material_of_construction: "Low & Int.Alloy Steel for Low temp.Service",
    pipes: { material_standard: ["A333 Gr.3", "A333 Gr.4", "A333 Gr.7", "A333 Gr.8", "A333 Gr.9"] },
  },
  {
    id: "MS-008",
    basic_material_of_construction: "High Strength Carbon /Low Alloy Steel. (All API 5L PSL 2 Pipe)",
    pipes: {
      material_standard: [
        "API 5L X42",
        "API 5L X46",
        "API 5L X52",
        "API 5L X56",
        "API 5L X60",
        "API 5L X65",
        "API 5L X70",
        "API 5L X80",
        "API 5L X90",
        "API 5L X100",
        "API 5L X120",
      ],
    },
  },
  {
    id: "MS-016",
    basic_material_of_construction: "Low & Int. Alloy Steel for High temp Service",
    pipes: {
      material_standard: [
        "A335 Gr.P1",
        "A335 Gr.P2",
        "A335 Gr.P36",
        "A335 Gr.P12",
        "A335 Gr.P11",
        "A335 Gr.P15",
        "A335 Gr.P22",
        "A335 Gr.P23",
        "A335 Gr.P21",
        "A335 Gr.P5",
        "A335 Gr.P9",
        "A335 Gr.P91",
        "A335 Gr.P92",
        "A335 Gr.P122",
        "A335Gr.P911",
        "A691 1 CR",
        "A691 5 CR",
        "A691 9 CR",
      ],
    },
  },
  {
    id: "MS-029",
    basic_material_of_construction: "Austenitic Stainless Steel",
    pipes: {
      material_standard: [
        "A312 TP 304",
        "A312 TP 304L",
        "A312 TP 316",
        "A312 TP 316L",
        "A312 TP 321",
        "A312 TP316Ti",
        "A312 TP 347",
        "A312 TP 317",
        "A312 TP 317L",
        "A312 TP 309",
        "A312 TP 310",
        "A358 Gr.304",
        "A358 Gr.316",
        "A358 Gr.316L",
      ],
    },
  },
  {
    id: "MS-040",
    basic_material_of_construction: "Ferritic/Austenitic (Duplex) Stainless Steel",
    pipes: {
      material_standard: [
        "A790 S 31803",
        "A790 S 32205",
        "A790 S 32304",
        "A790 S 32900",
        "A790 S 32950",
        "A790 S 32750",
        "A790 S 32760",
        "A790 S 32550",
        "A790 S 32906",
      ],
    },
  },
  {
    id: "MS-050",
    basic_material_of_construction: "NON-FERROUS MATERIALS - Monel-400 (UNS N04400)",
    pipes: { material_standard: ["B165", "B165 / B725", "UNS N04400"] },
  },
  {
    id: "MS-051",
    basic_material_of_construction: "NON-FERROUS MATERIALS - Inconel / Nickel Alloy",
    pipes: {
      material_standard: [
        "B 423",
        "B 705",
        "UNS N08825",
        "B 407",
        "UNS N08800",
        "B 444",
        "UNS N06625",
        "B167",
        "B517",
        "UNS N06600",
      ],
    },
  },
];

const additionalCarbonSteelPipeStandards = ["IS-1239 BLACK", "IS-3589 GR.330"];

const builtInRawMaterialPriceLibrary = [
  {
    "basic_mat_of_const": "Carbon Steel",
    "children": [
      {
        "ch_comp": "C",
        "pipe_mat_std": [
          "A53 Gr.A/B",
          "A106 Gr.A/B/C",
          "A671/A672",
          "API 5L Gr.A25/P/A/B"
        ],
        "raw_material_basis": "CS billet / bloom / HR coil / plate / skelp",
        "rate_inr_per_kg": {
          "low": 50.0,
          "recommended": 56.5,
          "high": 60.0
        },
        "source_material_name": "Carbon Steel, C",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 55.0,
            "recommended": 64.75,
            "high": 70.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.0,
            "factor_wrt_ss304": 0.268817,
            "factor_wrt_ss316_ss316l": 0.22961,
            "revision_note": "No change"
          },
          "2022": {
            "low": 54.0,
            "recommended": 70.9,
            "high": 80.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.0,
            "factor_wrt_ss304": 0.268815,
            "factor_wrt_ss316_ss316l": 0.182732,
            "revision_note": "No change"
          },
          "2023": {
            "low": 47.0,
            "recommended": 57.4,
            "high": 63.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.0,
            "factor_wrt_ss304": 0.268815,
            "factor_wrt_ss316_ss316l": 0.154509,
            "revision_note": "No change"
          },
          "2024": {
            "low": 47.0,
            "recommended": 52.2,
            "high": 55.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.0,
            "factor_wrt_ss304": 0.268823,
            "factor_wrt_ss316_ss316l": 0.158904,
            "revision_note": "No change"
          },
          "2025": {
            "low": 44.0,
            "recommended": 55.05,
            "high": 61.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.0,
            "factor_wrt_ss304": 0.268812,
            "factor_wrt_ss316_ss316l": 0.167452,
            "revision_note": "No change"
          },
          "2026": {
            "low": 50.0,
            "recommended": 56.5,
            "high": 60.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.0,
            "factor_wrt_ss304": 0.268817,
            "factor_wrt_ss316_ss316l": 0.173579,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 1.0,
          "2022": 1.0,
          "2023": 1.0,
          "2024": 1.0,
          "2025": 1.0,
          "2026": 1.0
        },
        "percentile_used": 0.65
      }
    ]
  },
  {
    "basic_mat_of_const": "Low Temp.CS",
    "children": [
      {
        "ch_comp": "C,Si",
        "pipe_mat_std": [
          "A333 Gr.1",
          "A333 Gr.6"
        ],
        "raw_material_basis": "Killed fine grain CS billet / LTCS plate",
        "rate_inr_per_kg": {
          "low": 60.0,
          "recommended": 67.8,
          "high": 72.0
        },
        "source_material_name": "Low Temp CS, C-Si",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 66.0,
            "recommended": 77.7,
            "high": 84.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.2,
            "factor_wrt_ss304": 0.322581,
            "factor_wrt_ss316_ss316l": 0.275532,
            "revision_note": "No change"
          },
          "2022": {
            "low": 64.8,
            "recommended": 85.08,
            "high": 96.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.2,
            "factor_wrt_ss304": 0.322578,
            "factor_wrt_ss316_ss316l": 0.219278,
            "revision_note": "No change"
          },
          "2023": {
            "low": 56.4,
            "recommended": 68.88,
            "high": 75.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.2,
            "factor_wrt_ss304": 0.322578,
            "factor_wrt_ss316_ss316l": 0.18541,
            "revision_note": "No change"
          },
          "2024": {
            "low": 56.4,
            "recommended": 62.64,
            "high": 66.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.2,
            "factor_wrt_ss304": 0.322587,
            "factor_wrt_ss316_ss316l": 0.190685,
            "revision_note": "No change"
          },
          "2025": {
            "low": 52.8,
            "recommended": 66.06,
            "high": 73.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.2,
            "factor_wrt_ss304": 0.322574,
            "factor_wrt_ss316_ss316l": 0.200943,
            "revision_note": "No change"
          },
          "2026": {
            "low": 60.0,
            "recommended": 67.8,
            "high": 72.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.2,
            "factor_wrt_ss304": 0.322581,
            "factor_wrt_ss316_ss316l": 0.208295,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 1.2,
          "2022": 1.2,
          "2023": 1.2,
          "2024": 1.2,
          "2025": 1.2,
          "2026": 1.2
        },
        "percentile_used": 0.65
      }
    ]
  },
  {
    "basic_mat_of_const": "Low & Int.Alloy Steel for Low temp.Service",
    "children": [
      {
        "ch_comp": "3½Ni",
        "pipe_mat_std": [
          "A333 Gr.3"
        ],
        "raw_material_basis": "3.5% nickel alloy steel billet / plate",
        "rate_inr_per_kg": {
          "low": 110.5,
          "recommended": 124.865,
          "high": 132.6
        },
        "source_material_name": "Low temp alloy steel, 3.5Ni",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 121.55,
            "recommended": 143.0975,
            "high": 154.7,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594086,
            "factor_wrt_ss316_ss316l": 0.507438,
            "revision_note": "No change"
          },
          "2022": {
            "low": 119.34,
            "recommended": 156.689,
            "high": 176.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594082,
            "factor_wrt_ss316_ss316l": 0.403838,
            "revision_note": "No change"
          },
          "2023": {
            "low": 103.87,
            "recommended": 126.854,
            "high": 139.23,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.59408,
            "factor_wrt_ss316_ss316l": 0.341464,
            "revision_note": "No change"
          },
          "2024": {
            "low": 103.87,
            "recommended": 115.362,
            "high": 121.55,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594098,
            "factor_wrt_ss316_ss316l": 0.351178,
            "revision_note": "No change"
          },
          "2025": {
            "low": 97.24,
            "recommended": 121.6605,
            "high": 134.81,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594074,
            "factor_wrt_ss316_ss316l": 0.37007,
            "revision_note": "No change"
          },
          "2026": {
            "low": 110.5,
            "recommended": 124.865,
            "high": 132.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594086,
            "factor_wrt_ss316_ss316l": 0.38361,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 2.21,
          "2022": 2.21,
          "2023": 2.21,
          "2024": 2.21,
          "2025": 2.21,
          "2026": 2.21
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "¾Cr, ¾Ni",
        "pipe_mat_std": [
          "A333 Gr.4"
        ],
        "raw_material_basis": "Cr-Ni low temperature alloy steel billet",
        "rate_inr_per_kg": {
          "low": 78.0,
          "recommended": 88.14,
          "high": 93.6
        },
        "source_material_name": "Low temp alloy steel, 0.75Cr-0.75Ni",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 85.8,
            "recommended": 101.01,
            "high": 109.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.56,
            "factor_wrt_ss304": 0.419355,
            "factor_wrt_ss316_ss316l": 0.358191,
            "revision_note": "No change"
          },
          "2022": {
            "low": 84.24,
            "recommended": 110.604,
            "high": 124.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.56,
            "factor_wrt_ss304": 0.419352,
            "factor_wrt_ss316_ss316l": 0.285062,
            "revision_note": "No change"
          },
          "2023": {
            "low": 73.32,
            "recommended": 89.544,
            "high": 98.28,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.56,
            "factor_wrt_ss304": 0.419351,
            "factor_wrt_ss316_ss316l": 0.241034,
            "revision_note": "No change"
          },
          "2024": {
            "low": 73.32,
            "recommended": 81.432,
            "high": 85.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.56,
            "factor_wrt_ss304": 0.419363,
            "factor_wrt_ss316_ss316l": 0.24789,
            "revision_note": "No change"
          },
          "2025": {
            "low": 68.64,
            "recommended": 85.878,
            "high": 95.16,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.56,
            "factor_wrt_ss304": 0.419347,
            "factor_wrt_ss316_ss316l": 0.261226,
            "revision_note": "No change"
          },
          "2026": {
            "low": 78.0,
            "recommended": 88.14,
            "high": 93.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.56,
            "factor_wrt_ss304": 0.419355,
            "factor_wrt_ss316_ss316l": 0.270783,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 1.56,
          "2022": 1.56,
          "2023": 1.56,
          "2024": 1.56,
          "2025": 1.56,
          "2026": 1.56
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "2½Ni",
        "pipe_mat_std": [
          "A333 Gr.7"
        ],
        "raw_material_basis": "2.5% nickel alloy steel billet / plate",
        "rate_inr_per_kg": {
          "low": 93.0,
          "recommended": 105.09,
          "high": 111.6
        },
        "source_material_name": "Low temp alloy steel, 2.5Ni",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 102.3,
            "recommended": 120.435,
            "high": 130.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.5,
            "factor_wrt_ss316_ss316l": 0.427074,
            "revision_note": "No change"
          },
          "2022": {
            "low": 100.44,
            "recommended": 131.874,
            "high": 148.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.499996,
            "factor_wrt_ss316_ss316l": 0.339881,
            "revision_note": "No change"
          },
          "2023": {
            "low": 87.42,
            "recommended": 106.764,
            "high": 117.18,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.499995,
            "factor_wrt_ss316_ss316l": 0.287386,
            "revision_note": "No change"
          },
          "2024": {
            "low": 87.42,
            "recommended": 97.092,
            "high": 102.3,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.50001,
            "factor_wrt_ss316_ss316l": 0.295562,
            "revision_note": "No change"
          },
          "2025": {
            "low": 81.84,
            "recommended": 102.393,
            "high": 113.46,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.49999,
            "factor_wrt_ss316_ss316l": 0.311462,
            "revision_note": "No change"
          },
          "2026": {
            "low": 93.0,
            "recommended": 105.09,
            "high": 111.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.5,
            "factor_wrt_ss316_ss316l": 0.322857,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 1.86,
          "2022": 1.86,
          "2023": 1.86,
          "2024": 1.86,
          "2025": 1.86,
          "2026": 1.86
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "9Ni",
        "pipe_mat_std": [
          "A333 Gr.8"
        ],
        "raw_material_basis": "9% nickel steel plate / billet",
        "rate_inr_per_kg": {
          "low": 199.0,
          "recommended": 224.87,
          "high": 238.8
        },
        "source_material_name": "Low temp alloy steel, 9Ni",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 218.9,
            "recommended": 257.705,
            "high": 278.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.98,
            "factor_wrt_ss304": 1.069892,
            "factor_wrt_ss316_ss316l": 0.913848,
            "revision_note": "No change"
          },
          "2022": {
            "low": 214.92,
            "recommended": 282.182,
            "high": 318.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.98,
            "factor_wrt_ss304": 1.069884,
            "factor_wrt_ss316_ss316l": 0.727273,
            "revision_note": "No change"
          },
          "2023": {
            "low": 187.06,
            "recommended": 228.452,
            "high": 250.74,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.98,
            "factor_wrt_ss304": 1.069882,
            "factor_wrt_ss316_ss316l": 0.614945,
            "revision_note": "No change"
          },
          "2024": {
            "low": 187.06,
            "recommended": 207.756,
            "high": 218.9,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.98,
            "factor_wrt_ss304": 1.069915,
            "factor_wrt_ss316_ss316l": 0.632438,
            "revision_note": "No change"
          },
          "2025": {
            "low": 175.12,
            "recommended": 219.099,
            "high": 242.78,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.98,
            "factor_wrt_ss304": 1.069872,
            "factor_wrt_ss316_ss316l": 0.666461,
            "revision_note": "No change"
          },
          "2026": {
            "low": 199.0,
            "recommended": 224.87,
            "high": 238.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.98,
            "factor_wrt_ss304": 1.069892,
            "factor_wrt_ss316_ss316l": 0.690845,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 3.98,
          "2022": 3.98,
          "2023": 3.98,
          "2024": 3.98,
          "2025": 3.98,
          "2026": 3.98
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "2Ni, 1Cu",
        "pipe_mat_std": [
          "A333 Gr.9"
        ],
        "raw_material_basis": "Ni-Cu low temperature alloy steel billet",
        "rate_inr_per_kg": {
          "low": 110.5,
          "recommended": 124.865,
          "high": 132.6
        },
        "source_material_name": "Low temp alloy steel, 2Ni-1Cu",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 121.55,
            "recommended": 143.0975,
            "high": 154.7,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594086,
            "factor_wrt_ss316_ss316l": 0.507438,
            "revision_note": "No change"
          },
          "2022": {
            "low": 119.34,
            "recommended": 156.689,
            "high": 176.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594082,
            "factor_wrt_ss316_ss316l": 0.403838,
            "revision_note": "No change"
          },
          "2023": {
            "low": 103.87,
            "recommended": 126.854,
            "high": 139.23,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.59408,
            "factor_wrt_ss316_ss316l": 0.341464,
            "revision_note": "No change"
          },
          "2024": {
            "low": 103.87,
            "recommended": 115.362,
            "high": 121.55,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594098,
            "factor_wrt_ss316_ss316l": 0.351178,
            "revision_note": "No change"
          },
          "2025": {
            "low": 97.24,
            "recommended": 121.6605,
            "high": 134.81,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594074,
            "factor_wrt_ss316_ss316l": 0.37007,
            "revision_note": "No change"
          },
          "2026": {
            "low": 110.5,
            "recommended": 124.865,
            "high": 132.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594086,
            "factor_wrt_ss316_ss316l": 0.38361,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 2.21,
          "2022": 2.21,
          "2023": 2.21,
          "2024": 2.21,
          "2025": 2.21,
          "2026": 2.21
        },
        "percentile_used": 0.65
      }
    ]
  },
  {
    "basic_mat_of_const": "High Strength Carbon / Low Alloy Steel",
    "children": [
      {
        "ch_comp": "C,Mn,Co,V,Ti",
        "grade_family": "API 5L PSL 2, X42 to X52",
        "pipe_mat_std": [
          "API 5L X42",
          "API 5L X46",
          "API 5L X52"
        ],
        "raw_material_basis": "HSLA plate / TMCP skelp / coil",
        "rate_inr_per_kg": {
          "low": 62.0,
          "recommended": 70.06,
          "high": 74.4
        },
        "source_material_name": "API 5L high strength, X42 to X52",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 68.2,
            "recommended": 80.29,
            "high": 86.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.24,
            "factor_wrt_ss304": 0.333333,
            "factor_wrt_ss316_ss316l": 0.284716,
            "revision_note": "No change"
          },
          "2022": {
            "low": 66.96,
            "recommended": 87.916,
            "high": 99.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.24,
            "factor_wrt_ss304": 0.333331,
            "factor_wrt_ss316_ss316l": 0.226588,
            "revision_note": "No change"
          },
          "2023": {
            "low": 58.28,
            "recommended": 71.176,
            "high": 78.12,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.24,
            "factor_wrt_ss304": 0.33333,
            "factor_wrt_ss316_ss316l": 0.191591,
            "revision_note": "No change"
          },
          "2024": {
            "low": 58.28,
            "recommended": 64.728,
            "high": 68.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.24,
            "factor_wrt_ss304": 0.33334,
            "factor_wrt_ss316_ss316l": 0.197041,
            "revision_note": "No change"
          },
          "2025": {
            "low": 54.56,
            "recommended": 68.262,
            "high": 75.64,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.24,
            "factor_wrt_ss304": 0.333327,
            "factor_wrt_ss316_ss316l": 0.207641,
            "revision_note": "No change"
          },
          "2026": {
            "low": 62.0,
            "recommended": 70.06,
            "high": 74.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.24,
            "factor_wrt_ss304": 0.333333,
            "factor_wrt_ss316_ss316l": 0.215238,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 1.24,
          "2022": 1.24,
          "2023": 1.24,
          "2024": 1.24,
          "2025": 1.24,
          "2026": 1.24
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "C,Mn,Co,V,Ti",
        "grade_family": "API 5L PSL 2, X56 to X70",
        "pipe_mat_std": [
          "API 5L X56",
          "API 5L X60",
          "API 5L X65",
          "API 5L X70"
        ],
        "raw_material_basis": "Higher strength HSLA plate / TMCP skelp",
        "rate_inr_per_kg": {
          "low": 71.0,
          "recommended": 80.23,
          "high": 85.2
        },
        "source_material_name": "API 5L high strength, X56 to X70",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 78.1,
            "recommended": 91.945,
            "high": 99.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.42,
            "factor_wrt_ss304": 0.38172,
            "factor_wrt_ss316_ss316l": 0.326046,
            "revision_note": "No change"
          },
          "2022": {
            "low": 76.68,
            "recommended": 100.678,
            "high": 113.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.42,
            "factor_wrt_ss304": 0.381718,
            "factor_wrt_ss316_ss316l": 0.259479,
            "revision_note": "No change"
          },
          "2023": {
            "low": 66.74,
            "recommended": 81.508,
            "high": 89.46,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.42,
            "factor_wrt_ss304": 0.381717,
            "factor_wrt_ss316_ss316l": 0.219402,
            "revision_note": "No change"
          },
          "2024": {
            "low": 66.74,
            "recommended": 74.124,
            "high": 78.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.42,
            "factor_wrt_ss304": 0.381728,
            "factor_wrt_ss316_ss316l": 0.225644,
            "revision_note": "No change"
          },
          "2025": {
            "low": 62.48,
            "recommended": 78.171,
            "high": 86.62,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.42,
            "factor_wrt_ss304": 0.381713,
            "factor_wrt_ss316_ss316l": 0.237783,
            "revision_note": "No change"
          },
          "2026": {
            "low": 71.0,
            "recommended": 80.23,
            "high": 85.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.42,
            "factor_wrt_ss304": 0.38172,
            "factor_wrt_ss316_ss316l": 0.246482,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 1.42,
          "2022": 1.42,
          "2023": 1.42,
          "2024": 1.42,
          "2025": 1.42,
          "2026": 1.42
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "C,Mn,Co,V,Ti",
        "grade_family": "API 5L PSL 2, X80 to X120",
        "pipe_mat_std": [
          "API 5L X80",
          "API 5L X90",
          "API 5L X100",
          "API 5L X120"
        ],
        "raw_material_basis": "Premium HSLA / TMCP plate / skelp",
        "rate_inr_per_kg": {
          "low": 93.0,
          "recommended": 105.09,
          "high": 111.6
        },
        "source_material_name": "API 5L high strength, X80 to X120",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 102.3,
            "recommended": 120.435,
            "high": 130.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.5,
            "factor_wrt_ss316_ss316l": 0.427074,
            "revision_note": "No change"
          },
          "2022": {
            "low": 100.44,
            "recommended": 131.874,
            "high": 148.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.499996,
            "factor_wrt_ss316_ss316l": 0.339881,
            "revision_note": "No change"
          },
          "2023": {
            "low": 87.42,
            "recommended": 106.764,
            "high": 117.18,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.499995,
            "factor_wrt_ss316_ss316l": 0.287386,
            "revision_note": "No change"
          },
          "2024": {
            "low": 87.42,
            "recommended": 97.092,
            "high": 102.3,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.50001,
            "factor_wrt_ss316_ss316l": 0.295562,
            "revision_note": "No change"
          },
          "2025": {
            "low": 81.84,
            "recommended": 102.393,
            "high": 113.46,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.49999,
            "factor_wrt_ss316_ss316l": 0.311462,
            "revision_note": "No change"
          },
          "2026": {
            "low": 93.0,
            "recommended": 105.09,
            "high": 111.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.5,
            "factor_wrt_ss316_ss316l": 0.322857,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 1.86,
          "2022": 1.86,
          "2023": 1.86,
          "2024": 1.86,
          "2025": 1.86,
          "2026": 1.86
        },
        "percentile_used": 0.65
      }
    ]
  },
  {
    "basic_mat_of_const": "Low & Int. Alloy Steel for High temp Service",
    "children": [
      {
        "ch_comp": "C, ½Mo",
        "pipe_mat_std": [
          "A335 Gr.P1",
          "A691 CM65"
        ],
        "raw_material_basis": "C-Mo alloy steel billet",
        "rate_inr_per_kg": {
          "low": 97.5,
          "recommended": 110.175,
          "high": 117.0
        },
        "source_material_name": "C-0.5Mo alloy steel",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 107.25,
            "recommended": 126.2625,
            "high": 136.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.95,
            "factor_wrt_ss304": 0.524194,
            "factor_wrt_ss316_ss316l": 0.447739,
            "revision_note": "No change"
          },
          "2022": {
            "low": 105.3,
            "recommended": 138.255,
            "high": 156.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.95,
            "factor_wrt_ss304": 0.52419,
            "factor_wrt_ss316_ss316l": 0.356327,
            "revision_note": "No change"
          },
          "2023": {
            "low": 91.65,
            "recommended": 111.93,
            "high": 122.85,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.95,
            "factor_wrt_ss304": 0.524189,
            "factor_wrt_ss316_ss316l": 0.301292,
            "revision_note": "No change"
          },
          "2024": {
            "low": 91.65,
            "recommended": 101.79,
            "high": 107.25,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.95,
            "factor_wrt_ss304": 0.524204,
            "factor_wrt_ss316_ss316l": 0.309863,
            "revision_note": "No change"
          },
          "2025": {
            "low": 85.8,
            "recommended": 107.3475,
            "high": 118.95,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.95,
            "factor_wrt_ss304": 0.524183,
            "factor_wrt_ss316_ss316l": 0.326532,
            "revision_note": "No change"
          },
          "2026": {
            "low": 97.5,
            "recommended": 110.175,
            "high": 117.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.95,
            "factor_wrt_ss304": 0.524194,
            "factor_wrt_ss316_ss316l": 0.338479,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 1.95,
          "2022": 1.95,
          "2023": 1.95,
          "2024": 1.95,
          "2025": 1.95,
          "2026": 1.95
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "½Cr, ½Mo",
        "pipe_mat_std": [
          "A335 Gr.P2",
          "A335 Gr.P36",
          "A691 ½CR"
        ],
        "raw_material_basis": "Cr-Mo alloy steel billet",
        "rate_inr_per_kg": {
          "low": 110.5,
          "recommended": 124.865,
          "high": 132.6
        },
        "source_material_name": "0.5Cr-0.5Mo alloy steel",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 121.55,
            "recommended": 143.0975,
            "high": 154.7,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594086,
            "factor_wrt_ss316_ss316l": 0.507438,
            "revision_note": "No change"
          },
          "2022": {
            "low": 119.34,
            "recommended": 156.689,
            "high": 176.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594082,
            "factor_wrt_ss316_ss316l": 0.403838,
            "revision_note": "No change"
          },
          "2023": {
            "low": 103.87,
            "recommended": 126.854,
            "high": 139.23,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.59408,
            "factor_wrt_ss316_ss316l": 0.341464,
            "revision_note": "No change"
          },
          "2024": {
            "low": 103.87,
            "recommended": 115.362,
            "high": 121.55,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594098,
            "factor_wrt_ss316_ss316l": 0.351178,
            "revision_note": "No change"
          },
          "2025": {
            "low": 97.24,
            "recommended": 121.6605,
            "high": 134.81,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594074,
            "factor_wrt_ss316_ss316l": 0.37007,
            "revision_note": "No change"
          },
          "2026": {
            "low": 110.5,
            "recommended": 124.865,
            "high": 132.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594086,
            "factor_wrt_ss316_ss316l": 0.38361,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 2.21,
          "2022": 2.21,
          "2023": 2.21,
          "2024": 2.21,
          "2025": 2.21,
          "2026": 2.21
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "1Cr, ½Mo / 1¼Cr, ½Mo",
        "pipe_mat_std": [
          "A335 Gr.P12",
          "A335 Gr.P11"
        ],
        "raw_material_basis": "Cr-Mo alloy steel billet",
        "rate_inr_per_kg": {
          "low": 119.5,
          "recommended": 135.035,
          "high": 143.4
        },
        "source_material_name": "1Cr-0.5Mo / 1.25Cr-0.5Mo",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 131.45,
            "recommended": 154.7525,
            "high": 167.3,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.39,
            "factor_wrt_ss304": 0.642473,
            "factor_wrt_ss316_ss316l": 0.548768,
            "revision_note": "No change"
          },
          "2022": {
            "low": 129.06,
            "recommended": 169.451,
            "high": 191.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.39,
            "factor_wrt_ss304": 0.642468,
            "factor_wrt_ss316_ss316l": 0.436729,
            "revision_note": "No change"
          },
          "2023": {
            "low": 112.33,
            "recommended": 137.186,
            "high": 150.57,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.39,
            "factor_wrt_ss304": 0.642467,
            "factor_wrt_ss316_ss316l": 0.369276,
            "revision_note": "No change"
          },
          "2024": {
            "low": 112.33,
            "recommended": 124.758,
            "high": 131.45,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.39,
            "factor_wrt_ss304": 0.642486,
            "factor_wrt_ss316_ss316l": 0.379781,
            "revision_note": "No change"
          },
          "2025": {
            "low": 105.16,
            "recommended": 131.5695,
            "high": 145.79,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.39,
            "factor_wrt_ss304": 0.642461,
            "factor_wrt_ss316_ss316l": 0.400211,
            "revision_note": "No change"
          },
          "2026": {
            "low": 119.5,
            "recommended": 135.035,
            "high": 143.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.39,
            "factor_wrt_ss304": 0.642473,
            "factor_wrt_ss316_ss316l": 0.414854,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 2.39,
          "2022": 2.39,
          "2023": 2.39,
          "2024": 2.39,
          "2025": 2.39,
          "2026": 2.39
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "2¼Cr, 1Mo",
        "pipe_mat_std": [
          "A335 Gr.P22",
          "A335 Gr.P23"
        ],
        "raw_material_basis": "2.25Cr-1Mo alloy steel billet",
        "rate_inr_per_kg": {
          "low": 155.0,
          "recommended": 175.15,
          "high": 186.0
        },
        "source_material_name": "2.25Cr-1Mo",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 170.5,
            "recommended": 200.725,
            "high": 217.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833333,
            "factor_wrt_ss316_ss316l": 0.711791,
            "revision_note": "No change"
          },
          "2022": {
            "low": 167.4,
            "recommended": 219.79,
            "high": 248.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833327,
            "factor_wrt_ss316_ss316l": 0.566469,
            "revision_note": "No change"
          },
          "2023": {
            "low": 145.7,
            "recommended": 177.94,
            "high": 195.3,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833326,
            "factor_wrt_ss316_ss316l": 0.478977,
            "revision_note": "No change"
          },
          "2024": {
            "low": 145.7,
            "recommended": 161.82,
            "high": 170.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.83335,
            "factor_wrt_ss316_ss316l": 0.492603,
            "revision_note": "No change"
          },
          "2025": {
            "low": 136.4,
            "recommended": 170.655,
            "high": 189.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833317,
            "factor_wrt_ss316_ss316l": 0.519103,
            "revision_note": "No change"
          },
          "2026": {
            "low": 155.0,
            "recommended": 175.15,
            "high": 186.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833333,
            "factor_wrt_ss316_ss316l": 0.538095,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 3.1,
          "2022": 3.1,
          "2023": 3.1,
          "2024": 3.1,
          "2025": 3.1,
          "2026": 3.1
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "5Cr, ½Mo",
        "pipe_mat_std": [
          "A335 Gr.P5"
        ],
        "raw_material_basis": "5Cr alloy steel billet",
        "rate_inr_per_kg": {
          "low": 155.0,
          "recommended": 175.15,
          "high": 186.0
        },
        "source_material_name": "5Cr-0.5Mo",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 170.5,
            "recommended": 200.725,
            "high": 217.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833333,
            "factor_wrt_ss316_ss316l": 0.711791,
            "revision_note": "No change"
          },
          "2022": {
            "low": 167.4,
            "recommended": 219.79,
            "high": 248.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833327,
            "factor_wrt_ss316_ss316l": 0.566469,
            "revision_note": "No change"
          },
          "2023": {
            "low": 145.7,
            "recommended": 177.94,
            "high": 195.3,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833326,
            "factor_wrt_ss316_ss316l": 0.478977,
            "revision_note": "No change"
          },
          "2024": {
            "low": 145.7,
            "recommended": 161.82,
            "high": 170.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.83335,
            "factor_wrt_ss316_ss316l": 0.492603,
            "revision_note": "No change"
          },
          "2025": {
            "low": 136.4,
            "recommended": 170.655,
            "high": 189.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833317,
            "factor_wrt_ss316_ss316l": 0.519103,
            "revision_note": "No change"
          },
          "2026": {
            "low": 155.0,
            "recommended": 175.15,
            "high": 186.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833333,
            "factor_wrt_ss316_ss316l": 0.538095,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 3.1,
          "2022": 3.1,
          "2023": 3.1,
          "2024": 3.1,
          "2025": 3.1,
          "2026": 3.1
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "9Cr, 1Mo",
        "pipe_mat_std": [
          "A335 Gr.P9"
        ],
        "raw_material_basis": "9Cr-1Mo alloy steel billet",
        "rate_inr_per_kg": {
          "low": 194.5,
          "recommended": 219.785,
          "high": 233.4
        },
        "source_material_name": "9Cr-1Mo",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 213.95,
            "recommended": 251.8775,
            "high": 272.3,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.89,
            "factor_wrt_ss304": 1.045699,
            "factor_wrt_ss316_ss316l": 0.893183,
            "revision_note": "No change"
          },
          "2022": {
            "low": 210.06,
            "recommended": 275.801,
            "high": 311.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.89,
            "factor_wrt_ss304": 1.045691,
            "factor_wrt_ss316_ss316l": 0.710827,
            "revision_note": "No change"
          },
          "2023": {
            "low": 182.83,
            "recommended": 223.286,
            "high": 245.07,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.89,
            "factor_wrt_ss304": 1.045689,
            "factor_wrt_ss316_ss316l": 0.601039,
            "revision_note": "No change"
          },
          "2024": {
            "low": 182.83,
            "recommended": 203.058,
            "high": 213.95,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.89,
            "factor_wrt_ss304": 1.04572,
            "factor_wrt_ss316_ss316l": 0.618137,
            "revision_note": "No change"
          },
          "2025": {
            "low": 171.16,
            "recommended": 214.1445,
            "high": 237.29,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.89,
            "factor_wrt_ss304": 1.045678,
            "factor_wrt_ss316_ss316l": 0.65139,
            "revision_note": "No change"
          },
          "2026": {
            "low": 194.5,
            "recommended": 219.785,
            "high": 233.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.89,
            "factor_wrt_ss304": 1.045699,
            "factor_wrt_ss316_ss316l": 0.675223,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 3.89,
          "2022": 3.89,
          "2023": 3.89,
          "2024": 3.89,
          "2025": 3.89,
          "2026": 3.89
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "9Cr, 1Mo, V / W modified grades",
        "pipe_mat_std": [
          "A335 Gr.P91",
          "A335 Gr.P92",
          "A335 Gr.P911",
          "A335 Gr.P122"
        ],
        "raw_material_basis": "High alloy creep strength billet",
        "rate_inr_per_kg": {
          "low": 265.5,
          "recommended": 300.015,
          "high": 318.6
        },
        "source_material_name": "9Cr-1Mo-V / P91 family",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 292.05,
            "recommended": 343.8225,
            "high": 371.7,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.31,
            "factor_wrt_ss304": 1.427419,
            "factor_wrt_ss316_ss316l": 1.219229,
            "revision_note": "No change"
          },
          "2022": {
            "low": 286.74,
            "recommended": 376.479,
            "high": 424.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.31,
            "factor_wrt_ss304": 1.427409,
            "factor_wrt_ss316_ss316l": 0.970307,
            "revision_note": "No change"
          },
          "2023": {
            "low": 249.57,
            "recommended": 304.794,
            "high": 334.53,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.31,
            "factor_wrt_ss304": 1.427406,
            "factor_wrt_ss316_ss316l": 0.820441,
            "revision_note": "No change"
          },
          "2024": {
            "low": 249.57,
            "recommended": 277.182,
            "high": 292.05,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.31,
            "factor_wrt_ss304": 1.427449,
            "factor_wrt_ss316_ss316l": 0.843781,
            "revision_note": "No change"
          },
          "2025": {
            "low": 233.64,
            "recommended": 292.3155,
            "high": 323.91,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.31,
            "factor_wrt_ss304": 1.427391,
            "factor_wrt_ss316_ss316l": 0.889173,
            "revision_note": "No change"
          },
          "2026": {
            "low": 265.5,
            "recommended": 300.015,
            "high": 318.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.31,
            "factor_wrt_ss304": 1.427419,
            "factor_wrt_ss316_ss316l": 0.921705,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 5.31,
          "2022": 5.31,
          "2023": 5.31,
          "2024": 5.31,
          "2025": 5.31,
          "2026": 5.31
        },
        "percentile_used": 0.65
      }
    ]
  },
  {
    "basic_mat_of_const": "Austenitic Stainless Steel",
    "children": [
      {
        "ch_comp": "18Cr, 8Ni",
        "pipe_mat_std": [
          "A312 TP304",
          "A312 TP304L"
        ],
        "raw_material_basis": "SS 304/304L coil / strip / billet",
        "rate_inr_per_kg": {
          "low": 186.0,
          "recommended": 210.18,
          "high": 223.2
        },
        "source_material_name": "Austenitic SS 304 / 304L",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 204.6,
            "recommended": 240.87,
            "high": 260.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.72,
            "factor_wrt_ss304": 1.0,
            "factor_wrt_ss316_ss316l": 0.854149,
            "revision_note": "No change"
          },
          "2022": {
            "low": 200.88,
            "recommended": 263.748,
            "high": 297.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.72,
            "factor_wrt_ss304": 0.999992,
            "factor_wrt_ss316_ss316l": 0.679763,
            "revision_note": "No change"
          },
          "2023": {
            "low": 174.84,
            "recommended": 213.528,
            "high": 234.36,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.72,
            "factor_wrt_ss304": 0.999991,
            "factor_wrt_ss316_ss316l": 0.574773,
            "revision_note": "No change"
          },
          "2024": {
            "low": 174.84,
            "recommended": 194.184,
            "high": 204.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.72,
            "factor_wrt_ss304": 1.000021,
            "factor_wrt_ss316_ss316l": 0.591123,
            "revision_note": "No change"
          },
          "2025": {
            "low": 163.68,
            "recommended": 204.786,
            "high": 226.92,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.72,
            "factor_wrt_ss304": 0.99998,
            "factor_wrt_ss316_ss316l": 0.622923,
            "revision_note": "No change"
          },
          "2026": {
            "low": 186.0,
            "recommended": 210.18,
            "high": 223.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.72,
            "factor_wrt_ss304": 1.0,
            "factor_wrt_ss316_ss316l": 0.645714,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 3.72,
          "2022": 3.72,
          "2023": 3.72,
          "2024": 3.72,
          "2025": 3.72,
          "2026": 3.72
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "16/18Cr, Ni, Mo",
        "pipe_mat_std": [
          "A312 TP316",
          "A312 TP316L"
        ],
        "raw_material_basis": "Mo-bearing SS 316/316L coil / billet",
        "rate_inr_per_kg": {
          "low": 280.0,
          "recommended": 325.5,
          "high": 350.0
        },
        "source_material_name": "SS316L",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 230.0,
            "recommended": 282.0,
            "high": 310.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 4.355212,
            "factor_wrt_ss304": 1.170756,
            "factor_wrt_ss316_ss316l": 1.0,
            "revision_note": "No change"
          },
          "2022": {
            "low": 310.0,
            "recommended": 388.0,
            "high": 430.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.472496,
            "factor_wrt_ss304": 1.47109,
            "factor_wrt_ss316_ss316l": 1.0,
            "revision_note": "No change"
          },
          "2023": {
            "low": 300.0,
            "recommended": 371.5,
            "high": 410.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.472125,
            "factor_wrt_ss304": 1.739802,
            "factor_wrt_ss316_ss316l": 1.0,
            "revision_note": "No change"
          },
          "2024": {
            "low": 270.0,
            "recommended": 328.5,
            "high": 360.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.293103,
            "factor_wrt_ss304": 1.691729,
            "factor_wrt_ss316_ss316l": 1.0,
            "revision_note": "No change"
          },
          "2025": {
            "low": 280.0,
            "recommended": 328.75,
            "high": 355.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.971844,
            "factor_wrt_ss304": 1.605303,
            "factor_wrt_ss316_ss316l": 1.0,
            "revision_note": "No change"
          },
          "2026": {
            "low": 280.0,
            "recommended": 325.5,
            "high": 350.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.761062,
            "factor_wrt_ss304": 1.548673,
            "factor_wrt_ss316_ss316l": 1.0,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 4.355212,
          "2022": 5.472496,
          "2023": 6.472125,
          "2024": 6.293103,
          "2025": 5.971844,
          "2026": 5.761062
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Ti / Cb stabilized SS",
        "pipe_mat_std": [
          "A312 TP321",
          "A312 TP347"
        ],
        "raw_material_basis": "Stabilized stainless steel coil / billet",
        "rate_inr_per_kg": {
          "low": 252.0,
          "recommended": 284.76,
          "high": 302.4
        },
        "source_material_name": "SS 321 / 347",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 277.2,
            "recommended": 326.34,
            "high": 352.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.04,
            "factor_wrt_ss304": 1.354839,
            "factor_wrt_ss316_ss316l": 1.157234,
            "revision_note": "No change"
          },
          "2022": {
            "low": 272.16,
            "recommended": 357.336,
            "high": 403.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.04,
            "factor_wrt_ss304": 1.354828,
            "factor_wrt_ss316_ss316l": 0.920969,
            "revision_note": "No change"
          },
          "2023": {
            "low": 236.88,
            "recommended": 289.296,
            "high": 317.52,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.04,
            "factor_wrt_ss304": 1.354826,
            "factor_wrt_ss316_ss316l": 0.778724,
            "revision_note": "No change"
          },
          "2024": {
            "low": 236.88,
            "recommended": 263.088,
            "high": 277.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.04,
            "factor_wrt_ss304": 1.354867,
            "factor_wrt_ss316_ss316l": 0.800877,
            "revision_note": "No change"
          },
          "2025": {
            "low": 221.76,
            "recommended": 277.452,
            "high": 307.44,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.04,
            "factor_wrt_ss304": 1.354812,
            "factor_wrt_ss316_ss316l": 0.84396,
            "revision_note": "No change"
          },
          "2026": {
            "low": 252.0,
            "recommended": 284.76,
            "high": 302.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.04,
            "factor_wrt_ss304": 1.354839,
            "factor_wrt_ss316_ss316l": 0.874839,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 5.04,
          "2022": 5.04,
          "2023": 5.04,
          "2024": 5.04,
          "2025": 5.04,
          "2026": 5.04
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "SS316Ti",
        "pipe_mat_std": [
          "A312 TP316Ti"
        ],
        "raw_material_basis": "SS316Ti stabilized stainless stock",
        "rate_inr_per_kg": {
          "low": 425.0,
          "recommended": 480.25,
          "high": 510.0
        },
        "source_material_name": "SS 316Ti",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 467.5,
            "recommended": 550.375,
            "high": 595.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.5,
            "factor_wrt_ss304": 2.284946,
            "factor_wrt_ss316_ss316l": 1.951684,
            "revision_note": "No change"
          },
          "2022": {
            "low": 459.0,
            "recommended": 602.65,
            "high": 680.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.5,
            "factor_wrt_ss304": 2.284929,
            "factor_wrt_ss316_ss316l": 1.553222,
            "revision_note": "No change"
          },
          "2023": {
            "low": 399.5,
            "recommended": 487.9,
            "high": 535.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.5,
            "factor_wrt_ss304": 2.284925,
            "factor_wrt_ss316_ss316l": 1.313324,
            "revision_note": "No change"
          },
          "2024": {
            "low": 399.5,
            "recommended": 443.7,
            "high": 467.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.5,
            "factor_wrt_ss304": 2.284993,
            "factor_wrt_ss316_ss316l": 1.350685,
            "revision_note": "No change"
          },
          "2025": {
            "low": 374.0,
            "recommended": 467.925,
            "high": 518.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.5,
            "factor_wrt_ss304": 2.284902,
            "factor_wrt_ss316_ss316l": 1.423346,
            "revision_note": "No change"
          },
          "2026": {
            "low": 425.0,
            "recommended": 480.25,
            "high": 510.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.5,
            "factor_wrt_ss304": 2.284946,
            "factor_wrt_ss316_ss316l": 1.475422,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 8.5,
          "2022": 8.5,
          "2023": 8.5,
          "2024": 8.5,
          "2025": 8.5,
          "2026": 8.5
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "25Cr, 20Ni",
        "pipe_mat_std": [
          "A312 TP310"
        ],
        "raw_material_basis": "High nickel, high chromium stainless stock",
        "rate_inr_per_kg": {
          "low": 460.0,
          "recommended": 519.8,
          "high": 552.0
        },
        "source_material_name": "SS 310",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 506.0,
            "recommended": 595.7,
            "high": 644.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.2,
            "factor_wrt_ss304": 2.473118,
            "factor_wrt_ss316_ss316l": 2.112411,
            "revision_note": "No change"
          },
          "2022": {
            "low": 496.8,
            "recommended": 652.28,
            "high": 736.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.2,
            "factor_wrt_ss304": 2.4731,
            "factor_wrt_ss316_ss316l": 1.681134,
            "revision_note": "No change"
          },
          "2023": {
            "low": 432.4,
            "recommended": 528.08,
            "high": 579.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.2,
            "factor_wrt_ss304": 2.473095,
            "factor_wrt_ss316_ss316l": 1.42148,
            "revision_note": "No change"
          },
          "2024": {
            "low": 432.4,
            "recommended": 480.24,
            "high": 506.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.2,
            "factor_wrt_ss304": 2.473169,
            "factor_wrt_ss316_ss316l": 1.461918,
            "revision_note": "No change"
          },
          "2025": {
            "low": 404.8,
            "recommended": 506.46,
            "high": 561.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.2,
            "factor_wrt_ss304": 2.47307,
            "factor_wrt_ss316_ss316l": 1.540563,
            "revision_note": "No change"
          },
          "2026": {
            "low": 460.0,
            "recommended": 519.8,
            "high": 552.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.2,
            "factor_wrt_ss304": 2.473118,
            "factor_wrt_ss316_ss316l": 1.596928,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 9.2,
          "2022": 9.2,
          "2023": 9.2,
          "2024": 9.2,
          "2025": 9.2,
          "2026": 9.2
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "High Mo Austenitic SS - SS317",
        "pipe_mat_std": [
          "A312 TP317"
        ],
        "raw_material_basis": "SS317 high Mo stainless stock",
        "rate_inr_per_kg": {
          "low": 299.6,
          "recommended": 377.86,
          "high": 420.0
        },
        "source_material_name": "SS 317",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 246.1,
            "recommended": 327.935,
            "high": 372.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.064633,
            "factor_wrt_ss304": 1.361461,
            "factor_wrt_ss316_ss316l": 1.16289,
            "revision_note": "Revised: anchored to SS316/316L. Min = 1.07×SS316L min; Max = 1.20×SS316L max."
          },
          "2022": {
            "low": 331.7,
            "recommended": 451.495,
            "high": 516.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.368054,
            "factor_wrt_ss304": 1.711829,
            "factor_wrt_ss316_ss316l": 1.163647,
            "revision_note": "Revised: anchored to SS316/316L. Min = 1.07×SS316L min; Max = 1.20×SS316L max."
          },
          "2023": {
            "low": 321.0,
            "recommended": 432.15,
            "high": 492.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 7.528746,
            "factor_wrt_ss304": 2.023837,
            "factor_wrt_ss316_ss316l": 1.163257,
            "revision_note": "Revised: anchored to SS316/316L. Min = 1.07×SS316L min; Max = 1.20×SS316L max."
          },
          "2024": {
            "low": 288.9,
            "recommended": 381.915,
            "high": 432.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 7.316379,
            "factor_wrt_ss304": 1.966809,
            "factor_wrt_ss316_ss316l": 1.162603,
            "revision_note": "Revised: anchored to SS316/316L. Min = 1.07×SS316L min; Max = 1.20×SS316L max."
          },
          "2025": {
            "low": 299.6,
            "recommended": 381.76,
            "high": 426.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.934787,
            "factor_wrt_ss304": 1.864154,
            "factor_wrt_ss316_ss316l": 1.161247,
            "revision_note": "Revised: anchored to SS316/316L. Min = 1.07×SS316L min; Max = 1.20×SS316L max."
          },
          "2026": {
            "low": 299.6,
            "recommended": 377.86,
            "high": 420.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.687788,
            "factor_wrt_ss304": 1.797792,
            "factor_wrt_ss316_ss316l": 1.16086,
            "revision_note": "Revised: anchored to SS316/316L. Min = 1.07×SS316L min; Max = 1.20×SS316L max."
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 5.064633,
          "2022": 6.368054,
          "2023": 7.528746,
          "2024": 7.316379,
          "2025": 6.934787,
          "2026": 6.687788
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "6Mo Austenitic SS",
        "pipe_mat_std": [
          "A312 N08367"
        ],
        "raw_material_basis": "6Mo / super austenitic stainless stock",
        "rate_inr_per_kg": {
          "low": 929.0,
          "recommended": 1049.77,
          "high": 1114.8
        },
        "source_material_name": "6Mo austenitic SS",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 1021.9,
            "recommended": 1203.055,
            "high": 1300.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 18.58,
            "factor_wrt_ss304": 4.994624,
            "factor_wrt_ss316_ss316l": 4.266152,
            "revision_note": "No change"
          },
          "2022": {
            "low": 1003.32,
            "recommended": 1317.322,
            "high": 1486.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 18.58,
            "factor_wrt_ss304": 4.994586,
            "factor_wrt_ss316_ss316l": 3.39516,
            "revision_note": "No change"
          },
          "2023": {
            "low": 873.26,
            "recommended": 1066.492,
            "high": 1170.54,
            "percentile_used": 0.65,
            "factor_wrt_cs": 18.58,
            "factor_wrt_ss304": 4.994577,
            "factor_wrt_ss316_ss316l": 2.870773,
            "revision_note": "No change"
          },
          "2024": {
            "low": 873.26,
            "recommended": 969.876,
            "high": 1021.9,
            "percentile_used": 0.65,
            "factor_wrt_cs": 18.58,
            "factor_wrt_ss304": 4.994727,
            "factor_wrt_ss316_ss316l": 2.952438,
            "revision_note": "No change"
          },
          "2025": {
            "low": 817.52,
            "recommended": 1022.829,
            "high": 1133.38,
            "percentile_used": 0.65,
            "factor_wrt_cs": 18.58,
            "factor_wrt_ss304": 4.994526,
            "factor_wrt_ss316_ss316l": 3.111267,
            "revision_note": "No change"
          },
          "2026": {
            "low": 929.0,
            "recommended": 1049.77,
            "high": 1114.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 18.58,
            "factor_wrt_ss304": 4.994624,
            "factor_wrt_ss316_ss316l": 3.2251,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 18.58,
          "2022": 18.58,
          "2023": 18.58,
          "2024": 18.58,
          "2025": 18.58,
          "2026": 18.58
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "904L Austenitic SS",
        "pipe_mat_std": [
          "A312 N08904"
        ],
        "raw_material_basis": "904L super austenitic stainless stock",
        "rate_inr_per_kg": {
          "low": 885.0,
          "recommended": 1000.05,
          "high": 1062.0
        },
        "source_material_name": "904L",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 973.5,
            "recommended": 1146.075,
            "high": 1239.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 17.7,
            "factor_wrt_ss304": 4.758065,
            "factor_wrt_ss316_ss316l": 4.064096,
            "revision_note": "No change"
          },
          "2022": {
            "low": 955.8,
            "recommended": 1254.93,
            "high": 1416.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 17.7,
            "factor_wrt_ss304": 4.758028,
            "factor_wrt_ss316_ss316l": 3.234356,
            "revision_note": "No change"
          },
          "2023": {
            "low": 831.9,
            "recommended": 1015.98,
            "high": 1115.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 17.7,
            "factor_wrt_ss304": 4.75802,
            "factor_wrt_ss316_ss316l": 2.734805,
            "revision_note": "No change"
          },
          "2024": {
            "low": 831.9,
            "recommended": 923.94,
            "high": 973.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 17.7,
            "factor_wrt_ss304": 4.758163,
            "factor_wrt_ss316_ss316l": 2.812603,
            "revision_note": "No change"
          },
          "2025": {
            "low": 778.8,
            "recommended": 974.385,
            "high": 1079.7,
            "percentile_used": 0.65,
            "factor_wrt_cs": 17.7,
            "factor_wrt_ss304": 4.757972,
            "factor_wrt_ss316_ss316l": 2.963909,
            "revision_note": "No change"
          },
          "2026": {
            "low": 885.0,
            "recommended": 1000.05,
            "high": 1062.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 17.7,
            "factor_wrt_ss304": 4.758065,
            "factor_wrt_ss316_ss316l": 3.07235,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 17.7,
          "2022": 17.7,
          "2023": 17.7,
          "2024": 17.7,
          "2025": 17.7,
          "2026": 17.7
        },
        "percentile_used": 0.65
      }
    ]
  },
  {
    "basic_mat_of_const": "Ferritic/Austenitic Duplex Stainless Steel",
    "children": [
      {
        "ch_comp": "Lean Duplex",
        "pipe_mat_std": [
          "A790 S32304"
        ],
        "raw_material_basis": "Lean duplex coil / billet",
        "rate_inr_per_kg": {
          "low": 177.0,
          "recommended": 200.01,
          "high": 212.4
        },
        "source_material_name": "Duplex 2304",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 194.7,
            "recommended": 229.215,
            "high": 247.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.54,
            "factor_wrt_ss304": 0.951613,
            "factor_wrt_ss316_ss316l": 0.812819,
            "revision_note": "No change"
          },
          "2022": {
            "low": 191.16,
            "recommended": 250.986,
            "high": 283.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.54,
            "factor_wrt_ss304": 0.951606,
            "factor_wrt_ss316_ss316l": 0.646871,
            "revision_note": "No change"
          },
          "2023": {
            "low": 166.38,
            "recommended": 203.196,
            "high": 223.02,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.54,
            "factor_wrt_ss304": 0.951604,
            "factor_wrt_ss316_ss316l": 0.546961,
            "revision_note": "No change"
          },
          "2024": {
            "low": 166.38,
            "recommended": 184.788,
            "high": 194.7,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.54,
            "factor_wrt_ss304": 0.951633,
            "factor_wrt_ss316_ss316l": 0.562521,
            "revision_note": "No change"
          },
          "2025": {
            "low": 155.76,
            "recommended": 194.877,
            "high": 215.94,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.54,
            "factor_wrt_ss304": 0.951594,
            "factor_wrt_ss316_ss316l": 0.592782,
            "revision_note": "No change"
          },
          "2026": {
            "low": 177.0,
            "recommended": 200.01,
            "high": 212.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.54,
            "factor_wrt_ss304": 0.951613,
            "factor_wrt_ss316_ss316l": 0.61447,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 3.54,
          "2022": 3.54,
          "2023": 3.54,
          "2024": 3.54,
          "2025": 3.54,
          "2026": 3.54
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "22Cr, 5½Ni, 3Mo",
        "pipe_mat_std": [
          "A790 S31803",
          "A790 S32205"
        ],
        "raw_material_basis": "Duplex 2205 coil / billet",
        "rate_inr_per_kg": {
          "low": 442.5,
          "recommended": 500.025,
          "high": 531.0
        },
        "source_material_name": "Duplex 2205",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 486.75,
            "recommended": 573.0375,
            "high": 619.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.85,
            "factor_wrt_ss304": 2.379032,
            "factor_wrt_ss316_ss316l": 2.032048,
            "revision_note": "No change"
          },
          "2022": {
            "low": 477.9,
            "recommended": 627.465,
            "high": 708.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.85,
            "factor_wrt_ss304": 2.379014,
            "factor_wrt_ss316_ss316l": 1.617178,
            "revision_note": "No change"
          },
          "2023": {
            "low": 415.95,
            "recommended": 507.99,
            "high": 557.55,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.85,
            "factor_wrt_ss304": 2.37901,
            "factor_wrt_ss316_ss316l": 1.367402,
            "revision_note": "No change"
          },
          "2024": {
            "low": 415.95,
            "recommended": 461.97,
            "high": 486.75,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.85,
            "factor_wrt_ss304": 2.379081,
            "factor_wrt_ss316_ss316l": 1.406301,
            "revision_note": "No change"
          },
          "2025": {
            "low": 389.4,
            "recommended": 487.1925,
            "high": 539.85,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.85,
            "factor_wrt_ss304": 2.378986,
            "factor_wrt_ss316_ss316l": 1.481954,
            "revision_note": "No change"
          },
          "2026": {
            "low": 442.5,
            "recommended": 500.025,
            "high": 531.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.85,
            "factor_wrt_ss304": 2.379032,
            "factor_wrt_ss316_ss316l": 1.536175,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 8.85,
          "2022": 8.85,
          "2023": 8.85,
          "2024": 8.85,
          "2025": 8.85,
          "2026": 8.85
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "High alloy duplex",
        "pipe_mat_std": [
          "A790 S32900",
          "A790 S32950",
          "A790 S32550",
          "A790 S32906"
        ],
        "raw_material_basis": "Higher alloy duplex stainless stock",
        "rate_inr_per_kg": {
          "low": 486.5,
          "recommended": 549.745,
          "high": 583.8
        },
        "source_material_name": "Other duplex grades",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 535.15,
            "recommended": 630.0175,
            "high": 681.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.73,
            "factor_wrt_ss304": 2.615591,
            "factor_wrt_ss316_ss316l": 2.234105,
            "revision_note": "No change"
          },
          "2022": {
            "low": 525.42,
            "recommended": 689.857,
            "high": 778.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.73,
            "factor_wrt_ss304": 2.615572,
            "factor_wrt_ss316_ss316l": 1.777982,
            "revision_note": "No change"
          },
          "2023": {
            "low": 457.31,
            "recommended": 558.502,
            "high": 612.99,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.73,
            "factor_wrt_ss304": 2.615567,
            "factor_wrt_ss316_ss316l": 1.50337,
            "revision_note": "No change"
          },
          "2024": {
            "low": 457.31,
            "recommended": 507.906,
            "high": 535.15,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.73,
            "factor_wrt_ss304": 2.615645,
            "factor_wrt_ss316_ss316l": 1.546137,
            "revision_note": "No change"
          },
          "2025": {
            "low": 428.12,
            "recommended": 535.6365,
            "high": 593.53,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.73,
            "factor_wrt_ss304": 2.61554,
            "factor_wrt_ss316_ss316l": 1.629313,
            "revision_note": "No change"
          },
          "2026": {
            "low": 486.5,
            "recommended": 549.745,
            "high": 583.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.73,
            "factor_wrt_ss304": 2.615591,
            "factor_wrt_ss316_ss316l": 1.688925,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 9.73,
          "2022": 9.73,
          "2023": 9.73,
          "2024": 9.73,
          "2025": 9.73,
          "2026": 9.73
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Super Duplex",
        "pipe_mat_std": [
          "A790 S32750",
          "A790 S32760",
          "A790 S39274"
        ],
        "raw_material_basis": "Super duplex stainless stock",
        "rate_inr_per_kg": {
          "low": 641.5,
          "recommended": 724.895,
          "high": 769.8
        },
        "source_material_name": "Super Duplex",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 705.65,
            "recommended": 830.7425,
            "high": 898.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 12.83,
            "factor_wrt_ss304": 3.448925,
            "factor_wrt_ss316_ss316l": 2.945895,
            "revision_note": "No change"
          },
          "2022": {
            "low": 692.82,
            "recommended": 909.647,
            "high": 1026.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 12.83,
            "factor_wrt_ss304": 3.448899,
            "factor_wrt_ss316_ss316l": 2.344451,
            "revision_note": "No change"
          },
          "2023": {
            "low": 603.01,
            "recommended": 736.442,
            "high": 808.29,
            "percentile_used": 0.65,
            "factor_wrt_cs": 12.83,
            "factor_wrt_ss304": 3.448892,
            "factor_wrt_ss316_ss316l": 1.982347,
            "revision_note": "No change"
          },
          "2024": {
            "low": 603.01,
            "recommended": 669.726,
            "high": 705.65,
            "percentile_used": 0.65,
            "factor_wrt_cs": 12.83,
            "factor_wrt_ss304": 3.448996,
            "factor_wrt_ss316_ss316l": 2.03874,
            "revision_note": "No change"
          },
          "2025": {
            "low": 564.52,
            "recommended": 706.2915,
            "high": 782.63,
            "percentile_used": 0.65,
            "factor_wrt_cs": 12.83,
            "factor_wrt_ss304": 3.448857,
            "factor_wrt_ss316_ss316l": 2.148415,
            "revision_note": "No change"
          },
          "2026": {
            "low": 641.5,
            "recommended": 724.895,
            "high": 769.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 12.83,
            "factor_wrt_ss304": 3.448925,
            "factor_wrt_ss316_ss316l": 2.22702,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 12.83,
          "2022": 12.83,
          "2023": 12.83,
          "2024": 12.83,
          "2025": 12.83,
          "2026": 12.83
        },
        "percentile_used": 0.65
      }
    ]
  },
  {
    "basic_mat_of_const": "Non-Ferrous Materials",
    "children": [
      {
        "ch_comp": "Titanium",
        "pipe_mat_std": [
          "B861",
          "B862"
        ],
        "raw_material_basis": "Titanium sponge / slab / billet / strip",
        "rate_inr_per_kg": {
          "low": 796.5,
          "recommended": 900.045,
          "high": 955.8
        },
        "source_material_name": "Titanium",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 876.15,
            "recommended": 1031.4675,
            "high": 1115.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282258,
            "factor_wrt_ss316_ss316l": 3.657686,
            "revision_note": "No change"
          },
          "2022": {
            "low": 860.22,
            "recommended": 1129.437,
            "high": 1274.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282226,
            "factor_wrt_ss316_ss316l": 2.91092,
            "revision_note": "No change"
          },
          "2023": {
            "low": 748.71,
            "recommended": 914.382,
            "high": 1003.59,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282218,
            "factor_wrt_ss316_ss316l": 2.461324,
            "revision_note": "No change"
          },
          "2024": {
            "low": 748.71,
            "recommended": 831.546,
            "high": 876.15,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282346,
            "factor_wrt_ss316_ss316l": 2.531342,
            "revision_note": "No change"
          },
          "2025": {
            "low": 700.92,
            "recommended": 876.9465,
            "high": 971.73,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282174,
            "factor_wrt_ss316_ss316l": 2.667518,
            "revision_note": "No change"
          },
          "2026": {
            "low": 796.5,
            "recommended": 900.045,
            "high": 955.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282258,
            "factor_wrt_ss316_ss316l": 2.765115,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 15.93,
          "2022": 15.93,
          "2023": 15.93,
          "2024": 15.93,
          "2025": 15.93,
          "2026": 15.93
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Inconel / Incoloy 825",
        "pipe_mat_std": [
          "B423",
          "B705",
          "UNS N08825"
        ],
        "raw_material_basis": "Ni-Fe-Cr-Mo alloy stock",
        "rate_inr_per_kg": {
          "low": 1150.5,
          "recommended": 1300.065,
          "high": 1380.6
        },
        "source_material_name": "Incoloy / Inconel 825",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 1265.55,
            "recommended": 1489.8975,
            "high": 1610.7,
            "percentile_used": 0.65,
            "factor_wrt_cs": 23.01,
            "factor_wrt_ss304": 6.185484,
            "factor_wrt_ss316_ss316l": 5.283324,
            "revision_note": "No change"
          },
          "2022": {
            "low": 1242.54,
            "recommended": 1631.409,
            "high": 1840.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 23.01,
            "factor_wrt_ss304": 6.185437,
            "factor_wrt_ss316_ss316l": 4.204662,
            "revision_note": "No change"
          },
          "2023": {
            "low": 1081.47,
            "recommended": 1320.774,
            "high": 1449.63,
            "percentile_used": 0.65,
            "factor_wrt_cs": 23.01,
            "factor_wrt_ss304": 6.185426,
            "factor_wrt_ss316_ss316l": 3.555246,
            "revision_note": "No change"
          },
          "2024": {
            "low": 1081.47,
            "recommended": 1201.122,
            "high": 1265.55,
            "percentile_used": 0.65,
            "factor_wrt_cs": 23.01,
            "factor_wrt_ss304": 6.185611,
            "factor_wrt_ss316_ss316l": 3.656384,
            "revision_note": "No change"
          },
          "2025": {
            "low": 1012.44,
            "recommended": 1266.7005,
            "high": 1403.61,
            "percentile_used": 0.65,
            "factor_wrt_cs": 23.01,
            "factor_wrt_ss304": 6.185363,
            "factor_wrt_ss316_ss316l": 3.853081,
            "revision_note": "No change"
          },
          "2026": {
            "low": 1150.5,
            "recommended": 1300.065,
            "high": 1380.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 23.01,
            "factor_wrt_ss304": 6.185484,
            "factor_wrt_ss316_ss316l": 3.994055,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 23.01,
          "2022": 23.01,
          "2023": 23.01,
          "2024": 23.01,
          "2025": 23.01,
          "2026": 23.01
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Inconel / Incoloy 800",
        "pipe_mat_std": [
          "B407",
          "UNS N08800"
        ],
        "raw_material_basis": "Ni-Fe-Cr alloy stock",
        "rate_inr_per_kg": {
          "low": 730.0,
          "recommended": 824.9,
          "high": 876.0
        },
        "source_material_name": "Incoloy 800",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 803.0,
            "recommended": 945.35,
            "high": 1022.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 14.6,
            "factor_wrt_ss304": 3.924731,
            "factor_wrt_ss316_ss316l": 3.352305,
            "revision_note": "No change"
          },
          "2022": {
            "low": 788.4,
            "recommended": 1035.14,
            "high": 1168.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 14.6,
            "factor_wrt_ss304": 3.924701,
            "factor_wrt_ss316_ss316l": 2.667887,
            "revision_note": "No change"
          },
          "2023": {
            "low": 686.2,
            "recommended": 838.04,
            "high": 919.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 14.6,
            "factor_wrt_ss304": 3.924694,
            "factor_wrt_ss316_ss316l": 2.255828,
            "revision_note": "No change"
          },
          "2024": {
            "low": 686.2,
            "recommended": 762.12,
            "high": 803.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 14.6,
            "factor_wrt_ss304": 3.924812,
            "factor_wrt_ss316_ss316l": 2.32,
            "revision_note": "No change"
          },
          "2025": {
            "low": 642.4,
            "recommended": 803.73,
            "high": 890.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 14.6,
            "factor_wrt_ss304": 3.924655,
            "factor_wrt_ss316_ss316l": 2.444806,
            "revision_note": "No change"
          },
          "2026": {
            "low": 730.0,
            "recommended": 824.9,
            "high": 876.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 14.6,
            "factor_wrt_ss304": 3.924731,
            "factor_wrt_ss316_ss316l": 2.534255,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 14.6,
          "2022": 14.6,
          "2023": 14.6,
          "2024": 14.6,
          "2025": 14.6,
          "2026": 14.6
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Inconel 625",
        "pipe_mat_std": [
          "B444",
          "B705",
          "UNS N06625"
        ],
        "raw_material_basis": "Ni-Cr-Mo-Nb alloy stock",
        "rate_inr_per_kg": {
          "low": 2124.0,
          "recommended": 2400.12,
          "high": 2548.8
        },
        "source_material_name": "Inconel 625",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 2336.4,
            "recommended": 2750.58,
            "high": 2973.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 42.48,
            "factor_wrt_ss304": 11.419355,
            "factor_wrt_ss316_ss316l": 9.75383,
            "revision_note": "No change"
          },
          "2022": {
            "low": 2293.92,
            "recommended": 3011.832,
            "high": 3398.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 42.48,
            "factor_wrt_ss304": 11.419268,
            "factor_wrt_ss316_ss316l": 7.762454,
            "revision_note": "No change"
          },
          "2023": {
            "low": 1996.56,
            "recommended": 2438.352,
            "high": 2676.24,
            "percentile_used": 0.65,
            "factor_wrt_cs": 42.48,
            "factor_wrt_ss304": 11.419248,
            "factor_wrt_ss316_ss316l": 6.563532,
            "revision_note": "No change"
          },
          "2024": {
            "low": 1996.56,
            "recommended": 2217.456,
            "high": 2336.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 42.48,
            "factor_wrt_ss304": 11.41959,
            "factor_wrt_ss316_ss316l": 6.750247,
            "revision_note": "No change"
          },
          "2025": {
            "low": 1869.12,
            "recommended": 2338.524,
            "high": 2591.28,
            "percentile_used": 0.65,
            "factor_wrt_cs": 42.48,
            "factor_wrt_ss304": 11.419132,
            "factor_wrt_ss316_ss316l": 7.113381,
            "revision_note": "No change"
          },
          "2026": {
            "low": 2124.0,
            "recommended": 2400.12,
            "high": 2548.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 42.48,
            "factor_wrt_ss304": 11.419355,
            "factor_wrt_ss316_ss316l": 7.373641,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 42.48,
          "2022": 42.48,
          "2023": 42.48,
          "2024": 42.48,
          "2025": 42.48,
          "2026": 42.48
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Inconel 600",
        "pipe_mat_std": [
          "B167",
          "B517",
          "UNS N06600"
        ],
        "raw_material_basis": "High nickel chromium alloy stock",
        "rate_inr_per_kg": {
          "low": 1327.5,
          "recommended": 1500.075,
          "high": 1593.0
        },
        "source_material_name": "Inconel 600",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 1460.25,
            "recommended": 1719.1125,
            "high": 1858.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 26.55,
            "factor_wrt_ss304": 7.137097,
            "factor_wrt_ss316_ss316l": 6.096144,
            "revision_note": "No change"
          },
          "2022": {
            "low": 1433.7,
            "recommended": 1882.395,
            "high": 2124.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 26.55,
            "factor_wrt_ss304": 7.137043,
            "factor_wrt_ss316_ss316l": 4.851534,
            "revision_note": "No change"
          },
          "2023": {
            "low": 1247.85,
            "recommended": 1523.97,
            "high": 1672.65,
            "percentile_used": 0.65,
            "factor_wrt_cs": 26.55,
            "factor_wrt_ss304": 7.13703,
            "factor_wrt_ss316_ss316l": 4.102207,
            "revision_note": "No change"
          },
          "2024": {
            "low": 1247.85,
            "recommended": 1385.91,
            "high": 1460.25,
            "percentile_used": 0.65,
            "factor_wrt_cs": 26.55,
            "factor_wrt_ss304": 7.137244,
            "factor_wrt_ss316_ss316l": 4.218904,
            "revision_note": "No change"
          },
          "2025": {
            "low": 1168.2,
            "recommended": 1461.5775,
            "high": 1619.55,
            "percentile_used": 0.65,
            "factor_wrt_cs": 26.55,
            "factor_wrt_ss304": 7.136957,
            "factor_wrt_ss316_ss316l": 4.445863,
            "revision_note": "No change"
          },
          "2026": {
            "low": 1327.5,
            "recommended": 1500.075,
            "high": 1593.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 26.55,
            "factor_wrt_ss304": 7.137097,
            "factor_wrt_ss316_ss316l": 4.608525,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 26.55,
          "2022": 26.55,
          "2023": 26.55,
          "2024": 26.55,
          "2025": 26.55,
          "2026": 26.55
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Hastelloy C / B family",
        "pipe_mat_std": [
          "B622",
          "B619",
          "UNS N10276",
          "UNS N10665"
        ],
        "raw_material_basis": "Ni-Mo-Cr corrosion resistant alloy stock",
        "rate_inr_per_kg": {
          "low": 2655.0,
          "recommended": 3000.15,
          "high": 3186.0
        },
        "source_material_name": "Hastelloy C / B family",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 2920.5,
            "recommended": 3438.225,
            "high": 3717.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 53.1,
            "factor_wrt_ss304": 14.274194,
            "factor_wrt_ss316_ss316l": 12.192287,
            "revision_note": "No change"
          },
          "2022": {
            "low": 2867.4,
            "recommended": 3764.79,
            "high": 4248.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 53.1,
            "factor_wrt_ss304": 14.274085,
            "factor_wrt_ss316_ss316l": 9.703067,
            "revision_note": "No change"
          },
          "2023": {
            "low": 2495.7,
            "recommended": 3047.94,
            "high": 3345.3,
            "percentile_used": 0.65,
            "factor_wrt_cs": 53.1,
            "factor_wrt_ss304": 14.27406,
            "factor_wrt_ss316_ss316l": 8.204415,
            "revision_note": "No change"
          },
          "2024": {
            "low": 2495.7,
            "recommended": 2771.82,
            "high": 2920.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 53.1,
            "factor_wrt_ss304": 14.274488,
            "factor_wrt_ss316_ss316l": 8.437808,
            "revision_note": "No change"
          },
          "2025": {
            "low": 2336.4,
            "recommended": 2923.155,
            "high": 3239.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 53.1,
            "factor_wrt_ss304": 14.273915,
            "factor_wrt_ss316_ss316l": 8.891726,
            "revision_note": "No change"
          },
          "2026": {
            "low": 2655.0,
            "recommended": 3000.15,
            "high": 3186.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 53.1,
            "factor_wrt_ss304": 14.274194,
            "factor_wrt_ss316_ss316l": 9.217051,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 53.1,
          "2022": 53.1,
          "2023": 53.1,
          "2024": 53.1,
          "2025": 53.1,
          "2026": 53.1
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Alloy 20",
        "pipe_mat_std": [
          "B729",
          "B464",
          "UNS N08020"
        ],
        "raw_material_basis": "Ni-Cr-Fe alloy stock",
        "rate_inr_per_kg": {
          "low": 796.5,
          "recommended": 900.045,
          "high": 955.8
        },
        "source_material_name": "Alloy 20",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 876.15,
            "recommended": 1031.4675,
            "high": 1115.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282258,
            "factor_wrt_ss316_ss316l": 3.657686,
            "revision_note": "No change"
          },
          "2022": {
            "low": 860.22,
            "recommended": 1129.437,
            "high": 1274.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282226,
            "factor_wrt_ss316_ss316l": 2.91092,
            "revision_note": "No change"
          },
          "2023": {
            "low": 748.71,
            "recommended": 914.382,
            "high": 1003.59,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282218,
            "factor_wrt_ss316_ss316l": 2.461324,
            "revision_note": "No change"
          },
          "2024": {
            "low": 748.71,
            "recommended": 831.546,
            "high": 876.15,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282346,
            "factor_wrt_ss316_ss316l": 2.531342,
            "revision_note": "No change"
          },
          "2025": {
            "low": 700.92,
            "recommended": 876.9465,
            "high": 971.73,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282174,
            "factor_wrt_ss316_ss316l": 2.667518,
            "revision_note": "No change"
          },
          "2026": {
            "low": 796.5,
            "recommended": 900.045,
            "high": 955.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282258,
            "factor_wrt_ss316_ss316l": 2.765115,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 15.93,
          "2022": 15.93,
          "2023": 15.93,
          "2024": 15.93,
          "2025": 15.93,
          "2026": 15.93
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Nickel 200 / 201",
        "pipe_mat_std": [
          "B161",
          "B725",
          "UNS N02200",
          "UNS N02201"
        ],
        "raw_material_basis": "Commercial pure nickel stock",
        "rate_inr_per_kg": {
          "low": 1725.5,
          "recommended": 1949.815,
          "high": 2070.6
        },
        "source_material_name": "Nickel 200 / 201",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 1898.05,
            "recommended": 2234.5225,
            "high": 2415.7,
            "percentile_used": 0.65,
            "factor_wrt_cs": 34.51,
            "factor_wrt_ss304": 9.276882,
            "factor_wrt_ss316_ss316l": 7.923839,
            "revision_note": "No change"
          },
          "2022": {
            "low": 1863.54,
            "recommended": 2446.759,
            "high": 2760.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 34.51,
            "factor_wrt_ss304": 9.276811,
            "factor_wrt_ss316_ss316l": 6.30608,
            "revision_note": "No change"
          },
          "2023": {
            "low": 1621.97,
            "recommended": 1980.874,
            "high": 2174.13,
            "percentile_used": 0.65,
            "factor_wrt_cs": 34.51,
            "factor_wrt_ss304": 9.276795,
            "factor_wrt_ss316_ss316l": 5.332097,
            "revision_note": "No change"
          },
          "2024": {
            "low": 1621.97,
            "recommended": 1801.422,
            "high": 1898.05,
            "percentile_used": 0.65,
            "factor_wrt_cs": 34.51,
            "factor_wrt_ss304": 9.277073,
            "factor_wrt_ss316_ss316l": 5.483781,
            "revision_note": "No change"
          },
          "2025": {
            "low": 1518.44,
            "recommended": 1899.7755,
            "high": 2105.11,
            "percentile_used": 0.65,
            "factor_wrt_cs": 34.51,
            "factor_wrt_ss304": 9.276701,
            "factor_wrt_ss316_ss316l": 5.778785,
            "revision_note": "No change"
          },
          "2026": {
            "low": 1725.5,
            "recommended": 1949.815,
            "high": 2070.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 34.51,
            "factor_wrt_ss304": 9.276882,
            "factor_wrt_ss316_ss316l": 5.990215,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 34.51,
          "2022": 34.51,
          "2023": 34.51,
          "2024": 34.51,
          "2025": 34.51,
          "2026": 34.51
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Monel 400",
        "pipe_mat_std": [
          "B165",
          "B725",
          "UNS N04400"
        ],
        "raw_material_basis": "Ni-Cu alloy stock",
        "rate_inr_per_kg": {
          "low": 1593.0,
          "recommended": 1800.09,
          "high": 1911.6
        },
        "source_material_name": "Monel 400",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 1752.3,
            "recommended": 2062.935,
            "high": 2230.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 31.86,
            "factor_wrt_ss304": 8.564516,
            "factor_wrt_ss316_ss316l": 7.315372,
            "revision_note": "No change"
          },
          "2022": {
            "low": 1720.44,
            "recommended": 2258.874,
            "high": 2548.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 31.86,
            "factor_wrt_ss304": 8.564451,
            "factor_wrt_ss316_ss316l": 5.82184,
            "revision_note": "No change"
          },
          "2023": {
            "low": 1497.42,
            "recommended": 1828.764,
            "high": 2007.18,
            "percentile_used": 0.65,
            "factor_wrt_cs": 31.86,
            "factor_wrt_ss304": 8.564436,
            "factor_wrt_ss316_ss316l": 4.922649,
            "revision_note": "No change"
          },
          "2024": {
            "low": 1497.42,
            "recommended": 1663.092,
            "high": 1752.3,
            "percentile_used": 0.65,
            "factor_wrt_cs": 31.86,
            "factor_wrt_ss304": 8.564693,
            "factor_wrt_ss316_ss316l": 5.062685,
            "revision_note": "No change"
          },
          "2025": {
            "low": 1401.84,
            "recommended": 1753.893,
            "high": 1943.46,
            "percentile_used": 0.65,
            "factor_wrt_cs": 31.86,
            "factor_wrt_ss304": 8.564349,
            "factor_wrt_ss316_ss316l": 5.335036,
            "revision_note": "No change"
          },
          "2026": {
            "low": 1593.0,
            "recommended": 1800.09,
            "high": 1911.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 31.86,
            "factor_wrt_ss304": 8.564516,
            "factor_wrt_ss316_ss316l": 5.53023,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 31.86,
          "2022": 31.86,
          "2023": 31.86,
          "2024": 31.86,
          "2025": 31.86,
          "2026": 31.86
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Aluminium",
        "pipe_mat_std": [
          "B241",
          "B345"
        ],
        "raw_material_basis": "Aluminium billet / extrusion stock / strip",
        "rate_inr_per_kg": {
          "low": 336.5,
          "recommended": 380.245,
          "high": 403.8
        },
        "source_material_name": "Aluminium",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 370.15,
            "recommended": 435.7675,
            "high": 471.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.73,
            "factor_wrt_ss304": 1.80914,
            "factor_wrt_ss316_ss316l": 1.545275,
            "revision_note": "No change"
          },
          "2022": {
            "low": 363.42,
            "recommended": 477.157,
            "high": 538.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.73,
            "factor_wrt_ss304": 1.809126,
            "factor_wrt_ss316_ss316l": 1.229786,
            "revision_note": "No change"
          },
          "2023": {
            "low": 316.31,
            "recommended": 386.302,
            "high": 423.99,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.73,
            "factor_wrt_ss304": 1.809123,
            "factor_wrt_ss316_ss316l": 1.039844,
            "revision_note": "No change"
          },
          "2024": {
            "low": 316.31,
            "recommended": 351.306,
            "high": 370.15,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.73,
            "factor_wrt_ss304": 1.809177,
            "factor_wrt_ss316_ss316l": 1.069425,
            "revision_note": "No change"
          },
          "2025": {
            "low": 296.12,
            "recommended": 370.4865,
            "high": 410.53,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.73,
            "factor_wrt_ss304": 1.809104,
            "factor_wrt_ss316_ss316l": 1.126955,
            "revision_note": "No change"
          },
          "2026": {
            "low": 336.5,
            "recommended": 380.245,
            "high": 403.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.73,
            "factor_wrt_ss304": 1.80914,
            "factor_wrt_ss316_ss316l": 1.168187,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 6.73,
          "2022": 6.73,
          "2023": 6.73,
          "2024": 6.73,
          "2025": 6.73,
          "2026": 6.73
        },
        "percentile_used": 0.65
      }
    ]
  }
];

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  elements.themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
  document.querySelector("#theme-toggle-label").textContent =
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
}

function toggleTheme() {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("csPipeTheme", nextTheme);
  applyTheme(nextTheme);
}

function sizeGroup(size) {
  if (size <= 6) return "0.5-6 IN";
  if (size >= 8 && size <= 24) return "8-24 IN";
  if (size >= 26 && size <= 48) return "26-48 IN";
  return "Other";
}

function formatPipeSize(size) {
  const numericSize = Number(size);
  const fractionalSizes = {
    0.5: "1/2",
    0.75: "3/4",
    1.5: "1 1/2",
  };

  return fractionalSizes[numericSize] || String(numericSize).replace(/\.0$/, "");
}

function formatNumber(value, decimals = 2) {
  if (!Number.isFinite(value)) return "-";
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatCurrency(value, decimals = 2) {
  if (!Number.isFinite(value)) return "-";
  // Monetary figures are always shown to two decimal places for an auditable estimate.
  const currencyDecimals = 2;
  return `Rs ${value.toLocaleString("en-IN", {
    minimumFractionDigits: currencyDecimals,
    maximumFractionDigits: currencyDecimals,
  })}`;
}

function formatPlainCurrency(value, decimals = 2) {
  if (!Number.isFinite(value)) return "";
  return value.toFixed(decimals);
}

function formatCountInWords(value) {
  const count = Math.max(0, Math.floor(Number(value) || 0));
  const belowTwenty = [
    "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
    "Eighteen", "Nineteen",
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const underThousand = (number) => {
    if (number < 20) return belowTwenty[number];
    if (number < 100) return `${tens[Math.floor(number / 10)]}${number % 10 ? ` ${belowTwenty[number % 10]}` : ""}`;
    return `${belowTwenty[Math.floor(number / 100)]} Hundred${number % 100 ? ` ${underThousand(number % 100)}` : ""}`;
  };

  if (count < 1000) return underThousand(count);
  if (count < 100000) return `${underThousand(Math.floor(count / 1000))} Thousand${count % 1000 ? ` ${underThousand(count % 1000)}` : ""}`;
  return String(count);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cleanDisplayText(value) {
  return String(value || "")
    .replace(/Â½/g, "1/2")
    .replace(/Â¾/g, "3/4")
    .replace(/Â¼/g, "1/4")
    .replace(/Â/g, "")
    .trim();
}

function formatPercentChange(value) {
  const numericValue = Number(value) || 0;
  return `${numericValue > 0 ? "+" : ""}${numericValue}%`;
}

function getFactor(coating) {
  return coatingFactors[coating] || coatingFactors.No;
}

function flattenText(value) {
  if (Array.isArray(value)) return value.map(flattenText).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(flattenText).join(" ");
  return String(value || "");
}

function normalizeMaterialText(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/ASTM/g, "")
    .replace(/GRADE/g, "GR")
    .replace(/\bGRA\b/g, "GR A")
    .replace(/\bGRB\b/g, "GR B")
    .replace(/\bGRC\b/g, "GR C")
    .replace(/[^A-Z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactMaterialText(value) {
  return normalizeMaterialText(value).replace(/[^A-Z0-9]+/g, "");
}

function extractMaterialSpec(value) {
  const text = normalizeMaterialText(value);
  const compact = compactMaterialText(value);
  const apiMatch = text.match(/\bAPI\s*5L\b/);
  const astmMatch = text.match(/\bA\s*([0-9]{2,4})(?=\b|GR|TP|$)/) || compact.match(/A([0-9]{2,4})(?=GR|TP|WP|WPL|WPHY|F|LF|WCA|WCB|WCC|LCB|LCC|WC|CA|CF|CN|CD|CY|$)/);
  const spec = apiMatch ? "API5L" : astmMatch ? `A${astmMatch[1]}` : "";
  const grades = new Set();

  const addGrade = (grade) => {
    const normalized = String(grade || "").toUpperCase().replace(/[^A-Z0-9]+/g, "");
    if (!normalized) return;
    grades.add(normalized);
    grades.add(normalized.replace(/^GR/, ""));
    grades.add(normalized.replace(/^TP/, ""));
  };

  const tpMatch = text.match(/\bTP\s*([0-9A-Z]+)\b/);
  if (tpMatch) {
    addGrade(`TP${tpMatch[1]}`);
    addGrade(tpMatch[1]);
  }

  const grMatch = text.match(/\bGR\s*([A-Z0-9]+)\b/);
  if (grMatch) addGrade(grMatch[1]);

  const componentGradeMatch = text.match(/\b(WPHY|WPL|WP|LF|F)\s*([A-Z0-9]+)\b/);
  if (componentGradeMatch) {
    addGrade(`${componentGradeMatch[1]}${componentGradeMatch[2]}`);
    addGrade(componentGradeMatch[2]);
  }

  (compact.match(/(?:GR|TP|WPHY|WPL|WP|LF|F)([A-Z0-9]+)/g) || []).forEach((match) =>
    addGrade(match.replace(/^(GR|TP|WPHY|WPL|WP|LF|F)/, ""))
  );
  (compact.match(/WCA|WCB|WCC|LCB|LCC|LC3|LC2|LC9|WC1|WC4|WC5|WC6|WC9|C12A|C12|C5|CA15|CF3M|CF3|CF8M|CF8|CN7M|CD3MWCUN|CD4MCUN|CY40/g) || []).forEach(addGrade);
  (compact.match(/X[0-9]{2,3}/g) || []).forEach(addGrade);

  return { spec, grades: Array.from(grades), compact };
}

function getJsonStandardAliases(standard) {
  const parsed = extractMaterialSpec(standard);
  if (!parsed.spec) return [];

  const normalized = normalizeMaterialText(standard);
  const gradeTokens = new Set(parsed.grades);
  const gradeSectionMatch = normalized.match(/\b(?:GR|TP)\s*([A-Z0-9][A-Z0-9\s\/,.-]*)/);

  if (gradeSectionMatch) {
    gradeSectionMatch[1]
      .split(/[\s\/,.-]+/)
      .map((token) => token.trim())
      .filter(Boolean)
      .forEach((token) => gradeTokens.add(token.replace(/[^A-Z0-9]+/g, "")));
  }

  return [
    {
      spec: parsed.spec,
      grades: Array.from(gradeTokens).filter(Boolean),
      compact: parsed.compact,
      label: String(standard || ""),
    },
  ];
}

function classifyMaterialSpec(specText) {
  const parsedInput = extractMaterialSpec(specText);
  const inputCompact = compactMaterialText(specText);

  if (!materialSpecificationRows.length) {
    return {
      category: "Unclassified",
      matchedStandard: "",
      matchId: "",
      note:
        materialSpecificationStatus === "failed"
          ? "ASTM JSON not loaded"
          : "ASTM JSON loading",
    };
  }

  let bestMatch = null;
  let bestScore = 0;

  materialSpecificationRows.forEach((row) => {
    (row.pipeAliases || []).forEach((alias) => {
      let score = 0;
      if (parsedInput.spec && alias.spec === parsedInput.spec) score += 60;
      if (alias.compact && inputCompact.includes(alias.compact)) score += 45;
      if (parsedInput.compact && alias.compact.includes(parsedInput.compact)) score += 25;

      const matchingGrade = parsedInput.grades.find((grade) => alias.grades.includes(grade));
      if (matchingGrade) score += 45;
      if (parsedInput.spec && alias.spec === parsedInput.spec && !parsedInput.grades.length) {
        score += 10;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = {
          category: row.basic_material_of_construction || "Unclassified",
          matchedStandard: alias.label,
          matchId: row.id,
          note: matchingGrade ? `Matched grade ${matchingGrade}` : "Matched material standard",
        };
      }
    });
  });

  if (!bestMatch || bestScore < 60) {
    const fallbackMatch = classifyMaterialSpecFallback(parsedInput, inputCompact);
    if (fallbackMatch) return fallbackMatch;

    return {
      category: "Unclassified",
      matchedStandard: "",
      matchId: "",
      note: "No ASTM pipe material standard match",
    };
  }

  return bestMatch;
}

function materialGradeHas(parsedInput, ...needles) {
  const gradeText = parsedInput.grades.join(" ");
  return needles.some((needle) => gradeText.includes(needle));
}

function classifyMaterialSpecFallback(parsedInput, inputCompact) {
  const spec = parsedInput.spec;

  if (spec === "A234") {
    if (materialGradeHas(parsedInput, "WPB", "WPC", "B", "C")) {
      return {
        category: "Carbon Steel",
        matchedStandard: "ASTM A234 WPB/WPC",
        matchId: "fallback-a234-carbon",
        note: "Fallback matched carbon steel butt-weld fitting standard",
      };
    }
    if (materialGradeHas(parsedInput, "WP1", "WP5", "WP9", "WP11", "WP12", "WP22", "WP91")) {
      return {
        category: "Low & Int. Alloy Steel for High temp Service",
        matchedStandard: "ASTM A234 alloy fitting",
        matchId: "fallback-a234-alloy",
        note: "Fallback matched alloy steel butt-weld fitting standard",
      };
    }
  }

  if (spec === "A403") {
    return {
      category: "Austenitic Stainless Steel",
      matchedStandard: "ASTM A403 stainless fitting",
      matchId: "fallback-a403-stainless",
      note: "Fallback matched stainless steel fitting standard",
    };
  }

  if (spec === "A182") {
    if (materialGradeHas(parsedInput, "F304", "F304L", "F316", "F316L", "F321", "F347")) {
      return {
        category: "Austenitic Stainless Steel",
        matchedStandard: "ASTM A182 stainless forged component",
        matchId: "fallback-a182-stainless",
        note: "Fallback matched stainless steel forged component standard",
      };
    }
    if (materialGradeHas(parsedInput, "F5", "F9", "F11", "F12", "F22", "F91")) {
      return {
        category: "Low & Int. Alloy Steel for High temp Service",
        matchedStandard: "ASTM A182 alloy forged component",
        matchId: "fallback-a182-alloy",
        note: "Fallback matched alloy steel forged component standard",
      };
    }
  }

  if (spec === "A105") {
    return {
      category: "Carbon Steel",
      matchedStandard: "ASTM A105",
      matchId: "fallback-a105-carbon",
      note: "Fallback matched carbon steel forged component standard",
    };
  }

  if (spec === "A216") {
    if (materialGradeHas(parsedInput, "WCA", "WCB", "WCC")) {
      return {
        category: "Carbon Steel",
        matchedStandard: "ASTM A216 WCA/WCB/WCC",
        matchId: "fallback-a216-carbon-casting",
        note: "Fallback matched carbon steel casting standard",
      };
    }
  }

  if (spec === "A350") {
    return {
      category: "Low Temp.CS",
      matchedStandard: "ASTM A350",
      matchId: "fallback-a350-low-temp",
      note: "Fallback matched low-temperature carbon steel forged component standard",
    };
  }

  if (spec === "A420") {
    return {
      category: "Low Temp.CS",
      matchedStandard: "ASTM A420",
      matchId: "fallback-a420-low-temp",
      note: "Fallback matched low-temperature carbon steel fitting standard",
    };
  }

  if (spec === "A352") {
    if (materialGradeHas(parsedInput, "LCB", "LCC", "LC2", "LC3", "LC9")) {
      return {
        category: "Low Temp.CS",
        matchedStandard: "ASTM A352 low-temperature casting",
        matchId: "fallback-a352-low-temp-casting",
        note: "Fallback matched low-temperature casting standard",
      };
    }
  }

  if (spec === "A217") {
    if (materialGradeHas(parsedInput, "WC1", "WC4", "WC5", "WC6", "WC9", "C5", "C12", "C12A", "CA15")) {
      return {
        category: "Low & Int. Alloy Steel for High temp Service",
        matchedStandard: "ASTM A217 alloy casting",
        matchId: "fallback-a217-alloy-casting",
        note: "Fallback matched alloy steel casting standard",
      };
    }
  }

  if (spec === "A860" || inputCompact.includes("WPHY")) {
    return {
      category: "High Strength Carbon /Low Alloy Steel. (All API 5L PSL 2 Pipe)",
      matchedStandard: "ASTM A860 WPHY",
      matchId: "fallback-a860-high-strength",
      note: "Fallback matched high-strength fitting standard",
    };
  }

  return null;
}

function applyMaterialCategory(item) {
  const match = classifyMaterialSpec(item.spec);
  item.materialCategory = match.category;
  item.materialMatchedStandard = match.matchedStandard;
  item.materialMatchId = match.matchId;
  item.materialMatchNote = match.note;
  return item;
}

function applyBomMaterialCategory(item) {
  const match = classifyMaterialSpec(item.material);
  item.materialCategory = match.category;
  item.materialMatchedStandard = match.matchedStandard;
  item.materialMatchId = match.matchId;
  item.materialMatchNote = match.note;
  return item;
}

function addCarbonSteelPipeStandards(rows) {
  const normalizedRows = Array.isArray(rows) ? rows.map((row) => ({ ...row })) : [];
  const carbonRow = normalizedRows.find((row) =>
    String(row.basic_material_of_construction || "").toLowerCase().includes("carbon steel")
  );

  if (!carbonRow) return normalizedRows;

  carbonRow.pipes = carbonRow.pipes || {};
  const standards = carbonRow.pipes.material_standard || [];
  additionalCarbonSteelPipeStandards.forEach((standard) => {
    if (!standards.some((existing) => compactMaterialText(existing) === compactMaterialText(standard))) {
      standards.push(standard);
    }
  });
  carbonRow.pipes.material_standard = standards;
  return normalizedRows;
}

function prepareMaterialSpecificationRows(rows) {
  return addCarbonSteelPipeStandards(rows).map((row) => ({
    ...row,
    pipeAliases: getMaterialStandardAliases(row),
  }));
}

function normalizeMaterialStandardList(values) {
  const list = Array.isArray(values) ? values : values ? [values] : [];
  const cleaned = list
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .filter((value) => !/\b(no\s+eq|no\s+equivalent|fitting\s+sp|forg|cstg\s*spec|material|same\s+as|pipe)\b/i.test(value));

  const combined = cleaned.length > 1 ? [cleaned.join(" ")] : [];
  return [...cleaned, ...combined];
}

function getMaterialStandardAliases(row) {
  return [
    ...normalizeMaterialStandardList(row.pipes?.material_standard),
    ...normalizeMaterialStandardList(row.socket_weld_fittings?.material_standard),
    ...normalizeMaterialStandardList(row.butt_weld_fittings?.material_standard),
    ...normalizeMaterialStandardList(row.flanges?.material_standard),
    ...normalizeMaterialStandardList(row.castings_material_standard),
  ].flatMap(getJsonStandardAliases);
}

async function loadMaterialSpecificationData() {
  materialSpecificationRows = prepareMaterialSpecificationRows(builtInMaterialSpecificationRows);
  materialSpecificationStatus = "built-in";
  lineItems.forEach(applyMaterialCategory);
  bomGroupItems.forEach(applyBomMaterialCategory);

  try {
    const response = await fetch("astm_piping_material_specification_webapp.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    materialSpecificationRows = prepareMaterialSpecificationRows(
      data.material_specification_rows || []
    );
    materialSpecificationStatus = "loaded";
    lineItems.forEach(applyMaterialCategory);
    bomGroupItems.forEach(applyBomMaterialCategory);
    renderLineItems();
    renderBomGroupReview();
  } catch (error) {
    materialSpecificationRows = prepareMaterialSpecificationRows(builtInMaterialSpecificationRows);
    materialSpecificationStatus = "built-in";
    lineItems.forEach(applyMaterialCategory);
    bomGroupItems.forEach(applyBomMaterialCategory);
    renderLineItems();
    renderBomGroupReview();
  }
}

async function loadFlangeWeightModel() {
  if (flangeWeightModelStatus === "loaded" && flangeWeightModel?.exactWeights) {
    return flangeWeightModel;
  }
  if (flangeWeightModelPromise) return flangeWeightModelPromise;

  flangeWeightModelStatus = "loading";
  flangeWeightModelPromise = (async () => {
    try {
      const response = await fetch("flange-weight-3-input-model-v2.json");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      flangeWeightModel = await response.json();
      flangeWeightModelStatus = "loaded";
      bomGroupItems.forEach((item) => {
        if (item.group === "Flange Group") {
          item.componentCost = buildComponentCostEstimate({
            group: item.group,
            item: item.item,
            standardName: item.standardName,
            sizeText: item.size,
            thicknessText: item.thickness,
            materialText: item.material,
            quantityText: item.quantity,
            uomText: item.uom,
          });
        }
      });
      renderBomGroupReview();
      return flangeWeightModel;
    } catch (error) {
      flangeWeightModel = null;
      flangeWeightModelStatus = "failed";
      return null;
    } finally {
      flangeWeightModelPromise = null;
    }
  })();

  return flangeWeightModelPromise;
}

async function ensureFlangeWeightModelLoaded() {
  if (flangeWeightModelStatus === "loaded" && flangeWeightModel?.exactWeights) {
    return flangeWeightModel;
  }
  return loadFlangeWeightModel();
}

function resetRawMaterialLibraryOutputs(message = "-") {
  elements.materialStandardOutput.textContent = message;
  elements.rawMaterialBasisOutput.textContent = message;
  elements.rawMaterialRangeOutput.textContent = message;
  elements.recommendedRateOutput.textContent = message;
  elements.factorCsOutput.value = message;
}

function getSelectedRawMaterialGroup() {
  return rawMaterialPriceLibrary.find(
    (group) => group.basic_mat_of_const === elements.materialBasis.value
  );
}

function getSelectedRawMaterialItem() {
  const group = getSelectedRawMaterialGroup();
  if (!group) return null;
  const itemIndex = String(elements.materialGradeFamily.value || "").split("|")[0];
  return (group.children || []).find(
    (_, index) => String(index) === itemIndex
  );
}

function getSelectedPipeMaterialStandard() {
  const item = getSelectedRawMaterialItem();
  if (!item) return "";

  const [, standardIndex = "0"] = String(elements.materialGradeFamily.value || "").split("|");
  const standards = (item.pipe_mat_std || []).map(cleanDisplayText);
  return standards[Number(standardIndex)] || standards[0] || "";
}

function getRawMaterialGradeLabel(item) {
  const family = item?.grade_family || item?.ch_comp || "Grade family";
  const chComp = item?.grade_family && item?.ch_comp ? ` / ${item.ch_comp}` : "";
  return cleanDisplayText(`${family}${chComp}`);
}

function getSelectedPriceYear(year = elements.year.value) {
  const numericYear = Number(year) || 2026;
  return String(numericYear);
}

function getRawMaterialYearRate(item, year = elements.year.value) {
  const selectedYear = getSelectedPriceYear(year);
  const yearlyRate = item?.yearly_rate_inr_per_kg?.[selectedYear];
  const fallbackRate = item?.rate_inr_per_kg || {};
  const rate = yearlyRate || fallbackRate;
  const recommended = Number(rate.recommended);
  const low = Number(rate.low);
  const high = Number(rate.high);
  const factorWrtCs = Number(
    rate.factor_wrt_cs ?? item?.factor_wrt_cs_by_year?.[selectedYear]
  );

  return {
    year: selectedYear,
    low,
    recommended,
    high,
    percentileUsed: Number(rate.percentile_used ?? item?.percentile_used),
    factorWrtCs,
    revisionNote: rate.revision_note || "",
  };
}

function scoreRawMaterialStandardMatch(inputText, standardText) {
  const parsedInput = extractMaterialSpec(inputText);
  const parsedStandard = extractMaterialSpec(standardText);
  const inputCompact = compactMaterialText(inputText);
  const standardCompact = compactMaterialText(standardText);
  let score = 0;

  if (!inputCompact || !standardCompact) return 0;
  if (parsedInput.spec && parsedStandard.spec && parsedInput.spec === parsedStandard.spec) score += 60;
  if (standardCompact && inputCompact.includes(standardCompact)) score += 45;
  if (inputCompact && standardCompact.includes(inputCompact)) score += 25;

  const gradeMatch = parsedInput.grades.find((grade) => parsedStandard.grades.includes(grade));
  if (gradeMatch) score += 45;
  if (parsedInput.spec && parsedInput.spec === parsedStandard.spec && !parsedInput.grades.length) score += 10;

  return score;
}

function getEquivalentPipeSpecForComponentMaterial(specText) {
  const parsed = extractMaterialSpec(specText);
  const compact = parsed.compact || compactMaterialText(specText);
  const hasGrade = (...needles) => materialGradeHas(parsed, ...needles);

  if (parsed.spec === "A234") {
    if (hasGrade("WP1", "1")) return "A335 Gr.P1";
    if (hasGrade("WP5", "5")) return "A335 Gr.P5";
    if (hasGrade("WP9", "9")) return "A335 Gr.P9";
    if (hasGrade("WP11", "11")) return "A335 Gr.P11";
    if (hasGrade("WP12", "12")) return "A335 Gr.P12";
    if (hasGrade("WP22", "22")) return "A335 Gr.P22";
    if (hasGrade("WP91", "91")) return "A335 Gr.P91";
    if (hasGrade("WPB", "B")) return "A106 Gr.B";
    if (hasGrade("WPC", "C")) return "A106 Gr.C";
  }

  if (parsed.spec === "A403") {
    if (hasGrade("WP304L", "304L")) return "A312 TP304L";
    if (hasGrade("WP304", "304")) return "A312 TP304";
    if (hasGrade("WP316L", "316L")) return "A312 TP316L";
    if (hasGrade("WP316", "316")) return "A312 TP316";
    if (hasGrade("WP321", "321")) return "A312 TP321";
    if (hasGrade("WP347", "347")) return "A312 TP347";
  }

  if (parsed.spec === "A182") {
    if (hasGrade("F304L", "304L")) return "A312 TP304L";
    if (hasGrade("F304", "304")) return "A312 TP304";
    if (hasGrade("F316L", "316L")) return "A312 TP316L";
    if (hasGrade("F316", "316")) return "A312 TP316";
    if (hasGrade("F321", "321")) return "A312 TP321";
    if (hasGrade("F347", "347")) return "A312 TP347";
    if (hasGrade("F1", "1")) return "A335 Gr.P1";
    if (hasGrade("F5", "5")) return "A335 Gr.P5";
    if (hasGrade("F9", "9")) return "A335 Gr.P9";
    if (hasGrade("F11", "11")) return "A335 Gr.P11";
    if (hasGrade("F12", "12")) return "A335 Gr.P12";
    if (hasGrade("F22", "22")) return "A335 Gr.P22";
    if (hasGrade("F91", "91")) return "A335 Gr.P91";
  }

  if (parsed.spec === "A105" || compact.includes("A105")) return "A106 Gr.B";
  if (parsed.spec === "A350" && hasGrade("LF2", "2")) return "A333 Gr.6";
  if (parsed.spec === "A420" && hasGrade("WPL6", "6")) return "A333 Gr.6";
  if (parsed.spec === "A860" || compact.includes("WPHY")) {
    const xGrade = parsed.grades.find((grade) => /^X\d{2,3}$/.test(grade));
    const wphyGrade = parsed.grades.find((grade) => /^WPHY\d{2,3}$/.test(grade));
    const gradeNumber = xGrade?.replace("X", "") || wphyGrade?.replace("WPHY", "") || "";
    return gradeNumber ? `API 5L X${gradeNumber}` : "API 5L X52";
  }

  return "";
}

function findRawMaterialPriceBestMatch(specText) {
  let bestMatch = null;
  let bestScore = 0;

  rawMaterialPriceLibrary.forEach((group) => {
    (group.children || []).forEach((item) => {
      (item.pipe_mat_std || []).forEach((standard) => {
        const score = scoreRawMaterialStandardMatch(specText, standard);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = { group, item, standard };
        }
      });
    });
  });

  return bestMatch && bestScore >= 60 ? { ...bestMatch, score: bestScore } : null;
}

function getRawMaterialPriceMapping(specText, year = elements.year.value) {
  const directMatch = findRawMaterialPriceBestMatch(specText);
  const equivalentPipeSpec = directMatch ? "" : getEquivalentPipeSpecForComponentMaterial(specText);
  const equivalentMatch = equivalentPipeSpec ? findRawMaterialPriceBestMatch(equivalentPipeSpec) : null;
  const bestMatch = directMatch || equivalentMatch;

  if (!bestMatch) return null;

  const rate = getRawMaterialYearRate(bestMatch.item, year);
  const recommended = Number(rate.recommended);
  if (!Number.isFinite(recommended) || recommended <= 0) return null;

  const range = `${formatCurrency(Number(rate.low), 2)} to ${formatCurrency(Number(rate.high), 2)}`;
  const basis = cleanDisplayText(bestMatch.item.raw_material_basis || "-");
  const groupName = cleanDisplayText(bestMatch.group.basic_mat_of_const);
  const gradeLabel = getRawMaterialGradeLabel(bestMatch.item);
  const matchedStandard = cleanDisplayText(bestMatch.standard);
  const equivalentNote = equivalentMatch
    ? `; component material ${cleanDisplayText(specText)} mapped to equivalent pipe basis ${cleanDisplayText(
        equivalentPipeSpec
      )}`
    : "";

  return {
    recommended,
    basis,
    range,
    factorWrtCs: rate.factorWrtCs,
    year: rate.year,
    groupName,
    gradeLabel,
    standard: matchedStandard,
    equivalentPipeSpec: equivalentMatch ? cleanDisplayText(equivalentPipeSpec) : "",
    note: `BOM material raw price mapping for ${rate.year}: ${groupName} / ${gradeLabel}; matched ${cleanDisplayText(
      bestMatch.standard
    )}${equivalentNote}; basis ${basis}; range ${range}; factor w.r.t. CS ${formatNumber(rate.factorWrtCs, 2)}`,
  };
}

function populateRawMaterialBasisOptions() {
  elements.materialBasis.innerHTML = '<option value="">Select material group</option>';
  rawMaterialPriceLibrary.forEach((group) => {
    const option = document.createElement("option");
    option.value = group.basic_mat_of_const;
    option.textContent = cleanDisplayText(group.basic_mat_of_const);
    elements.materialBasis.append(option);
  });
}

function populateRawMaterialGradeOptions() {
  const group = getSelectedRawMaterialGroup();
  elements.materialGradeFamily.innerHTML = '<option value="">Select pipe material standard</option>';
  elements.materialGradeFamily.disabled = !group;

  if (!group) {
    resetRawMaterialLibraryOutputs("-");
    return;
  }

  (group.children || []).forEach((item, index) => {
    (item.pipe_mat_std || []).forEach((standard, standardIndex) => {
      const option = document.createElement("option");
      option.value = `${index}|${standardIndex}`;
      option.textContent = cleanDisplayText(standard);
      elements.materialGradeFamily.append(option);
    });
  });
  resetRawMaterialLibraryOutputs("Select pipe material standard");
}

function getDefaultPipeStandardValue(group, itemIndex = 0) {
  const item = group?.children?.[itemIndex];
  if (!item) return "";
  const standards = (item.pipe_mat_std || []).map(cleanDisplayText);
  const preferredIndex = standards.findIndex((standard) => /A106/i.test(standard));
  return `${itemIndex}|${preferredIndex >= 0 ? preferredIndex : 0}`;
}

function refreshRawMaterialLibrarySelection(previousBasis = "", previousGrade = "") {
  populateRawMaterialBasisOptions();

  if (previousBasis) {
    elements.materialBasis.value = previousBasis;
  }

  if (!elements.materialBasis.value) {
    selectDefaultCarbonSteelPrice();
    return;
  }

  populateRawMaterialGradeOptions();

  if (previousGrade) {
    elements.materialGradeFamily.value = previousGrade.includes("|")
      ? previousGrade
      : getDefaultPipeStandardValue(getSelectedRawMaterialGroup(), Number(previousGrade) || 0);
  }

  if (elements.materialGradeFamily.value) {
    applyRawMaterialPriceSelection();
  } else if (isCarbonSteelRawMaterialSelection()) {
    elements.materialGradeFamily.value = getDefaultPipeStandardValue(getSelectedRawMaterialGroup(), 0);
    applyRawMaterialPriceSelection();
  } else {
    clearRawMaterialPriceSelection();
  }
}

function isCarbonSteelRawMaterialSelection() {
  return elements.materialBasis.value === "Carbon Steel";
}

function hasIncompleteNonCarbonSteelSelection() {
  return Boolean(elements.materialBasis.value) &&
    !isCarbonSteelRawMaterialSelection() &&
    !elements.materialGradeFamily.value;
}

function clearRawMaterialPriceSelection() {
  elements.rawOverride.value = "";
  delete elements.rawOverride.dataset.source;
  delete elements.rawOverride.dataset.sourceType;
}

function selectDefaultCarbonSteelPrice() {
  const carbonSteelGroup = rawMaterialPriceLibrary.find(
    (group) => group.basic_mat_of_const === "Carbon Steel"
  );
  if (!carbonSteelGroup) return;

  elements.materialBasis.value = carbonSteelGroup.basic_mat_of_const;
  populateRawMaterialGradeOptions();
  elements.materialGradeFamily.value = getDefaultPipeStandardValue(carbonSteelGroup, 0);
  applyRawMaterialPriceSelection();
}

function applyRawMaterialPriceSelection() {
  const item = getSelectedRawMaterialItem();
  if (!item) {
    resetRawMaterialLibraryOutputs(elements.materialBasis.value ? "Select pipe material standard" : "-");
    clearRawMaterialPriceSelection();
    return;
  }

  const rate = getRawMaterialYearRate(item);
  const standardList = (item.pipe_mat_std || []).map(cleanDisplayText);
  const selectedStandard = getSelectedPipeMaterialStandard() || standardList[0] || "";
  const basis = cleanDisplayText(item.raw_material_basis || "-");
  const range = `${formatCurrency(Number(rate.low), 2)} to ${formatCurrency(Number(rate.high), 2)}`;
  const recommended = Number(rate.recommended);
  const factorWrtCs = Number(rate.factorWrtCs);

  elements.materialStandardOutput.textContent = getRawMaterialGradeLabel(item);
  elements.rawMaterialBasisOutput.textContent = basis;
  elements.rawMaterialRangeOutput.textContent = range;
  elements.recommendedRateOutput.textContent = Number.isFinite(recommended)
    ? formatCurrency(recommended, 2)
    : "-";
  elements.factorCsOutput.value = Number.isFinite(factorWrtCs)
    ? formatNumber(factorWrtCs, 2)
    : "-";

  if (Number.isFinite(recommended) && recommended > 0) {
    elements.rawOverride.value = recommended.toFixed(2);
    elements.spec.value = selectedStandard || "Other spec";
    elements.rawOverride.dataset.sourceType = "materialLibrary";
    elements.rawOverride.dataset.source = `Suggested raw material mapping: ${cleanDisplayText(
      elements.materialBasis.value
    )} / ${getRawMaterialGradeLabel(item)}; year ${rate.year}; basis ${basis}; range ${range}; factor w.r.t. CS ${
      Number.isFinite(factorWrtCs) ? formatNumber(factorWrtCs, 2) : "-"
    }`;
  }
}

async function loadRawMaterialPriceLibrary() {
  const previousBasis = elements.materialBasis.value;
  const previousGrade = elements.materialGradeFamily.value;
  rawMaterialPriceLibrary = builtInRawMaterialPriceLibrary;
  rawMaterialPriceLibraryStatus = "built-in";
  refreshRawMaterialLibrarySelection(previousBasis, previousGrade);

  try {
    const activeBasis = elements.materialBasis.value;
    const activeGrade = elements.materialGradeFamily.value;
    const response = await fetch("raw_material_price_library.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    rawMaterialPriceLibrary = data.raw_material_price_library?.length
      ? data.raw_material_price_library
      : builtInRawMaterialPriceLibrary;
    rawMaterialPriceLibraryStatus = "loaded";
    refreshRawMaterialLibrarySelection(activeBasis, activeGrade);
  } catch (error) {
    rawMaterialPriceLibrary = builtInRawMaterialPriceLibrary;
    rawMaterialPriceLibraryStatus = "failed";
    refreshRawMaterialLibrarySelection(elements.materialBasis.value, elements.materialGradeFamily.value);
  }
}

function normalizeSchedule(value) {
  const raw = String(value || "").trim().toUpperCase();
  if (!raw) return "";

  const normalized = raw
    .replace(/SCHEDULE|SCH\.?|SCHED\.?/g, "")
    .replace(/#/g, "")
    .replace(/STANDARD/g, "STD")
    .replace(/HEAVY/g, "HVY")
    .replace(/EXTRA\s*STRONG/g, "XS")
    .replace(/DOUBLE\s*EXTRA\s*STRONG/g, "XXS")
    .replace(/[^A-Z0-9]+/g, "");

  if (normalized === "SSTD" || normalized === "STD" || normalized === "ST") return "STD";
  if (normalized === "SHVY" || normalized === "HVY" || normalized === "HY") return "HVY";
  if (normalized === "SXS" || normalized === "XS") return "XS";
  if (normalized === "SXXS" || normalized === "XXS") return "XXS";

  const sizeSchedule = normalized.match(/^S?(\d+S?)$/);
  return sizeSchedule ? sizeSchedule[1] : normalized;
}

function getScheduleThickness(size, schedule) {
  const scheduleKey = normalizeSchedule(schedule);
  return scheduleThicknessTable[Number(size)]?.[scheduleKey] ?? NaN;
}

function parseThicknessInput(value, size) {
  const numericValue = parseBomNumber(value);
  const text = String(value || "");
  const hasScheduleSignal = /[A-Za-z#-]/.test(text);

  if (Number.isFinite(numericValue) && !hasScheduleSignal) {
    return numericValue;
  }

  const scheduleThickness = getScheduleThickness(size, value);
  return Number.isFinite(scheduleThickness) ? scheduleThickness : numericValue;
}

function isScheduleOrRatingColumn(headerName) {
  const normalizedHeader = normalizeHeader(headerName);
  return /sch|sched|rating/.test(normalizedHeader);
}

function parseBomThickness(value, size, headerName = "") {
  // A numeric value in a Sch/Thk/Rating column (for example, 80) is a pipe
  // schedule, not an 80 mm wall thickness. Prefer the B36 lookup in that case.
  if (isScheduleOrRatingColumn(headerName)) {
    const scheduleThickness = getScheduleThickness(size, value);
    if (Number.isFinite(scheduleThickness) && scheduleThickness > 0) return scheduleThickness;
  }
  return parseThicknessInput(value, size);
}

function updateThicknessMode() {
  inputError = "";
  const isScheduleMode = elements.thicknessMode.value === "schedule";
  elements.scheduleField.classList.toggle("hidden", !isScheduleMode);
  elements.scheduleField.classList.toggle("schedule-active", isScheduleMode);
  elements.thicknessLabel.textContent = isScheduleMode
    ? "Calculated Thickness MM"
    : "Thickness MM";
  elements.thickness.readOnly = isScheduleMode;

  if (!isScheduleMode) return;

  const size = Number(elements.size.value);
  const thickness = getScheduleThickness(size, elements.schedule.value);
  if (Number.isFinite(thickness)) {
    elements.thickness.value = thickness.toFixed(2);
    elements.warning.textContent = "";
  } else {
    elements.thickness.value = "";
    inputError = "Select valid schedule from B36.10 or B36.19";
    elements.warning.textContent = inputError;
  }
}

function createId() {
  return globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : String(Date.now() + Math.random());
}

function buildEstimate(input) {
  const year = Number(input.year) || 2026;
  const size = Number(input.size);
  const thickness = Number(input.thickness);
  const length = Number(input.length);
  const coating = input.coating === "Yes" ? "Yes" : "No";
  const spec = String(input.spec || "Other spec").trim() || "Other spec";
  const od = odTable[size];
  const group = sizeGroup(size);
  const rawOverride = Number(input.rawOverride);
  const factorOverride = Number(input.factorOverride);
  const rawOverrideApplied = rawOverride > 0;
  const factorOverrideApplied = factorOverride > 0;
  const rawSteel = rawOverrideApplied ? rawOverride : rawSteelByYear[year] || rawSteelByYear[2026];
  const baseFactors = getFactor(coating);
  const p90Multiplier = baseFactors.p90 / baseFactors.median;
  const factors =
    factorOverrideApplied
      ? {
          ...baseFactors,
          median: factorOverride,
          p90: factorOverride * p90Multiplier,
          source: "Custom estimate factor",
        }
      : baseFactors;

  if (!od) {
    return { error: `Pipe size ${input.size || ""} is not available in the OD table.` };
  }

  if (!Number.isFinite(thickness) || !Number.isFinite(length) || thickness <= 0 || length < 0) {
    return { error: "Thickness must be positive and length cannot be negative." };
  }

  if (thickness >= od / 2) {
    return {
      error:
        "Wall thickness is physically impossible because it is greater than or equal to pipe radius.",
    };
  }

  const weightKgm = 0.0246615 * (od - thickness) * thickness;
  const totalWeight = weightKgm * length;
  const medianRsKg = rawSteel * factors.median;
  const p90RsKg = rawSteel * factors.p90;
  const medianRsM = medianRsKg * weightKgm;
  const p90RsM = p90RsKg * weightKgm;
  const medianTotal = medianRsM * length;
  const p90Total = p90RsM * length;

  return applyMaterialCategory({
    id: createId(),
    year,
    size,
    thickness,
    length,
    spec,
    coating,
    od,
    group,
    rawSteel,
    rawSteelSource: input.rawSteelSource || (rawOverrideApplied ? "manualOverride" : "defaultYear"),
    factors,
    rawSteelBasis: rawOverrideApplied
      ? input.rawBasisNote || "User-entered Raw Steel Rs/kg Override"
      : `Default raw steel basis for ${year}`,
    factorBasis: factorOverrideApplied
      ? `User-entered Estimate Factor Override; P90 recalculated using default multiplier ${formatNumber(
          p90Multiplier,
          3
        )}`
      : `Default ${coating === "Yes" ? "coated" : "non-coated"} pipe factor`,
    weightKgm,
    totalWeight,
    medianRsKg,
    p90RsKg,
    medianRsM,
    p90RsM,
    medianTotal,
    p90Total,
  });
}

function getCurrentEstimate() {
  return buildEstimate({
    year: elements.year.value,
    size: elements.size.value,
    thickness: elements.thickness.value,
    length: elements.length.value,
    spec: elements.spec.value,
    coating: elements.coating.value,
    rawOverride: elements.rawOverride.value,
    rawBasisNote: elements.rawOverride.dataset.source,
    rawSteelSource: elements.rawOverride.dataset.sourceType,
    factorOverride: elements.factorOverride.value,
  });
}

function getLineItemFactorOverride(item) {
  return String(item.factorBasis || "").startsWith("User-entered")
    ? item.factors?.median
    : "";
}

function refreshLineItemYearPrices() {
  if (!lineItems.length) return;

  const selectedYear = Number(elements.year.value) || 2026;
  const refreshedItems = lineItems.map((item) => {
    const rawMapping =
      item.rawSteelSource === "materialLibrary"
        ? getRawMaterialPriceMapping(item.spec, selectedYear)
        : null;
    const rawOverride =
      item.rawSteelSource === "materialLibrary"
        ? rawMapping?.recommended || item.rawSteel
        : item.rawSteelSource === "bomOverride" || item.rawSteelSource === "manualOverride"
          ? item.rawSteel
          : "";

    const refreshed = buildEstimate({
      year: selectedYear,
      size: item.size,
      thickness: item.thickness,
      length: item.length,
      spec: item.spec,
      coating: item.coating,
      rawOverride,
      rawSteelSource: item.rawSteelSource,
      rawBasisNote:
        item.rawSteelSource === "materialLibrary"
          ? rawMapping?.note || item.rawSteelBasis
          : item.rawSteelBasis,
      factorOverride: getLineItemFactorOverride(item),
    });

    if (refreshed.error) return item;

    return {
      ...refreshed,
      id: item.id,
      source: item.source,
      sourceName: item.sourceName,
      sourceKey: item.sourceKey,
    };
  });

  lineItems.splice(0, lineItems.length, ...refreshedItems);
  renderLineItems();
  updateReportGenerated();
}

function renderCurrentEstimate(estimate) {
  elements.factorSource.textContent = `${estimate.factors.source} / ${estimate.group}`;
  elements.odMm.textContent = `${formatNumber(estimate.od, 1)} mm`;
  elements.weightKgm.textContent = formatNumber(estimate.weightKgm, 2);
  elements.totalWeight.textContent = formatNumber(estimate.totalWeight, 2);
  elements.rawSteel.textContent = formatCurrency(estimate.rawSteel, 2);
  elements.medianFactor.textContent = formatNumber(estimate.factors.median, 2);
  elements.medianRsKg.textContent = formatCurrency(estimate.medianRsKg, 2);
  elements.medianRsM.textContent = formatCurrency(estimate.medianRsM, 2);
  elements.medianTotal.textContent = formatCurrency(estimate.medianTotal, 0);
  elements.p90Factor.textContent = formatNumber(estimate.factors.p90, 2);
  elements.p90RsKg.textContent = formatCurrency(estimate.p90RsKg, 2);
  elements.p90RsM.textContent = formatCurrency(estimate.p90RsM, 2);
  elements.p90Total.textContent = formatCurrency(estimate.p90Total, 0);
  const riskReserve = Math.max(estimate.p90Total - estimate.medianTotal, 0);
  const p90Uplift = estimate.medianTotal > 0
    ? ((estimate.p90Total / estimate.medianTotal) - 1) * 100
    : 0;
  elements.pipeBasisMaterial.textContent = estimate.spec || "Not specified";
  elements.pipeBasisSizeWall.textContent = `${formatPipeSize(estimate.size)} IN / ${formatNumber(estimate.thickness, 2)} mm`;
  elements.pipeBasisCoating.textContent = estimate.coating || "No";
  elements.pipeBasisRaw.textContent = formatCurrency(estimate.rawSteel, 2);
  elements.pipeBasisFactor.textContent = formatNumber(estimate.factors.median, 2);
  elements.pipeBasisFinishedRate.textContent = formatCurrency(estimate.medianRsKg, 2);
  elements.pipeBasisRiskReserve.textContent = formatCurrency(riskReserve, 2);
  elements.pipeBasisP90Uplift.textContent = `${formatNumber(p90Uplift, 2)}%`;
  elements.pipeBasisP90Total.textContent = formatCurrency(estimate.p90Total, 2);
  renderWhatIfAnalysis();
}

function calculate() {
  elements.warning.textContent = "";
  updateOverrideReview();

  if (inputError) {
    elements.warning.textContent = inputError;
    return null;
  }

  if (hasIncompleteNonCarbonSteelSelection()) {
    elements.warning.textContent =
      "Select Pipe Material Standard before estimating non-carbon-steel pipe.";
    return null;
  }

  const estimate = getCurrentEstimate();

  if (estimate.error) {
    elements.warning.textContent = estimate.error;
    return null;
  }

  renderCurrentEstimate(estimate);
  return estimate;
}

function renderLineItems() {
  elements.lineCount.textContent = `${lineItems.length} ${lineItems.length === 1 ? "line" : "lines"}`;
  updateOverrideReview();
  updateSortButtons();

  if (lineItems.length === 0) {
    elements.lineItemsBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="12">No pipe lines added yet.</td>
      </tr>
    `;
    elements.summaryWeight.textContent = "-";
    elements.summaryMedian.textContent = "-";
    elements.summaryP90.textContent = "-";
    renderMaterialCategoryTables([]);
    renderWhatIfAnalysis();
    return;
  }

  applySort();
  updateSortButtons();

  elements.lineItemsBody.innerHTML = lineItems
    .map(
      (item) => `
        <tr>
          <td data-label="Size">${formatPipeSize(item.size)} IN</td>
          <td data-label="Thk mm">${formatNumber(item.thickness, 2)}</td>
          <td class="text-column" data-label="Material">${item.spec}</td>
          <td data-label="Length m">${formatNumber(item.length, 2)}</td>
          <td data-label="Coating">${item.coating}</td>
          <td data-label="Factor">${formatNumber(item.factors.median, 2)} / ${formatNumber(item.factors.p90, 2)}</td>
          <td data-label="Kg/m">${formatNumber(item.weightKgm, 2)}</td>
          <td data-label="Total kg">${formatNumber(item.totalWeight, 2)}</td>
          <td data-label="Rs/m">${formatCurrency(item.medianRsM, 2)}</td>
          <td data-label="Normal total">${formatCurrency(item.medianTotal, 0)}</td>
          <td data-label="P90 total">${formatCurrency(item.p90Total, 0)}</td>
          <td data-label="Action">
            <button class="remove-line" type="button" data-id="${item.id}">Remove</button>
          </td>
        </tr>
      `
    )
    .join("");

  const summary = getSummary(lineItems);

  elements.summaryWeight.textContent = `${formatNumber(summary.weight, 2)} kg`;
  elements.summaryMedian.textContent = formatCurrency(summary.median, 0);
  elements.summaryP90.textContent = formatCurrency(summary.p90, 0);
  renderMaterialCategoryTables(lineItems);
  renderWhatIfAnalysis();
}

function groupItemsByMaterialCategory(items) {
  return items.reduce((groups, item) => {
    const category = item.materialCategory || "Unclassified";
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push(item);
    return groups;
  }, new Map());
}

function formatCategoryHeading(category) {
  const cleanCategory = String(category || "Unclassified").trim() || "Unclassified";
  return cleanCategory.replace(/\s+Pipe$/i, "");
}

function getCategoryHeadingClass(category) {
  const normalizedCategory = String(category || "").toLowerCase();
  if (normalizedCategory.includes("unclassified")) return "category-heading-unclassified";
  if (normalizedCategory.includes("duplex")) return "category-heading-duplex";
  if (normalizedCategory.includes("stainless")) return "category-heading-stainless";
  if (normalizedCategory.includes("non-ferrous") || normalizedCategory.includes("monel") || normalizedCategory.includes("inconel")) {
    return "category-heading-nonferrous";
  }
  if (normalizedCategory.includes("alloy")) return "category-heading-alloy";
  if (normalizedCategory.includes("low temp")) return "category-heading-lowtemp";
  if (normalizedCategory.includes("carbon")) return "category-heading-carbon";
  return "category-heading-default";
}

function renderMaterialCategoryTables(items) {
  if (!elements.categoryTables || !elements.categoryCount) return;

  if (!items.length) {
    elements.categoryCount.textContent = "0 categories";
    if (elements.categoryLineCheck) {
      elements.categoryLineCheck.textContent = "Line check: 0 / 0";
      elements.categoryLineCheck.classList.remove("audit-line-check-warning");
    }
    elements.categoryTables.innerHTML =
      '<p class="empty-note">Upload a BOM or add pipe lines to view category-wise tables.</p>';
    return;
  }

  const groups = Array.from(groupItemsByMaterialCategory(items).entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  elements.categoryCount.textContent = `${groups.length} ${
    groups.length === 1 ? "category" : "categories"
  }`;
  if (elements.categoryLineCheck) {
    const categorizedLineCount = groups.reduce((total, [, categoryItems]) => total + categoryItems.length, 0);
    const isMatched = categorizedLineCount === items.length;
    elements.categoryLineCheck.textContent = `Line check: ${categorizedLineCount} / ${items.length}`;
    elements.categoryLineCheck.classList.toggle("audit-line-check-warning", !isMatched);
  }

  const categorySummaryTable = `
    <div class="category-estimate-summary">
      <h4>Pipe Material Category Estimate Summary</h4>
      <p class="category-disclaimer">
        Non-CS material estimates use the same factor-based method and are indicative only.
        Validate SS, alloy, duplex, and non-ferrous rates with supplier quotations.
      </p>
      <div class="table-wrap">
        <table class="category-summary-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Line count</th>
              <th>Total kg</th>
              <th>Normal total</th>
              <th>P90 total</th>
              <th>Raw Rs/kg</th>
              <th>Avg Rs/kg</th>
            </tr>
          </thead>
          <tbody>
            ${groups
              .map(([category, categoryItems]) => {
                const summary = getSummary(categoryItems);
                return `
                  <tr>
                    <td class="text-column" data-label="Category">${escapeHtml(formatCategoryHeading(category))}</td>
                    <td data-label="Line count">${categoryItems.length}</td>
                    <td data-label="Total kg">${formatNumber(summary.weight, 2)}</td>
                    <td data-label="Normal total">${formatCurrency(summary.median, 0)}</td>
                    <td data-label="P90 total">${formatCurrency(summary.p90, 0)}</td>
                    <td data-label="Raw Rs/kg">${formatCurrency(getCategoryAverageRawRsKg(categoryItems), 2)}</td>
                    <td data-label="Avg Rs/kg">${formatCurrency(getCategoryAverageRsKg(summary), 2)}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const categoryDetailTables = groups
    .map(([category, categoryItems]) => {
      const summary = getSummary(categoryItems);
      return `
        <article class="category-table-card">
          <div class="category-table-title">
            <div>
              <h4 class="${getCategoryHeadingClass(category)}">${escapeHtml(
                formatCategoryHeading(category)
              )}</h4>
              <p>${categoryItems.length} ${
                categoryItems.length === 1 ? "line" : "lines"
              } | ${formatNumber(summary.weight, 2)} kg | <span class="category-summary-rs">${formatCurrency(
                summary.median,
                0
              )}</span> normal total</p>
            </div>
          </div>
          <div class="table-wrap">
            <table class="category-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Thk mm</th>
                  <th class="text-column">BOM Material</th>
                  <th>Length m</th>
                  <th>Total kg</th>
                  <th>Rs/m</th>
                  <th>Normal total</th>
                  <th>P90 total</th>
                </tr>
              </thead>
              <tbody>
                ${categoryItems
                  .map(
                    (item) => `
                      <tr>
                        <td data-label="Size">${formatPipeSize(item.size)} IN</td>
                        <td data-label="Thk mm">${formatNumber(item.thickness, 2)}</td>
                        <td class="text-column" data-label="BOM Material">${escapeHtml(item.spec)}</td>
                        <td data-label="Length m">${formatNumber(item.length, 2)}</td>
                        <td data-label="Total kg">${formatNumber(item.totalWeight, 2)}</td>
                        <td data-label="Rs/m">${formatCurrency(item.medianRsM, 2)}</td>
                        <td data-label="Normal total">${formatCurrency(item.medianTotal, 0)}</td>
                        <td data-label="P90 total">${formatCurrency(item.p90Total, 0)}</td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          <details class="category-audit-details">
            <summary>Audit matching details</summary>
            <div class="table-wrap">
              <table class="category-audit-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th class="text-column">BOM Material</th>
                    <th class="text-column">Matched JSON Standard</th>
                    <th>Match ID</th>
                  </tr>
                </thead>
                <tbody>
                  ${categoryItems
                    .map(
                      (item) => `
                        <tr>
                          <td data-label="Size">${formatPipeSize(item.size)} IN</td>
                          <td class="text-column" data-label="BOM Material">${escapeHtml(item.spec)}</td>
                          <td class="text-column" data-label="Matched JSON Standard">${escapeHtml(
                            item.materialMatchedStandard || item.materialMatchNote || "No match"
                          )}</td>
                          <td data-label="Match ID">${escapeHtml(item.materialMatchId || "-")}</td>
                        </tr>
                      `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </details>
        </article>
      `;
    })
    .join("");

  elements.categoryTables.innerHTML = categorySummaryTable + categoryDetailTables;
}

function normalizeBomGroupText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\bw\s+n\b/g, "wn")
    .replace(/\bs\s+w\b/g, "sw")
    .replace(/\s+/g, " ")
    .trim();
}

function isBomNoteLikeItem(itemText) {
  const raw = String(itemText || "").trim();
  const normalized = normalizeBomGroupText(raw);
  if (!normalized) return true;

  const sizeOnlyPattern =
    /^(\d+(?:\.\d+)?|\d+\s+\d+\/\d+|\d+\/\d+)\s*(?:in|inch|mm|nb)?$/i;
  const ratingOnlyPattern = /^\d+\s*(?:#|lb|class)?$/i;
  const boltSizeOnlyPattern = /^m\d+\s*x\s*\d+$/i;
  const notePattern = /\b(as per|refer|provided by|procure with|datasheet|data sheet|note)\b/i;

  return (
    sizeOnlyPattern.test(raw.replace(/["']/g, "")) ||
    ratingOnlyPattern.test(raw) ||
    boltSizeOnlyPattern.test(raw) ||
    notePattern.test(raw)
  );
}

function getComponentAliasMatch(itemText) {
  const normalized = normalizeBomGroupText(itemText);
  if (!normalized) return null;

  return componentAliasMap.find((component) =>
    component.aliases.some((alias) => normalized.includes(normalizeBomGroupText(alias)))
  );
}

function classifyBomGroup(itemText) {
  const normalized = normalizeBomGroupText(itemText);
  if (!normalized) return { group: "Other Group", standardName: "" };
  if (isBomNoteLikeItem(itemText)) return { group: "Other Group", standardName: "" };

  const aliasMatch = getComponentAliasMatch(itemText);
  if (aliasMatch) {
    return { group: aliasMatch.group, standardName: aliasMatch.standardName };
  }

  const group = bomGroupDefinitions.find((definition) =>
    definition.keywords.some((keyword) => normalized.includes(normalizeBomGroupText(keyword)))
  );

  return { group: group ? group.name : "Other Group", standardName: "" };
}

function getElbowAngleFactorMatch(groupName, itemText, standardName = "") {
  if (groupName !== "Fitting Group") return null;
  const text = String(`${standardName} ${itemText}` || "").toUpperCase();
  if (!/\bELBOW\b|\bEL\b/.test(text)) return null;

  const normalized = normalizeBomGroupText(text);
  const compact = text.replace(/[^A-Z0-9]/g, "");
  const is45 =
    /\b45\s*(?:D|DEG|DEGREE|DEGREES)\b/i.test(text) ||
    normalized.includes("45 degree") ||
    normalized.includes("45 deg") ||
    compact.includes("ELBOW45D") ||
    compact.includes("ELBOW45DEG") ||
    compact.includes("EL45D") ||
    compact.includes("EL45DEG");
  const is90 =
    /\b90\s*(?:D|DEG|DEGREE|DEGREES)\b/i.test(text) ||
    normalized.includes("90 degree") ||
    normalized.includes("90 deg") ||
    compact.includes("ELBOW90D") ||
    compact.includes("ELBOW90DEG") ||
    compact.includes("EL90D") ||
    compact.includes("EL90DEG");

  if (is45) {
    return componentFactorMaster.find(
      (entry) => entry.group === "Fitting Group" && entry.component === "45 Degree Elbow"
    );
  }
  if (is90) {
    return componentFactorMaster.find(
      (entry) => entry.group === "Fitting Group" && entry.component === "90 Degree Elbow"
    );
  }
  return null;
}

function getComponentFactorMatch(groupName, itemText, standardName = "") {
  const elbowAngleMatch = getElbowAngleFactorMatch(groupName, itemText, standardName);
  if (elbowAngleMatch) return elbowAngleMatch;

  const normalizedItem = normalizeBomGroupText(`${standardName} ${itemText}`);
  const sameGroupFactors = componentFactorMaster.filter((entry) => entry.group === groupName);

  const exactOrContained = sameGroupFactors
    .map((entry) => ({
      entry,
      normalizedComponent: normalizeBomGroupText(entry.component),
    }))
    .filter(
      (match) =>
        match.normalizedComponent &&
        normalizedItem.includes(match.normalizedComponent)
    )
    .sort((a, b) => b.normalizedComponent.length - a.normalizedComponent.length)[0]?.entry;
  if (exactOrContained) return exactOrContained;

  const genericFallback = genericComponentFallbackFactors[groupName];
  if (genericFallback) {
    return {
      group: groupName,
      ...genericFallback,
      autoCostAllowed: true,
      isGenericFallback: true,
    };
  }

  return {
    group: "Other Group",
    component: "Generic Other P80",
    uom: "NOS",
    factor: 0,
    autoCostAllowed: false,
    confidence: "Low",
    isGenericFallback: true,
  };
}

function parsePressureClass(...values) {
  const text = values.map((value) => String(value || "")).join(" ").toUpperCase();
  const classMatch = text.match(/\b(?:CLASS|CL|#)\s*(150|300|600|800|900|1500|2500|3000|6000)(?=\D|$)/);
  if (classMatch) return classMatch[1];

  const ratingMatch = text.match(/\b(150|300|600|800|900|1500|2500|3000|6000)\s*(?:#|LB|LBS|CLASS|CL|["”])(?=\D|$)/);
  return ratingMatch ? ratingMatch[1] : "";
}

function hasComponentRatingText(value) {
  return /\b\d{2,4}\s*(?:#|LB|LBS|CLASS|CL|["”])(?=\D|$)/i.test(String(value || ""));
}

function getPressureMultiplier(pressureClass, groupName = "") {
  if (groupName === "Flange Group") return flangePressureClassMultipliers[pressureClass] || 1;
  if (groupName === "Valves Group") return valvePressureClassMultipliers[pressureClass] || 1;
  return pressureClassMultipliers[pressureClass] || 1;
}

function getMaterialMultiplier() {
  return 1;
}

function getDefaultComponentSchedule(size, group = "") {
  if (group === "Bolt Group") return "XS";
  if (group === "Flange Group" || group === "Valves Group") return "STD";
  return Number(size) < 2 ? "160" : "STD";
}

function getValveComponentPipeBasis(size) {
  const numericSize = Number(size);

  if (numericSize >= 10 && numericSize <= 48) {
    const thickness = 9.27 + (numericSize - 10) * 1.4;
    return {
      thickness,
      label: `Formula thickness ${formatNumber(thickness, 2)} mm = 9.27 + (NPS - 10) x 1.40 for 10-48 IN valve`,
    };
  }

  return {
    thickness: getScheduleThickness(numericSize, "STD"),
    label: "STD matching pipe basis",
  };
}

function getGateValveFactor() {
  return (
    componentFactorMaster.find(
      (entry) => entry.group === "Valves Group" && entry.component === "Gate Valve"
    )?.factor || 1
  );
}

function getValveGateBasePricingBand(size) {
  const numericSize = Number(size);
  return valveGateBasePricingBands.find(
    (band) => numericSize >= band.min && numericSize <= band.max
  );
}

function buildValveUnitRateEstimate({
  size,
  rawSteel,
  componentFactor,
  pressureMultiplier,
  materialMultiplier,
  p90Ratio,
}) {
  const numericSize = Number(size);
  const band = getValveGateBasePricingBand(numericSize);
  const gateValveFactor = getGateValveFactor();
  const valveFactor = Number(componentFactor?.factor);
  const usableP90Ratio = Number.isFinite(p90Ratio) && p90Ratio > 0 ? p90Ratio : 1.5;

  if (
    !band ||
    !Number.isFinite(numericSize) ||
    !Number.isFinite(rawSteel) ||
    !Number.isFinite(valveFactor) ||
    !Number.isFinite(gateValveFactor) ||
    gateValveFactor <= 0
  ) {
    return null;
  }

  const exponent = Number.isFinite(Number(band.exponent)) ? Number(band.exponent) : 2;
  const weightBasis = band.weightCoefficient * Math.pow(numericSize, exponent);
  const gateValve150Rate = weightBasis * rawSteel * band.conversionFactor;
  const valveRatio = valveFactor / gateValveFactor;
  const medianUnitRate =
    gateValve150Rate * valveRatio * pressureMultiplier * materialMultiplier;

  return {
    weightBasis,
    weightCoefficient: band.weightCoefficient,
    conversionFactor: band.conversionFactor,
    exponent,
    gateValveFactor,
    valveRatio,
    gateValve150Rate,
    medianUnitRate,
    p90UnitRate: medianUnitRate * usableP90Ratio,
    basisLabel: `Valve table basis: W = ${formatNumber(
      band.weightCoefficient,
      2
    )} x N^${formatNumber(exponent, 2)}, conversion factor ${formatNumber(
      band.conversionFactor,
      2
    )}; other valves scaled by factor ratio vs Gate Valve.`,
  };
}

function normalizeFlangeType(itemText = "", componentName = "", standardName = "") {
  const text = normalizeBomGroupText(`${standardName} ${componentName} ${itemText}`);
  if (/\bblind\b|\bblindflange\b|\bblindflg\b|\bblrf\b|\bbl\s*rf\b|\bbln\b|\bblank\b|\bblankflange\b|\bbl\b/.test(text)) return "BLRF";
  if (/\bweldneck\b|\bweld neck\b|\bweldingneck\b|\bwelding neck\b|\bwel neck\b|\bwell neck\b|\bneckflange\b|\bwn\b|\bwnrf\b|\bwn\s*rf\b|\bwnflange\b|\bwnflg\b|\bflangwn\b|\bflangewn\b/.test(text)) return "WNRF";
  if (/\bslipon\b|\bslip on\b|\bsliponflange\b|\bsliponflg\b|\bso\b|\bsorf\b|\bso\s*rf\b|\bsoflange\b|\bsoflg\b|\bs o\b/.test(text)) return "SORF";
  return "";
}

function getFlangeDisplayType(flangeType) {
  if (flangeType === "BLRF") return "Blind";
  if (flangeType === "SORF") return "SO";
  return "WN";
}

function getFlangeSizeBand(size) {
  const numericSize = Number(size);
  if (!Number.isFinite(numericSize) || numericSize <= 0) return "";
  if (numericSize <= 2) return "small";
  if (numericSize <= 8) return "medium";
  return "large";
}

function formatFlangeNpsKey(size) {
  const numericSize = Number(size);
  if (!Number.isFinite(numericSize) || numericSize <= 0) return "";
  return `${Number.isInteger(numericSize) ? numericSize : numericSize.toString()}"`;
}

function getFlangeDnFromModel(size, npsKey) {
  const fromTable = Number(flangeWeightModel?.npsToDn?.[npsKey]);
  if (Number.isFinite(fromTable) && fromTable > 0) return fromTable;
  const numericSize = Number(size);
  if (!Number.isFinite(numericSize) || numericSize <= 0) return NaN;
  const mappedDn = Number(
    Object.entries(dnToNps).find(([, nps]) => Number(nps) === numericSize)?.[0]
  );
  return Number.isFinite(mappedDn) && mappedDn > 0 ? mappedDn : numericSize * 25;
}

function interpolateFlangeWeight(flangeType, ratingKey, size, npsKey) {
  if (!flangeWeightModel?.standardCurves) return null;
  const targetDn = getFlangeDnFromModel(size, npsKey);
  if (!Number.isFinite(targetDn) || targetDn <= 0) return null;

  for (const standard of flangeStandardPriority) {
    const series = flangeWeightModel.standardCurves[`${flangeType}|${ratingKey}|${standard}`];
    if (!Array.isArray(series) || series.length < 2) continue;

    const sorted = series
      .map((point) => ({
        dn: Number(point.dn),
        nps: point.nps,
        weight: Number(point.weight),
      }))
      .filter((point) => Number.isFinite(point.dn) && Number.isFinite(point.weight) && point.weight > 0)
      .sort((a, b) => a.dn - b.dn);

    const lower = [...sorted].reverse().find((point) => point.dn <= targetDn);
    const upper = sorted.find((point) => point.dn >= targetDn);
    if (!lower || !upper) continue;
    if (lower.dn === upper.dn) {
      return {
        weight: lower.weight,
        standard,
        method: `Standard curve exact point ${lower.nps || npsKey}`,
      };
    }

    const weight = Math.exp(
      Math.log(lower.weight) +
        ((Math.log(targetDn) - Math.log(lower.dn)) / (Math.log(upper.dn) - Math.log(lower.dn))) *
          (Math.log(upper.weight) - Math.log(lower.weight))
    );

    return {
      weight,
      standard,
      method: `Log interpolation between ${lower.nps || `${lower.dn} DN`} and ${
        upper.nps || `${upper.dn} DN`
      }`,
    };
  }

  return null;
}

function lookupFlangeWeight(flangeType, ratingKey, size, npsKey) {
  const exactKey = `${flangeType}|${ratingKey}|${npsKey}`;
  const exact = flangeWeightModel?.exactWeights?.[exactKey];
  if (exact) {
    return {
      exactKey,
      weight: Number(exact.weight),
      standard: exact.standard || "",
      method: "Exact JSON weight",
    };
  }

  const builtIn = builtInFlangeWeightFallbacks[exactKey];
  if (builtIn) {
    return {
      exactKey,
      weight: Number(builtIn.weight),
      standard: builtIn.standard,
      method: `Built-in ${ratingKey} fallback weight`,
    };
  }

  const interpolated = interpolateFlangeWeight(flangeType, ratingKey, size, npsKey);
  return interpolated ? { exactKey, ...interpolated } : null;
}

function buildFlangeWeightUnitRateEstimate({
  item,
  standardName,
  componentFactor,
  size,
  pressureClass,
  rawSteel,
  materialMultiplier,
  p90Ratio,
}) {
  const detectedFlangeType = normalizeFlangeType(item, componentFactor?.component, standardName);
  const flangeType = detectedFlangeType || "WNRF";
  const sizeBand = getFlangeSizeBand(size);
  const p50Multiplier = flangeWeightP50Multipliers[flangeType]?.[sizeBand];
  const ratingKey = `${pressureClass || "150"}#`;
  const npsKey = formatFlangeNpsKey(size);
  const usableP90Ratio = Number.isFinite(p90Ratio) && p90Ratio > 0 ? p90Ratio : 1.5;

  if (!p50Multiplier) return null;

  const lookupAttempts = [
    { type: flangeType, rating: ratingKey, reason: detectedFlangeType ? "" : "Flange type not clear; WN fallback used." },
  ];
  if (flangeType !== "WNRF") {
    lookupAttempts.push({
      type: "WNRF",
      rating: ratingKey,
      reason: `${getFlangeDisplayType(flangeType)} ${ratingKey} weight not found; WN fallback used.`,
    });
  }
  let lookup = null;
  let lookupFlangeType = flangeType;
  let lookupRatingKey = ratingKey;
  let fallbackReason = "";
  for (const attempt of lookupAttempts) {
    lookup = lookupFlangeWeight(attempt.type, attempt.rating, size, npsKey);
    if (lookup && Number.isFinite(lookup.weight) && lookup.weight > 0) {
      lookupFlangeType = attempt.type;
      lookupRatingKey = attempt.rating;
      fallbackReason = attempt.reason;
      break;
    }
  }

  if (!lookup || !Number.isFinite(lookup.weight) || lookup.weight <= 0) {
    return {
      error: "Flange weight is not available in the JSON model. Review required.",
      flangeType,
      sizeBand,
      p50Multiplier,
      exactKey: `${flangeType}|${ratingKey}|${npsKey}`,
    };
  }

  if (!Number.isFinite(rawSteel) || rawSteel <= 0) {
    return {
      error: "Raw material rate is not available for this flange.",
      flangeType,
      detectedFlangeType,
      sizeBand,
      p50Multiplier,
      exactKey: lookup.exactKey,
    };
  }

  const lookupSizeBand = getFlangeSizeBand(size);
  const lookupP50Multiplier = flangeWeightP50Multipliers[lookupFlangeType]?.[lookupSizeBand] || p50Multiplier;
  const medianUnitRate = lookup.weight * rawSteel * lookupP50Multiplier * materialMultiplier;

  return {
    flangeType: lookupFlangeType,
    detectedFlangeType,
    flangeFallbackUsed: Boolean(fallbackReason),
    flangeFallbackReason: fallbackReason,
    sizeBand,
    npsKey,
    ratingKey: lookupRatingKey,
    originalRatingKey: ratingKey,
    exactKey: lookup.exactKey,
    weightKg: lookup.weight,
    standard: lookup.standard,
    lookupMethod: lookup.method,
    p50Multiplier: lookupP50Multiplier,
    medianUnitRate,
    p90UnitRate: medianUnitRate * usableP90Ratio,
    basisLabel: `Flange JSON weight basis ${lookupFlangeType} ${lookupRatingKey} ${npsKey}: ${formatNumber(
      lookup.weight,
      2
    )} kg, ${lookup.method}, P50 multiplier ${formatNumber(lookupP50Multiplier, 2)}.${
      fallbackReason ? ` ${fallbackReason}` : ""
    }`,
  };
}

function parseMetricStudDesignation(...values) {
  const text = values.map((value) => String(value || "")).join(" ").toUpperCase();
  const match = text.match(/\bM\s*(\d+(?:\.\d+)?)\s*[X\u00D7]\s*(\d+(?:\.\d+)?)\b/);
  if (!match) return null;

  return {
    diameterMm: Number(match[1]),
    lengthMm: Number(match[2]),
  };
}

function calculateMetricStudBoltSetMass({
  diameterMm,
  lengthMm,
  pitchMm,
  nutAcrossFlatsMm,
  nutThicknessMm,
  densityKgM3 = studBoltPricingBasis.densityKgM3,
  studCorrectionFactor = studBoltPricingBasis.studCorrectionFactor,
  nutCorrectionFactor = studBoltPricingBasis.nutCorrectionFactor,
  numberOfNuts = studBoltPricingBasis.numberOfNuts,
}) {
  const values = {
    diameterMm: Number(diameterMm),
    lengthMm: Number(lengthMm),
    pitchMm: Number(pitchMm),
    nutAcrossFlatsMm: Number(nutAcrossFlatsMm),
    nutThicknessMm: Number(nutThicknessMm),
    densityKgM3: Number(densityKgM3),
    studCorrectionFactor: Number(studCorrectionFactor),
    nutCorrectionFactor: Number(nutCorrectionFactor),
    numberOfNuts: Number(numberOfNuts),
  };

  if (Object.values(values).some((value) => !Number.isFinite(value) || value <= 0)) {
    return null;
  }

  if (values.nutAcrossFlatsMm <= values.diameterMm) return null;

  const effectiveDiameterMm = values.diameterMm - 0.649519 * values.pitchMm;
  if (effectiveDiameterMm <= 0) return null;

  const studAreaMm2 = (Math.PI / 4) * Math.pow(effectiveDiameterMm, 2);
  const studVolumeMm3 = studAreaMm2 * values.lengthMm * values.studCorrectionFactor;
  const studMassKg = studVolumeMm3 * values.densityKgM3 * 1e-9;
  const grossNutHexAreaMm2 = (Math.sqrt(3) / 2) * Math.pow(values.nutAcrossFlatsMm, 2);
  const nutHoleAreaMm2 = (Math.PI / 4) * Math.pow(effectiveDiameterMm, 2);
  const netNutAreaMm2 = grossNutHexAreaMm2 - nutHoleAreaMm2;
  if (netNutAreaMm2 <= 0) return null;

  const oneNutVolumeMm3 = netNutAreaMm2 * values.nutThicknessMm * values.nutCorrectionFactor;
  const oneNutMassKg = oneNutVolumeMm3 * values.densityKgM3 * 1e-9;
  const totalNutMassKg = oneNutMassKg * values.numberOfNuts;
  const massPerSetKg = studMassKg + totalNutMassKg;

  return {
    ...values,
    effectiveDiameterMm,
    studAreaMm2,
    studVolumeMm3,
    studMassKg,
    grossNutHexAreaMm2,
    nutHoleAreaMm2,
    netNutAreaMm2,
    oneNutVolumeMm3,
    oneNutMassKg,
    totalNutMassKg,
    massPerSetKg,
  };
}

function buildMetricStudBoltUnitRateEstimate({ designationText, rawSteel, p90Ratio }) {
  const designation = parseMetricStudDesignation(designationText);
  if (!designation) return null;
  if (!Number.isFinite(Number(rawSteel)) || Number(rawSteel) <= 0) {
    return { error: "Raw material rate is not available for this metric stud set." };
  }

  const pitchMm = metricCoarsePitch[designation.diameterMm];
  if (!Number.isFinite(pitchMm)) {
    return { error: "Standard coarse thread pitch is not available for this metric stud size. Review required." };
  }
  const nutDimensions = metricHeavyHexNutDimensions[designation.diameterMm];
  if (!nutDimensions) {
    return { error: "Nut dimensions are not available for this stud set. Review required." };
  }

  const mass = calculateMetricStudBoltSetMass({
    ...designation,
    pitchMm,
    nutAcrossFlatsMm: nutDimensions.acrossFlatsMm,
    nutThicknessMm: nutDimensions.thicknessMm,
  });
  if (!mass) return { error: "Stud-and-nut mass calculation is invalid. Review required." };

  const commercialFactor = studBoltPricingBasis.commercialRawToFinishedFactor;
  const usableP90Ratio = Number.isFinite(p90Ratio) && p90Ratio > 0 ? p90Ratio : 1.5;
  const medianUnitRate = mass.massPerSetKg * Number(rawSteel) * commercialFactor;

  return {
    ...mass,
    commercialFactor,
    medianUnitRate,
    p90UnitRate: medianUnitRate * usableP90Ratio,
    basisLabel: `Metric stud-and-two-heavy-hex-nut basis M${formatNumber(
      designation.diameterMm,
      0
    )} x ${formatNumber(designation.lengthMm, 0)} mm; ASME B18.2.4.6M heavy hex nuts, pitch ${formatNumber(
      pitchMm,
      2
    )} mm`,
  };
}

function getDefaultComponentThickness(size, thicknessText, group = "", thicknessIsSchedule = false) {
  const isPipeGroup = group === "Pipe Group";
  const hasPressureClass = Boolean(parsePressureClass(thicknessText));
  const hasRatingText = hasComponentRatingText(thicknessText);

  if (group === "Valves Group") {
    return getValveComponentPipeBasis(size).thickness;
  }

  if (!isPipeGroup && (hasPressureClass || hasRatingText)) {
    return getScheduleThickness(size, getDefaultComponentSchedule(size, group));
  }

  if (thicknessIsSchedule) {
    const scheduleThickness = getScheduleThickness(size, thicknessText);
    if (Number.isFinite(scheduleThickness) && scheduleThickness > 0) return scheduleThickness;
  }

  const parsedThickness = parseThicknessInput(thicknessText, size);
  if (Number.isFinite(parsedThickness) && parsedThickness > 0) return parsedThickness;
  return getScheduleThickness(size, isPipeGroup ? "STD" : getDefaultComponentSchedule(size, group));
}

function buildComponentCostEstimate({
  group,
  item,
  standardName,
  sizeText,
  thicknessText,
  materialText,
  quantityText,
  uomText,
  thicknessIsSchedule = false,
}) {
  const componentFactor = getComponentFactorMatch(group, item, standardName);
  const quantity = parseBomNumber(quantityText);
  const hasValidQuantity = Number.isFinite(quantity) && quantity > 0;
  const size = parseComponentSize(sizeText, group);
  const defaultSchedule = getDefaultComponentSchedule(size, group);
  const thickness = getDefaultComponentThickness(size, thicknessText, group, thicknessIsSchedule);
  const valvePipeBasis = group === "Valves Group" ? getValveComponentPipeBasis(size) : null;
  const matchingPipeBasis =
    group === "Pipe Group"
      ? "BOM pipe thickness/schedule"
      : valvePipeBasis
        ? valvePipeBasis.label
      : `${defaultSchedule} matching pipe basis`;
  const rawMapping = getRawMaterialPriceMapping(materialText, elements.year.value);
  const rawOverride = rawMapping?.recommended || elements.rawOverride.value || rawSteelByYear[elements.year.value] || rawSteelByYear[2026];
  const metricStudDesignation =
    group === "Bolt Group" ? parseMetricStudDesignation(sizeText, item) : null;
  const pipeBasis = buildEstimate({
    year: elements.year.value,
    size,
    thickness,
    length: 1,
    spec: rawMapping?.standard || materialText || elements.spec.value,
    coating: elements.coating.value,
    rawOverride,
    rawSteelSource: rawMapping ? "materialLibrary" : "defaultYear",
    rawBasisNote: rawMapping?.note || "Component estimate used current/default raw material basis",
    factorOverride: elements.factorOverride.value,
  });

  if (!componentFactor?.autoCostAllowed || Number(componentFactor?.factor) <= 0) {
    return {
      component: componentFactor?.component || standardName || "Other",
      factor: componentFactor?.factor ?? 0,
      factorUom: componentFactor?.uom || "",
      confidence: componentFactor?.confidence || "Low",
      autoCostAllowed: false,
      note: "Manual review required; no approved positive factor is available.",
    };
  }

  const pressureClass = parsePressureClass(item, thicknessText);
  const pressureMultiplier = getPressureMultiplier(pressureClass, group);
  const materialMultiplier = getMaterialMultiplier(materialText);
  const normalizedUom = normalizeHeader(uomText);
  const quantityBasis = hasValidQuantity ? quantity : NaN;
  const defaultFactors = getFactor(elements.coating.value);
  const p90Ratio =
    Number.isFinite(pipeBasis.p90RsM) && Number.isFinite(pipeBasis.medianRsM) && pipeBasis.medianRsM > 0
      ? pipeBasis.p90RsM / pipeBasis.medianRsM
      : defaultFactors.p90 / defaultFactors.median;
  const flangeUnitEstimate =
    group === "Flange Group"
      ? buildFlangeWeightUnitRateEstimate({
          item,
          standardName,
          componentFactor,
          size,
          pressureClass,
          rawSteel: pipeBasis.rawSteel || Number(rawOverride),
          materialMultiplier,
          p90Ratio,
        })
      : null;
  const flangeFallbackUnitEstimate =
    group === "Flange Group" && flangeUnitEstimate?.error && !pipeBasis.error
      ? (() => {
          const fallbackBand = getFlangeSizeBand(size);
          const fallbackMultiplier =
            flangeWeightP50Multipliers.WNRF[fallbackBand] || componentFactor.factor || 1;
          const effectiveFallbackMultiplier =
            fallbackMultiplier * flangeEquivalentPipeFallbackScale;
          return {
            flangeType: "WNRF",
            sizeBand: fallbackBand,
            p50Multiplier: fallbackMultiplier,
            fallbackScale: flangeEquivalentPipeFallbackScale,
            effectiveFallbackMultiplier,
            medianUnitRate: pipeBasis.medianRsM * effectiveFallbackMultiplier * materialMultiplier,
            p90UnitRate: pipeBasis.p90RsM * effectiveFallbackMultiplier * materialMultiplier,
            basisLabel: `Last-resort WN fallback flange basis: equivalent pipe rate x WN P50 multiplier ${formatNumber(
              fallbackMultiplier,
              2
            )} x fallback scale ${formatNumber(flangeEquivalentPipeFallbackScale, 2)}. ${
              flangeUnitEstimate.error
            }`,
            note: `Last-resort WN fallback used because ${flangeUnitEstimate.error}`,
          };
        })()
      : null;
  const valveUnitEstimate =
    group === "Valves Group"
      ? buildValveUnitRateEstimate({
          size,
          rawSteel: pipeBasis.rawSteel,
          componentFactor,
          pressureMultiplier,
          materialMultiplier,
          p90Ratio,
        })
      : null;
  const studBoltUnitEstimate =
    metricStudDesignation
      ? buildMetricStudBoltUnitRateEstimate({
          designationText: `${sizeText} ${item}`,
          rawSteel: pipeBasis.rawSteel || Number(rawOverride),
          p90Ratio,
        })
      : null;

  if (metricStudDesignation && studBoltUnitEstimate?.error) {
    return {
      component: componentFactor.component,
      factor: studBoltPricingBasis.commercialRawToFinishedFactor,
      componentFactor: componentFactor.factor,
      factorUom: componentFactor.uom,
      confidence: componentFactor.confidence,
      autoCostAllowed: false,
      size,
      quantity: quantityBasis,
      uom: normalizedUom || componentFactor.uom,
      note: studBoltUnitEstimate.error,
    };
  }

  if (pipeBasis.error) {
    return {
      component: componentFactor.component,
      factor: componentFactor.factor,
      factorUom: componentFactor.uom,
      confidence: componentFactor.confidence,
      autoCostAllowed: false,
      note: pipeBasis.error || "Size/thickness is not readable for component estimate.",
    };
  }

  const medianUnitRate =
    studBoltUnitEstimate?.medianUnitRate ??
    flangeUnitEstimate?.medianUnitRate ??
    flangeFallbackUnitEstimate?.medianUnitRate ??
    valveUnitEstimate?.medianUnitRate ??
    pipeBasis.medianRsM * componentFactor.factor * pressureMultiplier * materialMultiplier;
  const p90UnitRate =
    studBoltUnitEstimate?.p90UnitRate ??
    flangeUnitEstimate?.p90UnitRate ??
    flangeFallbackUnitEstimate?.p90UnitRate ??
    valveUnitEstimate?.p90UnitRate ??
    pipeBasis.p90RsM * componentFactor.factor * pressureMultiplier * materialMultiplier;

  return {
    component: componentFactor.component,
    factor:
      studBoltUnitEstimate?.commercialFactor ??
      flangeUnitEstimate?.p50Multiplier ??
      flangeFallbackUnitEstimate?.p50Multiplier ??
      valveUnitEstimate?.conversionFactor ??
      componentFactor.factor,
    componentFactor: componentFactor.factor,
    factorUom: componentFactor.uom,
    confidence: componentFactor.confidence,
    isGenericFallback: Boolean(componentFactor.isGenericFallback),
    autoCostAllowed: hasValidQuantity,
    unitCostAllowed: true,
    totalCostAllowed: hasValidQuantity,
    size,
    thickness,
    quantity: quantityBasis,
    uom: normalizedUom || componentFactor.uom,
    rawSteel: pipeBasis.rawSteel || Number(rawOverride),
    pipeBasisRsM: pipeBasis.medianRsM,
    rawMaterialBasis: pipeBasis.rawSteelBasis,
    equivalentPipeSpec: rawMapping?.equivalentPipeSpec || "",
    studDiameterMm: studBoltUnitEstimate?.diameterMm ?? "",
    studLengthMm: studBoltUnitEstimate?.lengthMm ?? "",
    studPitchMm: studBoltUnitEstimate?.pitchMm ?? "",
    studEffectiveDiameterMm: studBoltUnitEstimate?.effectiveDiameterMm ?? "",
    studMassKg: studBoltUnitEstimate?.studMassKg ?? "",
    oneNutMassKg: studBoltUnitEstimate?.oneNutMassKg ?? "",
    totalNutMassKg: studBoltUnitEstimate?.totalNutMassKg ?? "",
    setMassKg: studBoltUnitEstimate?.massPerSetKg ?? "",
    setTotalMassKg: studBoltUnitEstimate
      ? studBoltUnitEstimate.massPerSetKg * quantityBasis
      : "",
    nutAcrossFlatsMm: studBoltUnitEstimate?.nutAcrossFlatsMm ?? "",
    nutThicknessMm: studBoltUnitEstimate?.nutThicknessMm ?? "",
    studCorrectionFactor: studBoltUnitEstimate?.studCorrectionFactor ?? "",
    nutCorrectionFactor: studBoltUnitEstimate?.nutCorrectionFactor ?? "",
    numberOfNuts: studBoltUnitEstimate?.numberOfNuts ?? "",
    studCommercialFactor: studBoltUnitEstimate?.commercialFactor ?? "",
    flangeType: flangeUnitEstimate?.flangeType ?? flangeFallbackUnitEstimate?.flangeType ?? "",
    flangeSizeBand: flangeUnitEstimate?.sizeBand ?? flangeFallbackUnitEstimate?.sizeBand ?? "",
    flangeWeightKg: flangeUnitEstimate?.weightKg ?? "",
    flangeWeightStandard: flangeUnitEstimate?.standard ?? "",
    flangeWeightMethod: flangeUnitEstimate?.lookupMethod ?? "",
    flangeLookupKey: flangeUnitEstimate?.exactKey ?? "",
    flangeP50Multiplier: flangeUnitEstimate?.p50Multiplier ?? flangeFallbackUnitEstimate?.p50Multiplier ?? "",
    flangeFallbackUsed: Boolean(flangeFallbackUnitEstimate),
    valveWeightBasis: valveUnitEstimate?.weightBasis ?? "",
    valveConversionFactor: valveUnitEstimate?.conversionFactor ?? "",
    valveFactorRatio: valveUnitEstimate?.valveRatio ?? "",
    pressureClass,
    pressureMultiplier,
    materialMultiplier,
    medianUnitRate,
    p90UnitRate,
    medianTotal: hasValidQuantity ? medianUnitRate * quantityBasis : NaN,
    p90Total: hasValidQuantity ? p90UnitRate * quantityBasis : NaN,
    matchingPipeBasis:
      studBoltUnitEstimate?.basisLabel ||
      flangeUnitEstimate?.basisLabel ||
      flangeFallbackUnitEstimate?.basisLabel ||
      valveUnitEstimate?.basisLabel ||
      matchingPipeBasis,
    note: `${hasValidQuantity ? "" : "Unit Rs calculated, but Quantity is not readable; Normal and P90 totals require review. "}${studBoltUnitEstimate
      ? `Metric complete set: stud ${formatNumber(
          studBoltUnitEstimate.studMassKg,
          3
        )} kg + ${formatNumber(studBoltUnitEstimate.numberOfNuts, 0)} heavy hex nuts x ${formatNumber(
          studBoltUnitEstimate.oneNutMassKg,
          3
        )} kg = ${formatNumber(studBoltUnitEstimate.massPerSetKg, 3)} kg/set. Raw ${formatCurrency(
          pipeBasis.rawSteel || Number(rawOverride),
          2
        )}/kg x commercial raw-to-finished factor ${formatNumber(
          studBoltUnitEstimate.commercialFactor,
          2
        )}. Calculated mass excludes washers, coatings, chamfers and manufacturing tolerances.`
      : flangeUnitEstimate
      ? `Flange weight model: ${flangeUnitEstimate.flangeType} ${flangeUnitEstimate.ratingKey} ${
          flangeUnitEstimate.npsKey
        }, ${formatNumber(flangeUnitEstimate.weightKg, 2)} kg from ${
          flangeUnitEstimate.standard || "JSON"
        } (${flangeUnitEstimate.lookupMethod}). ${
          flangeUnitEstimate.flangeFallbackUsed
            ? `Fallback applied: ${flangeUnitEstimate.flangeFallbackReason} `
            : ""
        }Unit Rs = weight x raw ${formatCurrency(
          pipeBasis.rawSteel || Number(rawOverride),
          2
        )}/kg x P50 multiplier ${formatNumber(
          flangeUnitEstimate.p50Multiplier,
          2
        )} x material multiplier ${formatNumber(materialMultiplier, 2)}. Rating effect is included in flange weight; no extra flange pressure multiplier is applied.`
      : flangeFallbackUnitEstimate
      ? `Flange fallback: ${flangeFallbackUnitEstimate.note}. Unit Rs = equivalent pipe rate ${formatCurrency(
          pipeBasis.medianRsM,
          2
        )}/m x WN P50 multiplier ${formatNumber(
          flangeFallbackUnitEstimate.p50Multiplier,
          2
        )} x fallback scale ${formatNumber(
          flangeFallbackUnitEstimate.fallbackScale,
          2
        )} x material multiplier ${formatNumber(materialMultiplier, 2)}.`
      : valveUnitEstimate
      ? `${componentFactor.isGenericFallback ? "Generic fallback P80 applied. " : ""}Valve table: W ${formatNumber(
          valveUnitEstimate.weightBasis,
          2
        )} kg basis x raw ${formatCurrency(pipeBasis.rawSteel, 2)}/kg x conversion ${formatNumber(
          valveUnitEstimate.conversionFactor,
          2
        )} x valve ratio ${formatNumber(
          valveUnitEstimate.valveRatio,
          2
        )} x pressure multiplier ${formatNumber(
          pressureMultiplier,
          2
        )} x material multiplier ${formatNumber(materialMultiplier, 2)}.`
      : `${componentFactor.isGenericFallback ? "Generic fallback P80 applied. " : ""}Component factor ${formatNumber(
          componentFactor.factor,
          2
        )} x pressure multiplier ${formatNumber(
          pressureMultiplier,
          2
        )} x material multiplier ${formatNumber(materialMultiplier, 2)} x 1m equivalent pipe rate.`}`,
  };
}

function buildBomGroupItem(row, columns, sourceName, sourceKey) {
  const itemText = columns.item ? row[columns.item] : "";
  const sizeText = columns.size ? row[columns.size] : "";
  const thicknessText = columns.thickness ? row[columns.thickness] : "";
  const lengthText = columns.length ? row[columns.length] : "";
  const uomText = columns.uom ? row[columns.uom] : "";
  const materialText = columns.spec ? row[columns.spec] : "";

  if (!String(itemText || "").trim()) return null;
  const classification = classifyBomGroup(itemText);
  const materialMatch = classifyMaterialSpec(materialText);
  const componentCost = buildComponentCostEstimate({
    group: classification.group,
    item: itemText,
    standardName: classification.standardName,
    sizeText,
    thicknessText,
    materialText,
    quantityText: lengthText,
    uomText,
    thicknessIsSchedule: isScheduleOrRatingColumn(columns.thickness),
  });

  return {
    id: createId(),
    sourceName,
    sourceKey,
    group: classification.group,
    standardName: classification.standardName,
    item: String(itemText || "").trim(),
    size: String(sizeText || "").trim(),
    thickness: String(thicknessText || "").trim(),
    material: String(materialText || "").trim(),
    materialCategory: materialMatch.category,
    materialMatchedStandard: materialMatch.matchedStandard,
    materialMatchId: materialMatch.matchId,
    materialMatchNote: materialMatch.note,
    quantity: String(lengthText || "").trim(),
    uom: String(uomText || "").trim(),
    componentCost,
  };
}

const manualComponentGroups = [
  "Fitting Group",
  "Flange Group",
  "Valves Group",
  "Bolt Group",
  "Gasket Group",
  "Trap/Strainer Group",
];

const manualComponentDefaults = {
  "Fitting Group": { size: "4 IN", rating: "STD", material: "ASTM A234 WPB" },
  "Flange Group": { size: "4 IN", rating: "150#", material: "ASTM A105" },
  "Valves Group": { size: "4 IN", rating: "150#", material: "ASTM A216 WCB" },
  "Bolt Group": { size: "M24 x 145", rating: "", material: "ASTM A193 B7 / ASTM A194 2H" },
  "Gasket Group": { size: "4 IN", rating: "150#", material: "SS304" },
  "Trap/Strainer Group": { size: "4 IN", rating: "150#", material: "ASTM A216 WCB" },
};

function populateComponentGroups() {
  if (!elements.componentGroup) return;
  elements.componentGroup.innerHTML = manualComponentGroups
    .map((group) => `<option value="${escapeHtml(group)}">${escapeHtml(group.replace(" Group", ""))}</option>`)
    .join("");
  elements.componentGroup.value = "Fitting Group";
  populateComponentTypes({ applyDefaults: true });
}

function populateComponentTypes({ applyDefaults = false } = {}) {
  if (!elements.componentGroup || !elements.componentType) return;
  const group = elements.componentGroup.value;
  const uniqueComponents = [...new Set(
    componentFactorMaster
      .filter((entry) => entry.group === group && entry.factor > 0)
      .map((entry) => entry.component)
  )];
  elements.componentType.innerHTML = uniqueComponents
    .map((component) => `<option value="${escapeHtml(component)}">${escapeHtml(component)}</option>`)
    .join("");
  updateComponentFieldLayout(applyDefaults);
}

function updateComponentFieldLayout(applyDefaults = false) {
  if (!elements.componentGroup) return;
  const group = elements.componentGroup.value;
  const isBolt = group === "Bolt Group";
  const defaults = manualComponentDefaults[group] || manualComponentDefaults["Fitting Group"];
  elements.componentSizeLabel.textContent = isBolt ? "Metric Size / Designation" : "Size IN";
  elements.componentSize.placeholder = isBolt ? "Example: M24 x 145" : "Example: 4 IN or 6 IN x 4 IN";
  elements.componentRatingField.hidden = isBolt;

  if (applyDefaults) {
    elements.componentSize.value = defaults.size;
    elements.componentRating.value = defaults.rating;
    elements.componentMaterial.value = defaults.material;
  }

  const factorMatch = getComponentFactorMatch(group, elements.componentType.value, elements.componentType.value);
  elements.componentUom.value = factorMatch?.uom || "NOS";
  renderComponentQuickEstimate();
}

function getCurrentComponentQuickEstimate() {
  const group = elements.componentGroup.value;
  const component = elements.componentType.value;
  const sizeText = elements.componentSize.value.trim();
  const thicknessText = elements.componentRatingField.hidden ? "" : elements.componentRating.value.trim();
  const materialText = elements.componentMaterial.value.trim();
  const quantityText = elements.componentQuantity.value;

  if (!group || !component || !sizeText || !materialText) {
    return { error: "Select a component type and enter size and material before estimating." };
  }

  const cost = buildComponentCostEstimate({
    group,
    item: component,
    standardName: component,
    sizeText,
    thicknessText,
    materialText,
    quantityText,
    uomText: elements.componentUom.value,
    thicknessIsSchedule: true,
  });
  const materialMatch = classifyMaterialSpec(materialText);
  return { group, component, sizeText, thicknessText, materialText, quantityText, materialMatch, cost };
}

function renderComponentQuickEstimate() {
  if (!elements.componentOutputGroup) return;
  const preview = getCurrentComponentQuickEstimate();
  const clearOutput = (message) => {
    elements.componentOutputGroup.textContent = "Component estimate";
    elements.componentOutputStatus.textContent = "Review required";
    elements.componentOutputStatus.classList.add("review");
    elements.componentMaterialCategory.textContent = "-";
    elements.componentRawRate.textContent = "-";
    elements.componentFactor.textContent = "-";
    elements.componentUnitRate.textContent = "-";
    elements.componentNormalTotal.textContent = "-";
    elements.componentP90Total.textContent = "-";
    elements.componentBasis.textContent = message;
    elements.componentWarning.textContent = message;
  };
  if (preview.error) {
    clearOutput(preview.error);
    return null;
  }

  const { cost } = preview;
  const priced = hasComponentUnitPrice(cost);
  const hasTotals = hasComponentTotals(cost);
  elements.componentOutputGroup.textContent = `${preview.component} | ${preview.group.replace(" Group", "")}`;
  elements.componentOutputStatus.textContent = priced && hasTotals ? "Ready" : "Review required";
  elements.componentOutputStatus.classList.toggle("review", !(priced && hasTotals));
  elements.componentMaterialCategory.textContent = formatCategoryHeading(preview.materialMatch.category || "Unclassified");
  elements.componentRawRate.textContent = Number.isFinite(cost.rawSteel) ? formatCurrency(cost.rawSteel, 2) : "Review";
  elements.componentFactor.textContent = Number.isFinite(cost.factor) ? formatNumber(cost.factor, 2) : "Review";
  elements.componentUnitRate.textContent = priced ? formatCurrency(cost.medianUnitRate, 2) : "Review";
  elements.componentNormalTotal.textContent = hasTotals ? formatCurrency(cost.medianTotal, 2) : "Review";
  elements.componentP90Total.textContent = hasTotals ? formatCurrency(cost.p90Total, 2) : "Review";
  elements.componentBasis.textContent = cost.note || cost.matchingPipeBasis || "Calculation basis is not available.";
  elements.componentWarning.textContent = priced && hasTotals ? "" : cost.note || "Complete the required component information to calculate the estimate.";
  return preview;
}

function addManualComponent() {
  const preview = renderComponentQuickEstimate();
  if (!preview || !hasComponentUnitPrice(preview.cost) || !hasComponentTotals(preview.cost)) {
    elements.componentWarning.textContent = preview?.cost?.note || "Complete the required information before adding this component.";
    return;
  }

  bomGroupItems.push({
    id: createId(),
    sourceName: "Manual component input",
    sourceKey: "manual-component",
    group: preview.group,
    standardName: preview.component,
    item: preview.component,
    size: preview.sizeText,
    thickness: preview.thicknessText || "-",
    material: preview.materialText,
    materialCategory: preview.materialMatch.category,
    materialMatchedStandard: preview.materialMatch.matchedStandard,
    materialMatchId: preview.materialMatch.matchId,
    materialMatchNote: preview.materialMatch.note,
    quantity: String(preview.quantityText),
    uom: elements.componentUom.value,
    componentCost: preview.cost,
  });
  renderBomGroupReview();
  renderWhatIfAnalysis();
  updateReportGenerated();
  showSuccessMessage(`${preview.component} added to Piping Component Cost Review.`);
}

function resetComponentQuickEstimate() {
  elements.componentGroup.value = "Fitting Group";
  elements.componentQuantity.value = "1";
  populateComponentTypes({ applyDefaults: true });
  elements.componentWarning.textContent = "";
}

function hasComponentUnitPrice(cost = {}) {
  return Boolean(cost.unitCostAllowed ?? cost.autoCostAllowed) && Number.isFinite(cost.medianUnitRate);
}

function hasComponentTotals(cost = {}) {
  return Boolean(cost.totalCostAllowed ?? cost.autoCostAllowed) && Number.isFinite(cost.medianTotal);
}

function groupBomItems(items) {
  const groups = new Map(bomGroupDefinitions.map((definition) => [definition.name, []]));
  items.forEach((item) => {
    if (!groups.has(item.group)) groups.set(item.group, []);
    groups.get(item.group).push(item);
  });
  return Array.from(groups.entries()).filter(([, groupItems]) => groupItems.length > 0);
}

function getComponentCostSummary(items) {
  return items.reduce(
    (summary, item) => {
      const cost = item.componentCost || {};
      const normal = Number(cost.medianTotal) || 0;
      const p90 = Number(cost.p90Total) || 0;
      return {
        priced: summary.priced + (cost.autoCostAllowed && normal > 0 ? 1 : 0),
        review: summary.review + (!cost.autoCostAllowed || normal <= 0 ? 1 : 0),
        normal: summary.normal + normal,
        p90: summary.p90 + p90,
      };
    },
    { priced: 0, review: 0, normal: 0, p90: 0 }
  );
}

function getBomGroupHeadingClass(groupName) {
  const normalized = String(groupName || "").toLowerCase();
  if (normalized.includes("pipe")) return "bom-heading-pipe";
  if (normalized.includes("fitting")) return "bom-heading-fitting";
  if (normalized.includes("flange")) return "bom-heading-flange";
  if (normalized.includes("valves")) return "bom-heading-valve";
  if (normalized.includes("bolt")) return "bom-heading-bolt";
  if (normalized.includes("gasket")) return "bom-heading-gasket";
  if (normalized.includes("trap") || normalized.includes("strainer")) return "bom-heading-trap";
  return "bom-heading-other";
}

function renderBomGroupReview() {
  if (!elements.bomGroupCount || !elements.bomGroupTables) return;

  elements.bomGroupCount.textContent = `${bomGroupItems.length} ${
    bomGroupItems.length === 1 ? "item" : "items"
  }`;

  if (!bomGroupItems.length) {
    elements.bomGroupTables.innerHTML =
      '<p class="empty-note">Upload a BOM to view group-wise item tables.</p>';
    return;
  }

  const overallComponentSummary = getComponentCostSummary(bomGroupItems);
  const summaryHtml = `
    <div class="component-cost-summary">
      <article>
        <span>Priced components</span>
        <strong>${overallComponentSummary.priced}</strong>
      </article>
      <article>
        <span>Need review</span>
        <strong>${overallComponentSummary.review}</strong>
      </article>
      <article>
        <span>Normal component estimate</span>
        <strong>${formatCurrency(overallComponentSummary.normal, 0)}</strong>
      </article>
      <article>
        <span>P90 component estimate</span>
        <strong>${formatCurrency(overallComponentSummary.p90, 0)}</strong>
      </article>
    </div>
    <p class="audit-note">
      Component estimate basis: approved group method x quantity. WN/SO/Blind flanges use flange-weight-3-input-model-v2 JSON weight x raw material rate x P50 base multiplier. Metric stud sets use calculated stud-and-two-heavy-hex-nut mass x raw material rate x commercial factor 2.50.
      Generic low-confidence rows should be validated with supplier quotation.
    </p>
  `;

  elements.bomGroupTables.innerHTML = summaryHtml + groupBomItems(bomGroupItems)
    .map(
      ([groupName, groupItems]) => {
        const groupSummary = getComponentCostSummary(groupItems);
        const isBoltGroup = /bolt/i.test(groupName);
        return `
        <article class="bom-group-card">
          <div class="bom-group-title">
            <h4 class="${getBomGroupHeadingClass(groupName)}">${escapeHtml(groupName)}</h4>
            <p>${groupItems.length} ${groupItems.length === 1 ? "item" : "items"} | ${formatCurrency(
              groupSummary.normal,
              0
            )} normal | ${formatCurrency(groupSummary.p90, 0)} P90</p>
          </div>
          <div class="table-wrap">
            <table class="bom-group-table${isBoltGroup ? " bolt-group-table" : ""}">
              <colgroup>
                <col class="bom-col-item" />
                <col class="bom-col-size" />
                <col class="bom-col-rating" />
                <col class="bom-col-material" />
                <col class="bom-col-category" />
                <col class="bom-col-qty" />
                <col class="bom-col-uom" />
                ${isBoltGroup ? '<col class="bom-col-set-weight" />' : ""}
                <col class="bom-col-factor" />
                <col class="bom-col-unit-rate" />
                <col class="bom-col-total" />
                <col class="bom-col-total" />
                <col class="bom-col-source" />
              </colgroup>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Size</th>
                  <th>Sch/Thk/Rating</th>
                  <th class="text-column">Material</th>
                  <th class="text-column">Material Category</th>
                  <th>Qty.</th>
                  <th>UOM</th>
                  ${isBoltGroup ? "<th>Set wt (kg)</th>" : ""}
                  <th>Factor</th>
                  <th>Unit Rs</th>
                  <th>Normal Total</th>
                  <th>P90 Total</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                ${groupItems
                  .map((item) => {
                    const cost = item.componentCost || {};
                    const needsReview = !hasComponentUnitPrice(cost) || !hasComponentTotals(cost);
                    return `
                      <tr class="${needsReview ? "review-row" : ""}">
                        <td data-label="Item">${escapeHtml(item.item)}</td>
                        <td data-label="Size">${escapeHtml(item.size || "-")}</td>
                        <td data-label="Sch/Thk/Rating">${escapeHtml(item.thickness || "-")}</td>
                        <td class="text-column" data-label="Material">${escapeHtml(item.material || "-")}</td>
                        <td class="text-column" data-label="Material Category">${escapeHtml(
                          formatCategoryHeading(item.materialCategory || "Unclassified")
                        )}</td>
                        <td data-label="Qty.">${escapeHtml(item.quantity || "-")}</td>
                        <td data-label="UOM">${escapeHtml(item.uom || "-")}</td>
                        ${
                          isBoltGroup
                            ? `<td data-label="Set wt (kg)">${
                                Number.isFinite(cost.setMassKg) ? formatNumber(cost.setMassKg, 3) : "-"
                              }</td>`
                            : ""
                        }
                        <td data-label="Factor">${
                          Number.isFinite(cost.factor) ? formatNumber(cost.factor, 2) : "-"
                        }${
                          cost.isGenericFallback
                            ? '<span class="fallback-pill">Generic fallback</span>'
                            : ""
                        }</td>
                        <td data-label="Unit Rs">${hasComponentUnitPrice(cost) ? formatCurrency(cost.medianUnitRate, 0) : "Review"}</td>
                        <td data-label="Normal Total">${hasComponentTotals(cost) ? formatCurrency(cost.medianTotal, 0) : "Review"}</td>
                        <td data-label="P90 Total">${hasComponentTotals(cost) ? formatCurrency(cost.p90Total, 0) : "Review"}</td>
                        <td data-label="Source">${escapeHtml(item.sourceName || "-")}</td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        </article>
      `;
      }
    )
    .join("");
}

function getSummary(items) {
  return items.reduce(
    (total, item) => ({
      weight: total.weight + item.totalWeight,
      median: total.median + item.medianTotal,
      p90: total.p90 + item.p90Total,
    }),
    { weight: 0, median: 0, p90: 0 }
  );
}

function getCategoryAverageRsKg(summary) {
  return summary.weight > 0 ? summary.median / summary.weight : 0;
}

function getCategoryAverageRawRsKg(items) {
  return getWeightedAverage(items, (item) => item.rawSteel);
}

function getWeightedAverage(items, valueGetter, weightGetter = (item) => item.totalWeight) {
  const totalWeight = items.reduce((sum, item) => sum + (Number(weightGetter(item)) || 0), 0);
  if (totalWeight <= 0) return 0;

  return (
    items.reduce(
      (sum, item) => sum + (Number(valueGetter(item)) || 0) * (Number(weightGetter(item)) || 0),
      0
    ) / totalWeight
  );
}

function getPipeScenarioTotals(items, options = {}) {
  const rawMultiplier = options.rawMultiplier ?? 1;
  const factorMultiplier = options.factorMultiplier ?? 1;
  const coatingOverride = options.coatingOverride;

  return items.reduce(
    (total, item) => {
      const baseFactor = coatingOverride ? getFactor(coatingOverride) : item.factors;
      const medianFactor = baseFactor.median * factorMultiplier;
      const p90Factor = baseFactor.p90 * factorMultiplier;
      const rawSteel = item.rawSteel * rawMultiplier;
      const medianRsKg = rawSteel * medianFactor;
      const p90RsKg = rawSteel * p90Factor;
      const medianTotal = medianRsKg * item.weightKgm * item.length;
      const p90Total = p90RsKg * item.weightKgm * item.length;

      return {
        rawSteel: total.rawSteel + rawSteel * item.totalWeight,
        factorWeight: total.factorWeight + item.totalWeight,
        medianFactor: total.medianFactor + medianFactor * item.totalWeight,
        p90Factor: total.p90Factor + p90Factor * item.totalWeight,
        median: total.median + medianTotal,
        p90: total.p90 + p90Total,
      };
    },
    { rawSteel: 0, factorWeight: 0, medianFactor: 0, p90Factor: 0, median: 0, p90: 0 }
  );
}

function getComponentScenarioTotals(items, options = {}) {
  const rawMultiplier = options.rawMultiplier ?? 1;
  const factorMultiplier = options.factorMultiplier ?? 1;
  return items.reduce(
    (total, item) => {
      const cost = item.componentCost || {};
      if (!hasComponentTotals(cost)) return total;
      const baseNormal = Number(cost.medianTotal) || 0;
      const baseP90 = Number(cost.p90Total) || 0;
      const rawSteel = Number(cost.rawSteel) || 0;
      const componentFactor = Number(cost.factor ?? cost.componentFactor) || 0;
      const scale = rawMultiplier * factorMultiplier;
      return {
        median: total.median + baseNormal * scale,
        p90: total.p90 + baseP90 * scale,
        rawSteelTotal: total.rawSteelTotal + rawSteel * baseNormal * scale,
        factorTotal: total.factorTotal + componentFactor * baseNormal * scale,
        basisWeight: total.basisWeight + baseNormal * scale,
      };
    },
    { median: 0, p90: 0, rawSteelTotal: 0, factorTotal: 0, basisWeight: 0 }
  );
}

function getWhatIfScopeData() {
  const scope = elements.whatIfScope?.value || "complete";
  const pipeItems = lineItems.length > 0
    ? lineItems
    : bomGroupItems.length > 0
      ? []
      : (() => {
          const currentEstimate = getCurrentEstimate();
          return currentEstimate.error ? [] : [currentEstimate];
        })();
  const componentItems = bomGroupItems.filter(
    (item) => item.group !== "Pipe Group" && hasComponentTotals(item.componentCost || {})
  );
  return { scope, pipeItems, componentItems };
}

function getCombinedRawSteel(pipeTotals, componentTotals) {
  const pipeRaw = pipeTotals.factorWeight > 0 ? pipeTotals.rawSteel / pipeTotals.factorWeight : NaN;
  const componentRaw = componentTotals.basisWeight > 0
    ? componentTotals.rawSteelTotal / componentTotals.basisWeight
    : NaN;
  const pipeCost = pipeTotals.median || 0;
  const componentCost = componentTotals.median || 0;
  const totalCost = pipeCost + componentCost;
  if (totalCost <= 0) return NaN;
  return (
    (Number.isFinite(pipeRaw) ? pipeRaw * pipeCost : 0) +
    (Number.isFinite(componentRaw) ? componentRaw * componentCost : 0)
  ) / totalCost;
}

function updateWhatIfScopeControls(data = getWhatIfScopeData()) {
  const pipeAvailable = data.scope !== "components" && data.pipeItems.length > 0;
  const componentAvailable = data.scope !== "pipe" && data.componentItems.length > 0;
  const availability = {
    "Raw Material": pipeAvailable || componentAvailable,
    "Pipe Factor": pipeAvailable,
    "Component Factor": componentAvailable,
    Coating: pipeAvailable,
  };
  elements.whatIfToggles.forEach((toggle) => {
    const available = Boolean(availability[toggle.value]);
    toggle.disabled = !available;
    toggle.closest("label")?.classList.toggle("is-disabled", !available);
  });

  const isCaseSelected = (caseName) =>
    Array.from(elements.whatIfToggles).some(
      (toggle) => toggle.value === caseName && toggle.checked && !toggle.disabled
    );

  const setSliderAvailability = (slider, panel, available) => {
    slider.disabled = !available;
    panel.classList.toggle("is-disabled", !available);
  };
  setSliderAvailability(
    elements.rawSteelSlider,
    elements.rawMaterialSliderPanel,
    availability["Raw Material"] && isCaseSelected("Raw Material")
  );
  setSliderAvailability(
    elements.pipeFactorSlider,
    elements.pipeFactorSliderPanel,
    pipeAvailable && isCaseSelected("Pipe Factor")
  );
  setSliderAvailability(
    elements.componentFactorSlider,
    elements.componentFactorSliderPanel,
    componentAvailable && isCaseSelected("Component Factor")
  );

  const scopeNotes = {
    pipe: "Pipe values only. Raw material, pipe factor, and coating scenarios apply.",
    components: "Recognised non-pipe components only. Raw material and component-factor scenarios apply.",
    complete: "Pipes and recognised non-pipe components are included. Coating scenarios affect pipe values only.",
  };
  elements.whatIfScopeNote.textContent = scopeNotes[data.scope];
}

function getWhatIfScenarios(data = getWhatIfScopeData()) {
  const includePipes = data.scope !== "components";
  const includeComponents = data.scope !== "pipe";
  const hasPipes = includePipes && data.pipeItems.length > 0;
  const hasComponents = includeComponents && data.componentItems.length > 0;
  if (!hasPipes && !hasComponents) return [];

  const currentPipeCoating = data.pipeItems.filter((item) => item.coating === "Yes").length > data.pipeItems.length / 2
    ? "Yes"
    : "No";
  const manualRawChange = Number(elements.rawSteelSlider.value) || 0;
  const manualPipeFactorChange = Number(elements.pipeFactorSlider.value) || 0;
  const manualComponentFactorChange = Number(elements.componentFactorSlider.value) || 0;
  const scenarioInputs = [{ name: "Base case", type: "Base" }];
  const manualInputs = [];
  const addPercentageCases = (name, type, optionKey) => {
    [-20, -10, 10, 20].forEach((change) => {
      scenarioInputs.push({
        name: `${name} ${formatPercentChange(change)}`,
        type,
        [optionKey]: 1 + change / 100,
      });
    });
  };
  if (hasPipes || hasComponents) addPercentageCases("Raw material", "Raw Material", "rawMultiplier");
  if (hasPipes) addPercentageCases("Pipe factor", "Pipe Factor", "pipeFactorMultiplier");
  if (hasComponents) addPercentageCases("Component factor", "Component Factor", "componentFactorMultiplier");
  if (hasPipes) {
    scenarioInputs.push(
      { name: "Coating No", type: "Coating", coatingOverride: "No" },
      { name: "Coating Yes", type: "Coating", coatingOverride: "Yes" }
    );
  }
  if (manualRawChange !== 0 && (hasPipes || hasComponents)) {
    manualInputs.push({
      name: `Manual raw material ${formatPercentChange(manualRawChange)}`,
      type: "Raw Material",
      rawMultiplier: 1 + manualRawChange / 100,
    });
  }
  if (manualPipeFactorChange !== 0 && hasPipes) {
    manualInputs.push({
      name: `Manual pipe factor ${formatPercentChange(manualPipeFactorChange)}`,
      type: "Pipe Factor",
      pipeFactorMultiplier: 1 + manualPipeFactorChange / 100,
    });
  }
  if (manualComponentFactorChange !== 0 && hasComponents) {
    manualInputs.push({
      name: `Manual component factor ${formatPercentChange(manualComponentFactorChange)}`,
      type: "Component Factor",
      componentFactorMultiplier: 1 + manualComponentFactorChange / 100,
    });
  }
  scenarioInputs.splice(1, 0, ...manualInputs);

  const buildScenario = (input) => {
    const rawMultiplier = input.rawMultiplier ?? 1;
    const pipeTotals = hasPipes
      ? getPipeScenarioTotals(data.pipeItems, {
          rawMultiplier,
          factorMultiplier: input.pipeFactorMultiplier ?? 1,
          coatingOverride: input.coatingOverride,
        })
      : { median: 0, p90: 0, rawSteel: 0, factorWeight: 0, medianFactor: 0, p90Factor: 0 };
    const componentTotals = hasComponents
      ? getComponentScenarioTotals(data.componentItems, {
          rawMultiplier,
          factorMultiplier: input.componentFactorMultiplier ?? 1,
        })
      : { median: 0, p90: 0, rawSteelTotal: 0, factorTotal: 0, basisWeight: 0 };
    const median = pipeTotals.median + componentTotals.median;
    const p90 = pipeTotals.p90 + componentTotals.p90;
    return {
      ...input,
      rawSteel: getCombinedRawSteel(pipeTotals, componentTotals),
      pipeFactor: pipeTotals.factorWeight > 0 ? pipeTotals.medianFactor / pipeTotals.factorWeight : NaN,
      componentFactor: componentTotals.basisWeight > 0 ? componentTotals.factorTotal / componentTotals.basisWeight : NaN,
      coating: hasPipes ? (input.coatingOverride ? `Pipe: ${input.coatingOverride}` : `Pipe: Current (${currentPipeCoating})`) : "Not applicable",
      median,
      p90,
    };
  };

  const base = buildScenario(scenarioInputs[0]);
  return scenarioInputs.map((input) => {
    const scenario = input.type === "Base" ? base : buildScenario(input);
    return {
      ...scenario,
      change: base.median > 0 ? (scenario.median / base.median - 1) * 100 : 0,
    };
  });
}

function getSelectedWhatIfTypes() {
  return new Set(
    Array.from(elements.whatIfToggles)
      .filter((toggle) => toggle.checked && !toggle.disabled)
      .map((toggle) => toggle.value)
  );
}

function filterWhatIfScenarios(scenarios) {
  const selectedTypes = getSelectedWhatIfTypes();
  return scenarios.filter(
    (scenario) => scenario.type === "Base" || selectedTypes.has(scenario.type)
  );
}

function getWhatIfSortValue(scenario, key) {
  if (key === "name" || key === "coating") return String(scenario[key] || "").toLowerCase();
  return Number(scenario[key]);
}

function sortWhatIfScenarios(scenarios) {
  const pinnedScenarios = scenarios.filter(
    (scenario) => scenario.type === "Base" || scenario.name.startsWith("Manual ")
  );
  const sortableScenarios = scenarios.filter(
    (scenario) => scenario.type !== "Base" && !scenario.name.startsWith("Manual ")
  );

  if (!whatIfSortState.key) return [...pinnedScenarios, ...sortableScenarios];

  const direction = whatIfSortState.direction === "asc" ? 1 : -1;
  const sortedScenarios = [...sortableScenarios].sort((a, b) => {
    const valueA = getWhatIfSortValue(a, whatIfSortState.key);
    const valueB = getWhatIfSortValue(b, whatIfSortState.key);

    if (typeof valueA === "string" || typeof valueB === "string") {
      return String(valueA).localeCompare(String(valueB)) * direction;
    }

    return ((Number(valueA) || 0) - (Number(valueB) || 0)) * direction;
  });

  return [...pinnedScenarios, ...sortedScenarios];
}

function updateWhatIfSortButtons() {
  elements.whatIfSortButtons.forEach((button) => {
    const isActive = button.dataset.sort === whatIfSortState.key;
    const icon = button.querySelector("span");
    button.setAttribute("aria-sort", isActive ? whatIfSortState.direction : "none");
    if (icon) icon.textContent = isActive ? (whatIfSortState.direction === "asc" ? "↑" : "↓") : "↕";
  });
}

function handleWhatIfSort(event) {
  const button = event.target.closest(".whatif-sort-button");
  if (!button) return;

  const key = button.dataset.sort;
  if (whatIfSortState.key === key) {
    whatIfSortState.direction = whatIfSortState.direction === "asc" ? "desc" : "asc";
  } else {
    whatIfSortState = { key, direction: "asc" };
  }

  renderWhatIfAnalysis();
}

function updateRawSteelSliderDisplay(data = getWhatIfScopeData()) {
  const change = Number(elements.rawSteelSlider.value) || 0;
  const baseRawSteel = getWhatIfScenarios(data).find((scenario) => scenario.type === "Base")?.rawSteel;
  const adjustedRawSteel = baseRawSteel * (1 + change / 100);
  const sliderTone = change < 0 ? "negative" : change > 0 ? "positive" : "base";
  const sliderMin = Number(elements.rawSteelSlider.min) || -30;
  const sliderMax = Number(elements.rawSteelSlider.max) || 30;
  const sliderPosition = ((change - sliderMin) / (sliderMax - sliderMin)) * 100;
  const thumbOffset = 16 - 28 * (sliderPosition / 100);

  elements.rawSteelSliderValue.textContent = formatPercentChange(change);
  elements.rawSteelSliderValue.dataset.tone = sliderTone;
  elements.rawSteelSliderRate.dataset.tone = sliderTone;
  elements.rawSteelSlider.dataset.tone = sliderTone;
  elements.rawSteelSliderThumb.dataset.tone = sliderTone;
  elements.rawSteelSliderProgress.dataset.tone = sliderTone;
  elements.rawSteelSliderThumb.style.left = `calc(${sliderPosition}% + ${thumbOffset}px)`;
  elements.rawSteelSliderProgress.style.width = `${sliderPosition}%`;

  if (!Number.isFinite(baseRawSteel) || baseRawSteel <= 0) {
    elements.rawSteelSliderRate.textContent = "-";
    elements.rawSteelSliderBase.textContent = "Base value: -";
    return;
  }

  elements.rawSteelSliderRate.textContent = `${formatCurrency(adjustedRawSteel, 2)}/kg`;
  elements.rawSteelSliderBase.textContent = `Base value: ${formatCurrency(baseRawSteel, 2)}/kg`;
}

function handleRawSteelSlider() {
  renderWhatIfAnalysis();
}

function updateFactorSliderDisplay({ slider, value, rate, base, thumb, progress, baseFactor }) {
  const change = Number(slider.value) || 0;
  const sliderTone = change < 0 ? "negative" : change > 0 ? "positive" : "base";
  const sliderMin = Number(slider.min) || -30;
  const sliderMax = Number(slider.max) || 30;
  const sliderPosition = ((change - sliderMin) / (sliderMax - sliderMin)) * 100;
  const thumbOffset = 16 - 28 * (sliderPosition / 100);

  value.textContent = formatPercentChange(change);
  value.dataset.tone = sliderTone;
  rate.dataset.tone = sliderTone;
  slider.dataset.tone = sliderTone;
  thumb.dataset.tone = sliderTone;
  progress.dataset.tone = sliderTone;
  thumb.style.left = `calc(${sliderPosition}% + ${thumbOffset}px)`;
  progress.style.width = `${sliderPosition}%`;

  if (!Number.isFinite(baseFactor) || baseFactor <= 0) {
    rate.textContent = "-";
    base.textContent = "Base value: -";
    return;
  }

  rate.textContent = formatNumber(baseFactor * (1 + change / 100), 2);
  base.textContent = `Base value: ${formatNumber(baseFactor, 2)}`;
}

function updateFactorSliderDisplays(data = getWhatIfScopeData()) {
  const baseScenario = getWhatIfScenarios(data).find((scenario) => scenario.type === "Base");
  updateFactorSliderDisplay({
    slider: elements.pipeFactorSlider,
    value: elements.pipeFactorSliderValue,
    rate: elements.pipeFactorSliderRate,
    base: elements.pipeFactorSliderBase,
    thumb: elements.pipeFactorSliderThumb,
    progress: elements.pipeFactorSliderProgress,
    baseFactor: baseScenario?.pipeFactor,
  });
  updateFactorSliderDisplay({
    slider: elements.componentFactorSlider,
    value: elements.componentFactorSliderValue,
    rate: elements.componentFactorSliderRate,
    base: elements.componentFactorSliderBase,
    thumb: elements.componentFactorSliderThumb,
    progress: elements.componentFactorSliderProgress,
    baseFactor: baseScenario?.componentFactor,
  });
}

function handleFactorSlider() {
  renderWhatIfAnalysis();
}

function renderWhatIfAnalysis() {
  const data = getWhatIfScopeData();
  updateWhatIfScopeControls(data);
  updateRawSteelSliderDisplay(data);
  updateFactorSliderDisplays(data);
  const scenarios = filterWhatIfScenarios(getWhatIfScenarios(data));
  updateWhatIfSortButtons();

  if (!scenarios.length) {
    elements.whatIfBase.textContent = "-";
    elements.whatIfLow.textContent = "-";
    elements.whatIfHigh.textContent = "-";
    elements.whatIfRange.textContent = "-";
    elements.whatIfDriver.textContent = "-";
    elements.whatIfChart.innerHTML = `<p class="empty-note">Add pipe lines or recognised piping components to view scenarios for the selected scope.</p>`;
    elements.whatIfBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="8">No scenarios are available for the selected scope.</td>
      </tr>
    `;
    return;
  }

  const base = scenarios[0];
  const sortedByValue = [...scenarios].sort((a, b) => a.median - b.median);
  const low = sortedByValue[0];
  const high = sortedByValue[sortedByValue.length - 1];
  const biggest =
    high.type !== "Base"
      ? high
      : scenarios
          .filter((scenario) => scenario.type !== "Base")
          .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))[0];
  const maxMedian = Math.max(...scenarios.map((scenario) => scenario.median), 1);
  const displayScenarios = sortWhatIfScenarios(scenarios);
  const chartScenarios = displayScenarios.filter((scenario) => scenario.type !== "Base");
  const getScenarioClass = (scenario) => {
    const classes = [];
    if (scenario === base || scenario.name === base.name) classes.push("scenario-base");
    else if (scenario === low || scenario.name === low.name) classes.push("scenario-low");
    else if (scenario === high || scenario.name === high.name) classes.push("scenario-high");
    else classes.push("scenario-standard");

    return classes.join(" ");
  };

  elements.whatIfBase.textContent = formatCurrency(base.median, 0);
  elements.whatIfLow.textContent = formatCurrency(low.median, 0);
  elements.whatIfHigh.textContent = formatCurrency(high.median, 0);
  elements.whatIfRange.textContent = formatCurrency(high.median - low.median, 0);
  elements.whatIfDriver.textContent = biggest ? biggest.type : "-";

  const scenarioBars = chartScenarios
    .map(
      (scenario) => `
        <div class="scenario-bar ${getScenarioClass(scenario)}">
          <span>${scenario.name}</span>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${Math.max((scenario.median / maxMedian) * 100, 4)}%"></div>
          </div>
          <strong>${formatCurrency(scenario.median, 0)}</strong>
        </div>
      `
    )
    .join("") || `<p class="empty-note">Select one or more cases to compare with the base estimate.</p>`;

  elements.whatIfChart.innerHTML = `
    <div class="scenario-chart-heading">
      <strong>Scenario Impact vs Base</strong>
      <span>Base = ${formatCurrency(base.median, 2)}</span>
    </div>
    ${scenarioBars}
  `;

  elements.whatIfBody.innerHTML = displayScenarios
    .map(
      (scenario) => `
        <tr class="${getScenarioClass(scenario)}">
          <td data-label="Scenario">${scenario.name}</td>
          <td data-label="Raw material">${formatCurrency(scenario.rawSteel, 2)}</td>
          <td data-label="Pipe factor">${formatNumber(scenario.pipeFactor, 2)}</td>
          <td data-label="Component factor">${formatNumber(scenario.componentFactor, 2)}</td>
          <td data-label="Coating">${scenario.coating}</td>
          <td data-label="Normal total">${formatCurrency(scenario.median, 0)}</td>
          <td data-label="P90 total">${formatCurrency(scenario.p90, 0)}</td>
          <td data-label="Change vs base">${scenario.change >= 0 ? "+" : ""}${formatNumber(scenario.change, 1)}%</td>
        </tr>
      `
    )
    .join("");
}

function getReportItems() {
  const currentEstimate = getCurrentEstimate();
  if (lineItems.length > 0) return lineItems;
  return currentEstimate.error ? [] : [currentEstimate];
}

function getSortValue(item, key) {
  if (key === "medianFactor") return item.factors.median;
  if (key === "spec" || key === "coating") return String(item[key] || "").toLowerCase();
  return Number(item[key]);
}

function applySort() {
  if (!sortState.key) return;

  const direction = sortState.direction === "asc" ? 1 : -1;
  lineItems.sort((a, b) => {
    const valueA = getSortValue(a, sortState.key);
    const valueB = getSortValue(b, sortState.key);

    if (typeof valueA === "string" || typeof valueB === "string") {
      return String(valueA).localeCompare(String(valueB)) * direction;
    }

    return ((Number(valueA) || 0) - (Number(valueB) || 0)) * direction;
  });
}

function updateSortButtons() {
  elements.sortButtons.forEach((button) => {
    const isActive = button.dataset.sort === sortState.key;
    const icon = button.querySelector("span");
    button.setAttribute("aria-sort", isActive ? sortState.direction : "none");
    if (icon) icon.textContent = isActive ? (sortState.direction === "asc" ? "↑" : "↓") : "↕";
  });
}

function handleSort(event) {
  const button = event.target.closest(".sort-button");
  if (!button) return;

  const key = button.dataset.sort;
  if (sortState.key === key) {
    sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
  } else {
    sortState = { key, direction: "asc" };
  }

  applySort();
  renderLineItems();
}

function addCurrentLine() {
  if (hasIncompleteNonCarbonSteelSelection()) {
    const message = "Please select Pipe Material Standard before adding non-carbon-steel pipe.";
    elements.warning.textContent = message;
    elements.materialGradeFamily.focus();
    window.alert(message);
    return;
  }

  const estimate = calculate();
  if (!estimate) return;

  estimate.source = "manual";
  lineItems.push(estimate);
  renderLineItems();
  updateReportGenerated();
  showSuccessMessage(`${formatPipeSize(estimate.size)} IN pipe line added to multi size estimate.`);
}

function removeLine(id) {
  const index = lineItems.findIndex((item) => item.id === id);
  if (index >= 0) lineItems.splice(index, 1);
  renderLineItems();
  if (lineItems.length === 0) {
    clearReportGenerated();
  } else {
    updateReportGenerated();
  }
}

function normalizeHeader(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function findBomColumn(headers, aliases) {
  const normalizedHeaders = headers.map((header) => ({
    original: header,
    normalized: normalizeHeader(header),
  }));

  for (const alias of aliases) {
    const match = normalizedHeaders.find(
      (header) => header.normalized === normalizeHeader(alias)
    );
    if (match) return match.original;
  }

  return undefined;
}

function parseBomNumber(value) {
  if (typeof value === "number") return value;
  const text = String(value || "").replace(/,/g, "");
  const match = text.match(/-?(?:\d+\.?\d*|\.\d+)/);
  return match ? Number(match[0]) : NaN;
}

function getNearestPipeSizeFromMm(mmValue) {
  const diameter = Number(mmValue);
  if (!Number.isFinite(diameter) || diameter <= 0) return NaN;

  return Object.entries(odTable)
    .map(([size, od]) => ({ size: Number(size), difference: Math.abs(Number(od) - diameter) }))
    .sort((a, b) => a.difference - b.difference || b.size - a.size)[0]?.size ?? NaN;
}

function parseMetricFastenerSize(value) {
  const designation = parseMetricStudDesignation(value);
  if (designation) return getNearestPipeSizeFromMm(designation.diameterMm);

  const text = String(value || "").toUpperCase().replace(/\s+/g, "");
  const diameterOnlyMatch = text.match(/\bM(\d+(?:\.\d+)?)\b/);
  return diameterOnlyMatch ? getNearestPipeSizeFromMm(Number(diameterOnlyMatch[1])) : NaN;
}

function parseComponentSize(value, group = "") {
  if (group === "Bolt Group") {
    const metricFastenerSize = parseMetricFastenerSize(value);
    if (Number.isFinite(metricFastenerSize)) return metricFastenerSize;
  }

  return parseBomSize(value);
}

function parseBomSize(value) {
  if (typeof value === "number" && odTable[value]) return value;

  const text = String(value || "")
    .toUpperCase()
    .replace(/\u00C2?\u00BD/g, " 1/2")
    .replace(/\u00C2?\u00BE/g, " 3/4")
    .replace(/\u00C2?\u00BC/g, " 1/4");
  const dottedFractionMatch = text.match(/\b(\d+)\.(\d+)\s*\/\s*(\d+)\b/);
  if (dottedFractionMatch) {
    const fractionSize =
      Number(dottedFractionMatch[1]) +
      Number(dottedFractionMatch[2]) / Number(dottedFractionMatch[3]);
    return odTable[fractionSize] ? fractionSize : NaN;
  }

  const wholeFractionMatch = text.match(/\b(\d+)\s+(\d+)\s*\/\s*(\d+)\b/);
  if (wholeFractionMatch) {
    const fractionSize =
      Number(wholeFractionMatch[1]) +
      Number(wholeFractionMatch[2]) / Number(wholeFractionMatch[3]);
    return odTable[fractionSize] ? fractionSize : NaN;
  }

  // Preserve leading-decimal pipe sizes such as .5" and .75". Without this
  // check, the generic numeric pattern can incorrectly read .5" as 5".
  const leadingDecimalMatch = text.match(/(?:^|[^0-9])(\.\d+)(?=\s*(?:["']|IN\b|INCH\b|$))/);
  if (leadingDecimalMatch) {
    const decimalSize = Number(leadingDecimalMatch[1]);
    return odTable[decimalSize] ? decimalSize : NaN;
  }

  const fractionMatch = text.match(/\b(\d+)\s*\/\s*(\d+)\b/);
  if (fractionMatch) {
    const fractionSize = Number(fractionMatch[1]) / Number(fractionMatch[2]);
    return odTable[fractionSize] ? fractionSize : NaN;
  }

  const dnMatch = text.match(/\bDN\s*(\d+(\.\d+)?)/);
  if (dnMatch) {
    const dnValue = Number(dnMatch[1]);
    return dnToNps[dnValue] || Math.round((dnValue / 25) * 2) / 2;
  }

  const npsMatch = text.match(/\b(NPS|NB|IN|INCH|INCHES)?\s*(\d+(\.\d+)?|\.\d+)/);
  const npsSize = npsMatch ? Number(npsMatch[2]) : NaN;
  if (odTable[npsSize]) return npsSize;

  const parsedSize = parseBomNumber(value);
  return odTable[parsedSize] ? parsedSize : NaN;
}

function parseBomCoating(value, fallback = "No") {
  const text = String(value || "").toLowerCase();
  if (!text.trim()) return fallback === "Yes" ? "Yes" : "No";
  if (/\b(no|bare|uncoated|none|na|n\/a)\b/.test(text)) return "No";
  if (/\b(yes|coated|coat|pe|polyethylene|epoxy|lined|lining|fbe)\b/.test(text)) return "Yes";
  return fallback === "Yes" ? "Yes" : "No";
}

function isMeterUom(value) {
  const text = normalizeHeader(value);
  if (!text) return false;
  return ["m", "meter", "metre", "meters", "metres"].includes(text);
}

function isPipeItem(value) {
  const text = String(value || "").toLowerCase();
  if (!text.trim()) return true;
  const looksLikePipe = /\bpipe\b|pipes|piping/.test(text);
  const looksLikeFitting =
    /\belbow\b|\btee\b|\bflange\b|\bvalve\b|\bgasket\b|\breducer\b|\bcap\b|\bbend\b/.test(text);
  return looksLikePipe && !looksLikeFitting;
}

function worksheetToBomRows(sheet) {
  const matrix = globalThis.XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  let bestHeaderIndex = -1;
  let bestScore = 0;

  matrix.forEach((row, rowIndex) => {
    const headers = row.map((cell) => String(cell || ""));
    const score = [
      findBomColumn(headers, bomColumnAliases.size),
      findBomColumn(headers, bomColumnAliases.thickness),
      findBomColumn(headers, bomColumnAliases.length),
    ].filter(Boolean).length;

    if (score > bestScore) {
      bestScore = score;
      bestHeaderIndex = rowIndex;
    }
  });

  if (bestHeaderIndex < 0 || bestScore < 3) {
    return [];
  }

  const rawHeaders = matrix[bestHeaderIndex].map((header, index) => {
    const cleanHeader = String(header || "").trim();
    return cleanHeader || `Column ${index + 1}`;
  });

  return matrix
    .slice(bestHeaderIndex + 1)
    .map((row) =>
      rawHeaders.reduce((record, header, index) => {
        record[header] = row[index] ?? "";
        return record;
      }, {})
    )
    .filter((row) =>
      Object.values(row).some((value) => String(value || "").trim() !== "")
    );
}

function cleanBomContextValue(value) {
  return String(value || "")
    .replace(/^[\s:：\-–—]+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractValueBesideLabel(matrix, rowIndex, columnIndex) {
  const row = matrix[rowIndex] || [];
  for (let index = columnIndex + 1; index < row.length; index += 1) {
    const value = cleanBomContextValue(row[index]);
    if (value) return value;
  }

  for (let index = rowIndex + 1; index < Math.min(matrix.length, rowIndex + 4); index += 1) {
    const value = cleanBomContextValue(matrix[index]?.[columnIndex]);
    if (value) return value;
  }

  return "";
}

function extractBomProjectContext(workbook, fileName = "") {
  const context = {
    projectNumber: "",
    projectDescription: "",
  };

  const projectNumberFromFile = String(fileName || "").match(/MOC[-_\s]*(\d{4})[-_\s]*([A-Z0-9]+)[-_\s]*([A-Z0-9]+)[-_\s]*V?(\d+)[-_\s]*(\d+)/i);
  const fallbackProjectNumber = projectNumberFromFile
    ? `MOC/${projectNumberFromFile[1]}/${projectNumberFromFile[2]}-${projectNumberFromFile[3]}/V${projectNumberFromFile[4]}/${projectNumberFromFile[5]}`
    : "";

  for (const sheetName of workbook.SheetNames || []) {
    const sheet = workbook.Sheets[sheetName];
    const matrix = globalThis.XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
      blankrows: false,
    });
    const scanRows = matrix.slice(0, 45);

    for (let rowIndex = 0; rowIndex < scanRows.length; rowIndex += 1) {
      const row = scanRows[rowIndex] || [];
      for (let columnIndex = 0; columnIndex < row.length; columnIndex += 1) {
        const text = cleanBomContextValue(row[columnIndex]);
        if (!text) continue;

        if (!context.projectNumber) {
          const projectNumberMatch = text.match(/\b(?:project|moc|job)\s*(?:no|number)\.?\s*[:：\-–—]*\s*(.+)$/i);
          if (projectNumberMatch) {
            context.projectNumber =
              cleanBomContextValue(projectNumberMatch[1]) || extractValueBesideLabel(scanRows, rowIndex, columnIndex);
          }
        }

        if (!context.projectDescription) {
          const descriptionMatch = text.match(/\b(?:project|job)\s*description\s*[:：\-–—]*\s*(.+)$/i);
          if (descriptionMatch) {
            context.projectDescription =
              cleanBomContextValue(descriptionMatch[1]) || extractValueBesideLabel(scanRows, rowIndex, columnIndex);
          }
        }

        if (context.projectNumber && context.projectDescription) return context;
      }
    }
  }

  if (!context.projectNumber && fallbackProjectNumber) context.projectNumber = fallbackProjectNumber;
  return context;
}

function applySingleBomProjectContext(context) {
  const projectNumber = cleanBomContextValue(context?.projectNumber);
  const projectDescription = cleanBomContextValue(context?.projectDescription);

  if (projectNumber) elements.projectNumber.value = projectNumber;
  if (projectDescription) elements.projectDescription.value = projectDescription;
}

function setBomStatus(message, type = "") {
  elements.bomStatus.textContent = message;
  elements.bomStatus.className = `bom-status${type ? ` ${type}` : ""}`;
}

function formatBomProcessingTime(elapsedMs) {
  const milliseconds = Number(elapsedMs);
  if (!Number.isFinite(milliseconds) || milliseconds < 0) return "";
  if (milliseconds < 1000) return "in less than 1 second";

  const seconds = Math.round((milliseconds / 1000) * 10) / 10;
  return `in ${seconds} ${seconds === 1 ? "second" : "seconds"}`;
}

function updateBomProgress(completed, total, fileName = "", state = "processing", elapsedMs = NaN) {
  if (!elements.bomProgress) return;

  const safeTotal = Math.max(Number(total) || 0, 1);
  const safeCompleted = Math.min(Math.max(Number(completed) || 0, 0), safeTotal);
  const percent = Math.round((safeCompleted / safeTotal) * 100);
  const isComplete = state === "complete";

  elements.bomProgress.hidden = false;
  elements.bomProgressRing.style.setProperty("--progress", `${percent}%`);
  elements.bomProgressRing.setAttribute("aria-valuenow", String(percent));
  elements.bomProgressCount.textContent = `${safeCompleted} / ${safeTotal}`;
  elements.bomProgressTitle.textContent = isComplete
    ? "BOM files processed"
    : `Reading file ${Math.min(safeCompleted + 1, safeTotal)} of ${safeTotal}`;
  elements.bomProgressDetail.textContent = isComplete
    ? `${safeTotal} selected ${safeTotal === 1 ? "file has" : "files have"} been processed ${formatBomProcessingTime(elapsedMs)}.`
    : fileName || "Preparing selected BOM files...";
  elements.bomProgressPercent.textContent = isComplete ? "100% complete" : `${percent}% complete`;
}

function importBomRows(rows, sourceName = "BOM", options = {}) {
  if (!rows.length) {
    setBomStatus("The uploaded BOM does not contain any readable rows.", "error");
    return { imported: 0, skipped: 0 };
  }

  const headers = Object.keys(rows[0]);
  const sizeColumn = findBomColumn(headers, bomColumnAliases.size);
  const thicknessColumn = findBomColumn(headers, bomColumnAliases.thickness);
  const lengthColumn = findBomColumn(headers, bomColumnAliases.length);
  const coatingColumn = findBomColumn(headers, bomColumnAliases.coating);
  const specColumn = findBomColumn(headers, bomColumnAliases.spec);
  const itemColumn = findBomColumn(headers, bomColumnAliases.item);
  const uomColumn = findBomColumn(headers, bomColumnAliases.uom);
  const rawColumn = findBomColumn(headers, bomColumnAliases.rawOverride);
  const factorColumn = findBomColumn(headers, bomColumnAliases.factorOverride);
  const sourceKey = options.replaceBatchKey || sourceName;

  const missing = [];
  if (!sizeColumn) missing.push("Size / NPS / DN");
  if (!thicknessColumn) missing.push("Thickness / THK");
  if (!lengthColumn) missing.push("Length / Qty");

  if (missing.length) {
    setBomStatus(`Missing required BOM column(s): ${missing.join(", ")}.`, "error");
    return { imported: 0, skipped: rows.length };
  }

  let imported = 0;
  let skipped = 0;

  if (options.replaceBatchKey) {
    for (let index = lineItems.length - 1; index >= 0; index -= 1) {
      if (
        lineItems[index].source === "bom" &&
        lineItems[index].sourceKey === options.replaceBatchKey
      ) {
        lineItems.splice(index, 1);
      }
    }
    for (let index = bomGroupItems.length - 1; index >= 0; index -= 1) {
      if (bomGroupItems[index].sourceKey === options.replaceBatchKey) {
        bomGroupItems.splice(index, 1);
      }
    }
  }

  rows.forEach((row) => {
    const groupItem = buildBomGroupItem(
      row,
      {
        item: itemColumn,
        size: sizeColumn,
        thickness: thicknessColumn,
        length: lengthColumn,
        uom: uomColumn,
        spec: specColumn,
      },
      sourceName,
      sourceKey
    );
    if (groupItem) bomGroupItems.push(groupItem);

    if (uomColumn && !isMeterUom(row[uomColumn])) {
      skipped += 1;
      return;
    }

    if (!uomColumn && itemColumn && !isPipeItem(row[itemColumn])) {
      skipped += 1;
      return;
    }

    const rowSize = parseBomSize(row[sizeColumn]);
    const rowThickness = parseBomThickness(row[thicknessColumn], rowSize, thicknessColumn);
    const rowSpec = specColumn ? row[specColumn] : elements.spec.value;
    const bomRawOverride = rawColumn ? parseBomNumber(row[rawColumn]) : NaN;
    const hasBomRawOverride = Number.isFinite(bomRawOverride) && bomRawOverride > 0;
    const rowRawPriceMapping = hasBomRawOverride
      ? null
      : getRawMaterialPriceMapping(rowSpec, elements.year.value);
    const rowRawOverride = hasBomRawOverride
      ? bomRawOverride
      : rowRawPriceMapping?.recommended || "";
    const estimate = buildEstimate({
      year: elements.year.value,
      size: rowSize,
      thickness: rowThickness,
      length: parseBomNumber(row[lengthColumn]),
      spec: rowSpec,
      coating: coatingColumn
        ? parseBomCoating(row[coatingColumn], elements.coating.value)
        : elements.coating.value,
      rawOverride: rowRawOverride,
      rawSteelSource: hasBomRawOverride
        ? "bomOverride"
        : rowRawPriceMapping
          ? "materialLibrary"
          : "defaultYear",
      rawBasisNote: hasBomRawOverride
        ? "BOM-entered Raw Steel Rs/kg"
        : rowRawPriceMapping?.note || "Default raw steel basis; no BOM material raw-price match",
      factorOverride: factorColumn ? parseBomNumber(row[factorColumn]) : "",
    });

    if (estimate.error) {
      skipped += 1;
      return;
    }

    estimate.source = "bom";
    estimate.sourceName = sourceName;
    estimate.sourceKey = sourceKey;
    lineItems.push(estimate);
    imported += 1;
  });

  renderLineItems();
  renderBomGroupReview();
  renderWhatIfAnalysis();
  if (imported > 0) {
    updateReportGenerated();
    showSuccessMessage(`${imported} BOM pipe ${imported === 1 ? "line" : "lines"} imported.`);
  }

  const mappedColumns = [
    `size: ${sizeColumn}`,
    `thickness: ${thicknessColumn}`,
    `length: ${lengthColumn}`,
    coatingColumn ? `coating: ${coatingColumn}` : "",
  ]
    .filter(Boolean)
    .join("; ");
  const statusType = imported > 0 ? "success" : "error";
  const skippedNote =
    skipped > 0 ? " Non-pipe rows, non-meter UoM rows, or invalid pipe data were skipped." : "";
  setBomStatus(
    `${sourceName}: imported ${imported} pipe line(s), skipped ${skipped}. Mapped columns: ${mappedColumns}.${skippedNote}`,
    statusType
  );

  return { imported, skipped };
}

window.importBomRows = importBomRows;

async function processBomFiles(files) {
  if (!files.length) return;

  if (!globalThis.XLSX) {
    setBomStatus(
      "Excel parser did not load. Check internet connection and reload the page.",
      "error"
    );
    return;
  }

  const processingStartedAt = globalThis.performance?.now?.() ?? Date.now();
  updateBomProgress(0, files.length, files[0]?.name || "");
  await new Promise((resolve) => window.requestAnimationFrame(resolve));

  await ensureFlangeWeightModelLoaded();

  const results = [];

  for (const [index, file] of files.entries()) {
    updateBomProgress(index, files.length, file.name);
    await new Promise((resolve) => window.requestAnimationFrame(resolve));
    try {
      const data = await file.arrayBuffer();
      const workbook = globalThis.XLSX.read(data, { type: "array" });
      const projectContext = files.length === 1 ? extractBomProjectContext(workbook, file.name) : null;
      if (projectContext) applySingleBomProjectContext(projectContext);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = worksheetToBomRows(sheet);
      const sourceKey = `${file.name}:${file.size}:${file.lastModified}`;
      const result = importBomRows(rows, file.name, { replaceBatchKey: sourceKey });
      results.push({
        file: file.name,
        ...result,
        projectContextApplied:
          Boolean(projectContext?.projectNumber) || Boolean(projectContext?.projectDescription),
      });
    } catch (error) {
      results.push({ file: file.name, imported: 0, skipped: 0, error: error.message });
    }

    updateBomProgress(index + 1, files.length, file.name);
    await new Promise((resolve) => window.requestAnimationFrame(resolve));
  }

  const imported = results.reduce((total, result) => total + result.imported, 0);
  const skipped = results.reduce((total, result) => total + result.skipped, 0);
  const failed = results.filter((result) => result.error);
  const fileSummary = results
    .map((result) =>
      result.error
        ? `${result.file}: failed`
        : `${result.file}: ${result.imported} imported, ${result.skipped} skipped${
            result.projectContextApplied ? ", project info extracted" : ""
          }`
    )
    .join(" | ");

  if (failed.length) {
    setBomStatus(
      `${files.length} file(s) processed with ${failed.length} error(s). ${fileSummary}`,
      imported > 0 ? "success" : "error"
    );
  } else {
    setBomStatus(
      `${files.length} file(s) processed. Total imported ${imported} pipe line(s), skipped ${skipped}. ${fileSummary}`,
      imported > 0 ? "success" : "error"
    );
  }

  const processingFinishedAt = globalThis.performance?.now?.() ?? Date.now();
  updateBomProgress(files.length, files.length, "", "complete", processingFinishedAt - processingStartedAt);

  elements.bomFile.value = "";
}

async function handleBomUpload(event) {
  await processBomFiles(Array.from(event.target.files || []));
}

function handleBomDrag(event) {
  event.preventDefault();
  elements.bomDropZone.classList.add("drag-over");
}

function handleBomDragLeave(event) {
  event.preventDefault();
  elements.bomDropZone.classList.remove("drag-over");
}

async function handleBomDrop(event) {
  event.preventDefault();
  elements.bomDropZone.classList.remove("drag-over");
  await processBomFiles(Array.from(event.dataTransfer?.files || []));
}

function showSuccessMessage(message) {
  window.clearTimeout(successTimer);
  elements.successMessage.textContent = message;
  successTimer = window.setTimeout(() => {
    elements.successMessage.textContent = "";
  }, 3000);
}

function clearSuccessMessage() {
  window.clearTimeout(successTimer);
  elements.successMessage.textContent = "";
}

function updateReportGenerated() {
  const generatedAt = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  elements.reportGenerated.textContent = `Report generated: ${generatedAt}`;
}

function clearReportGenerated() {
  elements.reportGenerated.textContent = "";
}

function highlightOverride(value) {
  return `<span class="override-value">${value}</span>`;
}

function getOverrideNotes(items = getReportItems(), useHtml = false) {
  const notes = [];

  items.forEach((item, index) => {
    const defaultFactors = getFactor(item.coating);
    const hasRawOverride = item.rawSteelBasis.includes("Override");
    const hasFactorOverride = item.factorBasis.includes("Override");
    const rawSteelValue = formatNumber(item.rawSteel, 2);
    const normalFactorValue = formatNumber(item.factors.median, 2);
    const p90Multiplier = defaultFactors.p90 / defaultFactors.median;

    if (!hasRawOverride && !hasFactorOverride) return;

    notes.push(
      `Line ${index + 1}: ${formatPipeSize(item.size)} IN; ${
        hasRawOverride
          ? `raw steel override Rs ${useHtml ? highlightOverride(rawSteelValue) : rawSteelValue} per kg; `
          : ""
      }${
        hasFactorOverride
          ? `normal factor override ${useHtml ? highlightOverride(normalFactorValue) : normalFactorValue}; P90 recalculated to ${
              useHtml ? highlightOverride(formatNumber(item.factors.p90, 2)) : formatNumber(item.factors.p90, 2)
            } using default multiplier ${formatNumber(p90Multiplier, 3)}; `
          : ""
      }default factor set ${formatNumber(defaultFactors.median, 2)} / ${formatNumber(defaultFactors.p90, 2)}.`
    );
  });

  return notes;
}

function updateOverrideReview() {
  const notes = getOverrideNotes(getReportItems(), true);
  elements.overrideReviewCard.hidden = notes.length === 0;
  elements.overrideReviewList.innerHTML = notes
    .map((note) => `<li>${note}</li>`)
    .join("");
}

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function buildCsvRows() {
  calculate();
  const items = getReportItems();
  const summary = getSummary(items);
  const overrideNotes = getOverrideNotes(items);
  const rows = [];

  rows.push(["Piping Cost Estimator - Audit Report"]);
  rows.push(["Estimate scope", "Material-only indicative estimate"]);
  rows.push([elements.reportGenerated.textContent]);
  rows.push(["Project / Job No.", elements.projectNumber?.value.trim() || "Not specified"]);
  rows.push(["Project / Job Description", elements.projectDescription?.value.trim() || "Not specified"]);
  rows.push([]);
  rows.push(["Line Item Calculation"]);
  rows.push([
    "Year",
    "Size IN",
    "OD mm",
    "Thickness mm",
    "Length m",
    "Material Spec",
    "Material Category",
    "Matched JSON Pipe Standard",
    "Coating",
    "Raw Steel Rs/kg",
    "Normal Factor",
    "P90 Factor",
    "Kg/m",
    "Total kg",
    "Normal Rs/kg",
    "P90 Rs/kg",
    "Normal Total Rs",
    "P90 Total Rs",
  ]);

  items.forEach((item) => {
    rows.push([
      item.year,
      `${formatPipeSize(item.size)} IN`,
      formatNumber(item.od, 1),
      formatNumber(item.thickness, 2),
      formatNumber(item.length, 2),
      item.spec,
      item.materialCategory || "Unclassified",
      item.materialMatchedStandard || item.materialMatchNote || "",
      item.coating,
      formatPlainCurrency(item.rawSteel, 2),
      formatPlainCurrency(item.factors.median, 2),
      formatPlainCurrency(item.factors.p90, 2),
      formatPlainCurrency(item.weightKgm, 2),
      formatPlainCurrency(item.totalWeight, 2),
      formatPlainCurrency(item.medianRsKg, 2),
      formatPlainCurrency(item.p90RsKg, 2),
      formatPlainCurrency(item.medianTotal, 0),
      formatPlainCurrency(item.p90Total, 0),
    ]);
  });

  rows.push([]);
  rows.push(["Material Category Summary"]);
  rows.push([
    "Category",
    "Line Count",
    "Total Weight kg",
    "Normal Total Rs",
    "P90 Total Rs",
    "Raw Rs/kg",
    "Average Rs/kg",
  ]);
  Array.from(groupItemsByMaterialCategory(items).entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([category, categoryItems]) => {
      const categorySummary = getSummary(categoryItems);
      rows.push([
        category,
        categoryItems.length,
        formatPlainCurrency(categorySummary.weight, 2),
        formatPlainCurrency(categorySummary.median, 0),
        formatPlainCurrency(categorySummary.p90, 0),
        formatPlainCurrency(getCategoryAverageRawRsKg(categoryItems), 2),
        formatPlainCurrency(getCategoryAverageRsKg(categorySummary), 2),
      ]);
    });
  rows.push([
    "Category pricing note",
    "Non-CS material estimates use the same factor-based method and are indicative only. Validate SS, alloy, duplex, and non-ferrous rates with supplier quotations.",
  ]);

  rows.push([]);
  rows.push(["Summary"]);
  rows.push(["Total Weight kg", formatPlainCurrency(summary.weight, 2)]);
  rows.push(["Normal Estimate Rs", formatPlainCurrency(summary.median, 0)]);
  rows.push(["P90 Estimate Rs", formatPlainCurrency(summary.p90, 0)]);
  rows.push([]);
  rows.push(["What-if Analysis"]);
  rows.push([
    "Scenario",
    "Raw Material Rs/kg",
    "Pipe Factor",
    "Component Factor",
    "Coating",
    "Normal Total Rs",
    "P90 Total Rs",
    "Change vs Base %",
  ]);
  sortWhatIfScenarios(filterWhatIfScenarios(getWhatIfScenarios())).forEach((scenario) => {
    rows.push([
      scenario.name,
      formatPlainCurrency(scenario.rawSteel, 2),
      formatPlainCurrency(scenario.pipeFactor, 2),
      formatPlainCurrency(scenario.componentFactor, 2),
      scenario.coating,
      formatPlainCurrency(scenario.median, 0),
      formatPlainCurrency(scenario.p90, 0),
      formatPlainCurrency(scenario.change, 1),
    ]);
  });
  rows.push([
    "What-if basis",
    "Raw material varies by +/-10% and +/-20% across the selected scope. Pipe factor and coating apply only to pipe values; component factor applies only to recognised non-pipe component values.",
  ]);
  if (bomGroupItems.length) {
    const componentSummary = getComponentCostSummary(bomGroupItems);
    rows.push([]);
    rows.push(["Piping Component Cost Review"]);
    rows.push(["Component pricing basis", "Approved group method x quantity; WN/SO/Blind flanges use flange-weight JSON weight x raw material Rs/kg x P50 base multiplier; metric stud sets use calculated stud-and-two-nut mass x raw material Rs/kg x commercial factor 2.50"]);
    rows.push(["Priced Components", componentSummary.priced]);
    rows.push(["Need Review", componentSummary.review]);
    rows.push(["Normal Component Estimate Rs", formatPlainCurrency(componentSummary.normal, 0)]);
    rows.push(["P90 Component Estimate Rs", formatPlainCurrency(componentSummary.p90, 0)]);
    rows.push([]);
    rows.push(["Group", "Item Count", "Normal Total Rs", "P90 Total Rs"]);
    groupBomItems(bomGroupItems).forEach(([groupName, groupItems]) => {
      const groupSummary = getComponentCostSummary(groupItems);
      rows.push([
        groupName,
        groupItems.length,
        formatPlainCurrency(groupSummary.normal, 0),
        formatPlainCurrency(groupSummary.p90, 0),
      ]);
    });
    rows.push([]);
    rows.push(["BOM Group Details"]);
    rows.push([
      "Group",
      "Item",
      "Matched Component",
      "Size",
      "Sch/Thk/Rating",
      "Material",
      "Material Category",
      "Matched ASTM Standard",
      "Quantity",
      "UOM",
      "Factor",
      "Component Factor for Valve Ratio",
      "Generic Fallback Used",
      "Pressure Class",
      "Class Multiplier",
      "Material Multiplier",
      "Matching Pipe Basis",
      "Stud Mass kg/Set",
      "One Nut Mass kg",
      "Two Nuts Mass kg",
      "Complete Set Mass kg",
      "Total Set Mass kg",
      "Stud Pitch mm",
      "Stud Effective Diameter mm",
      "Nut Across Flats mm",
      "Nut Thickness mm",
      "Stud Correction Factor",
      "Nut Correction Factor",
      "Number of Nuts",
      "Unit Rs",
      "Normal Total Rs",
      "P90 Total Rs",
      "Confidence",
      "Auto Cost Note",
      "Source",
    ]);
    groupBomItems(bomGroupItems).forEach(([groupName, groupItems]) => {
      groupItems.forEach((item) => {
        const cost = item.componentCost || {};
        rows.push([
          groupName,
          item.item,
          cost.component || item.standardName || "",
          item.size,
          item.thickness,
          item.material,
          item.materialCategory || "Unclassified",
          item.materialMatchedStandard || item.materialMatchNote || "",
          item.quantity,
          item.uom,
          Number.isFinite(cost.factor) ? formatPlainCurrency(cost.factor, 2) : "",
          Number.isFinite(cost.componentFactor) ? formatPlainCurrency(cost.componentFactor, 3) : "",
          cost.isGenericFallback ? "Yes" : "No",
          cost.pressureClass || "",
          formatPlainCurrency(cost.pressureMultiplier || 1, 2),
          formatPlainCurrency(cost.materialMultiplier || 1, 2),
          cost.matchingPipeBasis || "",
          Number.isFinite(cost.studMassKg) ? formatPlainCurrency(cost.studMassKg, 3) : "",
          Number.isFinite(cost.oneNutMassKg) ? formatPlainCurrency(cost.oneNutMassKg, 3) : "",
          Number.isFinite(cost.totalNutMassKg) ? formatPlainCurrency(cost.totalNutMassKg, 3) : "",
          Number.isFinite(cost.setMassKg) ? formatPlainCurrency(cost.setMassKg, 3) : "",
          Number.isFinite(cost.setTotalMassKg) ? formatPlainCurrency(cost.setTotalMassKg, 3) : "",
          Number.isFinite(cost.studPitchMm) ? formatPlainCurrency(cost.studPitchMm, 2) : "",
          Number.isFinite(cost.studEffectiveDiameterMm)
            ? formatPlainCurrency(cost.studEffectiveDiameterMm, 3)
            : "",
          Number.isFinite(cost.nutAcrossFlatsMm) ? formatPlainCurrency(cost.nutAcrossFlatsMm, 2) : "",
          Number.isFinite(cost.nutThicknessMm) ? formatPlainCurrency(cost.nutThicknessMm, 2) : "",
          Number.isFinite(cost.studCorrectionFactor)
            ? formatPlainCurrency(cost.studCorrectionFactor, 2)
            : "",
          Number.isFinite(cost.nutCorrectionFactor)
            ? formatPlainCurrency(cost.nutCorrectionFactor, 2)
            : "",
          Number.isFinite(cost.numberOfNuts) ? formatPlainCurrency(cost.numberOfNuts, 0) : "",
          hasComponentUnitPrice(cost) ? formatPlainCurrency(cost.medianUnitRate, 0) : "",
          hasComponentTotals(cost) ? formatPlainCurrency(cost.medianTotal, 0) : "",
          hasComponentTotals(cost) ? formatPlainCurrency(cost.p90Total, 0) : "",
          cost.confidence || "",
          cost.note || "",
          item.sourceName,
        ]);
      });
    });
  }
  rows.push([]);
  rows.push(["Raw Steel Basis"]);
  rows.push(["Line", "Year", "Raw Steel Rs/kg", "Basis"]);
  items.forEach((item, index) => {
    rows.push([
      index + 1,
      item.year,
      formatPlainCurrency(item.rawSteel, 2),
      item.rawSteelBasis,
    ]);
  });
  if (overrideNotes.length > 0) {
    rows.push([]);
    rows.push(["Reviewer Override Check"]);
    overrideNotes.forEach((note) => rows.push([note]));
  }
  rows.push([]);
  rows.push(["Calculation Methodology"]);
  rows.push(["Pipe mass formula", "W = 0.0246615 x (OD - t) x t"]);
  rows.push(["W", "Pipe mass in kg/m"]);
  rows.push(["OD", "Actual outside diameter in mm from the built-in OD table"]);
  rows.push(["t", "Wall thickness in mm entered by the user"]);
  rows.push(["Total weight", "W x length in meter"]);
  rows.push(["Finished Rs/kg", "Raw steel Rs/kg x estimate factor"]);
  rows.push(["Rs/m", "Finished Rs/kg x pipe kg/m"]);
  rows.push(["Total Rs", "Rs/m x pipe length"]);
  rows.push(["Component Total Rs", "Approved group method x quantity; WN/SO/Blind flange price = JSON flange weight x raw material Rs/kg x P50 base multiplier; metric stud set price = complete-set mass x raw material Rs/kg x commercial factor 2.50"]);
  rows.push(["Metric stud mass", "Effective diameter = nominal diameter - (0.649519 x coarse pitch); stud mass = (PI/4) x effective diameter^2 x length x density x 1E-9"]);
  rows.push(["Heavy hex nut mass", "One-nut mass = [(SQRT(3)/2 x across-flats^2) - (PI/4 x effective diameter^2)] x nut thickness x 0.95 x density x 1E-9; two nuts are added to each stud"]);
  rows.push(["Metric stud set exclusions", "Calculated kg excludes washers, coatings, chamfers, thread tolerances, packing and manufacturing variation"]);
  rows.push([]);
  rows.push(["Factor Method"]);
  rows.push(["Coating Yes", "Normal factor 2.30, P90 factor 3.80"]);
  rows.push(["Coating No", "Normal factor 1.80, P90 factor 2.70"]);
  rows.push([
    "Estimate Factor Override",
    "Replaces normal factor; P90 is recalculated using the default P90-to-normal factor ratio",
  ]);
  rows.push([]);
  rows.push(["Material Category Basis"]);
  rows.push(["Category source", "astm_piping_material_specification_webapp.json"]);
  rows.push(["Pricing basis", "Same factor-based method is used across material categories in this version"]);
  rows.push([
    "Non-CS validation",
    "Validate SS, alloy, duplex, and non-ferrous rates with supplier quotations",
  ]);
  rows.push([]);
  rows.push(["Coating Definition"]);
  rows.push(["Internal coating", "Epoxy lined"]);
  rows.push(["External coating", "PE coated, meaning polyethylene coated"]);
  rows.push(["Coating Yes", "Use for internal coating, external coating, or both"]);
  rows.push([]);
  rows.push(["Disclaimer"]);
  rows.push([
    "This tool provides indicative material-only estimates. Fabrication, erection, testing, freight, taxes, packing, wastage, contractor margin, and commercial terms are excluded unless separately stated.",
  ]);

  return rows;
}

function exportCsvReport() {
  updateReportGenerated();
  const csv = buildCsvRows().map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `piping-cost-estimator-audit-report-${dateStamp}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function setExcelCell(sheet, address, value, style = {}) {
  const cell = typeof value === "object" && value !== null && (value.f || Object.prototype.hasOwnProperty.call(value, "v"))
    ? value
    : { v: value };
  // SheetJS needs an explicit cell type when a value is assigned manually.
  // Without it, some desktop Excel versions can show generated rows as blank.
  if (!cell.t) {
    if (typeof cell.v === "number") cell.t = "n";
    else if (typeof cell.v === "boolean") cell.t = "b";
    else if (cell.v === null || cell.v === undefined || cell.v === "") cell.t = "z";
    else cell.t = "s";
  }
  cell.s = style;
  sheet[address] = cell;
}

function buildEditableComponentSheet(groupName, groupItems) {
  const workbookRows = [
    ["Piping Cost Estimator - Editable Component Cost Sheet"],
    ["Group", groupName],
    ["Edit pale-yellow cells only. Unit Rs, totals, and P90 values recalculate automatically in Microsoft Excel."],
    [],
    [
      "Item", "Size", "Rating / Thk", "Material", "Material Category", "Qty", "UOM",
      "Base Rate Rs", "Factor", "Unit Rs", "P90 Ratio", "Normal Total Rs", "P90 Total Rs",
      "Rate Status", "Source / Note",
    ],
  ];
  const sheet = globalThis.XLSX.utils.aoa_to_sheet(workbookRows);
  const headingStyle = { fill: { patternType: "solid", fgColor: { rgb: "0B365F" } }, font: { color: { rgb: "FFFFFF" }, bold: true }, alignment: { horizontal: "center", vertical: "center", wrapText: true }, border: { bottom: { style: "thin", color: { rgb: "D7E2EC" } } } };
  const titleStyle = { fill: { patternType: "solid", fgColor: { rgb: "0B365F" } }, font: { color: { rgb: "FFFFFF" }, bold: true, sz: 15 }, alignment: { vertical: "center" } };
  const editStyle = { fill: { patternType: "solid", fgColor: { rgb: "FFF2CC" } }, font: { color: { rgb: "172B4D" } }, alignment: { vertical: "center" }, border: { bottom: { style: "thin", color: { rgb: "E6D69A" } } } };
  const formulaStyle = { fill: { patternType: "solid", fgColor: { rgb: "EAF4F1" } }, font: { color: { rgb: "0B365F" } }, alignment: { vertical: "center" }, border: { bottom: { style: "thin", color: { rgb: "C5E3DA" } } } };
  const reviewStyle = { fill: { patternType: "solid", fgColor: { rgb: "FDECEC" } }, font: { color: { rgb: "B42318" }, bold: true }, alignment: { vertical: "center" } };
  const standardStyle = { alignment: { vertical: "center", wrapText: true } };
  const currencyEditStyle = { ...editStyle, numFmt: '"Rs "#,##0.00' };
  const currencyFormulaStyle = { ...formulaStyle, numFmt: '"Rs "#,##0.00' };
  setExcelCell(sheet, "A1", "Piping Cost Estimator - Editable Component Cost Sheet", titleStyle);
  for (let column = 0; column < 15; column += 1) {
    setExcelCell(sheet, globalThis.XLSX.utils.encode_cell({ r: 4, c: column }), workbookRows[4][column], headingStyle);
  }

  groupItems.forEach((item, itemIndex) => {
    const rowNumber = itemIndex + 6;
    const cost = item.componentCost || {};
    const hasUnitRate = hasComponentUnitPrice(cost);
    const hasTotalRate = hasComponentTotals(cost);
    const quantity = Number(String(item.quantity || "").replace(/,/g, ""));
    const hasQuantity = Number.isFinite(quantity) && quantity > 0;
    const factor = Number(cost.factor);
    const usableFactor = Number.isFinite(factor) && factor > 0 ? factor : 1;
    const unitRate = hasUnitRate ? Number(cost.medianUnitRate) : NaN;
    const baseRate = Number.isFinite(unitRate) ? unitRate / usableFactor : "";
    const p90Ratio = Number.isFinite(cost.p90UnitRate) && Number.isFinite(unitRate) && unitRate > 0
      ? Number(cost.p90UnitRate) / unitRate
      : Number.isFinite(cost.p90Total) && Number.isFinite(cost.medianTotal) && cost.medianTotal > 0
        ? Number(cost.p90Total) / Number(cost.medianTotal)
        : "";
    const detail = [
      item.item || "", item.size || "", item.thickness || "", item.material || "",
      formatCategoryHeading(item.materialCategory || "Unclassified"), hasQuantity ? quantity : "", item.uom || "",
      baseRate, Number.isFinite(unitRate) ? usableFactor : "", "", p90Ratio, "", "",
      hasUnitRate && hasTotalRate ? "Priced" : "Review",
      [cost.note || "", item.sourceName || ""].filter(Boolean).join(" | "),
    ];
    detail.forEach((value, column) => {
      const address = globalThis.XLSX.utils.encode_cell({ r: rowNumber - 1, c: column });
      const isEditable = [5, 7, 8, 10].includes(column) && value !== "";
      setExcelCell(sheet, address, value, isEditable ? (column === 7 ? currencyEditStyle : editStyle) : standardStyle);
    });

    const unitAddress = `J${rowNumber}`;
    const normalAddress = `L${rowNumber}`;
    const p90Address = `M${rowNumber}`;
    setExcelCell(sheet, unitAddress, {
      t: hasUnitRate ? "n" : "s",
      f: `IF(AND(ISNUMBER(H${rowNumber}),ISNUMBER(I${rowNumber})),H${rowNumber}*I${rowNumber},"Review")`,
      v: Number.isFinite(unitRate) ? unitRate : "Review",
    }, hasUnitRate ? currencyFormulaStyle : reviewStyle);
    setExcelCell(sheet, normalAddress, {
      t: hasTotalRate ? "n" : "s",
      f: `IF(AND(ISNUMBER(F${rowNumber}),ISNUMBER(J${rowNumber})),F${rowNumber}*J${rowNumber},"Review")`,
      v: hasTotalRate ? Number(cost.medianTotal) : "Review",
    }, hasTotalRate ? currencyFormulaStyle : reviewStyle);
    setExcelCell(sheet, p90Address, {
      t: hasTotalRate ? "n" : "s",
      f: `IF(AND(ISNUMBER(L${rowNumber}),ISNUMBER(K${rowNumber})),L${rowNumber}*K${rowNumber},"Review")`,
      v: hasTotalRate ? Number(cost.p90Total) : "Review",
    }, hasTotalRate ? currencyFormulaStyle : reviewStyle);
    if (!hasUnitRate || !hasTotalRate) {
      setExcelCell(sheet, `N${rowNumber}`, "Review", reviewStyle);
    }
  });

  const totalRow = groupItems.length + 8;
  setExcelCell(sheet, `A${totalRow}`, "Group total", { font: { bold: true, color: { rgb: "0B365F" } } });
  setExcelCell(sheet, `L${totalRow}`, { t: "n", f: `SUM(L6:L${totalRow - 2})`, v: getComponentCostSummary(groupItems).normal }, currencyFormulaStyle);
  setExcelCell(sheet, `M${totalRow}`, { t: "n", f: `SUM(M6:M${totalRow - 2})`, v: getComponentCostSummary(groupItems).p90 }, currencyFormulaStyle);
  setExcelCell(sheet, `A${totalRow + 2}`, "Workbook note", { font: { bold: true, color: { rgb: "0B365F" } } });
  setExcelCell(sheet, `B${totalRow + 2}`, "Base Rate Rs, Factor, Qty and P90 Ratio are editable. The app-calculated Unit Rs is represented as Base Rate x Factor so commercial changes flow into all totals.", standardStyle);
  sheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 14 } }, { s: { r: 2, c: 0 }, e: { r: 2, c: 14 } }, { s: { r: totalRow + 1, c: 1 }, e: { r: totalRow + 1, c: 14 } }];
  sheet["!cols"] = [
    { wch: 26 }, { wch: 13 }, { wch: 17 }, { wch: 24 }, { wch: 25 }, { wch: 10 }, { wch: 10 },
    { wch: 15 }, { wch: 11 }, { wch: 14 }, { wch: 12 }, { wch: 18 }, { wch: 17 }, { wch: 13 }, { wch: 48 },
  ];
  sheet["!rows"] = [{ hpt: 24 }, {}, { hpt: 30 }, {}, { hpt: 32 }];
  // Expand the worksheet range beyond the original header rows. Without this,
  // SheetJS writes the headings but omits the BOM rows added below them.
  sheet["!ref"] = globalThis.XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: totalRow + 1, c: 14 },
  });
  sheet["!autofilter"] = { ref: `A5:O${Math.max(groupItems.length + 5, 5)}` };
  return { sheet, totalRow };
}

function exportEditableBomExcelReport() {
  if (!bomGroupItems.length) {
    window.alert("Upload a BOM before downloading the editable Excel report.");
    return;
  }
  if (!globalThis.XLSX) {
    window.alert("Excel export is not available yet. Reload the page and try again.");
    return;
  }

  const classifiedGroups = groupBomItems(bomGroupItems);
  // A source BOM may contain an unfamiliar component name. Keep its row in the
  // editable report instead of allowing an empty workbook to be downloaded.
  const groups = classifiedGroups.length
    ? classifiedGroups
    : [["Uploaded BOM Items", [...bomGroupItems]]];
  const workbook = globalThis.XLSX.utils.book_new();
  const usedNames = new Set();
  const groupSheets = groups.map(([groupName, groupItems]) => {
    let sheetName = String(groupName).replace(/[\\/?*\[\]:]/g, "").slice(0, 31) || "Component Group";
    let suffix = 2;
    while (usedNames.has(sheetName)) {
      sheetName = `${sheetName.slice(0, 28)} ${suffix}`;
      suffix += 1;
    }
    usedNames.add(sheetName);
    const built = buildEditableComponentSheet(groupName, groupItems);
    globalThis.XLSX.utils.book_append_sheet(workbook, built.sheet, sheetName);
    return { groupName, groupItems, sheetName, totalRow: built.totalRow };
  });

  const totalSummary = getComponentCostSummary(bomGroupItems);
  const dashboardGroups = [...groupSheets]
    .map((group) => ({ ...group, summary: getComponentCostSummary(group.groupItems) }))
    .sort((a, b) => b.summary.normal - a.summary.normal);
  const executiveSheet = globalThis.XLSX.utils.aoa_to_sheet([[]]);
  const colors = { navy: "0B365F", orange: "FF681F", cyan: "6FCAD0", teal: "56E3C4", light: "F3F8FB", line: "D7E2EC", text: "0B365F", red: "B42318" };
  const fill = (color) => ({ patternType: "solid", fgColor: { rgb: color } });
  const border = { bottom: { style: "thin", color: { rgb: colors.line } } };
  const titleStyle = { fill: fill(colors.navy), font: { color: { rgb: "FFFFFF" }, bold: true, sz: 17 }, alignment: { vertical: "center" } };
  const subtitleStyle = { fill: fill("153E66"), font: { color: { rgb: "D9EAF7" }, sz: 10 }, alignment: { vertical: "center" } };
  const projectLabelStyle = { fill: fill(colors.light), font: { color: { rgb: "57708C" }, bold: true, sz: 9 }, alignment: { vertical: "center" } };
  const projectValueStyle = { fill: fill(colors.light), font: { color: { rgb: colors.text }, bold: true }, alignment: { vertical: "center", wrapText: true } };
  const sectionStyle = { fill: fill(colors.navy), font: { color: { rgb: "FFFFFF" }, bold: true, sz: 12 }, alignment: { vertical: "center" } };
  const headerStyle = { fill: fill("EAF3F8"), font: { color: { rgb: colors.text }, bold: true, sz: 10 }, alignment: { horizontal: "center", vertical: "center", wrapText: true }, border };
  const textStyle = { font: { color: { rgb: "172B4D" } }, alignment: { vertical: "center" }, border };
  const currencyStyle = { font: { color: { rgb: colors.text } }, alignment: { vertical: "center" }, border, numFmt: '"Rs "#,##0.00' };
  const percentStyle = { font: { color: { rgb: "57708C" } }, alignment: { vertical: "center" }, border, numFmt: "0.00%" };
  const kpi = (color) => ({ fill: fill(color), font: { color: { rgb: "FFFFFF" }, bold: true, sz: 15 }, alignment: { vertical: "center", horizontal: "left" } });
  const kpiCurrency = (color) => ({ ...kpi(color), numFmt: '"Rs "#,##0.00' });
  const kpiLabel = (color) => ({ fill: fill(color), font: { color: { rgb: "DDEAF4" }, bold: true, sz: 9 }, alignment: { vertical: "center" } });
  const projectDescription = elements.projectDescription?.value.trim() || "Not specified";
  const projectNumber = elements.projectNumber?.value.trim() || "Not specified";
  const componentHeaderRow = 13;
  const componentStartRow = componentHeaderRow + 1;
  const componentEndRow = componentStartRow + dashboardGroups.length - 1;
  const totalRow = componentEndRow + 1;
  const groupCostHeaderRow = componentHeaderRow;
  const groupCostStartRow = componentStartRow;
  const bridgeHeaderRow = componentHeaderRow;
  const bridgeStartRow = componentStartRow;
  const maximumNormal = Math.max(...dashboardGroups.map((group) => group.summary.normal), 1);
  const highestGroup = dashboardGroups[0] || { groupName: "Not available", summary: { normal: 0 } };

  setExcelCell(executiveSheet, "A1", "Piping Material Cost Estimate Report", titleStyle);
  setExcelCell(executiveSheet, "A2", "Material-only indicative estimate - editable Excel workbook", subtitleStyle);
  setExcelCell(executiveSheet, "A3", "PROJECT / JOB DESCRIPTION", projectLabelStyle);
  setExcelCell(executiveSheet, "B3", projectDescription, projectValueStyle);
  setExcelCell(executiveSheet, "I3", "PROJECT NO. / MOC NO. / JOB NO.", projectLabelStyle);
  setExcelCell(executiveSheet, "J3", projectNumber, projectValueStyle);
  setExcelCell(executiveSheet, "A4", "YEAR BASIS", projectLabelStyle);
  setExcelCell(executiveSheet, "B4", elements.year?.value || "Not specified", projectValueStyle);
  setExcelCell(executiveSheet, "I4", "TOTAL BOM ITEMS", projectLabelStyle);
  setExcelCell(executiveSheet, "J4", bomGroupItems.length, projectValueStyle);

  setExcelCell(executiveSheet, "A7", "BASE ESTIMATE", kpiLabel(colors.navy));
  setExcelCell(executiveSheet, "A8", { t: "n", f: `C${totalRow}`, v: totalSummary.normal }, kpiCurrency(colors.navy));
  setExcelCell(executiveSheet, "E7", "P90 ESTIMATE", kpiLabel(colors.orange));
  setExcelCell(executiveSheet, "E8", { t: "n", f: `D${totalRow}`, v: totalSummary.p90 }, kpiCurrency(colors.orange));
  setExcelCell(executiveSheet, "I7", "RISK RESERVE", kpiLabel(colors.cyan));
  setExcelCell(executiveSheet, "I8", { t: "n", f: `D${totalRow}-C${totalRow}`, v: Math.max(totalSummary.p90 - totalSummary.normal, 0) }, kpiCurrency(colors.cyan));
  setExcelCell(executiveSheet, "M7", "MAIN COST DRIVER", kpiLabel("168A72"));
  setExcelCell(executiveSheet, "M8", { t: "s", f: `INDEX(A${componentStartRow}:A${componentEndRow},MATCH(MAX(C${componentStartRow}:C${componentEndRow}),C${componentStartRow}:C${componentEndRow},0))`, v: highestGroup.groupName }, kpi("168A72"));

  setExcelCell(executiveSheet, "A11", "Component Cost Summary", sectionStyle);
  ["Group", "Items", "Normal Total", "P90 Total", "Risk Reserve", "Share", "Status"].forEach((label, column) => {
    setExcelCell(executiveSheet, globalThis.XLSX.utils.encode_cell({ r: componentHeaderRow - 1, c: column }), label, headerStyle);
  });
  dashboardGroups.forEach((group, index) => {
    const row = componentStartRow + index;
    const quotedSheetName = `'${group.sheetName.replace(/'/g, "''")}'`;
    const share = totalSummary.normal > 0 ? group.summary.normal / totalSummary.normal : 0;
    const status = group.summary.review > 0 ? "Review required" : "Priced";
    setExcelCell(executiveSheet, `A${row}`, group.groupName, textStyle);
    setExcelCell(executiveSheet, `B${row}`, group.groupItems.length, textStyle);
    setExcelCell(executiveSheet, `C${row}`, { t: "n", f: `${quotedSheetName}!L${group.totalRow}`, v: group.summary.normal }, currencyStyle);
    setExcelCell(executiveSheet, `D${row}`, { t: "n", f: `${quotedSheetName}!M${group.totalRow}`, v: group.summary.p90 }, currencyStyle);
    setExcelCell(executiveSheet, `E${row}`, { t: "n", f: `D${row}-C${row}`, v: Math.max(group.summary.p90 - group.summary.normal, 0) }, currencyStyle);
    setExcelCell(executiveSheet, `F${row}`, { t: "n", f: `IFERROR(C${row}/$C$${totalRow},0)`, v: share }, percentStyle);
    setExcelCell(executiveSheet, `G${row}`, status, status === "Review required" ? { ...textStyle, font: { color: { rgb: colors.red }, bold: true } } : textStyle);
  });
  setExcelCell(executiveSheet, `A${totalRow}`, "TOTAL ESTIMATED MATERIAL COST", { fill: fill("D9EAF7"), font: { color: { rgb: colors.text }, bold: true }, border });
  setExcelCell(executiveSheet, `C${totalRow}`, { t: "n", f: `SUM(C${componentStartRow}:C${componentEndRow})`, v: totalSummary.normal }, { fill: fill("D9EAF7"), font: { color: { rgb: colors.text }, bold: true }, numFmt: '"Rs "#,##0.00' });
  setExcelCell(executiveSheet, `D${totalRow}`, { t: "n", f: `SUM(D${componentStartRow}:D${componentEndRow})`, v: totalSummary.p90 }, { fill: fill("D9EAF7"), font: { color: { rgb: colors.text }, bold: true }, numFmt: '"Rs "#,##0.00' });
  setExcelCell(executiveSheet, `E${totalRow}`, { t: "n", f: `D${totalRow}-C${totalRow}`, v: Math.max(totalSummary.p90 - totalSummary.normal, 0) }, { fill: fill("D9EAF7"), font: { color: { rgb: colors.text }, bold: true }, numFmt: '"Rs "#,##0.00' });
  setExcelCell(executiveSheet, `F${totalRow}`, { t: "n", f: "1", v: 1 }, { fill: fill("D9EAF7"), font: { color: { rgb: colors.text }, bold: true }, numFmt: "0.0%" });

  setExcelCell(executiveSheet, "I11", "Group-wise Cost", sectionStyle);
  ["Group", "Normal Total", "Share", "Visual bar"].forEach((label, offset) => {
    setExcelCell(executiveSheet, globalThis.XLSX.utils.encode_cell({ r: groupCostHeaderRow - 1, c: 8 + offset }), label, headerStyle);
  });
  const barColors = [colors.orange, "2F6E9E", colors.cyan, colors.navy, "5E8FAE", "86C9D5", "AFCAD9"];
  dashboardGroups.forEach((group, index) => {
    const row = groupCostStartRow + index;
    const sourceRow = componentStartRow + index;
    const barStyle = { font: { color: { rgb: barColors[index % barColors.length] }, bold: true, sz: 13 }, alignment: { vertical: "center" } };
    setExcelCell(executiveSheet, `I${row}`, { t: "s", f: `A${sourceRow}`, v: group.groupName }, textStyle);
    setExcelCell(executiveSheet, `J${row}`, { t: "n", f: `C${sourceRow}`, v: group.summary.normal }, currencyStyle);
    setExcelCell(executiveSheet, `K${row}`, { t: "n", f: `F${sourceRow}`, v: totalSummary.normal > 0 ? group.summary.normal / totalSummary.normal : 0 }, percentStyle);
    setExcelCell(executiveSheet, `L${row}`, { t: "s", f: `REPT(\"█\",MAX(1,ROUND(K${row}*24,0)))`, v: "█".repeat(Math.max(1, Math.round((group.summary.normal / maximumNormal) * 24))) }, barStyle);
  });

  setExcelCell(executiveSheet, "N11", "Estimate Bridge", sectionStyle);
  ["Stage", "Value", "Visual"].forEach((label, offset) => {
    setExcelCell(executiveSheet, globalThis.XLSX.utils.encode_cell({ r: bridgeHeaderRow - 1, c: 13 + offset }), label, headerStyle);
  });
  const bridgeRows = [
    { label: "Base estimate", formula: `C${totalRow}`, value: totalSummary.normal, color: colors.navy },
    { label: "Risk reserve", formula: `D${totalRow}-C${totalRow}`, value: Math.max(totalSummary.p90 - totalSummary.normal, 0), color: colors.cyan },
    { label: "P90 estimate", formula: `D${totalRow}`, value: totalSummary.p90, color: colors.teal },
  ];
  bridgeRows.forEach((bridge, index) => {
    const row = bridgeStartRow + index;
    const bridgeStyle = { fill: fill(bridge.color), font: { color: { rgb: "FFFFFF" }, bold: true }, alignment: { vertical: "center" } };
    setExcelCell(executiveSheet, `N${row}`, bridge.label, bridgeStyle);
    setExcelCell(executiveSheet, `O${row}`, { t: "n", f: bridge.formula, v: bridge.value }, { ...bridgeStyle, numFmt: '"Rs "#,##0.00' });
    setExcelCell(executiveSheet, `P${row}`, { t: "s", f: `REPT(\"█\",MAX(1,ROUND(O${row}/MAX($O$${bridgeStartRow}:$O$${bridgeStartRow + 2})*16,0)))`, v: "█".repeat(Math.max(1, Math.round((bridge.value / Math.max(totalSummary.p90, 1)) * 16))) }, bridgeStyle);
  });

  const noteRow = Math.max(totalRow + 3, componentStartRow + dashboardGroups.length + 2);
  setExcelCell(executiveSheet, `A${noteRow}`, "Workbook inputs", { fill: fill("FFF2CC"), font: { color: { rgb: colors.text }, bold: true } });
  setExcelCell(executiveSheet, `B${noteRow}`, "Pale-yellow cells in each group sheet are editable: Qty, Base Rate Rs, Factor and P90 Ratio. All totals and this Executive Summary recalculate in Excel.", { fill: fill("FFFBEA"), font: { color: { rgb: colors.text } }, alignment: { wrapText: true } });
  setExcelCell(executiveSheet, `A${noteRow + 1}`, "Scope", { fill: fill(colors.light), font: { color: { rgb: colors.text }, bold: true } });
  setExcelCell(executiveSheet, `B${noteRow + 1}`, "Material-only indicative estimate. Taxes, freight, fabrication, erection, testing, packing, wastage, contractor margin and commercial terms are excluded unless separately stated.", { fill: fill(colors.light), font: { color: { rgb: colors.text } }, alignment: { wrapText: true } });
  executiveSheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 15 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 15 } },
    { s: { r: 2, c: 1 }, e: { r: 2, c: 7 } }, { s: { r: 2, c: 9 }, e: { r: 2, c: 15 } },
    { s: { r: 3, c: 1 }, e: { r: 3, c: 7 } }, { s: { r: 3, c: 9 }, e: { r: 3, c: 15 } },
    { s: { r: 6, c: 0 }, e: { r: 6, c: 3 } }, { s: { r: 7, c: 0 }, e: { r: 8, c: 3 } },
    { s: { r: 6, c: 4 }, e: { r: 6, c: 7 } }, { s: { r: 7, c: 4 }, e: { r: 8, c: 7 } },
    { s: { r: 6, c: 8 }, e: { r: 6, c: 11 } }, { s: { r: 7, c: 8 }, e: { r: 8, c: 11 } },
    { s: { r: 6, c: 12 }, e: { r: 6, c: 15 } }, { s: { r: 7, c: 12 }, e: { r: 8, c: 15 } },
    { s: { r: 10, c: 0 }, e: { r: 10, c: 6 } }, { s: { r: 10, c: 8 }, e: { r: 10, c: 11 } }, { s: { r: 10, c: 13 }, e: { r: 10, c: 15 } },
    { s: { r: noteRow - 1, c: 1 }, e: { r: noteRow - 1, c: 15 } }, { s: { r: noteRow, c: 1 }, e: { r: noteRow, c: 15 } },
  ];
  executiveSheet["!cols"] = [{ wch: 25 }, { wch: 10 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 12 }, { wch: 17 }, { wch: 3 }, { wch: 25 }, { wch: 16 }, { wch: 11 }, { wch: 29 }, { wch: 3 }, { wch: 18 }, { wch: 17 }, { wch: 22 }];
  executiveSheet["!rows"] = [{ hpt: 30 }, { hpt: 20 }, { hpt: 26 }, { hpt: 22 }, {}, {}, { hpt: 19 }, { hpt: 26 }, { hpt: 26 }, {}, { hpt: 22 }, { hpt: 21 }];
  executiveSheet["!ref"] = globalThis.XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: noteRow, c: 15 } });
  executiveSheet["!autofilter"] = { ref: `A${componentHeaderRow}:G${componentEndRow}` };
  globalThis.XLSX.utils.book_append_sheet(workbook, executiveSheet, "Executive Summary");
  workbook.SheetNames.unshift(workbook.SheetNames.pop());

  const methodSheet = globalThis.XLSX.utils.aoa_to_sheet([
    ["Calculation Method and Audit Notes"],
    ["Pipe mass", "W = 0.0246615 x (OD - t) x t"],
    ["Editable workbook logic", "Pale-yellow Qty, Base Rate Rs, Factor, and P90 Ratio cells are inputs. Unit Rs = Base Rate Rs x Factor. Normal Total = Qty x Unit Rs. P90 Total = Normal Total x P90 Ratio."],
    ["Source", "The starting values are taken from the Piping Cost Estimator calculation at the time of export."],
    ["Material-only disclaimer", "Fabrication, erection, testing, freight, taxes, packing, wastage, contractor margin, and commercial terms are excluded unless separately stated."],
    ["Review rows", "Rows marked Review have incomplete BOM information or no calculated rate. Complete the required input before relying on the group total."],
  ]);
  setExcelCell(methodSheet, "A1", "Calculation Method and Audit Notes", { font: { color: { rgb: "0B365F" }, bold: true, sz: 15 } });
  methodSheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
  methodSheet["!cols"] = [{ wch: 28 }, { wch: 110 }];
  globalThis.XLSX.utils.book_append_sheet(workbook, methodSheet, "Method and Audit");
  workbook.CalcPr = { calcMode: "auto", fullCalcOnLoad: "1", forceFullCalc: "1" };

  // A unique name prevents Excel from reopening an older same-day report that is still open.
  const fileStamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");
  globalThis.XLSX.writeFile(workbook, `piping-material-cost-estimate-${fileStamp}.xlsx`);
  showSuccessMessage(
    `Excel report downloaded with ${bomGroupItems.length} BOM ${bomGroupItems.length === 1 ? "item" : "items"} across ${groups.length} ${groups.length === 1 ? "group" : "groups"}.`
  );
}

function printReport() {
  updateReportGenerated();
  document
    .querySelectorAll(".category-review-details, .category-audit-details, .bom-group-details, .audit-details")
    .forEach((details) => {
      details.open = true;
    });
  window.print();
}

function getBomReportGeneratedText() {
  return new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildBomCostReportHtml() {
  const groups = groupBomItems(bomGroupItems);
  const summary = getComponentCostSummary(bomGroupItems);
  const fallbackCount = bomGroupItems.filter((item) => item.componentCost?.isGenericFallback).length;
  const reportDate = getBomReportGeneratedText();
  const reportFileStamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");
  const projectDescription = elements.projectDescription?.value.trim() || "Not specified";
  const projectNumber = elements.projectNumber?.value.trim() || "Not specified";
  const groupStats = groups.map(([groupName, groupItems]) => {
    const groupSummary = getComponentCostSummary(groupItems);
    const share = summary.normal > 0 ? (groupSummary.normal / summary.normal) * 100 : 0;
    const reserve = Math.max(groupSummary.p90 - groupSummary.normal, 0);
    const hasReview = groupSummary.review > 0 || groupSummary.normal <= 0;
    const status = hasReview ? "Pending" : share >= 40 ? "Priority" : "Checked";
    const action = hasReview
      ? `${groupSummary.review} (${formatCountInWords(groupSummary.review)}) ${
          groupSummary.review === 1 ? "item needs" : "items need"
        } review to calculate the group total.`
      : share >= 40
        ? "Validate rate source, class and factor"
        : "Routine check";
    return {
      groupName,
      groupItems,
      ...groupSummary,
      share,
      reserve,
      status,
      action,
    };
  });
  const maxP90 = Math.max(...groupStats.map((group) => group.p90), 1);
  const costDriver = groupStats.reduce(
    (driver, group) => (group.normal > driver.normal ? group : driver),
    { groupName: "Not available", normal: 0, share: 0 }
  );
  const riskReserve = Math.max(summary.p90 - summary.normal, 0);
  const pricedWithoutFallback = Math.max(summary.priced - fallbackCount, 0);
  const totalTrackedItems = Math.max(pricedWithoutFallback + summary.review + fallbackCount, 1);
  const pricedPct = (pricedWithoutFallback / totalTrackedItems) * 100;
  const reviewPct = (summary.review / totalTrackedItems) * 100;
  const reviewStart = pricedPct;
  const fallbackStart = pricedPct + reviewPct;
  const sortedGroupStatsForChart = [...groupStats].sort((a, b) => b.normal - a.normal);
  const groupRows = sortedGroupStatsForChart
    .map((group) => {
      return `
        <tr class="${group.status === "Pending" ? "pending-row" : ""}">
          <td>${escapeHtml(group.groupName)}</td>
          <td>${group.groupItems.length}</td>
          <td>${formatCurrency(group.normal, 0)}</td>
          <td>${formatCurrency(group.p90, 0)}</td>
          <td>${formatCurrency(group.reserve, 0)}</td>
          <td>${formatNumber(group.share, 1)}%</td>
          <td><span class="badge ${group.status.toLowerCase()}">${group.status}</span></td>
          <td class="${group.status === "Pending" ? "pending-action" : ""}">${escapeHtml(group.action)}</td>
        </tr>
      `;
    })
    .join("");
  const barRows = sortedGroupStatsForChart
    .map((group, groupIndex) => {
      const normalWidth = Math.max((group.normal / maxP90) * 100, group.normal > 0 ? 2 : 0);
      const p90Width = Math.max((group.p90 / maxP90) * 100, group.p90 > 0 ? 2 : 0);
      return `
        <div class="bar-row">
          <div class="bar-label">${escapeHtml(group.groupName)}</div>
          <div class="bar-track">
            <span class="bar-risk" style="width:${formatNumber(p90Width, 1)}%"></span>
            <span class="bar-base ${groupIndex === 0 ? "tone-driver" : `tone-${((groupIndex - 1) % 3) + 1}`}" style="width:${formatNumber(
              normalWidth,
              1
            )}%"></span>
          </div>
          <div class="bar-value">
            <strong>${formatCurrency(group.normal, 0)}</strong>
            <span>${formatNumber(group.share, 1)}%</span>
          </div>
        </div>
      `;
    })
    .join("");
  const detailSections = groupStats
    .map((group, groupIndex) => {
      const isBoltGroup = /bolt/i.test(group.groupName);
      return `
        <section class="report-group">
          <div class="report-group-title">
            <span>${groupIndex + 1}</span>
            <div>
              <h2>${escapeHtml(group.groupName)}</h2>
              <p>${group.groupItems.length} item(s) | Normal ${formatCurrency(
                group.normal,
                0
              )} | P90 ${formatCurrency(group.p90, 0)}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Size</th>
                <th>Rating / Thk</th>
                <th>Material</th>
                <th>Material Category</th>
                <th>Qty</th>
                <th>UOM</th>
                ${isBoltGroup ? "<th>Set wt (kg)</th>" : ""}
                <th>Factor</th>
                <th>Unit Rs</th>
                <th>Normal Total</th>
                <th>P90 Total</th>
              </tr>
            </thead>
            <tbody>
              ${group.groupItems
                .map((item) => {
                  const cost = item.componentCost || {};
                  return `
                    <tr>
                      <td>${escapeHtml(item.item)}</td>
                      <td>${escapeHtml(item.size || "-")}</td>
                      <td>${escapeHtml(item.thickness || "-")}</td>
                      <td>${escapeHtml(item.material || "-")}</td>
                      <td>${escapeHtml(formatCategoryHeading(item.materialCategory || "Unclassified"))}</td>
                      <td>${escapeHtml(item.quantity || "-")}</td>
                      <td>${escapeHtml(item.uom || "-")}</td>
                      ${
                        isBoltGroup
                          ? `<td>${Number.isFinite(cost.setMassKg) ? formatNumber(cost.setMassKg, 3) : "-"}</td>`
                          : ""
                      }
                      <td>${Number.isFinite(cost.factor) ? formatNumber(cost.factor, 2) : "-"}${
                        cost.isGenericFallback ? ' <small class="fallback">Fallback</small>' : ""
                      }</td>
                      <td>${hasComponentUnitPrice(cost) ? formatCurrency(cost.medianUnitRate, 0) : "Review"}</td>
                      <td>${hasComponentTotals(cost) ? formatCurrency(cost.medianTotal, 0) : "Review"}</td>
                      <td>${hasComponentTotals(cost) ? formatCurrency(cost.p90Total, 0) : "Review"}</td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </section>
      `;
    })
    .join("");
  const bridgeBaseline = 244;
  const bridgePlotHeight = 165;
  const bridgeMax = Math.max(summary.normal, summary.p90, summary.normal + riskReserve, 1);
  const baseHeight = Math.max((summary.normal / bridgeMax) * bridgePlotHeight, summary.normal > 0 ? 34 : 0);
  const p90Height = Math.max((summary.p90 / bridgeMax) * bridgePlotHeight, summary.p90 > 0 ? 34 : 0);
  const baseTop = bridgeBaseline - baseHeight;
  const p90Top = bridgeBaseline - p90Height;
  const reserveHeight = Math.max(baseTop - p90Top, riskReserve > 0 ? 26 : 0);
  const reserveTop = baseTop - reserveHeight;

  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Pipe_Price_Predictor_BOM_Report_${reportFileStamp}</title>
        <style>
          :root {
            --navy: #07335d;
            --blue: #27608f;
            --teal: #6fd1d7;
            --mint: #5df8d8;
            --orange: #ff681f;
            --green: #1d7a58;
            --text: #05213d;
            --muted: #5c718b;
            --border: #d8e3ef;
            --soft: #f5f8fc;
            --paper: #ffffff;
          }
          * { box-sizing: border-box; }
          html {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body {
            margin: 0;
            background: #f3f8fa;
            color: var(--text);
            font-family: Arial, Helvetica, sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .report {
            width: min(1140px, calc(100% - 32px));
            margin: 24px auto;
            background: var(--paper);
            border: 1px solid var(--border);
            border-radius: 22px;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(7, 51, 93, 0.12);
          }
          .topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 28px;
            background:
              linear-gradient(90deg, rgba(7, 51, 93, 0.96), rgba(39, 96, 143, 0.78)),
              linear-gradient(180deg, var(--navy) 0 42%, var(--blue) 42% 69%, var(--teal) 69% 87%, var(--mint) 87% 100%);
            color: #fff;
          }
          .topbar strong { font-size: 18px; }
          .topbar small {
            display: block;
            margin-top: 4px;
            color: rgba(255,255,255,0.76);
            font-size: 12px;
            font-weight: 500;
          }
          .topbar span {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 34px;
            height: 34px;
            border-radius: 999px;
            background: rgba(255,255,255,0.13);
            font-size: 12px;
            font-weight: 700;
          }
          .report-project-info {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(260px, 0.55fr);
            gap: 18px;
            padding: 16px 32px;
            border-bottom: 1px solid var(--border);
            background: #eaf2f8;
          }
          .project-info-item {
            display: grid;
            gap: 5px;
          }
          .project-info-item span {
            color: var(--muted);
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.06em;
            text-transform: uppercase;
          }
          .project-info-item strong {
            color: var(--navy);
            font-size: 14px;
            line-height: 1.4;
          }
          .hero {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 28px;
            padding: 30px 32px;
            border-bottom: 1px solid var(--border);
          }
          .eyebrow {
            margin: 0 0 8px;
            color: var(--muted);
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          h1 {
            margin: 0 0 12px;
            color: var(--navy);
            font-size: 34px;
            line-height: 1.05;
          }
          .ready {
            display: inline-flex;
            gap: 8px;
            align-items: center;
            margin: 0 0 10px;
            color: var(--green);
            font-weight: 700;
          }
          .ready::before {
            content: "";
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--green);
          }
          .scope-note {
            margin: -3px 0 10px;
            color: #9a4f00;
            font-size: 12px;
            font-weight: 700;
            line-height: 1.45;
          }
          .meta {
            margin: 0;
            color: var(--muted);
            font-size: 13px;
            line-height: 1.6;
          }
          .meta-list {
            display: grid;
            gap: 6px;
            margin: 0;
            color: var(--muted);
            font-size: 12px;
            line-height: 1.45;
          }
          .cards {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;
            padding: 22px 32px;
          }
          .card {
            border: 1px solid var(--border);
            border-radius: 16px;
            background: #fff;
            padding: 16px;
          }
          .card.c1 { box-shadow: inset 0 4px 0 var(--navy); }
          .card.c2 { box-shadow: inset 0 4px 0 var(--blue); }
          .card.c3 { box-shadow: inset 0 4px 0 var(--teal); }
          .card.c4 { box-shadow: inset 0 4px 0 var(--orange); }
          .card-label {
            margin-bottom: 8px;
            color: var(--muted);
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.07em;
            text-transform: uppercase;
          }
          .card-value {
            color: var(--navy);
            font-size: 24px;
            font-weight: 800;
            line-height: 1.1;
          }
          .card-note {
            margin-top: 7px;
            color: var(--muted);
            font-size: 12px;
            line-height: 1.45;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            border-top: 1px solid var(--border);
          }
          .summary-grid article {
            padding: 18px 22px;
            border-right: 1px solid var(--border);
            background: #fbfdff;
          }
          .summary-grid article:last-child { border-right: 0; }
          .summary-grid span {
            display: block;
            margin-bottom: 8px;
            color: var(--muted);
            font-size: 12px;
          }
          .summary-grid strong {
            color: var(--navy);
            font-size: 22px;
          }
          .donut-wrap {
            display: grid;
            grid-template-columns: 150px 1fr;
            align-items: center;
            gap: 22px;
          }
          .donut {
            width: 138px;
            height: 138px;
            border-radius: 50%;
            background: conic-gradient(
              var(--orange) 0 ${formatNumber(pricedPct, 1)}%,
              var(--blue) ${formatNumber(reviewStart, 1)}% ${formatNumber(fallbackStart, 1)}%,
              #54c89f ${formatNumber(fallbackStart, 1)}% 100%
            );
            position: relative;
          }
          .donut::after {
            content: "";
            position: absolute;
            inset: 34px;
            border-radius: 50%;
            background: #fff;
          }
          .legend {
            display: grid;
            gap: 10px;
            color: var(--muted);
            font-size: 13px;
          }
          .legend b { color: var(--text); }
          .bom-count-kpi {
            display: inline-flex;
            align-items: baseline;
            gap: 6px;
            width: fit-content;
            margin-bottom: 4px;
            padding: 9px 12px;
            border: 1px solid var(--border);
            border-radius: 12px;
            background: #f7fbfd;
            color: var(--navy);
            font-size: 13px;
            font-weight: 700;
          }
          .bom-count-kpi b {
            color: var(--orange);
            font-size: 17px;
          }
          .dot {
            display: inline-block;
            width: 10px;
            height: 10px;
            margin-right: 8px;
            border-radius: 50%;
            background: var(--orange);
          }
          .content { padding: 24px 32px 30px; }
          .visual-grid {
            display: grid;
            grid-template-columns: 1.05fr 0.95fr;
            gap: 18px;
            margin-bottom: 22px;
          }
          .report-panel {
            border: 1px solid var(--border);
            border-radius: 18px;
            background: #fff;
            padding: 18px;
          }
          .report-panel h2 {
            margin: 0 0 14px;
            color: var(--navy);
            font-size: 18px;
          }
          .bar-list {
            display: grid;
            gap: 14px;
          }
          .bar-row {
            display: grid;
            grid-template-columns: 150px minmax(180px, 1fr) 112px;
            gap: 12px;
            align-items: center;
            font-size: 12px;
          }
          .bar-label {
            font-weight: 700;
            color: var(--text);
          }
          .bar-track {
            position: relative;
            height: 18px;
            border-radius: 999px;
            background: #dceaf0;
            overflow: hidden;
          }
          .bar-risk,
          .bar-base {
            position: absolute;
            inset: 0 auto 0 0;
            border-radius: 999px;
          }
          .bar-risk { background: #dceaf0; }
          .bar-base.tone-driver { background: var(--orange); }
          .bar-base.tone-1 { background: var(--navy); }
          .bar-base.tone-2 { background: var(--blue); }
          .bar-base.tone-3 { background: var(--teal); }
          .bar-value {
            color: var(--text);
            font-weight: 700;
            text-align: right;
          }
          .bar-value strong,
          .bar-value span {
            display: block;
          }
          .bar-value span {
            margin-top: 2px;
            color: var(--muted);
            font-size: 10px;
            font-weight: 700;
          }
          .bridge-chart {
            width: 100%;
            height: auto;
            display: block;
            margin: 4px 0 18px;
          }
          .bridge-axis {
            stroke: #d7e6ed;
            stroke-width: 2;
          }
          .bridge-dash {
            stroke: var(--blue);
            stroke-width: 2.5;
            stroke-dasharray: 7 7;
          }
          .bridge-base {
            fill: #0b4969;
          }
          .bridge-reserve {
            fill: #6ccbd2;
          }
          .bridge-p90 {
            fill: #5df0d0;
          }
          .bridge-value {
            fill: var(--text);
            font-size: 14px;
            font-weight: 800;
          }
          .bridge-label {
            fill: var(--muted);
            font-size: 13px;
            font-weight: 700;
          }
          .bridge-note {
            margin: -4px 0 14px;
            color: var(--muted);
            font-size: 12px;
            line-height: 1.45;
          }
          .mini-strip {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
          }
          .mini {
            border: 1px solid var(--border);
            border-radius: 14px;
            background: #f8fcfd;
            padding: 13px;
          }
          .mini strong {
            display: block;
            margin-bottom: 5px;
            color: var(--navy);
            font-size: 13px;
          }
          .mini span {
            color: var(--muted);
            font-size: 12px;
            line-height: 1.45;
          }
          .mini .data-quality-warning {
            color: #b42318;
            font-weight: 700;
          }
          .section-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            margin: 0 0 12px;
          }
          .section-head h2 {
            margin: 0;
            color: var(--navy);
            font-size: 23px;
          }
          .pill {
            border: 1px solid #ffd1bb;
            border-radius: 999px;
            background: #fff7f2;
            color: #c94f12;
            font-size: 12px;
            font-weight: 700;
            padding: 8px 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 12px;
          }
          th {
            padding: 10px 8px;
            border-bottom: 1px solid var(--border);
            color: var(--muted);
            font-size: 11px;
            letter-spacing: 0.03em;
            text-align: left;
            text-transform: uppercase;
          }
          .badge {
            display: inline-block;
            min-width: 68px;
            padding: 4px 9px;
            border-radius: 999px;
            font-size: 10px;
            font-weight: 800;
            text-align: center;
          }
          .badge.checked {
            background: rgba(111, 209, 215, 0.18);
            color: #16656d;
          }
          .badge.priority {
            background: rgba(39, 96, 143, 0.15);
            color: var(--navy);
          }
          .badge.pending {
            background: rgba(255, 104, 31, 0.12);
            color: #c94f12;
          }
          .pending-action {
            color: #b42318;
            font-weight: 700;
          }
          .pending-row td {
            color: #b42318;
            font-weight: 700;
          }
          td {
            padding: 10px 8px;
            border-bottom: 1px solid var(--border);
            vertical-align: top;
          }
          .report-group {
            break-inside: avoid;
            margin-top: 22px;
          }
          .report-group-title {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
          }
          .report-group-title span {
            display: inline-grid;
            place-items: center;
            width: 22px;
            height: 22px;
            border-radius: 999px;
            background: var(--orange);
            color: #fff;
            font-size: 12px;
            font-weight: 700;
          }
          .report-group-title h2 {
            margin: 0;
            color: var(--navy);
            font-size: 18px;
          }
          .report-group-title p {
            margin: 3px 0 0;
            color: var(--muted);
            font-size: 12px;
          }
          .fallback {
            display: inline-block;
            margin-left: 5px;
            padding: 2px 6px;
            border-radius: 999px;
            background: #fff1e8;
            color: #c94f12;
            font-size: 10px;
            font-weight: 700;
          }
          .method {
            margin-top: 20px;
            padding: 16px;
            border: 1px solid var(--border);
            border-radius: 10px;
            background: var(--soft);
            color: var(--muted);
            font-size: 12px;
            line-height: 1.55;
          }
          footer {
            padding: 18px 32px 28px;
            color: var(--muted);
            font-size: 12px;
            line-height: 1.6;
            border-top: 1px solid var(--border);
          }
          .report-actions {
            display: flex;
            align-items: center;
            gap: 14px;
            justify-content: flex-end;
            padding: 14px 20px;
            background: #f8fbff;
            border-top: 1px solid var(--border);
          }
          .print-button {
            border: 0;
            border-radius: 999px;
            background: linear-gradient(135deg, var(--orange), #c94f12);
            color: #fff;
            cursor: pointer;
            font-weight: 700;
            padding: 10px 18px;
          }
          .pdf-save-note {
            margin: 0 auto 0 0;
            color: var(--muted);
            font-size: 11px;
            line-height: 1.45;
          }
          .page-number-footer {
            display: none;
          }
          @page {
            size: A4 landscape;
            margin: 10mm 9mm 17mm;
            @bottom-right {
              content: "Page No: " counter(page) " of " counter(pages);
              color: #5c718b;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 10px;
            }
          }
          @media print {
            body {
              background: #f3f8fa !important;
              color: var(--text) !important;
            }
            .report {
              width: 100%;
              margin: 0 auto 12mm;
              border: 1px solid var(--border);
              border-radius: 18px;
              box-shadow: none;
              overflow: visible;
            }
            .report-actions { display: none; }
            .hero {
              padding: 14px 20px;
              grid-template-columns: 1fr 0.85fr;
            }
            .cards {
              padding: 10px 18px;
              gap: 12px;
            }
            .card {
              padding: 12px;
            }
            .card-value {
              font-size: 20px;
            }
            .summary-grid article {
              padding: 10px 18px;
            }
            .content {
              padding: 12px 18px 24px;
            }
            .visual-grid {
              grid-template-columns: 1.05fr 0.95fr;
              gap: 14px;
              margin-bottom: 16px;
            }
            .report-panel {
              padding: 12px;
            }
            .bridge-chart {
              max-height: 205px;
              margin-bottom: 10px;
            }
            .bridge-note {
              margin-bottom: 10px;
            }
            .mini {
              padding: 9px;
            }
            .mini strong,
            .mini span {
              font-size: 11px;
            }
            .bar-list {
              gap: 10px;
            }
            .bar-row {
              grid-template-columns: 126px minmax(150px, 1fr) 94px;
              gap: 10px;
            }
            .topbar,
            .hero,
            .report-project-info,
            .cards,
            .summary-grid,
            .visual-grid,
            .report-panel,
            .report-group,
            .method,
            footer {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
          @media (max-width: 860px) {
            .hero,
            .visual-grid,
            .cards,
            .summary-grid {
              grid-template-columns: 1fr;
            }
            .bar-row {
              grid-template-columns: 1fr;
            }
            .bar-value {
              text-align: left;
            }
            .mini-strip {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        <main class="report">
          <header class="topbar">
            <div>
              <strong>Piping Material Cost Estimate Report</strong>
              <small>Material-only component estimate with calculation backup</small>
            </div>
            <span>PPR</span>
          </header>
          <section class="report-project-info">
            <div class="project-info-item">
              <span>Project / Job Description</span>
              <strong>${escapeHtml(projectDescription)}</strong>
            </div>
            <div class="project-info-item">
              <span>Project No. / MOC No. / Job No.</span>
              <strong>${escapeHtml(projectNumber)}</strong>
            </div>
          </section>
          <section class="hero">
            <div>
              <p class="eyebrow">Total estimated material cost</p>
              <h1>${formatCurrency(summary.normal, 0)}</h1>
              <p class="ready">Estimate ready with factor backup</p>
              <p class="scope-note">Material-only estimate. Taxes, freight and commercial add-ons are excluded.</p>
              <p class="meta">Report generated: ${escapeHtml(reportDate)} | Year basis: ${escapeHtml(
                elements.year.value
              )} | Material-only budgetary estimate</p>
            </div>
            <div class="donut-wrap">
              <div class="donut" aria-hidden="true"></div>
              <div class="legend">
                <div class="bom-count-kpi">Total BOM items = <b>${bomGroupItems.length}</b></div>
                <div><span class="dot"></span><b>${pricedWithoutFallback}</b> exact-factor priced items</div>
                <div><span class="dot" style="background: var(--blue)"></span><b>${summary.review}</b> review items</div>
                <div><span class="dot" style="background: #54c89f"></span><b>${fallbackCount}</b> generic fallback items</div>
                <div class="meta-list">
                  <div><strong>Estimate basis:</strong> Pipe-rate factor method</div>
                  <div><strong>Currency:</strong> INR</div>
                  <div><strong>Use:</strong> Budgetary estimate review</div>
                </div>
              </div>
            </div>
          </section>
          <section class="cards">
            <article class="card c1">
              <div class="card-label">Base estimate</div>
              <div class="card-value">${formatCurrency(summary.normal, 0)}</div>
              <div class="card-note">Normal case for planning and comparison.</div>
            </article>
            <article class="card c2">
              <div class="card-label">P90 estimate</div>
              <div class="card-value">${formatCurrency(summary.p90, 0)}</div>
              <div class="card-note">Conservative envelope for approval review.</div>
            </article>
            <article class="card c3">
              <div class="card-label">Risk reserve</div>
              <div class="card-value">${formatCurrency(riskReserve, 0)}</div>
              <div class="card-note">Difference between P90 and base estimate.</div>
            </article>
            <article class="card c4">
              <div class="card-label">Main cost driver</div>
              <div class="card-value">${escapeHtml(costDriver.groupName)}</div>
              <div class="card-note">${formatNumber(costDriver.share, 1)}% share of base estimate.</div>
            </article>
          </section>
          <section class="content">
            <div class="visual-grid">
              <section class="report-panel">
                <h2>Group-wise Cost</h2>
                <div class="bar-list">${barRows}</div>
              </section>
              <section class="report-panel">
                <h2>Estimate Bridge</h2>
                <svg class="bridge-chart" viewBox="0 0 600 300" role="img" aria-label="Estimate bridge from base estimate to P90 estimate">
                  <line class="bridge-axis" x1="24" y1="${formatNumber(bridgeBaseline, 1)}" x2="576" y2="${formatNumber(
                    bridgeBaseline,
                    1
                  )}" />
                  <line class="bridge-dash" x1="130" y1="${formatNumber(baseTop, 1)}" x2="245" y2="${formatNumber(
                    baseTop,
                    1
                  )}" />
                  <line class="bridge-dash" x1="350" y1="${formatNumber(reserveTop, 1)}" x2="440" y2="${formatNumber(
                    reserveTop,
                    1
                  )}" />
                  <text class="bridge-value" x="77.5" y="${formatNumber(Math.max(baseTop - 12, 18), 1)}" text-anchor="middle">${formatCurrency(
                    summary.normal,
                    0
                  )}</text>
                  <rect class="bridge-base" x="52" y="${formatNumber(baseTop, 1)}" width="105" height="${formatNumber(
                    baseHeight,
                    1
                  )}" rx="14" />
                  <text class="bridge-label" x="104.5" y="278" text-anchor="middle">Base</text>

                  <text class="bridge-value" x="297.5" y="${formatNumber(Math.max(reserveTop - 12, 18), 1)}" text-anchor="middle">+${formatCurrency(
                    riskReserve,
                    0
                  )}</text>
                  <rect class="bridge-reserve" x="245" y="${formatNumber(reserveTop, 1)}" width="105" height="${formatNumber(
                    reserveHeight,
                    1
                  )}" rx="14" />
                  <text class="bridge-label" x="297.5" y="278" text-anchor="middle">Risk reserve</text>

                  <text class="bridge-value" x="492.5" y="${formatNumber(Math.max(p90Top - 12, 18), 1)}" text-anchor="middle">${formatCurrency(
                    summary.p90,
                    0
                  )}</text>
                  <rect class="bridge-p90" x="440" y="${formatNumber(p90Top, 1)}" width="105" height="${formatNumber(
                    p90Height,
                    1
                  )}" rx="14" />
                  <text class="bridge-label" x="492.5" y="278" text-anchor="middle">P90</text>
                </svg>
                <p class="bridge-note">Visual bridge: base estimate plus risk reserve equals the P90 budget envelope.</p>
                <div class="mini-strip">
                  <div class="mini">
                    <strong>Management focus</strong>
                    <span>Check the highest-value group first before approval.</span>
                  </div>
                  <div class="mini">
                    <strong>Risk focus</strong>
                    <span>Keep the reserve visible so exposure is clear.</span>
                  </div>
                  <div class="mini">
                    <strong>Data quality</strong>
                    <span class="${summary.review > 0 ? "data-quality-warning" : ""}">${
                      summary.review > 0
                        ? "Some items still need a confirmed price or management decision."
                        : "All BOM items have a calculated price."
                    }</span>
                  </div>
                </div>
              </section>
            </div>
            <div class="section-head">
              <h2>Component Cost Summary</h2>
              <span class="pill">Ready for review</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Items</th>
                  <th>Base Cost</th>
                  <th>P90 Cost</th>
                  <th>Reserve</th>
                  <th>Share</th>
                  <th>Status</th>
                  <th>Required Action</th>
                </tr>
              </thead>
              <tbody>${groupRows}</tbody>
            </table>
            ${detailSections}
            <div class="method">
              <strong>Method:</strong> Component cost follows the approved group method. WN/SO/Blind flange cost = JSON flange weight x raw material Rs/kg x P50 base multiplier x quantity. Metric stud set cost = calculated stud-and-two-heavy-hex-nut mass x raw material Rs/kg x commercial raw-to-finished factor 2.50 x quantity.
              The set uses ASME B18.2.4.6M heavy-hex nut dimensions. Washers, coatings, chamfers, thread tolerances and manufacturing variation are excluded. Other non-pipe components continue to use their approved component pricing methods.
              This tool provides indicative material-only estimates. Fabrication, erection, testing, freight, taxes, packing, wastage, contractor margin, and commercial terms are excluded unless separately stated.
            </div>
          </section>
          <footer>
            This report is intended for material-only budgetary planning and management review. Final commercial value shall be validated through latest approved rate source, vendor quotation, PMS/specification, quantity take-off, taxes, freight, inspection, delivery basis, and commercial conditions.
          </footer>
          <div class="report-actions">
            <p class="pdf-save-note">If Adobe says the file is already open, close the old PDF or save this report with a new file name.</p>
            <button class="print-button" onclick="window.print()">Print / Save PDF</button>
          </div>
        </main>
        <div class="page-number-footer" aria-hidden="true"></div>
      </body>
    </html>`;
}

function printBomCostReport() {
  if (!bomGroupItems.length) {
    window.alert("Upload a BOM before generating the piping material cost report.");
    return;
  }

  elements.bomReportPreview.hidden = false;
  elements.bomReportFrame.srcdoc = buildBomCostReportHtml();
  elements.bomReportPreview.scrollIntoView({ behavior: "smooth", block: "start" });
}

function printBomReportFrame() {
  if (elements.bomReportPreview.hidden) {
    printBomCostReport();
    return;
  }

  const frameWindow = elements.bomReportFrame.contentWindow;
  if (!frameWindow) return;

  frameWindow.focus();
  frameWindow.print();
}

function closeBomReportPreview() {
  elements.bomReportPreview.hidden = true;
  elements.bomReportFrame.removeAttribute("srcdoc");
}

function populateSizeOptions() {
  Object.keys(odTable)
    .map(Number)
    .filter((size) => !manualSizeExclusions.has(size))
    .sort((a, b) => a - b)
    .forEach((size) => {
      const option = document.createElement("option");
      option.value = size;
      option.textContent = `${size} IN`;
      if (size === 6) option.selected = true;
      elements.size.append(option);
    });
}

function resetForm() {
  elements.projectDescription.value = "";
  elements.projectNumber.value = "";
  elements.year.value = "2026";
  elements.size.value = "6";
  elements.thicknessMode.value = "schedule";
  elements.schedule.value = "STD";
  elements.thickness.value = "";
  elements.length.value = "100";
  elements.spec.value = "ASTM A106";
  selectDefaultCarbonSteelPrice();
  elements.coating.value = "No";
  elements.factorOverride.value = "";
  elements.bomFile.value = "";
  elements.rawSteelSlider.value = "0";
  elements.pipeFactorSlider.value = "0";
  elements.componentFactorSlider.value = "0";
  elements.rawSteelSliderValue.textContent = "0%";
  setBomStatus("No BOM uploaded yet.");
  clearSuccessMessage();
  clearReportGenerated();
  lineItems.splice(0, lineItems.length);
  bomGroupItems.splice(0, bomGroupItems.length);
  updateThicknessMode();
  renderLineItems();
  renderBomGroupReview();
  calculate();
}

function initializeShowHideSummaryLabels() {
  document.querySelectorAll("details > summary").forEach((summary) => {
    const details = summary.parentElement;
    const showLabel = summary.dataset.showLabel || summary.textContent.trim();
    if (!(details instanceof HTMLDetailsElement) || !/^Show\b/i.test(showLabel)) return;

    summary.dataset.showLabel = showLabel;
    const updateLabel = () => {
      summary.textContent = details.open
        ? showLabel.replace(/^Show\b/i, "Hide")
        : showLabel;
    };

    updateLabel();
    details.addEventListener("toggle", updateLabel);
  });
}

populateSizeOptions();
populateComponentGroups();
loadMaterialSpecificationData();
loadRawMaterialPriceLibrary();
loadFlangeWeightModel();

// Keep the decision-support lab after the detailed BOM component review.
const scenarioPlayground = document.querySelector("#what-if-analysis");
const componentCostReview = document.querySelector("#bom-group-review");
if (scenarioPlayground && componentCostReview) {
  componentCostReview.insertAdjacentElement("afterend", scenarioPlayground);
}

initializeShowHideSummaryLabels();
renderBomGroupReview();
document.querySelectorAll("input, select, textarea").forEach((control) => {
  control.addEventListener("input", () => {
    if (control === elements.rawOverride) {
      delete elements.rawOverride.dataset.source;
      delete elements.rawOverride.dataset.sourceType;
    }
    clearSuccessMessage();
    updateThicknessMode();
    calculate();
  });
  control.addEventListener("change", () => {
    clearSuccessMessage();
    updateThicknessMode();
    calculate();
  });
});
elements.materialBasis.addEventListener("change", () => {
  populateRawMaterialGradeOptions();
  if (isCarbonSteelRawMaterialSelection()) {
    elements.materialGradeFamily.value = "0";
    applyRawMaterialPriceSelection();
  } else {
    clearRawMaterialPriceSelection();
  }
  calculate();
});
elements.materialGradeFamily.addEventListener("change", () => {
  applyRawMaterialPriceSelection();
  updateThicknessMode();
  calculate();
});
elements.year.addEventListener("change", () => {
  if (elements.rawOverride.dataset.sourceType === "materialLibrary") {
    applyRawMaterialPriceSelection();
  }
  refreshLineItemYearPrices();
  calculate();
  renderComponentQuickEstimate();
});
elements.addLine.addEventListener("click", addCurrentLine);
elements.addComponent.addEventListener("click", addManualComponent);
elements.resetComponent.addEventListener("click", resetComponentQuickEstimate);
elements.componentGroup.addEventListener("change", () => populateComponentTypes({ applyDefaults: true }));
elements.componentType.addEventListener("change", () => updateComponentFieldLayout(false));
[elements.componentSize, elements.componentRating, elements.componentMaterial, elements.componentQuantity].forEach((control) => {
  control.addEventListener("input", renderComponentQuickEstimate);
  control.addEventListener("change", renderComponentQuickEstimate);
});
elements.sortButtons.forEach((button) => button.addEventListener("click", handleSort));
elements.whatIfSortButtons.forEach((button) => button.addEventListener("click", handleWhatIfSort));
elements.whatIfToggles.forEach((toggle) => toggle.addEventListener("change", renderWhatIfAnalysis));
elements.whatIfScope.addEventListener("change", renderWhatIfAnalysis);
elements.rawSteelSlider.addEventListener("input", handleRawSteelSlider);
elements.pipeFactorSlider.addEventListener("input", handleFactorSlider);
elements.componentFactorSlider.addEventListener("input", handleFactorSlider);
elements.bomFile.addEventListener("change", handleBomUpload);
elements.bomDropZone.addEventListener("dragover", handleBomDrag);
elements.bomDropZone.addEventListener("dragleave", handleBomDragLeave);
elements.bomDropZone.addEventListener("drop", handleBomDrop);
elements.themeToggle.addEventListener("click", toggleTheme);
elements.sideBrandHome.addEventListener("click", () => {
  document.querySelector("#top")?.scrollIntoView({ behavior: "smooth", block: "start" });
  setActiveSideNavLink("#calculator");
});
elements.sideNavToggle.addEventListener("click", () =>
  setSideNavCollapsed(!document.body.classList.contains("side-nav-collapsed"))
);
elements.sideNavLinks.forEach((link) => {
  link.addEventListener("click", () => setActiveSideNavLink(link.getAttribute("href")));
});
window.addEventListener("scroll", updateActiveSideNavOnScroll, { passive: true });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setSideNavCollapsed(true);
});
elements.print.addEventListener("click", printReport);
elements.exportCsv.addEventListener("click", exportCsvReport);
elements.bomReport.addEventListener("click", printBomCostReport);
elements.bomExcelReport.addEventListener("click", exportEditableBomExcelReport);
elements.bomReportPrint.addEventListener("click", printBomReportFrame);
elements.bomReportClose.addEventListener("click", closeBomReportPreview);
elements.lineItemsBody.addEventListener("click", (event) => {
  if (event.target.matches(".remove-line")) {
    removeLine(event.target.dataset.id);
  }
});
elements.reset.addEventListener("click", resetForm);
applyTheme(localStorage.getItem("csPipeTheme") || "light");
resetForm();
updateActiveSideNavOnScroll();

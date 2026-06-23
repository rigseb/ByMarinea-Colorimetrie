// ==============================
// OBSERVATION + TESTS
// ==============================

export const OBSERVATION_QUESTIONS = [
  {
    key: "undertone",
    title: "Sous-ton présumé",
    options: [
      { value: "warm", label: "Doré (chaud)" },
      { value: "cold", label: "Rosé (froid)" },
      { value: "neutral", label: "Neutre (mix)" },
    ],
  },
  {
    key: "contrast",
    title: "Contraste naturel",
    options: [
      { value: "low", label: "Faible" },
      { value: "medium", label: "Moyen" },
      { value: "high", label: "Fort" },
    ],
  },
  {
    key: "intensity",
    title: "Intensité naturelle",
    options: [
      { value: "soft", label: "Doux" },
      { value: "medium", label: "Intermédiaire" },
      { value: "strong", label: "Intense" },
    ],
  },
  {
    key: "eyes",
    title: "Couleur des yeux",
    options: [
      { value: "light", label: "Clairs" },
      { value: "medium", label: "Moyens" },
      { value: "deep", label: "Profonds" },
    ],
  },
  {
    key: "hair",
    title: "Reflets des cheveux",
    options: [
      { value: "warm", label: "Chaud (doré, cuivré)" },
      { value: "neutral", label: "Neutre / difficile à lire" },
      { value: "cool", label: "Froid (cendré, bleuté)" },
    ],
  }
];

export const TESTS = [
  // ==============================
  // TEMPÉRATURE
  // ==============================
  {
    key: "A1",
    section: "Température",
    title: "Quel bijou illumine le plus votre visage ?",
    optionA: "Or",
    optionB: "Argent",
  },
  {
    key: "A2",
    section: "Température",
    title: "Quelle couleur donne le plus de bonne mine ?",
    optionA: "Corail",
    optionB: "Fuchsia",
  },
  {
    key: "A3",
    section: "Température",
    title: "Quelle teinte adoucit le plus les traits ?",
    optionA: "Saumon",
    optionB: "Rose guimauve",
  },
  {
    key: "A4",
    section: "Température",
    title: "Quelle couleur éclaire le plus le teint ?",
    optionA: "Jaune bouton d'or",
    optionB: "Bleu ciel",
  },

  // ==============================
  // VALEUR (CLAIR / SOMBRE)
  // ==============================
  {
    key: "B1",
    section: "Valeur",
    title: "Quelle couleur illumine le plus votre visage ?",
    optionA: "Bleu ciel",
    optionB: "Bleu roi",
  },
  {
    key: "B2",
    section: "Valeur",
    title: "Votre visage est plus harmonieux avec :",
    optionA: "Ivoire",
    optionB: "Chocolat",
  },
  {
    key: "B3",
    section: "Valeur",
    title: "Quelle teinte met le plus votre visage en valeur ?",
    optionA: "Vert lichens",
    optionB: "Vert sapin",
  },

  // ==============================
  // INTENSITÉ (DOUX / VIF)
  // ==============================
  {
    key: "C1",
    section: "Intensité",
    title: "Quelle couleur donne un teint plus frais ?",
    optionA: "Saumon",
    optionB: "Corail",
  },
  {
    key: "C2",
    section: "Intensité",
    title: "Votre visage supporte mieux :",
    optionA: "Vert lichens",
    optionB: "Vert pomme",
  },
  {
    key: "C3",
    section: "Intensité",
    title: "Quelle couleur est la plus flatteuse ?",
    optionA: "Rose guimauve",
    optionB: "Fuchsia",
  },

  // ==============================
  // CONTRASTE (LOGIQUE CROISÉE)
  // ==============================
  {
    key: "D1",
    section: "Contraste",
    title: "Entre ces contrastes forts, lequel met le plus votre visage en valeur ?",
    optionA: "Noir",
    optionB: "Blanc pur",
  },
  {
    key: "D2",
    section: "Contraste",
    title: "Entre ces contrastes plus doux, lequel est le plus harmonieux ?",
    optionA: "Ivoire",
    optionB: "Chocolat",
  },
];


// ==============================
// PROFILS 12 SAISONS
// ==============================

export const PROFILES = [
  /* ================= PRINTEMPS ================= */

  {
    name: "Printemps Clair",
    season: "Printemps",
    subtype: "Clair",
    axes: {
      temperature: "chaud",
      value: "clair",
      intensity: "doux",
      contrast: "faible",
    },
    logic: "Chaud + Clair + Doux",
    summary:
      "Palette lumineuse, délicate et chaleureuse. L’harmonie repose sur la légèreté et la subtilité.",
    pitch:
      "Votre visage fonctionne comme une lumière du matin : il n’a pas besoin d’intensité pour briller, il a besoin de chaleur et de clarté. Quand vous portez des couleurs chaudes, claires et peu contrastées, votre teint semble immédiatement plus frais, plus vivant, comme si on avait “défroissé” votre expression. Vos traits paraissent plus doux, votre regard plus ouvert, et l’ensemble respire la simplicité élégante. Vous avez peut‑être déjà remarqué que certaines couleurs vous donnent l’air “reposée” sans maquillage : c’est exactement cette famille-là. À l’inverse, une couleur trop sombre, trop froide ou trop tranchée fait comme un projecteur mal réglé : elle rigidifie, elle “vole” le visage et met en avant le vêtement plutôt que vous. Votre règle d’or : que la couleur accompagne votre lumière, au lieu de la remplacer.",
      advice: [
        "Privilégier des couleurs claires et lumineuses.",
        "Rester dans des contrastes doux pour ne pas durcir les traits.",
        "Éviter les teintes trop profondes ou trop saturées.",
      ],
    examples: {
      tops: ["ivoire", "pêche", "beige doré", "abricot clair"],
      jackets: ["camel clair", "sable", "beige chaud", "miel clair"],
      accessories: ["doré", "cuir clair", "beige nude", "écaille claire"],
    },
    avoid: ["noir", "gris froid", "bordeaux sombre", "anthracite dur"],
    palettes: {
      base: [
        { hex: "#E9A0A8", nom: "rose pêche clair" },
        { hex: "#FFF2A6", nom: "jaune citron clair" },
        { hex: "#72B7B5", nom: "turquoise doux" },
        { hex: "#7EDB89", nom: "vert printemps clair" },
        { hex: "#F0926B", nom: "abricot corail" }
      ],
      neutres: [
        { hex: "#E7E4D7", nom: "ivoire chaud" },
        { hex: "#F4D8A8", nom: "beige ivoire chaud lumineux" },
        { hex: "#E6C998", nom: "beige miel" },
        { hex: "#C3A57A", nom: "camel doré" },
        { hex: "#FFD1B3", nom: "pêche clair lumineux" }
      ],
      accents: [
        { hex: "#F5C900", nom: "jaune soleil" },
        { hex: "#78B7DB", nom: "bleu ciel vif" },
        { hex: "#A8E1B3", nom: "vert d’eau" },
        { hex: "#EBC59F", nom: "pêche dorée" },
        { hex: "#9F93BA", nom: "lavande grisée" }
      ]
    }    
  
  },

  {
    name: "Printemps Chaud",
    season: "Printemps",
    subtype: "Chaud",
    axes: {
      temperature: "chaud",
      value: "moyen",
      intensity: "vif",
      contrast: "modéré",
    },
    logic: "Chaud + Moyen + Vif",
    summary:
      "Palette solaire, vivante et chaleureuse. L’harmonie repose sur l’énergie et la chaleur naturelle.",
    pitch:
      "Votre visage réagit d’abord à la chaleur : il s’illumine quand les couleurs restent ensoleillées, vivantes et naturelles. Vous n’avez pas forcément besoin d’être très clair ou très profond pour être mis en valeur ; ce qui compte surtout, c’est que la couleur reste chaude et qu’elle garde un contraste mesuré. Quand c’est juste, le teint paraît plus frais, les traits plus harmonieux et l’ensemble plus spontané. À l’inverse, les couleurs froides ou trop sourdes coupent votre élan naturel et rendent le visage plus terne. Votre repère principal : suivre la chaleur avant de chercher la profondeur.",
    advice: [
      "Favoriser les couleurs chaudes, épicées et lumineuses.",
      "Assumer davantage d’énergie visuelle qu’un profil très doux.",
      "Éviter les couleurs froides ou trop cendrées.",
    ],
    examples: {
      tops: ["corail", "melon", "mangue", "jaune chaud"],
      jackets: ["camel", "miel", "tabac clair"],
      accessories: ["doré", "écaille chaude", "cuir cognac"],
    },
    avoid: ["bleu froid", "gris cendré", "rose bleuté"],
    palettes: {
      base: [
        { hex: "#E45722", nom: "corail orange" },
        { hex: "#F4C331", nom: "jaune mangue" },
        { hex: "#4DBA1A", nom: "vert pomme chaud" },
        { hex: "#FF6A2F", nom: "orange mandarine" },
        { hex: "#12B5AF", nom: "turquoise chaud" }
      ],
      neutres: [
        { hex: "#E7E3CF", nom: "ivoire crème" },
        { hex: "#C09866", nom: "camel miel" },
        { hex: "#BBA771", nom: "beige safran" },
        { hex: "#B02A27", nom: "rouge brique" },
        { hex: "#E6D6C2", nom: "beige nude chaud" }
      ],
      accents: [
        { hex: "#F3945E", nom: "corail saumon" },
        { hex: "#9CC56A", nom: "vert tilleul" },
        { hex: "#FF6040", nom: "corail vif" },
        { hex: "#F5C900", nom: "jaune soleil" },
        { hex: "#10B63A", nom: "vert gazon" }
      ]
    },
  
  },

  {
    name: "Printemps Lumineux",
    season: "Printemps",
    subtype: "Lumineux",
    axes: {
      temperature: "chaud",
      value: "clair",
      intensity: "vif",
      contrast: "fort",
    },
    logic: "Chaud + Clair + Vif + Contraste",
    summary:
      "Palette éclatante, fraîche et lumineuse. L’harmonie repose sur la clarté et l’énergie visuelle.",
    pitch:
      "Votre visage supporte très bien l’énergie : vous êtes un printemps qui peut porter des couleurs plus franches, plus assumées, tant qu’elles restent chaudes et plutôt claires. C’est comme si votre lumière interne acceptait qu’on monte le volume… mais sur une musique joyeuse, pas dramatique. Quand vous choisissez une couleur chaude, claire et dynamique, votre regard s’éveille, votre peau semble plus lumineuse, et votre présence devient évidente. Vous avez peut‑être déjà constaté qu’une couleur “vitaminée” vous donne instantanément meilleure mine. Le piège, c’est de croire que “fort” veut dire “foncé” : chez vous, une couleur trop profonde ou froide fait retomber la magie et alourdit les traits. La bonne stratégie : contraster, oui — assombrir, non",
    advice: [
      "Oser des couleurs lumineuses et plus affirmées.",
      "Garder de la clarté et éviter les tons éteints.",
      "Utiliser un contraste plus présent sans aller vers le sombre lourd.",
    ],
    examples: {
      tops: ["turquoise clair", "corail vif", "jaune solaire", "vert printanier"],
      jackets: ["ivoire", "beige clair lumineux", "camel clair"],
      accessories: ["doré lumineux", "laque colorée", "cuir nude vif"],
    },
    avoid: ["kaki terne", "gris souris", "brun assourdi"],
    palettes: {
      base: [
        { hex: "#FF4745", nom: "rouge corail vif" },
        { hex: "#F5C900", nom: "jaune citron chaud" },
        { hex: "#1CA7CF", nom: "turquoise franc" },
        { hex: "#4DBA1A", nom: "vert vif" },
        { hex: "#F57C00", nom: "orange vif" }
      ],
      neutres: [
        { hex: "#EDEDED", nom: "blanc perle" },
        { hex: "#3A5FCD", nom: "bleu lumineux" },
        { hex: "#E9C46A", nom: "camel lumineux doré" },
        { hex: "#D8B98A", nom: "beige doré lumineux" },
        { hex: "#E4CFA3", nom: "beige doré" }
      ],
      accents: [
        { hex: "#16B890", nom: "turquoise émeraude" },
        { hex: "#E85FA6", nom: "rose framboise" },
        { hex: "#49C3B5", nom: "aqua vif" },
        { hex: "#35C12F", nom: "vert prairie" },
        { hex: "#FF4D00", nom: "orange rouge" }
      ]
    },
  
  },

  /* ================= ÉTÉ ================= */

  {
    name: "Été Clair",
    season: "Été",
    subtype: "Clair",
    axes: {
      temperature: "froid",
      value: "clair",
      intensity: "doux",
      contrast: "faible",
    },
    logic: "Froid + Clair + Doux",
    summary:
      "Palette fraîche, légère et délicate. L’harmonie repose sur la subtilité et la clarté froide.",
    pitch:
      "Votre visage est une aquarelle : il se révèle dans la douceur, la nuance, la lumière froide. Quand vous portez des couleurs froides, claires et délicates, votre peau paraît plus lisse, vos traits se calment, et votre regard gagne une élégance naturelle. Vous avez peut‑être remarqué que certaines couleurs “poudrées” vous donnent l’air reposée, presque lumineuse, sans effort. À l’inverse, une couleur trop chaude ou trop vive agit comme une lumière jaune sur une photo : elle brouille, elle durcit, elle fatigue. Et un contraste trop fort peut donner un effet “découpé” qui ne vous ressemble pas. Votre magie, c’est la subtilité : on doit sentir l’harmonie avant de voir la couleur.",
    advice: [
      "Privilégier les tons frais, clairs et poudrés.",
      "Conserver des contrastes faibles et doux.",
      "Éviter les couleurs trop chaudes ou trop saturées.",
    ],
    examples: {
      tops: ["rose glacé", "bleu ciel froid", "lavande claire", "gris perle"],
      jackets: ["bleu brume", "gris clair", "taupe froid"],
      accessories: ["argent", "perle", "cuir gris clair"],
    },
    avoid: ["orange", "camel chaud", "noir profond"],
    palettes: {
      base: [
        
{ hex: "#D8BFD8", nom: "lilas clair lumineux" },
{ hex: "#BFD7FF", nom: "bleu ciel lumineux" },
{ hex: "#C3C7D8", nom: "bleu gris lavande" },
{ hex: "#A6B3BF", nom: "gris bleuté clair" },
{ hex: "#BFD5C9", nom: "vert d’eau pastel" }

      ],
      neutres: [
        
{ hex: "#DCE6F2", nom: "gris très clair lumineux" },
{ hex: "#B5B5B5", nom: "gris clair" },
{ hex: "#D5D2C8", nom: "grège froid" },
{ hex: "#BEBEBE", nom: "gris argent" },
{ hex: "#E6E6E6", nom: "gris perle clair" }

      ],
      accents: [
        { hex: "#C69C9C", nom: "rose poudré" },
        { hex: "#B0B0DE", nom: "lavande claire" },
        { hex: "#6E9FA1", nom: "bleu canard grisé" },
        { hex: "#8A9F9D", nom: "vert sauge froid" },
        { hex: "#C3A8C5", nom: "lilas poudré" }
      ]
    },
  
  },

  {
    name: "Été Doux",
    season: "Été",
    subtype: "Doux",
    axes: {
      temperature: "froid",
      value: "moyen",
      intensity: "doux",
      contrast: "faible",
    },
    logic: "Froid + Doux + Peu contrasté",
    summary:
      "Palette poudrée et feutrée. L’harmonie repose sur des couleurs froides, assourdies et élégantes.",
    pitch:
      "Votre visage se révèle surtout dans la fraîcheur et la douceur. Même si la valeur n’est pas encore clairement fixée, l’harmonie apparaît quand les couleurs restent froides, nuancées et peu contrastées. Quand c’est juste, la peau semble plus lisse, le regard plus calme et l’ensemble plus élégant. Votre repère principal : fraîcheur + fondu.",
    advice: [
      "Privilégier des couleurs froides mais assourdies.",
      "Chercher l’élégance dans la subtilité plutôt que dans l’intensité.",
      "Éviter les couleurs trop franches ou trop lumineuses.",
    ],
    examples: {
      tops: ["mauve grisé", "bleu ardoise doux", "rose vieux", "taupe rosé"],
      jackets: ["gris bleuté", "bleu fumé", "marine adouci"],
      accessories: ["argent mat", "étain", "cuir taupe froid"],
    },
    avoid: ["corail vif", "orange", "jaune franc"],
    palettes: {
      base: [
        { hex: "#909095", nom: "gris mauve" },
        { hex: "#9A969D", nom: "taupe violacé" },
        { hex: "#8E8286", nom: "brun taupe froid" },
        { hex: "#819686", nom: "vert gris doux" },
        { hex: "#738DA3", nom: "bleu ardoise doux" }
      ],
      neutres: [
        { hex: "#9E9793", nom: "grège froid" },
        { hex: "#3F5F7A", nom: "bleu ardoise profond" },
        { hex: "#5C5C5C", nom: "gris charbon doux" },
        { hex: "#7B8997", nom: "gris acier bleuté" },
        { hex: "#E3E3E3", nom: "gris perle" }
      ],
      accents: [
        { hex: "#8FA085", nom: "vert sauge" },
        { hex: "#8E7C8A", nom: "mauve grisé" },
        { hex: "#7C8FA3", nom: "bleu denim grisé" },
        { hex: "#A88986", nom: "vieux rose taupé" },
        { hex: "#6C8F91", nom: "bleu sarcelle grisé" }
      ]
    },
  
  },

  {
    name: "Été Froid",
    season: "Été",
    subtype: "Froid",
    axes: {
      temperature: "froid",
      value: "moyen",
      intensity: "vif",
      contrast: "modéré",
    },
    logic: "Froid + Net + Élégant",
    summary:
      "Palette fraîche et structurée. L’harmonie repose sur des couleurs froides plus nettes, mais toujours raffinées.",
    pitch:
      "Votre visage est mis en valeur par la fraîcheur avant tout. Vous n’avez pas besoin d’aller vers des couleurs très claires ou très profondes pour être harmonieuse : c’est surtout la température froide et la douceur maîtrisée qui révèlent votre visage. Quand les teintes restent froides et élégantes, le teint paraît plus régulier, le regard plus net et l’expression plus sereine. À l’inverse, dès que la chaleur ou la saturation prennent trop de place, le visage se brouille. Votre repère principal : rester dans une fraîcheur structurée mais jamais agressive.",
    advice: [
      "Rester sur des couleurs froides plus tranchées et lisibles.",
      "Accepter davantage d’intensité qu’un Été Doux.",
      "Éviter les tons chauds et terreux.",
    ],
    examples: {
      tops: ["framboise froide", "bleu roi adouci", "prune froide", "rose cyclamen"],
      jackets: ["gris acier", "marine froide", "bleu encre"],
      accessories: ["argent", "acier", "cuir noir froid"],
    },
    avoid: ["terracotta", "camel", "olive chaud"],
    palettes: {
      base: [
        { hex: "#C9CEDF", nom: "gris pervenche clair" },
        { hex: "#6F8091", nom: "bleu gris froid" },
        { hex: "#2F5B7A", nom: "bleu pétrole froid" },
        { hex: "#7C7380", nom: "prune grisée" },
        { hex: "#B7C9E2", nom: "bleu gris froid clair" }
      ],
      neutres: [
        { hex: "#D6DCE8", nom: "gris froid lumineux" },
        { hex: "#6F8091", nom: "bleu gris froid" },
        { hex: "#2F5B7A", nom: "bleu pétrole froid" },
        { hex: "#7C7380", nom: "prune grisée" },
        { hex: "#AFC6CF", nom: "bleu gris doux" }
      ],
      accents: [
        { hex: "#99C4CC", nom: "bleu glacier" },
        { hex: "#B89BB4", nom: "mauve rosé doux" },
        { hex: "#6FA19A", nom: "vert d’eau fumé" },
        { hex: "#B87A78", nom: "rose bois froid" },
        { hex: "#AFC6CF", nom: "bleu gris doux" }
      ]
    },
  
  },

  /* ================= AUTOMNE ================= */

  {
    name: "Automne Doux",
    season: "Automne",
    subtype: "Doux",
    axes: {
      temperature: "chaud",
      value: "moyen",
      intensity: "doux",
      contrast: "faible",
    },
    logic: "Chaud + Doux + Naturel",
    summary:
      "Palette douce, chaude et enveloppante. L’harmonie repose sur des teintes naturelles et patinées.",
    pitch:
      "Votre visage aime avant tout la chaleur patinée et la continuité visuelle. Même si la valeur n’est pas encore parfaitement tranchée, vous êtes mise en valeur par des couleurs chaudes, naturelles et peu contrastées. Quand c’est juste, les traits paraissent plus fondus, le teint plus stable et la présence plus authentique. Votre repère principal : chaleur naturelle + douceur.",
    advice: [
      "Privilégier des tons chauds, naturels et adoucis.",
      "Garder des contrastes faibles et enveloppants.",
      "Éviter les couleurs trop froides ou trop saturées.",
    ],
    examples: {
      tops: ["sable", "terracotta doux", "olive tendre", "cannelle claire"],
      jackets: ["taupe chaud", "marron doux", "camel feutré"],
      accessories: ["cuivre doux", "laiton", "cuir cognac clair"],
    },
    avoid: ["noir pur", "fuchsia", "bleu glacé"],
    palettes: {
      base: [
        { hex: "#C7A97C", nom: "camel doux" },
        { hex: "#8F877A", nom: "taupe chaud" },
        { hex: "#B78784", nom: "vieux rose terreux" },
        { hex: "#6F8F1F", nom: "olive douce" },
        { hex: "#C9833A", nom: "terracotta miel" }
      ],
      neutres: [
        { hex: "#E6DDCF", nom: "ivoire sable" },
        { hex: "#8E7F6A", nom: "taupe camel" },
        { hex: "#9E9E9E", nom: "gris moyen" },
        { hex: "#7E5A54", nom: "brun rosé" },
        { hex: "#D9BF95", nom: "beige noisette" }
      ],
      accents: [
        { hex: "#7F9A7A", nom: "vert sauge chaud" },
        { hex: "#B68E8C", nom: "rose terre cuite doux" },
        { hex: "#4F7F7D", nom: "bleu vert patiné" },
        { hex: "#A89272", nom: "beige bronze" },
        { hex: "#C79063", nom: "caramel chaud" }
      ]
    },
  
  },

  {
    name: "Automne Chaud",
    season: "Automne",
    subtype: "Chaud",
    axes: {
      temperature: "chaud",
      value: "profond",
      intensity: "vif",
      contrast: "modéré",
    },
    logic: "Chaud + Riche + Terreux",
    summary:
      "Palette chaude et généreuse. L’harmonie repose sur des tons riches, épicés et ancrés.",
    pitch:
      "Votre visage aime une chaleur plus ancrée, plus terreuse, plus naturelle. Vous êtes mise en valeur par des couleurs chaudes qui ont du corps, sans exiger un contraste extrême ni une profondeur très sombre. Quand l’harmonie est juste, le teint semble plus riche, les traits plus stables et votre présence plus incarnée. À l’inverse, les couleurs froides ou trop vives vous déconnectent de votre chaleur naturelle. Votre repère principal : des tons chauds, patinés et construits.",
    advice: [
      "Assumer des couleurs chaudes plus denses et plus riches.",
      "Privilégier les familles terre, épices et forêt chaude.",
      "Éviter les bleus froids et les gris cendrés.",
    ],
    examples: {
      tops: ["rouille", "orange brûlé", "moutarde", "brique chaude"],
      jackets: ["camel foncé", "brun chaud", "tabac"],
      accessories: ["doré vieilli", "cuir cognac", "bronze"],
    },
    avoid: ["bleu glacé", "rose froid", "gris souris"],
    palettes: {
      base: [
        { hex: "#D65A00", nom: "orange brûlé" },
        { hex: "#D9A520", nom: "moutarde dorée" },
        { hex: "#5E7432", nom: "vert mousse" },
        { hex: "#8B3F14", nom: "brun cannelle" },
        { hex: "#B87432", nom: "rouille chaude" }
      ],
      neutres: [
        { hex: "#E8E3A8", nom: "crème maïs" },
        { hex: "#C39A68", nom: "camel épicé" },
        { hex: "#6E4128", nom: "brun acajou" },
        { hex: "#808000", nom: "olive" },
        { hex: "#E6CFA1", nom: "beige doré" }
      ],
      accents: [
        { hex: "#D96C4F", nom: "terracotta" },
        { hex: "#B88A0A", nom: "jaune ocre" },
        { hex: "#990000", nom: "bordeaux chaud" },
        { hex: "#6B8E23", nom: "vert olive" },
        { hex: "#A0522D", nom: "brun cognac" }
      ]
    },
  
  },

  {
    name: "Automne Profond",
    season: "Automne",
    subtype: "Profond",
    axes: {
      temperature: "chaud",
      value: "profond",
      intensity: "doux",
      contrast: "fort",
    },
    logic: "Chaud + Profond + Enveloppant",
    summary:
      "Palette profonde, chaude et dense. L’harmonie repose sur des couleurs riches et enveloppantes.",
    pitch:
      "Vous avez une profondeur naturelle qui gagne à être structurée. Les contrastes chauds modérés vous donnent une image solide, crédible, “posée”, sans perdre votre côté chaleureux. Vous avez peut‑être observé qu’un mélange bien dosé (chaud profond + chaud plus clair) donne immédiatement une impression de maîtrise. Le piège : basculer vers des tons froids ou gris qui vous coupent de votre base chaude. Votre règle : contraste oui, mais toujours dans la même famille chaleureuse.",
    advice: [
      "Privilégier des couleurs profondes mais chaudes.",
      "Construire des harmonies plus denses que pour un Automne Doux.",
      "Éviter les couleurs froides, glacées ou trop claires.",
    ],
    examples: {
      tops: ["chocolat", "bordeaux chaud", "vert forêt chaud", "prune chaude"],
      jackets: ["brun profond", "acajou", "tabac foncé"],
      accessories: ["bronze", "cuir brun foncé", "or vieilli"],
    },
    avoid: ["blanc optique", "bleu glacial", "lavande"],
    palettes: {
      base: [
        { hex: "#A00000", nom: "rouge grenat" },
        { hex: "#B9B36A", nom: "kaki doré" },
        { hex: "#5C722F", nom: "vert forêt chaud" },
        { hex: "#B68200", nom: "ocre foncé" },
        { hex: "#A0522D", nom: "brun cuivre" }
      ],
      neutres: [
        { hex: "#E6E1A9", nom: "beige olive clair" },
        { hex: "#5A1A16", nom: "brun bordeaux" },
        { hex: "#3F3F3F", nom: "anthracite chaud" },
        { hex: "#4A3F25", nom: "brun olive sombre" },
        { hex: "#8A6A45", nom: "camel foncé" }
      ],
      accents: [
        
{ hex: "#9C0000", nom: "rouge brique profond" },
{ hex: "#2E8B2E", nom: "vert forêt" },
{ hex: "#B87433", nom: "orange cuir" },
{ hex: "#8B4513", nom: "brun selle" },
{ hex: "#C65A1E", nom: "orange brûlé" }

      ]
    },
  
  },

  /* ================= HIVER ================= */

  

  {
    name: "Hiver Froid",
    season: "Hiver",
    subtype: "Froid",
    axes: {
      temperature: "froid",
      value: "moyen",
      intensity: "vif",
      contrast: "fort",
    },
    logic: "Froid + Net + Structuré",
    summary:
      "Palette froide et précise. L’harmonie repose sur des couleurs nettes, pures et élégantes.",
    pitch:
      "Votre visage demande avant tout de la netteté froide et du contraste. Vous n’avez pas besoin d’être dans l’extrême profondeur pour être percutante : c’est la précision froide qui structure le mieux vos traits. Quand les couleurs sont franches, froides et bien dessinées, le regard se clarifie et la présence devient plus affirmée. À l’inverse, les couleurs chaudes, sourdes ou floues affaiblissent votre impact. Votre repère principal : de la clarté froide avec du relief net.",
    advice: [
      "Rester dans un univers froid et très lisible.",
      "Préférer les couleurs pures ou bijoux froids.",
      "Éviter les tons chauds, terreux ou fondus.",
    ],
    examples: {
      tops: ["bleu cobalt", "framboise froide", "vert émeraude froid", "prune froide"],
      jackets: ["anthracite froid", "marine froide", "gris acier"],
      accessories: ["argent", "platine", "cuir noir"],
    },
    avoid: ["camel", "moutarde", "terracotta"],
    palettes: {
      base: [
        { hex: "#F01414", nom: "rouge pur" },
        { hex: "#1626E3", nom: "bleu cobalt" },
        { hex: "#0E9F6E", nom: "vert émeraude vif" },
        { hex: "#8A30C9", nom: "violet électrique" },
        { hex: "#E3133A", nom: "framboise froide" }
      ],
      neutres: [
        
{ hex: "#FFFFFF", nom: "blanc pur" },
{ hex: "#000000", nom: "noir pur" },
{ hex: "#0B0B8F", nom: "bleu marine froid" },
{ hex: "#7A8C9A", nom: "gris acier bleuté" },
{ hex: "#B5B5B5", nom: "gris moyen" }

      ],
      accents: [
        { hex: "#2E86DE", nom: "bleu électrique" },
        { hex: "#F0128A", nom: "rose fuchsia" },
        { hex: "#1DB7B7", nom: "turquoise vif" },
        { hex: "#5B0F8A", nom: "violet profond" },
        { hex: "#046B0B", nom: "vert sapin" }
      ]
    },
  
  },

  {
    name: "Hiver Lumineux",
    season: "Hiver",
    subtype: "Lumineux",
    axes: {
      temperature: "froid",
      value: "clair",
      intensity: "vif",
      contrast: "fort",
    },
    logic: "Froid + Lumineux + Contrasté",
    summary:
      "Palette éclatante, froide et contrastée. L’harmonie repose sur des couleurs pures et lumineuses.",
    pitch:
      "Le contraste est votre terrain naturel : votre visage prend toute sa dimension quand on assume des oppositions froides. Quand c’est juste, vos traits deviennent plus sculptés, votre regard plus percutant, et votre image gagne une autorité immédiate. Vous avez peut‑être remarqué que certaines associations très nettes vous donnent un “wow” instantané. À l’inverse, les couleurs trop douces ou trop chaudes vous effacent et vous donnent l’air fatigué. Votre clé : contraste froid = charisme.",
    advice: [
      "Choisir des couleurs froides et lumineuses, très lisibles.",
      "Assumer le contraste et la pureté des tons.",
      "Éviter les couleurs ternes ou terreuses.",
    ],
    examples: {
      tops: ["fuchsia froid", "bleu électrique", "rouge froid", "turquoise lumineux"],
      jackets: ["blanc pur", "noir net", "marine froide"],
      accessories: ["argent brillant", "verni noir", "laque fuchsia"],
    },
    avoid: ["taupe chaud", "olive terne", "camel"],
    palettes: {
      base: [
        { hex: "#F012E0", nom: "fuchsia électrique" },
        { hex: "#1CCFCF", nom: "turquoise néon" },
        { hex: "#1A1AE3", nom: "bleu électrique" },
        { hex: "#8A12C9", nom: "violet vif" },
        { hex: "#F01414", nom: "rouge pur" }
      ],
      neutres: [
          { hex: "#FFFFFF", nom: "blanc pur" },
          { hex: "#000000", nom: "noir" },
          { hex: "#0B0B8F", nom: "bleu marine intense" },
          { hex: "#FFFFFF", nom: "blanc pur lumineux" },
          { hex: "#23237A", nom: "bleu encre" }
      ],
      accents: [
        { hex: "#00F000", nom: "vert néon" },
        { hex: "#E85FA6", nom: "rose vif" },
        { hex: "#4B6EDC", nom: "bleu roi clair" },
        { hex: "#F5EB00", nom: "jaune citron intense" },
        { hex: "#2E86DE", nom: "bleu azur électrique" }
      ]
    },
  
  },

  {
    name: "Hiver Profond",
    season: "Hiver",
    subtype: "Profond",
    axes: {
      temperature: "froid",
      value: "profond",
      intensity: "vif",
      contrast: "fort",
    },
    logic: "Froid + Profond + Vif",
    summary:
      "Palette intense et contrastée. L’harmonie repose sur la profondeur et la netteté.",
    pitch:
      "Vous êtes dans le registre le plus intense : froid, profond, contrasté. Quand c’est juste, votre visage devient immédiatement magnétique : traits nets, regard puissant, image très affirmée. Vous avez peut‑être déjà remarqué que certaines couleurs “bijou” ou oppositions nettes vous donnent un charisme instantané. À l’inverse, les tons adoucis ou terreux vous effacent et vous fatiguent. Votre règle est simple : si c’est fort, que ce soit froid et profond.",
    advice: [
      "Assumer des contrastes forts.",
      "Privilégier des couleurs profondes et froides.",
      "Éviter les teintes trop fondues ou chaudes.",
    ],
    examples: {
      tops: ["noir", "bordeaux", "bleu nuit", "prune profond"],
      jackets: ["anthracite", "marine profond", "noir structuré", "charbon"],
      accessories: ["argent", "noir", "gunmetal", "laque sombre"],
    },
    avoid: ["beige chaud", "orange", "camel doré", "terracotta clair"],
    palettes: {
      base: [
        { hex: "#99001A", nom: "bordeaux froid" },
        { hex: "#1F5BB5", nom: "bleu roi profond" },
        { hex: "#003F2D", nom: "vert sapin profond" },
        { hex: "#6A2C62", nom: "prune profonde" },
        { hex: "#B61F1F", nom: "rouge rubis sombre" }
      ],
      neutres: [
        { hex: "#000000", nom: "noir" },
        { hex: "#3E4E59", nom: "anthracite bleuté" },
        { hex: "#0D158C", nom: "bleu nuit" },
        { hex: "#4B3A38", nom: "brun espresso froid" },
        { hex: "#C9D6DE", nom: "gris glace" }
      ],
      accents: [
        { hex: "#4A3F8C", nom: "indigo" },
        { hex: "#2F8C55", nom: "vert émeraude profond" },
        { hex: "#8A2FD3", nom: "violet intense" },
        { hex: "#C91F3A", nom: "rouge framboise" },
        { hex: "#6E7F8F", nom: "gris ardoise bleuté" }
      ]
    }
  
  },

  /* ============== FALLBACK TECHNIQUE ============== */

  {
    name: "Default",
    hidden: true,
    season: "Generic",
    subtype: "Generic",
    axes: {
      temperature: "chaud",
      value: "moyen",
      intensity: "doux",
      contrast: "modéré",
    },
    logic: "Analyse basée sur axes",
    summary: "Votre profil repose sur l’équilibre de vos axes colorimétriques.",
    pitch:
      "Votre harmonie repose sur l’équilibre naturel de vos couleurs. En respectant vos axes dominants, vous mettez en valeur votre visage sans créer de rupture visuelle.",
    advice: [
      "Respecter vos axes dominants.",
      "Éviter les extrêmes non cohérents.",
      "Privilégier l’harmonie globale.",
    ],
    examples: {
      tops: [],
      jackets: [],
      accessories: [],
    },
    avoid: [],
    palettes: {
      base: [],
      coeur: [],
      neutres: [],
      accents: [],
      complements: [],
    },
  },
];

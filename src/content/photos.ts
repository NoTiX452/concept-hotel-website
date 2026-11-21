// Every photo on the site. Each slot needs a file in src/assets/photos/ named
// after the slot (for example hero.jpg) and alt text.
//
// Photos are free-licence stock (Unsplash or Pexels). They show other places,
// not this made-up hotel; the photos page and the case study say so. A credit
// is optional; when given, the photos page lists it.
//
// While a file or alt text is missing, `npm run dev` shows a labelled "photo
// pending" box and `npm run build` fails, so an unfinished site cannot ship.

export type Credit = {
  photographer: string;
  source: "Unsplash" | "Pexels";
  // The photo's own page on the source site.
  url: string;
};

export type PhotoSlot = {
  // What the photo should show. Used to choose it, and on the pending box.
  subject: string;
  // Describes the chosen photo. Rewrite it once the photo is picked.
  alt: string;
  credit?: Credit;
  // Which part of the photo stays in view when a frame crops it (CSS object-position).
  focus?: string;
};

export const photos = {
  hero: {
    subject: "Green mountain meadow at the edge of a fir forest, early morning, wide",
    alt: "Sunlit green meadows between dark fir forests, with hazy mountain peaks in the distance.",
  },
  house: {
    subject: "Small wooden house or cabin in the mountains",
    alt: "Wooden A-frame houses among larch trees turned orange in autumn, lit by low evening sun.",
  },
  "room-meadow": {
    subject: "Simple bright bedroom with wood and a window onto green countryside",
    alt: "A bed with white linen and a striped pillow in a wood-panelled room, beside a bright curtained window and a pleated lamp.",
  },
  "room-forest": {
    subject: "Calm bedroom with wood panelling and trees outside the window",
    alt: "A bed with white linen and cushions in front of a large window looking straight into a pine forest.",
  },
  "room-loft": {
    subject: "Attic bedroom under exposed wooden roof beams",
    alt: "An attic bedroom under exposed wooden beams, with a stone fireplace, a wooden wardrobe and wide plank floors.",
  },
  "room-family": {
    subject: "Rustic room with several beds, or a bedroom opening onto a garden",
    alt: "Two beds with striped purple and yellow covers in a wooden room under a sloping roof, with sun through the windows.",
  },
  "dining-breakfast": {
    subject: "Rustic breakfast table: bread, cheese, jam, honey",
    alt: "A wooden kitchen table laid for breakfast with bread rolls, jars of fruit, coffee cups and a vase of roses and daisies.",
  },
  "dining-dinner": {
    subject: "Hearty home-cooked dish on a wooden table, warm evening light",
    alt: "A wooden table outdoors laid with bread, cheese, cured ham and grapes while someone pours a drink.",
  },
  "area-ice-cave": {
    subject: "Ice inside a cave (ideally Scărișoara Ice Cave)",
    alt: "A person standing small inside a tall cave of blue ice, looking out through a bright oval opening.",
  },
  "area-plateau": {
    subject: "Karst plateau with meadows and forest (ideally Padiș, Apuseni)",
    alt: "A deep ravine of bare orange earth cutting through fir forest, with forested ridges under a grey sky.",
  },
  "area-ponor": {
    subject: "Large limestone cave entrance or gorge (ideally Cetățile Ponorului)",
    alt: "A huge mossy limestone cave mouth seen from above, with wooden walkways leading visitors down to ice at the bottom.",
  },
  "area-winter": {
    subject: "Snowy forested mountains in Romania",
    alt: "A mountain village under fresh snow, with cars on a curving road and snow-laden fir trees below low clouds.",
  },
  "getting-here": {
    subject: "Winding country road through green hills or mountains",
    alt: "A road curving through a narrow gorge between high limestone cliffs, with autumn trees above a stone wall.",
    focus: "center 82%",
  },
} satisfies Record<string, PhotoSlot>;

export type PhotoName = keyof typeof photos;

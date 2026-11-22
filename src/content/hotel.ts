// All hotel copy. Zmeuriș Mountain House is made up: a concept project.
// Rules for this file:
// - The hotel, its rooms, prices and menus are fiction and are labelled as such.
// - Real places (the Apuseni Mountains and what is in them) are described only
//   with general, well-known facts. No distances or travel times are given.
// - No reviews, ratings, awards or star classification. They would be fake.

import type { PhotoName } from "./photos";

type Illustrated = { name: string; photo: PhotoName; text: string };

export const hotel = {
  name: "Zmeuriș Mountain House",
  shortName: "Zmeuriș",
  // "Zmeuriș" is Romanian for a raspberry patch.
  meaning: "Zmeuriș means raspberry patch. They grow wild along the edge of the meadow.",
  region: "Apuseni Mountains, Romania",
  rooms: 12,
  tagline: "Twelve rooms where the meadow meets the fir forest.",
  intro:
    "A small wooden hotel high in the Apuseni Mountains. Twelve rooms, one kitchen, and the forest a few steps from the door. Come for the caves and the plateaus; stay for the quiet.",
  author: "Nedelcu Valentin",
  repo: "https://github.com/NoTiX452/concept-hotel-website",
} as const;

// Shown on every page. The wording must make it impossible to mistake this for a real hotel.
export const conceptNotice = {
  short: "Concept project. Zmeuriș is not a real hotel.",
  long: "Zmeuriș Mountain House is a made-up hotel, designed and built by Nedelcu Valentin as a portfolio concept. The rooms, prices and menus are fiction, and nothing here can be booked. The mountains are real.",
};

export const nav = [
  { label: "Rooms", href: "/rooms/" },
  { label: "Dining", href: "/dining/" },
  { label: "The area", href: "/the-area/" },
  { label: "Getting here", href: "/getting-here/" },
] as const;

// The concept booking app (NoTiX452/concept-booking-app), a separate project
// for the same made-up hotel. Its room types match the rooms below.
// Check this address after the app is deployed.
export const bookingApp = {
  url: "https://concept-booking.concept-hotel-website.workers.dev",
} as const;

export type Room = {
  slug: string;
  // The room type in the booking app.
  bookingType: "meadow" | "forest" | "loft" | "family";
  name: string;
  photo: PhotoName;
  count: number;
  sizeM2: number;
  guests: number;
  beds: string;
  view: string;
  // Sample price per night in lei. Fiction, shown with a note saying so.
  priceFrom: number;
  summary: string;
  description: string[];
  features: string[];
};

export const rooms: Room[] = [
  {
    slug: "meadow-room",
    bookingType: "meadow",
    name: "Meadow Room",
    photo: "room-meadow",
    count: 5,
    sizeM2: 22,
    guests: 2,
    beds: "One double bed",
    view: "The meadow and the ridge beyond it",
    priceFrom: 520,
    summary: "Our most common room: a double bed, a wide window and the meadow outside it.",
    description: [
      "Five of our twelve rooms face south over the meadow. Mornings start with light across the grass and, in early summer, with the hay being cut.",
      "Pine floors, wool blankets woven in the valley, and a window seat wide enough for a book and a cup of tea.",
    ],
    features: ["Window seat", "Shower", "Wool blankets", "Desk", "Wi-Fi"],
  },
  {
    slug: "forest-room",
    bookingType: "forest",
    name: "Forest Room",
    photo: "room-forest",
    count: 4,
    sizeM2: 24,
    guests: 2,
    beds: "One double bed or two singles",
    view: "The fir forest, close enough to hear",
    priceFrom: 560,
    summary: "The quiet side of the house, facing straight into the fir trees.",
    description: [
      "Four rooms on the north side look into the forest, which starts a few metres from the wall. They stay cool in August and very dark at night.",
      "Choose a double bed or two singles when you book.",
    ],
    features: ["Double or twin beds", "Shower", "Blackout curtains", "Desk", "Wi-Fi"],
  },
  {
    slug: "loft-suite",
    bookingType: "loft",
    name: "Loft Suite",
    photo: "room-loft",
    count: 2,
    sizeM2: 32,
    guests: 3,
    beds: "One double bed and a daybed",
    view: "Both the meadow and the forest, from under the roof",
    priceFrom: 720,
    summary: "Two suites under the roof beams, with a sitting area and a bath.",
    description: [
      "The two suites take up the top floor. The roof beams are left open, with windows at both ends of the room: meadow on one side, forest on the other.",
      "A daybed in the sitting area sleeps a third guest. These are the only rooms with a bath.",
    ],
    features: ["Bath and shower", "Sitting area", "Daybed for a third guest", "Kettle and tea", "Wi-Fi"],
  },
  {
    slug: "family-room",
    bookingType: "family",
    name: "Family Room",
    photo: "room-family",
    count: 1,
    sizeM2: 36,
    guests: 4,
    beds: "One double bed and two singles, in two rooms",
    view: "The meadow and the garden",
    priceFrom: 860,
    summary: "Two connected rooms on the ground floor, with a door straight onto the garden.",
    description: [
      "One room for the parents, one with two single beds for the children, and a shared bathroom between them.",
      "The garden door means muddy boots never have to cross the hall.",
    ],
    features: ["Two connected rooms", "Garden door", "Shower", "Boot rack", "Wi-Fi"],
  },
];

export const dining = {
  heading: "One kitchen, *one table* at a time.",
  intro:
    "There is no menu to study. Breakfast is laid out every morning, and dinner is one set menu, cooked for whoever is staying that night.",
  meals: [
    {
      name: "Breakfast",
      time: "07:30 to 10:30",
      photo: "dining-breakfast",
      text: "Bread baked in the morning, cheese and butter from the valley, eggs, honey, and raspberry jam made from the patch the house is named after.",
    },
    {
      name: "Dinner",
      time: "19:30, one sitting",
      photo: "dining-dinner",
      text: "Three courses from what the season brings: mushrooms in autumn, lamb in spring, and polenta all year. Tell us about allergies or a vegetarian diet when you arrive.",
    },
  ] satisfies (Illustrated & { time: string })[],
  packedLunch: "For long walks, ask the evening before and we pack lunch for the trail.",
  // Fiction: shown with the concept note.
  sampleMenu: {
    season: "Autumn",
    courses: [
      "Mushroom soup with sour cream and dill",
      "Pork with cabbage, polenta and pickled peppers",
      "Pancakes with raspberry jam and sweet cheese",
    ],
  },
};

// Real places in the Apuseni Mountains. General facts only.
export const area = {
  heading: "Limestone, ice, and *long walks.*",
  intro:
    "The Apuseni are low, green mountains full of limestone: caves, sinkholes and gorges, with villages spread along the valleys. Much of the area is protected as the Apuseni Natural Park.",
  places: [
    {
      name: "Scărișoara Ice Cave",
      photo: "area-ice-cave",
      text: "A cave that holds a block of ice thousands of years old, one of the largest underground glaciers in Europe. Visits follow wooden stairs down into the cold.",
    },
    {
      name: "Padiș Plateau",
      photo: "area-plateau",
      text: "A high karst plateau of meadows and forest, and the starting point for marked trails to the area's best-known caves and gorges.",
    },
    {
      name: "Cetățile Ponorului",
      photo: "area-ponor",
      text: "Three enormous sinkholes and a cave entrance with high limestone walls. It is a long walk in, and worth it.",
    },
    {
      name: "Winter",
      photo: "area-winter",
      text: "Snow usually covers the mountains from December. The village of Arieșeni has ski slopes, and the trails turn into snowshoe routes.",
    },
  ] satisfies Illustrated[],
  note: "Trails and opening times change with the seasons and the weather. Check with the park or the cave before you go.",
  // The stock photos are of similar landscapes, not of the places named.
  photoNote: "The photos show similar landscapes, not the places named.",
};

export const house = {
  heading: "Built of wood, *kept small.*",
  text: [
    "Three floors of fir and larch, a long kitchen table, and a porch facing the meadow.",
    "The house sits where the meadow ends and the forest begins, so every window looks onto one or the other.",
  ],
  aside: "Small enough that we learn your name by the second morning.",
};

// Homepage copy. Headings may mark an italic phrase with *asterisks*.
// Figures repeat facts stated elsewhere in this file; they add none.
export const home = {
  hero: {
    heading: "Where the meadow meets *the fir forest.*",
    scroll: "Scroll to walk in",
  },
  figures: [
    { value: "03", label: "floors of fir and larch" },
    { value: "12", label: "rooms in four kinds" },
    { value: "01", label: "kitchen and one long table" },
  ],
  chapters: {
    house: "The house",
    rooms: "Rooms",
    dining: "The table",
    area: "The mountains",
    arrive: "The road up",
  },
  rooms: {
    heading: "Twelve rooms, *four kinds.*",
    lede: "Every room has wooden floors, wool blankets, and a window onto either the meadow or the forest.",
  },
  arrive: {
    text: "Two airports, one mountain road, and parking beside the house.",
    cta: "Plan the journey",
  },
};

export const gettingHere = {
  heading: "The road *up.*",
  intro:
    "Zmeuriș is made up, so there is no address. If it were real, this is how the page would help you get here.",
  steps: [
    {
      title: "By plane",
      text: "Cluj-Napoca and Oradea are the closest airports to the Apuseni Mountains. Both have car hire.",
    },
    {
      title: "By car",
      text: "The last part of the road climbs through the valleys and is narrow in places. In winter, check the road conditions before you set out.",
    },
    {
      title: "On arrival",
      text: "Parking is beside the house. Check-in is from 15:00, and we hold dinner if you tell us you will be late.",
    },
  ],
  photo: "getting-here" as const satisfies PhotoName,
};

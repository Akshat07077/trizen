export type ToyImageSet = {
  hero: string;
  bandMain: string;
  bandDetail: string;
  bandProcess: string;
  content: [string, string];
};

const trays = {
  a: "/images/toy/packaging-trays/toy-blister-packaging.jpg",
  b: "/images/toy/packaging-trays/toy-blister-packaging-2.jpg",
  c: "/images/toy/packaging-trays/toy-blister-packaging-3.jpg",
};

const action = {
  a: "/images/toy/action-figure/action-figure-protective-clamshell-case.jpg",
  b: "/images/toy/action-figure/monster-protective-clamshell-packaging.jpg",
  c: "/images/toy/action-figure/star-echo-figure-protective-clamshell-packaging.jpg",
};

const setInserts = {
  a: "/images/toy/set-inserts/toy-set-thermoforming-packaging.jpg",
  b: "/images/toy/set-inserts/custom-toy-set-thermoforming-packaging.jpg",
  c: "/images/toy/set-inserts/toy-thermoforming-packaging.jpg",
};

const custom = {
  a: "/images/toy/custom-molded/custom-molded-hot-wheels-blister-packaging.jpg",
  b: "/images/toy/custom-molded/custom-molded-cossmic-blister-packaging.jpg",
  c: "/images/toy/custom-molded/forest-guardian-toy-blister-packaging.jpg",
};

const protective = {
  a: "/images/toy/protective/protective-toy-thermoforming-boxes.jpg",
  b: "/images/toy/protective/protective-toy-thermoforming-packaging-boxes.jpg",
  c: "/images/toy/protective/toy-thermoforming-packaging-boxes.jpg",
};

const retail = {
  a: "/images/toy/retail-display/retail-display-toy-packaging-box.avif",
  b: "/images/toy/retail-display/retail-display-custom-toy-packaging-box.avif",
  c: "/images/toy/retail-display/toy-displaty-packaging-box.avif",
};

function imgs(
  a: string,
  b: string,
  c: string,
): ToyImageSet {
  return { hero: a, bandMain: a, bandDetail: b, bandProcess: c, content: [b, c] };
}

export const TOY_IMAGES: Record<string, ToyImageSet> = {
  category: imgs(trays.a, trays.b, trays.c),
  "action-figure": imgs(action.a, action.b, action.c),
  "set-inserts": imgs(setInserts.a, setInserts.b, setInserts.c),
  "custom-molded": imgs(custom.a, custom.b, custom.c),
  "packaging-trays": imgs(trays.a, trays.b, trays.c),
  protective: imgs(protective.a, protective.b, protective.c),
  "retail-display": imgs(retail.a, retail.b, retail.c),
};

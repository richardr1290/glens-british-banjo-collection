const fs = require("fs");

const INVENTORY_FILE = "banjo-folder-inventory.json";
const CATALOGUE_FILE = "catalogue-extracted.json";
const OUTPUT_FILE = "collection-master.json";

console.log("=================================");
console.log("BUILDING COLLECTION MASTER DATA");
console.log("=================================\n");

const inventory = JSON.parse(
  fs.readFileSync(INVENTORY_FILE, "utf8")
);

const catalogue = JSON.parse(
  fs.readFileSync(CATALOGUE_FILE, "utf8")
);

console.log("Inventory records:", inventory.length);
console.log("Catalogue entries:", catalogue.entries.length);
console.log("");

const ignoredRoots = new Set([
  "cropped images",
  "Identify 1",
  "butler Identify 2"
]);

const imageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp"
];

const PHOTO_ROOT =
  "E:\\glen\\banjo website-eleventy\\banjos";

function slug(value) {

  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

}

function normaliseName(name) {

  return String(name || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");

}

function getPhotos(relativeFolder) {

  const cleanFolder =
    relativeFolder.replace(/\\/g, "/");

  const fullFolder =
    `${PHOTO_ROOT}\\${cleanFolder.replace(/\//g, "\\")}`;

  if (!fs.existsSync(fullFolder)) {
    return [];
  }

  return fs.readdirSync(
    fullFolder,
    { withFileTypes: true }
  )
  .filter(item => {

    if (!item.isFile()) {
      return false;
    }

    const extension =
      item.name
        .toLowerCase()
        .slice(
          item.name.lastIndexOf(".")
        );

    return imageExtensions.includes(extension);

  })
.map(item => {
  return `https://images.glensbritishbanjocollection.co.uk/${cleanFolder}/${item.name}`;
});

}

function findCatalogueEntries(maker) {

  const target =
    normaliseName(maker);

  return catalogue.entries.filter(
    entry =>
      normaliseName(entry.maker) === target
  );

}


// ------------------------------------------------------------
// FIND MODEL FOLDERS
// ------------------------------------------------------------

const modelFolders = [];

for (const item of inventory) {

  const folder = item.Folder;

  if (!folder.includes("\\")) {
    continue;
  }

  const parts =
    folder.split("\\");

  const maker =
    parts[0];

const model =
  parts.slice(1).join("/");

  if (ignoredRoots.has(maker)) {
    continue;
  }

 const photos =
  getPhotos(folder.replace(/\\/g, "/"));

  modelFolders.push({

    maker,
    model,
    photos

  });

}


// ------------------------------------------------------------
// MAKERS
// ------------------------------------------------------------

const makerNames = [];

for (const item of modelFolders) {

  if (!makerNames.includes(item.maker)) {

    makerNames.push(item.maker);

  }

}


// ------------------------------------------------------------
// BUILD MAKERS + FLAT MODEL LIST
// ------------------------------------------------------------

const makers = [];
const models = [];

let modelCounter = 1;

for (const makerName of makerNames) {

  const makerModels =
    modelFolders
      .filter(
        item =>
          item.maker === makerName
      );


  const catalogueReferences =
    findCatalogueEntries(
      makerName
    );


  const makerObject = {

    name:
      makerName,

    slug:
      slug(makerName),

    makerWriteup:
      null,

    catalogueReferences:
      catalogueReferences.map(
        entry => ({

          catalogueIndex:
            entry.catalogueIndex,

          sourceParagraph:
            entry.sourceParagraph,

          heading:
            entry.heading

        })
      ),

    models: []

  };


  for (const item of makerModels) {

    const modelObject = {

      id:
        `collection-${String(
          modelCounter
        ).padStart(3, "0")}`,

      maker:
        makerName,

      makerSlug:
        slug(makerName),

      title:
        item.model,

      slug:
        slug(item.model),

      folder:
        item.model,

      photoCount:
        item.photos.length,

      photos:
        item.photos

    };


    makerObject.models.push(
      modelObject
    );

    models.push(
      modelObject
    );

    modelCounter++;

  }


  makers.push(
    makerObject
  );

}


// ------------------------------------------------------------
// SUMMARY
// ------------------------------------------------------------

const totalPhotos =
  models.reduce(
    (total, model) =>
      total + model.photoCount,
    0
  );


// ------------------------------------------------------------
// FINAL DATA
// ------------------------------------------------------------

const output = {

  generated:
    new Date().toISOString(),

  structure:
    "maker-with-flat-model-index",

  rules: {

    makerWriteups:
      "One write-up per maker",

    modelWriteups:
      "Not required unless supplied separately",

    modelTitles:
      "Taken directly from folder names",

    photographs:
      "Every photograph belongs to a model folder"

  },

  summary: {

    makers:
      makers.length,

    models:
      models.length,

    photographs:
      totalPhotos

  },

  makers,

  models

};


// ------------------------------------------------------------
// WRITE
// ------------------------------------------------------------

fs.writeFileSync(

  OUTPUT_FILE,

  JSON.stringify(
    output,
    null,
    2
  ),

  "utf8"

);


// ------------------------------------------------------------
// REPORT
// ------------------------------------------------------------

console.log("=================================");
console.log("SUMMARY");
console.log("=================================");

console.log(
  "Makers:",
  makers.length
);

console.log(
  "Models/items:",
  models.length
);

console.log(
  "Photographs:",
  totalPhotos
);

console.log("");

console.log("Created:");
console.log(OUTPUT_FILE);

console.log("");

console.log("=================================");
console.log("COLLECTION MASTER BUILD COMPLETE");
console.log("=================================");
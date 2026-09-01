module.exports = function(eleventyConfig) {

  // ----------------------------------------------------------
  // PHOTOGRAPHS
  // ----------------------------------------------------------

  eleventyConfig.addPassthroughCopy("banjos");


  // ----------------------------------------------------------
  // WEBSITE ASSETS
  // ----------------------------------------------------------

  eleventyConfig.addPassthroughCopy({
    "images": "images",
    "styles.css": "styles.css",
    "script.js": "script.js"
  });


  // ----------------------------------------------------------
  // SELLING DATA
  // ----------------------------------------------------------

  eleventyConfig.addGlobalData(
    "banjos",
    require("./banjos.json")
  );


  // ----------------------------------------------------------
  // COLLECTION DATA
  // ----------------------------------------------------------

  eleventyConfig.addGlobalData(
    "collectionMaster",
    require("./collection-master.json")
  );


  // ----------------------------------------------------------
  // MAKER WRITE-UPS
  // ----------------------------------------------------------

  eleventyConfig.addGlobalData(
    "makerWriteups",
    require("./maker-writeups.json")
  );


  // ----------------------------------------------------------
  // SLUG FILTER
  // ----------------------------------------------------------

  eleventyConfig.addFilter(
    "slug",
    function(value) {

      return String(value || "")
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    }
  );


  // ----------------------------------------------------------
  // ELEVENTY
  // ----------------------------------------------------------

  return {

    dir: {
      input: ".",
      output: "_site"
    }

  };

};

const { normalizeURL, crawlPage } = require("./crawl.js");
const { printReport } = require("./report.js");

const { argv } = require("node:process");

// https://wagslane.dev

async function main() {
  if (argv.length <= 2) {
    console.error("not enough arguments");
    return -1;
  }

  if (argv.length >= 4) {
    console.error("to many arguments");
    return -1;
  }
  console.log(`the crawller is crawwwling the ${argv[2]}, uuuuuhho creepy`);

  const pageToCrawl = argv[2];

  const resultOfCrawling = await crawlPage(pageToCrawl, pageToCrawl, {});
  printReport(resultOfCrawling);
}

main();

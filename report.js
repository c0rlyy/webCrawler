function printReport(pages) {
  console.log("starting the report");
  console.log("------------------------");

  for (const url in pages) {
    if (Object.hasOwnProperty.call(pages, url)) {
      console.log(`found ${pages[url]} internal links to ${url}`);
    }
  }

  console.log("END OF REPORT");
  console.log("------------------------");
}

module.exports = {
  printReport,
};

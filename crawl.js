const { JSDOM } = require("jsdom");

function normalizeURL(url) {
  const urlObj = new URL(url);
  let fullPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (fullPath.length > 0 && fullPath.slice(-1) === "/") {
    fullPath = fullPath.slice(0, -1);
  }
  return fullPath;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const aElements = dom.window.document.querySelectorAll("a");
  for (const aElement of aElements) {
    if (aElement.href.slice(0, 1) === "/") {
      try {
        urls.push(new URL(aElement.href, baseURL).href);
      } catch (err) {
        console.log(`${err.message}: ${aElement.href}`);
      }
    } else {
      try {
        urls.push(new URL(aElement.href).href);
      } catch (err) {
        console.log(`${err.message}: ${aElement.href}`);
      }
    }
  }
  return urls;
}

async function crawlPage(rootUrl, currentUrl, pages) {
  try {
    const rootDomain = new URL(rootUrl).hostname;
    let currentDomain = new URL(currentUrl).hostname;
    if (rootDomain !== currentDomain) {
      return pages;
    }
    //let normalizedRoot = normalizeURL(rootUrl);
    let normalizedCurrent = normalizeURL(currentUrl);
    if (pages.hasOwnProperty(`${normalizedCurrent}`)) {
      pages[normalizedCurrent]++;
      return pages;
    }
    pages[normalizedCurrent] = 1;
    const response = await fetch(currentUrl);
    if (response.status >= 400) {
      throw new Error("error while making the request");
    }
    const responseContentType = response.headers.get("content-type");
    if (!responseContentType.includes("text/html")) {
      throw new Error(`wrong content type at url: ${currentUrl}`);
    }
    const htmlBody = await response.text();
    const listOfUrls = getURLsFromHTML(htmlBody, rootUrl);
    for (const url of listOfUrls) {
      crawlPage(rootUrl, url, pages);
    }
    return pages;
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {
  normalizeURL,
  crawlPage,
  getURLsFromHTML,
};

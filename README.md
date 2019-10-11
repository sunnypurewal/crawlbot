# Crawlbot

### See [crawlbot-server](https://www.npmjs.com/package/crawlbot-server) to interact with crawlbot through your browser.

Crawlbot is an easy to use library for crawling websites that use [Sitemaps](https://www.sitemaps.org/). It is inspired by the popular Python library Scrapy's [SitemapSpider](https://docs.scrapy.org/en/latest/topics/spiders.html#sitemapspider).

## Usage
### `crawlbot.crawl(domain, since, onHTML, onExit): ChildProcess`
```
const crawlbot = require("crawlbot")

const onHTML = (html, url) => {
  console.log("Got html for ", url)
}

const onExit = (code, signal) => {
  console.log("Crawler exited with code", code)
}

crawlbot.crawl("qz.com", "2019-10-11", onHTML, onExit)

const forkedProcess = crawlbot.crawl("qz.com", "2019-10-11", onHTML, onExit)
/* forkedProcess.kill() // This will kill the crawler */
```
This forks a Node.js process that parses `domain`'s sitemap and calls `onHTML(html,url)` every time it downloads a page.

## Notes

Crawlbot will only crawl websites that have a valid sitemap. It will also only crawl webpages that have been modified since the date provided in the `since` parameter. If the date of the page cannot be infered from the sitemap, it will not be crawled.
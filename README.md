# Crawlbot

Crawlbot is an easy to use library for crawling websites that use [Sitemaps](https://www.sitemaps.org/). It is inspired by the popular Python library Scrapy's [SitemapSpider](https://docs.scrapy.org/en/latest/topics/spiders.html#sitemapspider).

# Usage
`crawlbot.crawl(domain, since, onHTML, onExit): ChildProcess`
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
```
`crawl(...)` will fork a Node.js process that parses `domain`'s sitemap and calls `onHTML(html,url)` every time it downloads a page.
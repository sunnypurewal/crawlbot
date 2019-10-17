'use strict'

const crawlbot = require("./crawlbot")

module.exports = {
  crawl: crawlbot.crawl,
  multicrawl: crawlbot.multicrawl
}
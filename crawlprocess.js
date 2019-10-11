'use strict'
const hittp = require("hittp")
const getsitemap = require("getsitemap")

const crawl = (url, since) => {
  if (!url) return
  const mapper = new getsitemap.SiteMapper()
  mapper.configure({cachePath: null})
  mapper.map(url, since).then((sitemapstream) => {
    sitemapstream.on("data", (chunk) => {
      const chunkstring = chunk.toString()
      let chunkobj = null
      try {
        chunkobj = JSON.parse(chunkstring)
      } catch (err) {
        console.error(err.message)
        return
      }
      const url = hittp.str2url(chunkobj.loc)
      if (!url) return
      hittp.get(url).then((html) => {
        html = html.toString()
        process.send({ event: "pagecrawled", body: {url:url.href, html}})
      }).catch((err) => {
        console.error(err.message)
      })
    })
    sitemapstream.on("close", () => {
    })
  }).catch((err) => {
    console.error(err.message)
  })
}

if (process.argv.length < 4) {
  throw new Error("Not enough arguments to 'crawl.js'.\nnode crawl.js <domain> <since>\nExample: node crawl.js cnn.com 2019-10-10")
}
let url = hittp.str2url(process.argv[2])
if (!url) {
  throw new Error("Invalid URL supplied for 'domain' parameter")
}
let date = process.argv[3]
let parsedDate = null
if (typeof(date) === "string") {
  parsedDate = Date.parse(date)
  if (parsedDate === NaN) {
    parsedDate = Date.parse(parseFloat(date))
  }
  if (parsedDate === NaN) {
    throw new Error("Invalid date string supplied for 'since' parameter")
  }
} else {
  throw new Error("Invalid type supplied for 'since' parameter, must be string")
}

crawl(url, parsedDate)
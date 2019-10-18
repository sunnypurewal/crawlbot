'use strict'
const hittp = require("hittp")
const getsitemap = require("getsitemap")
const fs = require("fs")
const Mercury = require("@postlight/mercury-parser")

const crawl = (url, since, file) => {
  if (!url) return
  const mapper = new getsitemap.SiteMapper()
  // mapper.configure({cachePath: null})
  console.log("Crawling", url.href || url)
  mapper.map(url, since).then((sitemapstream) => {
    sitemapstream.on("data", (chunk) => {
      const chunkstring = chunk.toString()
      const split = chunkstring.split("|")
      const pageurl = hittp.str2url(split[0])
      if (!pageurl) return
      // hittp.stream(pageurl).then((httpstream) => {
      hittp.get(pageurl).then((html) => {
        Mercury.parse(pageurl.href, {html, contentType:"text"}).then((article) => {
          file.write(`${pageurl.href}||${article.title}||${article.content}||${article.date_published}||${article.author}`)
        })
        // httpstream.pipe(article(pageurl.href, (err, result) => {
        //   if (!err) {
        //     file.write(`${pageurl.href}|||||${result.title}|||||${result.text}|||||`)
        //   }
        // }))
      }).catch((err) => {
        //console.error(err.message)
      })
    })
    sitemapstream.on("close", () => {
      // console.log("Enqueued all URLs from sitemap", url.href || url)
    })
  }).catch((err) => {
    // console.error(err)
  })
}

if (process.argv.length < 4) {
  throw new Error("Not enough arguments to 'crawl.js'.\nnode crawl.js <domain> <since>\nExample: node crawl.js cnn.com 2019-10-10")
} else if (process.argv.length === 4) {
  let url = hittp.str2url(process.argv[2])
  if (!url) {
    throw new Error("Invalid URL supplied for 'domain' parameter")
  }
  let date = process.argv[3]
  let parsedDate = null
  if (typeof(date) === "string") {
    parsedDate = Date.parse(date)
    if (isNaN(parsedDate)) {
      parsedDate = Date.parse(parseFloat(date))
    }
    if (isNaN(parsedDate)) {
      throw new Error("Invalid date string supplied for 'since' parameter")
    }
  } else {
    throw new Error("Invalid type supplied for 'since' parameter, must be string")
  }

  crawl(url, parsedDate)
} else {
  let argCount = process.argv.length
  let date = process.argv[argCount-1]
  let parsedDate = null
  if (typeof(date) === "string") {
    parsedDate = Date.parse(date)
    if (isNaN(parsedDate)) {
      parsedDate = Date.parse(parseFloat(date))
    }
    if (isNaN(parsedDate)) {
      throw new Error("Invalid date string supplied for 'since' parameter")
    }
  } else {
    throw new Error("Invalid type supplied for 'since' parameter, must be string")
  }

  const file = fs.createWriteStream(`./data/mass-${Date.now()*Math.random()}.txt`)
  for (let i = 2; i < argCount-1; i++) {
    let url = hittp.str2url(process.argv[i])
    if (!url) {
     console.error("Invalid URL supplied for 'domain' parameter")
     continue
    }
    crawl(url, parsedDate, file)
  }
}
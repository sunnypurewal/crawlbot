'use strict'
const { fork } = require("child_process")
const path = require('path')
const hittp = require("hittp")

const multicrawl = (domains, since) => {
  if (typeof(since) !== "string") {
    since = since.toString()
  }
  const args = []
  for (const domain of domains) {
    let url = hittp.str2url(domain)
    if (url) args.push(url.href)
  }
  // console.log("FORKING", urlargs)
  args.push(since)
  const forked = fork(path.join(path.dirname(__filename), "./crawlprocess.js"), args)
  forked.on("message", (msg) => {
    onHTML(msg.body.html, hittp.str2url(msg.body.url))
  })
  forked.on("exit", (code, signal) => {
    if (onExit) onExit(null, forked, code, signal)
  })
  return forked
}

const crawl = (domain, since, onHTML, onExit) => {
  let url = hittp.str2url(domain)
  if (!url) {
    throw new Error("Invalid URL supplied for 'domain' parameter")
  }
  if (typeof(since) !== "string") {
    since = since.toString()
  }

  const forked = fork(path.join(path.dirname(__filename), "./crawlprocess.js"), [url.href, since])
  forked.on("message", (msg) => {
    onHTML(msg.body.html, hittp.str2url(msg.body.url))
  })
  forked.on("exit", (code, signal) => {
    if (onExit) onExit(url, forked, code, signal)
  })
  return forked
}

module.exports = {
  crawl,
  multicrawl
}
'use strict'
const { fork } = require("child_process")
const path = require('path')
const hittp = require("hittp")

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
  crawl
}
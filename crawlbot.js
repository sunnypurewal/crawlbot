'use strict'
const { fork } = require("child_process")
const path = require('path')

const crawl = (domain, since, onHTML, onExit) => {
  const forked = fork(path.join(path.dirname(__filename), "./crawlprocess.js"), [domain, since.toString()])
  forked.on("message", (msg) => {
    console.log("onHTML crawlbot.js")
    onHTML(msg.body.html, msg.body.url)
  })
  forked.on("exit", (code, signal) => {
    if (onExit) onExit(domain, forked, code, signal)
  })
  return forked
}

module.exports = {
  crawl
}
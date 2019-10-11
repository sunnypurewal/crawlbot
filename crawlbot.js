'use strict'
const { fork } = require("child_process")
const path = require('path')

const crawl = (domain, since, onHTML, onExit) => {
  const forked = fork(path.join(path.dirname(__filename), "./crawl.js"), [domain, since.toString()])
  forked.on("message", (msg) => {
    onHTML(msg.body.html, msg.body.url)
  })
  forked.on("exit", (code, signal) => {
    onExit(code, signal)
  })
  return forked
}

module.exports = {
  crawl
}
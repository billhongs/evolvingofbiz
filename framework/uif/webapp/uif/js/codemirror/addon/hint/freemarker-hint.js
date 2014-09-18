// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  var Pos = CodeMirror.Pos;
  var directives = {assign : {},
                    else : {},
                    elseif : {},
                    if : {},
                    list : {},
                    macro : {}
                    };
  function getHints(cm, options) {
    var tags = options && directives;
    var quote = (options && options.quoteChar) || '"';
    if (!tags) return;
    var cur = cm.getCursor(), token = cm.getTokenAt(cur);
    var inner = CodeMirror.innerMode(cm.getMode(), token.state);
    var result = [], replaceToken = false, prefix;
    var tag = /\bftltag\b/.test(token.type), tagName = tag && /^\w/.test(token.string), tagStart;
    if (tagName) {
      var before = cm.getLine(cur.line).slice(Math.max(0, token.start - 2), token.start);
      var tagType = /\/#$/.test(before) ? "close" : /#$/.test(before) ? "open" : null;
      if (tagType) tagStart = token.start - (tagType == "close" ? 2 : 1);
    } else if (tag && token.string == "#") {
      tagType = "open";
    } else if (tag && token.string == "/#") {
      tagType = "close";
    }
    if (!tag && !inner.state.tagName || tagType) {
      if (tagName)
        prefix = token.string;
      replaceToken = tagType;
      var cx = inner.state.context, curTag = cx && tags[cx.tagscheme];
      var childList = curTag && curTag.children;
      if (childList && tagType != "close") {
        for (var i = 0; i < childList.length; ++i) if (!prefix || childList[i].lastIndexOf(prefix, 0) == 0)
          result.push("#" + childList[i]);
      } else if (tagType != "close") {
        for (var name in tags)
          if (tags.hasOwnProperty(name) && (!prefix || name.lastIndexOf(prefix, 0) == 0))
            result.push("#" + name);
      }
      if (cx && (!prefix || tagType == "close" && cx.tagName.lastIndexOf(prefix, 0) == 0))
        result.push("</" + cx.tagName + ">");
    }
    return {
      list: result,
      from: replaceToken ? Pos(cur.line, tagStart == null ? token.start : tagStart) : cur,
      to: replaceToken ? Pos(cur.line, token.end) : cur
    };
  }

  CodeMirror.registerHelper("hint", "ftl", getHints);
});
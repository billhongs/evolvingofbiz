//CodeMirror, copyright (c) by Marijn Haverbeke and others
//Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("../htmlmixed/htmlmixed"), require("../../addon/mode/overlay"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "../htmlmixed/htmlmixed","../../addon/mode/overlay"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

  CodeMirror.defineMode("ftl", function(config, parserConfig) {
    var ftlOverlay = {
      token: function(stream, state) {
        var ch;
        if ((stream.match("<#"))||(stream.match("</#"))) {
          while ((ch = stream.next()) != null)
            if ((ch == ">")||(ch == "/>")) 
              break;
          stream.eat(/[\>|/>]/);
          return "ftltag";
        } else if ((stream.match("<@"))||(stream.match("</@"))) {
          while ((ch = stream.next()) != null)
            if ((ch == ">")||(ch == "/>")) 
              break;
          stream.eat(/[\>|/>]/);
          return "ftlmacro";
        }else if ((stream.match("${"))) {
          while ((ch = stream.next()) != null)
            if (ch == "}")
              break;
          stream.eat("}");
          return "ftlword";
        }
        while (stream.next() != null && !stream.match(/[<#|<@|$]/, false)) {}
        return null;
      }
    };
    return CodeMirror.overlayMode(CodeMirror.getMode(config, parserConfig.backdrop || "text/html"), ftlOverlay);
  });

  CodeMirror.defineMIME("text/ftl", "ftl");
});
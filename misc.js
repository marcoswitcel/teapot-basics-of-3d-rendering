// MIT License
// 
// Copyright (c) 2016 Emma 'Eniko' Maassen
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// general purpose stuff
function usingModule(m) {
  for (var key in m) {
    if (m.hasOwnProperty(key)) {
      window[key] = m[key];
    }
  }
}

function formatStack(e) {
  if (!e.stack) {
    return e.name + ": " + e.message;
  }

  // use Chrome's format by default, so don't touch it if it's already like that
  if (!e.stack.startsWith(e.name + ": " + e.message)) {
    var outlines = [e.name + ": " + e.message];
    var inlines = e.stack.replace('\r', '').split('\n');
    
    for (var i = 0; i < inlines.length; i++) {
      var line = inlines[i];
      
      if (line.trim() === "") {
        continue;
      }

      // Firefox's stack trace is ugly let's fix it      
      var match = /^([^\s@]*)@(.*:\d+:\d+)$/.exec(line);
      if (match !== null) {
        line = (match[1] !== "" ? match[1] : "unknown") + " (" + match[2] + ")";
      }
    
      if (!line.startsWith("    at ")) {
        outlines.push("    at " + line);
      }
      else {
        outlines.push(line);
      }
    }
    
    return outlines.join('\n');
  }
  
  return e.stack;
}

var debugMode = (function() {
  var debugListener = null;
  
  var f = function(on) {
    if (on && !debugListener) {
      debugListener = function (e) {
        alert(formatStack(e.error));
      };
      window.addEventListener("error", debugListener);
    }
    else if (!on && debugListener) {
      window.removeEventListener("error", debugListener);
      debugListener = false;
    }
  }
  
  return f;
})();

// exceptions
class Exception extends Error {
  constructor(message, innerException) {
    super(message);
    this.innerException = innerException;
    this.name = this.constructor.name;
    this.message = message || ("An exception of type " + this.name + " occurred."); 
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else { 
      this.stack = (new Error(message)).stack; 
    }
  }
}

class FileException extends Exception {
  constructor(message, innerException) {
    super(message, innerException);
  }
}

// IO module
var IO = {};

IO.FileType = {
  Text: "text",
  Binary: "arraybuffer",
  HTML: "document",
  JSON: "json",
  Blob: "blob"
}

IO.File = class File {
  constructor(uri, type) {
    this.uri = uri;
    this.done = false;
    this.cancelled = false;
    this.loaded = false;

    var self = this;
    this.request = new XMLHttpRequest();
    this.request.addEventListener("progress", function(e) { self._progress.call(self, e); });
    this.request.addEventListener("load", function(e) { self._loaded.call(self, e); });
    this.request.addEventListener("error", function(e) { self._error.call(self, e); });
    this.request.addEventListener("abort", function(e) { self._aborted.call(self, e); });
    this.request.responseType = type || FileType.Text;
  }
  
  _progress(e) {
    if (e.lengthComputable) {
      this.progress = e.loaded / e.total;
    }
    else {
      this.progress = NaN;
    }
    if (typeof this.onprogress === "function") {
      this.onprogress(this);
    }
  }
  
  _loaded() {
    if (this.request.status === 200) {
      this.loaded = true;
      this.done = true;
      this.value = this.request.response;
      if (typeof this.onload === "function") {
        this.onload(this);
      }
    }
    else {
      throw new FileException("Error loading file '" + this.uri + "': " + this.request.status + " " + this.request.statusText + ".");
    }
  }
  
  _error() {
    this.done = true;
    var throwException = true;
    if (typeof this.onerror === "function") {
      throwException = this.onerror(this);
    }
    if (throwException === true) {
      throw new FileException("Error loading file '" + this.uri + "'.");
    }
  }
  
  _aborted() {
    this.done = true;
    this.cancelled = true;
  }
  
  load() {
    if (this.loaded) {
      return;
    }
  
    this.request.open("GET", this.uri);
    this.request.send();
  }
  
  cancel() {
    if (!this.done) {
      this.request.abort();
    }
  }
  
  static init() {
    File.maxLoadingFiles = 6;
    File.queuedFiles = [];
    File.loadingFiles = [];
  }
  
  static loadFiles(func) {
    var files = [];
    var queueCount = 0;
    var fileDone = function() {
      queueCount--;
      if (queueCount <= 0) {
        func(files);
      }
    };
  
    for (var i = 1; i < arguments.length; i++) {
      var value = arguments[i];
      var uri;
      var type;
      
      if (Array.isArray(value)) {
        uri = value[0];
        type = value[1];
      }
      else {
        uri = value;
        type = null;
      }
      
      var file = new File(uri, type);
      file.request.addEventListener("load", function() { fileDone(); });
      file.request.addEventListener("error", function() { fileDone(); });
      file.request.addEventListener("abort", function() { fileDone(); });
      files.push(file);
      queueCount++;
      File.queuedFiles.push(file);
    }
    File.processQueue();
    return files;
  }
  
  static queueFile(file, doProcess) {
    File.queuedFiles.push(file);
    if (doProcess === null || doProcess === true) {
      File.processQueue();
    }
  }
  
  static processQueue() {
    for (var i = File.loadingFiles.length - 1; i >= 0; i--) {
      if (i >= File.loadingFiles.length) {
        processQueue();
        return;
      }
      if (File.loadingFiles[i].done) {
        File.loadingFiles.splice(i, 1);
      }
    }
    
    while (File.loadingFiles.length < File.maxLoadingFiles && File.queuedFiles.length > 0) {
      var file = File.queuedFiles.shift();
      if (!file.done) {
        file.request.addEventListener("load", File.processQueue);
        file.request.addEventListener("error", File.processQueue);
        file.request.addEventListener("abort", File.processQueue);
        File.loadingFiles.push(file);
        file.load();
      }
    }
  }
}
IO.File.init();
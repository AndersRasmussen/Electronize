// this process will respawn 'build/server/Init.js' when js-files in the build directory changes
// this should be used as is
// this file is intended for development use only - the application is started with 'build/server/Init.js'
var child_process, dev_server, fs, util;

child_process = require('child_process');
fs = require("fs");
util = require("util");

dev_server = {
  process: null,
  files: [],
  restarting: false,
  "restart": function() {
    this.restarting = true;
    util.debug('DEVSERVER: Stopping server for restart');
    return this.process.kill();
  },
  "start": function() {
    var self;

    self = this;
    util.debug('DEVSERVER: Starting server');
    self.watchFiles();
    util.debug('DEVSERVER: spawning process');
    this.process = child_process.spawn(process.argv[0], ['build/server/Init.js']);
    util.debug('DEVSERVER: process spawned');
    this.process.stdout.addListener('data', function(data) {
      return process.stdout.write(data);
    });
    this.process.stderr.addListener('data', function(data) {
      return util.print(data);
    });
    return this.process.addListener('exit', function(code) {
      util.debug('DEVSERVER: Child process exited: ' + code);
      this.process = null;
      if (self.restarting) {
        self.restarting = true;
        self.unwatchFiles();
        return self.start();
      }
    });
  },
  "watchFiles": function() {
    var self;

    self = this;
    return child_process.exec('find ./build | grep "\.js$"', function(error, stdout, stderr) {
      var files;

      files = stdout.trim().split("\n");
      return files.forEach(function(file) {
        self.files.push(file);
        return fs.watchFile(file, {
          interval: 500
        }, function(curr, prev) {
          if (curr.mtime.valueOf() !== prev.mtime.valueOf() || curr.ctime.valueOf() !== prev.ctime.valueOf()) {
            util.debug('DEVSERVER: Restarting because of changed file at ' + file);
            return dev_server.restart();
          }
        });
      });
    });
  },
  "unwatchFiles": function() {
    this.files.forEach(function(file) {
      return fs.unwatchFile(file);
    });
    return this.files = [];
  }
};

dev_server.start();

'use strict';

var should = require('chai').should();
var florincore = require('../');

describe('#versionGuard', function() {
  it('global._florincore should be defined', function() {
    should.equal(global._florincore, florincore.version);
  });

  it('throw an error if version is already defined', function() {
    (function() {
      florincore.versionGuard('version');
    }).should.throw('More than one instance of florincore');
  });
});

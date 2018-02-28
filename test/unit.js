'use strict';

var should = require('chai').should();
var expect = require('chai').expect;

var bitcore = require('..');
var errors = bitcore.errors;
var Unit = bitcore.Unit;

describe('Unit', function() {

  it('can be created from a number and unit', function() {
    expect(function() {
      return new Unit(1.2, 'FLO');
    }).to.not.throw();
  });

  it('can be created from a number and exchange rate', function() {
    expect(function() {
      return new Unit(1.2, 350);
    }).to.not.throw();
  });

  it('no "new" is required for creating an instance', function() {
    expect(function() {
      return Unit(1.2, 'FLO');
    }).to.not.throw();

    expect(function() {
      return Unit(1.2, 350);
    }).to.not.throw();
  });

  it('has property accesors "FLO", "mFLO", and  "uFLO"', function() {
    var unit = new Unit(1.2, 'FLO');
    unit.FLO.should.equal(1.2);
    unit.mFLO.should.equal(1200);
    unit.uFLO.should.equal(1200000);
  });

  it('a string amount is allowed', function() {
    var unit;

    unit = Unit.fromFLO('1.00001');
    unit.FLO.should.equal(1.00001);

    unit = Unit.fromMilis('1.00001');
    unit.mFLO.should.equal(1.00001);

    unit = Unit.fromMillis('1.00001');
    unit.mFLO.should.equal(1.00001);
    
    unit = Unit.fromFiat('43', 350);
    unit.FLO.should.equal(0.12285714);
  });

  it('should have constructor helpers', function() {
    var unit;

    unit = Unit.fromFLO(1.00001);
    unit.FLO.should.equal(1.00001);

    unit = Unit.fromMilis(1.00001);
    unit.mFLO.should.equal(1.00001);
    
    unit = Unit.fromFiat(43, 350);
    unit.FLO.should.equal(0.12285714);
  });


  it('takes into account floating point problems', function() {
    var unit = Unit.fromFLO(0.00000003);
    unit.mFLO.should.equal(0.00003);
   
  });

  it('exposes unit codes', function() {
    should.exist(Unit.FLO);
    Unit.FLO.should.equal('FLO');

    should.exist(Unit.mFLO);
    Unit.mFLO.should.equal('mFLO');

    should.exist(Unit.uFLO);
    Unit.uFLO.should.equal('uFLO');
    
  });

  it('exposes a method that converts to different units', function() {
    var unit = new Unit(1.3, 'FLO');
    unit.to(Unit.FLO).should.equal(unit.FLO);
    unit.to(Unit.mFLO).should.equal(unit.mFLO);
  });

  it('exposes shorthand conversion methods', function() {
    var unit = new Unit(1.3, 'FLO');
    unit.toFLO().should.equal(unit.FLO);
    unit.toMilis().should.equal(unit.mFLO);
    unit.toMillis().should.equal(unit.uFLO);
  });

  it('can convert to fiat', function() {
    var unit = new Unit(1.3, 350);
    unit.atRate(350).should.equal(1.3);
    unit.to(350).should.equal(1.3);

    unit = Unit.fromFLO(0.0123);
    unit.atRate(10).should.equal(0.12);
  });

  it('toString works as expected', function() {
    var unit = new Unit(1.3, 'FLO');
    should.exist(unit.toString);
    unit.toString().should.be.a('string');
  });

  it('can be imported and exported from/to JSON', function() {
    var json = JSON.stringify({amount:1.3, code:'FLO'});
    var unit = Unit.fromObject(JSON.parse(json));
    JSON.stringify(unit).should.deep.equal(json);
  });

  it('importing from invalid JSON fails quickly', function() {
    expect(function() {
      return Unit.fromJSON('¹');
    }).to.throw();
  });


  it('fails when the unit is not recognized', function() {
    expect(function() {
      return new Unit(100, 'USD');
    }).to.throw(errors.Unit.UnknownCode);
    expect(function() {
      return new Unit(100, 'FLO').to('USD');
    }).to.throw(errors.Unit.UnknownCode);
  });

  it('fails when the exchange rate is invalid', function() {
    expect(function() {
      return new Unit(100, -123);
    }).to.throw(errors.Unit.InvalidRate);
    expect(function() {
      return new Unit(100, 'FLO').atRate(-123);
    }).to.throw(errors.Unit.InvalidRate);
  });

});

const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const should = common.should;
const assert = common.assert;
const Promise = common.Promise;

const bid = require('../bid');

const adminName = util.uid('Admin');
const adminPassword = '1234';

describe('Bid tests', function() {
  this.timeout(config.timeout);

  const scope = {};

  before(function (done) {
    rest.setScope(scope)
      .then(rest.createUser(adminName, adminPassword))
      .then(function (scope) {
        done();
      }).catch(done);
  });

  it('Create Contract', function(done) {
    const id = new Date().getTime();
    const supplier = 'Supplier1';

    const args = {
      _id: id,
      _supplier: supplier,
    };

    // create with constructor args
    rest.setScope(scope)
      .then(bid.uploadContract(adminName, adminPassword, args))
      .then(bid.getState())
      .then(function(scope) {
        const bid = scope.result;
        assert.equal(bid.id, id, 'id');
        assert.equal(bid.supplier, supplier, 'supplier');
        return scope;
      })
      .then(rest.waitQuery(`${bid.contractName}?id=eq.${id}`, 1))
      .then(function(scope) {
        done();
      }).catch(done);
  });

});

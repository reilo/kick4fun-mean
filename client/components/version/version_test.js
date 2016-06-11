'use strict';

describe('kick4fun.version module', function() {
  beforeEach(module('kick4fun.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});

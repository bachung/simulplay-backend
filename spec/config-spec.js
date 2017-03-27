const fs = require('fs');

describe('config loads correctly', function() {
    beforeEach(function() {
        this.configJSON = JSON.parse(fs.readFileSync('config.json'));
        this.configJS = require('src/config');
    });

  it('has all keys present and set to correct values', function() {
      expect(this.configJSON).toEqual(this.configJS);
      expect(this.configJSON.port).toEqual(this.configJS.port);
  });
});

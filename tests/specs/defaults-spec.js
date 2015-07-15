require('../test-environment.js');

describe('SwaggerParser.defaults tests', function() {
  'use strict';

  beforeEach(function() {
    // Suppress warnings about using deprecated options
    sinon.stub(console, 'warn');
  });

  afterEach(function() {
    console.warn.restore();
  });

  it('should be initialized with the default values',
    function() {
      expect(SwaggerParser.defaults).to.deep.equal({
        init: SwaggerParser.defaults.init,
        dereference: {
          external: true,
          internal: true
        },
        parse: {
          json: true,
          yaml: true
        },
        resolve: {
          external: true,
          internal: true,
          shorthand: true
        },
        validate: {
          schema: true,
          spec: true
        }
      });
    }
  );

  it('should use modified defaults when parsing',
    function(done) {
      // Disable YAML parsing by default
      SwaggerParser.defaults.parse.yaml = false;

      // Which means this call should fail
      SwaggerParser.parse(env.getPath('good/minimal.yaml'), function(err, api, parser) {
        expect(err).to.be.an.instanceOf(SyntaxError);
        expect(err.message).to.match(/^Error parsing file/);
        expect(api).to.be.null;
        expect(parser).to.be.an.instanceOf(SwaggerParser);

        SwaggerParser.defaults.parse.yaml = true;
        done();
      });
    }
  );

  it('should override defaults with options when parsing',
    function(done) {
      // Disable YAML parsing by default
      SwaggerParser.defaults.parse.yaml = false;

      // Enable YAML parsing in the parse options
      var options = {parseYaml: true};

      // This call should succeed, because options override defaults
      SwaggerParser.parse(env.getPath('good/minimal.yaml'), options, function(err, api) {
        if (err) {
          return done(err);
        }
        expect(api).to.be.an('object');

        SwaggerParser.defaults.parse.yaml = true;
        done();
      });
    }
  );

  it('parser options should not affect the defaults',
    function(done) {
      SwaggerParser.parse(env.getPath('good/minimal.yaml'), {parse: {yaml: false}}, function(err, api, parser) {
        // This parser's YAML option is false
        expect(err).to.be.an.instanceOf(SyntaxError);

        // The default YAML option is still true
        expect(SwaggerParser.defaults.parse.yaml).to.be.true;

        done();
      });
    }
  );

  it('options from one parser should not affect another parser',
    function(done) {
      SwaggerParser.parse(env.getPath('good/minimal.yaml'), {parse: {yaml: false}}, function(err, api, parser1) {
        // This parser fails, because its YAML option is false
        expect(err).to.be.an.instanceOf(SyntaxError);
        expect(err.message).to.match(/^Error parsing file/);
        expect(api).to.be.null;
        expect(parser1).to.be.an.instanceOf(SwaggerParser);

        SwaggerParser.parse(env.getPath('good/minimal.yaml'), function(err, api, parser2) {
          // This parser succeeds, because its YAML option is true
          if (err) {
            return done(err);
          }
          expect(api).to.be.an('object');
          expect(parser2).to.be.an.instanceOf(SwaggerParser);
          expect(parser1).not.to.equal(parser2);

          done();
        });
      });
    }
  );

  it('old defaults should result in new defaults (backward compatibility)',
    function(done) {
      SwaggerParser.defaults.parseYaml = false;
      SwaggerParser.defaults.resolve$Refs = false;
      SwaggerParser.defaults.resolveExternal$Refs = false;
      SwaggerParser.defaults.dereference$Refs = false;
      SwaggerParser.defaults.dereferenceInternal$Refs = false;
      SwaggerParser.defaults.validateSchema = false;
      SwaggerParser.defaults.strictValidation = false;

      // Which means this call should fail
      SwaggerParser.parse(env.getPath('good/minimal.yaml'), function(err, api, parser) {
        expect(err).to.be.an.instanceOf(SyntaxError);
        expect(err.message).to.match(/^Error parsing file/);
        expect(api).to.be.null;
        expect(parser).to.be.an.instanceOf(SwaggerParser);

        delete SwaggerParser.defaults.parseYaml;
        delete SwaggerParser.defaults.resolve$Refs;
        delete SwaggerParser.defaults.resolveExternal$Refs;
        delete SwaggerParser.defaults.dereference$Refs;
        delete SwaggerParser.defaults.dereferenceInternal$Refs;
        delete SwaggerParser.defaults.validateSchema;
        delete SwaggerParser.defaults.strictValidation;
        done();
      });
    }
  );

});

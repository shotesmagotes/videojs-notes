import postcss from 'rollup-plugin-postcss';

const generate = require('videojs-generate-rollup-config');

// see https://github.com/videojs/videojs-generate-rollup-config
// for options
const options = {
  excludeCoverage(defaults) {
    defaults.push('**/*.css');
    return defaults;
  },
  externals(defaults) {
    return {
      browser: defaults.module.concat([
        '**/*.css'
      ]),
      module: defaults.module.concat([
        '**/*.css'
      ]),
      test: defaults.module.concat([
        '**/*.css'
      ])
    }
  },
  plugins(defaults) {
    return {
      browser: defaults.browser.concat([
        postcss({
          extensions: ['.css']
        })
      ]),
      module: defaults.module.concat([
        postcss({
          extensions: ['.css']
        })
      ]),
      test: defaults.test.concat([
        postcss({
          extensions: ['.css']
        })
      ])
    }
  }
};
const config = generate(options);

// Add additonal builds/customization here!

// export the builds to rollup
export default Object.values(config.builds);

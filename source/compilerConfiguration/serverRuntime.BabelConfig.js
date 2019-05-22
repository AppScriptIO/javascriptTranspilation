const path = require('path')

module.exports = {
  babelConfig: {
    // cache: false,
    sourceMaps: 'both' /*inline & include in result object*/ || 'inline' || true,
    retainLines: true,
    minified: false,
    comments: false,

    presets: [],

    plugins: [
      /* Syntax */
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      require.resolve('@babel/plugin-syntax-typescript'),
      // require.resolve(`@babel/plugin-syntax-decorators`),
      // require.resolve('@babel/plugin-syntax-logical-assignment-operators'),
      // require.resolve('@babel/plugin-syntax-function-bind'),
      // require.resolve('@babel/plugin-syntax-function-sent'),

      /* Babel Runtime */
      require.resolve(`@babel/plugin-transform-runtime`), // runtime required

      /* Transform */
      /* Typescript - conditionally transforms only typescript files. */
      require.resolve('@babel/plugin-proposal-export-namespace-from'), // export * as ns from './script.js'
      require.resolve('@babel/plugin-proposal-export-default-from'), // export v from './script.js';
      //* `plugin-transform-typescript` must come after `proposal-export` plugins, as a conflict is produced.
      [require.resolve('@babel/plugin-transform-typescript'), {}], // unsupported features - https://babeljs.io/docs/en/babel-plugin-transform-typescript
      require.resolve(`@babel/plugin-transform-modules-commonjs`), // transform static import
      require.resolve(`babel-plugin-dynamic-import-node`), // transform dynamic import
      [require.resolve(`@babel/plugin-proposal-decorators`), { legacy: true }], // transform decorators - // https://github.com/babel/babel/issues/7786
      [require.resolve(`@babel/plugin-proposal-class-properties`), { loose: true }], // transform static class parameter
      require.resolve(`babel-plugin-parameter-decorator`), // function parameter decorator
      require.resolve(`@babel/plugin-proposal-function-bind`), // Bind shorthand replaces `.call` & `.bind`
      require.resolve(`@babel/plugin-proposal-optional-chaining`), // Optional chaining operator e.g. `obj.key1?.key2?.key3`
      require.resolve(`@babel/plugin-proposal-object-rest-spread`), // rest operators `const {x,y, ...z} = {x:1,y:2, a:3, b:4, c:5}` => `z == {a:3, b:4, c:5}`
      [require.resolve('@babel/plugin-proposal-logical-assignment-operators')], // `a ||= b` or `a &&= b` --> `a || (a = b)` assignment operator is called only when needed, unlike `a = a || b`
      require.resolve(`@babel/babel-plugin-functionSentProxyImplementation`), // [option 1] Proxy implementation - Adds `function.sent` meta propety in generators
      // require.resolve(`@babel/plugin-proposal-function-sent`), // [option 2] Official implementation - Adds `function.sent` meta propety in generators
      [require.resolve('@babel/plugin-proposal-throw-expressions')], // allows to throw in expressions `() => throw new Error('')`.
      require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'), // `let x = object.y ?? "default"` --> `let x = object.y != null ? object.y : 'default'`
      [require.resolve('@babel/plugin-proposal-pipeline-operator'), { proposal: 'minimal' }], // `"hello" |> doubleSay |> capitalize |> exclaim` --> `exclaim(capitalize(doubleSay("hello")))`
      require.resolve('@babel/plugin-proposal-optional-catch-binding'), // It allows the binding to be omitted from a catch clause `try{} catch {}` instead of `try{} catch(_unused){}`
    ],
  },
}

"use strict";const path = require('path');

module.exports = [
require.resolve(`babel-preset-minify`),
{

  booleans: true,
  builtIns: true,
  consecutiveAdds: true,
  deadcode: true,
  evaluate: true,
  flipComparisons: true,
  guards: true,
  infinity: true,
  mangle: true,
  memberExpressions: true,
  mergeVars: true,
  numericLiterals: true,
  propertyLiterals: true,
  regexpConstructors: true,
  removeConsole: true,
  removeDebugger: true,
  removeUndefined: true,
  replace: true,
  simplify: false,
  simplifyComparisons: true,
  typeConstructors: true,
  undefinedToVoid: true }];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9jb21waWxlckNvbmZpZ3VyYXRpb24vYmFiZWxQcmVzZXRNaW5pZnlNb2R1bGVDb25maWcucHJlc2V0LmpzIl0sIm5hbWVzIjpbInBhdGgiLCJyZXF1aXJlIiwibW9kdWxlIiwiZXhwb3J0cyIsInJlc29sdmUiLCJib29sZWFucyIsImJ1aWx0SW5zIiwiY29uc2VjdXRpdmVBZGRzIiwiZGVhZGNvZGUiLCJldmFsdWF0ZSIsImZsaXBDb21wYXJpc29ucyIsImd1YXJkcyIsImluZmluaXR5IiwibWFuZ2xlIiwibWVtYmVyRXhwcmVzc2lvbnMiLCJtZXJnZVZhcnMiLCJudW1lcmljTGl0ZXJhbHMiLCJwcm9wZXJ0eUxpdGVyYWxzIiwicmVnZXhwQ29uc3RydWN0b3JzIiwicmVtb3ZlQ29uc29sZSIsInJlbW92ZURlYnVnZ2VyIiwicmVtb3ZlVW5kZWZpbmVkIiwicmVwbGFjZSIsInNpbXBsaWZ5Iiwic2ltcGxpZnlDb21wYXJpc29ucyIsInR5cGVDb25zdHJ1Y3RvcnMiLCJ1bmRlZmluZWRUb1ZvaWQiXSwibWFwcGluZ3MiOiJhQUFBLE1BQU1BLElBQUksR0FBR0MsT0FBTyxDQUFDLE1BQUQsQ0FBcEI7O0FBRUFDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNmRixPQUFPLENBQUNHLE9BQVIsQ0FBaUIscUJBQWpCLENBRGU7QUFFZjs7QUFFRUMsRUFBQUEsUUFBUSxFQUFFLElBRlo7QUFHRUMsRUFBQUEsUUFBUSxFQUFFLElBSFo7QUFJRUMsRUFBQUEsZUFBZSxFQUFFLElBSm5CO0FBS0VDLEVBQUFBLFFBQVEsRUFBRSxJQUxaO0FBTUVDLEVBQUFBLFFBQVEsRUFBRSxJQU5aO0FBT0VDLEVBQUFBLGVBQWUsRUFBRSxJQVBuQjtBQVFFQyxFQUFBQSxNQUFNLEVBQUUsSUFSVjtBQVNFQyxFQUFBQSxRQUFRLEVBQUUsSUFUWjtBQVVFQyxFQUFBQSxNQUFNLEVBQUUsSUFWVjtBQVdFQyxFQUFBQSxpQkFBaUIsRUFBRSxJQVhyQjtBQVlFQyxFQUFBQSxTQUFTLEVBQUUsSUFaYjtBQWFFQyxFQUFBQSxlQUFlLEVBQUUsSUFibkI7QUFjRUMsRUFBQUEsZ0JBQWdCLEVBQUUsSUFkcEI7QUFlRUMsRUFBQUEsa0JBQWtCLEVBQUUsSUFmdEI7QUFnQkVDLEVBQUFBLGFBQWEsRUFBRSxJQWhCakI7QUFpQkVDLEVBQUFBLGNBQWMsRUFBRSxJQWpCbEI7QUFrQkVDLEVBQUFBLGVBQWUsRUFBRSxJQWxCbkI7QUFtQkVDLEVBQUFBLE9BQU8sRUFBRSxJQW5CWDtBQW9CRUMsRUFBQUEsUUFBUSxFQUFFLEtBcEJaO0FBcUJFQyxFQUFBQSxtQkFBbUIsRUFBRSxJQXJCdkI7QUFzQkVDLEVBQUFBLGdCQUFnQixFQUFFLElBdEJwQjtBQXVCRUMsRUFBQUEsZUFBZSxFQUFFLElBdkJuQixFQUZlLENBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFtcbiAgcmVxdWlyZS5yZXNvbHZlKGBiYWJlbC1wcmVzZXQtbWluaWZ5YCksXG4gIHtcbiAgICAvLyBvcHRpb25zIC0gaHR0cHM6Ly9naXRodWIuY29tL2JhYmVsL21pbmlmeS90cmVlL21hc3Rlci9wYWNrYWdlcy9iYWJlbC1wcmVzZXQtbWluaWZ5XG4gICAgYm9vbGVhbnM6IHRydWUsXG4gICAgYnVpbHRJbnM6IHRydWUsXG4gICAgY29uc2VjdXRpdmVBZGRzOiB0cnVlLFxuICAgIGRlYWRjb2RlOiB0cnVlLFxuICAgIGV2YWx1YXRlOiB0cnVlLFxuICAgIGZsaXBDb21wYXJpc29uczogdHJ1ZSxcbiAgICBndWFyZHM6IHRydWUsXG4gICAgaW5maW5pdHk6IHRydWUsXG4gICAgbWFuZ2xlOiB0cnVlLFxuICAgIG1lbWJlckV4cHJlc3Npb25zOiB0cnVlLFxuICAgIG1lcmdlVmFyczogdHJ1ZSxcbiAgICBudW1lcmljTGl0ZXJhbHM6IHRydWUsXG4gICAgcHJvcGVydHlMaXRlcmFsczogdHJ1ZSxcbiAgICByZWdleHBDb25zdHJ1Y3RvcnM6IHRydWUsXG4gICAgcmVtb3ZlQ29uc29sZTogdHJ1ZSxcbiAgICByZW1vdmVEZWJ1Z2dlcjogdHJ1ZSxcbiAgICByZW1vdmVVbmRlZmluZWQ6IHRydWUsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBzaW1wbGlmeTogZmFsc2UsIC8vIHR1cm4gb2ZmIGJlY2F1c2UgXCJiYWJlbC1wbHVnaW4tbWluaWZ5LXNpbXBsaWZ5XCIgYWRkcyBhIGNvbW1hIGFmdGVyIG5hZCBiZWZvcmUgc2VydmVyIHNpZGUgcmVuZGVyZWQgZnJhZ21lbnRzIFwieyUgJX1cIiB3aGljaCBjYXVzZXMgc3ludGF4IGVycm9ycy5cbiAgICBzaW1wbGlmeUNvbXBhcmlzb25zOiB0cnVlLFxuICAgIHR5cGVDb25zdHJ1Y3RvcnM6IHRydWUsXG4gICAgdW5kZWZpbmVkVG9Wb2lkOiB0cnVlLFxuICB9LFxuXVxuIl19
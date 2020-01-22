"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _transformPluginBabel = require("../utility/transformPlugin.babel.js");
var _babelPresetMinifyModuleConfigPreset = _interopRequireDefault(require("./babelPresetMinifyModuleConfig.preset.js"));

module.exports = {
  babelConfig: {
    presets: [_babelPresetMinifyModuleConfigPreset.default],
    plugins: [

    require.resolve(`@babel/plugin-syntax-dynamic-import`),
    require.resolve(`@babel/plugin-syntax-import-meta`),


    [require.resolve(`@babel/plugin-proposal-decorators`), { legacy: true }],
    [require.resolve(`@babel/plugin-proposal-class-properties`), { loose: true }],
    _transformPluginBabel.transformNamedModuleToPath] } };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9jb21waWxlckNvbmZpZ3VyYXRpb24vbmF0aXZlQ2xpZW50U2lkZVJ1bnRpbWUuQmFiZWxDb25maWcuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsImJhYmVsQ29uZmlnIiwicHJlc2V0cyIsImJhYmVsUHJlc2V0TWluaWZ5Q29uZmlnIiwicGx1Z2lucyIsInJlcXVpcmUiLCJyZXNvbHZlIiwibGVnYWN5IiwibG9vc2UiLCJ0cmFuc2Zvcm1OYW1lZE1vZHVsZVRvUGF0aCJdLCJtYXBwaW5ncyI6IjtBQUNBO0FBQ0E7O0FBRUFBLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNmQyxFQUFBQSxXQUFXLEVBQUU7QUFDWEMsSUFBQUEsT0FBTyxFQUFFLENBQUNDLDRDQUFELENBREU7QUFFWEMsSUFBQUEsT0FBTyxFQUFFOztBQUVQQyxJQUFBQSxPQUFPLENBQUNDLE9BQVIsQ0FBaUIscUNBQWpCLENBRk87QUFHUEQsSUFBQUEsT0FBTyxDQUFDQyxPQUFSLENBQWlCLGtDQUFqQixDQUhPOzs7QUFNUCxLQUFDRCxPQUFPLENBQUNDLE9BQVIsQ0FBaUIsbUNBQWpCLENBQUQsRUFBdUQsRUFBRUMsTUFBTSxFQUFFLElBQVYsRUFBdkQsQ0FOTztBQU9QLEtBQUNGLE9BQU8sQ0FBQ0MsT0FBUixDQUFpQix5Q0FBakIsQ0FBRCxFQUE2RCxFQUFFRSxLQUFLLEVBQUUsSUFBVCxFQUE3RCxDQVBPO0FBUVBDLG9EQVJPLENBRkUsRUFERSxFQUFqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyB0cmFuc2Zvcm1OYW1lZE1vZHVsZVRvUGF0aCwgbWluaWZ5SHRtbFRlbXBsYXRlTGl0ZXJhbHMgfSBmcm9tICcuLi91dGlsaXR5L3RyYW5zZm9ybVBsdWdpbi5iYWJlbC5qcydcbmltcG9ydCBiYWJlbFByZXNldE1pbmlmeUNvbmZpZyBmcm9tICcuL2JhYmVsUHJlc2V0TWluaWZ5TW9kdWxlQ29uZmlnLnByZXNldC5qcydcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGJhYmVsQ29uZmlnOiB7XG4gICAgcHJlc2V0czogW2JhYmVsUHJlc2V0TWluaWZ5Q29uZmlnXSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICAvKiBTeW50YXggKi9cbiAgICAgIHJlcXVpcmUucmVzb2x2ZShgQGJhYmVsL3BsdWdpbi1zeW50YXgtZHluYW1pYy1pbXBvcnRgKSxcbiAgICAgIHJlcXVpcmUucmVzb2x2ZShgQGJhYmVsL3BsdWdpbi1zeW50YXgtaW1wb3J0LW1ldGFgKSxcbiAgICAgIC8vIHJlcXVpcmUucmVzb2x2ZShgQGJhYmVsL3BsdWdpbi1zeW50YXgtZGVjb3JhdG9yc2ApLFxuICAgICAgLyogVHJhbnNmb3JtICovXG4gICAgICBbcmVxdWlyZS5yZXNvbHZlKGBAYmFiZWwvcGx1Z2luLXByb3Bvc2FsLWRlY29yYXRvcnNgKSwgeyBsZWdhY3k6IHRydWUgfV0sIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9iYWJlbC9iYWJlbC9pc3N1ZXMvNzc4NlxuICAgICAgW3JlcXVpcmUucmVzb2x2ZShgQGJhYmVsL3BsdWdpbi1wcm9wb3NhbC1jbGFzcy1wcm9wZXJ0aWVzYCksIHsgbG9vc2U6IHRydWUgfV0sXG4gICAgICB0cmFuc2Zvcm1OYW1lZE1vZHVsZVRvUGF0aCxcbiAgICAgIC8vIG1pbmlmeUh0bWxUZW1wbGF0ZUxpdGVyYWxzIC8vIFRPRE86IHRyYW5zZm9ybSB0YWdnZWQgdGVtcGxhdGUgbGl0ZXJhbHMgaW4ganMgZmlsZXMgKG1pbmlmeSkuXG4gICAgXSxcbiAgfSxcbn1cbiJdfQ==
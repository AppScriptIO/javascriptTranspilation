"use strict";const path = require('path'),
filesystem = require('fs'),
assert = require('assert'),
EventEmitter = require('events'),
requireHook = require('./requireHook.js'),
{ defaultRequireHookConfig } = require('./getConfig.js'),
deepCloneJSNativeType = require('clone-deep'),
{ mergeNonexistentProperties } = require('@dependency/handleJSNativeDataStructure');




class Compiler extends EventEmitter {
  constructor({
    callerPath,

    babelConfig = {},





    extensions = ['.js', '.mjs', '.ts'] } =
  {}) {
    super();
    Compiler.instance.push(this);

    this.config = babelConfig;
    this.extensions = extensions;
    this.callerPath = callerPath;









    this.loadedFiles = this.loadedFiles || [];

    this.initializeTransformConfiguration();
  }


  initializeTransformConfiguration() {


    this.config = deepCloneJSNativeType(this.config);
    assert(defaultRequireHookConfig.ignore, `• Must contain at least ignore property, as it is used in the Compiler instance and modified when needed.`);

    mergeNonexistentProperties(this.config, deepCloneJSNativeType(defaultRequireHookConfig));

    if (!this.config.plugins && !this.config.presets) {
      this.setTargetProject();

      let transpilationConfig = this.targetProjectConfig.getTranspilation();
      assert(transpilationConfig && transpilationConfig.babelConfig, `• Project (${this.targetProjectConfig.rootPath}) configuration must have 'transpilation' & nested 'babelConfig' entries.`);
      Object.assign(this.config, transpilationConfig.babelConfig);
    }


    Object.assign(this.config, { caller: { name: '@deployment/javascriptTranspilation' } });
  }

  requireHook({
    restrictToTargetProject = true || '<projectRootPath' } =
  {}) {
    let revertHookList = [];

    let projectRootPath;
    if (restrictToTargetProject) {
      if (typeof restrictToTargetProject == 'string') projectRootPath = restrictToTargetProject;else
      {
        this.setTargetProject();
        projectRootPath = this.targetProjectConfig.rootPath;
      }


      const targetProjectFilesRegex = new RegExp(`^((?!${projectRootPath}).)*$`);
      this.config.ignore.push(targetProjectFilesRegex);
    }


    this.on('fileLoaded', fileObject => this.loadedFiles.push(fileObject));



    {
      let revertHook = requireHook.trackFile({
        emit: (code, filename) => this.emit('fileLoaded', { filename, code }),
        ignoreFilenamePattern: this.config.ignore,
        extension: this.extensions });

      revertHookList.push(revertHook);
    }


    {
      console.log(`[javascriptTranspilation] Registered Nodejs require hook for runtime transpilation - ${this.callerPath || 'Unknown compiler.callerPath'}`);

      let revertHook;

      revertHook = requireHook.babelTransform({ babelConfig: this.config, extension: this.extensions, ignoreNodeModules: false, ignoreFilenamePattern: this.config.ignore });
      revertHookList.push(revertHook);
    }


    {
      this.setPrimaryTargetProject();
      let revertHook = requireHook.writeFileToDisk({
        extension: this.extensions,
        ignoreFilenamePattern: this.config.ignore,
        targetProjectConfig: this.primaryTargetProjectConfig });

      revertHookList.push(revertHook);
    }

    return { revertHook: () => revertHookList.forEach(revert => revert()) };
  }


  setTargetProject() {
    if (this.targetProjectConfig) return;
    assert(this.callerPath, '• callerPath should be passed in case babel configuration was not provided');
    const { findTargetProjectRoot } = require('@deployment/configurationManagement');










    this.targetProjectConfig = findTargetProjectRoot({ nestedProjectPath: [this.callerPath] });
  }


  setPrimaryTargetProject({ nestedProjectPath = [process.cwd(), module.parent.filename] } = {}) {
    if (this.primaryTargetProjectConfig) return;
    const { findTargetProjectRoot } = require('@deployment/configurationManagement');
    this.primaryTargetProjectConfig = findTargetProjectRoot({ nestedProjectPath });
  }}



Compiler.instance = [];













Compiler.transpilationModulePath = path.join(__dirname, '..');

module.exports = {
  Compiler };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS9Db21waWxlci5jbGFzcy5qcyJdLCJuYW1lcyI6WyJwYXRoIiwicmVxdWlyZSIsImZpbGVzeXN0ZW0iLCJhc3NlcnQiLCJFdmVudEVtaXR0ZXIiLCJyZXF1aXJlSG9vayIsImRlZmF1bHRSZXF1aXJlSG9va0NvbmZpZyIsImRlZXBDbG9uZUpTTmF0aXZlVHlwZSIsIm1lcmdlTm9uZXhpc3RlbnRQcm9wZXJ0aWVzIiwiQ29tcGlsZXIiLCJjb25zdHJ1Y3RvciIsImNhbGxlclBhdGgiLCJiYWJlbENvbmZpZyIsImV4dGVuc2lvbnMiLCJpbnN0YW5jZSIsInB1c2giLCJjb25maWciLCJsb2FkZWRGaWxlcyIsImluaXRpYWxpemVUcmFuc2Zvcm1Db25maWd1cmF0aW9uIiwiaWdub3JlIiwicGx1Z2lucyIsInByZXNldHMiLCJzZXRUYXJnZXRQcm9qZWN0IiwidHJhbnNwaWxhdGlvbkNvbmZpZyIsInRhcmdldFByb2plY3RDb25maWciLCJnZXRUcmFuc3BpbGF0aW9uIiwicm9vdFBhdGgiLCJPYmplY3QiLCJhc3NpZ24iLCJjYWxsZXIiLCJuYW1lIiwicmVzdHJpY3RUb1RhcmdldFByb2plY3QiLCJyZXZlcnRIb29rTGlzdCIsInByb2plY3RSb290UGF0aCIsInRhcmdldFByb2plY3RGaWxlc1JlZ2V4IiwiUmVnRXhwIiwib24iLCJmaWxlT2JqZWN0IiwicmV2ZXJ0SG9vayIsInRyYWNrRmlsZSIsImVtaXQiLCJjb2RlIiwiZmlsZW5hbWUiLCJpZ25vcmVGaWxlbmFtZVBhdHRlcm4iLCJleHRlbnNpb24iLCJjb25zb2xlIiwibG9nIiwiYmFiZWxUcmFuc2Zvcm0iLCJpZ25vcmVOb2RlTW9kdWxlcyIsInNldFByaW1hcnlUYXJnZXRQcm9qZWN0Iiwid3JpdGVGaWxlVG9EaXNrIiwicHJpbWFyeVRhcmdldFByb2plY3RDb25maWciLCJmb3JFYWNoIiwicmV2ZXJ0IiwiZmluZFRhcmdldFByb2plY3RSb290IiwibmVzdGVkUHJvamVjdFBhdGgiLCJwcm9jZXNzIiwiY3dkIiwibW9kdWxlIiwicGFyZW50IiwidHJhbnNwaWxhdGlvbk1vZHVsZVBhdGgiLCJqb2luIiwiX19kaXJuYW1lIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6ImFBQUEsTUFBTUEsSUFBSSxHQUFHQyxPQUFPLENBQUMsTUFBRCxDQUFwQjtBQUNFQyxVQUFVLEdBQUdELE9BQU8sQ0FBQyxJQUFELENBRHRCO0FBRUVFLE1BQU0sR0FBR0YsT0FBTyxDQUFDLFFBQUQsQ0FGbEI7QUFHRUcsWUFBWSxHQUFHSCxPQUFPLENBQUMsUUFBRCxDQUh4QjtBQUlFSSxXQUFXLEdBQUdKLE9BQU8sQ0FBQyxrQkFBRCxDQUp2QjtBQUtFLEVBQUVLLHdCQUFGLEtBQStCTCxPQUFPLENBQUMsZ0JBQUQsQ0FMeEM7QUFNRU0scUJBQXFCLEdBQUdOLE9BQU8sQ0FBQyxZQUFELENBTmpDO0FBT0UsRUFBRU8sMEJBQUYsS0FBaUNQLE9BQU8sQ0FBQyx5Q0FBRCxDQVAxQzs7Ozs7QUFZQSxNQUFNUSxRQUFOLFNBQXVCTCxZQUF2QixDQUFvQztBQUNsQ00sRUFBQUEsV0FBVyxDQUFDO0FBQ1ZDLElBQUFBLFVBRFU7O0FBR1ZDLElBQUFBLFdBQVcsR0FBRyxFQUhKOzs7Ozs7QUFTVkMsSUFBQUEsVUFBVSxHQUFHLENBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsS0FBaEIsQ0FUSDtBQVVSLElBVk8sRUFVSDtBQUNOO0FBQ0FKLElBQUFBLFFBQVEsQ0FBQ0ssUUFBVCxDQUFrQkMsSUFBbEIsQ0FBdUIsSUFBdkI7O0FBRUEsU0FBS0MsTUFBTCxHQUFjSixXQUFkO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQkEsVUFBbEI7QUFDQSxTQUFLRixVQUFMLEdBQWtCQSxVQUFsQjs7Ozs7Ozs7OztBQVVBLFNBQUtNLFdBQUwsR0FBbUIsS0FBS0EsV0FBTCxJQUFvQixFQUF2Qzs7QUFFQSxTQUFLQyxnQ0FBTDtBQUNEOzs7QUFHREEsRUFBQUEsZ0NBQWdDLEdBQUc7OztBQUdqQyxTQUFLRixNQUFMLEdBQWNULHFCQUFxQixDQUFD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LENBQUNtRCx1QkFBVCxHQUFtQzVELElBQUksQ0FBQzZELElBQUwsQ0FBVUMsU0FBVixFQUFxQixJQUFyQixDQUFuQzs7QUFFQUosTUFBTSxDQUFDSyxPQUFQLEdBQWlCO0FBQ2Z0RCxFQUFBQSxRQURlLEVBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKSxcbiAgZmlsZXN5c3RlbSA9IHJlcXVpcmUoJ2ZzJyksXG4gIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpLFxuICBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKSxcbiAgcmVxdWlyZUhvb2sgPSByZXF1aXJlKCcuL3JlcXVpcmVIb29rLmpzJyksXG4gIHsgZGVmYXVsdFJlcXVpcmVIb29rQ29uZmlnIH0gPSByZXF1aXJlKCcuL2dldENvbmZpZy5qcycpLFxuICBkZWVwQ2xvbmVKU05hdGl2ZVR5cGUgPSByZXF1aXJlKCdjbG9uZS1kZWVwJyksXG4gIHsgbWVyZ2VOb25leGlzdGVudFByb3BlcnRpZXMgfSA9IHJlcXVpcmUoJ0BkZXBlbmRlbmN5L2hhbmRsZUpTTmF0aXZlRGF0YVN0cnVjdHVyZScpXG5cbi8qKlxuICogVXNlZCB0byBpbml0aWFsaXplIG5vZGVqcyBhcHAgd2l0aCB0cmFuc3BpbGVkIGNvZGUgdXNpbmcgQmFiZWwsIHRocm91Z2ggYW4gZW50cnlwb2ludC5qcyB3aGljaCBsb2FkcyB0aGUgYXBwLmpzIGFmdGVyIHJlZ2lzdGVyaW5nIHRoZSB0cmFuc3BpbGF0aW9uIHJlcXVpcmUgaG9va3MuXG4gKi9cbmNsYXNzIENvbXBpbGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3Ioe1xuICAgIGNhbGxlclBhdGgsXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2JhYmVsL2JhYmVsL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL2JhYmVsLWNvcmUvc3JjL2NvbmZpZy92YWxpZGF0aW9uL29wdGlvbnMuanNcbiAgICBiYWJlbENvbmZpZyA9IHt9LFxuICAgIC8qIFxuICAgICAgY29uZmlndXJhdGlvbnMgcmVsYXRlZCB0byBob29rIHJlZ2lzdHJhdGlvbnMgb3IgQGJhYmVsL3JlZ2lzdGVyXG4gICAgICBOb3RlOiBleHRlbnNpb25zIGFyZSBub3QgdmFsaWQgYmFiZWwgY29uZmlndXJhdGlvbiwgdGhlcmVmb3JlIG11c3QgYmUgcGFzc2VkIHNlcGFyYXRlbHkuIFxuICAgICovXG4gICAgLy8gU2V0dGluZyB0aGlzIHdpbGwgcmVtb3ZlIHRoZSBjdXJyZW50bHkgaG9va2VkIGV4dGVuc2lvbnMgb2YgYC5lczZgLCBgLmVzYCwgYC5qc3hgLCBgLm1qc2AgYW5kIC5qcyBzbyB5b3UnbGwgaGF2ZSB0byBhZGQgdGhlbSBiYWNrIGlmIHlvdSB3YW50IHRoZW0gdG8gYmUgdXNlZCBhZ2Fpbi5cbiAgICBleHRlbnNpb25zID0gWycuanMnLCAnLm1qcycsICcudHMnXSwgLy8gZGVmYXVsdCBpcyBcIi5lczZcIiwgXCIuZXNcIiwgXCIuanN4XCIsIFwiLmpzXCIsIFwiLm1qc1wiXG4gIH0gPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICBDb21waWxlci5pbnN0YW5jZS5wdXNoKHRoaXMpIC8vIHRyYWNrIGluc3RhbmNlc1xuXG4gICAgdGhpcy5jb25maWcgPSBiYWJlbENvbmZpZ1xuICAgIHRoaXMuZXh0ZW5zaW9ucyA9IGV4dGVuc2lvbnNcbiAgICB0aGlzLmNhbGxlclBhdGggPSBjYWxsZXJQYXRoXG5cbiAgICAvKiogVXNhZ2U6IFxuICAgICAgYGBgXG4gICAgICAgIHByb2Nlc3Mub24oJ2V4aXQnLCAoKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coY29tcGlsZXIubG9hZGVkRmlsZXMubWFwKHZhbHVlID0+IHZhbHVlLmZpbGVuYW1lKSlcbiAgICAgICAgICBjb25zb2xlLmxvZyhjb21waWxlci5jb25maWcuaWdub3JlKVxuICAgICAgICB9KVxuICAgICAgYGBgXG4gICAgICAqL1xuICAgIHRoaXMubG9hZGVkRmlsZXMgPSB0aGlzLmxvYWRlZEZpbGVzIHx8IFtdXG5cbiAgICB0aGlzLmluaXRpYWxpemVUcmFuc2Zvcm1Db25maWd1cmF0aW9uKCkgLy8gc2V0IGJhYmVsIGNvbmZpZyB2YWx1ZXNcbiAgfVxuXG4gIC8vIGJhYmVsIGNvbmZpZ3VyYXRpb25zIC0gcGx1Z2lucywgcHJlc2V0cywgaWdub3JlLCBleHRlbnNpb25zLCBldGMuXG4gIGluaXRpYWxpemVUcmFuc2Zvcm1Db25maWd1cmF0aW9uKCkge1xuICAgIC8vIG1ha2Ugc3VyZSB0aGUgb2JqZWN0IHBhc3NlZCBpcyB1bmlxdWUgKHByZXZlbnQgY29uZmxpY3RzIGluIGNhc2UgY29uZmlncyBhcmUgdXNlZCBmcm9tIHRoZSBzYW1lIG1vZHVsZSBtdWx0aXBsZSB0aW1lcylcbiAgICAvLyBhcyB0aGUgcHJvcGVydGllcyBvZiB0aGlzLmNvbmZpZyBjYW4gYmUgbW9kaWZpZWQgYnkgdGhlIGluc3RhbmNlIChlLmcuIHRoaXMuY29uZmlnLmlnbm9yZSlcbiAgICB0aGlzLmNvbmZpZyA9IGRlZXBDbG9uZUpTTmF0aXZlVHlwZSh0aGlzLmNvbmZpZylcbiAgICBhc3NlcnQoZGVmYXVsdFJlcXVpcmVIb29rQ29uZmlnLmlnbm9yZSwgYOKAoiBNdXN0IGNvbnRhaW4gYXQgbGVhc3QgaWdub3JlIHByb3BlcnR5LCBhcyBpdCBpcyB1c2VkIGluIHRoZSBDb21waWxlciBpbnN0YW5jZSBhbmQgbW9kaWZpZWQgd2hlbiBuZWVkZWQuYClcbiAgICAvLyBtZXJnZSBvbmx5IGlmIHByb3BlcnRpZXMgZG9lc24ndCBleGlzdFxuICAgIG1lcmdlTm9uZXhpc3RlbnRQcm9wZXJ0aWVzKHRoaXMuY29uZmlnLCBkZWVwQ2xvbmVKU05hdGl2ZVR5cGUoZGVmYXVsdFJlcXVpcmVIb29rQ29uZmlnKSAvKmNsb25lIGRlZXAgb2JqZWN0cyB0byBwcmV2ZW50IGNvbmZsaWN0cyBiZXR3ZWVuIGluc3RhbmNlcy4qLylcblxuICAgIGlmICghdGhpcy5jb25maWcucGx1Z2lucyAmJiAhdGhpcy5jb25maWcucHJlc2V0cykge1xuICAgICAgdGhpcy5zZXRUYXJnZXRQcm9qZWN0KCkgLy8gbG9va3VwIHByb2plY3QgY29uZmlnXG5cbiAgICAgIGxldCB0cmFuc3BpbGF0aW9uQ29uZmlnID0gdGhpcy50YXJnZXRQcm9qZWN0Q29uZmlnLmdldFRyYW5zcGlsYXRpb24oKVxuICAgICAgYXNzZXJ0KHRyYW5zcGlsYXRpb25Db25maWcgJiYgdHJhbnNwaWxhdGlvbkNvbmZpZy5iYWJlbENvbmZpZywgYOKAoiBQcm9qZWN0ICgke3RoaXMudGFyZ2V0UHJvamVjdENvbmZpZy5yb290UGF0aH0pIGNvbmZpZ3VyYXRpb24gbXVzdCBoYXZlICd0cmFuc3BpbGF0aW9uJyAmIG5lc3RlZCAnYmFiZWxDb25maWcnIGVudHJpZXMuYClcbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5jb25maWcsIHRyYW5zcGlsYXRpb25Db25maWcuYmFiZWxDb25maWcpXG4gICAgfVxuXG4gICAgLy8gYWRkIGNhbGxlciBuYW1lLCBzaW1pbGFyIHRvIEBiYWJlbC9yZWdpc3RlciBiZWhhdmlvciAtIGh0dHBzOi8vZ2l0aHViLmNvbS9iYWJlbC9iYWJlbC9ibG9iL21hc3Rlci9wYWNrYWdlcy9iYWJlbC1yZWdpc3Rlci9zcmMvbm9kZS5qcyNMMTI4XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmNvbmZpZywgeyBjYWxsZXI6IHsgbmFtZTogJ0BkZXBsb3ltZW50L2phdmFzY3JpcHRUcmFuc3BpbGF0aW9uJyB9IH0pXG4gIH1cblxuICByZXF1aXJlSG9vayh7XG4gICAgcmVzdHJpY3RUb1RhcmdldFByb2plY3QgPSB0cnVlIHx8ICc8cHJvamVjdFJvb3RQYXRoJyAvKiB0aGlzIG9wdGlvbiB3aGVuIGZhbHNlIG9yIHN0cmluZyBwcm92aWRlZCBhbGxvd3MgY2lyY3VsYXIgZGVwZW5kZW5jeSBgY29uZmlndXJhdGlvbk1hbmFnZW1lbnRgIHRvIHVzZSB0cmFuc3BpbGF0aW9uLiAqLyxcbiAgfSA9IHt9KSB7XG4gICAgbGV0IHJldmVydEhvb2tMaXN0ID0gW11cblxuICAgIGxldCBwcm9qZWN0Um9vdFBhdGhcbiAgICBpZiAocmVzdHJpY3RUb1RhcmdldFByb2plY3QpIHtcbiAgICAgIGlmICh0eXBlb2YgcmVzdHJpY3RUb1RhcmdldFByb2plY3QgPT0gJ3N0cmluZycpIHByb2plY3RSb290UGF0aCA9IHJlc3RyaWN0VG9UYXJnZXRQcm9qZWN0XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRUYXJnZXRQcm9qZWN0KClcbiAgICAgICAgcHJvamVjdFJvb3RQYXRoID0gdGhpcy50YXJnZXRQcm9qZWN0Q29uZmlnLnJvb3RQYXRoXG4gICAgICB9XG5cbiAgICAgIC8vIGJhYmVsIGNvbmZpZyBpZ25vcmUgZ2xvYnMgYW5kIHJlZ2V4IHRvIG1hdGNoIGZpbGVzIGFuZCBmaWx0ZXIgdGhlIGZpbGVzIHRvIHRyYW5zcGlsZVxuICAgICAgY29uc3QgdGFyZ2V0UHJvamVjdEZpbGVzUmVnZXggPSBuZXcgUmVnRXhwKGBeKCg/ISR7cHJvamVjdFJvb3RQYXRofSkuKSokYCkgLy8gbmVnYXRpb24gLSBwYXRocyB0aGF0IGRvbid0IGluY2x1ZGUgdGhlIHBhdGggaS5lLiBvdXRzaWRlIHRoZSBkaXJlY3RvcnkuXG4gICAgICB0aGlzLmNvbmZpZy5pZ25vcmUucHVzaCh0YXJnZXRQcm9qZWN0RmlsZXNSZWdleCkgLy8gdHJhbnNwaWxlIGZpbGVzIHRoYXQgYXJlIG5lc3RlZCBpbiB0aGUgdGFyZ2V0IHByb2plY3Qgb25seS5cbiAgICB9XG5cbiAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXJzXG4gICAgdGhpcy5vbignZmlsZUxvYWRlZCcsIGZpbGVPYmplY3QgPT4gdGhpcy5sb2FkZWRGaWxlcy5wdXNoKGZpbGVPYmplY3QpKVxuXG4gICAgLy8gSG9va3MgZXhlY3V0ZWQgaW4gb3JkZXJcbiAgICAvLyAjMSAtIHRyYWNraW5nIGZpbGVzIGlzIGZvciBkZWJ1Z2dpbmcgcHVycG9zZXMgb25seSwgdGhlIGFjdHVhbCBydW50aW1lIHRyYW5zZm9ybWF0aW9uIGhhcHBlbnMgaW4gYmFiZWwgYHJlcXVpcmVIb29rYC4gVGhlIHRyYWNrZXIgdHJpZXMgdG8gbWltaWMgdGhlIGdsb2IgZmlsZSBtYXRjaGluZyB1c2luZyB0aGUgaWdub3JlIG9wdGlvbiBwYXNzZWQgYGNvbmZpZy5pZ25vcmVgXG4gICAge1xuICAgICAgbGV0IHJldmVydEhvb2sgPSByZXF1aXJlSG9vay50cmFja0ZpbGUoe1xuICAgICAgICBlbWl0OiAoY29kZSwgZmlsZW5hbWUpID0+IHRoaXMuZW1pdCgnZmlsZUxvYWRlZCcsIHsgZmlsZW5hbWUsIGNvZGUgfSksXG4gICAgICAgIGlnbm9yZUZpbGVuYW1lUGF0dGVybjogdGhpcy5jb25maWcuaWdub3JlLFxuICAgICAgICBleHRlbnNpb246IHRoaXMuZXh0ZW5zaW9ucyxcbiAgICAgIH0pXG4gICAgICByZXZlcnRIb29rTGlzdC5wdXNoKHJldmVydEhvb2spXG4gICAgfVxuXG4gICAgLy8gIzIgLSBSdW50aW1lIHRyYW5zcGlsYXRpb25cbiAgICB7XG4gICAgICBjb25zb2xlLmxvZyhgW2phdmFzY3JpcHRUcmFuc3BpbGF0aW9uXSBSZWdpc3RlcmVkIE5vZGVqcyByZXF1aXJlIGhvb2sgZm9yIHJ1bnRpbWUgdHJhbnNwaWxhdGlvbiAtICR7dGhpcy5jYWxsZXJQYXRoIHx8ICdVbmtub3duIGNvbXBpbGVyLmNhbGxlclBhdGgnfWApXG4gICAgICAvLyB0aGlzLmNvbmZpZy5pZ25vcmUgPSBbL25vZGVfbW9kdWxlcy8sIC9eKCg/IVxcL3dlYmFwcFxcL25vZGVfbW9kdWxlc1xcL0BzZXJ2aWNlXFwvd2ViYXBwLWNsaWVudFNpZGUpLikqJC9dXG4gICAgICBsZXQgcmV2ZXJ0SG9va1xuICAgICAgLy8gcmV2ZXJ0SG9vayA9IHJlcXVpcmVIb29rLmJhYmVsUmVnaXN0ZXIoeyBiYWJlbFJlZ2lzdGVyQ29uZmlnOiBPYmplY3QuYXNzaWduKHsgZXh0ZW5zaW9uczogdGhpcy5leHRlbnNpb25zIH0sIHRoaXMuY29uZmlnKSB9KSAvLyEgYmFiZWxSZWdpc3RlciBkb2Vzbid0IHN1cHBvcnQgbXVsdGlwbGUgaG9va3MsIGFuZCB3aWxsIG92ZXJyaWRlIHByZXZpb3VzIG9uZXMuXG4gICAgICByZXZlcnRIb29rID0gcmVxdWlyZUhvb2suYmFiZWxUcmFuc2Zvcm0oeyBiYWJlbENvbmZpZzogdGhpcy5jb25maWcsIGV4dGVuc2lvbjogdGhpcy5leHRlbnNpb25zLCBpZ25vcmVOb2RlTW9kdWxlczogZmFsc2UsIGlnbm9yZUZpbGVuYW1lUGF0dGVybjogdGhpcy5jb25maWcuaWdub3JlIH0pXG4gICAgICByZXZlcnRIb29rTGlzdC5wdXNoKHJldmVydEhvb2spXG4gICAgfVxuXG4gICAgLy8gIzMgLSBvdXRwdXQgdHJhbnNwaWxhdGlvbiAtIG91dHB1dCB0cmFuc3BpbGF0aW9uIHJlc3VsdCBpbnRvIGZpbGVzeXN0ZW0gZmlsZXNcbiAgICB7XG4gICAgICB0aGlzLnNldFByaW1hcnlUYXJnZXRQcm9qZWN0KClcbiAgICAgIGxldCByZXZlcnRIb29rID0gcmVxdWlyZUhvb2sud3JpdGVGaWxlVG9EaXNrKHtcbiAgICAgICAgZXh0ZW5zaW9uOiB0aGlzLmV4dGVuc2lvbnMsXG4gICAgICAgIGlnbm9yZUZpbGVuYW1lUGF0dGVybjogdGhpcy5jb25maWcuaWdub3JlLFxuICAgICAgICB0YXJnZXRQcm9qZWN0Q29uZmlnOiB0aGlzLnByaW1hcnlUYXJnZXRQcm9qZWN0Q29uZmlnLFxuICAgICAgfSlcbiAgICAgIHJldmVydEhvb2tMaXN0LnB1c2gocmV2ZXJ0SG9vaylcbiAgICB9XG5cbiAgICByZXR1cm4geyByZXZlcnRIb29rOiAoKSA9PiByZXZlcnRIb29rTGlzdC5mb3JFYWNoKHJldmVydCA9PiByZXZlcnQoKSkgfVxuICB9XG5cbiAgLy8gbG9va3VwIHRoZSBwcm9qZWN0IHRoYXQgaW5zdGFudGlhdGVkIGEgQ29tcGlsZXIgaW5zdGFuY2UuXG4gIHNldFRhcmdldFByb2plY3QoKSB7XG4gICAgaWYgKHRoaXMudGFyZ2V0UHJvamVjdENvbmZpZykgcmV0dXJuXG4gICAgYXNzZXJ0KHRoaXMuY2FsbGVyUGF0aCwgJ+KAoiBjYWxsZXJQYXRoIHNob3VsZCBiZSBwYXNzZWQgaW4gY2FzZSBiYWJlbCBjb25maWd1cmF0aW9uIHdhcyBub3QgcHJvdmlkZWQnKVxuICAgIGNvbnN0IHsgZmluZFRhcmdldFByb2plY3RSb290IH0gPSByZXF1aXJlKCdAZGVwbG95bWVudC9jb25maWd1cmF0aW9uTWFuYWdlbWVudCcpIC8vIHJlcXVpcmUgaGVyZSB0byBwcmV2ZW50IGN5Y2xpYyBkZXBlbmRlbmN5IHdpdGggdGhpcyBtb2R1bGUsIGFzIHRoZSBtb2R1bGUgbWF5IHVzZSBydW50aW1lIHRyYW5zcGlsYXRpb24gKGkuZS4gd2lsbCB1c2UgZXhwb3J0ZWQgZnVuY3Rpb25hbGl0eSBmcm9tIHRoaXMgbW9kdWxlKS5cblxuICAgIC8vIE5PVEU6IERPRVNOJ1QgV09SSyAtIGNoZWNrIGZvciBjaXJjdWxhciBkZXBlbmRlbmN5XG4gICAgLy8gbGV0IG1vZHVsZUxvYWRlZFxuICAgIC8vIHRyeSB7XG4gICAgLy8gICBtb2R1bGVMb2FkZWQgPSAhIXJlcXVpcmUuY2FjaGVbcmVxdWlyZS5yZXNvbHZlKCdAZGVwbG95bWVudC9jb25maWd1cmF0aW9uTWFuYWdlbWVudCcpXVxuICAgIC8vIH0gY2F0Y2ggKGV4KSB7XG4gICAgLy8gICBtb2R1bGVMb2FkZWQgPSBmYWxzZVxuICAgIC8vIH1cbiAgICAvLyBhc3NlcnQobW9kdWxlTG9hZGVkLCAn4oCiIGNvbmZpZ3VyYXRpb25NYW5hZ2VtZW50IG1vZHVsZSBkaWQgbm90IGZpbmlzaCBsb2FkaW5nLCBhIGNpcmN1bGFyIGRlcGVuZGVuY3kgcHJvYmFibHkgY2F1c2VkIGJ5IHN5bWxpbmtpbmcgdG8gd2l0aCBydW50aW1lIHRyYW5zcGlsYXRpb24gb2YgdGhlIG1vZHVsZScpXG5cbiAgICB0aGlzLnRhcmdldFByb2plY3RDb25maWcgPSBmaW5kVGFyZ2V0UHJvamVjdFJvb3QoeyBuZXN0ZWRQcm9qZWN0UGF0aDogW3RoaXMuY2FsbGVyUGF0aF0gfSlcbiAgfVxuXG4gIC8vIG1haW4gdGFyZ2V0IHByb2plY3QgdGhhdCBpbml0aWF0ZWQgdGhlIG5vZGUgcHJvY2VzcyBmcm9tIGNsaSBvciByZXF1aXJlIHRoZSBtb2R1bGUgYmVmb3JlIGJlaW5nIGNhY2hlZCwgaW4gY2FzZXMgd2hlcmUgbm9kZV9tb2R1bGVzIGFyZSBhbHNvIHRyYW5zcGlsZWQuXG4gIHNldFByaW1hcnlUYXJnZXRQcm9qZWN0KHsgbmVzdGVkUHJvamVjdFBhdGggPSBbcHJvY2Vzcy5jd2QoKSwgbW9kdWxlLnBhcmVudC5maWxlbmFtZSAvKiBUaGUgcGxhY2Ugd2hlcmUgdGhlIG1vZHVsZSB3YXMgcmVxdWlyZWQgZnJvbSAqL10gfSA9IHt9KSB7XG4gICAgaWYgKHRoaXMucHJpbWFyeVRhcmdldFByb2plY3RDb25maWcpIHJldHVyblxuICAgIGNvbnN0IHsgZmluZFRhcmdldFByb2plY3RSb290IH0gPSByZXF1aXJlKCdAZGVwbG95bWVudC9jb25maWd1cmF0aW9uTWFuYWdlbWVudCcpIC8vIHJlcXVpcmUgaGVyZSB0byBwcmV2ZW50IGN5Y2xpYyBkZXBlbmRlbmN5IHdpdGggdGhpcyBtb2R1bGUsIGFzIHRoZSBtb2R1bGUgbWF5IHVzZSBydW50aW1lIHRyYW5zcGlsYXRpb24gKGkuZS4gd2lsbCB1c2UgZXhwb3J0ZWQgZnVuY3Rpb25hbGl0eSBmcm9tIHRoaXMgbW9kdWxlKS5cbiAgICB0aGlzLnByaW1hcnlUYXJnZXRQcm9qZWN0Q29uZmlnID0gZmluZFRhcmdldFByb2plY3RSb290KHsgbmVzdGVkUHJvamVjdFBhdGggfSlcbiAgfVxufVxuXG4vLyB0cmFjayBpbnN0YW5jZXMgaW4gY3VycmVudCBwcm9jZXNzXG5Db21waWxlci5pbnN0YW5jZSA9IFtdXG4vLyAvLyBkZWJ1ZyBjcmVhdGVkIGluc3RhbmNlcyBpbiBjdXJyZW50IHByb2Nlc3Ncbi8vIHByb2Nlc3Mub24oJ2V4aXQnLCAoKSA9PiB7XG4vLyAgIGZvciAobGV0IGNvbXBpbGVyIG9mIENvbXBpbGVyLmluc3RhbmNlKSBjb25zb2xlLmxvZyhjb21waWxlci5jb25maWcuaWdub3JlKVxuLy8gICBjb25zb2xlLmxvZyhDb21waWxlci5pbnN0YW5jZVswXS5iYWJlbENvbmZpZy5pZ25vcmUgPT09IENvbXBpbGVyLmluc3RhbmNlWzFdLmJhYmVsQ29uZmlnLmlnbm9yZSlcbi8vIH0pXG5cbi8qIFRPRE86IHJlZ2lzdGVyIHRoZSBtb2R1bGVzIHRoYXQgcmVnaXN0ZXJlZCBhIHJlcXVpcmUgaG9vayBmb3IgY29tcGlsYXRpb24uIGtlZXAgdHJhY2sgb2YgYWxsIHByb2plY3RzIHRoYXQgaW5pdGlhdGVkIGEgcmVxdWlyZSBob29rIHJlZ2lzdHJhdGlvbi4gXG4gICAgKEhvdyB0byBmaW5kIG91dCB0aGUgbW9kdWxlIHBhdGggdGhhdCBpbml0aWF0ZXMgYSBDb21waWxlciBpbnN0YW5jZSB3aXRob3V0IHBhc3NpbmcgaW4gJ19fZGlybmFtZScgPyBcbiAgICAgIGkuZS4gaGFja2lzaCB3YXkgdG8gZmluZCBmdW5jdGlvbiBjYWxsZXIgaW4gRUNNQXNjcmlwdClcbiAgICBTZWVtcyBsaWtlIGEgd29ya2Fyb3VuZCAtIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEzMjI3NDg5L2hvdy1jYW4tb25lLWdldC10aGUtZmlsZS1wYXRoLW9mLXRoZS1jYWxsZXItZnVuY3Rpb24taW4tbm9kZS1qcyAqL1xuLy8gQ29tcGlsZXIucmVnaXN0ZXJlZEhvb2sgPSBbXSAvLyBpbml0aWFsaXplIHByb3BlcnR5LlxuLy8gQ29tcGlsZXIudHJhY2tSZWdpc3RlcmVkSG9vayA9ICgpID0+IENvbXBpbGVyLnJlZ2lzdGVyZWRIb29rLnB1c2goLypQcm9qZWN0IHRoYXQgY3JlYXRlZCBhIG5ldyBpbnN0YW5jZSBvZiBDb21waWxlciovKVxuXG5Db21waWxlci50cmFuc3BpbGF0aW9uTW9kdWxlUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicpIC8vIGlmIG11bHRpcGxlIG1vZHVsZXMgYXJlIGluc3RhbGxlZCBpbiBkaWZmZXJlbnQgcGFja2FnZXMgcmF0aGVyIHRoYW4gdXNpbmcgdGhlIHNhbWUgbW9kdWxlLlxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ29tcGlsZXIsXG59XG4iXX0=
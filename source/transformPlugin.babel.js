"use strict";const _path = require('path');
const resolveModule = require('resolve');
const babel = require('@babel/core');
const CONCAT_NO_PACKAGE_ERROR = 'Dynamic import with a concatenated string should start with a valid full package name.';

{

  function resolveUsingExternalPackage() {



























  }
}




















module.exports.transformNamedModuleToPath = function () {
  return {
    visitor: {
      'ImportDeclaration|ExportNamedDeclaration'(path, state) {
        if (!path.node.source) return;
        let importer = state.file.opts.filename,
        source = path.node.source,
        importee = source.value;


        if (source.value.startsWith('/') || source.value.startsWith('.')) return;

        let pathToResolve = importee;
        let pathToAppend = '';

        const parts = importee.split('/');
        if (importee.startsWith('@')) {
          if (parts.length < 2) throw new Error(CONCAT_NO_PACKAGE_ERROR);

          pathToResolve = `${parts[0]}/${parts[1]}`;
          pathToAppend = parts.slice(2, parts.length).join('/');
        } else {
          if (parts.length < 1) throw new Error(CONCAT_NO_PACKAGE_ERROR);
          [pathToResolve] = parts;
          pathToAppend = parts.slice(1, parts.length).join('/');
        }

        const lookupDirectory = _path.dirname(importer),
        moduleDirectory = ['node_modules', '@package'];


        let resolvedPath;
        if (pathToAppend) {
          pathToResolve = `${pathToResolve}/package.json`;
          let resolvedPackage = resolveModule.sync(pathToResolve, { basedir: lookupDirectory, moduleDirectory });
          const packageDir = resolvedPackage.substring(0, resolvedPackage.length - 'package.json'.length);
          resolvedPath = `${packageDir}${pathToAppend}`;
        } else {
          resolvedPath = resolveModule.sync(pathToResolve, {
            basedir: lookupDirectory,
            moduleDirectory,

            packageFilter: packageConfig => {
              if (packageConfig.module) packageConfig.main = packageConfig.module;
              return packageConfig;
            } });

        }


        let relativePathFromImporter = `./${_path.relative(_path.dirname(importer), resolvedPath)}`;






        source.value = relativePathFromImporter;
      } } };


};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS90cmFuc2Zvcm1QbHVnaW4uYmFiZWwuanMiXSwibmFtZXMiOlsiX3BhdGgiLCJyZXF1aXJlIiwicmVzb2x2ZU1vZHVsZSIsImJhYmVsIiwiQ09OQ0FUX05PX1BBQ0tBR0VfRVJST1IiLCJyZXNvbHZlVXNpbmdFeHRlcm5hbFBhY2thZ2UiLCJtb2R1bGUiLCJleHBvcnRzIiwidHJhbnNmb3JtTmFtZWRNb2R1bGVUb1BhdGgiLCJ2aXNpdG9yIiwicGF0aCIsInN0YXRlIiwibm9kZSIsInNvdXJjZSIsImltcG9ydGVyIiwiZmlsZSIsIm9wdHMiLCJmaWxlbmFtZSIsImltcG9ydGVlIiwidmFsdWUiLCJzdGFydHNXaXRoIiwicGF0aFRvUmVzb2x2ZSIsInBhdGhUb0FwcGVuZCIsInBhcnRzIiwic3BsaXQiLCJsZW5ndGgiLCJFcnJvciIsInNsaWNlIiwiam9pbiIsImxvb2t1cERpcmVjdG9yeSIsImRpcm5hbWUiLCJtb2R1bGVEaXJlY3RvcnkiLCJyZXNvbHZlZFBhdGgiLCJyZXNvbHZlZFBhY2thZ2UiLCJzeW5jIiwiYmFzZWRpciIsInBhY2thZ2VEaXIiLCJzdWJzdHJpbmciLCJwYWNrYWdlRmlsdGVyIiwicGFja2FnZUNvbmZpZyIsIm1haW4iLCJyZWxhdGl2ZVBhdGhGcm9tSW1wb3J0ZXIiLCJyZWxhdGl2ZSJdLCJtYXBwaW5ncyI6ImFBQUEsTUFBTUEsS0FBSyxHQUFHQyxPQUFPLENBQUMsTUFBRCxDQUFyQjtBQUNBLE1BQU1DLGFBQWEsR0FBR0QsT0FBTyxDQUFDLFNBQUQsQ0FBN0I7QUFDQSxNQUFNRSxLQUFLLEdBQUdGLE9BQU8sQ0FBQyxhQUFELENBQXJCO0FBQ0EsTUFBTUcsdUJBQXVCLEdBQUcsd0ZBQWhDOztBQUVBOztBQUVFLFdBQVNDLDJCQUFULEdBQXVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJ0QztBQUNGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkRDLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlQywwQkFB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QkFBd0IsR0FBSSxLQUFJekMsS0FBSyxDQUFDMEMsUUFBTixDQUFlMUMsS0FBSyxDQUFDOEIsT0FBTixDQUFjaEIsUUFBZCxDQUFmLEVBQStEa0IsWUFBL0QsQ0FBNkUsRUFBakg7Ozs7Ozs7QUFPQW5CLFFBQUFBLE1BQU0sQ0FBQ00sS0FBUCxHQUFlc0Isd0JBQWY7QUFDRCxPQXhETSxFQURKLEVBQVA7OztBQTRERCxDQTdERCIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IF9wYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCByZXNvbHZlTW9kdWxlID0gcmVxdWlyZSgncmVzb2x2ZScpIC8vIHJlc29sdmUgb3B0b2lucyBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9yZXNvbHZlI3Jlc29sdmVpZC1vcHRzLWNiXG5jb25zdCBiYWJlbCA9IHJlcXVpcmUoJ0BiYWJlbC9jb3JlJylcbmNvbnN0IENPTkNBVF9OT19QQUNLQUdFX0VSUk9SID0gJ0R5bmFtaWMgaW1wb3J0IHdpdGggYSBjb25jYXRlbmF0ZWQgc3RyaW5nIHNob3VsZCBzdGFydCB3aXRoIGEgdmFsaWQgZnVsbCBwYWNrYWdlIG5hbWUuJ1xuXG57XG4gIC8vIGNvbnN0IHJlc29sdmVCYXNlTW9kdWxlID0gcmVxdWlyZSgnQHJvbGx1cC9wbHVnaW4tbm9kZS1yZXNvbHZlJylcbiAgZnVuY3Rpb24gcmVzb2x2ZVVzaW5nRXh0ZXJuYWxQYWNrYWdlKCkge1xuICAgIC8vICAgbGV0IHJlc29sdmVkID0gcmVzb2x2ZUJhc2VNb2R1bGUoe1xuICAgIC8vICAgICAvLyBub3QgYWxsIGZpbGVzIHlvdSB3YW50IHRvIHJlc29sdmUgYXJlIC5qcyBmaWxlc1xuICAgIC8vICAgICBleHRlbnNpb25zOiBbJy5tanMnLCAnLmpzJywgJy5qc3gnLCAnLmpzb24nXSwgLy8gRGVmYXVsdDogWyAnLm1qcycsICcuanMnLCAnLmpzb24nLCAnLm5vZGUnIF1cbiAgICAvLyAgICAgLy8gdGhlIGZpZWxkcyB0byBzY2FuIGluIGEgcGFja2FnZS5qc29uIHRvIGRldGVybWluZSB0aGUgZW50cnkgcG9pbnRcbiAgICAvLyAgICAgLy8gaWYgdGhpcyBsaXN0IGNvbnRhaW5zIFwiYnJvd3NlclwiLCBvdmVycmlkZXMgc3BlY2lmaWVkIGluIFwicGtnLmJyb3dzZXJcIlxuICAgIC8vICAgICAvLyB3aWxsIGJlIHVzZWRcbiAgICAvLyAgICAgbWFpbkZpZWxkczogWydtb2R1bGUnLCAnbWFpbiddLCAvLyBEZWZhdWx0OiBbJ21vZHVsZScsICdtYWluJ11cbiAgICAvLyAgICAgLy8gc29tZSBwYWNrYWdlLmpzb24gZmlsZXMgaGF2ZSBhIFwiYnJvd3NlclwiIGZpZWxkIHdoaWNoIHNwZWNpZmllcyBhbHRlcm5hdGl2ZSBmaWxlcyB0byBsb2FkIGZvciBwZW9wbGUgYnVuZGxpbmcgZm9yIHRoZSBicm93c2VyLiBJZiB0aGF0J3MgeW91LCBlaXRoZXIgdXNlIHRoaXMgb3B0aW9uIG9yIGFkZCBcImJyb3dzZXJcIiB0byB0aGUgXCJtYWluZmllbGRzXCIgb3B0aW9uLCBvdGhlcndpc2UgcGtnLmJyb3dzZXIgd2lsbCBiZSBpZ25vcmVkXG4gICAgLy8gICAgIGJyb3dzZXI6IGZhbHNlLCAvLyBEZWZhdWx0OiBmYWxzZVxuICAgIC8vICAgICAvLyB3aGV0aGVyIHRvIHByZWZlciBidWlsdC1pbiBtb2R1bGVzIChlLmcuIGBmc2AsIGBwYXRoYCkgb3IgbG9jYWwgb25lcyB3aXRoIHRoZSBzYW1lIG5hbWVzXG4gICAgLy8gICAgIHByZWZlckJ1aWx0aW5zOiBmYWxzZSwgLy8gRGVmYXVsdDogdHJ1ZVxuICAgIC8vICAgICAvLyBMb2NrIHRoZSBtb2R1bGUgc2VhcmNoIGluIHRoaXMgcGF0aCAobGlrZSBhIGNocm9vdCkuIE1vZHVsZSBkZWZpbmVkIG91dHNpZGUgdGhpcyBwYXRoIHdpbGwgYmUgbWFya2VkIGFzIGV4dGVybmFsXG4gICAgLy8gICAgIGphaWw6ICcvJywgLy8gRGVmYXVsdDogJy8nXG4gICAgLy8gICAgIC8vIFNldCB0byBhbiBhcnJheSBvZiBzdHJpbmdzIGFuZC9vciByZWdleHBzIHRvIGxvY2sgdGhlIG1vZHVsZSBzZWFyY2ggdG8gbW9kdWxlcyB0aGF0IG1hdGNoIGF0IGxlYXN0IG9uZSBlbnRyeS4gTW9kdWxlcyBub3QgbWF0Y2hpbmcgYW55IGVudHJ5IHdpbGwgYmUgbWFya2VkIGFzIGV4dGVybmFsXG4gICAgLy8gICAgIC8vIG9ubHk6IFsnc29tZV9tb2R1bGUnLCAvXkBzb21lX3Njb3BlXFwvLiokL10sIC8vIERlZmF1bHQ6IG51bGxcbiAgICAvLyAgICAgLy8gSWYgdHJ1ZSwgaW5zcGVjdCByZXNvbHZlZCBmaWxlcyB0byBjaGVjayB0aGF0IHRoZXkgYXJlIEVTMjAxNSBtb2R1bGVzXG4gICAgLy8gICAgIG1vZHVsZXNPbmx5OiBmYWxzZSwgLy8gRGVmYXVsdDogZmFsc2VcbiAgICAvLyAgICAgLy8gRm9yY2UgcmVzb2x2aW5nIGZvciB0aGVzZSBtb2R1bGVzIHRvIHJvb3QncyBub2RlX21vZHVsZXMgdGhhdCBoZWxwc1xuICAgIC8vICAgICAvLyB0byBwcmV2ZW50IGJ1bmRsaW5nIHRoZSBzYW1lIHBhY2thZ2UgbXVsdGlwbGUgdGltZXMgaWYgcGFja2FnZSBpc1xuICAgIC8vICAgICAvLyBpbXBvcnRlZCBmcm9tIGRlcGVuZGVuY2llcy5cbiAgICAvLyAgICAgLy8gZGVkdXBlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLCAvLyBEZWZhdWx0OiBbXVxuICAgIC8vICAgICAvLyBBbnkgYWRkaXRpb25hbCBvcHRpb25zIHRoYXQgc2hvdWxkIGJlIHBhc3NlZCB0aHJvdWdoXG4gICAgLy8gICAgIC8vIHRvIG5vZGUtcmVzb2x2ZVxuICAgIC8vICAgICAvLyBjdXN0b21SZXNvbHZlT3B0aW9uczoge1xuICAgIC8vICAgICAvLyAgIG1vZHVsZURpcmVjdG9yeTogJ2pzX21vZHVsZXMnLFxuICAgIC8vICAgICAvLyB9LFxuICAgIC8vICAgfSlcbiAgfVxufVxuXG4vKipcbiAqIEJhYmVsIHRyYW5zZm9ybSBwbHVnaW4gY29udmVydHMgbmFtZSBtb2R1bGVzIGJlZ2lubmluZyB3aXRoIEAgdG8gdGhlaXIgcmVsYXRpdmUgcGF0aCBjb3VudGVycGFydHMgb3IgYSBuYW1lZCBtb2R1bGUgKG5vbi1yZWxhdGl2ZSBwYXRoKS5cbiAqIHRyYW5zZm9ybSBleGFtcGxlIFwiQHBvbHltZXIvcG9seW1lci9lbGVtZW50LmpzXCIgLS0+IFwiL0B3ZWJjb21wb25lbnQvQHBhY2thZ2UvQHBvbHltZXIvcG9seW1lci9lbGVtZW50LmpzXCJcbiAqIHRyYW5zZm9ybSBleGFtcGxlIFwibGl0LWh0bWwvbGliL2xpdC1leHRlbmRlZC5qc1wiIC0tPiBcIi9Ad2ViY29tcG9uZW50L0BwYWNrYWdlL2xpdC1odG1sL2xpYi9saXQtZXh0ZW5kZWQuanNcIlxuICogaHR0cHM6Ly9hc3RleHBsb3Jlci5uZXQvXG4gIFxuICBpbXBsZW1lbnRhdGlvbiBpbiBvcGVuLXdjIFxuICAgIC0gaHR0cHM6Ly9naXRodWIuY29tL29wZW4td2Mvb3Blbi13Yy9ibG9iL21hc3Rlci9wYWNrYWdlcy9lcy1kZXYtc2VydmVyL3NyYy91dGlscy9yZXNvbHZlLW1vZHVsZS1pbXBvcnRzLmpzI0w3OVxuICAgIC0gaHR0cHM6Ly9naXRodWIuY29tL29wZW4td2Mvb3Blbi13Yy9ibG9iL21hc3Rlci9wYWNrYWdlcy9lcy1kZXYtc2VydmVyL3NyYy91dGlscy9yZXNvbHZlLW1vZHVsZS1pbXBvcnRzLmpzXG4gICAgLSBodHRwczovL2dpdGh1Yi5jb20vcm9sbHVwL3BsdWdpbnMvYmxvYi9tYXN0ZXIvcGFja2FnZXMvbm9kZS1yZXNvbHZlL3NyYy9pbmRleC5qcyNMMjlcbiAgICAtIGh0dHBzOi8vb3Blbi13Yy5vcmcvZGV2ZWxvcGluZy9lcy1kZXYtc2VydmVyLmh0bWwjc3RhcnRzZXJ2ZXJcbiAgICAtIGh0dHBzOi8vZ2l0aHViLmNvbS9yb2xsdXAvcGx1Z2lucy90cmVlL21hc3Rlci9wYWNrYWdlcy9ub2RlLXJlc29sdmVcbiAgICAtIGh0dHBzOi8vZ2l0aHViLmNvbS9ndXliZWRmb3JkL2VzLW1vZHVsZS1sZXhlclxuICAgIC0gaHR0cHM6Ly9naXRodWIuY29tL29wZW4td2Mvb3Blbi13Yy9ibG9iL21hc3Rlci9wYWNrYWdlcy9lcy1kZXYtc2VydmVyL3NyYy91dGlscy9iYWJlbC10cmFuc2Zvcm0uanNcbiAgICAtIGh0dHBzOi8vZ2l0aHViLmNvbS90bGV1bmVuL2JhYmVsLXBsdWdpbi1tb2R1bGUtcmVzb2x2ZXIvYmxvYi9tYXN0ZXIvc3JjL2luZGV4LmpzXG5cblxuLy8gIFRPRE86IGltcGxlbWVudCBEZWRvcCBpbXBvcnRzLlxuICovXG5tb2R1bGUuZXhwb3J0cy50cmFuc2Zvcm1OYW1lZE1vZHVsZVRvUGF0aCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHZpc2l0b3I6IHtcbiAgICAgICdJbXBvcnREZWNsYXJhdGlvbnxFeHBvcnROYW1lZERlY2xhcmF0aW9uJyhwYXRoLCBzdGF0ZSkge1xuICAgICAgICBpZiAoIXBhdGgubm9kZS5zb3VyY2UpIHJldHVyblxuICAgICAgICBsZXQgaW1wb3J0ZXIgPSBzdGF0ZS5maWxlLm9wdHMuZmlsZW5hbWUsIC8vIGFic29sdXRlIHBhdGggb2YgY3VycmVudCBmaWxlIGJlaW5nIHRyYW5zZm9ybWVkXG4gICAgICAgICAgc291cmNlID0gcGF0aC5ub2RlLnNvdXJjZSxcbiAgICAgICAgICBpbXBvcnRlZSA9IHNvdXJjZS52YWx1ZVxuXG4gICAgICAgIC8vIGlmIGJhcmUgaW1wb3J0LCBpLmUuIG5vdCBhYnNvbHV0ZSBvciByZWxhdGl2ZSBwYXRoXG4gICAgICAgIGlmIChzb3VyY2UudmFsdWUuc3RhcnRzV2l0aCgnLycpIHx8IHNvdXJjZS52YWx1ZS5zdGFydHNXaXRoKCcuJykpIHJldHVyblxuXG4gICAgICAgIGxldCBwYXRoVG9SZXNvbHZlID0gaW1wb3J0ZWVcbiAgICAgICAgbGV0IHBhdGhUb0FwcGVuZCA9ICcnXG5cbiAgICAgICAgY29uc3QgcGFydHMgPSBpbXBvcnRlZS5zcGxpdCgnLycpXG4gICAgICAgIGlmIChpbXBvcnRlZS5zdGFydHNXaXRoKCdAJykpIHtcbiAgICAgICAgICBpZiAocGFydHMubGVuZ3RoIDwgMikgdGhyb3cgbmV3IEVycm9yKENPTkNBVF9OT19QQUNLQUdFX0VSUk9SKVxuXG4gICAgICAgICAgcGF0aFRvUmVzb2x2ZSA9IGAke3BhcnRzWzBdfS8ke3BhcnRzWzFdfWBcbiAgICAgICAgICBwYXRoVG9BcHBlbmQgPSBwYXJ0cy5zbGljZSgyLCBwYXJ0cy5sZW5ndGgpLmpvaW4oJy8nKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPCAxKSB0aHJvdyBuZXcgRXJyb3IoQ09OQ0FUX05PX1BBQ0tBR0VfRVJST1IpXG4gICAgICAgICAgO1twYXRoVG9SZXNvbHZlXSA9IHBhcnRzXG4gICAgICAgICAgcGF0aFRvQXBwZW5kID0gcGFydHMuc2xpY2UoMSwgcGFydHMubGVuZ3RoKS5qb2luKCcvJylcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxvb2t1cERpcmVjdG9yeSA9IF9wYXRoLmRpcm5hbWUoaW1wb3J0ZXIpLFxuICAgICAgICAgIG1vZHVsZURpcmVjdG9yeSA9IFsnbm9kZV9tb2R1bGVzJywgJ0BwYWNrYWdlJ11cblxuICAgICAgICAvLyBpZiBubyBzcGVjaWZpYyBmaWxlIGluIHRoZSB0YXJnZXQgbW9kdWxlIGlzIHNwZWNpZmllZCAoZS5nLiBgbGl0LWh0bWwvc3BlY2lmaWMuanNgKVxuICAgICAgICBsZXQgcmVzb2x2ZWRQYXRoXG4gICAgICAgIGlmIChwYXRoVG9BcHBlbmQpIHtcbiAgICAgICAgICBwYXRoVG9SZXNvbHZlID0gYCR7cGF0aFRvUmVzb2x2ZX0vcGFja2FnZS5qc29uYFxuICAgICAgICAgIGxldCByZXNvbHZlZFBhY2thZ2UgPSByZXNvbHZlTW9kdWxlLnN5bmMocGF0aFRvUmVzb2x2ZSwgeyBiYXNlZGlyOiBsb29rdXBEaXJlY3RvcnksIG1vZHVsZURpcmVjdG9yeSB9KVxuICAgICAgICAgIGNvbnN0IHBhY2thZ2VEaXIgPSByZXNvbHZlZFBhY2thZ2Uuc3Vic3RyaW5nKDAsIHJlc29sdmVkUGFja2FnZS5sZW5ndGggLSAncGFja2FnZS5qc29uJy5sZW5ndGgpXG4gICAgICAgICAgcmVzb2x2ZWRQYXRoID0gYCR7cGFja2FnZURpcn0ke3BhdGhUb0FwcGVuZH1gXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZWRQYXRoID0gcmVzb2x2ZU1vZHVsZS5zeW5jKHBhdGhUb1Jlc29sdmUsIHtcbiAgICAgICAgICAgIGJhc2VkaXI6IGxvb2t1cERpcmVjdG9yeSxcbiAgICAgICAgICAgIG1vZHVsZURpcmVjdG9yeSxcbiAgICAgICAgICAgIC8vIHVzZSBcIm1vZHVsZVwiIGZpZWxkIGluc3RlYWQgb2YgXCJtYWluXCIgZmllbGQgd2hlbiBwcmVzZW50XG4gICAgICAgICAgICBwYWNrYWdlRmlsdGVyOiBwYWNrYWdlQ29uZmlnID0+IHtcbiAgICAgICAgICAgICAgaWYgKHBhY2thZ2VDb25maWcubW9kdWxlKSBwYWNrYWdlQ29uZmlnLm1haW4gPSBwYWNrYWdlQ29uZmlnLm1vZHVsZVxuICAgICAgICAgICAgICByZXR1cm4gcGFja2FnZUNvbmZpZ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gY3JlYXRlIHJlbGF0aXZlIHBhdGggZm9yIGJyb3dzZXIgY29uc3VtcHRpb25cbiAgICAgICAgbGV0IHJlbGF0aXZlUGF0aEZyb21JbXBvcnRlciA9IGAuLyR7X3BhdGgucmVsYXRpdmUoX3BhdGguZGlybmFtZShpbXBvcnRlcikgLypyZWxhdGl2ZSB0byBmb2xkZXIqLywgcmVzb2x2ZWRQYXRoKX1gXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coYGltcG9ydGVlOiAke2ltcG9ydGVlfWApXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBpbXBvcnRlcjogJHtpbXBvcnRlcn1gKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgcmVzb2x2ZWRQYXRoOiAke3Jlc29sdmVkUGF0aH1gKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgcmVsYXRpdmVQYXRoRnJvbUltcG9ydGVyOiAke3JlbGF0aXZlUGF0aEZyb21JbXBvcnRlcn1gKVxuICAgICAgICAvLyBjb25zb2xlLmxvZygnXFxuJylcbiAgICAgICAgc291cmNlLnZhbHVlID0gcmVsYXRpdmVQYXRoRnJvbUltcG9ydGVyXG4gICAgICB9LFxuICAgIH0sXG4gIH1cbn1cbiJdfQ==
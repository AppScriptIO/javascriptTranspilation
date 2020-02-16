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

            packageFilter: package => {
              if (package.module) package.main = package.module;
              return package;
            } });

        }


        let relativePathFromImporter = `./${_path.relative(_path.dirname(importer), resolvedPath)}`;






        source.value = relativePathFromImporter;
      } } };


};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS90cmFuc2Zvcm1QbHVnaW4uYmFiZWwuanMiXSwibmFtZXMiOlsiX3BhdGgiLCJyZXF1aXJlIiwicmVzb2x2ZU1vZHVsZSIsImJhYmVsIiwiQ09OQ0FUX05PX1BBQ0tBR0VfRVJST1IiLCJyZXNvbHZlVXNpbmdFeHRlcm5hbFBhY2thZ2UiLCJtb2R1bGUiLCJleHBvcnRzIiwidHJhbnNmb3JtTmFtZWRNb2R1bGVUb1BhdGgiLCJ2aXNpdG9yIiwicGF0aCIsInN0YXRlIiwibm9kZSIsInNvdXJjZSIsImltcG9ydGVyIiwiZmlsZSIsIm9wdHMiLCJmaWxlbmFtZSIsImltcG9ydGVlIiwidmFsdWUiLCJzdGFydHNXaXRoIiwicGF0aFRvUmVzb2x2ZSIsInBhdGhUb0FwcGVuZCIsInBhcnRzIiwic3BsaXQiLCJsZW5ndGgiLCJFcnJvciIsInNsaWNlIiwiam9pbiIsImxvb2t1cERpcmVjdG9yeSIsImRpcm5hbWUiLCJtb2R1bGVEaXJlY3RvcnkiLCJyZXNvbHZlZFBhdGgiLCJyZXNvbHZlZFBhY2thZ2UiLCJzeW5jIiwiYmFzZWRpciIsInBhY2thZ2VEaXIiLCJzdWJzdHJpbmciLCJwYWNrYWdlRmlsdGVyIiwicGFja2FnZSIsIm1haW4iLCJyZWxhdGl2ZVBhdGhGcm9tSW1wb3J0ZXIiLCJyZWxhdGl2ZSJdLCJtYXBwaW5ncyI6ImFBQUEsTUFBTUEsS0FBSyxHQUFHQyxPQUFPLENBQUMsTUFBRCxDQUFyQjtBQUNBLE1BQU1DLGFBQWEsR0FBR0QsT0FBTyxDQUFDLFNBQUQsQ0FBN0I7QUFDQSxNQUFNRSxLQUFLLEdBQUdGLE9BQU8sQ0FBQyxhQUFELENBQXJCO0FBQ0EsTUFBTUcsdUJBQXVCLEdBQUcsd0ZBQWhDOztBQUVBOztBQUVFLFdBQVNDLDJCQUFULEdBQXVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJ0QztBQUNGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkRDLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlQywwQkFBZixHQUE0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QUksS0FBSXpDLEtBQUssQ0FBQzBDLFFBQU4sQ0FBZTFDLEtBQUssQ0FBQzhCLE9BQU4sQ0FBY2hCLFFBQWQsQ0FBZixFQUErRGtCLFlBQS9ELENBQTZFLEVBQWpIOzs7Ozs7O0FBT0FuQixRQUFBQSxNQUFNLENBQUNNLEtBQVAsR0FBZXNCLHdCQUFmO0FBQ0QsT0F4RE0sRUFESixFQUFQOzs7QUE0REQsQ0E3REQiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBfcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgcmVzb2x2ZU1vZHVsZSA9IHJlcXVpcmUoJ3Jlc29sdmUnKSAvLyByZXNvbHZlIG9wdG9pbnMgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvcmVzb2x2ZSNyZXNvbHZlaWQtb3B0cy1jYlxuY29uc3QgYmFiZWwgPSByZXF1aXJlKCdAYmFiZWwvY29yZScpXG5jb25zdCBDT05DQVRfTk9fUEFDS0FHRV9FUlJPUiA9ICdEeW5hbWljIGltcG9ydCB3aXRoIGEgY29uY2F0ZW5hdGVkIHN0cmluZyBzaG91bGQgc3RhcnQgd2l0aCBhIHZhbGlkIGZ1bGwgcGFja2FnZSBuYW1lLidcblxue1xuICAvLyBjb25zdCByZXNvbHZlQmFzZU1vZHVsZSA9IHJlcXVpcmUoJ0Byb2xsdXAvcGx1Z2luLW5vZGUtcmVzb2x2ZScpXG4gIGZ1bmN0aW9uIHJlc29sdmVVc2luZ0V4dGVybmFsUGFja2FnZSgpIHtcbiAgICAvLyAgIGxldCByZXNvbHZlZCA9IHJlc29sdmVCYXNlTW9kdWxlKHtcbiAgICAvLyAgICAgLy8gbm90IGFsbCBmaWxlcyB5b3Ugd2FudCB0byByZXNvbHZlIGFyZSAuanMgZmlsZXNcbiAgICAvLyAgICAgZXh0ZW5zaW9uczogWycubWpzJywgJy5qcycsICcuanN4JywgJy5qc29uJ10sIC8vIERlZmF1bHQ6IFsgJy5tanMnLCAnLmpzJywgJy5qc29uJywgJy5ub2RlJyBdXG4gICAgLy8gICAgIC8vIHRoZSBmaWVsZHMgdG8gc2NhbiBpbiBhIHBhY2thZ2UuanNvbiB0byBkZXRlcm1pbmUgdGhlIGVudHJ5IHBvaW50XG4gICAgLy8gICAgIC8vIGlmIHRoaXMgbGlzdCBjb250YWlucyBcImJyb3dzZXJcIiwgb3ZlcnJpZGVzIHNwZWNpZmllZCBpbiBcInBrZy5icm93c2VyXCJcbiAgICAvLyAgICAgLy8gd2lsbCBiZSB1c2VkXG4gICAgLy8gICAgIG1haW5GaWVsZHM6IFsnbW9kdWxlJywgJ21haW4nXSwgLy8gRGVmYXVsdDogWydtb2R1bGUnLCAnbWFpbiddXG4gICAgLy8gICAgIC8vIHNvbWUgcGFja2FnZS5qc29uIGZpbGVzIGhhdmUgYSBcImJyb3dzZXJcIiBmaWVsZCB3aGljaCBzcGVjaWZpZXMgYWx0ZXJuYXRpdmUgZmlsZXMgdG8gbG9hZCBmb3IgcGVvcGxlIGJ1bmRsaW5nIGZvciB0aGUgYnJvd3Nlci4gSWYgdGhhdCdzIHlvdSwgZWl0aGVyIHVzZSB0aGlzIG9wdGlvbiBvciBhZGQgXCJicm93c2VyXCIgdG8gdGhlIFwibWFpbmZpZWxkc1wiIG9wdGlvbiwgb3RoZXJ3aXNlIHBrZy5icm93c2VyIHdpbGwgYmUgaWdub3JlZFxuICAgIC8vICAgICBicm93c2VyOiBmYWxzZSwgLy8gRGVmYXVsdDogZmFsc2VcbiAgICAvLyAgICAgLy8gd2hldGhlciB0byBwcmVmZXIgYnVpbHQtaW4gbW9kdWxlcyAoZS5nLiBgZnNgLCBgcGF0aGApIG9yIGxvY2FsIG9uZXMgd2l0aCB0aGUgc2FtZSBuYW1lc1xuICAgIC8vICAgICBwcmVmZXJCdWlsdGluczogZmFsc2UsIC8vIERlZmF1bHQ6IHRydWVcbiAgICAvLyAgICAgLy8gTG9jayB0aGUgbW9kdWxlIHNlYXJjaCBpbiB0aGlzIHBhdGggKGxpa2UgYSBjaHJvb3QpLiBNb2R1bGUgZGVmaW5lZCBvdXRzaWRlIHRoaXMgcGF0aCB3aWxsIGJlIG1hcmtlZCBhcyBleHRlcm5hbFxuICAgIC8vICAgICBqYWlsOiAnLycsIC8vIERlZmF1bHQ6ICcvJ1xuICAgIC8vICAgICAvLyBTZXQgdG8gYW4gYXJyYXkgb2Ygc3RyaW5ncyBhbmQvb3IgcmVnZXhwcyB0byBsb2NrIHRoZSBtb2R1bGUgc2VhcmNoIHRvIG1vZHVsZXMgdGhhdCBtYXRjaCBhdCBsZWFzdCBvbmUgZW50cnkuIE1vZHVsZXMgbm90IG1hdGNoaW5nIGFueSBlbnRyeSB3aWxsIGJlIG1hcmtlZCBhcyBleHRlcm5hbFxuICAgIC8vICAgICAvLyBvbmx5OiBbJ3NvbWVfbW9kdWxlJywgL15Ac29tZV9zY29wZVxcLy4qJC9dLCAvLyBEZWZhdWx0OiBudWxsXG4gICAgLy8gICAgIC8vIElmIHRydWUsIGluc3BlY3QgcmVzb2x2ZWQgZmlsZXMgdG8gY2hlY2sgdGhhdCB0aGV5IGFyZSBFUzIwMTUgbW9kdWxlc1xuICAgIC8vICAgICBtb2R1bGVzT25seTogZmFsc2UsIC8vIERlZmF1bHQ6IGZhbHNlXG4gICAgLy8gICAgIC8vIEZvcmNlIHJlc29sdmluZyBmb3IgdGhlc2UgbW9kdWxlcyB0byByb290J3Mgbm9kZV9tb2R1bGVzIHRoYXQgaGVscHNcbiAgICAvLyAgICAgLy8gdG8gcHJldmVudCBidW5kbGluZyB0aGUgc2FtZSBwYWNrYWdlIG11bHRpcGxlIHRpbWVzIGlmIHBhY2thZ2UgaXNcbiAgICAvLyAgICAgLy8gaW1wb3J0ZWQgZnJvbSBkZXBlbmRlbmNpZXMuXG4gICAgLy8gICAgIC8vIGRlZHVwZTogWydyZWFjdCcsICdyZWFjdC1kb20nXSwgLy8gRGVmYXVsdDogW11cbiAgICAvLyAgICAgLy8gQW55IGFkZGl0aW9uYWwgb3B0aW9ucyB0aGF0IHNob3VsZCBiZSBwYXNzZWQgdGhyb3VnaFxuICAgIC8vICAgICAvLyB0byBub2RlLXJlc29sdmVcbiAgICAvLyAgICAgLy8gY3VzdG9tUmVzb2x2ZU9wdGlvbnM6IHtcbiAgICAvLyAgICAgLy8gICBtb2R1bGVEaXJlY3Rvcnk6ICdqc19tb2R1bGVzJyxcbiAgICAvLyAgICAgLy8gfSxcbiAgICAvLyAgIH0pXG4gIH1cbn1cblxuLyoqXG4gKiBCYWJlbCB0cmFuc2Zvcm0gcGx1Z2luIGNvbnZlcnRzIG5hbWUgbW9kdWxlcyBiZWdpbm5pbmcgd2l0aCBAIHRvIHRoZWlyIHJlbGF0aXZlIHBhdGggY291bnRlcnBhcnRzIG9yIGEgbmFtZWQgbW9kdWxlIChub24tcmVsYXRpdmUgcGF0aCkuXG4gKiB0cmFuc2Zvcm0gZXhhbXBsZSBcIkBwb2x5bWVyL3BvbHltZXIvZWxlbWVudC5qc1wiIC0tPiBcIi9Ad2ViY29tcG9uZW50L0BwYWNrYWdlL0Bwb2x5bWVyL3BvbHltZXIvZWxlbWVudC5qc1wiXG4gKiB0cmFuc2Zvcm0gZXhhbXBsZSBcImxpdC1odG1sL2xpYi9saXQtZXh0ZW5kZWQuanNcIiAtLT4gXCIvQHdlYmNvbXBvbmVudC9AcGFja2FnZS9saXQtaHRtbC9saWIvbGl0LWV4dGVuZGVkLmpzXCJcbiAqIGh0dHBzOi8vYXN0ZXhwbG9yZXIubmV0L1xuICBcbiAgaW1wbGVtZW50YXRpb24gaW4gb3Blbi13YyBcbiAgICAtIGh0dHBzOi8vZ2l0aHViLmNvbS9vcGVuLXdjL29wZW4td2MvYmxvYi9tYXN0ZXIvcGFja2FnZXMvZXMtZGV2LXNlcnZlci9zcmMvdXRpbHMvcmVzb2x2ZS1tb2R1bGUtaW1wb3J0cy5qcyNMNzlcbiAgICAtIGh0dHBzOi8vZ2l0aHViLmNvbS9vcGVuLXdjL29wZW4td2MvYmxvYi9tYXN0ZXIvcGFja2FnZXMvZXMtZGV2LXNlcnZlci9zcmMvdXRpbHMvcmVzb2x2ZS1tb2R1bGUtaW1wb3J0cy5qc1xuICAgIC0gaHR0cHM6Ly9naXRodWIuY29tL3JvbGx1cC9wbHVnaW5zL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL25vZGUtcmVzb2x2ZS9zcmMvaW5kZXguanMjTDI5XG4gICAgLSBodHRwczovL29wZW4td2Mub3JnL2RldmVsb3BpbmcvZXMtZGV2LXNlcnZlci5odG1sI3N0YXJ0c2VydmVyXG4gICAgLSBodHRwczovL2dpdGh1Yi5jb20vcm9sbHVwL3BsdWdpbnMvdHJlZS9tYXN0ZXIvcGFja2FnZXMvbm9kZS1yZXNvbHZlXG4gICAgLSBodHRwczovL2dpdGh1Yi5jb20vZ3V5YmVkZm9yZC9lcy1tb2R1bGUtbGV4ZXJcbiAgICAtIGh0dHBzOi8vZ2l0aHViLmNvbS9vcGVuLXdjL29wZW4td2MvYmxvYi9tYXN0ZXIvcGFja2FnZXMvZXMtZGV2LXNlcnZlci9zcmMvdXRpbHMvYmFiZWwtdHJhbnNmb3JtLmpzXG4gICAgLSBodHRwczovL2dpdGh1Yi5jb20vdGxldW5lbi9iYWJlbC1wbHVnaW4tbW9kdWxlLXJlc29sdmVyL2Jsb2IvbWFzdGVyL3NyYy9pbmRleC5qc1xuXG5cbi8vICBUT0RPOiBpbXBsZW1lbnQgRGVkb3AgaW1wb3J0cy5cbiAqL1xubW9kdWxlLmV4cG9ydHMudHJhbnNmb3JtTmFtZWRNb2R1bGVUb1BhdGggPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICB2aXNpdG9yOiB7XG4gICAgICAnSW1wb3J0RGVjbGFyYXRpb258RXhwb3J0TmFtZWREZWNsYXJhdGlvbicocGF0aCwgc3RhdGUpIHtcbiAgICAgICAgaWYgKCFwYXRoLm5vZGUuc291cmNlKSByZXR1cm5cbiAgICAgICAgbGV0IGltcG9ydGVyID0gc3RhdGUuZmlsZS5vcHRzLmZpbGVuYW1lLCAvLyBhYnNvbHV0ZSBwYXRoIG9mIGN1cnJlbnQgZmlsZSBiZWluZyB0cmFuc2Zvcm1lZFxuICAgICAgICAgIHNvdXJjZSA9IHBhdGgubm9kZS5zb3VyY2UsXG4gICAgICAgICAgaW1wb3J0ZWUgPSBzb3VyY2UudmFsdWVcblxuICAgICAgICAvLyBpZiBiYXJlIGltcG9ydCwgaS5lLiBub3QgYWJzb2x1dGUgb3IgcmVsYXRpdmUgcGF0aFxuICAgICAgICBpZiAoc291cmNlLnZhbHVlLnN0YXJ0c1dpdGgoJy8nKSB8fCBzb3VyY2UudmFsdWUuc3RhcnRzV2l0aCgnLicpKSByZXR1cm5cblxuICAgICAgICBsZXQgcGF0aFRvUmVzb2x2ZSA9IGltcG9ydGVlXG4gICAgICAgIGxldCBwYXRoVG9BcHBlbmQgPSAnJ1xuXG4gICAgICAgIGNvbnN0IHBhcnRzID0gaW1wb3J0ZWUuc3BsaXQoJy8nKVxuICAgICAgICBpZiAoaW1wb3J0ZWUuc3RhcnRzV2l0aCgnQCcpKSB7XG4gICAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA8IDIpIHRocm93IG5ldyBFcnJvcihDT05DQVRfTk9fUEFDS0FHRV9FUlJPUilcblxuICAgICAgICAgIHBhdGhUb1Jlc29sdmUgPSBgJHtwYXJ0c1swXX0vJHtwYXJ0c1sxXX1gXG4gICAgICAgICAgcGF0aFRvQXBwZW5kID0gcGFydHMuc2xpY2UoMiwgcGFydHMubGVuZ3RoKS5qb2luKCcvJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocGFydHMubGVuZ3RoIDwgMSkgdGhyb3cgbmV3IEVycm9yKENPTkNBVF9OT19QQUNLQUdFX0VSUk9SKVxuICAgICAgICAgIDtbcGF0aFRvUmVzb2x2ZV0gPSBwYXJ0c1xuICAgICAgICAgIHBhdGhUb0FwcGVuZCA9IHBhcnRzLnNsaWNlKDEsIHBhcnRzLmxlbmd0aCkuam9pbignLycpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsb29rdXBEaXJlY3RvcnkgPSBfcGF0aC5kaXJuYW1lKGltcG9ydGVyKSxcbiAgICAgICAgICBtb2R1bGVEaXJlY3RvcnkgPSBbJ25vZGVfbW9kdWxlcycsICdAcGFja2FnZSddXG5cbiAgICAgICAgLy8gaWYgbm8gc3BlY2lmaWMgZmlsZSBpbiB0aGUgdGFyZ2V0IG1vZHVsZSBpcyBzcGVjaWZpZWQgKGUuZy4gYGxpdC1odG1sL3NwZWNpZmljLmpzYClcbiAgICAgICAgbGV0IHJlc29sdmVkUGF0aFxuICAgICAgICBpZiAocGF0aFRvQXBwZW5kKSB7XG4gICAgICAgICAgcGF0aFRvUmVzb2x2ZSA9IGAke3BhdGhUb1Jlc29sdmV9L3BhY2thZ2UuanNvbmBcbiAgICAgICAgICBsZXQgcmVzb2x2ZWRQYWNrYWdlID0gcmVzb2x2ZU1vZHVsZS5zeW5jKHBhdGhUb1Jlc29sdmUsIHsgYmFzZWRpcjogbG9va3VwRGlyZWN0b3J5LCBtb2R1bGVEaXJlY3RvcnkgfSlcbiAgICAgICAgICBjb25zdCBwYWNrYWdlRGlyID0gcmVzb2x2ZWRQYWNrYWdlLnN1YnN0cmluZygwLCByZXNvbHZlZFBhY2thZ2UubGVuZ3RoIC0gJ3BhY2thZ2UuanNvbicubGVuZ3RoKVxuICAgICAgICAgIHJlc29sdmVkUGF0aCA9IGAke3BhY2thZ2VEaXJ9JHtwYXRoVG9BcHBlbmR9YFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmVkUGF0aCA9IHJlc29sdmVNb2R1bGUuc3luYyhwYXRoVG9SZXNvbHZlLCB7XG4gICAgICAgICAgICBiYXNlZGlyOiBsb29rdXBEaXJlY3RvcnksXG4gICAgICAgICAgICBtb2R1bGVEaXJlY3RvcnksXG4gICAgICAgICAgICAvLyB1c2UgXCJtb2R1bGVcIiBmaWVsZCBpbnN0ZWFkIG9mIFwibWFpblwiIGZpZWxkIHdoZW4gcHJlc2VudFxuICAgICAgICAgICAgcGFja2FnZUZpbHRlcjogcGFja2FnZSA9PiB7XG4gICAgICAgICAgICAgIGlmIChwYWNrYWdlLm1vZHVsZSkgcGFja2FnZS5tYWluID0gcGFja2FnZS5tb2R1bGVcbiAgICAgICAgICAgICAgcmV0dXJuIHBhY2thZ2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNyZWF0ZSByZWxhdGl2ZSBwYXRoIGZvciBicm93c2VyIGNvbnN1bXB0aW9uXG4gICAgICAgIGxldCByZWxhdGl2ZVBhdGhGcm9tSW1wb3J0ZXIgPSBgLi8ke19wYXRoLnJlbGF0aXZlKF9wYXRoLmRpcm5hbWUoaW1wb3J0ZXIpIC8qcmVsYXRpdmUgdG8gZm9sZGVyKi8sIHJlc29sdmVkUGF0aCl9YFxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBpbXBvcnRlZTogJHtpbXBvcnRlZX1gKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgaW1wb3J0ZXI6ICR7aW1wb3J0ZXJ9YClcbiAgICAgICAgLy8gY29uc29sZS5sb2coYHJlc29sdmVkUGF0aDogJHtyZXNvbHZlZFBhdGh9YClcbiAgICAgICAgLy8gY29uc29sZS5sb2coYHJlbGF0aXZlUGF0aEZyb21JbXBvcnRlcjogJHtyZWxhdGl2ZVBhdGhGcm9tSW1wb3J0ZXJ9YClcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1xcbicpXG4gICAgICAgIHNvdXJjZS52YWx1ZSA9IHJlbGF0aXZlUGF0aEZyb21JbXBvcnRlclxuICAgICAgfSxcbiAgICB9LFxuICB9XG59XG4iXX0=
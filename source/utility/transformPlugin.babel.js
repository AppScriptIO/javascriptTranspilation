"use strict";var _interopRequireWildcard=require("@babel/runtime/helpers/interopRequireWildcard");Object.defineProperty(exports,"__esModule",{value:true});exports.transformNamedModuleToPath=transformNamedModuleToPath;exports.minifyHtmlTemplateLiterals=minifyHtmlTemplateLiterals;var babel=_interopRequireWildcard(require("@babel/core"));







function transformNamedModuleToPath(){
return{
visitor:{
"ImportDeclaration|ExportNamedDeclaration"(path){
let source=path.node.source;
if(!source)return;

let newSourceValue;
if(source.value.startsWith("@")||!source.value.startsWith("/")&&!source.value.startsWith(".")){

newSourceValue=`/@webcomponent/@package/${source.value}`;
source.value=newSourceValue;
}
}}};


}




function minifyHtmlTemplateLiterals(){

return{
visitor:{
TaggedTemplateExpression(path){
let tagName=path.node.tag.name;
if(!(tagName=="html"))return;
path.node.quasi.expressions;
let templateLiteral=path.node.quasi;
let expression=templateLiteral.expressions;
if(expression){
for(let index in expression){
let code=babel.transformFromAst({
type:"File",
program:{
type:"Program",
sourceType:"module",
body:[expression[index]]}});


console.log(code);
}
}
}}};


}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS91dGlsaXR5L3RyYW5zZm9ybVBsdWdpbi5iYWJlbC5qcyJdLCJuYW1lcyI6WyJ0cmFuc2Zvcm1OYW1lZE1vZHVsZVRvUGF0aCIsInZpc2l0b3IiLCJwYXRoIiwic291cmNlIiwibm9kZSIsIm5ld1NvdXJjZVZhbHVlIiwidmFsdWUiLCJzdGFydHNXaXRoIiwibWluaWZ5SHRtbFRlbXBsYXRlTGl0ZXJhbHMiLCJUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24iLCJ0YWdOYW1lIiwidGFnIiwibmFtZSIsInF1YXNpIiwiZXhwcmVzc2lvbnMiLCJ0ZW1wbGF0ZUxpdGVyYWwiLCJleHByZXNzaW9uIiwiaW5kZXgiLCJjb2RlIiwiYmFiZWwiLCJ0cmFuc2Zvcm1Gcm9tQXN0IiwidHlwZSIsInByb2dyYW0iLCJzb3VyY2VUeXBlIiwiYm9keSIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiJ1UkFBQTs7Ozs7Ozs7QUFRTyxRQUFTQSxDQUFBQSwwQkFBVCxFQUFzQztBQUMzQyxNQUFPO0FBQ0xDLE9BQU8sQ0FBRTtBQUNQLDJDQUEyQ0MsSUFBM0MsQ0FBaUQ7QUFDL0MsR0FBSUMsQ0FBQUEsTUFBTSxDQUFHRCxJQUFJLENBQUNFLElBQUwsQ0FBVUQsTUFBdkI7QUFDQSxHQUFJLENBQUNBLE1BQUwsQ0FBYTs7QUFFYixHQUFJRSxDQUFBQSxjQUFKO0FBQ0EsR0FBSUYsTUFBTSxDQUFDRyxLQUFQLENBQWFDLFVBQWIsQ0FBd0IsR0FBeEIsR0FBaUMsQ0FBQ0osTUFBTSxDQUFDRyxLQUFQLENBQWFDLFVBQWIsQ0FBd0IsR0FBeEIsQ0FBRCxFQUFpQyxDQUFDSixNQUFNLENBQUNHLEtBQVAsQ0FBYUMsVUFBYixDQUF3QixHQUF4QixDQUF2RSxDQUFzRzs7QUFFcEdGLGNBQWMsQ0FBSSwyQkFBMEJGLE1BQU0sQ0FBQ0csS0FBTSxFQUF6RDtBQUNBSCxNQUFNLENBQUNHLEtBQVAsQ0FBZUQsY0FBZjtBQUNEO0FBQ0YsQ0FYTSxDQURKLENBQVA7OztBQWVEOzs7OztBQUtNLFFBQVNHLENBQUFBLDBCQUFULEVBQXNDOztBQUUzQyxNQUFPO0FBQ0xQLE9BQU8sQ0FBRTtBQUNQUSx3QkFBd0IsQ0FBQ1AsSUFBRCxDQUFPO0FBQzdCLEdBQUlRLENBQUFBLE9BQU8sQ0FBR1IsSUFBSSxDQUFDRSxJQUFMLENBQVVPLEdBQVYsQ0FBY0MsSUFBNUI7QUFDQSxHQUFJLEVBQUVGLE9BQU8sRUFBSSxNQUFiLENBQUosQ0FBMEI7QUFDMUJSLElBQUksQ0FBQ0UsSUFBTCxDQUFVUyxLQUFWLENBQWdCQyxXQUFoQjtBQUNBLEdBQUlDLENBQUFBLGVBQWUsQ0FBR2IsSUFBSSxDQUFDRSxJQUFMLENBQVVTLEtBQWhDO0FBQ0EsR0FBSUcsQ0FBQUEsVUFBVSxDQUFHRCxlQUFlLENBQUNELFdBQWpDO0FBQ0EsR0FBSUUsVUFBSixDQUFnQjtBQUNkLElBQUssR0FBSUMsQ0FBQUEsS0FBVCxHQUFrQkQsQ0FBQUEsVUFBbEIsQ0FBOEI7QUFDNUIsR0FBSUUsQ0FBQUEsSUFBSSxDQUFHQyxLQUFLLENBQUNDLGdCQUFOLENBQXVCO0FBQ2hDQyxJQUFJLENBQUUsTUFEMEI7QUFFaENDLE9BQU8sQ0FBRTtBQUNQRCxJQUFJLENBQUUsU0FEQztBQUVQRSxVQUFVLENBQUUsUUFGTDtBQUdQQyxJQUFJLENBQUUsQ0FBQ1IsVUFBVSxDQUFDQyxLQUFELENBQVgsQ0FIQyxDQUZ1QixDQUF2QixDQUFYOzs7QUFRQVEsT0FBTyxDQUFDQyxHQUFSLENBQVlSLElBQVo7QUFDRDtBQUNGO0FBQ0YsQ0FwQk0sQ0FESixDQUFQOzs7QUF3QkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBiYWJlbCBmcm9tICdAYmFiZWwvY29yZSdcblxuLyoqXG4gKiBCYWJlbCB0cmFuc2Zvcm0gcGx1Z2luIGNvbnZlcnRzIG5hbWUgbW9kdWxlcyBiZWdpbm5pbmcgd2l0aCBAIHRvIHRoZWlyIHJlbGF0aXZlIHBhdGggY291bnRlcnBhcnRzIG9yIGEgbmFtZWQgbW9kdWxlIChub24tcmVsYXRpdmUgcGF0aCkuXG4gKiB0cmFuc2Zvcm0gZXhhbXBsZSBcIkBwb2x5bWVyL3BvbHltZXIvZWxlbWVudC5qc1wiIC0tPiBcIi9Ad2ViY29tcG9uZW50L0BwYWNrYWdlL0Bwb2x5bWVyL3BvbHltZXIvZWxlbWVudC5qc1wiXG4gKiB0cmFuc2Zvcm0gZXhhbXBsZSBcImxpdC1odG1sL2xpYi9saXQtZXh0ZW5kZWQuanNcIiAtLT4gXCIvQHdlYmNvbXBvbmVudC9AcGFja2FnZS9saXQtaHRtbC9saWIvbGl0LWV4dGVuZGVkLmpzXCJcbiAqIGh0dHBzOi8vYXN0ZXhwbG9yZXIubmV0L1xuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtTmFtZWRNb2R1bGVUb1BhdGgoKSB7XG4gIHJldHVybiB7XG4gICAgdmlzaXRvcjoge1xuICAgICAgJ0ltcG9ydERlY2xhcmF0aW9ufEV4cG9ydE5hbWVkRGVjbGFyYXRpb24nKHBhdGgpIHtcbiAgICAgICAgbGV0IHNvdXJjZSA9IHBhdGgubm9kZS5zb3VyY2VcbiAgICAgICAgaWYgKCFzb3VyY2UpIHJldHVyblxuXG4gICAgICAgIGxldCBuZXdTb3VyY2VWYWx1ZVxuICAgICAgICBpZiAoc291cmNlLnZhbHVlLnN0YXJ0c1dpdGgoJ0AnKSB8fCAoIXNvdXJjZS52YWx1ZS5zdGFydHNXaXRoKCcvJykgJiYgIXNvdXJjZS52YWx1ZS5zdGFydHNXaXRoKCcuJykpKSB7XG4gICAgICAgICAgLy8gaWYgbm90IHJlbGF0aXZlL2Fic29sdXRlIG9yIHN0YXJ0cyB3aXRoIEAgLSBiYXNpY2FsbHkgY291bGQgYmUgc3VmZmljaWVudCB0byBjaGVjayBmb3Igbm9uIHJlbGF0aXZlJmFic29sdXRlIHBhdGgsIGJ1dCBmb3IgY2xhcml0eSB3aXRoaCBrZWVwIGJvdGggY29uZGl0aW9ucy5cbiAgICAgICAgICBuZXdTb3VyY2VWYWx1ZSA9IGAvQHdlYmNvbXBvbmVudC9AcGFja2FnZS8ke3NvdXJjZS52YWx1ZX1gXG4gICAgICAgICAgc291cmNlLnZhbHVlID0gbmV3U291cmNlVmFsdWVcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9LFxuICB9XG59XG5cbi8qKlxuICogQmFiZWwgdHJhbnNmb3JtIHBsdWdpbiB0aGF0IG1pbmlmaWVzIHRlbXBsYXRlIGxpdGVyYWxzIHRhZ2dlZCB3aXRoIFwiaHRtbFwiXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaW5pZnlIdG1sVGVtcGxhdGVMaXRlcmFscygpIHtcbiAgLy8gZG9lc24ndCB3b3JrLCA+PiBFUlJPUiB7IEVycm9yOiBBU1Qgcm9vdCBtdXN0IGJlIGEgUHJvZ3JhbSBvciBGaWxlIG5vZGUgLy8gaS5lLiBwYXJ0aWFsIGFzdCBpc24ndCB3cmFwcGVkIGluIGFuIGFzdCBwcm9ncmFtLlxuICByZXR1cm4ge1xuICAgIHZpc2l0b3I6IHtcbiAgICAgIFRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbihwYXRoKSB7XG4gICAgICAgIGxldCB0YWdOYW1lID0gcGF0aC5ub2RlLnRhZy5uYW1lXG4gICAgICAgIGlmICghKHRhZ05hbWUgPT0gJ2h0bWwnKSkgcmV0dXJuXG4gICAgICAgIHBhdGgubm9kZS5xdWFzaS5leHByZXNzaW9uc1xuICAgICAgICBsZXQgdGVtcGxhdGVMaXRlcmFsID0gcGF0aC5ub2RlLnF1YXNpXG4gICAgICAgIGxldCBleHByZXNzaW9uID0gdGVtcGxhdGVMaXRlcmFsLmV4cHJlc3Npb25zXG4gICAgICAgIGlmIChleHByZXNzaW9uKSB7XG4gICAgICAgICAgZm9yIChsZXQgaW5kZXggaW4gZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgbGV0IGNvZGUgPSBiYWJlbC50cmFuc2Zvcm1Gcm9tQXN0KHtcbiAgICAgICAgICAgICAgdHlwZTogJ0ZpbGUnLFxuICAgICAgICAgICAgICBwcm9ncmFtOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1Byb2dyYW0nLFxuICAgICAgICAgICAgICAgIHNvdXJjZVR5cGU6ICdtb2R1bGUnLFxuICAgICAgICAgICAgICAgIGJvZHk6IFtleHByZXNzaW9uW2luZGV4XV0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgY29uc29sZS5sb2coY29kZSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSxcbiAgfVxufVxuIl19
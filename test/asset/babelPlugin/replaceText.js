module.exports = function replaceText(oldText, newText) {
    return function() {
        return {
            visitor: {
              "StringLiteral"(path) {
                let s = path.node
                if(!s) return
                
                if(s.value == oldText) { // if not relative/absolute or starts with @ - basically could be sufficient to check for non relative&absolute path, but for clarity withh keep both conditions.
                  s.value = newText
                }
              }
            }
        }
    }
}

exports.escapeRegexSearch = (text) =>{
    return new RegExp(text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),'gi')
};
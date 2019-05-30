/**
 * 去除 console 和 注解
 * 
 */
class plugin {
  constructor(options) {
    this.options = options
    this.externalModules = {}
  }
  apply(compiler) {
    // var reg = /(/*(|.)*?*/)/g;
    var reg = /(([^\"]*(\.)?)*\")/g
    //|(([^\']*(\.)?)*\')|(\/{2,}.*?(|))|(\/*(|.)*?*\/)|(\/******\/)
    compiler.hooks.emit.tap('CodeBeautify', (compilation, callback) => {
      Object.keys(compilation.assets).forEach((data) => {
        // 欲处理的文本
        let content = compilation.assets[data].source() 
        // 去除注释后的文本
        content = content.replace(reg, function (word) { 
          return /^\/{2,}/.test(word) || /^\/*!/.test(word) || /^\/*{3,}\//.test(word) ? "" : word;
        });
        compilation.assets[data] = {
          source(){
            return content
          },
          size(){
            return content.length
          }
        }
      })
      callback();
    })
  }
}
module.exports = plugin

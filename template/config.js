// Para podes permitir espacios al armar variables de entorno en package.json al usar &&

var gitJs = process.env.git_js.trim(); 

module.exports = {
    gitJsPath   :   gitJs
}

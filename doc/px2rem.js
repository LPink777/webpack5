/**
 * AST
 * JS语法树
 * css语法树
*/
const css = require('css');

const pxRegExp = /\b(\d+(\.\d+)?)px\b/;

class Px2rem {
    constructor(config) {
        this.config = config;
    }

    generateRem(cssText) {

        const processRules = (rules) => {
            for (let i = 0; i < rules.length; i++) {
                const rule = rules[i];
                const declarations = rule.declarations;

                for (let j = 0; j < declarations.length; j++) {
                    const declaration = declarations[j];

                    if (declaration.type === 'declaration' && pxRegExp.test(declaration.value)) {
                        declaration.value = this._getCalcValue('rem', declaration.value);
                    }
                }
            }
        }

        /** 转css语法 */
        var astObj = css.parse(cssText);

        /** 修改px => rem */
        processRules(astObj.stylesheet.rules);

        /** 重新生成语法 */
        return css.stringify(astObj);

    }

    _getCalcValue(type, value) {
        const { remUnit, remPrecision } = this.config;
        return value.replace(pxRegExp, (_, $1) => {
            const val = (parseFloat($1)/remUnit).toFixed(remPrecision);
            return val + type;
        })
    }
}

module.exports = Px2rem;
/*
 Calculator - Simple Expression Parser
 Alan Zawari
*/

/**
 * Constructor function
 * @param exp
 * @constructor
 */
var Calc = function (exp) {
    this.exp = this.sanitize(exp);
};

/**
 * Parses the expression and calculates the result
 * This can be overridden by decedent functions to be extended
 * @returns result number
 */
Calc.prototype.parse = function () {
  try{
    var self = this,
        exp = this.exp,
        numStack = [],
        oprStack = [],
        num1, num2, opr, res;

    exp = exp.split(""); //to array
    exp.reverse().forEach(function (item) {
        if (!isNaN(item)) {  //is number
            numStack.push(item);
        } else {  //is operator
            opr = oprStack.pop();
            if (opr === "*" || opr === "x" || opr === "/") {
                //pop two numbers
                num1 = numStack.pop();
                num2 = numStack.pop();
                res = self.doCalc(num2, opr, num1); //we may have a separate function instead of using eval
                numStack.push(res);
                oprStack.push(item);
            }
            else {
                oprStack.push(item);
            }
        }
    });

    while (oprStack.length > 0) {
        opr = oprStack.pop();
        num1 = numStack.pop();
        num2 = numStack.pop();
        res = self.doCalc(num2, opr, num1);
        numStack.push(res);
    }

    return numStack[0] ? numStack[0] : null;
  } catch (err) {
    console.log("err : " + err);
    return null;
  }
};

/**
 * Core function to do calculation for two operands.
 * This can be overridden by decedent functions to be extended
 * @param num2 second operand
 * @param opr operator
 * @param num1 first operand
 * @returns number
 */
Calc.prototype.doCalc = function (num2, opr, num1) {
    //we may want to do the actual calculation instead of using eval.
    //e.g. we can have a switch case for each operator
    return eval(num2 + opr + num1);
};

/**
 * Sanitizes the input expression
 * This can be overridden by decedent functions to be extended
 * @param exp input expression
 * @returns string
 */
Calc.prototype.sanitize = function (exp) {
    return exp.replace(/[^0-9\-\+\/\x\*%]/g, '');
};

module.exports = Calc;

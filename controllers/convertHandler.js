function ConvertHandler() {

  this.getNum = function (input) {
    const matchUnit = /[A-Za-z]+$/;
    const result = input.replace(matchUnit, '')

    const matchNum = /^\d+\/?\d*$/;
    if (matchNum.test(result)) {
      return eval(result);
    } else if (result === '') {
      return 1
    } else {
      return false
    }
  };

  this.getUnit = function (input) {
    // regex que detecta que al final del string haya letras
    const matchUnit = /[A-Za-z]+$/;
    let result = input.match(matchUnit);
    if (result === null) {
      return false
    }
    result = result[0].toLowerCase();
    // si es una de las unidades validas entonces retornamos la unidad
    if (result === 'lbs' || result === 'kg' || result === 'gal' || result === 'l' || result === 'km' || result === 'mi') {
      return result;
    } else {
      // si no es una de las unidades validas retornamos invalid unit
      return false
    }
  };

  this.getReturnUnit = function (initUnit) {
    if (initUnit === 'lbs') {
      return 'kg'
    } else if (initUnit === 'kg') {
      return 'lbs'
    } else if (initUnit === 'gal') {
      return 'l'
    } else if (initUnit === 'l') {
      return 'gal'
    } else if (initUnit === 'km') {
      return 'mi'
    } else if (initUnit === 'mi') {
      return 'km'
    } else {
      return false
    }
  };

  this.spellOutUnit = function (unit) {
    if (unit === 'lbs') {
      return 'pounds'
    } else if (unit === 'kg') {
      return 'kilograms'
    } else if (unit === 'gal') {
      return 'gallons'
    } else if (unit === 'l') {
      return 'liters'
    } else if (unit === 'km') {
      return 'kilometers'
    } else if (unit === 'mi') {
      return 'miles'
    } else {
      return
    }
  };

  this.convert = function (initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    if (initUnit === 'lbs') {
      return initNum * lbsToKg
    } else if (initUnit === 'kg') {
      return initNum / lbsToKg
    } else if (initUnit === 'gal') {
      return initNum * galToL
    } else if (initUnit === 'l') {
      return initNum / galToL
    } else if (initUnit === 'km') {
      return initNum / miToKm
    } else if (initUnit === 'mi') {
      return initNum * miToKm
    } else {
      return
    }
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    let result;
    result = `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`
    return result;
  };

}

module.exports = ConvertHandler;

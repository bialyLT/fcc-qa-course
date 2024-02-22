'use strict';

const expect          = require('chai').expect;
const ConvertHandler  = require('../controllers/convertHandler.js');

module.exports = (app) => {

  let convertHandler = new ConvertHandler();

  // ruta para manejar los inputs ingresados por url 
  app.route('/api/convert').get((req, res) => {
    const input     = req.query.input;
    const initNum   = convertHandler.getNum(input);
    const initUnit  = convertHandler.getUnit(input);
       // Comprobación para manejar errores
    if (!initNum && initUnit === false) {
        res.send('invalid number and unit');
        return;
    } else if (!initNum) {
        res.send('invalid number');
        return;
    } else if (initUnit === false) {
        res.send('invalid unit');
        return;
    }

    const returnNum     = convertHandler.convert(initNum, initUnit);
    const returnUnit    = convertHandler.getReturnUnit(initUnit);
    const returnString  = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

    try {
      res.json({
        initNum,
        initUnit,
        returnNum,
        returnUnit,
        returnString
      });
    } catch (error) {
      res.sendStatus(404);
    }
  });


};

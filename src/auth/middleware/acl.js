'use strict';

module.exports = (capability) => {

  return (req, _res, next) => {

    try {
      if (req.user.capabilities.includes(capability)) {
        next();
      }
      else {
        next('Access Denied');
      }
    } catch (e) {
      next('Invalid Login');
    }

  };

};

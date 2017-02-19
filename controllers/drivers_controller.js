const Driver = require('../models/driver');
const mongoose = require('mongoose');

module.exports = {
    greeting(req, res) {
        res.send({hi: 'there'});
    },

    create(req, res, next) {
        const driverProps = req.body;
        Driver.create(driverProps)
            .then(driver => res.send(driver))
            .catch(next); //if there is an error go to the next middleware (error handling middleware)
    },

    edit(req, res, next) {
        const driverProps = req.body;
        const driverId = req.params.id;
        Driver.findByIdAndUpdate({_id: driverId}, driverProps)
            .then(() => {
                Driver.findById({_id: driverId})
                    .then((driver) => res.send(driver))
                    .catch(next);
            });
    },

    delete(req, res, next) {
        const driverId = req.params.id;
        Driver.findByIdAndRemove({_id: driverId})
            .then(driver => res.status(204).send(driver))
            .catch(next);
    }
}
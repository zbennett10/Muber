const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const Driver = mongoose.model('driver');


describe('Drivers controller', () => {
    it('POST to /api/drivers creates a new driver', done => {
         Driver.count().then(count => {
             request(app)
                .post('/api/drivers')
                .send({email: 'test@test.com'})
                .end(() => {
                    Driver.count().then(newCount => {
                        assert(count + 1 === newCount);
                        done();
                    });
                }); 
        });
     });

    it('PUT to /api/drivers/:id updates a driver by its id', done => {
        const driver = new Driver({email: 't@t.com', driving: false });
        driver.save()
            .then(() => {
                request(app)
                    .put('/api/drivers/' + driver._id)
                    .send({driving: true})
                    .end(() => {
                        Driver.findById({_id: driver._id})
                            .then(driver => {
                                assert(driver.driving === true);
                                done();
                            });
                    })
            });
    });

    it('DELETE to /api/drivers/:id deletes a driver by its id', done => {
        const driver = new Driver({email: 't@t.com', driving: false});
        driver.save()
            .then(() => {
                request(app)
                    .delete('/api/drivers/' + driver._id)
                    .end(() => {
                        Driver.findOne({email: 't@t.com'})
                            .then(driver => {
                                assert(driver === null);
                                done();
                            })
                    })
            })
    });

    it('GET to /api/drivers finds drivers in a location', done => {
        const seattleDriver = new Driver({
            email: 'seattle@test.com',
            geometry: {type: 'Point', coordinates: [-122.48, 47.61]}
        });
        const miamiDriver = new Driver({
            email: 'miami@test.com',
            geometry: {type: 'Point', coordinates: [-80.25, 25.79]}
        });
        Promise.all([seattleDriver.save(), miamiDriver.save()])
            .then(() => {
                request(app)
                    .get('/api/drivers?lng=-80&lat=25')
                    .end((err, response) => {
                        assert(response.body.length === 1);
                        assert(response.body[0].obj.email === 'miami@test.com');
                        done();
                    })
            })
    });
});
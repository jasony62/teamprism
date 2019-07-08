const request = require("supertest")
const app = require("../../app")

describe("#routes", function () {
    describe("#index.js", function () {
        test("foo", (done) => {
            request(app).get('/ue/matter/enroll/repos/access?app=abc').then((response) => {
                expect(response.text).toBe(`{"code":0,"data":{"user":{"id":1}}}`);
                done();
            });
        });
    })
})
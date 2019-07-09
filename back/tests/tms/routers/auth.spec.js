const request = require("supertest")
const app = require("../../../app")

describe("#tms", function () {
    describe("#auth-router.js", function () {
        test("token", (done) => {
            request(app).get('/auth/token?siteid=abc').then((response) => {
                expect(response.text).toBe(`{"code":0,"access_token":"abc123","expire_in":7200}`);
                done();
            });
        });
    })
})
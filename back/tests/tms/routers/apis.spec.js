const request = require("supertest")
const app = require("../../../app")

describe("#tms", function () {
    describe("#routers.js", function () {
        describe("#apis.js", function () {
            test("empty access_token", (done) => {
                request(app).get('/api/version?app=abc').then((response) => {
                    expect(response.text).toBe(`{"code":1,"errmsg":"没有access_token"}`)
                    done()
                })
            })
            test("pass access_token", (done) => {
                request(app).get('/api/version?access_token=abc123&app=abc').then((response) => {
                    console.log(response.text)
                    expect(JSON.parse(response.text).version).toBe('0.1')
                    done()
                })
            })
        })
    })
})
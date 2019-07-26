const request = require("supertest")
const app = require("../../../app")

describe("#tms", function() {
    describe("#routers", function() {
        describe("#wx.js", function() {
            test("微信oauth2回调", (done) => {
                const url = 'http://localhost/test?site=abc&app=123'
                const state = encodeURIComponent(url)
                request(app).get(`/ue/wx/oauth2?code=wxcode&state=${state}`).then((res) => {
                    expect(res.header.location).toEqual(url)
                    done()
                })
            })
        })
    })
})
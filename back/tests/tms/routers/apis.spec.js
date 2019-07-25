const request = require("supertest")
const app = require("../../../app")

describe("#tms", function() {
    describe("#routers.js", function() {
        describe("#apis.js", function() {
            let token
            beforeAll((done) => {
                let testdata = require('../../../cus/test.data')
                let siteid = testdata.tms.routers.auth.siteid
                const agent = request.agent(app);
                agent.get(`/ue/auth/token?site=${siteid}`)
                    .set('Cookie', [testdata.tms.routers.auth.cookie])
                    .then((res) => {
                        let oResult = JSON.parse(res.text)
                        token = oResult.access_token
                        done()
                    })
            })
            test("empty access_token", (done) => {
                request(app).get('/ue/api/version?app=abc').then((response) => {
                    expect(response.text).toBe(`{"code":1,"errmsg":"没有access_token"}`)
                    done()
                })
            })
            test("invalid access_token", (done) => {
                request(app).get('/ue/api/version?access_token=nosuchtoken&app=abc').then((response) => {
                    expect(response.text).toBe(`{"code":1,"errmsg":"access_token不可用"}`)
                    done()
                })
            })
            test("pass access_token", (done) => {
                request(app).get(`/ue/api/version?access_token=${token}&app=abc`).then((res) => {
                    expect(JSON.parse(res.text).version).toBe('0.1')
                    done()
                })
            })
        })
    })
})
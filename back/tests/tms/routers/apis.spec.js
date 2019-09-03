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
                return agent.get(`/ue/auth/token?site=${siteid}`)
                    .set('Cookie', [testdata.tms.routers.auth.cookie])
                    .then((res) => {
                        token = res.body.result.access_token
                        done()
                    })
            })
            test("empty access_token", () => {
                return request(app).get('/ue/api/version?app=abc').then(res => {
                    expect(res.body).toMatchObject(expect.objectContaining({ code: 10001, msg: expect.anything() }))
                })
            })
            test("invalid access_token", () => {
                return request(app).get('/ue/api/version?access_token=nosuchtoken&app=abc').then(res => {
                    expect(res.body).toMatchObject(expect.objectContaining({ code: 20001, msg: expect.anything() }))
                })
            })
            test("pass access_token", () => {
                return request(app).get(`/ue/api/version?access_token=${token}`).then((res) => {
                    expect(res.body).toMatchObject(expect.objectContaining({ code: 0, result: '0.1' }))
                })
            })
        })
    })
})
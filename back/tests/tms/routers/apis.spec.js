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
                        token = res.body.access_token
                        done()
                    })
            })
            test("empty access_token", (done) => {
                request(app).get('/ue/api/version?app=abc').then(res => {
                    expect(res.body).toMatchObject(expect.objectContaining({ code: 1, msg: expect.anything() }))
                    done()
                })
            })
            test("invalid access_token", (done) => {
                request(app).get('/ue/api/version?access_token=nosuchtoken&app=abc').then(res => {
                    expect(res.body).toMatchObject(expect.objectContaining({ code: 1, msg: expect.anything() }))
                    done()
                })
            })
            test("pass access_token", (done) => {
                request(app).get(`/ue/api/version?access_token=${token}&app=abc`).then((res) => {
                    expect(res.body.result).toBe('0.1')
                    done()
                })
            })
        })
    })
})
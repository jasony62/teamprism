const request = require("supertest")
const app = require("../../../app")

describe("#tms", function() {
    describe("#routers", function() {
        describe("#auth.js", function() {
            let testdata = require('../../../cus/test.data')
            let siteid = testdata.tms.routers.auth.siteid
            test("没有用户鉴权信息", (done) => {
                request(app).get(`/ue/auth/token?site=notexist`).then((res) => {
                    expect(res.body).toMatchObject(expect.objectContaining({
                        code: 40013
                    }))
                    done()
                })
            })
            test("获得accessTokens", (done) => {
                const agent = request.agent(app);
                agent.get(`/ue/auth/token?site=${siteid}`)
                    .set('Cookie', [testdata.tms.routers.auth.cookie])
                    .then((res) => {
                        expect(res.body).toMatchObject(expect.objectContaining({
                            code: 0,
                            expire_in: 7200,
                            access_token: expect.stringMatching(/\w*/)
                        }))

                        done()
                    })
            })
        })
    })
})
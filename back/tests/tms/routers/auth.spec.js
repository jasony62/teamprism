const request = require("supertest")
const app = require("../../../app")

describe("#tms", function() {
    describe("#routers", function() {
        describe("#auth.js", function() {
            let testdata = require('../../../cus/test.data')
            let siteid = testdata.tms.routers.auth.siteid
            let access_token
            test("没有用户鉴权信息", (done) => {
                request(app).get(`/ue/auth/token?site=nosuchsiteid`).then((res) => {
                    expect(res.body).toMatchObject(expect.objectContaining({
                        code: 40013
                    }))
                    done()
                })
            })
            test("获得access_token", (done) => {
                const agent = request.agent(app)
                agent.get(`/ue/auth/token?site=${siteid}`)
                    .set('Cookie', [testdata.tms.routers.auth.cookie])
                    .then((res) => {
                        expect(res.body).toMatchObject(expect.objectContaining({
                            code: 0,
                            result: {
                                expire_in: 7200,
                                access_token: expect.stringMatching(/\w*/)
                            }
                        }))
                        access_token = res.body.result.access_token
                        done()
                    })
            })
            test("通过access_token获得用户信息", (done) => {
                const agent = request.agent(app)
                console.log('at', access_token)
                agent.get(`/ue/auth/client?access_token=${access_token}`)
                    .then((res) => {
                        expect(res.body).toMatchObject(expect.objectContaining({
                            code: 0,
                            result: {
                                siteid: siteid,
                                id: expect.stringMatching(/\w./),
                                data: expect.anything()
                            }
                        }))
                        done()
                    })
            })
        })
    })
})
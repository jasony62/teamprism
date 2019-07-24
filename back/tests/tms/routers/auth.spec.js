const request = require("supertest")
const app = require("../../../app")

describe("#tms", function() {
    describe("#auth-router.js", function() {
        describe("#auth-router.js", function() {
            let testdata = require('../../../cus/test.data')
            let siteid = testdata.tms.routers.auth.siteid
            test("没有用户鉴权信息", (done) => {
                request(app).get(`/ue/auth/token?site=notexist`).then((res) => {
                    expect(res.text).toMatch(/"code":40013/)
                    done()
                })
            })
            test("获得accessTokens", (done) => {
                const agent = request.agent(app);
                agent.get(`/ue/auth/token?site=${siteid}`)
                    .set('Cookie', [`xxt_site_${siteid}_fe_user=zfzqFg-8h5fpYOZmdLZw7Rt6RDWz6-gVHhltsChlBi3O4T32TrS8-7Bmjr9NtJTtqbsa9ra6PGypP1cQDh-r3ic9EeeZxRKb0e1KhdtTHAIJEAy4ri7zyHpxn3ILZxckf-UmdLQj-eQI3MLxVIdzuJkMNX3-EP4NOq8hi8Pk`])
                    .then((res) => {
                        expect(res.text).toMatch(/{"code":0,"access_token":"\w*","expire_in":7200}/)
                        done()
                    })
            })
        })
    })
})
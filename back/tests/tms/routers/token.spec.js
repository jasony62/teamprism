describe("#tms", function() {
    describe("#routers.js", function() {
        describe("#token.js", function() {
            const Token = require('../../../tms/routers/token')
            let siteid = 'mockesiteid'
            let oMockUser = { uid: 'mockuid' }
            let token
            test("create", async () => {
                let oResult = await Token.create(siteid, oMockUser)
                token = oResult.access_token
                expect(JSON.stringify(oResult)).toMatch(/{"code":0,"access_token":"\w*","expire_in":7200}/)
            })
            test("check-existent", async () => {
                let oResult = await Token.fetch(token)
                expect(JSON.stringify(oResult)).toMatch('{"uid":"mockuid"}')
            })
            test("check-nonexistent", async () => {
                expect(await Token.fetch('nosuchtoken')).toEqual(false)
            })
        })
    })
})
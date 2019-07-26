describe("#tms", function() {
    describe("#routers.js", function() {
        describe("#token.js", function() {
            const Token = require('../../../tms/routers/token')
            let clientId = 'mockeclientid'
            let oMockUser = { uid: 'mockuid' }
            let token
            test("create", async () => {
                let aResult = await Token.create(clientId, oMockUser)
                expect(aResult[0]).toBe(true)
                expect(aResult[1]).toMatchObject(expect.objectContaining({ expire_in: 7200, access_token: expect.stringMatching(/\w*/) }))
                token = aResult[1].access_token
            })
            test("check-existent", async () => {
                let aResult = await Token.fetch(token)
                expect(aResult[0]).toBe(true)
                expect(aResult[1]).toMatchObject(expect.objectContaining({ uid: 'mockuid' }))
            })
            test("check-nonexistent", async () => {
                let aResult = await Token.fetch('nosuchtoken')
                expect(aResult[0]).toBe(false)
                expect(aResult[1]).toBe('error')
            })
        })
    })
})
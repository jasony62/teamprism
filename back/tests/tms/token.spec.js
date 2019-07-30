describe("#tms", function() {
    describe("#routers.js", function() {
        describe("#token.js", function() {
            let oMockUser = { uid: 'anyuserid' }
            const { TmsClient } = require('../../tms/client')
            const tmsClient = new TmsClient('anysiteid', 'anyuserid', oMockUser)
            const Token = require('../../tms/token')
            let token

            test("create", () => {
                return Token.create(tmsClient).then(aResult => {
                    expect(aResult[0]).toBe(true)
                    expect(aResult[1]).toMatchObject(expect.objectContaining({ expire_in: 7200, access_token: expect.stringMatching(/\w*/) }))
                    token = aResult[1].access_token
                })
            })
            test("check-existent", () => {
                return Token.fetch(token).then(aResult => {
                    expect(aResult[0]).toBe(true)
                    expect(aResult[1]).toMatchObject({ siteid: 'anysiteid', id: 'anyuserid', data: oMockUser })
                })
            })
            test("check-nonexistent", () => {
                return Token.fetch('nosuchtoken').then(aResult => {
                    expect(aResult[0]).toBe(false)
                    expect(aResult[1]).toBe('没有找到和access_token匹配的数据')
                })
            })
        })
    })
})
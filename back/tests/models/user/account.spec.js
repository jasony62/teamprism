describe("#models", () => {
    describe("#user", () => {
        describe("account.js", () => {
            test("byId()", async (done) => {
                let moAccount = require('../../../models/user/account').create({ debug: true })
                await moAccount.byId(1)
                expect(moAccount.execSqlStack[0]).toMatch(/^select \* from xxt_site_account where uid='1'$/i)
                moAccount.end(done)
            })
        })
    })
})
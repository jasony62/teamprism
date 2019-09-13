describe("#models", () => {
    describe("#user", () => {
        describe("mschema.js", () => {
            test("byId()", async (done) => {
                let moMschema = require('../../../models/user/mschema').create({ debug: true })
                await moMschema.byId(1)
                expect(moMschema.execSqlStack[0]).toMatch(/^select \* from xxt_site_member_schema where id='1'$/i)
                moMschema.end(done)
            })
        })
    })
})
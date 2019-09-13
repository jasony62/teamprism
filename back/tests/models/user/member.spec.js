describe("#models", () => {
    describe("#user", () => {
        describe("member.js", () => {
            test("byId()", async (done) => {
                let moMember = require('../../../models/user/member').create({ debug: true })
                await moMember.byId(1)
                expect(moMember.execSqlStack[0]).toMatch(/^select \* from xxt_site_member where id='1'$/i)
                moMember.end(done)
            })
            test("byUser()-sql", async (done) => {
                let moMember = require('../../../models/user/member').create({ debug: true })
                await moMember.byUser(1, { mschemas: [1, 2] })
                expect(moMember.execSqlStack[0]).toMatch(/^select \* from xxt_site_member where userid='1' and forbidden='N' and schema_id in\('1','2'\)$/i)
                moMember.end(done)
            })
        })
    })
})
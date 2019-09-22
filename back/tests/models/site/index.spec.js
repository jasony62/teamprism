describe("#models", () => {
    describe("#site", () => {
        describe("index.js", () => {
            test("byId()", async (done) => {
                let dmSite = require('../../../models/site').create({ debug: true })
                await dmSite.byId(1)
                expect(dmSite.execSqlStack[0]).toMatch(/^select \* from xxt_site where `id` = 1$/i)
                dmSite.end(done)
            })
        })
    })
})
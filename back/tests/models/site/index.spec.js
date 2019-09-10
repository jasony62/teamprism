describe("#models", () => {
    describe("#site", () => {
        describe("index.js", () => {
            test("byId()", async (done) => {
                let moSite = require('../../../models/site').create({ debug: true })
                await moSite.byId(1)
                expect(moSite.execSqlStack[0]).toMatch(/^select \* from xxt_site where id='1'$/i)
                moSite.end(done)
            })
        })
    })
})
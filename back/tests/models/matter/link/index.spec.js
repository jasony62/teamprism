describe("#models", () => {
    describe("#matter", () => {
        describe("#link", () => {
            describe("index.js", () => {
                test("byId()", async (done) => {
                    let moLink = require('../../../../models/matter/link').create({ debug: true })
                    await moLink.byId(1)
                    expect(moLink.execSqlStack[0]).toMatch(/^select \* from xxt_link where id='1'$/i)
                    moLink.end(done)
                })
                test("byIds()", async (done) => {
                    let moLink = require('../../../../models/matter/link').create({ debug: true })
                    await moLink.byIds([1, 2, 3])
                    expect(moLink.execSqlStack[0]).toMatch(/^select \* from xxt_link where id in\('1','2','3'\)$/i)
                    moLink.end(done)
                })
            })
        })
    })
})
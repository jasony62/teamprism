describe("#models", () => {
    describe("#matter", () => {
        describe("#group", () => {
            describe("index.js", () => {
                test("byId()", async (done) => {
                    let moGroup = require('../../../../models/matter/group').create({ debug: true })
                    await moGroup.byId(1)
                    expect(moGroup.execSqlStack[0]).toMatch(/^select \* from xxt_group where id='1'$/i)
                    moGroup.end(done)
                })
                test("byIds()", async (done) => {
                    let moGroup = require('../../../../models/matter/group').create({ debug: true })
                    await moGroup.byIds([1, 2, 3])
                    expect(moGroup.execSqlStack[0]).toMatch(/^select \* from xxt_group where id in\('1','2','3'\)$/i)
                    moGroup.end(done)
                })
            })
        })
    })
})
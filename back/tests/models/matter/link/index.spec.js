describe("#models", () => {
    describe("#matter", () => {
        describe("#link", () => {
            describe("index.js", () => {
                test("byId()", async () => {
                    let moLink = require('../../../../models/matter/link').create({ debug: true })
                    await moLink.byId(1)
                    expect(moLink.execSqlStack[0]).toMatch(/^SELECT \* FROM xxt_link WHERE `id` = 1$/i)
                })
                test("byIds()", async () => {
                    let moLink = require('../../../../models/matter/link').create({ debug: true })
                    await moLink.byIds([1, 2, 3])
                    expect(moLink.execSqlStack[0]).toMatch(/^SELECT \* FROM xxt_link WHERE `id` in\(1, 2, 3\)$/i)
                })
            })
        })
    })
})
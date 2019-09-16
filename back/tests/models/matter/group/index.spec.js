describe("#models", () => {
    describe("#matter", () => {
        describe("#group", () => {
            describe("index.js", () => {
                test("byId()", async () => {
                    let dmGroup = require('../../../../models/matter/group').create({ debug: true })
                    await dmGroup.byId(1)
                    expect(dmGroup.execSqlStack[0]).toMatch(/^SELECT \* FROM xxt_group WHERE `id` = 1$/i)
                })
                test("byIds()", async () => {
                    let dmGroup = require('../../../../models/matter/group').create({ debug: true })
                    await dmGroup.byIds([1, 2, 3])
                    expect(dmGroup.execSqlStack[0]).toMatch(/^SELECT \* FROM xxt_group WHERE `id` in\(1, 2, 3\)$/i)
                })
            })
        })
    })
})
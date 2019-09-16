describe("#models", () => {
    describe("#matter", () => {
        describe("#group", () => {
            describe("record.js", () => {
                test("byId()", async () => {
                    let dmGrpRec = require('../../../../models/matter/group/record').create({ debug: true })
                    await dmGrpRec.byId(1)
                    expect(dmGrpRec.execSqlStack[0]).toMatch(/^SELECT \* FROM xxt_group_record WHERE `id` = 1$/i)
                })
                test("byIds()", async () => {
                    let dmGrpRec = require('../../../../models/matter/group/record').create({ debug: true })
                    await dmGrpRec.byIds([1, 2, 3])
                    expect(dmGrpRec.execSqlStack[0]).toMatch(/^SELECT \* FROM xxt_group_record WHERE `id` in\(1, 2, 3\)$/i)
                })
                test("byUser()-sql", async () => {
                    let dmGrpRec = require('../../../../models/matter/group/record').create({ debug: true })
                    await dmGrpRec.byUser({ id: 'anyappid' }, 'anyuserid')
                    expect(dmGrpRec.execSqlStack[0]).toMatch(/^SELECT \* FROM xxt_group_record WHERE `state` = 1 and `aid` = 'anyappid' and `userid` = 'anyuserid' ORDER BY enroll_at desc$/i)
                })
            })
        })
    })
})
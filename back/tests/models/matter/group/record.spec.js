describe("#models", () => {
    describe("#matter", () => {
        describe("#group", () => {
            describe("record.js", () => {
                test("byId()", async (done) => {
                    let moGrpRec = require('../../../../models/matter/group/record').create({ debug: true })
                    await moGrpRec.byId(1)
                    expect(moGrpRec.execSqlStack[0]).toMatch(/^select \* from xxt_group_record where id='1'$/i)
                    moGrpRec.end(done)
                })
                test("byIds()", async (done) => {
                    let moGrpRec = require('../../../../models/matter/group/record').create({ debug: true })
                    await moGrpRec.byIds([1, 2, 3])
                    expect(moGrpRec.execSqlStack[0]).toMatch(/^select \* from xxt_group_record where id in\('1','2','3'\)$/i)
                    moGrpRec.end(done)
                })
                test("byUser()-sql", async (done) => {
                    let moGrpRec = require('../../../../models/matter/group/record').create({ debug: true })
                    await moGrpRec.byUser({ id: 'anyappid' }, 'anyuserid')
                    expect(moGrpRec.execSqlStack[0]).toMatch(/^select \* from xxt_group_record where state='1' and aid='anyappid' and userid='anyuserid' order by enroll_at desc$/i)
                    moGrpRec.end(done)
                })
            })
        })
    })
})
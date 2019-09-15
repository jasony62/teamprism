describe("#models", () => {
    describe("#matter", () => {
        describe("#mission", () => {
            describe("index.js", () => {
                test("byId()", async () => {
                    let dmMission = require('../../../../models/matter/mission').create({ debug: true })
                    await dmMission.byId(1)
                    expect(dmMission.execSqlStack[0]).toMatch(/^select \* from xxt_mission where id='1'$/i)
                })
                test("byIds()", async () => {
                    let dmMission = require('../../../../models/matter/mission').create({ debug: true })
                    await dmMission.byIds([1, 2, 3])
                    expect(dmMission.execSqlStack[0]).toMatch(/^select \* from xxt_mission where id in\('1','2','3'\)$/i)
                })
            })
        })
    })
})
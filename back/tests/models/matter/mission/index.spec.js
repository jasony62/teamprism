describe("#models", () => {
    describe("#matter", () => {
        describe("#mission", () => {
            describe("index.js", () => {
                test("byId()", async (done) => {
                    let moMission = require('../../../../models/matter/mission').create({ debug: true })
                    await moMission.byId(1)
                    expect(moMission.execSqlStack[0]).toMatch(/^select \* from xxt_mission where id='1'$/i)
                    moMission.end(done)
                })
                test("byIds()", async (done) => {
                    let moMission = require('../../../../models/matter/mission').create({ debug: true })
                    await moMission.byIds([1, 2, 3])
                    expect(moMission.execSqlStack[0]).toMatch(/^select \* from xxt_mission where id in\('1','2','3'\)$/i)
                    moMission.end(done)
                })
            })
        })
    })
})
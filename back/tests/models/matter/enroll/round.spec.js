describe("#models", () => {
    describe("#matter", () => {
        describe("#enroll", () => {
            describe("#round.js", () => {
                let roundModel,testdata
                beforeAll(() => {
                    roundModel = require('../../../../models/matter/enroll/round')()
                    testdata = require('../../../../cus/test.data')
                })
                test("byId()", async () => {
                    let rid = testdata.models.ue.matter.enroll.rid
                    let data = await roundModel.byId(rid)
                    expect(data.rid).toBe(rid)
                })
                test("getActive()", async () => {
                    let oApp = testdata.models.ue.matter.enroll
                    let data = await roundModel.getActive(oApp)
                    console.log(data)
                })
                afterAll(done => {
                    roundModel.end(done)
                })
            })
        })
    })
})
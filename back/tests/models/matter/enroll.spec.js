describe("#models", () => {
    describe("#matter", () => {
        describe("#enroll.js", () => {
            let modelEnl, testdata
            beforeAll(() => {
                modelEnl = require('../../../models/matter/enroll')()
                testdata = require('../../../cus/test.data')
            })
            test("byId()", async () => {
                let appId = testdata.models.matter.enroll.id
                let oApp = await modelEnl.byId(appId)
                expect(oApp.id).toBe(appId)
            })
            afterAll(done => {
                modelEnl.end(done)
            })
        })
    })
})
describe("#models", () => {
    describe("#matter", () => {
        describe("#enroll", () => {
            describe("#data.js", () => {
                let modelData, testdata
                beforeAll(() => {
                    modelData = require('../../../models/matter/enroll/data')()
                    testdata = require('../../../cus/test.data')
                })
                test("byRecord()", async () => {
                    let ek = testdata.models.ue.matter.enroll.ek
                    let data = await modelData.byRecord(ek)
                    expect(data.enroll_key).toBe(ek)
                })
                afterAll(done => {
                    modelData.end(done)
                })
            })
        })
    })
})
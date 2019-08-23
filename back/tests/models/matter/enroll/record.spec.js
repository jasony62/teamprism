describe("#models", () => {
    describe("#matter", () => {
        describe("#enroll", () => {
            describe("#record.js", () => {
                let modelRecord, testdata
                beforeAll(() => {
                    modelRecord = require('../../../../models/matter/enroll/record')()
                    testdata = require('../../../../cus/test.data')
                })
                test("byId()", async () => {
                    let ek = testdata.models.ue.matter.enroll.ek
                    let data = await modelRecord.byId(ek)
                    expect(data.enroll_key).toBe(ek)
                })
                test("byApp()", async () => {
                    let app = testdata.models.ue.matter.enroll.id
                    let data = await modelRecord.byApp(app)
                    expect(data).toMatchObject({ records: expect.anything(), total: expect.anything() })
                })
                afterAll(done => {
                    modelRecord.end(done)
                })
            })
        })
    })
})
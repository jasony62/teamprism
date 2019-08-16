describe("#models", () => {
    describe("#matter", () => {
        describe("#enroll", () => {
            describe("#schema.js", () => {
                let schemaModel,testdata
                beforeAll(() => {
                    schemaModel = require('../../../../models/matter/enroll/schema')()
                    testdata = require('../../../../cus/test.data')
                })
                test("setDynaSchemas()", async () => {
                    let oApp = testdata.models.ue.matter.enroll
                    let rst = await schemaModel.setDynaSchemas(oApp)
                    console.log(rst)
                    // expect(data.enroll_key).toBe(ek)
                })
                afterAll(done => {
                    modelData.end(done)
                })
            })
        })
    })
})
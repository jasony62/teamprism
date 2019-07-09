describe("#apis", () => {
    describe("#ue", () => {
        describe("#matter", () => {
            describe("#enroll", () => {
                describe("#main.js", () => {
                    let ctrl, testdata
                    beforeAll(() => {
                        ctrl = require('../../../../../apis/matter/enroll/main')()
                        testdata = require('../../../../../cus/test.data')
                    })
                    test("entryRule()", () => {
                        let mockReq = {
                            query: {
                                app: testdata.apis.ue.matter.enroll.main.appId
                            }
                        }
                        let entryRule = ctrl.entryRule(mockReq)
                        expect(entryRule).not.toBe(false)
                    })
                })
            })
        })
    })
})
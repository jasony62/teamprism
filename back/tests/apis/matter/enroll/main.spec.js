describe("#apis", () => {
    describe("#ue", () => {
        describe("#matter", () => {
            describe("#enroll", () => {
                describe("#main.js", () => {
                    const CtrlClass = require('../../../../apis/matter/enroll/main')
                    let testdata
                    beforeAll(() => {
                        testdata = require('../../../../cus/test.data')
                    })
                    test("entryRule()", () => {
                        let mockReq = {
                            query: {
                                app: testdata.apis.ue.matter.enroll.main.appId
                            }
                        }
                        let ctrl = new CtrlClass(mockReq)
                        return ctrl.entryRule().then(rst => {
                            expect(rst).toMatchObject({ code: 0, data: expect.anything() })
                        })
                    })
                })
            })
        })
    })
})
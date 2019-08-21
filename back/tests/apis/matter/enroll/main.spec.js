
describe("#apis", () => {
    describe("#ue", () => {
        describe("#matter", () => {
            describe("#enroll", () => {
                describe("#main.js", () => {
                    const CtrlClass = require('../../../../apis/matter/enroll/main')
                    let testdata,mockReq
                    beforeAll(() => {
                        testdata = require('../../../../cus/test.data')
                        mockReq = {
                            query: {
                                app: testdata.apis.ue.matter.enroll.main.appId,
                            }
                        }
                    })
                    test("entryRule()", () => {
                        let ctrl = new CtrlClass(mockReq)
                        return ctrl.entryRule().then(rst => {
                            expect(rst).toMatchObject({ code: 0, result: expect.anything() })
                        })
                    })
                    test("get()", () => {
                        let ctrl = new CtrlClass(mockReq)
                        return ctrl.get().then(rst => {
                            expect(rst).toMatchObject({ code: 0, result: expect.anything() })
                        })
                    })
                })
            })
        })
    })
})
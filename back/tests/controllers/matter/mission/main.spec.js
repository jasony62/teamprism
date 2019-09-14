describe("#apis", () => {
    describe("#matter", () => {
        describe("#mission", () => {
            describe("#main.js", () => {
                const CtrlClass = require('../../../../controllers/matter/mission/main')
                test("tmsBeforeEach()", () => {
                    let ctrl = new CtrlClass({ query: { app: '1' } })
                    let mockById = jest.fn().mockReturnValue({ state: 1 })
                    ctrl.model = jest.fn().mockReturnValue({ byId: mockById })
                    return ctrl.tmsBeforeEach().then(rst => {
                        expect(ctrl.model.mock.calls).toHaveLength(1)
                        expect(ctrl.model.mock.calls[0][0]).toEqual('matter/mission')
                        expect(mockById.mock.calls).toHaveLength(1)
                        expect(mockById.mock.calls[0][0]).toEqual('1')
                        expect(rst).toBe(true)
                    })
                })
            })
        })
    })
})
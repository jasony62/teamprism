describe("#apis", () => {
    describe("#site", () => {
        describe("#main.js", () => {
            const CtrlClass = require('../../../controllers/site/main')
            test("get()", () => {
                let ctrl = new CtrlClass({ query: { site: '1' } })
                let mockById = jest.fn().mockReturnValue({})
                ctrl.model = jest.fn().mockReturnValue({ byId: mockById })
                return ctrl.get().then(rst => {
                    expect(ctrl.model.mock.calls).toHaveLength(1)
                    expect(ctrl.model.mock.calls[0][0]).toEqual('site')
                    expect(mockById.mock.calls).toHaveLength(1)
                    expect(mockById.mock.calls[0][0]).toEqual('1')
                    expect(rst).toMatchObject({ code: 0, result: {} })
                })
            })
        })
    })
})
describe("#apis", () => {
    describe("#site", () => {
        describe("#main.js", () => {
            const CtrlClass = require('../../../apis/site/main')
            test("get()", () => {
                let ctrl = new CtrlClass({ query: { site: '1' } })
                let mockById = jest.fn().mockReturnValue({})
                let mockEnd = jest.fn()
                ctrl.model = jest.fn().mockReturnValue({ byId: mockById, end: mockEnd })
                return ctrl.get().then(rst => {
                    expect(ctrl.model.mock.calls).toHaveLength(1)
                    expect(ctrl.model.mock.calls[0][0]).toEqual('site')
                    expect(mockById.mock.calls).toHaveLength(1)
                    expect(mockById.mock.calls[0][0]).toEqual('1')
                    expect(mockEnd.mock.calls).toHaveLength(1)
                    expect(rst).toMatchObject({ code: 0, result: {} })
                })
            })
        })
    })
})
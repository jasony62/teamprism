describe("#apis", () => {
    describe("#matter", () => {
        describe("#article", () => {
            describe("#main.js", () => {
                const CtrlClass = require('../../../../apis/matter/article/main')
                test("tmsBeforeEach()", () => {
                    let ctrl = new CtrlClass({ query: { app: '1' } })
                    let mockById = jest.fn().mockReturnValue({ state: 1 })
                    let mockEnd = jest.fn()
                    ctrl.model = jest.fn().mockReturnValue({ byId: mockById, end: mockEnd })
                    return ctrl.tmsBeforeEach().then(rst => {
                        expect(ctrl.model.mock.calls).toHaveLength(1)
                        expect(ctrl.model.mock.calls[0][0]).toBe('matter/article')
                        expect(mockById.mock.calls).toHaveLength(1)
                        expect(mockById.mock.calls[0][0]).toBe('1')
                        expect(mockEnd.mock.calls).toHaveLength(1)
                        expect(rst).toBe(true)
                        expect(ctrl.article).toMatchObject({ state: 1 })
                    })
                })
                test("get()", () => {
                    let ctrl = new CtrlClass({ query: { app: '1' } })
                    ctrl.article = { id: 1, state: 1, siteid: 2, mission_id: 3 }
                    let mockById = jest.fn().mockResolvedValueOnce({ id: 2 }).mockResolvedValueOnce({ id: 3 })
                    let mockeChannnelByMatter = jest.fn().mockReturnValue([])
                    let mockEnd = jest.fn()
                    ctrl.model = jest.fn().mockReturnValue({ byId: mockById, end: mockEnd, fields_ue: ['id'], byMatter: mockeChannnelByMatter })
                    return ctrl.get().then(rst => {
                        expect(ctrl.model.mock.calls).toHaveLength(4)
                        expect(ctrl.model.mock.calls[0][0]).toBe('site')
                        expect(ctrl.model.mock.calls[1][0]).toBe('matter/mission')
                        expect(ctrl.model.mock.calls[2][0]).toBe('matter/channel')
                        expect(ctrl.model.mock.calls[3][0]).toBe('matter/article')
                        expect(mockById.mock.calls).toHaveLength(2)
                        expect(mockById.mock.calls[0][0]).toBe(2)
                        expect(mockById.mock.calls[1][0]).toBe(3)
                        //expect(mockEnd.mock.calls).toHaveLength(1)
                        expect(rst).toMatchObject({ code: 0, result: { id: 1, site: { id: 2 }, mission: { id: 3 } } })
                    })
                })
            })
        })
    })
})
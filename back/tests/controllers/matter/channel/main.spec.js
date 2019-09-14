describe("#apis", () => {
    describe("#matter", () => {
        describe("#channel", () => {
            describe("#main.js", () => {
                const CtrlClass = require('../../../../controllers/matter/channel/main')
                test("mattersGet()", () => {
                    let ctrl = new CtrlClass()
                    ctrl.channel = { id: 1 }
                    let mockByChannel = jest.fn().mockReturnValue([])
                    ctrl.model = jest.fn().mockReturnValue({ byChannel: mockByChannel })
                    return ctrl.mattersGet().then(rst => {
                        expect(ctrl.model.mock.calls).toHaveLength(1)
                        expect(ctrl.model.mock.calls[0][0]).toEqual('matter/channel/matter')
                        expect(mockByChannel.mock.calls).toHaveLength(1)
                        expect(mockByChannel.mock.calls[0][0]).toEqual(ctrl.channel)
                        expect(rst).toMatchObject({ code: 0, result: [] })
                    })
                })
            })
        })
    })
})
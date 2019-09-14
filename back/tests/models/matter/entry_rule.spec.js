describe("#models", () => {
    describe("#matter", () => {
        describe("#base.js", () => {
            test("必须为注册用户", async () => {
                const { Rule } = require('../../../models/matter/entry_rule')
                let rule = new Rule({ debug: true })
                rule.rule = { scope: { register: 'Y' } }
                let mockById = jest.fn().mockReturnValueOnce({ unionid: '' }).mockReturnValue({ unionid: 'anyunionid' })
                rule.model = jest.fn().mockReturnValue({ byId: mockById })
                // 未通过
                let result = await rule.checkRegister('anyuserid')
                expect(mockById.mock.calls).toHaveLength(1)
                expect(mockById.mock.calls[0][0]).toBe('anyuserid')
                expect(result).toBe(false)
                // 通过
                result = await rule.checkRegister('anyuserid')
                expect(mockById.mock.calls[1][0]).toBe('anyuserid')
                expect(result).toBe(true)
            })
            test("必须为通讯录用户", async () => {
                const { Rule } = require('../../../models/matter/entry_rule')
                let rule = new Rule({ debug: true })
                rule.rule = { scope: { member: 'Y' }, member: { 1: true, 2: true } }
                let mockByUser = jest.fn().mockReturnValueOnce([]).mockReturnValue([{ id: 1 }])
                rule.model = jest.fn().mockReturnValue({ byUser: mockByUser })
                // 未通过
                let result = await rule.checkMember('anyuserid')
                expect(mockByUser.mock.calls[0][0]).toBe('anyuserid')
                expect(mockByUser.mock.calls[0][1]).toMatchObject({ mschemas: ['1', '2'] })
                expect(result).toBe(false)
                // 通过
                result = await rule.checkMember('anyuserid')
                expect(mockByUser.mock.calls[1][0]).toBe('anyuserid')
                expect(mockByUser.mock.calls[1][1]).toMatchObject({ mschemas: ['1', '2'] })
                expect(result).toBe(true)
            })
        })
    })
})
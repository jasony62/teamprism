describe("#models", () => {
    describe("#matter", () => {
        describe("#channel", () => {
            describe("matter.js", () => {
                test("byChannel()-sql", async () => {
                    let dmChaMat = require('../../../../models/matter/channel/matter').create({ debug: true })
                    await dmChaMat.byChannel({ id: 1 }, {})
                    expect(dmChaMat.execSqlStack[0]).toMatch(/^select create_at,matter_type,matter_id,seq from xxt_channel_matter where channel_id='1' order by seq,create_at desc limit 0,12$/i)
                })
                test("byChannel()-matters", async () => {
                    let dmChaMat = require('../../../../models/matter/channel/matter').create({ debug: false })
                    dmChaMat.select = jest.fn().mockReturnValue([{
                        matter_type: 'article',
                        matter_id: '1',
                    }, {
                        matter_type: 'article',
                        matter_id: '2',
                    }, {
                        matter_type: 'link',
                        matter_id: '3',
                    }, {
                        matter_type: 'link',
                        matter_id: '4',
                    }, {
                        matter_type: 'enroll',
                        matter_id: '5',
                    }, {
                        matter_type: 'enroll',
                        matter_id: '6',
                    }])
                    dmChaMat._articleByIds = jest.fn().mockReturnValue(new Map([
                        ['article:1', { id: '1', title: 'article-1' }],
                        ['article:2', { id: '2', title: 'article-2' }]
                    ]))
                    dmChaMat._linkByIds = jest.fn().mockReturnValue(new Map([
                        ['link:3', { id: '3', title: 'link-3' }],
                        ['link:4', { id: '4', title: 'link-4' }]
                    ]))
                    dmChaMat._enrollByIds = jest.fn().mockReturnValue(new Map([
                        ['enroll:5', { id: '5', title: 'enroll-5' }],
                        ['enroll:6', { id: '6', title: 'enroll-6' }]
                    ]))
                    let matters = await dmChaMat.byChannel({ id: 1 }, {})
                    // 获得频道包含的素材
                    expect(dmChaMat.select.mock.calls).toHaveLength(1)

                    // 按素材类型获得详细内容
                    expect(dmChaMat._articleByIds).toHaveBeenCalledWith(['1', '2'])
                    expect(dmChaMat._linkByIds).toHaveBeenCalledWith(['3', '4'])
                    expect(dmChaMat._enrollByIds).toHaveBeenCalledWith(['5', '6'])

                    // 将分类型获得的素材按顺序放到列表中
                    expect(matters[0]).toMatchObject({ id: '1', title: 'article-1' })
                    expect(matters[1]).toMatchObject({ id: '2', title: 'article-2' })
                    expect(matters[2]).toMatchObject({ id: '3', title: 'link-3' })
                    expect(matters[3]).toMatchObject({ id: '4', title: 'link-4' })
                    expect(matters[4]).toMatchObject({ id: '5', title: 'enroll-5' })
                    expect(matters[5]).toMatchObject({ id: '6', title: 'enroll-6' })
                })
            })
        })
    })
})
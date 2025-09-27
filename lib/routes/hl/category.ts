import { Route } from '@/types';
import getHlcg from './hlcg';
export const route: Route = {
    path: '/:category',
    categories: ['new-media'],
    example: '/hl/hlcg?domain=example.com',
    parameters: {
        category: '分类名，如 hlcg, jrrs, jqrm, lsdg',
    },
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    radar: [
        {
            source: ['18hlw.com/:category'],
        },
    ],
    name: 'heiliao',
    maintainers: ['zy97'],
    handler,
    description: `
支持的分类：
- hlcg
- jrrs
- jqrm
- lsdg

可选参数：
- domain: 指定国内镜像域名，如 ?domain=example.com（不包含协议）
    `,
};
async function handler(ctx: any) {
    let category = ctx.req.param('category');
    const categories = ['hlcg', 'jrrs', 'jqrm', 'lsdg'];
    if (!categories.includes(category)) {
        category = 'hlcg';
    }


    return await getHlcg(category);
}

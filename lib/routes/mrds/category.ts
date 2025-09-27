import { Route } from '@/types';
import getContent from './content';
export const route: Route = {
    path: '/:category',
    categories: ['new-media'],
    example: '/mrds/mrds?domain=example.com',
    parameters: {
        category: '分类名',
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
            source: ['mrds66.com/category/:category'],
        },
    ],
    name: 'mrds',
    maintainers: ['zy97'],
    handler,
    description: `支持分类`,
};
async function handler(ctx: any) {
    const category = ctx.req.param('category');
    // 获取可选的域名参数
    return await getContent(category);
}

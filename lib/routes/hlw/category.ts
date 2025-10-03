import { Route } from '@/types';
import getHlcg from './hlcg';
export const route: Route = {
    path: '/:category',
    categories: ['new-media'],
    example: '/hl/hlcg',
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
            source: ['heiliao.com/:category'],
        },
    ],
    name: 'heiliao',
    maintainers: ['zy97'],
    handler,
};
async function handler(ctx: any) {
    const category = ctx.req.param('category');
    return await getHlcg(category);
}

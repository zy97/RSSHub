import { load } from 'cheerio';
import { parseDate } from '@/utils/parse-date';
import cache from '@/utils/cache';
import logger from '@/utils/logger';
import { ofetch } from 'ofetch';

const getHlcg = async (category: string, customDomain?: string) => {
    // 如果提供了自定义域名，使用自定义域名；否则使用默认域名
    customDomain = '0jrdg.abdlwmpc.top';
    const domain = customDomain || '18hlw.com';
    const baseUrl = `https://${domain}`;
    const link = `${baseUrl}/${category}/`;

    const response = await ofetch(link);
    const $ = load(response);
    const list = $('div.video-item')
        .toArray()
        .map((item) => {
            item = $(item);
            const a = item.find('a').first();
            return {
                title: a.text().trim(),
                link: `${baseUrl}${a.attr('href')}`,
            };
        })
        .filter((item) => item.link.includes('archives') && item.title !== '热');
    const results = await Promise.all(
        list.map((item) =>
            cache.tryGet(item.link, async () => {
                logger.http(`Requesting ${item.link}`);
                const response = await ofetch(item.link);
                const $ = load(response);
                const publishedTime = $('meta[property="article:published_time"]').attr('content');
                const content = $('.client-only-placeholder').first();
                const videos = content.find('.dplayer');
                content.find('blockquote').remove();
                content.find('div').remove();
                content.find('img').each((_, img) => {
                    const imgElement = $(img);
                    const src = imgElement.attr('onload').match(/loadImg\(this,'(.*?)'\)/)[1];
                    const mySrc = `http://10.144.144.100:9090?image=${src}`;
                    imgElement.attr('alt', src);
                    imgElement.attr('src', mySrc);
                    imgElement.removeAttr('onload');
                });
                let description = content.html();

                for (const video of videos.toArray()) {
                    const videoElement = $(video);
                    const config = videoElement.attr('config');
                    if (config) {
                        const configObj = JSON.parse(config);
                        const m3u8Url = configObj.video.url;
                        const videoStr = renderDPlayer(m3u8Url);
                        description += videoStr;
                    }
                }

                item.description = description;
                item.pubDate = parseDate(publishedTime);
                return item;
            })
        )
    );

    return {
        title: '最新黑料',
        link,
        item: results,
    };
};
function renderDPlayer(m3u8Url: string) {
    return `
    <iframe title="视频播放器"
    src="http://10.144.144.100:8896/palyer.html?url=${m3u8Url}"></iframe>
    `;
}
export default getHlcg;

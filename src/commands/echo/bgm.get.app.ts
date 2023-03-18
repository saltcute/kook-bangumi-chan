import { BaseCommand, CommandFunction, BaseSession, Card } from 'kasumi.js';
import axios from 'axios';
import { bot } from 'init/client';


type calendar = {
    weekday: {
        en: string,
        cn: string,
        ja: string,
        id: number
    },
    items: {
        id: number,
        url: string,
        type: number,
        name: string,
        name_cn: string
        summary: string,
        air_date: string,
        air_weekday: number,
        rating?: {
            total: number,
            count: {
                10: number,
                9: number,
                8: number,
                7: number,
                6: number,
                5: number,
                4: number,
                3: number,
                2: number,
                1: number
            },
            score: number
        },
        rank?: number,
        images: {
            large: string,
            common: string,
            medium: string,
            small: string,
            grid: string
        },
        collection?: {
            doing: number
        }
    }[]
}

class BgmKmd extends BaseCommand {
    name = 'get';
    func: CommandFunction<BaseSession, any> = async (session) => {
        let calendar: calendar[] = (await axios.get("https://api.bgm.tv/calendar")).data;
        let weekday = new Date().getDay(); weekday = (weekday ? weekday : 7) - 1;
        let calendar_today = calendar[weekday];
        let messageId = (await session.send(new Card().addText("正在加载……")))?.msg_id;
        if (calendar_today && messageId) {
            calendar_today.items.sort((a, b) => {
                if (a.rank || b.rank) {
                    let ca = a.rank || 11451419;
                    let cb = b.rank || 11451419;
                    return ca - cb
                } else if (a.collection?.doing && b.collection?.doing) {
                    return a.collection.doing - b.collection.doing;
                } else if (a.rating?.total && b.rating?.total) {
                    return a.rating.total - b.rating.total;
                } else return 0;
            });
            let card = new Card().setSize('lg').setTheme('info');
            card.addTitle(`今天是 ${new Date().getFullYear()} 年 ${new Date().getMonth() + 1} 月 ${new Date().getDate()} 日 ${calendar_today.weekday.cn}`)
                .addDivider()
            // .addTitle('今日更新');
            for (let i = 0; i < calendar_today.items.length && i < 5; ++i) {
                // console.log(i);
                let item = calendar_today.items[i];
                let imageBuffer = Buffer.from((await axios.get(item.images.large, { responseType: 'arraybuffer' })).data);
                let uploaded = (await bot.API.asset.create(imageBuffer, { filename: 'image.png' }))?.url
                if (uploaded) card.addTextWithImage(`${item.name}
${item.name_cn ? `(font)${item.name_cn}(font)[secondary]` : ''}
开播时间：${item.air_date}
被 ${item.collection?.doing || "未知"} 人加入收藏
评分: ${item.rating?.score || "未知"} 分
(font)在总共 ${item.rating?.total || "未知"} 个评价中……(font)[secondary]
(font)${item.rating ? (item.rating.count[10] + item.rating.count[9] + item.rating.count[8]) : "未知"} 人觉得这番很棒！(font)[success]
(font)${item.rating ? (item.rating.count[1] + item.rating.count[2] + item.rating.count[3]) : "未知"} 人觉得这番一坨……(font)[warning]
`, {
                    url: uploaded,
                    position: 'right'
                });
            }
            session.update(messageId, card);
        }
    };
}

export const bgmKmd = new BgmKmd();
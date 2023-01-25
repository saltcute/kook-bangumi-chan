import { Card, MenuCommand } from 'kbotify';
import { bgmKmd } from './bgm.get.app';

class BgmMenu extends MenuCommand {
    code = 'bgm';
    trigger = 'bgm';
    help = '如需测试KMarkDown请发送".echo kmd"';

    intro = '复读菜单';
    menu = new Card().addText('一些卡片里需要展示的东西').toString();
    useCardMenu = true; // 使用卡片菜单
}

export const bgmMenu = new BgmMenu(bgmKmd);

import { Card, BaseMenu } from 'kasumi.js';
import { bgmKmd } from './bgm.get.app';

class BgmMenu extends BaseMenu {
    name = 'bgm';
    prefix = '.!/';
}

export const bgmMenu = new BgmMenu(bgmKmd);

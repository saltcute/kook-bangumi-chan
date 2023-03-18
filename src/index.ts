import { bot } from 'init/client';
import { bgmMenu } from './commands/echo/bgm.menu';

bot.plugin.load(bgmMenu);

bot.connect();

bot.logger.debug('system init success');

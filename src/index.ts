import auth from 'configs/auth';
import { bot } from 'init/client';
import { bgmMenu } from './commands/echo/bgm.menu';

bot.messageSource.on('message', (e) => {
    bot.logger.debug(`received:`, e);
    // 如果想要在console里查看收到信息也可以用
    //console.log(e);
});

bot.addCommands(bgmMenu);

bot.connect();

bot.logger.debug('system init success');

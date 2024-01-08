const puppeteer = require('puppeteer');
const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const visitLinks = async () => {
  try {
    const links = JSON.parse(fs.readFileSync('croxydb.json'));
    const logChannelId = '1186256983494508614'; // Logun atılacağı kanal ID'si

    const browser = await puppeteer.launch();

    for (const link of links) {
      const page = await browser.newPage();
      await page.goto(link, { waitUntil: 'domcontentloaded' });

      // Burada sayfa ile ilgili işlemleri yapabilirsiniz
      // Örneğin, sayfadaki verileri kontrol etme veya bir işlem gerçekleştirme

      // Log oluştur
      const logEmbed = {
        color: '#0099ff',
        title: 'Link Ziyareti',
        description: `Link: ${link} ziyaret edildi.`,
      };

      const logChannel = await client.channels.fetch(logChannelId);
      await logChannel.send({ embeds: [logEmbed] });

      // Sayfadan çıkma işlemi yapmadan önce bekleyin
      await page.waitForTimeout(30000);

      // Sayfayı kapat
      await page.close();

      // Hemen tekrar aynı linki ziyaret et
      const newPage = await browser.newPage();
      await newPage.goto(link, { waitUntil: 'domcontentloaded' });
      await newPage.close();
    }

    // Tarayıcıyı kapat
    await browser.close();
  } catch (error) {
    console.error('Link ziyaret hatası:', error.message);
  }
};

// Belirli bir süre boyunca linkleri ziyaret etme işlemini başlat
setInterval(visitLinks, 30000);

client.login('TOKEN'); // TOKEN kısmını kendi bot tokeninizle değiştirin

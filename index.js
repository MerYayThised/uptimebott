const Discord = require('discord.js');
const fs = require('fs');
const axios = require('axios');

const client = new Discord.Client();
const prefix = '!';

const isValidLink = (link) => {
  return link.startsWith('https://') && (link.includes('glitch.me') || link.includes('replit.dev'));
};

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('message', async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'panel') {
    const rules = 'Kurallar:\n1. Kurallar burada\n2. Kurallar burada\n...';
    const gifLink = 'https://example.com/your-gif.gif';

    const panelEmbed = new Discord.MessageEmbed()
      .setTitle('Panel')
      .setDescription(rules)
      .setImage(gifLink)
      .setColor('#0099ff');

    const buttonRow = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId('addLink')
        .setLabel('Link Ekle')
        .setStyle('PRIMARY'),
      new Discord.MessageButton()
        .setCustomId('removeLink')
        .setLabel('Link Sil')
        .setStyle('PRIMARY'),
      new Discord.MessageButton()
        .setCustomId('showLinks')
        .setLabel('Linkleri Göster')
        .setStyle('PRIMARY')
    );

    message.channel.send({ embeds: [panelEmbed], components: [buttonRow] });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const { customId } = interaction;

  if (customId === 'addLink') {
    const newLink = interaction.user.username; // Burada kullanıcının girdiği linki alabilirsiniz
    const existingLinks = JSON.parse(fs.readFileSync('croxydb.json'));

    if (isValidLink(newLink)) {
      existingLinks.push(newLink);
      fs.writeFileSync('croxydb.json', JSON.stringify(existingLinks));
      interaction.reply('Link eklendi!');
    } else {
      interaction.reply('Geçersiz link! Lütfen doğru formatta bir link ekleyin.');
    }
  } else if (customId === 'removeLink') {
    interaction.reply('Link silme işlemi buraya gelecek');
  } else if (customId === 'showLinks') {
    interaction.reply('Link gösterme işlemi buraya gelecek');
  }
});

setInterval(async () => {
  try {
    const links = JSON.parse(fs.readFileSync('croxydb.json'));

    for (const link of links) {
      if (isValidLink(link)) {
        const response = await axios.get(link);

        // Burada response kontrolü yapabilir ve gerekli aksiyonları alabilirsiniz
        if (response.status === 200) {
          console.log(`${link} erişilebilir.`);
        } else {
          console.log(`${link} erişilemez!`);
          
          // Eğer erişilemezse burada yapılacak işlemleri ekleyebilirsiniz
          // Örneğin, kullanıcıya uyarı mesajı gönderme veya bir log dosyasına kaydetme
        }
      }
    }
  } catch (error) {
    console.error('Link kontrol hatası:', error.message);
  }
}, 30000);

client.login('TOKEN'); // TOKEN kısmını kendi bot tokeninizle değiştirin

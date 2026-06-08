const {
  Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder,
  ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, Events
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", async () => {
  console.log(`Bot online como ${client.user.tag}`);

  const canal = await client.channels.fetch(process.env.CANAL_REGISTRO);

  const botao = new ButtonBuilder()
    .setCustomId("abrir_registro")
    .setLabel("Fazer Registro")
    .setStyle(ButtonStyle.Primary);

  await canal.send({
    content: "📋 **Clique no botão abaixo para fazer seu registro:**",
    components: [new ActionRowBuilder().addComponents(botao)]
  });
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isButton() && interaction.customId === "abrir_registro") {
    const modal = new ModalBuilder()
      .setCustomId("formulario_registro")
      .setTitle("Registro");

    const org = new TextInputBuilder()
      .setCustomId("org")
      .setLabel("Qual organização você quer entrar?")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const id = new TextInputBuilder()
      .setCustomId("id")
      .setLabel("Qual é o seu ID?")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const nome = new TextInputBuilder()
      .setCustomId("nome")
      .setLabel("Qual é o seu nome?")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const patente = new TextInputBuilder()
      .setCustomId("patente")
      .setLabel("Qual é a sua patente?")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(org),
      new ActionRowBuilder().addComponents(id),
      new ActionRowBuilder().addComponents(nome),
      new ActionRowBuilder().addComponents(patente)
    );

    await interaction.showModal(modal);
  }

  if (interaction.isModalSubmit() && interaction.customId === "formulario_registro") {
    const org = interaction.fields.getTextInputValue("org");
    const id = interaction.fields.getTextInputValue("id");
    const nome = interaction.fields.getTextInputValue("nome");
    const patente = interaction.fields.getTextInputValue("patente");

    await interaction.reply({
      content:
`✅ **Registro enviado!**

📌 **Organização:** ${org}
🆔 **ID:** ${id}
👤 **Nome:** ${nome}
🎖️ **Patente:** ${patente}`,
      ephemeral: false
    });
  }
});

client.login(process.env.TOKEN);

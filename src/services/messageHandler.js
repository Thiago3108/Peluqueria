import whatsappService from './whatsappService.js';

class MessageHandler {
  async handleIncomingMessage(message, senderInfo) {
    if (message?.type === 'text') {
      const incomingMessage = message.text.body.toLowerCase().trim();
      
      if (this.isGreeting(incomingMessage)) {
        await this.sendWelcomeMessage(message.from, message.id, senderInfo);
        await this.sendWelcomeMenu(message.from);
      }else{
        const response = `Echo: ${message.text.body}`;
        await whatsappService.sendMessage(message.from, response, message.id);
      }
      await whatsappService.markAsRead(message.id);
    }
  }

  isGreeting(message) {
    const greetings = ['hi', 'hello','que mas', 'que tal', 'oiga mk','buenas tardes','mk', 'buenos dias', 'hey', 'hola', 'ola', 'hallo', 'bonjour', 'ciao', 'namaste', 'salaam', 'konnichiwa', 'ni hao', 'privet', 'shalom', 'merhaba'];
    return greetings.includes(message);
  }

  getSenderName(senderInfo) {
    return senderInfo.profile?.name || senderInfo.wa_id || '';
  }

  async sendWelcomeMessage(to, messageId, senderInfo) {
    const name = this.getSenderName(senderInfo).match(/(\w+)/)?.[1] || "Parce";
    const welcomeMessage = `¡Hola ${name}!, Bienvenido a nuestro servicio de atención al cliente!. ¿En qué puedo ayudarte?`;
    await whatsappService.sendMessage(to, welcomeMessage, messageId);
  }
  async sendWelcomeMenu(to){
    const menuMessage = `Por favor, selecciona una de las siguientes opciones:`
    const buttons = [
      {
        type: 'reply', reply: { id: 'option_1', title: 'Agendar' }
      },
      {
        type: 'reply', reply: { id: 'option_2', title: 'Ubicación' }
      },
      {
        type: 'reply', reply: { id: 'option_3', title: 'Otra cosa' }
      }
    ];

    await whatsappService.sendInteractiveButtons(to, menuMessage, buttons);
  }

}

export default new MessageHandler();
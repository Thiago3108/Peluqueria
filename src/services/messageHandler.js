import whatsappService from './whatsappService.js';

class MessageHandler {
  async handleIncomingMessage(message) {
    if (message?.type === 'text') {
      const incomingMessage = message.text.body.toLowerCase().trim();
      if (this.isGreeting(incomingMessage)) {
        await this.sendWelcomeMessage(message.from, message.id);
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

  async sendWelcomeMessage(to, messageId) {
    const welcomeMessage = "Hola, Bienvenido a nuestro servicio de atención al cliente. ¿En qué puedo ayudarte?";
    await whatsappService.sendMessage(to, welcomeMessage, messageId);
  }

}

export default new MessageHandler();
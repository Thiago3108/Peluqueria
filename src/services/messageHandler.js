import whatsappService from './whatsappService.js';

class MessageHandler {
  async handleIncomingMessage(message, senderInfo) {
    if (message?.type === 'text') {
      const incomingMessage = message.text.body.toLowerCase().trim();
      
      if (this.isGreeting(incomingMessage)) {
  //      await this.sendWelcomeMessage(message.from, message.id, senderInfo);
        await this.sendWelcomeMenu(message.from);
      }//else{
        //const response = `Echo: ${message.text.body}`;
        //await whatsappService.sendMessage(message.from, response, message.id);
      //}
      await whatsappService.markAsRead(message.id);
    } else if (message?.type === 'interactive') {
      const option = message?.interactive?.button_reply?.title.toLowerCase().trim();
      await this.handleMenuOption(message.from, option);
      await whatsappService.markAsRead(message.id);
    }
  }

  isGreeting(message) {
    const greetings = ['agendar', 'ubicación', 'cita','agendar cita', 'ubicacion'];
    return greetings.some(greetings => message.includes(greetings));
  }

  getSenderName(senderInfo) {
    return senderInfo.profile?.name || senderInfo.wa_id || '';
  }

//  async sendWelcomeMessage(to, messageId, senderInfo) {
//    const name = this.getSenderName(senderInfo).match(/(\w+)/)?.[1] || "Parce";
//    const welcomeMessage = `¡Hola ${name}!, Bienvenido a nuestro servicio de atención al cliente!. ¿En qué puedo ayudarte?`;
//    await whatsappService.sendMessage(to, welcomeMessage, messageId);
//  }
  async sendWelcomeMenu(to){
    const menuMessage = `¡Bienvenido/a a [Nombre de la Peluquería]! 💈✂️

Elige la opción que necesitas:`
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

  async handleMenuOption(to, option) {
    let response;
    switch (option) {
      case 'agendar':
        response = `¡Genial! Ya casi terminamos. ✂️💈
        
Para agendar tu cita, solo debes acceder al siguiente enlace y seleccionar la fecha y hora que más te convenga 
        
  🔗 https://forms.gle/w6iZ733bdU2MXjUK8
        
Una vez lo completes, te enviaremos la confirmación. Si tienes alguna duda, escríbenos y te ayudamos. 😉 `;
        break;
      case 'ubicación':
        await this.sendLocation(to);
        break;
      case 'otra cosa':
        response = '¡Claro!, ¿En qué más puedo ayudarte?';
        break;
      default:
        response = 'Lo siento, no entendí tu mensaje. Por favor intenta de nuevo.';
        break;
    }
    await whatsappService.sendMessage(to, response);
  }

  async sendLocation(to) {
    const location = {
      latitude: '7.068851947784424', // Latitud de la peluquería
      longitude: '-73.10446166992188', // Longitud de la peluquería
      name: `7°04'07.9"N 73°06'16.1"W`,
      address: `261 Cl. 33`
    };
  
    await whatsappService.sendLocation(to, location);
  }

}

export default new MessageHandler();
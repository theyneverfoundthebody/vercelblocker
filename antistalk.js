/**
 * @name VercelBlocker
 * @version 1.1.0
 * @author 1da
 * @description Blocks messages containing "vercel.app" or "vercel.com" links and notifies users of invisible messages.
 * @updateURL https://raw.githubusercontent.com/theyneverfoundthebody/vercelblocker/main/antistalk.js
 */

module.exports = class VercelBlocker {
  constructor() {
    this.enabled = false;
  }

  start() {
    this.enabled = true;
    this.bindEventListeners();
    console.log('VercelBlocker plugin started.');
  }

  stop() {
    this.enabled = false;
    this.unbindEventListeners();
    console.log('VercelBlocker plugin stopped.');
  }

  bindEventListeners() {
    document.addEventListener('DOMNodeInserted', this.handleNewMessage.bind(this));
    console.log('Event listeners bound.');
  }

  unbindEventListeners() {
    document.removeEventListener('DOMNodeInserted', this.handleNewMessage.bind(this));
    console.log('Event listeners unbound.');
  }

  handleNewMessage(event) {
    const node = event.target;
    if (node.nodeType === Node.TEXT_NODE && node.parentNode.classList.contains('messageContent')) {
      const messageContent = node.textContent.trim();
      const messageContainer = node.parentNode.parentNode;
      // Check if the message is in a direct message channel
      if (this.isDirectMessageChannel(messageContainer)) {
        console.log('Message received in direct message channel:', messageContent);
        // Check for vercel.app or vercel.com links
        if (messageContent.match(/\bvercel\.app\b|\bvercel\.com\b/i)) {
          // Hide message
          messageContainer.style.display = 'none';
          console.log('Message containing vercel.app/vercel.com link blocked.');
          // Notify users by sending a message to the channel
          const channel = this.getChannelFromMessageContainer(messageContainer);
          if (channel) {
            channel.send(`⚠️ **Warning:** A message containing vercel.app/vercel.com link was blocked by VercelBlocker.`);
          }
        }
        // Check for invisible messages
        if (node.parentNode.classList.contains('message') && node.parentNode.classList.contains('messageInvisible')) {
          console.log('Invisible message detected.');
          // Notify users by sending a message to the channel
          const channel = this.getChannelFromMessageContainer(node.parentNode);
          if (channel) {
            channel.send(`⚠️ **Warning:** An invisible message was detected by VercelBlocker.`);
          }
        }
      }
    }
  }

  isDirectMessageChannel(messageContainer) {
    // Check if the message container represents a direct message channel
    return messageContainer.classList.contains('private');
  }

  getChannelFromMessageContainer(messageContainer) {
    // Extract channel ID from message container
    const channelId = messageContainer.getAttribute('data-channel-id');
    // Find channel element
    const channelElement = document.querySelector(`[data-channel-id="${channelId}"]`);
    // Return channel
    return channelElement ? channelElement.__reactFiber$MemoizedProps.child.memoizedProps.channel : null;
  }
};

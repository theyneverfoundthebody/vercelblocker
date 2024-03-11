/**
 * @name VercelBlocker
 * @version 1.1.0
 * @author 1da
 * @description Blocks messages containing "vercel.app" or "vercel.com" links and notifies users of invisible messages.
 * @updateURL https://raw.githubusercontent.com/YourUsername/YourRepository/master/VercelBlocker.plugin.js
 */

module.exports = class VercelBlocker {
  constructor() {
    this.enabled = false;
  }

  onStart() {
    this.enabled = true;
    this.bindEventListeners();
  }

  onStop() {
    this.enabled = false;
    this.unbindEventListeners();
  }

  bindEventListeners() {
    document.addEventListener('DOMNodeInserted', this.handleNewMessage.bind(this));
  }

  unbindEventListeners() {
    document.removeEventListener('DOMNodeInserted', this.handleNewMessage.bind(this));
  }

  handleNewMessage(event) {
    const node = event.target;
    if (node.nodeType === Node.TEXT_NODE && node.parentNode.classList.contains('messageContent')) {
      const messageContent = node.textContent.trim();
      // Check for vercel.app or vercel.com links
      if (messageContent.match(/\bvercel\.app\b|\bvercel\.com\b/i)) {
        // Hide message
        const messageContainer = node.parentNode.parentNode;
        messageContainer.style.display = 'none';
        // Notify users by sending a message to the channel
        const channel = this.getChannelFromMessageContainer(messageContainer);
        if (channel) {
          channel.send(`⚠️ **Warning:** A message containing vercel.app/vercel.com link was blocked by VercelBlocker.`);
        }
      }
      // Check for invisible messages
      if (node.parentNode.classList.contains('message') && node.parentNode.classList.contains('messageInvisible')) {
        // Notify users by sending a message to the channel
        const channel = this.getChannelFromMessageContainer(node.parentNode);
        if (channel) {
          channel.send(`⚠️ **Warning:** An invisible message was detected by VercelBlocker.`);
        }
      }
    }
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

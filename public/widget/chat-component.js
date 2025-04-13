/**
 * GuestApp Chat Web Component
 * A custom element for embedding the chat widget
 */

class GuestAppChat extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Get attributes with defaults
    const position = this.getAttribute("position") || "bottom-right";
    const primaryColor = this.getAttribute("primary-color") || "#4A6FA5";
    const title = this.getAttribute("title") || "Chat with us";
    const autoOpen = this.hasAttribute("auto-open");
    const hideOnMobile = this.hasAttribute("hide-on-mobile");
    const loadDelay = parseInt(this.getAttribute("load-delay") || "1000", 10);
    const welcomeMessage =
      this.getAttribute("welcome-message") ||
      "Hello! How can I help you today?";
    const offlineMessage =
      this.getAttribute("offline-message") ||
      "We're currently offline. Please leave a message and we'll get back to you.";
    const inputPlaceholder =
      this.getAttribute("input-placeholder") || "Type your message...";
    const showBranding = this.hasAttribute("show-branding");
    const allowAttachments = this.hasAttribute("allow-attachments");
    const enableHistory = this.hasAttribute("enable-history");

    // Create styles
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      .widget-container {
        position: fixed;
        ${position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"}
        ${position.includes("right") ? "right: 20px;" : "left: 20px;"}
        z-index: 9999;
      }
      .chat-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: ${primaryColor};
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;
      }
      .chat-button:hover {
        transform: scale(1.05);
      }
      .chat-container {
        position: absolute;
        ${position.includes("bottom") ? "bottom: 70px;" : "top: 70px;"}
        ${position.includes("right") ? "right: 0;" : "left: 0;"}
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        display: none;
        flex-direction: column;
      }
      .chat-header {
        background-color: ${primaryColor};
        color: white;
        padding: 15px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .chat-close {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
      }
      .chat-body {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        background-color: #f5f5f5;
      }
      .chat-footer {
        padding: 10px;
        border-top: 1px solid #eee;
        display: flex;
      }
      .chat-input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        outline: none;
      }
      .chat-send {
        margin-left: 10px;
        padding: 10px 15px;
        background-color: ${primaryColor};
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .message {
        margin-bottom: 10px;
        max-width: 80%;
        padding: 10px;
        border-radius: 10px;
        clear: both;
      }
      .user-message {
        background-color: ${primaryColor};
        color: white;
        float: right;
      }
      .bot-message {
        background-color: white;
        float: left;
      }
      @media (max-width: 768px) {
        ${hideOnMobile ? ".widget-container { display: none; }" : ""}
        .chat-container {
          width: 300px;
          height: 450px;
        }
      }
    `;

    // Create HTML structure
    this.shadowRoot.innerHTML = `
      ${style.outerHTML}
      <div class="widget-container">
        <div class="chat-container" id="chat-container">
          <div class="chat-header">
            <div>${title}</div>
            <button class="chat-close" id="chat-close">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div class="chat-body" id="chat-body">
            <div class="message bot-message">
              ${welcomeMessage}
            </div>
          </div>
          <div class="chat-footer">
            <input type="text" class="chat-input" id="chat-input" placeholder="${inputPlaceholder}">
            <button class="chat-send" id="chat-send">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
        <button class="chat-button" id="chat-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </button>
      </div>
    `;

    // Get elements
    const chatButton = this.shadowRoot.getElementById("chat-button");
    const chatContainer = this.shadowRoot.getElementById("chat-container");
    const chatClose = this.shadowRoot.getElementById("chat-close");
    const chatInput = this.shadowRoot.getElementById("chat-input");
    const chatSend = this.shadowRoot.getElementById("chat-send");
    const chatBody = this.shadowRoot.getElementById("chat-body");

    // Toggle chat container visibility
    const toggleChat = () => {
      const isVisible = chatContainer.style.display === "flex";
      chatContainer.style.display = isVisible ? "none" : "flex";
      if (!isVisible) {
        chatInput.focus();
      }
    };

    // Send a message
    const sendMessage = () => {
      const message = chatInput.value.trim();
      if (message) {
        // Add user message
        const userMessageElement = document.createElement("div");
        userMessageElement.className = "message user-message";
        userMessageElement.textContent = message;
        chatBody.appendChild(userMessageElement);
        chatInput.value = "";
        chatBody.scrollTop = chatBody.scrollHeight;

        // Dispatch custom event
        this.dispatchEvent(
          new CustomEvent("message-sent", {
            detail: { message, timestamp: new Date().toISOString() },
            bubbles: true,
            composed: true,
          }),
        );

        // Simulate bot response (replace with actual API call)
        setTimeout(() => {
          const botMessageElement = document.createElement("div");
          botMessageElement.className = "message bot-message";
          botMessageElement.textContent =
            "Thank you for your message. Our team will get back to you soon.";
          chatBody.appendChild(botMessageElement);
          chatBody.scrollTop = chatBody.scrollHeight;

          // Dispatch response event
          this.dispatchEvent(
            new CustomEvent("response-received", {
              detail: {
                message: botMessageElement.textContent,
                timestamp: new Date().toISOString(),
              },
              bubbles: true,
              composed: true,
            }),
          );
        }, 1000);
      }
    };

    // Event listeners
    chatButton.addEventListener("click", toggleChat);
    chatClose.addEventListener("click", toggleChat);
    chatSend.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });

    // Auto open if configured
    if (autoOpen) {
      setTimeout(() => {
        chatContainer.style.display = "flex";
      }, loadDelay);
    }
  }

  // Public API methods
  open() {
    const chatContainer = this.shadowRoot.getElementById("chat-container");
    chatContainer.style.display = "flex";
    const chatInput = this.shadowRoot.getElementById("chat-input");
    chatInput.focus();
  }

  close() {
    const chatContainer = this.shadowRoot.getElementById("chat-container");
    chatContainer.style.display = "none";
  }

  sendMessage(message) {
    const chatBody = this.shadowRoot.getElementById("chat-body");
    const botMessageElement = document.createElement("div");
    botMessageElement.className = "message bot-message";
    botMessageElement.textContent = message;
    chatBody.appendChild(botMessageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
}

// Register the custom element
customElements.define("guestapp-chat", GuestAppChat);

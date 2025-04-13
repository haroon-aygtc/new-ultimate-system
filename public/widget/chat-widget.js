/**
 * GuestApp Chat Widget
 * Production-ready implementation for real-world use
 */

(function () {
  // Configuration with defaults
  const defaultConfig = {
    position: "bottom-right",
    primaryColor: "#4A6FA5",
    title: "Chat with us",
    autoOpen: false,
    hideOnMobile: false,
    loadDelay: 1000,
    welcomeMessage: "Hello! How can I help you today?",
    offlineMessage:
      "We're currently offline. Please leave a message and we'll get back to you.",
    inputPlaceholder: "Type your message...",
    showBranding: true,
    allowAttachments: false,
    enableHistory: true,
    apiEndpoint: "/api/chat",
    sessionTimeout: 30,
    requireRegistration: true,
    registrationFields: ["name", "phone"],
    enableAnalytics: true,
  };

  // Merge with user config
  const config = Object.assign({}, defaultConfig, window.GuestAppChat || {});

  // Widget state
  let state = {
    isOpen: false,
    isRegistered: false,
    messages: [],
    userData: {},
    sessionId: null,
  };

  // Create and inject styles
  function createStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .guestapp-widget {
        position: fixed;
        ${config.position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"}
        ${config.position.includes("right") ? "right: 20px;" : "left: 20px;"}
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      
      .guestapp-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: ${config.primaryColor};
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;
      }
      
      .guestapp-button:hover {
        transform: scale(1.05);
      }
      
      .guestapp-window {
        position: absolute;
        ${config.position.includes("bottom") ? "bottom: 70px;" : "top: 70px;"}
        ${config.position.includes("right") ? "right: 0;" : "left: 0;"}
        width: 350px;
        height: 500px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        display: none;
        flex-direction: column;
      }
      
      .guestapp-header {
        background-color: ${config.primaryColor};
        color: white;
        padding: 15px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .guestapp-close {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
      }
      
      .guestapp-messages {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        background-color: #f5f5f5;
      }
      
      .guestapp-message {
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 10px;
        max-width: 80%;
        clear: both;
      }
      
      .guestapp-user {
        background-color: ${config.primaryColor};
        color: white;
        float: right;
      }
      
      .guestapp-system {
        background-color: white;
        float: left;
      }
      
      .guestapp-footer {
        padding: 10px;
        border-top: 1px solid #eee;
        display: flex;
      }
      
      .guestapp-input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        outline: none;
        margin-right: 10px;
      }
      
      .guestapp-send {
        background-color: ${config.primaryColor};
        color: white;
        border: none;
        border-radius: 4px;
        padding: 10px 15px;
        cursor: pointer;
      }
      
      .guestapp-registration {
        padding: 20px;
        background-color: #f9f9f9;
      }
      
      .guestapp-field {
        margin-bottom: 15px;
      }
      
      .guestapp-field label {
        display: block;
        margin-bottom: 5px;
      }
      
      .guestapp-field input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      
      .guestapp-typing {
        display: inline-block;
        padding: 10px;
        background-color: white;
        border-radius: 10px;
        margin-bottom: 10px;
        float: left;
        clear: both;
      }
      
      .guestapp-typing span {
        height: 8px;
        width: 8px;
        float: left;
        margin: 0 1px;
        background-color: #9E9EA1;
        display: block;
        border-radius: 50%;
        opacity: 0.4;
        animation: guestapp-blink 1s infinite;
      }
      
      .guestapp-typing span:nth-of-type(2) {
        animation-delay: 0.2s;
      }
      
      .guestapp-typing span:nth-of-type(3) {
        animation-delay: 0.4s;
      }
      
      @keyframes guestapp-blink {
        50% { opacity: 1; }
      }
      
      .guestapp-branding {
        text-align: center;
        font-size: 11px;
        color: #999;
        padding: 5px;
        opacity: 0.7;
      }

      @media (max-width: 768px) {
        ${config.hideOnMobile ? ".guestapp-widget { display: none; }" : ""}
        .guestapp-window {
          width: 300px;
          height: 450px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Create DOM elements
  function createWidget() {
    // Create container
    const container = document.createElement("div");
    container.className = "guestapp-widget";

    // Create toggle button
    const toggleButton = document.createElement("button");
    toggleButton.className = "guestapp-button";
    toggleButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    toggleButton.addEventListener("click", toggleWidget);

    // Create chat window
    const chatWindow = document.createElement("div");
    chatWindow.className = "guestapp-window";

    // Create header
    const header = document.createElement("div");
    header.className = "guestapp-header";
    header.innerHTML = `
      <div>${config.title}</div>
      <button class="guestapp-close">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;
    header
      .querySelector(".guestapp-close")
      .addEventListener("click", toggleWidget);

    // Create registration form if required
    let registrationForm;
    if (config.requireRegistration) {
      registrationForm = document.createElement("div");
      registrationForm.className = "guestapp-registration";
      registrationForm.id = "guestapp-registration";

      let formHTML = "<h3>Please register to chat</h3>";

      if (config.registrationFields.includes("name")) {
        formHTML += `
          <div class="guestapp-field">
            <label for="guestapp-name">Name</label>
            <input type="text" id="guestapp-name" required>
          </div>
        `;
      }

      if (config.registrationFields.includes("phone")) {
        formHTML += `
          <div class="guestapp-field">
            <label for="guestapp-phone">Phone</label>
            <input type="tel" id="guestapp-phone" required>
          </div>
        `;
      }

      if (config.registrationFields.includes("email")) {
        formHTML += `
          <div class="guestapp-field">
            <label for="guestapp-email">Email</label>
            <input type="email" id="guestapp-email" required>
          </div>
        `;
      }

      formHTML += `<button class="guestapp-send" id="guestapp-register">Start Chat</button>`;
      registrationForm.innerHTML = formHTML;
    }

    // Create messages container
    const messagesContainer = document.createElement("div");
    messagesContainer.className = "guestapp-messages";
    messagesContainer.id = "guestapp-messages";

    // Create footer with input
    const footer = document.createElement("div");
    footer.className = "guestapp-footer";
    footer.innerHTML = `
      <input type="text" class="guestapp-input" placeholder="${config.inputPlaceholder}">
      <button class="guestapp-send">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </button>
    `;

    // Add event listeners
    footer
      .querySelector(".guestapp-input")
      .addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          sendMessage();
        }
      });

    footer
      .querySelector(".guestapp-send")
      .addEventListener("click", sendMessage);

    if (registrationForm) {
      registrationForm
        .querySelector("#guestapp-register")
        .addEventListener("click", registerUser);
    }

    // Add branding if enabled
    if (config.showBranding) {
      const branding = document.createElement("div");
      branding.className = "guestapp-branding";
      branding.textContent = "Powered by GuestApp";
      footer.appendChild(branding);
    }

    // Assemble chat window
    chatWindow.appendChild(header);
    if (registrationForm) {
      chatWindow.appendChild(registrationForm);
    }
    chatWindow.appendChild(messagesContainer);
    chatWindow.appendChild(footer);

    // Add elements to container
    container.appendChild(chatWindow);
    container.appendChild(toggleButton);

    // Add container to document
    document.body.appendChild(container);

    // Add welcome message
    addMessage("system", config.welcomeMessage);

    // Load session data
    loadSession();
  }

  // Toggle widget visibility
  function toggleWidget() {
    const chatWindow = document.querySelector(".guestapp-window");
    const toggleButton = document.querySelector(".guestapp-button");

    state.isOpen = !state.isOpen;

    if (state.isOpen) {
      chatWindow.style.display = "flex";
      toggleButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      document.querySelector(".guestapp-input").focus();

      // Track widget open in analytics
      if (config.enableAnalytics) {
        trackEvent("widget_open");
      }
    } else {
      chatWindow.style.display = "none";
      toggleButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';

      // Track widget close in analytics
      if (config.enableAnalytics) {
        trackEvent("widget_close");
      }
    }
  }

  // Register user
  function registerUser() {
    const userData = {};
    let isValid = true;

    // Validate and collect form data
    config.registrationFields.forEach((field) => {
      const input = document.getElementById("guestapp-" + field);
      if (input && input.value.trim()) {
        userData[field] = input.value.trim();
      } else if (input) {
        isValid = false;
        input.style.borderColor = "red";
      }
    });

    if (!isValid) return;

    // Save user data
    state.userData = userData;
    state.isRegistered = true;
    state.sessionId = generateSessionId();

    // Hide registration form, show chat
    document.getElementById("guestapp-registration").style.display = "none";
    document.getElementById("guestapp-messages").style.display = "block";
    document.querySelector(".guestapp-input").focus();

    // Track registration in analytics
    if (config.enableAnalytics) {
      trackEvent("user_registered", userData);
    }

    // Save session
    saveSession();
  }

  // Send message
  function sendMessage() {
    // Check if user is registered if required
    if (config.requireRegistration && !state.isRegistered) {
      return;
    }

    const inputField = document.querySelector(".guestapp-input");
    const message = inputField.value.trim();

    if (!message) return;

    // Clear input
    inputField.value = "";

    // Add message to UI
    addMessage("user", message);

    // Show typing indicator
    showTypingIndicator();

    // Prepare API request data
    const requestData = {
      message: message,
      sessionId: state.sessionId,
      userData: state.userData,
    };

    // Send to API if endpoint provided, otherwise simulate response
    if (config.apiEndpoint) {
      fetch(config.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then((data) => {
          hideTypingIndicator();
          addMessage(
            "system",
            data.message ||
              "Thank you for your message. Our team will get back to you soon.",
          );

          // Track message in analytics
          if (config.enableAnalytics) {
            trackEvent("message_sent", { message });
          }
        })
        .catch((error) => {
          console.error("Error sending message:", error);
          hideTypingIndicator();
          addMessage(
            "system",
            "Sorry, there was an error sending your message. Please try again.",
          );
        });
    } else {
      // Simulate response
      setTimeout(() => {
        hideTypingIndicator();
        addMessage(
          "system",
          "Thank you for your message. Our team will get back to you soon.",
        );

        // Track message in analytics
        if (config.enableAnalytics) {
          trackEvent("message_sent", { message });
        }
      }, 1000);
    }
  }

  // Add message to UI
  function addMessage(sender, text) {
    const messagesContainer = document.getElementById("guestapp-messages");

    const messageElement = document.createElement("div");
    messageElement.className = `guestapp-message guestapp-${sender}`;
    messageElement.textContent = text;

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Save message if history enabled
    if (config.enableHistory) {
      state.messages.push({
        sender,
        text,
        timestamp: new Date().toISOString(),
      });
      saveSession();
    }
  }

  // Show typing indicator
  function showTypingIndicator() {
    const messagesContainer = document.getElementById("guestapp-messages");

    // Remove existing indicator if any
    hideTypingIndicator();

    const typingElement = document.createElement("div");
    typingElement.id = "guestapp-typing";
    typingElement.className = "guestapp-typing";
    typingElement.innerHTML = "<span></span><span></span><span></span>";

    messagesContainer.appendChild(typingElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Hide typing indicator
  function hideTypingIndicator() {
    const indicator = document.getElementById("guestapp-typing");
    if (indicator) {
      indicator.remove();
    }
  }

  // Generate unique session ID
  function generateSessionId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }

  // Save session to localStorage
  function saveSession() {
    if (!config.enableHistory) return;

    try {
      localStorage.setItem(
        "guestapp-session",
        JSON.stringify({
          userData: state.userData,
          isRegistered: state.isRegistered,
          messages: state.messages,
          sessionId: state.sessionId,
          lastActive: new Date().toISOString(),
        }),
      );
    } catch (e) {
      console.error("Error saving session:", e);
    }
  }

  // Load session from localStorage
  function loadSession() {
    if (!config.enableHistory) return;

    try {
      const savedSession = localStorage.getItem("guestapp-session");
      if (savedSession) {
        const session = JSON.parse(savedSession);

        // Check if session is expired
        const lastActive = new Date(session.lastActive);
        const now = new Date();
        const diffMinutes = (now - lastActive) / (1000 * 60);

        if (diffMinutes > config.sessionTimeout) {
          // Session expired, clear it
          localStorage.removeItem("guestapp-session");
          return;
        }

        // Restore session
        state.userData = session.userData || {};
        state.isRegistered = session.isRegistered || false;
        state.sessionId = session.sessionId || generateSessionId();
        state.messages = session.messages || [];

        // If registered, hide registration form
        if (
          state.isRegistered &&
          document.getElementById("guestapp-registration")
        ) {
          document.getElementById("guestapp-registration").style.display =
            "none";
          document.getElementById("guestapp-messages").style.display = "block";
        }

        // Display messages
        const messagesContainer = document.getElementById("guestapp-messages");
        messagesContainer.innerHTML = ""; // Clear default welcome message

        state.messages.forEach((msg) => {
          const messageElement = document.createElement("div");
          messageElement.className = `guestapp-message guestapp-${msg.sender}`;
          messageElement.textContent = msg.text;
          messagesContainer.appendChild(messageElement);
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Update last active time
        saveSession();
      }
    } catch (e) {
      console.error("Error loading session:", e);
    }
  }

  // Track analytics events
  function trackEvent(eventName, data = {}) {
    if (!config.enableAnalytics) return;

    const eventData = {
      event: eventName,
      timestamp: new Date().toISOString(),
      sessionId: state.sessionId,
      userData: state.userData,
      url: window.location.href,
      ...data,
    };

    // Send to analytics endpoint if provided
    if (config.apiEndpoint) {
      try {
        fetch(`${config.apiEndpoint}/analytics`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        }).catch((err) => console.error("Error sending analytics:", err));
      } catch (e) {
        console.error("Error sending analytics:", e);
      }
    }
  }

  // Initialize widget
  function init() {
    createStyles();
    createWidget();

    // Auto open if configured
    if (config.autoOpen) {
      setTimeout(function () {
        toggleWidget();
      }, config.loadDelay);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

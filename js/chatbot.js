class Chatbot {
    constructor() {
        this.elements = {
            prompt: document.querySelector('#prompt'),
            submitBtn: document.querySelector('#submit'),
            chatContainer: document.querySelector('.chat-container'),
            imageBtn: document.querySelector('#image'),
            imagePreview: document.querySelector('#image img'),
            imageInput: document.querySelector('#image input')
        };

        this.userState = {
            message: null,
            file: { mime_type: null, data: null }
        };

        this.api = new GeminiAPI();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.elements.prompt.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.elements.prompt.value.trim()) {
                this.handleUserMessage(this.elements.prompt.value.trim());
            }
        });

        this.elements.submitBtn.addEventListener('click', () => {
            if (this.elements.prompt.value.trim()) {
                this.handleUserMessage(this.elements.prompt.value.trim());
            }
        });

        this.elements.imageInput.addEventListener('change', () => {
            this.handleImageUpload();
        });

        this.elements.imageBtn.addEventListener('click', () => {
            this.elements.imageInput.click();
        });
    }

    async handleImageUpload() {
        const file = this.elements.imageInput.files[0];
        if (!file) return;

        try {
            this.userState.file = await Utils.readFileAsBase64(file);
            this.elements.imagePreview.src = `data:${this.userState.file.mime_type};base64,${this.userState.file.data}`;
            this.elements.imagePreview.classList.add('choose');
        } catch (error) {
            console.error('Failed to process image:', error);
            this.resetImageState();
        }
    }

    handleUserMessage(message) {
        this.userState.message = message;

        const userChatHTML = Utils.generateUserChatHTML(message, this.userState.file);
        const userChatBox = Utils.createChatBox(userChatHTML, 'user-chat-box');

        this.elements.chatContainer.appendChild(userChatBox);
        this.elements.prompt.value = '';

        Utils.smoothScrollToBottom(this.elements.chatContainer);

        setTimeout(() => {
            this.generateAIResponse();
        }, CONFIG.UI.RESPONSE_DELAY);
    }

    async generateAIResponse() {
        const aiChatHTML = Utils.generateAIChatHTML(true);
        const aiChatBox = Utils.createChatBox(aiChatHTML, 'ai-chat-box');
        this.elements.chatContainer.appendChild(aiChatBox);

        const aiTextArea = aiChatBox.querySelector('.ai-chat-area');

        try {
            const rawResponse = await this.api.generateContent(
                this.userState.message,
                this.userState.file
            );

            const formattedResponse = Utils.formatMarkdown(rawResponse);
            aiTextArea.innerHTML = formattedResponse;

        } catch (error) {
            console.error('API Error:', error);
            aiTextArea.innerHTML = `Error: ${error.message}`;
        } finally {
            Utils.smoothScrollToBottom(this.elements.chatContainer);
            this.resetImageState();
        }
    }

    resetImageState() {
        this.elements.imagePreview.src = CONFIG.ASSETS.IMAGE_ICON;
        this.elements.imagePreview.classList.remove('choose');
        this.userState.file = { mime_type: null, data: null };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});

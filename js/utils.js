const Utils = {
    formatMarkdown(text) {
        let formatted = text;

        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');

        formatted = formatted.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        formatted = formatted.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        formatted = formatted.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

        formatted = formatted.replace(/^\* (.*$)/gim, '<li>$1</li>');
        formatted = formatted.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

        formatted = formatted.replace(/(<li>.*<\/li>)/s, (match) => {
            return '<ul>' + match + '</ul>';
        });

        formatted = formatted.replace(/\n\n/g, '</p><p>');
        formatted = '<p>' + formatted + '</p>';

        formatted = formatted.replace(/<p><\/p>/g, '');
        formatted = formatted.replace(/<p>(<h[123]>)/g, '$1');
        formatted = formatted.replace(/(<\/h[123]>)<\/p>/g, '$1');
        formatted = formatted.replace(/<p>(<ul>)/g, '$1');
        formatted = formatted.replace(/(<\/ul>)<\/p>/g, '$1');
        formatted = formatted.replace(/<p>(<pre>)/g, '$1');
        formatted = formatted.replace(/(<\/pre>)<\/p>/g, '$1');

        return formatted.trim();
    },

    createChatBox(html, className) {
        const div = document.createElement('div');
        div.innerHTML = html;
        div.classList.add(className);
        return div;
    },

    smoothScrollToBottom(container) {
        container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
        });
    },

    readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                const base64String = event.target.result.split(',')[1];
                resolve({
                    mime_type: file.type,
                    data: base64String
                });
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    },

    generateUserChatHTML(message, imageFile = null) {
        const imageHTML = imageFile.data
            ? `<img src="data:${imageFile.mime_type};base64,${imageFile.data}" class="chooseimg" alt="Uploaded image"/>`
            : '';

        return `
            <img src="${CONFIG.ASSETS.USER_AVATAR}" alt="User" id="userImage" width="${CONFIG.UI.AVATAR_SIZE_USER}">
            <div class="user-chat-area">
                ${message}
                ${imageHTML}
            </div>
        `;
    },

    generateAIChatHTML(isLoading = true) {
        const content = isLoading
            ? `<img src="${CONFIG.ASSETS.LOADING}" alt="Loading" class="load" width="${CONFIG.UI.LOADING_SIZE}">`
            : '';

        return `
            <img src="${CONFIG.ASSETS.AI_AVATAR}" alt="AI" id="aiImage" width="${CONFIG.UI.AVATAR_SIZE_AI}">
            <div class="ai-chat-area">
                ${content}
            </div>
        `;
    }
};

Object.freeze(Utils);

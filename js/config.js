const CONFIG = {
    API: {
        KEY: 'AIzaSyBk8LNS7BfQYz9tl5sthmiXQ99chSxFu1o',
        MODEL: 'gemini-2.5-flash-lite',
        BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models'
    },

    ASSETS: {
        AI_AVATAR: 'images/ai.png',
        USER_AVATAR: 'images/user.png',
        LOADING: 'images/loading.webp',
        IMAGE_ICON: 'images/img.svg',
        SUBMIT_ICON: 'images/submit.svg'
    },

    UI: {
        RESPONSE_DELAY: 600,
        AVATAR_SIZE_AI: '10%',
        AVATAR_SIZE_USER: '8%',
        LOADING_SIZE: '50px'
    },

    getApiUrl() {
        return `${this.API.BASE_URL}/${this.API.MODEL}:generateContent?key=${this.API.KEY}`;
    }
};

Object.freeze(CONFIG);

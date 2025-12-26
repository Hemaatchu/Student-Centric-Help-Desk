class GeminiAPI {
    constructor() {
        this.apiUrl = CONFIG.getApiUrl();
    }

    buildRequestBody(message, imageFile = null) {
        const parts = [{ text: message }];

        if (imageFile && imageFile.data) {
            parts.push({ inline_data: imageFile });
        }

        return {
            contents: [{ parts }]
        };
    }

    async generateContent(message, imageFile = null) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.buildRequestBody(message, imageFile))
        };

        const response = await fetch(this.apiUrl, requestOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to generate response');
        }

        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid response format from API');
        }

        return data.candidates[0].content.parts[0].text;
    }
}

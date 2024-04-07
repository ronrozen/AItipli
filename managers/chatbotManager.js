import axios from 'axios'
import Cookie from 'js-cookie';

const endpoint = "https://college-chatbot-f9f3cef69f53.herokuapp.com/"
//const endpoint = "http://localhost:8090/"
const headers = {
    'Content-Type': 'application/json',
    'Authorization': Cookie.get('authToken')
    //'x-api-key': process.env.REACT_API_KEY
}

export async function createChatbot() {
    let response = await axios.get(endpoint + "create_chatbot", { headers: headers });

    if (response) {
        return response.data.response;
    }
}

export async function getChatbot() {
    let response = await axios.get(endpoint + "get_chatbot", { headers: headers });

    if (response) {
        return response.data.response;
    }
}

export async function updateChatbot(model, prompt, frequency_penalty, presence_penalty, temperature, open_ai_key) {
    let response = await axios.post(endpoint + "update_chatbot",
        { model, prompt, frequency_penalty, presence_penalty, temperature, open_ai_key },
        { headers: headers });

    if (response) {
        return response.data.response;
    }
}
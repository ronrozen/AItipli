import axios from 'axios'

const endpoint = "https://college-chatbot-f9f3cef69f53.herokuapp.com/"
//const endpoint = "http://localhost:3000/"
const headers = {
    'Content-Type': 'application/json',
    //'x-api-key': process.env.REACT_API_KEY
}

export async function logIn(email, password) {
    let response = await axios.post(endpoint + "login",
        {
            "email": email,
            "password": password,
        }, { headers: headers });

    if (response) {
        return response.data.response;
    }
}
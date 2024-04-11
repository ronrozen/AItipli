import Cookie from 'js-cookie';
import axios from 'axios'

const endpoint = "https://college-chatbot-f9f3cef69f53.herokuapp.com/"
//const endpoint = "http://localhost:8090/"
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

export async function getUser() {
    let response = await axios.get(endpoint + "get_user", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': Cookie.get('authToken')
        }
    });

    if (response) {
        return response.data.response;
    }
}

export async function getColleges() {
    let response = await axios.get(endpoint + "get_colleges", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': Cookie.get('authToken')
        }
    });

    if (response) {
        return response.data.response;
    }
}

export async function resetPassword(email, password) {
    let response = await axios.post(endpoint + "reset_password",
        {
            "email": email,
            "password": password
        }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': Cookie.get('authToken')
        }
    });

    if (response) {
        return response.data.response;
    }
}

export async function createCollege(email, password) {
    let response = await axios.post(endpoint + "create_college",
        {
            "email": email,
            "password": password
        }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': Cookie.get('authToken')
        }
    });

    if (response) {
        console.log(response)
        return response.data.response;
    }
}
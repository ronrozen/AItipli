import axios from 'axios'
import Cookie from 'js-cookie';

const endpoint = "https://college-chatbot-f9f3cef69f53.herokuapp.com/"
//const endpoint = "http://localhost:3000/"
const headers = {
    'Content-Type': 'application/json',
    'Authorization': Cookie.get('authToken')
    //'x-api-key': process.env.REACT_API_KEY
}

export async function retrieveDocuments() {
    let response = await axios.get(endpoint + "get_documents",
        { headers: headers });

    if (response) {
        return response.data.response;
    }
}

export async function uploadDocument(document) {
    const formData = new FormData();
    formData.append('document', document);
    formData.append('name', document.name);

    let response = await axios.post(endpoint + "upload", formData, {
        headers: {
            'Authorization': Cookie.get('authToken')
        }
    });

    if (response) {
        return response.data.response;
    }
}


export async function removeDocument(documentName) {
    console.log(headers)
    let response = await axios.post(endpoint + "remove_document", {
        "documentName": documentName
    }, { headers: headers });

    if (response) {
        return response.data;
    }
}
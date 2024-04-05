import axios from 'axios'
import Cookie from 'js-cookie';

const endpoint = "https://college-chatbot-f9f3cef69f53.herokuapp.com/"
//const endpoint = "http://localhost:8090/"
const headers = {
    'Content-Type': 'application/json',
    'Authorization': Cookie.get('authToken')
    //'x-api-key': process.env.REACT_API_KEY
}

export async function retrieveFolders() {
    let response = await axios.get(endpoint + "get_folders", { headers: headers });

    if (response) {
        return response.data.response;
    }
}

export async function retrieveDocuments(folder_id) {
    let response = await axios.post(endpoint + "get_documents", {
        "folder_id": folder_id
    }, { headers: headers });

    if (response) {
        return response.data.response;
    }
}

export async function newFolder(name) {
    let response = await axios.post(endpoint + "new_folder", {
        "name": name
    }, { headers: headers });

    if (response) {
        return response.data.response.data;
    }
}

export async function removeFolder(folder_id) {
    let response = await axios.post(endpoint + "remove_folder", {
        "folder_id": folder_id
    }, { headers: headers });

    if (response) {
        return response.data;
    }
}

export async function uploadDocument(document, folder_id) {
    const formData = new FormData();
    formData.append('document', document);
    formData.append('name', document.name);
    formData.append('folder_id', folder_id);

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
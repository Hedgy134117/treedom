import { authAPI, treeAPI } from '../api.js';

let username = 'user';
let password = 'pass';
let id;

function login() {
    authAPI.login(username, password).then(data => id = data.id);
}

function loadTrees() {
    treeAPI.treeList(username, password).then(data => {
        let assigned = [];
        let created = [];
        for (let i in data) {
            if (data[i].user == id) {
                assigned.push(data[i]);
            }
            if (data[i].creator == id) {
                created.push(data[i]);
            }
        }

        const assignedCon = document.querySelector('.assigned .container .boxes');
        for (let i = 0; i < assigned.length; i++) {
            const tree = assigned[i];
            assignedCon.insertAdjacentHTML('beforeend', DOMCreateTree(true, tree.id, tree.name, tree.creator));
        }
        const createdCon = document.querySelector('.created .container .boxes');
        for (let i = 0; i < created.length; i++) {
            const tree = created[i];
            createdCon.insertAdjacentHTML('beforeend', DOMCreateTree(false, tree.id, tree.name, tree.user));
        }

        return;
    })
}

function DOMCreateTree(assigned, id, name, user) {
    let text = assigned ? 'Assigned to:' : 'Created by:';
    return `
    <div class="treeBox" onclick="window.location = '../tree/index.html?id=${id}';">
        <p class="treeBox__title">${name}</p>
        <p class="treeBox__text">${text} ${user}</p>
    </div>
    `;
}

function loadUsersIntoPopup() {
    authAPI.userList().then(data => {
        let list = document.querySelector('.popup select');
        for (let i in data) {
            list.insertAdjacentHTML('beforeend', `
            <option value=${data[i].id}>${data[i].username}</option>
            `)
        }
    });
}

function openPopup() {
    document.querySelector('#overlay').style.display = 'block';
    document.querySelector('.popup').style.display = 'block';
}

function closePopup() {
    document.querySelector('#overlay').style.display = 'none';
    document.querySelector('.popup').style.display = 'none';
}

window.addEventListener('load', () => {
    login();
    loadTrees();
    loadUsersIntoPopup();

    document.querySelector('.treeBox').addEventListener('click', openPopup);

    document.querySelector('#overlay').addEventListener('click', closePopup);

    let form = document.querySelector('.popup form');
    form.onsubmit = async (e) => {
        e.preventDefault();
        let data = new FormData(document.querySelector('.popup form'));
        let name = data.get('name');
        let user = data.get('user');
        await treeAPI.createTree(username, password, name, user).then(data => {
            const assignedCon = document.querySelector('.assigned .container .boxes');
            const createdCon = document.querySelector('.created .container .boxes');
            if (data.user == data.creator) {
                assignedCon.insertAdjacentHTML('beforeend', DOMCreateTree(true, data.id, data.name, data.creator));
                createdCon.insertAdjacentHTML('beforeend', DOMCreateTree(false, data.id, data.name, data.user));
            }
            else {
                createdCon.insertAdjacentHTML('beforeend', DOMCreateTree(false, data.id, data.name, data.user));
            }

            form.reset();
            closePopup();
        });
    }
})
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
            assignedCon.insertAdjacentHTML('beforeend', `
            <div class="treeBox" onclick="window.location = '../tree/index.html?id=${tree.id}';">
                <p class="treeBox__title">${tree.name}</p>
                <p class="treeBox__text">Created by: ${tree.creator}</p>
            </div>
            `);
        }
        const createdCon = document.querySelector('.created .container .boxes');
        for (let i = 0; i < created.length; i++) {
            const tree = created[i];
            createdCon.insertAdjacentHTML('beforeend', `
            <div class="treeBox" onclick="window.location = '../tree/index.html?id=${tree.id}';">
                <p class="treeBox__title">${tree.name}</p>
                <p class="treeBox__text">Assigned to: ${tree.user}</p>
            </div>
            `);
        }

        return;
    })
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

window.addEventListener('load', () => {
    login();
    loadTrees();
    loadUsersIntoPopup();

    document.querySelector('.treeBox').addEventListener('click', () => {
        document.querySelector('#overlay').style.display = 'block';
        document.querySelector('.popup').style.display = 'block';
    });

    document.querySelector('#overlay').addEventListener('click', () => {
        document.querySelector('#overlay').style.display = 'none';
        document.querySelector('.popup').style.display = 'none';
    });
})
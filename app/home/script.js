import { authAPI, treeAPI } from '../api.js';

let username = window.localStorage.getItem('td-username');
let password = window.localStorage.getItem('td-password');
let id;
let inVoid;
let voidAdmin;
let users = {};

async function login() {
    await authAPI.login(username, password).then(data => {
        id = data.id;
        inVoid = data.inVoid;
        voidAdmin = data.voidAdmin;
    });
}

// load users into an object, users[id] = username
async function loadUsers() {
    await authAPI.userList().then(data => {
        for (let i in data) {
            users[data[i].id] = data[i].username;
        }
    });
}

// get all the trees, and then add the html based on whether they were assigned to user or created by user
async function loadTrees() {
    await treeAPI.treeList(username, password).then(data => {
        let assigned = [];
        let created = [];
        for (let i in data) {
            if (username == 'admin') {
                assigned.push(data[i]);
            }
            if (data[i].user == id) {
                assigned.push(data[i]);
            }
            if (data[i].creator == id) {
                created.push(data[i]);
            }
        }

        for (let i = 0; i < assigned.length; i++) {
            const tree = assigned[i];
            DOMCreateTree(true, tree.id, tree.name, tree.creator)
        }

        for (let i = 0; i < created.length; i++) {
            const tree = created[i];
            DOMCreateTree(false, tree.id, tree.name, tree.user);
        }
    })
}

// get all the users and put them in the option list for users in the popup
async function loadUsersIntoPopup() {
    await authAPI.userList().then(data => {
        let lists = document.querySelectorAll('.popup select');
        for (let i in data) {
            for (const list of lists) {
                list.insertAdjacentHTML('beforeend', `
                <option value=${data[i].id}>${data[i].username}</option>
                `)
            }
        }
    });
}


function createTree(e) {
    e.preventDefault();
    let form = document.querySelector('.new form');
    let data = new FormData(form);
    let name = data.get('name');
    let user = data.get('user');
    treeAPI.createTree(username, password, name, user).then(data => {
        if (data.user == data.creator) {
            DOMCreateTree(true, data.id, data.name, data.creator)
            DOMCreateTree(false, data.id, data.name, data.user)
        }
        else {
            DOMCreateTree(false, data.id, data.name, data.user)
        }

        form.reset();
        closePopup();
    });
}

function editTree(e) {
    e.preventDefault();
    let form = document.querySelector('.edit form');
    let data = new FormData(form);
    let id = form.getAttribute('data-id');
    let name = data.get('name');
    let user = data.get('user');
    let editData = { 'name': name, 'user': user };
    treeAPI.editTree(username, password, id, editData).then(d => {
        document.querySelectorAll(`.treeBox[data-id="${id}"]`).forEach(box => {
            box.querySelector('.treeBox__title').innerText = name;
            box.querySelector('.treeBox__text').innerText = box.querySelector('.treeBox__text').innerText.split(':')[0] + `: ${users[user]}`;
        });

        form.reset();
        closePopup();
    });
}


// create a tree box in the specific container with data
let assignedCon;
let createdCon;
function DOMCreateTree(assigned, id, name, user) {
    if (assigned) {
        assignedCon.insertAdjacentHTML('beforeend', `
        <div class="treeBox" onclick="window.open('../tree/index.html?id=${id}', '_blank');" data-id="${id}">
            <p class="treeBox__title">${name}</p>
            <p class="treeBox__text">Created by: ${users[user]}</p>
        </div>
        `);
    }
    else {
        createdCon.insertAdjacentHTML('beforeend', `
        <div class="treeBox treeBox-created" onclick="window.open('../tree/index.html?id=${id}', '_blank');" data-id="${id}">
            <p class="treeBox__title">${name}</p>
            <p class="treeBox__text">Assigned to: ${users[user]}</p>
            <button class="treeBox__button">Edit</button>
        </div>
        `);
        document.querySelector(`.treeBox-created[data-id="${id}"] button`).addEventListener('click', (e) => {
            e.stopPropagation();
            openEditPopup(id, name, user);
        });
    }
}

function openNewPopup() {
    document.querySelector('#overlay').style.display = 'block';
    document.querySelector('.popup.new').style.display = 'block';
}

function openEditPopup(id, name, user) {
    document.querySelector('#overlay').style.display = 'block';
    document.querySelector('.popup.edit').style.display = 'block';
    document.querySelector('.popup.edit form').setAttribute('data-id', id);
    document.querySelector('.popup.edit input[name="name"]').value = name;
    document.querySelector('.popup.edit select[name="user"]').value = user;
}

function closePopup() {
    document.querySelector('#overlay').style.display = 'none';
    document.querySelectorAll('.popup').forEach(popup => popup.style.display = 'none');
}

function addVoidToNav() {
    if (inVoid) {
        document.querySelector("nav").innerHTML += `
        <a href="../${voidAdmin ? `vAdmin` : `vHome`}/index.html">
            <i class="bi bi-door-open"></i>
        </a>
        `;
    }
}

async function loadPage() {
    await login();
    addVoidToNav();
    await loadUsers();
    await loadTrees();
    await loadUsersIntoPopup();
}

window.addEventListener('load', () => {
    // API things for when the page loads
    loadPage();

    // event listeners for the popup (open / close)
    document.querySelector('.treeBox').addEventListener('click', openNewPopup);
    document.querySelector('#overlay').addEventListener('click', closePopup);

    // get the containers for functions
    assignedCon = document.querySelector('.assigned .container .boxes');
    createdCon = document.querySelector('.created .container .boxes');

    // form submit 
    let createTreeForm = document.querySelector('.new form');
    createTreeForm.onsubmit = (e) => createTree(e);
    let editTreeForm = document.querySelector('.edit form');
    editTreeForm.onsubmit = (e) => editTree(e);
})
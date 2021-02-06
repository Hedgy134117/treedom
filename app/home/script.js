import { authAPI, treeAPI } from '../api.js';

let username = window.localStorage.getItem('td-username');
let password = window.localStorage.getItem('td-password');
let id;
let users = {};

async function login() {
    await authAPI.login(username, password).then(data => {
        console.log('1 logged in');
        id = data.id
    });
}

// load users into an object, users[id] = username
async function loadUsers() {
    await authAPI.userList().then(data => {
        console.log('2 loaded users');
        for (let i in data) {
            users[data[i].id] = data[i].username;
        }
    });
}

// get all the trees, and then add the html based on whether they were assigned to user or created by user
async function loadTrees() {
    await treeAPI.treeList(username, password).then(data => {
        console.log('3 added trees');
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

// create a tree box in the specific container with data
let assignedCon;
let createdCon;
function DOMCreateTree(assigned, id, name, user) {
    if (assigned) {
        assignedCon.insertAdjacentHTML('beforeend', `
        <div class="treeBox" onclick="window.location = '../tree/index.html?id=${id}';">
            <p class="treeBox__title">${name}</p>
            <p class="treeBox__text">Created by: ${users[user]}</p>
        </div>
        `);
    }
    else {
        createdCon.insertAdjacentHTML('beforeend', `
        <div class="treeBox" onclick="window.location = '../tree/index.html?id=${id}';">
            <p class="treeBox__title">${name}</p>
            <p class="treeBox__text">Assigned to: ${users[user]}</p>
        </div>
        `);
    }
}

// get all the useres and put them in the option list for users in the popup
async function loadUsersIntoPopup() {
    await authAPI.userList().then(data => {
        console.log('4 loaded popup');
        let list = document.querySelector('.popup select');
        for (let i in data) {
            list.insertAdjacentHTML('beforeend', `
            <option value=${data[i].id}>${data[i].username}</option>
            `)
        }
        return 1;

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

async function loadPage() {
    await login();
    await loadUsers();
    await loadTrees();
    await loadUsersIntoPopup();
}

window.addEventListener('load', () => {
    // API things for when the page loads
    loadPage();

    // event listeners for the popup (open / close)
    document.querySelector('.treeBox').addEventListener('click', openPopup);
    document.querySelector('#overlay').addEventListener('click', closePopup);

    // get the containers for functions
    assignedCon = document.querySelector('.assigned .container .boxes');
    createdCon = document.querySelector('.created .container .boxes');

    // get the form data and create a new tree from it
    let form = document.querySelector('.popup form');
    form.onsubmit = async (e) => {
        e.preventDefault();
        let data = new FormData(document.querySelector('.popup form'));
        let name = data.get('name');
        let user = data.get('user');
        await treeAPI.createTree(username, password, name, user).then(data => {
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
})
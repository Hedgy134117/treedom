import { authAPI, vTreeAPI, vNodeAPI, treeAPI } from '../api.js';

let username = window.localStorage.getItem('td-username');
let password = window.localStorage.getItem('td-password');
let users = {};
let id;
let treeId;
let treeApi = new vTreeAPI("", "");
let nodeApi = new vNodeAPI("", "");

async function login() {
    let data = await authAPI.login(username, password);
    id = data.id;
    treeApi = new vTreeAPI(username, password);
    nodeApi = new vNodeAPI(username, password);
}

async function loadUsers() {
    let data = await authAPI.userList();
    for (let i in data) {
        users[data[i].id] = data[i].username;
    }
}

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

function resetTree() {
    const treeCon = document.querySelector('.trees');
    treeCon.innerHTML = '';
}

async function loadTree() {
    const urlParams = new URLSearchParams(window.location.search);
    treeId = urlParams.get('id');

    const treeCon = document.querySelector('.trees');
    resetTree();
    treeApi.treeDetail(treeId).then(data => {
        let html = ``;
        // we don't question this function
        function traverse(root) {
            html += `<li>`;

            // what to do with each element
            html += `<div class="tf-nc" data-id="${root.id}" data-users="${root.users}">
                <p class="tf-nc__name">${root.name}</p>
                <p class="tf-nc__desc">${root.desc}</p>
                <button class="tf-nc__add">Add</button>
                <button class="tf-nc__edit">Edit</button>
            </div>`;

            // actually makes a tree
            if (root.voidnode_set.length > 0) {
                html += `<ul>`;
            }
            for (const node of root.voidnode_set) { // will only run if node has children
                traverse(node);
            }
            if (root.voidnode_set.length > 0) {
                html += `</ul>`;
            }

            html += `</li>`;
        }

        for (const node of data.voidnode_set) {
            html += `<div class="tf-tree tf-custom"><ul>`;
            traverse(node);
            html += `</div></ul>`
        }

        treeCon.innerHTML = html;

        // add button events to each node
        for (const node of treeCon.querySelectorAll('.tf-nc')) {
            let nodeId = node.getAttribute('data-id');
            let name = node.querySelector(".tf-nc__name").innerText;
            let desc = node.querySelector(".tf-nc__desc").innerText;
            let users = node.getAttribute('data-users').split(",");
            node.querySelector('.tf-nc__add').addEventListener('click', () => openAddPopup(nodeId));
            node.querySelector('.tf-nc__edit').addEventListener('click', () => openEditPopup(nodeId, name, desc, users));
        }
    });
}

function openAddPopup(id) {
    document.querySelector('#overlay').style.display = 'block';
    document.querySelector('.popup.popup__add').style.display = 'block';
    document.querySelector('.popup.popup__add form').setAttribute('data-id', id);
}

async function addNode(e) {
    e.preventDefault();
    let form = document.querySelector('.popup.popup__add form');
    let data = new FormData(form);
    let name = data.get('name');
    let desc = data.get('desc');
    let users = [];
    for (let user of form.querySelectorAll("option")) {
        if (user.selected) {
            users.push(user.value);
        }
    }
    console.log(users);
    let parentId = form.getAttribute('data-id');
    await nodeApi.addNode(treeId, desc, parentId, name, users);
    loadTree();
    form.reset();
    closePopup();
}

function openEditPopup(id, name, desc, users) {
    document.querySelector('#overlay').style.display = 'block';
    document.querySelector('.popup.edit').style.display = 'block';
    document.querySelector('.popup.edit form').setAttribute('data-id', id);
    document.querySelector('.popup.edit input[name="name"]').value = name;
    document.querySelector('.popup.edit input[name="desc"]').value = desc;
    let usersDOM = document.querySelectorAll('.popup.edit option');
    for (let user of usersDOM) {
        if (users.includes(user.value)) {
            user.selected = true;
        }
        else {
            user.selected = false;
        }
    }
}

async function editNode(e) {
    e.preventDefault();
    let form = document.querySelector('.edit form');
    let data = new FormData(form);
    let id = form.getAttribute('data-id');
    let name = data.get('name');
    let desc = data.get('desc');
    let users = [];
    for (let user of form.querySelectorAll("option")) {
        if (user.selected) {
            users.push(user.value);
        }
    }
    let editData = { 'name': name, 'desc': desc, 'users': users };
    await nodeApi.editNode(treeId, id, editData);
    loadTree();
    form.reset();
    closePopup();
}

function closePopup() {
    document.querySelector('#overlay').style.display = 'none';
    document.querySelectorAll('.popup').forEach(popup => popup.style.display = 'none');
}


async function loadPage() {
    await login();
    await loadTree();
    await loadUsers();
    await loadUsersIntoPopup();
}

window.addEventListener('load', async () => {
    await loadPage();

    // event listeners for the popup (close)
    document.querySelector('#overlay').addEventListener('click', closePopup);
    let addNodeForm = document.querySelector('.popup.popup__add form');
    addNodeForm.onsubmit = async (e) => addNode(e);
    let editNodeForm = document.querySelector('.popup.edit form');
    editNodeForm.onsubmit = async (e) => editNode(e);
});
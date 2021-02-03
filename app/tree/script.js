import { authAPI, treeAPI, nodeAPI } from '../api.js';

let username = 'user';
let password = 'pass';
let id;
let treeId;

function login() {
    authAPI.login(username, password).then(data => id = data.id);
}

function resetTree() {
    const treeCon = document.querySelector('.trees');
    treeCon.innerHTML = '';
}

function loadTree() {
    const urlParams = new URLSearchParams(window.location.search);
    treeId = urlParams.get('id');

    const treeCon = document.querySelector('.trees');
    resetTree();
    treeAPI.treeDetail(username, password, treeId).then(data => {
        let html = ``;
        // we don't question this function
        function traverse(root) {
            html += `<li>`;

            // what to do with each element
            let _class = 'tf-nc ' + (root.active ? 'active' : '');
            html += `<div class="${_class}" data-id="${root.id}">
                <p class="tf-nc__name">${root.name}</p>
                <p class="tf-nc__desc">${root.desc}</p>
                <p class="tf-nc__price">${root.price}</p>
                <button class="tf-nc__add">Add</button>
            </div>`;

            // actually makes a tree
            if (root.node_set.length > 0) {
                html += `<ul>`;
            }
            for (const node of root.node_set) { // will only run if node has children
                traverse(node);
            }
            if (root.node_set.length > 0) {
                html += `</ul>`;
            }

            html += `</li>`;
        }

        for (const node of data.node_set) {
            html += `<div class="tf-tree tf-custom"><ul>`;
            traverse(node);
            html += `</div></ul>`
        }

        treeCon.innerHTML = html;

        for (const node of treeCon.querySelectorAll('.tf-nc')) {
            let nodeId = node.getAttribute('data-id');
            node.querySelector('.tf-nc__add').addEventListener('click', () => openAddPopup(nodeId));
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
    let cost = data.get('cost');
    let parentId = form.getAttribute('data-id');
    console.log(parentId);
    console.log(form);
    await nodeAPI.addNode(username, password, treeId, desc, parentId, name, cost).then(data => {
        loadTree();
        form.reset();
        closePopup();
    });
}

function closePopup() {
    document.querySelector('#overlay').style.display = 'none';
    document.querySelectorAll('.popup').forEach(popup => popup.style.display = 'none');
}

window.addEventListener('load', () => {
    login();
    loadTree();

    // event listeners for the popup (close)
    document.querySelector('#overlay').addEventListener('click', closePopup);
    let form = document.querySelector('.popup form');
    form.onsubmit = async (e) => addNode(e);
});
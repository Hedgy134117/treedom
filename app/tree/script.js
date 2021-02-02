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
                <p class="tf-nc__desc">${root.desc}</p>
                <p class="tf-nc__price">${root.price}</p>
                <button onclick="addNode(this.parentElement)">Add</button>
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
    });
}

function closePopup() {
    document.querySelector('#overlay').style.display = 'none';
    document.querySelector('.popup').style.display = 'none';
}

window.addEventListener('load', () => {
    login();
    loadTree();

    // event listeners for the popup (close)
    document.querySelector('#overlay').addEventListener('click', closePopup);
    let form = document.querySelector('.popup form');
    form.onsubmit = async (e) => {
        e.preventDefault();
        let data = new FormData(document.querySelector('.popup form'));
        let name = data.get('name');
        let desc = data.get('desc');
        let cost = data.get('cost');
        let parentId = getParentId();
        await nodeAPI.addNode(username, password, treeId, desc, parentId).then(data => {
            loadTree();
            form.reset();
            closePopup();
        });
    }
});
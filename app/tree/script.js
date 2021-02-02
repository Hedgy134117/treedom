import { authAPI, treeAPI, nodeAPI } from '../api.js';

let username = 'user';
let password = 'pass';
let id;
let treeId;

function login() {
    authAPI.login(username, password).then(data => id = data.id);
}

function loadTree() {
    const urlParams = new URLSearchParams(window.location.search);
    treeId = urlParams.get('id');

    const treeCon = document.querySelector('.trees');
    treeAPI.treeDetail(username, password, treeId).then(data => {
        let html = ``;
        // we don't question this function
        function traverse(root) {
            html += `<li>`;

            // what to do with each element
            let _class = 'tf-nc ' + (root.active ? 'active' : '');
            html += `<div class="${_class}">
                <p class="tf-nc__desc">${root.desc}</p>
                <p class="tf-nc__price">${root.price}</p>
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

window.addEventListener('load', () => {
    login();
    loadTree();
});
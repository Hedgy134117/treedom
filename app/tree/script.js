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
            html += `<span class="tf-nc">${root.desc}</span>`;
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
            html += `<div class="tf-tree"><ul>`;
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
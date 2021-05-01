import { authAPI, vTreeAPI, vNodeAPI, treeAPI } from '../api.js';

let username = window.localStorage.getItem('td-username');
let password = window.localStorage.getItem('td-password');
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
            html += `<div class="tf-nc" data-id="${root.id}">
                <p class="tf-nc__name">${root.name}</p>
                <p class="tf-nc__desc">${root.desc}</p>
                <button class="tf-nc__add">Add</button>
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
            node.querySelector('.tf-nc__add').addEventListener('click', () => openAddPopup(nodeId));
        }
    });
}


async function loadPage() {
    await login();
    await loadTree();
}

window.addEventListener('load', async () => {
    await loadPage();

    // event listeners for the popup (close)
    // document.querySelector('#overlay').addEventListener('click', closePopup);
    // let addNodeForm = document.querySelector('.popup.popup__add form');
    // addNodeForm.onsubmit = async (e) => addNode(e);
});
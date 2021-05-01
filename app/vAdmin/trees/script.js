import { authAPI, vTreeAPI } from '../../api.js';

let username = window.localStorage.getItem('td-username');
let password = window.localStorage.getItem('td-password');
let id;
let treeAPI = new vTreeAPI("", "");

async function login() {
    await authAPI.login(username, password).then(data => {
        id = data.id;
        treeAPI = new vTreeAPI(username, password);
    });
}


async function loadTrees() {
    let trees = await treeAPI.treeList();
    for (let tree of trees) {
        DOMCreateTree(tree.name, tree.id);
    }
}

function DOMCreateTree(name, id) {
    document.querySelector(".trees__list").insertAdjacentHTML("beforeend", `
    <div class="tree" onclick="window.open('../../vTree/index.html?id=${id}', '_blank');">
        <p class="tree__name">${name}</p>
    </div>
    `);
}

function search() {
    let filter = document.querySelector(".trees__search input").value.toLowerCase();
    let elements = document.querySelectorAll(".tree");
    for (let element of elements) {
        let text = element.innerText.toLowerCase();
        console.log(text.includes(filter))
        if (text.includes(filter)) {
            element.classList.remove("hidden");
        }
        else {
            element.classList.add("hidden");
        }
    }
}


async function loadPage() {
    await login();
    await loadTrees();
}

window.addEventListener('load', () => {
    loadPage();
    document.querySelector(".trees__search input").addEventListener("input", search)
});
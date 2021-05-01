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

async function createTree(e) {
    e.preventDefault();
    let form = document.querySelector('.new form');
    let data = new FormData(form);
    let name = data.get('name');
    treeAPI.createTree(name).then(data => {
        DOMCreateTree(name, data.id);

        form.reset();
        closePopup();
    });
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


function openNewPopup() {
    document.querySelector('#overlay').style.display = 'block';
    document.querySelector('.popup.new').style.display = 'block';
}

function closePopup() {
    document.querySelector('#overlay').style.display = 'none';
    document.querySelectorAll('.popup').forEach(popup => popup.style.display = 'none');
}


async function loadPage() {
    await login();
    await loadTrees();
}

window.addEventListener('load', () => {
    loadPage();
    document.querySelector(".trees__search input").addEventListener("input", search);

    // event listeners for the popup (open / close)
    document.querySelector('.trees__newTreeButton').addEventListener('click', openNewPopup);
    document.querySelector('#overlay').addEventListener('click', closePopup);

    // form submit 
    let createTreeForm = document.querySelector('.new form');
    createTreeForm.onsubmit = (e) => createTree(e);
});
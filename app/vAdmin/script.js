import { authAPI, vTreeAPI } from '../api.js';

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

async function loadUsers() {
    await authAPI.userList().then(data => {
        for (let user of data) {
            if (user.inVoid) {
                DOMCreatePlayer(user.id, user.username, user.voidPoints, user.skills);
            }
        }
    });
}

async function addPoints(id) {
    let points = await authAPI.addPoint(username, password, id);
    points = points.voidPoints;
    document.querySelector(`.player[data-id="${id}"] .player__points`).innerText = `${points} Points`;
}

function DOMCreatePlayer(id, name, points, skills) {
    let skillsHTML = ``;
    for (let skill of skills) {
        skillsHTML += `
        <div class="skill">
            <p class="skill__name">${skill.name}</p>
            <p class="skill__desc">${skill.desc}</p>
        </div>
        `
    }
    document.querySelector(".players").insertAdjacentHTML("beforeend", `
    <div class="player" data-id="${id}">
        <div class="player__info">
            <p class="player__name">${name}</p>
            <p class="player__points">${points} Points</p>
            <div class="player__pointsButton">
                <p>+1</p>
            </div>
        </div>
        <div class="player__skills">
            ${skillsHTML}
        </div>
    </div>
    `);
    document.querySelector(`.player[data-id="${id}"] .player__pointsButton`).addEventListener('click', () => { addPoints(id) });
}

async function loadPage() {
    await login();
    await loadUsers();
}

window.addEventListener('load', () => {
    loadPage();
});
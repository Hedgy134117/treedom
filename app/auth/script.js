import { authAPI } from '../api.js';

function login(e) {
    e.preventDefault();
    let data = new FormData(document.querySelector('.login form'));
    let user = data.get('username');
    let pass = data.get('password');
    authAPI.login(user, pass).then(data => {
        // if invalid user / pass
        if (data.detail != undefined) {
            let error = document.querySelector('.login .popup__error');
            error.style.display = 'block';
            error.innerText = data.detail
        }
        else {
            window.localStorage.setItem('td-username', data.username);
            window.localStorage.setItem('td-password', pass);
            window.localStorage.setItem('td-id', data.id);
            window.location.href = '../home/index.html';
        }
    });
}

function signup(e) {
    e.preventDefault();
    let data = new FormData(document.querySelector('.signup form'));
    let user = data.get('username');
    let pass = data.get('password');
    authAPI.createUser(user, pass).then(data => {
        // if invalid user
        if (data.id == undefined) {
            let error = document.querySelector('.signup .popup__error');
            error.style.display = 'block';
            error.innerText = data.username[0];
        }
        else {
            window.localStorage.setItem('td-username', data.username);
            window.localStorage.setItem('td-password', pass);
            window.localStorage.setItem('td-id', data.id);
            window.location.href = '../home/index.html';
        }
    });
}

function switchTab() {
    document.querySelectorAll('.popup-noncenter').forEach(element => {
        if (element.style.display == 'block') {
            element.style.display = 'none';
        }
        else {
            element.style.display = 'block';
        }
    });
}

window.addEventListener('load', () => {
    document.querySelector('.login form').onsubmit = async (e) => login(e);
    document.querySelector('.signup form').onsubmit = async (e) => signup(e);
    document.querySelectorAll('.popup__clickable').forEach(element => {
        element.addEventListener('click', switchTab);
    })
})
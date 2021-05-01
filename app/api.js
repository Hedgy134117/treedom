let local = true;
let baseUrl = local ? 'http://127.0.0.1:8000/' : 'https://hedgy1.pythonanywhere.com/';

const getAuth = (method, user, pass) => {
    return {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${user}:${pass}`)
        },
    }
}

class authAPI {
    static async userList() {
        const res = await fetch(baseUrl + 'auth/users/');
        return res.json();
    }

    static async createUser(user, pass) {
        const res = await fetch(baseUrl + 'auth/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': user,
                'password': pass
            })
        });
        return res.json();
    }

    static async login(user, pass) {
        const res = await fetch(baseUrl + 'auth/login/', getAuth('GET', user, pass));
        return res.json();
    }

    static async addPoint(user, pass, id) {
        let obj = await fetch(baseUrl + `auth/users/${id}`, getAuth('GET', user, pass));
        obj = await obj.json();
        let points = obj.voidPoints;
        let settings = getAuth('PATCH', user, pass);
        settings.body = JSON.stringify({ 'voidPoints': points + 1 });
        const res = await fetch(baseUrl + `auth/users/${id}/`, settings)
        return res.json();
    }
}

class treeAPI {
    static async treeList(user, pass) {
        const res = await fetch(baseUrl + 'trees/trees/', getAuth('GET', user, pass));
        return res.json();
    }

    static async createTree(username, pass, name, user) {
        let settings = getAuth('POST', username, pass);
        settings.body = JSON.stringify({
            'name': name,
            'user': user
        })
        const res = await fetch(baseUrl + 'trees/trees/', settings);
        return res.json();
    }

    static async treeDetail(user, pass, id) {
        const res = await fetch(baseUrl + `trees/trees/${id}/`, getAuth('GET', user, pass));
        return res.json();
    }

    static async editTree(user, pass, id, data) {
        let settings = getAuth('PATCH', user, pass);
        settings.body = JSON.stringify(data);
        const res = await fetch(baseUrl + `trees/trees/${id}/`, settings);
        return res.json();
    }
}

class nodeAPI {
    static async addNode(user, pass, id, desc, parent, name, cost) {
        let settings = getAuth('POST', user, pass);
        settings.body = JSON.stringify({
            'desc': desc,
            'parent': parent,
            'name': name,
            'price': cost
        });
        const res = await fetch(baseUrl + `trees/trees/${id}/`, settings);
        return res.json();
    }

    static async getNode(user, pass, treeId, nodeId) {
        const res = await fetch(baseUrl + `trees/trees/${treeId}/${nodeId}/`, getAuth('GET', user, pass));
        return res.json();
    }

    static async editNode(user, pass, treeId, nodeId, data) {
        let settings = getAuth('PATCH', user, pass);
        settings.body = JSON.stringify(data);
        const res = await fetch(baseUrl + `trees/trees/${treeId}/${nodeId}/`, settings);
        return res.json();
    }

    static async delNode(user, pass, treeId, nodeId) {
        const res = await fetch(baseUrl + `trees/trees/${treeId}/${nodeId}/`, getAuth('DELETE', user, pass));
        return res.json();
    }
}

class vTreeAPI {
    constructor(user, pass) {
        this.username = user;
        this.password = pass;
    }

    async treeList() {
        const res = await fetch(baseUrl + 'trees/void-trees/', getAuth('GET', this.username, this.password));
        return res.json();
    }

    async createTree(name) {
        let settings = getAuth('POST', this.username, this.password);
        settings.body = JSON.stringify({
            'name': name
        });
        const res = await fetch(baseUrl + 'trees/void-trees/', settings);
        return res.json();
    }

    async treeDetail(id) {
        const res = await fetch(baseUrl + `trees/void-trees/${id}/`, getAuth('GET', this.username, this.password));
        return res.json();
    }

    async editTree(id, data) {
        let settings = getAuth('PATCH', this.username, this.password);
        settings.body = JSON.stringify(data);
        const res = await fetch(baseUrl + `trees/void-trees/${id}/`, settings);
        return res.json();
    }
}

class vNodeAPI {
    constructor(user, pass) {
        this.username = user;
        this.password = pass;
    }

    async addNode(id, desc, parent, name, users) {
        let settings = getAuth('POST', this.username, this.password);
        settings.body = JSON.stringify({
            'desc': desc,
            'parent': parent,
            'name': name,
            'users': users
        });
        const res = await fetch(baseUrl + `trees/void-trees/${id}/`, settings);
        return res.json();
    }

    async getNode(treeId, nodeId) {
        const res = await fetch(baseUrl + `trees/void-trees/${treeId}/${nodeId}/`, getAuth('GET', this.username, this.password));
        return res.json();
    }

    async editNode(treeId, nodeId, data) {
        let settings = getAuth('PATCH', this.username, this.password);
        settings.body = JSON.stringify(data);
        const res = await fetch(baseUrl + `trees/void-trees/${treeId}/${nodeId}/`, settings);
        return res.json();
    }

    async delNode(treeId, nodeId) {
        const res = await fetch(baseUrl + `trees/trees/${treeId}/${noeId}/`, getAuth('DELETE', this.username, this.password));
        return res.json();
    }
}

export {
    authAPI,
    treeAPI, nodeAPI,
    vTreeAPI, vNodeAPI
};
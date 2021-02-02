function openPopup() {
    document.querySelector('#overlay').style.display = 'block';
    document.querySelector('.popup').style.display = 'block';
}

let parentId;

function addNode(node) {
    openPopup();
    parentId = node.getAttribute('data-id');
}

function getParentId() { return parentId; }
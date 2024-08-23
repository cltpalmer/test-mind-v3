// scripts/mindmap.js

const mindmapContainer = document.getElementById('mindmap-container');
const addBelowButton = document.getElementById('add-below-btn');
const addLeftButton = document.getElementById('add-left-btn');
const addRightButton = document.getElementById('add-right-btn');
const resetButton = document.getElementById('reset-button');
let currentColor = '#40FE5E';

// Function to create a new node and apply the current color
function createNode(parentNode, position, button) {
    const newNode = document.createElement('div');
    newNode.className = 'node';
    newNode.innerHTML = `<textarea placeholder="New Thought..."></textarea>`;

    newNode.style.borderColor = currentColor;
    newNode.querySelector('textarea').style.color = currentColor;
    newNode.querySelector('textarea').style.setProperty('--placeholder-color', currentColor);

    if (isSpaceAvailableForNode(parentNode, newNode, position)) {
        mindmapContainer.appendChild(newNode);

        positionNode(parentNode, newNode, position);
        connectNodes(parentNode, newNode);

        addPlusButtons(newNode, position);

        button.style.opacity = '0';
        setTimeout(() => button.remove(), 300);
        checkAndHideOverlappingPlusButtons();
    } else {
        button.style.opacity = '0';
        setTimeout(() => button.remove(), 300);
    }
}

// Function to add plus buttons based on available sides, excluding the connection side
function addPlusButtons(node, position) {
    if (position !== 'right') {
        const leftButton = createPlusButton('left', node);
        node.appendChild(leftButton);
    }

    if (position !== 'left') {
        const rightButton = createPlusButton('right', node);
        node.appendChild(rightButton);
    }

    if (position !== 'below') {
        const belowButton = createPlusButton('below', node);
        node.appendChild(belowButton);
    }
}

// Helper function to create plus buttons
function createPlusButton(direction, node) {
    const button = document.createElement('button');
    button.className = 'add-btn';
    button.style.cssText = `
        position: absolute;
        ${direction === 'left' ? 'left: -70px;' : ''}
        ${direction === 'right' ? 'right: -70px;' : ''}
        ${direction === 'below' ? 'bottom: -70px; left: 50%; transform: translateX(-50%);' : ''}
        top: ${direction === 'left' || direction === 'right' ? '50%; transform: translateY(-50%);' : ''};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid ${currentColor};
        background-color: ${direction === 'below' ? '#000000' : 'transparent'};
        color: ${direction === 'below' ? '#000000' : currentColor};
        box-shadow: ${direction === 'below' ? `0 0 20px ${currentColor}` : 'none'};
        font-size: 24px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 0.3s ease, opacity 0.3s ease;
    `;
    button.textContent = '+';
    button.addEventListener('click', function() {
        createNode(node, direction, button);
    });
    return button;
}

// Function to check if there's enough space to place a new node
function isSpaceAvailableForNode(parentNode, newNode, position) {
    const parentRect = parentNode.getBoundingClientRect();
    const containerRect = mindmapContainer.getBoundingClientRect();
    const newNodeWidth = newNode.offsetWidth;
    const newNodeHeight = newNode.offsetHeight;

    let xOffset, yOffset;

    switch (position) {
        case 'below':
            xOffset = parentRect.left + parentRect.width / 2 - containerRect.left - newNodeWidth / 2;
            yOffset = parentRect.bottom - containerRect.top + 50;
            break;
        case 'left':
            xOffset = parentRect.left - containerRect.left - newNodeWidth - 70;
            yOffset = parentRect.top + parentRect.height / 2 - containerRect.top - newNodeHeight / 2;
            break;
        case 'right':
            xOffset = parentRect.right - containerRect.left + 70;
            yOffset = parentRect.top + parentRect.height / 2 - containerRect.top - newNodeHeight / 2;
            break;
        default:
            return false;
    }

    const newRect = {
        left: xOffset,
        top: yOffset,
        right: xOffset + newNodeWidth,
        bottom: yOffset + newNodeHeight
    };

    if (
        newRect.left < containerRect.left ||
        newRect.right > containerRect.right ||
        newRect.top < containerRect.top ||
        newRect.bottom > containerRect.bottom
    ) {
        return false;
    }

    const existingNodes = document.querySelectorAll('.node');
    for (let i = 0; i < existingNodes.length; i++) {
        const existingRect = existingNodes[i].getBoundingClientRect();
        if (
            newRect.left < existingRect.right &&
            newRect.right > existingRect.left &&
            newRect.top < existingRect.bottom &&
            newRect.bottom > existingRect.top
        ) {
            return false;
        }
    }

    return true;
}

// Function to check for overlapping plus buttons and hide them if they overlap
function checkAndHideOverlappingPlusButtons() {
    const buttons = document.querySelectorAll('.add-btn');
    buttons.forEach((btn1, index1) => {
        const rect1 = btn1.getBoundingClientRect();
        buttons.forEach((btn2, index2) => {
            if (index1 !== index2) {
                const rect2 = btn2.getBoundingClientRect();
                if (
                    rect1.left < rect2.right - 5 &&
                    rect1.right > rect2.left + 5 &&
                    rect1.top < rect2.bottom - 5 &&
                    rect1.bottom > rect2.top + 5
                ) {
                    btn2.style.opacity = '0';
                    setTimeout(() => btn2.remove(), 300);
                }
            }
        });
    });
}

// Function to position the new node relative to the parent node
function positionNode(parentNode, newNode, position) {
    const parentRect = parentNode.getBoundingClientRect();
    const containerRect = mindmapContainer.getBoundingClientRect();

    let xOffset, yOffset;

    switch (position) {
        case 'below':
            xOffset = parentRect.left + parentRect.width / 2 - containerRect.left - newNode.offsetWidth / 2;
            yOffset = parentRect.bottom - containerRect.top + 50;
            break;
        case 'left':
            xOffset = parentRect.left - containerRect.left - newNode.offsetWidth - 70;
            yOffset = parentRect.top + parentRect.height / 2 - containerRect.top - newNode.offsetHeight / 2;
            break;
        case 'right':
            xOffset = parentRect.right - containerRect.left + 70;
            yOffset = parentRect.top + parentRect.height / 2 - containerRect.top - newNode.offsetHeight / 2;
            break;
    }

    newNode.style.left = `${xOffset}px`;
    newNode.style.top = `${yOffset}px`;
}

// Function to connect nodes with a line
function connectNodes(parentNode, childNode) {
    const line = document.createElement('div');
    line.className = 'connection-line';

    const parentRect = parentNode.getBoundingClientRect();
    const childRect = childNode.getBoundingClientRect();
    const containerRect = mindmapContainer.getBoundingClientRect();

    let parentX, parentY, childX, childY;

    if (childRect.right <= parentRect.left) {
        parentX = parentRect.left - containerRect.left;
        parentY = parentRect.top + parentRect.height / 2 - containerRect.top;
        childX = childRect.right - containerRect.left;
        childY = childRect.top + childRect.height / 2 - containerRect.top;
    } else if (childRect.left >= parentRect.right) {
        parentX = parentRect.right - containerRect.left;
        parentY = parentRect.top + parentRect.height / 2 - containerRect.top;
        childX = childRect.left - containerRect.left;
        childY = childRect.top + childRect.height / 2 - containerRect.top;
    } else if (childRect.top >= parentRect.bottom) {
        parentX = parentRect.left + parentRect.width / 2 - containerRect.left;
        parentY = parentRect.bottom - containerRect.top;
        childX = childRect.left + childRect.width / 2 - containerRect.left;
        childY = childRect.top - containerRect.top;
    }

    const length = Math.hypot(childX - parentX, childY - parentY);
    const angle = Math.atan2(childY - parentY, childX - parentX) * (180 / Math.PI);

    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = '0 0';
    line.style.left = `${parentX}px`;
    line.style.top = `${parentY}px`;

    line.style.backgroundColor = currentColor;

    mindmapContainer.appendChild(line);
}

// Event listeners for plus buttons
addBelowButton.addEventListener('click', function() {
    createNode(document.getElementById('central-node'), 'below', this);
});

addLeftButton.addEventListener('click', function() {
    createNode(document.getElementById('central-node'), 'left', this);
});

addRightButton.addEventListener('click', function() {
    createNode(document.getElementById('central-node'), 'right', this);
});

// Event listener for the reset button
resetButton.addEventListener('click', function() {
    document.querySelectorAll('.node:not(#central-node), .connection-line').forEach(element => element.remove());

    const centralNode = document.getElementById('central-node');
    centralNode.querySelector('textarea').value = '';

    centralNode.querySelectorAll('.add-btn').forEach(button => button.remove());
    addPlusButtons(centralNode, null);
});

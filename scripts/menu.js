// scripts/menu.js

// Get DOM elements
const colorMenuTrigger = document.getElementById('color-menu-trigger');
const colorMenu = document.getElementById('color-menu');
const popupMenu = document.getElementById('popup-menu');
const changeColorBtn = document.getElementById('change-color-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const colorSwatches = document.querySelectorAll('.color-swatch');
let currentColor = '#40FE5E';

// Ensure the pop-up menu and color menu are hidden on page load
popupMenu.style.display = 'none';
colorMenu.style.display = 'none';

// Toggle the popup menu when the circle menu icon is clicked
colorMenuTrigger.addEventListener('click', function() {
    popupMenu.style.display = (popupMenu.style.display === 'none') ? 'flex' : 'none';
});

// Show color menu when 'change color' is clicked
changeColorBtn.addEventListener('click', function(event) {
    const popupRect = popupMenu.getBoundingClientRect();
    colorMenu.style.left = `${popupRect.left}px`;
    colorMenu.style.top = `${popupRect.bottom + 10}px`;
    colorMenu.style.transform = 'none';
    colorMenu.style.display = 'flex';
});

// Close the popup menu when 'close menu' is clicked
closeMenuBtn.addEventListener('click', function() {
    popupMenu.style.display = 'none';
    colorMenu.style.display = 'none'; 
});

// Handle color swatch click
colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', function() {
        const selectedColor = swatch.getAttribute('data-color');
        updateColor(selectedColor);
        colorMenu.style.display = 'none';
        popupMenu.style.display = 'none';
    });
});

// Function to update the color of all relevant elements
function updateColor(newColor) {
    currentColor = newColor;
    const elementsToFlash = document.querySelectorAll('.node, .add-btn, .connection-line, textarea, #color-circle, #group-name-input');
    elementsToFlash.forEach(element => {
        element.classList.add('neon-flash');
    });
    setTimeout(() => {
        elementsToFlash.forEach(element => {
            element.classList.remove('neon-flash');
            element.style.borderColor = newColor;
            element.style.color = newColor;
            if (element.tagName.toLowerCase() === 'textarea') {
                element.style.setProperty('--placeholder-color', newColor);
            }
            if (element.classList.contains('add-btn')) {
                element.style.borderColor = newColor;
                element.style.boxShadow = `0 0 2vw ${newColor}`;
                element.style.color = newColor;
            }
        });
        document.getElementById('color-circle').style.backgroundColor = newColor;
        document.getElementById('color-circle').style.borderColor = newColor;
        const centralNodeBottomLogo = document.getElementById('add-below-btn');
        centralNodeBottomLogo.style.boxShadow = `0 0 2vw ${newColor}`;
        const resetButton = document.getElementById('reset-button');
        resetButton.style.backgroundColor = newColor;
        resetButton.style.color = '#000000';
    }, 500); 
}

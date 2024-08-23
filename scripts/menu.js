// scripts/menu.js

const colorMenuTrigger = document.getElementById('color-menu-trigger');
const colorMenu = document.getElementById('color-menu');
const popupMenu = document.getElementById('popup-menu');
const changeColorBtn = document.getElementById('change-color-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const colorSwatches = document.querySelectorAll('.color-swatch');
// Removed duplicate currentColor declaration
// let currentColor = '#40FE5E';

// Ensure the pop-up menu and color menu are hidden on page load
popupMenu.style.display = 'none';
colorMenu.style.display = 'none';

// Debugging - Check if elements are properly selected
console.log('colorMenuTrigger:', colorMenuTrigger);
console.log('popupMenu:', popupMenu);
console.log('colorMenu:', colorMenu);

// Toggle the popup menu when the circle menu icon is clicked
colorMenuTrigger.addEventListener('click', function() {
    console.log('Color menu trigger clicked');
    popupMenu.style.display = (popupMenu.style.display === 'none') ? 'flex' : 'none';
});

// Show color menu when 'change color' is clicked
changeColorBtn.addEventListener('click', function(event) {
    console.log('Change color button clicked');
    // Calculate the position of the pop-up menu
    const popupRect = popupMenu.getBoundingClientRect();
    
    // Position the color menu right below the pop-up menu
    colorMenu.style.left = `${popupRect.left}px`;
    colorMenu.style.top = `${popupRect.bottom + 10}px`; 
    colorMenu.style.transform = 'none'; 

    // Display the color menu
    colorMenu.style.display = 'flex';
});

// Close the popup menu when 'close menu' is clicked
closeMenuBtn.addEventListener('click', function() {
    console.log('Close menu button clicked');
    popupMenu.style.display = 'none';
    colorMenu.style.display = 'none'; 
});

// Handle color swatch click
colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', function() {
        const selectedColor = swatch.getAttribute('data-color');
        console.log('Color swatch selected:', selectedColor);
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
                element.style.boxShadow = `0 0 20px ${newColor}`;
                element.style.color = newColor;
            }
        });

        document.getElementById('color-circle').style.backgroundColor = newColor;
        document.getElementById('color-circle').style.borderColor = newColor;

        const centralNodeBottomLogo = document.getElementById('add-below-btn');
        centralNodeBottomLogo.style.boxShadow = `0 0 20px ${newColor}`;

        resetButton.style.backgroundColor = newColor;
        resetButton.style.color = '#000000'; 
    }, 500); 
}

let snappingEnabled = true;
const gridSize = 50;
let counter = 1;
let activeCard = null; // Track which card is being dragged

class Card {
    constructor(element) {
        this.element = element;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        
        // Initialize position if not set
        if (!this.element.style.top) {
            this.element.style.top = '0px';
        }
        if (!this.element.style.left) {
            this.element.style.left = '0px';
        }
        
        // Make sure position is absolute
        this.element.style.position = 'absolute';
        
        // Add event listeners
        this.element.addEventListener('mousedown', (e) => this.mouseDown(e));
    }
    
    mouseDown(e) {
        this.isDragging = true;
        activeCard = this;
        this.startX = e.clientX;
        this.startY = e.clientY;
        
        // Bring to front
        this.element.style.zIndex = counter++;
        
        document.addEventListener('mousemove', this.mouseMoveBound = (e) => this.mouseMove(e));
        document.addEventListener('mouseup', this.mouseUpBound = (e) => this.mouseUp(e));
        e.preventDefault(); // Prevent text selection while dragging
    }
    
    mouseMove(e) {
        if (!this.isDragging) return;
        
        const newX = this.startX - e.clientX;
        const newY = this.startY - e.clientY;
        
        this.startX = e.clientX;
        this.startY = e.clientY;
        
        const currentTop = parseInt(this.element.style.top, 10) || 0;
        const currentLeft = parseInt(this.element.style.left, 10) || 0;
        
        this.element.style.top = (currentTop - newY) + 'px';
        this.element.style.left = (currentLeft - newX) + 'px';
    }
    
    mouseUp(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        activeCard = null;
        
        if (snappingEnabled) {
            this.snapToGrid();
        }
        
        document.removeEventListener('mousemove', this.mouseMoveBound);
        document.removeEventListener('mouseup', this.mouseUpBound);
    }
    
    snapToGrid() {
        const currentTop = parseInt(this.element.style.top, 10) || 0;
        const currentLeft = parseInt(this.element.style.left, 10) || 0;
        
        const snappedTop = Math.round(currentTop / gridSize) * gridSize;
        const snappedLeft = Math.round(currentLeft / gridSize) * gridSize;
        
        this.element.style.top = snappedTop + 'px';
        this.element.style.left = snappedLeft + 'px';
    }
}

// Initialize existing cards
const cards = [];
const initialCard = document.getElementById('card');
if (initialCard) {
    cards.push(new Card(initialCard));
}

function addNewCard() {
    const container = document.getElementById('container');
    if (!container) {
        console.error("Container element not found");
        return;
    }
    
    const newCard = document.createElement('div');
    newCard.className = 'card';
    newCard.id = `card_${counter}`;
    
    // Styling for visual appearance
    newCard.style.width = '100px';
    newCard.style.height = '100px';
    newCard.style.backgroundColor = getRandomColor();
    newCard.style.borderRadius = '5px';
    newCard.style.cursor = 'move';
    newCard.style.position = 'absolute';
    
    // Position the new card in a grid-like pattern
    const row = Math.floor((counter - 1) / 5);
    const col = (counter - 1) % 5;
    newCard.style.top = `${row * (150 + 10)}px`;
    newCard.style.left = `${col * (100 + 10)}px`;
    
    container.appendChild(newCard);
    cards.push(new Card(newCard));
    counter++;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Snap all cards to grid
function snapAllToGrid() {
    cards.forEach(card => card.snapToGrid());
}

// Toggle snapping
const toggleButton = document.getElementById('toggleSnap');
if (toggleButton) {
    toggleButton.addEventListener('click', () => {
        snappingEnabled = !snappingEnabled;
        toggleButton.textContent = snappingEnabled ? 'Disable Snapping' : 'Enable Snapping';
        if (snappingEnabled) snapAllToGrid();
    });
}

// Add new card button
const createButton = document.getElementById('create');
if (createButton) {
    createButton.addEventListener('click', addNewCard);
}
let newX = 0, newY = 0, startX = 0, startY = 0;
let snappingEnabled = true;
const gridSize = 50;

const card = document.getElementById('card');

card.addEventListener('mousedown', mouseDown);

function mouseDown(e){
    startX = e.clientX;
    startY = e.clientY;

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
}

function mouseMove(e){
    newX = startX - e.clientX;
    newY = startY - e.clientY;
  
    startX = e.clientX;
    startY = e.clientY;

    card.style.top = (card.offsetTop - newY) + 'px';
    card.style.left = (card.offsetLeft - newX) + 'px';
}

function mouseUp(e){
    if (snappingEnabled) {
        snapToGrid();
    }
    document.removeEventListener('mousemove', mouseMove)
}

function snapToGrid() {
    const currentTop = parseInt(card.style.top, 10);
    const currentLeft = parseInt(card.style.left, 10);

    const snappedTop = Math.round(currentTop / gridSize) * gridSize;
    const snappedLeft = Math.round(currentLeft / gridSize) * gridSize;

    card.style.top = snappedTop + 'px';
    card.style.left = snappedLeft + 'px';
}


function preSnapToGrid() {
    if (snappingEnabled) {
        snapToGrid();
    }
}

const toggleButton = document.getElementById('toggleSnap');
toggleButton.addEventListener('click', () => {
    snappingEnabled = !snappingEnabled;
    toggleButton.textContent = snappingEnabled ? 'Disable Snapping' : 'Enable Snapping';
    preSnapToGrid();
});
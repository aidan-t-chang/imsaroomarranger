document.addEventListener('DOMContentLoaded', () => {
  const room = document.getElementById('room');
  const furnitureItems = document.querySelectorAll('.furniture-item');
  
  // Grid snapping size (in pixels)
  const gridSize = 20;
  
  // Track the element being dragged
  let draggedElement = null;
  
  // Handle drag start for palette items
  furnitureItems.forEach(item => {
    item.addEventListener('dragstart', (e) => {
      draggedElement = null; // Reset for new items
      e.dataTransfer.setData('text/plain', JSON.stringify({
        type: 'new',
        itemType: item.textContent,
        width: item.dataset.width,
        height: item.dataset.height
      }));
    });
  });
  
  // Handle drop in room area
  room.addEventListener('dragover', (e) => {
    e.preventDefault(); // Allow drop
  });
  
  room.addEventListener('drop', (e) => {
    e.preventDefault();
    
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    // Calculate snapped position
    const snappedX = Math.round(e.offsetX / gridSize) * gridSize;
    const snappedY = Math.round(e.offsetY / gridSize) * gridSize;
    
    if (data.type === 'new') {
      // Create new furniture from palette
      createFurniture(
        data.itemType, 
        snappedX, 
        snappedY, 
        data.width, 
        data.height
      );
    } else if (data.type === 'move' && draggedElement) {
      // Move existing furniture
      draggedElement.style.left = `${snappedX}px`;
      draggedElement.style.top = `${snappedY}px`;
    }
    
    draggedElement = null;
  });
  
  function createFurniture(type, x, y, width, height) {
    const newFurniture = document.createElement('div');
    newFurniture.className = 'placed-furniture';
    newFurniture.textContent = type;
    newFurniture.style.width = `${width}px`;
    newFurniture.style.height = `${height}px`;
    newFurniture.style.left = `${x}px`;
    newFurniture.style.top = `${y}px`;
    
    // Make draggable
    newFurniture.draggable = true;
    newFurniture.addEventListener('dragstart', (e) => {
      draggedElement = e.target;
      e.dataTransfer.setData('text/plain', JSON.stringify({
        type: 'move'
      }));
      
      // Visual feedback during drag
      e.target.style.opacity = '0.4';
    });
    
    newFurniture.addEventListener('dragend', (e) => {
      e.target.style.opacity = '1';
    });
    
    room.appendChild(newFurniture);
    return newFurniture;
  }
});
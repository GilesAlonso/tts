const storeInput = document.getElementById('textInput');
const storeButton = document.getElementById('storeButton');
const storedData = document.getElementById('storedData');


function storeDataToLocalStorage(data) {
  const storedItems = JSON.parse(localStorage.getItem('storedItems')) || [];
  storedItems.push(data);
  localStorage.setItem('storedItems', JSON.stringify(storedItems));
  displayStoredItems();
}

function removeItemFromLocalStorage(index) {
  const storedItems = JSON.parse(localStorage.getItem('storedItems')) || [];
  storedItems.splice(index, 1);
  localStorage.setItem('storedItems', JSON.stringify(storedItems));
  displayStoredItems();
}

function displayStoredItems() {
  storedData.innerHTML = '';

  const storedItems = JSON.parse(localStorage.getItem('storedItems')) || [];

  storedItems.forEach((item, index) => {
    const row = document.createElement('tr');

    const truncatedText = item.substring(0, 45); // Get the first 45 characters
    const cellText = document.createElement('td');
    cellText.textContent = truncatedText;

    const cellLoad = document.createElement('td');
    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load';
    loadButton.classList.add('btn', 'btn-info','btn-sm'); // Adding Bootstrap classes
    loadButton.addEventListener('click', () => {
      storeInput.value = item;
    });
    cellLoad.appendChild(loadButton);

    const cellDelete = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-warning', 'btn-sm'); // Adding Bootstrap classes
    deleteButton.addEventListener('click', () => {
      removeItemFromLocalStorage(index);
    });
    cellDelete.appendChild(deleteButton);

    row.appendChild(cellText);
    row.appendChild(cellLoad);
    row.appendChild(cellDelete);

    storedData.appendChild(row);
  });
}


storeButton.addEventListener('click', () => {
  const inputText = storeInput.value.trim();
  if (inputText !== '') {
    storeDataToLocalStorage(inputText);
  }
});

window.addEventListener('storage', () => {
  displayStoredItems();
});


displayStoredItems();

const storeInput = document.getElementById('textInput');
const storeButton = document.getElementById('storeButton');
const googleStoreButton = document.getElementById('googleStoreButton');
const googleDownloadButton = document.getElementById('googleDownloadButton');
const storedData = document.getElementById('storedData');




// Function to authenticate and get access token
function authenticate(action) {

  // Replace with your own client ID and API key
  const CLIENT_ID = '541262644769-ut62o7bo3gg0cc7dqaeshf1c12l6etnp.apps.googleusercontent.com';
  const SCOPES = 'https://www.googleapis.com/auth/drive.file';

  

  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'secret': SECRET,
      'scope': SCOPES,
      'immediate': false
    },
    authResult => {
      if (authResult && !authResult.error) {
        const accessToken = authResult.access_token;
        if (action === 'upload') {
          storeDataToDrive(accessToken);
        } else if (action === 'download') {
          downloadDataFromDrive(accessToken);
        }
      } else {
        console.error('Authentication failed:', authResult.error);
      }
    }
  );
}

function storeDataToDrive(accessToken) {
  const data = storeInput.value.trim();

  const file = new Blob([data], { type: 'text/plain' });
  const metadata = {
    'name': 'StoredData.txt', // Change the file name as needed
    'mimeType': 'text/plain'
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: new Headers({
      'Authorization': `Bearer ${accessToken}`
    }),
    body: form
  })
  .then(response => {
    console.log('File uploaded:', response);
    // Optionally, display confirmation to the user
  })
  .catch(error => {
    console.error('Error uploading file:', error);
  });
}

function downloadDataFromDrive(accessToken) {
  fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'GET',
    headers: new Headers({
      'Authorization': `Bearer ${accessToken}`
    })
  })
  .then(response => response.json())
  .then(data => {
    const fileId = data.files[0].id; // Assuming only one file is stored

    fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${accessToken}`
      })
    })
    .then(response => response.text())
    .then(textData => {
      // Do something with the downloaded data
      console.log('Downloaded data:', textData);
      // For example, display the downloaded data in storeInput
      storeInput.value = textData;
    })
    .catch(error => {
      console.error('Error downloading file content:', error);
    });
  })
  .catch(error => {
    console.error('Error fetching file list:', error);
  });
}

googleStoreButton.addEventListener('click', () => {
  authenticate('upload'); // Trigger authentication for uploading when the Store button is clicked
});

googleDownloadButton.addEventListener('click', () => {
  authenticate('download'); // Trigger authentication for uploading when the Store button is clicked
});

// Trigger download when needed, for example, on another button click
// You may call authenticate('download') when you want to download the data




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

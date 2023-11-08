/* eslint-disable prettier/prettier */

const socket = io('http://localhost:3000');
const msgBox = document.getElementById('inputMessage');
const msgCont = document.getElementById('messages-container');
const email = document.getElementById('inputEmail');
const loadMoreButton = document.getElementById('loadMoreButton');

const messages = [];
const displayedMessages = [];
const displayLimit = 10; // Number of messages to display initially
let startIndex = 10; // Keep track of the starting index of displayed messages

function getMessages() {
  fetch('http://localhost:3000/api/chat')
    .then((response) => response.json())
    .then((data) => {
      loadData(data);
      messages.push(...data);
      displayedMessages.push(...data.slice(0, displayLimit));
      startIndex = displayLimit;
      if (messages.length <= displayLimit) {
        loadMoreButton.style.display = 'none';
      }
    })
    .catch((error) => console.error(error));
}

getMessages();

function sendEvent(email, e) {
  console.log(e.target.value);
  sendMessage({ email: email.value, text: e.target.value });
  e.target.value = '';
}

msgBox.addEventListener('keydown', (e) => {
  if (e.keyCode !== 13) return;
  sendEvent(email, e);
});

function loadData(data) {
  const messagesHTML = data.map((message) => {
    return `<li class="bg-success p-2 rounded mb-2 text-light">
      <span class="fw-bolder">${message.email}: </span>
      ${message.text}
    </li>`;
  });

  msgCont.innerHTML = messagesHTML.join('');
}

function loadMoreMessages() {
  const messagesToDisplay = messages.slice(startIndex, startIndex + displayLimit);

  if (messagesToDisplay.length > 0) {
    displayedMessages.push(...messagesToDisplay);
    loadData(displayedMessages);
    startIndex += displayLimit;

    if (startIndex >= messages.length) {
      loadMoreButton.style.display = 'none';
    }
  } else {
    // All messages have been displayed
    loadMoreButton.style.display = 'none';
  }
}

loadMoreButton.addEventListener('click', loadMoreMessages);

function sendMessage(message) {
  socket.emit('sendMessage', message);
}

socket.on('recMessage', (message) => {
    messages.push(message);
  
    // Update the displayedMessages array with the new message
    displayedMessages.push(message);
  
    // Call loadData to update the HTML with all displayedMessages
    loadData(displayedMessages);
  
    // Optionally, scroll to the bottom of the chat container to show the latest message
    msgCont.scrollTop = msgCont.scrollHeight;
  });
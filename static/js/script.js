var running = false;
function send() {
  if (running == true) return;
  var msg = document.getElementById("message").value;
  if (msg == "") return;

  if (msg.endsWith("?") || msg.endsWith("؟")) {
      msg = msg.slice(0, -1);
  }

  running = true;
  addMsg(msg);
  fetch('/get-response', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: msg })
  })
  .then(response => response.json())
  .then(data => {
    setTimeout(function() {
        addResponseMsg(data.answer, data.image, data.model_file);
        responsiveVoice.speak(data.answer, "Arabic Male", {volume: 1});
        running = false;
    }, 1000); 
  })
  .catch(error => {
      console.error('Error:', error);
      setTimeout(function() {
          addResponseMsg("Sorry, I couldn't process your request.");
          running = false;
      }, 1000);
  });

  document.getElementById("message").value = "";
}
function addMsg(msg) {
  var div = document.createElement("div");
  div.innerHTML =
    "<span style='flex-grow:1'></span><div class='chat-message-sent'>" +
    msg +
    "</div>";
  div.className = "chat-message-div";
  document.getElementById("message-box").appendChild(div);
  document.getElementById("message").value = "";
  document.getElementById("message-box").scrollTop = document.getElementById(
    "message-box"
  ).scrollHeight;
}
function addResponseMsg(msg, imageUrl = null, modelFile = null) {
  var messageBox = document.getElementById("message-box");
  
  var div = document.createElement("div");
  div.className = "chat-message-div";

  var messageContent = document.createElement("div");
  messageContent.className = "chat-message-received";
  messageContent.innerText = msg;

  if (imageUrl) {
      var img = document.createElement("img");
      img.src = imageUrl;
      img.className = "chat-image";
      img.style.maxWidth = "100%"; 
      img.style.height = "auto";
      img.style.display = "block";  
      img.style.marginTop = "10px"; 
      messageContent.appendChild(img);  
  }

  function updateModelViewer(modelFile) {
    var modelViewer = document.querySelector("model-viewer");
    modelViewer.src = "static/models/" + modelFile;
  }
  
  if (modelFile) {
    var button = document.createElement('button');
    button.innerText = 'Show in 3D';
    button.addEventListener('click', function() {
      document.getElementById('modelPopup').style.display = 'block';
      updateModelViewer(modelFile);
    });
    messageContent.appendChild(button);
  }

  div.appendChild(messageContent);
  messageBox.appendChild(div); 

  messageBox.scrollTop = messageBox.scrollHeight;
  running = false;
}


document.getElementById("message").addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    send();
  }
});
 document.getElementById("chatbot_toggle").onclick = function () {
    if (document.getElementById("chatbot").classList.contains("collapsed")) {
      document.getElementById("chatbot").classList.remove("collapsed")
      document.getElementById("chatbot_toggle").children[0].style.display = "none"
      document.getElementById("chatbot_toggle").children[1].style.display = ""
      setTimeout(addResponseMsg,1000," مرحبا بك في النسخة التجريبية TechnoLab - Chatbot, لقد تم تدريبي على الوحدة السادسة والسابعة من كتاب الأحياء فقط, كيف يمكنني أن أساعدك؟")    }
    else {
      document.getElementById("chatbot").classList.add("collapsed")
      document.getElementById("chatbot_toggle").children[0].style.display = ""
      document.getElementById("chatbot_toggle").children[1].style.display = "none"
    }
  }



var modal = document.getElementById('modelPopup');
var span = document.getElementsByClassName('close')[0];
span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

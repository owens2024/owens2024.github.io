import { useState, useEffect } from "react";
var firstMessage = {"role":"assistant","content":"Hi I am the Dave and Busters FunMaster? How can I help you have fun today?"};

var chatHistory = []

function App() {

  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    document.querySelector(".endOfList").scrollIntoView();
  })

  const chat = async (e, message) => {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);
    getChat(message);

  };

  const getChat = async (message) => {
    let msgs = chats;
    if(message) {
      msgs.push({ role: "user", content: message });
      chatHistory.push({ role: "user", content: message });
      setChats(msgs);
    } else {
      if(currentStage == "reservation") {
        chatHistory.push({"role":"system", "content":"First greet the customer"});
      } else if(currentStage == "rsvp") {
        chatHistory.push({"role":"system", "content":"First tell Scott he has been invited to the party, include who it is for, date and location"});
      } else if(currentStage == "confirm") {
        chatHistory.push({"role":"system", "content":"First ask Lee to confirm the details of the party and let him know about any guest who confirmed "});
      } else if(currentStage == "party") {
        chatHistory.push({"role":"system", "content":"First welcome the group to the party. Then suggest games based on the theme and age of the guests "});
      } else if(currentStage == "follow-up") {
        chatHistory.push({"role":"system", "content":"First tell Lee you hope the party went well. Ask for any feedback and then ask about helping with thank you notes. Each thank-you note should be 3-8 sentences. "});
      } 

    }

    setMessage("");

    fetch("https://db-backend-0oc0.onrender.com/"+currentStage, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatHistory,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.output.content.indexOf('***DONE***')>0){
          setIsTyping(false);
          advanceStage();
          setChats([]);
        } else {
          msgs.push(data.output);
          chatHistory.push(data.output);
          setChats(msgs)
          setIsTyping(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  document.startChat = function() {
    setIsTyping(true);
    getChat();
  }

  return (
    <main>
      <div className = "chatbot">
        <section className="chats">
          {chats && chats.length
            ? chats.map((chat, index) => (
                <div key={index} className={chat.role === "user" ? "user_msg" : "bot_msg"}>
                  <p>{chat.content}</p>
                </div>
              ))
            : ""}
          <div className={isTyping ? "bot_msg" : "hide"}>
            <p className={isTyping ? "dot-pulse" : ""}></p>
          </div>
          <div className="endOfList"></div>
        </section>

        <form autoComplete="off"  action="" onSubmit={(e) => chat(e, message)}>
          <input
            type="text"
            autoComplete="off" 
            name="message"
            value={message}
            placeholder="Type here and hit Enter..."
            onChange={(e) => setMessage(e.target.value)}
          />
        </form>
      </div>
    </main>
  );
}
export default App;
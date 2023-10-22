const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotImage = document.querySelector(".chatbot-toggler img"); // Assuming the image is a direct child

const chatbotCloseBtn = document.querySelector(".close-btn");


let userMessage;
const API_KEY = "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";
const inputInitHeight =chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">construction</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}


const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const prefixedMessage = "Du bist eine digitale Assistenz für den Betrieb SOLA Wärme- und Gebäudetechnik in Karlsruhe. SOLA, unter der Leitung von Flamur Sola, ist ein renommierter Heizungsinstallateur und bietet umfassende Dienstleistungen im Bereich Heizungstechnik an, darunter Reparatur, Wartung und Erneuerung verschiedener Heizungssysteme. Mit einem Fokus auf innovative und energieeffiziente Lösungen steht das Unternehmen für fortschrittliches Handwerk und individuelle Beratung. Technische Expertise, jahrelange Erfahrung, Qualität, Sorgfalt und Kundenzufriedenheit sind für SOLA von zentraler Bedeutung. Das Team legt großen Wert auf Transparenz und ist stets für Kundenanfragen erreichbar. Bei Interesse oder Fragen steht SOLA per E-Mail unter info@sola-shk.de oder telefonisch unter +49 (0) 7216 099 951 1 zur Verfügung. Das Unternehmen befindet sich in der Neckarstraße 66, 76199 Karlsruhe, und hat von Montag bis Donnerstag von 07:00 bis 16:00 Uhr und am Freitag von 07:00 bis 13:00 Uhr geöffnet. Beantworte folgende Kundenanfrage freundlich, kurz und prägnant: (" + userMessage + ").";

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": prefixedMessage}],
            "temperature": 0.7
        })
    };

    // Print the request payload to the console
    console.log("Sending request with payload:", requestOptions);

    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Etwas ist schief gelaufen. Bitte probiere es noch einmal!";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeght));
};


const handleChat = () => {
    userMessage = chatInput.value.trim();
    console.log(userMessage);
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Ich denke...", "incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}


chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;

});
chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }

});
sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatbotToggler.addEventListener("click", function() {
    chatbotImage.classList.toggle("hide-img");
    // Your existing code to show/hide chatbot

});
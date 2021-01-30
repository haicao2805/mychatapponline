function joinRoom(roomTitle) {
    nsSocket.emit("joinRoom", roomTitle, (newNumberOfMembers) => {
        document.querySelector(".curr-room-num-users").innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`
    });

    nsSocket.on("historyCatchUp", (history) => {
        const message = document.querySelector("#messages");
        message.innerHTML = "";
        history.forEach(data => {
            const newMsg = createHTMLForClientMsg(data);
            const currentMsgs = message.innerHTML;
            message.innerHTML = currentMsgs + newMsg;
        });

        message.scrollTo(0, message.scrollHeight);
    })

    nsSocket.on("updateNumberOfMembers", (numberOfMembers) => {
        document.querySelector(".curr-room-num-users").innerHTML = `${numberOfMembers} <span class="glyphicon glyphicon-user"></span>`
        //update room name
        document.querySelector(".curr-room-text").innerText = `${roomTitle}`
    })

    let searchBox = document.querySelector("#search-box");
    searchBox.addEventListener("input", (e) => {
        let messages = Array.from(document.getElementsByClassName("message-text"));
        messages.forEach((msg) => {
            if (msg.innerText.toUpperCase().indexOf(e.target.value.toUpperCase()) === -1) {
                // the msg does not contain user searching 
                msg.style.display = "none";
            }
            else msg.style.display = "block";
        })
    })
};
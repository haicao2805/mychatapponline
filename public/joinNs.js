function joinNs(endpoint) {
    if (nsSocket) {
        nsSocket.close();
        // remove eventListener before we add again
        document.querySelector(".message-form").removeEventListener("submit", formSubmit);
    }
    nsSocket = io(url + endpoint);
    nsSocket.on("nsRoomLoad", (nsRooms) => {
        let roomList = document.querySelector(".room-list");
        roomList.innerHTML = "";
        nsRooms.forEach((room) => {
            let glyph = (room.privateRoom) ? "lock" : "globe";
            roomList.innerHTML +=
                `<li class="room">
                    <span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}
                </li>`
        })

        // add click event for each room
        let roomNodes = document.getElementsByClassName("room");
        Array.from(roomNodes).forEach((element) => {
            element.addEventListener("click", (e) => {
                joinRoom(e.target.innerText)
            })
        })
    })

    nsSocket.on("messageToClient", (fullData) => {
        document.querySelector("#messages").innerHTML += createHTMLForClientMsg(fullData);
    })

    document.querySelector(".message-form").addEventListener("submit", formSubmit);
}

function createHTMLForClientMsg(fullData) {
    const convertDate = new Date(fullData.time).toLocaleString();
    return `<li>
        <div class="user-image">
           <img src="${fullData.avatar}" />
        </div>
        <div class="user-message">
           <div class="user-name-time">${fullData.username} <span>${convertDate}</span></div>
            <div class="message-text">${fullData.msg}</div>
        </div>
    </li>`
}

function formSubmit(e) {
    e.preventDefault();
    const newMessage = document.querySelector("#user-message").value;
    nsSocket.emit("newMessageToServer", { msg: newMessage });

}
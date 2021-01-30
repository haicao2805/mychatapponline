const username = prompt("Enter your username: ");
const url = "http://localhost:9000"
const socket = io(url, {
    query: {
        username: username
    }
});
let nsSocket = "";

socket.on("nsList", (nsData) => {
    let namespaceDiv = document.querySelector(".namespaces");
    namespaceDiv.innerHTML = "";
    nsData.forEach(ns => {
        namespaceDiv.innerHTML +=
            `<div class="namespace" ns=${ns.endpoint}>
                <img src=${ns.img} />
            </div>
            `;
    });

    const nsArray = Array.from(document.getElementsByClassName("namespace"));
    nsArray.forEach((element) => {
        element.addEventListener("click", (e) => {
            const nsEndpoint = element.getAttribute("ns");
            joinNs(nsEndpoint);
        })
    })

})

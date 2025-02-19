const card = document.getElementById("shop")
const modal = document.querySelector(".modal-container")


modal.style.display ="none";


card.addEventListener("click", () => {
    modal.style.display ="block";
})



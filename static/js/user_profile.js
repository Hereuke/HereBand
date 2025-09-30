const profilePic = document.getElementById("profilePic");
const uploadBtn = document.getElementById("uploadBtn");
const editBtn = document.getElementById("editBtn");
const userName = document.getElementById("userName");

// Clicking the profile picture opens file picker
profilePic.addEventListener("click", () => uploadBtn.click());

// When user selects a file, update the profile picture
uploadBtn.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profilePic.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

// Edit user name
editBtn.addEventListener("click", () => {
  const newName = prompt("Enter new name:", userName.textContent);
  if (newName) {
    userName.textContent = newName;
  }
});
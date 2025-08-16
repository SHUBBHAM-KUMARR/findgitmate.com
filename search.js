const src = document.getElementById('search');
const btn = document.getElementById('btn');
const cardsContainer = document.querySelector('.cards');
const clear = document.getElementById('clear')


// Load saved cards (latest first) on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedCards = JSON.parse(localStorage.getItem("userCards")) || [];
  cardsContainer.innerHTML = savedCards.join(""); // already stored newest first
  clear.addEventListener(
    'click',
    ()=>{
      
      localStorage.removeItem("userCards")
      cardsContainer.innerHTML = '<p class="place-self-center  mt-24   text-4xl text-blue-50">Users Removed</p>'
      setTimeout(()=>{
        cardsContainer.innerHTML = ""
      },3000)
     
    }
  )
 
cardsContainer.addEventListener('click', (e) => {
  if (e.target.closest('.remove-btn')) {
    const card = e.target.closest('.card');
    const username = card.dataset.user;

    // Remove from DOM
    card.remove();

    // Remove from localStorage
    let savedCards = JSON.parse(localStorage.getItem("userCards")) || [];
    savedCards = savedCards.filter(html => !html.includes(`data-user="${username}"`));
    localStorage.setItem("userCards", JSON.stringify(savedCards));
  }
});


});

async function fetchAndDisplayUser() {
  var name = src.value.trim();

  if (!name) {
    console.log("Please enter a username");
    return;
  }

  try {
    const res = await fetch(`https://api.github.com/users/${name}`);
    if (!res.ok) throw new Error(`User not found: ${name}`);

    const data = await res.json();

    const cardHTML = `
  <div class="card grid border border-gray-300 rounded-lg text-white m-2 p-2 bg-blue-500" data-user="${data.login}">
    <img class="h-[100px] w-[100px] place-self-start col-1 rounded-full p-3" src="${data.avatar_url}" alt="github avatar of ${data.login}"/>
    <div class="col-2 row-1 tracking-wide">
      <p>${data.name || 'No Name'}</p>
      <p>${data.bio || 'No bio available'}</p>
    </div>
    <p class="p-3 col-1">${data.followers} Followers</p>
    <p class="p-3">${data.following} Following</p>
    <div class="row-3 grid">
      <a href="https://github.com/${data.login}" target="_self">
        <i class="fa-xl fa-brands fa-github"></i>
      </a>
      <button class="remove-btn col-2">
        <i class="fas fa-trash fa-fw fa-xl" style="color: #ffffff;"></i>
      </button>
    </div>
  </div>
`;


    // Show newest first
    cardsContainer.innerHTML = cardHTML + cardsContainer.innerHTML;

    // Save to localStorage (newest first)
    let savedCards = JSON.parse(localStorage.getItem("userCards")) || [];
    savedCards.unshift(cardHTML); // add to start
    localStorage.setItem("userCards", JSON.stringify(savedCards));

    src.value = "";
  } catch (error) {
    console.error("Error fetching user:", error.message);
  }
}

// Search button click
btn.addEventListener('click', fetchAndDisplayUser);

// Enter key press in input
src.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    fetchAndDisplayUser();
  }
});

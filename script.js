let currentBalance = 100;
const fruits = [];

function showBalance() {
  const balanceValue = document.getElementById("balance");
  balanceValue.textContent = currentBalance;
}

document.addEventListener("DOMContentLoaded", () => {
  showBalance();

  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      console.log("Données JSON chargées avec succès :", data);
      data.forEach((fruitData) => {
        const fruit = {
          nom: fruitData.nom,
          prix: fruitData.prix,
          quantity: 0,
          image: fruitData.image,
        };
        fruits.push(fruit);
      });
      showFruits(fruits);
    })
    .catch((error) => console.error("Erreur de chargement JSON :", error));
});

function showFruits(fruits) {
  const fruitList = document.getElementById("fruit-list");
  fruitList.innerHTML = "";

  fruits.forEach((fruit) => {
    const li = document.createElement("li");
    const plusButton = document.createElement("button");
    const minusButton = document.createElement("button");
    const quantitySpan = document.createElement("span");
    const fruitImage = document.createElement("img");
    const coinImage = document.createElement("img");

    li.classList.add("fruit-article");
    fruitImage.classList.add("fruit-image");
    plusButton.classList.add("plus-button");
    minusButton.classList.add("minus-button");
    coinImage.classList.add("coin-image");
    quantitySpan.classList.add("quantity-span");

    plusButton.textContent = "+";
    plusButton.addEventListener("click", () => {
      if (currentBalance >= fruit.prix) {
        fruit.quantity += 1;
        currentBalance -= fruit.prix;
        showFruits(fruits);
      }
    });

    minusButton.textContent = "−";
    minusButton.addEventListener("click", () => {
      if (fruit.quantity > 0) {
        fruit.quantity -= 1;
        currentBalance += fruit.prix;
        showFruits(fruits);
      }
    });

    fruitImage.src = fruit.image;
    coinImage.src = "images/bell.png";

    li.appendChild(fruitImage);
    li.innerHTML += `<br><span class="fruit-price">${fruit.prix}</span>`;

    li.appendChild(coinImage);
    li.appendChild(plusButton);
    li.appendChild(quantitySpan);
    li.appendChild(minusButton);
    quantitySpan.textContent = `${fruit.quantity}`;

    fruitList.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const buyButton = document.getElementById("buy-button");
  const confirmationModal = document.getElementById("confirmation-modal");
  const confirmButton = document.getElementById("confirm-buy");
  const cancelButton = document.getElementById("cancel-buy");
  const endModal = document.getElementById("end-modal");
  const endButton = document.getElementById("end-buy");

  function updateConfirmationMessage() {
    const selectedFruits = fruits.filter((fruit) => fruit.quantity > 0);
    const totalBells = selectedFruits.reduce(
      (total, fruit) => total + fruit.quantity * fruit.prix,
      0
    );

    let message = "Êtes-vous sûr de vouloir acheter ";
    selectedFruits.forEach((fruit, index) => {
      message += `${fruit.quantity} ${fruit.nom}`;
      if (index < selectedFruits.length - 1) {
        message += ", ";
      } else {
        message += ` pour ${totalBells} bells ?`;
      }
    });

    const confirmationMessage = document.getElementById("confirmation-message");
    confirmationMessage.textContent = message;
    const buyButton = document.getElementById("buy-button");
    const confirmationModal = document.getElementById("confirmation-modal");

    buyButton.addEventListener("click", () => {
      confirmationModal.style.display = "flex";

      confirmationMessage.textContent = "";

      const messageText = message;
      const animationSpeed = 100;

      typeWriter(messageText, confirmationMessage, animationSpeed);
    });
  }

  buyButton.addEventListener("click", () => {
    updateConfirmationMessage();
    confirmationModal.style.display = "flex";
    console.log("Bouton 'Acheter' cliqué !");
    endModal.style.display = "none";
  });

  confirmButton.addEventListener("click", () => {
    confirmationModal.style.display = "none";
    fruits.forEach((fruit) => {
      fruit.quantity = 0;
    });

    endModal.style.display = "flex";

    showBalance();
    showFruits(fruits);
  });

  cancelButton.addEventListener("click", () => {
    confirmationModal.style.display = "none";
  });

  endButton.addEventListener("click", () => {
    endModal.style.display = "none";
  });
});

function typeWriter(text, element, delay) {
  let i = 0;
  const interval = setInterval(function () {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(interval);
    }
  }, delay);
}

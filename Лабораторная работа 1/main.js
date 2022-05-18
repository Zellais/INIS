// NOTE: The variable "shirts" is defined in the shirts.js file as the full list of shirt offerings
//       You can access this variable here, and should use this variable here to build your webpages

let initProducts = () => {
    // To see the shirts object, run:

    const productsContainer = document.getElementById('products');

    for (let i = 0; i < shirts.length; i++) {
        const shirt = shirts[i];
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const image = document.createElement("img");
        image.src = shirt.colors.white.front;
        image.alt = shirt.name;
        image.classList.add("product-card__img");
        productCard.appendChild(image);

        const productCardInfo = document.createElement("div");
        productCardInfo.classList.add("product-card__info");
        productCard.appendChild(productCardInfo);

        const name = document.createElement("p");
        name.classList.add("product-card__name");
        name.innerText = shirt.name;
        productCardInfo.appendChild(name);
        
        const availableColorsInfo = document.createElement("p");
        availableColorsInfo.classList.add("product-card__colors-info");
        const colorsCount = Object.keys(shirt.colors).length;
        availableColorsInfo.innerText = `Доступны в ${colorsCount} цветах`;
        productCardInfo.appendChild(availableColorsInfo);

        const productCardFooter = document.createElement("div");
        productCardFooter.classList.add("product-cards__footer");
        productCardInfo.appendChild(productCardFooter);
        
        const quickViewBtn = document.createElement("button");
        quickViewBtn.textContent = "Глянуть";
        const seePageLink = document.createElement("a");
        seePageLink.href = `details.html?id=${i}`;
        const seePageBtn = document.createElement("button");
        seePageBtn.textContent = "Просмотр";
        seePageLink.appendChild(seePageBtn);
        productCardFooter.appendChild(quickViewBtn);
        productCardFooter.appendChild(seePageLink);

        productsContainer.appendChild(productCard);
    }
};

let initDetails = () => {
    // To see the shirts object, run:
    
    var shirtColor = "white";
    var shirtSide = "front";

    const params = new URLSearchParams(window.location.search);
    const id = +params.get('id');
    
    var shirt = shirts[id];
    if (shirt == undefined) {
        shirt = shirts[0];
    }

    const image = document.getElementById('productDetailsImage');
    image.src = shirt.colors.white.front;
    image.alt = shirt.name;

    const price = document.getElementById('productPrice');
    price.innerText = shirt.price;
    const description = document.getElementById('productDescription');
    description.innerText = shirt.description;

    const sideParameters = document.getElementById('sideParameters');
    
    const frontBtn = document.createElement("button");
    frontBtn.textContent = "Спереди";
    frontBtn.addEventListener('click', (event) => {
        shirtSide = "front";
        image.src = shirt.colors[shirtColor][shirtSide];
    });
    
    const backBtn = document.createElement("button");
    backBtn.textContent = "Сзади";
    backBtn.addEventListener('click', () => {
        shirtSide = "back";
        image.src = shirt.colors[shirtColor][shirtSide];
    });
    
    sideParameters.appendChild(frontBtn);
    sideParameters.appendChild(backBtn);

    const colorParameters = document.getElementById('colorParameters');
    const colors = Object.keys(shirt.colors);
    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];
        const colorBtn = document.createElement("button");
        colorBtn.textContent = color;
        colorBtn.style.backgroundColor = color;

        colorBtn.addEventListener('click', (event) => {
            shirtColor = event.target.innerText;
            image.src = shirt.colors[shirtColor][shirtSide];
        });

        colorParameters.appendChild(colorBtn)
    }
};
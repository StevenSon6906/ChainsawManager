// Chainsaw Data
const chainsaws = [
    {   name: 'Imperial Chainsword', 
        watts: 3000, 
        imgUrl: 'https://www.king-cart.com/store/oknight/IF_403515_Chainsword.jpg',
        rotationsPerMinute: 7000
    },
    {   name: 'Mark 2 Lancer Assault Rifle Chainsaw',
        watts: 2500, 
        imgUrl: 'https://scontent.flwo1-1.fna.fbcdn.net/v/t39.30808-6/272673676_101218075813179_7487215461000177420_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=e-77IXlbrMUQ7kNvgFc28NK&_nc_ht=scontent.flwo1-1.fna&_nc_gid=A-EyigJAkgiivJrpVy_BPIc&oh=00_AYCITaArvx8npL1qGJrB4rAos2srtB_jFQUEsW3mIzpH7A&oe=6702510F',
        rotationsPerMinute: 6500
    },
    {   name: 'DSG-62H',
        watts: 2900, 
        imgUrl: 'https://static.dnipro-m.ua/cache/products/5684/catalog_origin_317907.jpg',
        rotationsPerMinute: 3200 
    },
    {   name: 'DSG-25H', 
        watts: 750, 
        imgUrl: 'https://static.dnipro-m.ua/cache/products/9689/catalog_origin_476226.jpg',
        rotationsPerMinute: 3500 
    }
];

// Get IDs
const openModalCreate = document.getElementById("open-modal-create-button");
const createChainsawForm = document.getElementById('chainsawCreateForm');
const closeModalButton = document.querySelector('.btn-close');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const isSortByPower = document.getElementById('sort-by-power');
const totalChainsaws = document.getElementById('total-chainsaws');
const exceptionModalElement = document.getElementById('exceptionModal');
const exceptionMessage = document.getElementById('exceptionMessage');

// Sorting ГОТОВО
isSortByPower?.addEventListener('click', () => {
    if (isSortByPower.checked) {
        const sortedChainsaws = chainsaws.slice(0).sort((a, b) => b.watts - a.watts);
        drawList(sortedChainsaws);
    } else {
        drawList(chainsaws);
    }
});

const openExceptionModal = (message) => {
    exceptionMessage.textContent = message;
    const exceptionModal = new bootstrap.Modal(exceptionModalElement);
    exceptionModal.show();
};

openModalCreate?.addEventListener('click', () => {
    const createModal = new bootstrap.Modal(document.getElementById('create-modal'));
    createModal.show();
});

closeModalButton?.addEventListener('click', () => {
    const createModal = bootstrap.Modal.getInstance(document.getElementById('create-modal'));
    createModal.hide();
});


// Search
searchButton?.addEventListener('click', () => {
    const searchValue = searchInput.value;
    const filteredChainsaws = chainsaws.filter((chainsaw) =>
        chainsaw.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    drawList(filteredChainsaws);
});


//Create form
createChainsawForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(createChainsawForm);
    const title = formData.get('Name');
    const power = parseFloat(formData.get('Power'));
    const rotationsPerMinute = parseFloat(formData.get('RPM'));
    const imageUrl = formData.get('ImageUrl');

    const newChainsaw = { name: title, watts: power, imgUrl: imageUrl, rotationsPerMinute: rotationsPerMinute };

    if (validateInput(newChainsaw)) {
        chainsaws.push(newChainsaw);
        createChainsawForm.reset(); // Очищуємо форму після створення бензопили
        const createModal = bootstrap.Modal.getInstance(document.getElementById('create-modal'));
        createModal.hide();
        drawList(chainsaws);
    }
});

// Validation
const validateInput = (chainsaw) => {
    if (!chainsaw.name) {
        openExceptionModal("Name is required");
        return false;
    }
    if (!chainsaw.watts || chainsaw.watts <= 0) {
        openExceptionModal("Power (Watts) is required and must be greater than 0");
        return false;
    }
    if (!chainsaw.rotationsPerMinute || chainsaw.rotationsPerMinute <= 0) {
        openExceptionModal("RPM is required and must be greater than 0");
        return false;
    }
    if (!chainsaw.imgUrl) {
        openExceptionModal("Image URL is required");
        return false;
    }

    // Перевірка формату URL для зображень
    const imageReg = /[\/.](jpg|jpeg|tiff|png)$/i;
    if (!imageReg.test(chainsaw.imgUrl)) {
        openExceptionModal("Invalid image URL format. Accepted formats: jpg, jpeg, tiff, png");
        return false;
    }

    return true;
};

// Remove chainsaw
const removeChainsaw = (index) => {
    chainsaws.splice(index, 1);
    drawList(chainsaws);
};

//Edit chainsaw
const editChainsaw = (index) => {
    const chainsaw = chainsaws[index];
    const form = document.getElementById('chainsawEditForm');
    form['Name'].value = chainsaw.name;
    form['Power'].value = chainsaw.watts;
    form['RPM'].value = chainsaw.rotationsPerMinute;
    form['ImageUrl'].value = chainsaw.imgUrl;

    const editModal = new bootstrap.Modal(document.getElementById('edit-modal'));
    editModal.show();

    const submitEditForm = document.getElementById("submit-edit-form");

    submitEditForm.replaceWith(submitEditForm.cloneNode(true));
    const newSubmitEditForm = document.getElementById("submit-edit-form");

    newSubmitEditForm.addEventListener('click', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const updatedName = formData.get('Name');
        const updatedPower = parseFloat(formData.get('Power'));
        const updatedRPM = parseFloat(formData.get('RPM'));
        const updatedImageUrl = formData.get('ImageUrl');

        if (validateInput({ name: updatedName, watts: updatedPower, rotationsPerMinute: updatedRPM, imgUrl: updatedImageUrl })) {
            chainsaws[index] = { name: updatedName, watts: updatedPower, rotationsPerMinute: updatedRPM, imgUrl: updatedImageUrl };
            editModal.hide();
            drawList(chainsaws);
        }
    });
};

//List render
const drawList = (chainsawList) => {
    totalChainsaws.textContent = chainsawList.length.toString();
    const mainPageShow = document.getElementById("main-page");
    if (!mainPageShow) return;

    mainPageShow.innerHTML = '';
    chainsawList.forEach((el, idx) => {
        const card = document.createElement('div');
        card.className = "col-md-4";
        card.innerHTML = `
            <div class="card bg-secondary text-white shadow-sm h-100">
                <img src="${el.imgUrl}" class="card-img-top" alt="${el.name}">
                <div class="card-body">
                    <h5 class="card-title">${el.name}</h5>
                    <p class="card-text">Power: ${el.watts} Watts</p>
                    <p class="card-text">RPM: ${el.rotationsPerMinute}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-warning" id="edit-${idx}">Edit</button>
                    <button class="btn btn-danger" id="remove-${idx}">Remove</button>
                </div>
            </div>
        `;

        mainPageShow.appendChild(card);

        document.getElementById(`edit-${idx}`).addEventListener('click', () => editChainsaw(idx));
        document.getElementById(`remove-${idx}`).addEventListener('click', () => removeChainsaw(idx));
    });
};

drawList(chainsaws);
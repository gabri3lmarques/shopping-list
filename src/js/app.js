class ShoppingList {
    constructor() {
        this.items = this.loadItems();
        this.itemForm = document.getElementById('itemForm');
        this.itemName = document.getElementById('itemName');
        this.itemQuantity = document.getElementById('itemQuantity');
        this.itemPrice = document.getElementById('itemPrice');
        this.itemCategory = document.getElementById('itemCategory');
        this.itemList = document.getElementById('itemList');
        this.totalPriceElement = document.getElementById('totalPrice');
        this.submitButton = this.itemForm.querySelector('button[type="submit"]');
        this.flashMessage = document.getElementById('flashMessage');
        this.editIndex = null;

        this.itemForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.renderItems();
        this.updateTotalPrice();
    }

    loadItems() {
        const items = localStorage.getItem('shoppingListItems');
        return items ? JSON.parse(items) : [];
    }

    saveItems() {
        localStorage.setItem('shoppingListItems', JSON.stringify(this.items));
    }

    showFlashMessage() {
        this.flashMessage.classList.add('active');
        setTimeout(() => {
            this.flashMessage.classList.remove('active');
        }, 3000);
    }

    handleFormSubmit(event) {
        event.preventDefault();
        const name = this.itemName.value;
        const quantity = parseInt(this.itemQuantity.value);
        const price = parseFloat(this.itemPrice.value);
        const category = this.itemCategory.value;

        if (name && quantity > 0 && price >= 0 && category) {
            if (this.editIndex !== null) {
                this.items[this.editIndex] = { name, quantity, price, category };
                this.editIndex = null;
                this.submitButton.classList.remove('edit');
                this.submitButton.textContent = 'Adicionar Item';
            } else {
                this.items.push({ name, quantity, price, category });
            }
            this.saveItems();
            this.renderItems();
            this.updateTotalPrice();
            this.itemForm.reset();
            this.itemCategory.value = "";
            this.showFlashMessage();
        }
    }

    deleteItem(index) {
        this.items.splice(index, 1);
        this.saveItems();
        this.renderItems();
        this.updateTotalPrice();
    }

    editItem(index) {
        const item = this.items[index];
        this.itemName.value = item.name;
        this.itemQuantity.value = item.quantity;
        this.itemPrice.value = item.price;
        this.itemCategory.value = item.category;
        this.editIndex = index;
        this.submitButton.textContent = 'Salvar';
        this.submitButton.classList.add('edit');
    }

    renderItems() {
        this.itemList.innerHTML = '';
        this.items.forEach((item, index) => {
            const li = document.createElement('li');
            let div = document.createElement('div');
            div.insertAdjacentHTML('beforeend',`<span class="itemName"><strong>${item.name}</strong></span>`);
            div.insertAdjacentHTML('beforeend',`<span class="itemQuantity">${item.quantity}x</span>`);
            div.insertAdjacentHTML('beforeend',`<span class="itemPrice">R$${item.price.toFixed(2)}</span>`);
            div.insertAdjacentHTML('beforeend',`<span class="itemCategory">${item.category}</span>`);
            li.appendChild(div);
            const editButton = document.createElement('button');
            editButton.innerHTML = '&#128221';
            editButton.classList.add('edit-button');
            editButton.onclick = () => this.editItem(index);
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.innerHTML = '&#128163';
            deleteButton.onclick = () => this.deleteItem(index);
            li.appendChild(editButton);
            li.appendChild(deleteButton);
            this.itemList.appendChild(li);
        });
    }

    updateTotalPrice() {
        const totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        this.totalPriceElement.textContent = totalPrice.toFixed(2);
    }
}

document.addEventListener('DOMContentLoaded', () => new ShoppingList());

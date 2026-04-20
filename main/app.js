let foodItems = [];
let editIndex = -1;

function validateForm(name, price, category) {
    let valid = true;

    document.getElementById('err-name').textContent = '';
    document.getElementById('err-price').textContent = '';
    document.getElementById('err-category').textContent = '';
    document.getElementById('foodName').classList.remove('invalid');
    document.getElementById('foodPrice').classList.remove('invalid');
    document.getElementById('foodCategory').classList.remove('invalid');

    if (!name.trim()) {
        document.getElementById('err-name').textContent = 'Food name is required.';
        document.getElementById('foodName').classList.add('invalid');
        valid = false;
    } else if (name.trim().length < 2) {
        document.getElementById('err-name').textContent = 'Name must be at least 2 characters.';
        document.getElementById('foodName').classList.add('invalid');
        valid = false;
    }

    if (price === '' || isNaN(price)) {
        document.getElementById('err-price').textContent = 'Price is required.';
        document.getElementById('foodPrice').classList.add('invalid');
        valid = false;
    } else if (Number(price) <= 0) {
        document.getElementById('err-price').textContent = 'Price must be greater than 0.';
        document.getElementById('foodPrice').classList.add('invalid');
        valid = false;
    }

    if (!category) {
        document.getElementById('err-category').textContent = 'Please select a category.';
        document.getElementById('foodCategory').classList.add('invalid');
        valid = false;
    }

    return valid;
}

// ---- Render Table ----
function renderTable() {
    const tbody = document.getElementById('foodTableBody');
    const section = document.getElementById('tableSection');
    tbody.innerHTML = '';

    if (foodItems.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';

    foodItems.forEach(function (item, index) {
        const row = document.createElement('tr');
        row.innerHTML =
            '<td>' + (index + 1) + '</td>' +
            '<td>' + item.name + '</td>' +
            '<td>₹' + Number(item.price).toFixed(2) + '</td>' +
            '<td>' + item.category + '</td>' +
            '<td>' + (item.description || '—') + '</td>' +
            '<td>' +
            '<button class="btn-edit" onclick="editItem(' + index + ')">Edit</button>' +
            '<button class="btn-delete" onclick="deleteItem(' + index + ')">Delete</button>' +
            '</td>';
        tbody.appendChild(row);
    });
}

// ---- Add / Update Item ----
document.getElementById('foodForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('foodName').value;
    const price = document.getElementById('foodPrice').value;
    const category = document.getElementById('foodCategory').value;
    const desc = document.getElementById('foodDesc').value;

    if (!validateForm(name, price, category)) return;

    const item = { name: name.trim(), price: Number(price), category, description: desc.trim() };

    if (editIndex >= 0) {
        foodItems[editIndex] = item;
        editIndex = -1;
        document.querySelector('.btn-primary').textContent = 'Add Item';
    } else {
        foodItems.push(item);
    }

    renderTable();
    e.target.reset();
});

// ---- Edit Item ----
function editItem(index) {
    const item = foodItems[index];
    document.getElementById('foodName').value = item.name;
    document.getElementById('foodPrice').value = item.price;
    document.getElementById('foodCategory').value = item.category;
    document.getElementById('foodDesc').value = item.description || '';
    editIndex = index;
    document.querySelector('.btn-primary').textContent = 'Update Item';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- Delete Item ----
function deleteItem(index) {
    if (confirm('Delete "' + foodItems[index].name + '"?')) {
        foodItems.splice(index, 1);
        renderTable();
    }
}
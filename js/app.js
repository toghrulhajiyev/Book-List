// Book Constructor
function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

// UI Constructor
function UI() {}

// ADD BOOK TO LIST METHOD
UI.prototype.addBookToList = function(book) {
    // Create tr element
    const row = document.createElement('tr');
    
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
    `;

    // Append row to the <tbody>
    document.querySelector('#book-list').appendChild(row);
}

// VALIDATION METHOD
UI.prototype.showAlert = function(message, className) {
    // Create DIV element
    const validationElement = document.createElement('div');
    // Add Classes
    validationElement.className = `alert ${className}`
    // Create text node
    validationElement.appendChild(document.createTextNode(message));
    // Get the parent element
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    // Insert Alert
    container.insertBefore(validationElement, form);
    // Set timeout
    setTimeout(function() {
        document.querySelector('.alert').remove();
    }, 3000);
}

// DELETE BOOK FROM LIST
UI.prototype.deleteBook = function(target) {
    if(target.className === 'delete') {
        target.parentElement.parentElement.remove(); 
        // Instantiate UI
        const ui = new UI();
        // Show Alert
        ui.showAlert('Book removed!', 'success');
    }
}


// CLEAR INPUT FIELDS METHOD
UI.prototype.clearFields = function() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
}

// STORE IN LOCAL STORAGE
function Store() {}

// Get books in LS
Store.getBooks = function() {
    let books;
    if(localStorage.getItem('books') === null) {
        books = [];
    } else {
        books = JSON.parse(localStorage.getItem('books'));
    }
    
    return books;
}

// Display books in UI
Store.displayBooks = function() {
    const books = Store.getBooks();
    books.forEach(function(book) {
        // Instantiate UI
        const ui = new UI();
        ui.addBookToList(book);
    });
}

// Add books to LS
Store.addBooks = function(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
}

// Remove Books from LS
Store.removeBooks = function(isbn) {
    const books = Store.getBooks();
    books.forEach(function(book, index) {
        if(book.isbn === isbn) {
            books.splice(index, 1);
        }
    });
}

// EVENT LISTENERS
// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// ADD BOOK
document.querySelector('#book-form').addEventListener('submit', function(e) {
    // Get the input values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Instantiate book
    const book = new Book(title, author, isbn);

    // Instatiate UI
    const ui = new UI();

    // Validate
    if(title === '' || author === '' || isbn === '') {
        ui.showAlert('Please fill in all inputs', 'error');
    } else {
    ui.showAlert('Book Added!', 'success');

    // Add Book To LS
    Store.addBooks(book);

    // Add Book To List
    ui.addBookToList(book);

    // Clear Input Fields
    ui.clearFields(book);
    }

    e.preventDefault();
});

// Delete Event Listener
document.querySelector('#book-list').addEventListener('click', function(e) {
    // Instantiate UI
    const ui = new UI;
    // Delete Book
    ui.deleteBook(e.target);
    // Remove Book From LS
    Store.removeBooks(isbn);

    e.preventDefault();
});

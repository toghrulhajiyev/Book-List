// BOOK CLASS
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    } 
}

// UI CLASS
class UI {
    // Add Book To List METHOD
    addBookToList = function(book) {
        // Create <tr> tag
        const row = document.createElement('tr');
        // Create <td>s inside <tr>
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>`;

        // Append 'row' variable to the <tbody> tag
        document.querySelector('#book-list').appendChild(row);
    }

    // Clear input bars after submit METHOD
    clearInputs = function() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    // Remove book from the list METHOD
    removeBook = function(target) {
        if(target.classList.contains('delete')) {
            target.parentElement.parentElement.remove('tr');

            // Instantiate UI
            const ui = new UI();
            
            // Show Alert
            ui.showAlert('Book removed!', 'success');
        }
    }
    
    // Show Alerts METHOD
    showAlert = function(message, className) {
        // Create <div> tag
        const div = document.createElement('div');
        // Add class to the <div> tag
        div.className = `alert ${className}`;
        // Add text to the <div> tag
        div.appendChild(document.createTextNode(message));
        // Get the Parent Element
        const parentElement = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        // Insert <div> tag
        parentElement.insertBefore(div, form);
        // Remove error after 3 seconds
        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 3000);
    }
}

// Local Storage Class
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static displayBooks() {
        const books = Store.getBooks();
        books.forEach(function(book) {
            // Instantiate UI
            const ui = new UI();
            ui.addBookToList(book);
        });
    }

    static addBooks(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBooks(isbn) {
        const books = Store.getBooks();
        books.forEach(function(book, index) {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


// EVENT LISTENERS
// Load books to LS
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// ADD BOOK TO THE LIST
document.querySelector('#book-form').addEventListener('submit', function(e) {
    // Get the value of inputs
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Instantiate Book
    const book = new Book(title, author, isbn);

    // Instantiate UI
    const ui = new UI();

    // Validation
    if(title === '' || author ==='' || isbn ==='') {
        ui.showAlert('Please fill in all inputs', 'error');
    } else {
        // Show Alert
        ui.showAlert('Book added!', 'success');

        // Add book to the LS
        Store.addBooks(book);

        // Add book to the list
        ui.addBookToList(book);

        // Remove inputs
        ui.clearInputs();
    }


    e.preventDefault();
});

// REMOVE BOOK FROM THE LIST
document.querySelector('#book-list').addEventListener('click', function(e) {
    // Instantiate UI
    const ui = new UI();

    // Remove from LS
    Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);

    // Remove Book From List
    ui.removeBook(e.target);

    e.preventDefault();
});
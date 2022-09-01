const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function generateId(){
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted){
    return{
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function findBook(bookId) {
    for (const bookItem of books) {
    if (bookItem.id === bookId) {
        return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function isStorageExist()/* boolean */{
    if (typeof(Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData(){
    if (isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
    const titleBook = document.createElement('h3');
    titleBook.innerText = bookObject.title;

    const authorBook = document.createElement('p');
    authorBook.innerText = 'Penulis : ' + bookObject.author;

    const yearBook = document.createElement('p');
    yearBook.innerText = 'Tahun : ' + bookObject.year;

    const article = document.createElement('article');
    article.classList.add('book_item');
    article.append(titleBook, authorBook, yearBook);

    article.setAttribute('id', `book-${bookObject.id}`);

    if(bookObject.isCompleted){
        const undoButton = document.createElement('button');
        undoButton.classList.add('check');
        undoButton.innerText = 'Belum selesai di Baca';
        
        undoButton.addEventListener('click', function (){
            undoTaskFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('delete');
        trashButton.innerText = 'Hapus buku';

        trashButton.addEventListener('click', function(){
            removeTaskFromCompleted(bookObject.id);
        });

        const bookAction = document.createElement('div');
        bookAction.classList.add('action');
        bookAction.append(undoButton, trashButton);

        article.append(bookAction);

    } else {

        const checkButton = document.createElement('button');
        checkButton.classList.add('check');
        checkButton.innerText = 'Selesai dibaca';

        checkButton.addEventListener('click', function(){
            addTaskToCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('delete');
        trashButton.innerText = 'Hapus buku';

        trashButton.addEventListener('click', function(){
            removeTaskFromCompleted(bookObject.id);
        });
        
        const bookAction = document.createElement('div');
        bookAction.classList.add('action');
        bookAction.append(checkButton, trashButton);
        article.append(bookAction);
    }
    return article;
}

function addBook(){
    const titleBook = document.getElementById('inputBookTitle').value;
    const authorBook = document.getElementById('inputBookAuthor').value;
    const yearBook = document.getElementById('inputBookYear').value;
    const inputBookIsComplete = document.getElementById('inputBookIsComplete');

    if(!inputBookIsComplete.checked){
        const generatedID = generateId();
        const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, false);
        books.push(bookObject);
    } else {
        const generatedID = generateId();
        const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, true);
        books.push(bookObject);
        completeBookshelfList.append(bookObject);
    }
    document.dispatchEvent(new Event(RENDER_EVENT)); 
    saveData(); 
}

function checkButton(){
    const inputBookIsComplete = document.getElementById('inputBookIsComplete');
    inputBookIsComplete.addEventListener('click', function(){
        if(inputBookIsComplete.checked){
            document.getElementById('checkBook').innerHTML = '<strong>Selesai dibaca</strong>';
        } else {
            document.getElementById('checkBook').innerHTML = '<strong>Belum selesai dibaca</strong>';
        }
    });
}

function searchBook(){
    const searchBookTitle = document.getElementById('searchBookTitle').value;
    const titleBook = document.querySelectorAll('article');

    for(const book of titleBook){
        if(!book.innerText.toLowerCase().includes(searchBookTitle.toLowerCase())){
            book.style.display = "none";
        } else {
            book.style.display = "block";
        }
    }
}

function addTaskToCompleted (bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTaskFromCompleted(bookId){
    if(confirm("Apakah yakin untuk menghapus data buku ini ?")){
        const bookTarget = findBookIndex(bookId);
        if (bookTarget === -1) return;
        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }  
}

function undoTaskFromCompleted(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputBook');
    const inputBookIsComplete = document.getElementById('inputBookIsComplete');
    const searchSubmit = document.getElementById('searchSubmit');

    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
        alert("Data buku berhasil ditambahkan !");
    });

    inputBookIsComplete.addEventListener('input', function(event){
        checkButton();
    });

    searchSubmit.addEventListener('click', function(event){
        event.preventDefault();
        searchBook();
    })

    if (isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, function () {
    console.log('Data berhasil di simpan');
});

document.addEventListener(RENDER_EVENT, function(){
    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    const completedBOOKList = document.getElementById('completeBookshelfList');
    uncompletedBOOKList.innerHTML = '';
    completedBOOKList.innerHTML = '';
    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) 
        uncompletedBOOKList.append(bookElement);
        else 
        completedBOOKList.append(bookElement);
    }
});

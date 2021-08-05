const INCOMPLETE_BOOK = "incompleteBookshelfList";
const COMPLETE_BOOK = "completeBookshelfList";

function makeBook(idBook, inputTitle, inputAuthor, inputYear, inputIsComplete) {
    const book = document.createElement("article");
    book.setAttribute("id", idBook)
    book.classList.add("book_item");

    const titleBook = document.createElement("h3");
    titleBook.classList.add("titleBook");
    titleBook.innerText = inputTitle;

    const authorBook = document.createElement("span");
    authorBook.innerText = inputAuthor;

    const yearBook = document.createElement("span");
    yearBook.innerText = inputYear;

    const br = document.createElement("br");

    const content = document.createElement("div");
    content.classList.add("content");

    const actionButton = addAction(inputIsComplete, idBook);

    content.append(titleBook, authorBook, br, yearBook);
    book.append(content, actionButton);

    return book;
}

function addBook() {
    const idBook = +new Date();
    const inputTitle = document.getElementById("inputBookTitle").value;
    const inputAuthor = document.getElementById("inputBookAuthor").value;
    const inputYear = document.getElementById("inputBookYear").value;
    const inputIsComplete = document.getElementById("inputBookIsComplete").checked;

    const book = makeBook(idBook, inputTitle, inputAuthor, inputYear, inputIsComplete);
    const bookObject = composeBookObject(idBook, inputTitle, inputAuthor, inputYear, inputIsComplete);

    books.push(bookObject);

    if (inputIsComplete) {
        document.getElementById(COMPLETE_BOOK).append(book);
    } else {
        document.getElementById(INCOMPLETE_BOOK).append(book);
    }

    updateJson();
}

function addAction(inputIsComplete, idBook) {
    const cardActions = document.createElement("div");
    cardActions.classList.add("action");

    const actionDelete = deleteButton(idBook);
    const actionRead = readButton(idBook);
    const actionUndo = undoButton(idBook);

    if (inputIsComplete) {
        cardActions.append(actionUndo);
    } else {
        cardActions.append(actionRead);
    }

    cardActions.append(actionDelete);

    return cardActions;
}

function deleteButton(idBook) {
    const actionDelete = document.createElement("button");
    actionDelete.classList.add("red");
    actionDelete.innerHTML = '<p>Hapus Buku</p>';

    actionDelete.addEventListener("click", function () {
            const cardParent = document.getElementById(idBook);
            cardParent.addEventListener("eventDelete", function (event) {
                event.target.remove();
            });
            cardParent.dispatchEvent(new Event("eventDelete"));

            deleteBookFromJson(idBook);
            updateJson();
    });

    return actionDelete;
}

function readButton(idBook) {
    const actions = document.createElement("button");
    actions.classList.add("green");
    actions.innerHTML = '<p>Selesai Dibaca</p>';

    actions.addEventListener("click", function () {
        const cardParent = document.getElementById(idBook);

        const titleBook = cardParent.querySelector(".content > h3").innerText;
        const authorBook = cardParent.querySelectorAll(".content > span")[0].innerText;
        const yearBook = cardParent.querySelectorAll(".content > span")[1].innerText;

        cardParent.remove();

        const book = makeBook(idBook, titleBook, authorBook, yearBook, true);
        document.getElementById(COMPLETE_BOOK).append(book);

        deleteBookFromJson(idBook);
        const bookObject = composeBookObject(idBook, titleBook, authorBook, yearBook, true);

        books.push(bookObject);
        updateJson();
    })

    return actions;
}

function undoButton(idBook) {
    const action = document.createElement("button");
    action.classList.add("green");
    action.innerHTML = '<p>Belum Selesai Dibaca</p>';

    action.addEventListener("click", function () {
        const cardParent = document.getElementById(idBook);

        const titleBook = cardParent.querySelector(".content > h3").innerText;
        const authorBook = cardParent.querySelectorAll(".content > span")[0].innerText;
        const yearBook = cardParent.querySelectorAll(".content > span")[1].innerText;

        cardParent.remove();

        const book = makeBook(idBook, titleBook, authorBook, yearBook, false);
        document.getElementById(INCOMPLETE_BOOK).append(book);

        deleteBookFromJson(idBook);
        const bookObject = composeBookObject(idBook, titleBook, authorBook, yearBook, false);

        books.push(bookObject);
        updateJson();
    })

    return action;
}

function bookSearch(keyword) {
    const filter = keyword.toUpperCase();
    const titles = document.getElementsByTagName("h3");

    for (let i = 0; i < titles.length; i++) {
        const titlesText = titles[i].textContent || titles[i].innerText;

        if (titlesText.toUpperCase().indexOf(filter) > -1) {
            titles[i].closest(".book_item").style.display = "";
        } else {
            titles[i].closest(".book_item").style.display = "none";
        }
    }
}
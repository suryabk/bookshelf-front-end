const INCOMPLETE_BOOK = "incompleteBookshelfList";
const COMPLETE_BOOK = "completeBookshelfList";

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

function makeBook(idBook, inputTitle, inputAuthor, inputYear, inputIsComplete) {
    const book = document.createElement("article");
    book.setAttribute("id", idBook)
    book.classList.add("book_item");

    const bookTitle = document.createElement("h5");
    bookTitle.classList.add("titleBook");
    bookTitle.innerText = inputTitle;

    const bookAuthor = document.createElement("span");
    bookAuthor.classList.add("authorBook");
    bookAuthor.innerText = inputAuthor;

    const bookYear = document.createElement("span");
    bookAuthor.classList.add("yearBook");
    bookYear.innerText = inputYear;

    const br = document.createElement("br");

    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");

    const cardAction = addAction(inputIsComplete, idBook);

    cardContent.append(bookTitle, bookAuthor, br, bookYear);
    book.append(cardContent);
    book.append(cardAction);

    return book;
}

function addAction(inputIsComplete, idBook) {
    const cardActions = document.createElement("div");
    cardActions.classList.add("action");

    const actionDelete = createActionDelete(idBook);
    const actionRead = createActionRead(idBook);
    const actionUndo = createActionUndo(idBook);

    cardActions.append(actionDelete);

    if (inputIsComplete) {
        cardActions.append(actionUndo);
    } else {
        cardActions.append(actionRead);
    }

    return cardActions;
}

function createActionDelete(idBook) {
    const actionDelete = document.createElement("button");
    actionDelete.classList.add("btn", "btn-sm", "btn-outline-danger", "mx-1");
    actionDelete.innerHTML = '<i class="bi bi-x"></i>';

    actionDelete.addEventListener("click", function () {
        let confirmation = confirm("apakah anda yakin ingin menghapus buku?");

        if (confirmation) {
            const cardParent = document.getElementById(idBook);
            cardParent.addEventListener("eventDelete", function (event) {
                event.target.remove();
            });
            cardParent.dispatchEvent(new Event("eventDelete"));

            deleteBookFromJson(idBook);
            updateJson();
        }
    });

    return actionDelete;
}

function createActionRead(idBook) {
    const actions = document.createElement("button");
    actions.classList.add("btn", "btn-sm", "btn-outline-primary");
    actions.innerHTML = '<i class="bi bi-check"></i>';

    actions.addEventListener("click", function () {
        const cardParent = document.getElementById(idBook);

        const bookTitle = cardParent.querySelector(".card-content > h3").innerText;
        const bookAuthor = cardParent.querySelectorAll(".card-content > span")[0].innerText;
        const bookYear = cardParent.querySelectorAll(".card-content > span")[1].innerText;

        cardParent.remove();

        const book = makeBook(idBook, bookTitle, bookAuthor, bookYear, true);
        document.getElementById(COMPLETE_BOOK).append(book);

        deleteBookFromJson(idBook);
        const bookObject = composeBookObject(idBook, bookTitle, bookAuthor, bookYear, true);

        books.push(bookObject);
        updateJson();
    })

    return actions;
}

function createActionUndo(idBook) {
    const action = document.createElement("button");
    action.classList.add("btn", "btn-sm", "btn-outline-secondary");
    action.innerHTML = '<i class="bi bi-arrow-counterclockwise"></i>';

    action.addEventListener("click", function () {
        const cardParent = document.getElementById(idBook);

        const bookTitle = cardParent.querySelector(".card-content > h5").innerText;
        const bookAuthor = cardParent.querySelectorAll(".card-content > span")[0].innerText;
        const bookYear = cardParent.querySelectorAll(".card-content > span")[1].innerText;

        cardParent.remove();

        const book = makeBook(idBook, bookTitle, bookAuthor, bookYear, false);
        document.getElementById(INCOMPLETE_BOOK).append(book);

        deleteBookFromJson(idBook);
        const bookObject = composeBookObject(idBook, bookTitle, bookAuthor, bookYear, false);

        books.push(bookObject);
        updateJson();
    })

    return action;
}

function bookSearch(keyword) {
    const filter = keyword.toUpperCase();
    const titles = document.getElementsByTagName("h5");

    for (let i = 0; i < titles.length; i++) {
        const titlesText = titles[i].textContent || titles[i].innerText;

        if (titlesText.toUpperCase().indexOf(filter) > -1) {
            titles[i].closest(".book_item").style.display = "";
        } else {
            titles[i].closest(".book_item").style.display = "none";
        }
    }
}
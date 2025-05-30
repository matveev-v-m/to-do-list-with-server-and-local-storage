let listArray = [],
    listName = ''

// создаем и возвращаем заголовок приложения
function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
}

// создаем и возвращаем форму для создания дела
function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.disabled = true
    buttonWrapper.append(button);
    form.append(input)
    form.append(buttonWrapper)

    input.addEventListener('input', function () {
        if (input.value !== "") {
            button.disabled = false
        } else {
            button.disabled = true
        }
    })

    return {
        form,
        input,
        button
    }
}

// создаем и возвращаем список элементов
function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
}

function createTodoItem(todoItem, {onDone, onDelete}) {
    let item = document.createElement('li');
    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    // устанавливаем стили для элемента списка, а также для размещения кнопок
    // в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

    if (todoItem.done) {
        item.classList.add('list-group-item-success')
    }

    item.textContent = todoItem.name;
    // newItemParam.done ? item.classList.add('list-group-item-success') : item.classList.remove('list-group-item-success');

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    // if (done == true) item.classList.add('list-group-item-success')

    doneButton.addEventListener('click', function () {
        onDone({todoItem, element: item});
        item.classList.toggle('list-group-item-success', todoItem.done )

        // for (const listItem of listArray) {
        //     if (listItem.id == obj.id) listItem.done = !listItem.done
        // }
        // saveList(listArray, listName)

    })
    deleteButton.addEventListener('click', function () {
        onDelete({todoItem, element: item});
        // if (confirm('Вы уверены?')) {
        //     item.remove();

        //     for (let i = 0; i < listArray.length; i++) {
        //         if (listArray[i].id == obj.id) listArray.splice(i, 1)
        //     }

        //     saveList(listArray, listName)
        // }

    })

    // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return item
}


function getNewID(arr) {
    let max = 0;
    for (const item of arr) {
        if (item.id > max) max = item.id
    }
    return max + 1;
}

// function saveList(arr, keyName) {
//     localStorage.setItem(keyName, JSON.stringify(arr));
// }

async function createTodoApp(container, title, keyName, owner) {

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    const handlers = {
        onDone({todoItem}) {
            todoItem.done = !todoItem.done;
            fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
                method: 'PATCH',
                body: JSON.stringify({done: todoItem.done}),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },
        onDelete({todoItem, element}) {
            if(!confirm('Вы уверены ?')) {
                return;
            }
            element.remove();
            fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
                method: 'DELETE',
            })
        },
    };

    listName = keyName;
    // listArray = defArray;

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let localData = localStorage.getItem(listName)

    if (localData !== null && localData !== '') listArray = JSON.parse(localData)

    for (const itemList of listArray) {
        let todoItem = createTodoItem(itemList, handlers);
        todoList.append(todoItem.item);
    }

    const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
    const todoItemList = await response.json();

    todoItemList.forEach(todoItem => {
        const todoItemElement = createTodoItem(todoItem, handlers);
        todoList.append(todoItemElement);
    });


    todoItemForm.form.addEventListener('submit', async function (e) {
        // e.preventDefault();

        if (!todoItemForm.input.value) {
            return;
        }

        const response = await fetch('http://localhost:3000/api/todos', {
            method: 'POST',
            body: JSON.stringify({
                name: todoItemForm.input.value.trim(),
                owner,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const todoItem = await response.json();

        let newItem = {
            id: getNewID(listArray),
            name: todoItemForm.input.value,
            done: false
        }

        let todoItemElement = createTodoItem(todoItem, handlers);

        listArray.push(todoItem)

        saveList(listArray, listName)

        todoList.append(todoItemElement.item);

        todoItemForm.button.disabled = true;
        todoItemForm.input.value = '';
    })
}

export { createTodoApp };

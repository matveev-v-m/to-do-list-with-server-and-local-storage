let listArray = []


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
    list.id = 'listId'
    return list;
}

function  createTodoItem(todoItem, {onDone, onDelete}) {
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

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';    

    doneButton.addEventListener('click', function () {
        onDone({todoItem, element: item});
        item.classList.toggle('list-group-item-success', todoItem.done )
    })

    deleteButton.addEventListener('click', function () {
        onDelete({todoItem, element: item});        
    })
    // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return item
}

async function createTodoApp(container, {
    title,    
    owner,
    todoItemList = [],
    onCreateFormSubmit,
    onDoneClick,
    onDeleteClick,
}) {

    let todoAppTitle =  createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    const handlers = {onDone: onDoneClick, onDelete: onDeleteClick};        

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    for (const itemList of listArray) {
        let todoItem = createTodoItem(itemList, handlers);
        todoList.append(todoItem.item);
    }
    
     todoItemList.forEach(todoItem => {
        const todoItemElement =  createTodoItem(todoItem, handlers);
        todoList.append(todoItemElement);
    });

    todoItemForm.form.addEventListener('submit', async function (e) {        
        e.preventDefault();
        if (!todoItemForm.input.value) {
            return;
        }

        const todoItem = await onCreateFormSubmit({
            owner,
            name: todoItemForm.input.value.trim(),
        });       

        let todoItemElement = createTodoItem(todoItem, handlers);

        listArray.push(todoItem)        

        todoList.append(todoItemElement);

        todoItemForm.button.disabled = true;
        todoItemForm.input.value = '';
    })
}

export { createTodoApp };

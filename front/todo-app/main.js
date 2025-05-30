export async function runTodoApp(title, owner, type) { 

    let start = await import( './view.js');
    
    let create = await import(type)
    
    // create.getTodoList;
    // create.createTodoItem;
    // create.switchTodoItemDone;
    // create.deleteTodoItem;
    
    await (async () => {
        const todoItemList = await create.getTodoList(owner);
        await start.createTodoApp(document.getElementById('todo-app'), {
            title: title,
            owner,
            todoItemList,
            onCreateFormSubmit: create.createTodoItem,
            onDoneClick: create.switchTodoItemDone,
            onDeleteClick: create.deleteTodoItem,
        });
    })(); 
}




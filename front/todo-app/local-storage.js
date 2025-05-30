let owner = '';

function saveList(arr, owner) {
    localStorage.setItem(owner, JSON.stringify(arr));
}

export async function getTodoList(owner) {
    let data =  localStorage.getItem(owner);
    
    if(data !== null && data !== ''){
        return await JSON.parse(data);
    }    
}

export  function createTodoItem({ owner, name }) {   
    let data =  JSON.parse(localStorage.getItem(owner));
        
    if(data === null){
        data = []
    }
    
    const newData = {
        id: Date.now(),
        name: name,
        done: false,
        owner,
    };
    
    data.push(newData)
    localStorage.setItem(owner, JSON.stringify(data));    
    
    return newData    
}

export async function switchTodoItemDone({ todoItem }) { 
    todoItem.done = !todoItem.done;
    const listArray = await getTodoList(todoItem.owner);        
    for( let i = 0 ; i < listArray.length ; i++ ){
        if(listArray[i].id === todoItem.id) listArray[i].done = !listArray[i].done; 
        
    }   
       
    saveList(listArray, todoItem.owner);    
}

export async function deleteTodoItem({ element, todoItem }) {
    const listArray = await getTodoList(todoItem.owner);
    
    if(confirm('Вы уверены?')) {
        element.remove();
        for( let i = 0 ; i < listArray.length ; i++ ){
            if(listArray[i].id === todoItem.id) listArray.splice(i, 1);
        }  
    }
    
    saveList(listArray, todoItem.owner);    
}
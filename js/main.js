document.addEventListener('DOMContentLoaded', function(){
  'use strict';
  let form = document.querySelector('.todo-control'),
      todoList = document.getElementById('todo'),
      completedList = document.getElementById('completed'),
      headerInput = document.querySelector('.header-input');

      //создаем объект
  let data = {
    todo: [],
    completed: [],
  };
  //проверяем localStorage на наличие данных
  if (localStorage.getItem('localData')){
    data = JSON.parse(localStorage.getItem('localData'));
  }

    // функция - рендерит данные если они есть в localstorage
  let renderItemsForUpdate = function(){
    if (!data.todo.length && !data.completed.length) {return;}

    for(let i = 0; i < data.todo.length; i++) {
      renderItem(data.todo[i]);
    }

    for (let i = 0; i < data.completed.length; i++) {
      renderItem(data.completed[i], true);
    }
  };
  // функция записи в localStorage 
  let dataUpdateToLocalStorage = function(){
    localStorage.setItem('localData', JSON.stringify(data));
    console.log(localStorage.getItem('localData'));
    
  };

  // функция добавления элемента на страницу
  let addItem = function(text){
    renderItem(text);
    headerInput.value = '';
    data.todo.push(text);

    dataUpdateToLocalStorage(); // сохраняет данные после добавления item
  };


  // функция удаления элемента из его родителя
  let itemRemove = function(elem){
    let item = elem.parentNode.parentNode;
    let itemParent = item.parentNode;
    let id = itemParent.id;
    let text = item.text;

    if (id === 'todo') {
      data.todo.splice(data.todo.indexOf(text), 1);
    } else {
      data.completed.splice(data.completed.indexOf(text), 1);
    }

    itemParent.removeChild(item);

    dataUpdateToLocalStorage();
  };

  // фунцкия переноса элемента
  let itemComplete = function(elem){
    let item = elem.parentNode.parentNode;
    let itemParent = item.parentNode;
    let id = itemParent.id;
    let text = item.innerText;

    let target;

    if (id === 'todo') {
      target = completedList;
    } else {
      target = todoList;
    }

    if (id === 'todo') {
      data.todo.splice(data.todo.indexOf(text), 1);
      data.completed.push(text);
    } else {
      data.completed.splice(data.completed.indexOf(text), 1);
      data.todo.push(text);
    }
   
    
    itemParent.removeChild(item);
    target.insertBefore(item, target.childNodes[0]);

    dataUpdateToLocalStorage();
  };
  
  // функция рэнднринга одного элемента
  let renderItem = function(text, completed = false){
    let item = document.createElement('li');
    let btnBlock = document.createElement('div');
    let btnRemove = document.createElement('button');
    let btnComplete = document.createElement('button');

    let list = todoList;
    if (completed) {
      list = completedList;
    } else {
      list = todoList;
    }

    item.textContent = text;
    item.className = 'todo-item';
    btnBlock.className = 'todo-buttons';
    btnRemove.className = 'todo-remove';
    btnComplete.className = 'todo-complete';



    

    btnRemove.addEventListener('click', function(event){
      itemRemove(event.target);
    });

    btnComplete.addEventListener('click', function(event){
      itemComplete(event.target);
    });

    btnBlock.appendChild(btnRemove);
    btnBlock.appendChild(btnComplete);
    item.appendChild(btnBlock);

    

    list.insertBefore(item, list.childNodes[0]);


  };

  // 
  form.addEventListener('submit', function(event){
    event.preventDefault();

    if (headerInput.value !== ''){
      addItem(headerInput.value.trim());
    }
  });
  // вызов функции, которая при наличии данных в storage отрендерит их 
  renderItemsForUpdate();

});
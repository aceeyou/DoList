let list = document.querySelector("#todolist");
let doneList = document.querySelector("#done-list");
let todo = document.querySelector(".todo");

let doneContainer = document.querySelector(".done-container");
let taskContainer = document.querySelector(".task-container");
let taskItem = document.querySelector(".task");

let userInput = document.querySelector("#user-input");
let delBtn = document.querySelector(".delete-btn");

let taskCount = document.querySelector("#task-count");

let bread = document.querySelector(".item-deleted");
let addedBread = document.querySelector(".added-todo");
let arr = [];
let delArr = [];
let doneArr = [];

let obj;
const taskNodes = list.children;

let myJSON;
let mydoneJson;

let index=0;


// Grab input of user
document.querySelector("#enter-btn").addEventListener('click', function(e) {
    let value = userInput.value;
    if(value){
        // appearBreadcrumb();
        addTodo(value);
        userInput.value = "";
    }
});

if(delBtn){
    delBtn.addEventListener('click', function(e) {
        console.log("delete event");
    });
}


// Add new todo on top
function addTodo(value){
    arr.unshift(value);
    saveData();
    
    // console.log(value.innerText);
}


// Delete task
function deleteTask(e){
    let i=0;
    let text = e.innerText;
    delArr.unshift(text);   // adds text to delete array for undo purposes
    
    while(i < arr.length){
        if(arr[i] === text){
            arr.splice(i, 1);
            console.log("Item removed");
            break;
        }
        i++;
    }
    deleteBread();
    e.remove();
    saveData();
}

// Save data to todo localstorage
function saveData(){
    let str = JSON.stringify(arr)
    localStorage.setItem("todoJSON", str)
    getData();
    addSuccessBread();
}

// Get Data from localstorage
function getData(){
    let str = localStorage.getItem("todoJSON");
    arr = JSON.parse(str);
    if(!str){
        myJSON = localStorage.setItem("todoJSON", JSON.stringify(arr))
    }
    displayTasks(arr);
}


// MOVE TASKS TO HTML : working
function displayTasks(myJson){
    deleteItems(list);
    taskCount.innerText = arr.length;
    if(arr.length > 0) {
        document.querySelector(".tasks").style.minHeight = "40px";
        todo.style.justifyContent = "initial";
        todo.style.marginTop = "150px";
        todo.style.transition = "300ms";
    } else {
        document.querySelector(".tasks").style.minHeight = "0";
        todo.style.justifyContent = "center";
        todo.style.marginTop = "0px";
    }
    
    for(let i = 0; i < myJson.length; i++){
        let template = `
        <div class="task">
        <img class="handle" src="images/menu.png" alt="">
        <p class="task-text">${myJson[i]}</p>
        <div class="buttons">
        <button onclick="addDoneTask(this.parentNode.parentNode)" class="done-btn"><img class="done" src="images/checkmark.png" alt=""></button>
        <button onclick="deleteTask(this.parentNode.parentNode)" class="delete-btn"><img class="delete" src="images/del.png" alt=""></button>
        </div>
        </div>
        `;
        list.insertAdjacentHTML("beforeend", template);
    }
}





// Done List functions

// Place done task to the done list array
function addDoneTask(e){
    let text = e.innerText;
    let i=0;

    doneArr.unshift(text);
    console.log("addDoneTask");

    while (i < arr.length){
        if(arr[i] === text){
            arr.splice(i, 1);
            saveData();
            break;
        }
        i++;
    }
    console.log("arr: " + arr);
    console.log("doneArr: " + doneArr);

    saveDoneData();
}

// Places an item to Do List when checked off from Done List
function addFromDone(value){
    let text = value.innerText;
    let i=0;

    arr.unshift(text);

    while (i < doneArr.length){
        if(doneArr[i] === text){
            doneArr.splice(i, 1);
            saveDoneData();
            break;
        }
        i++;
    }

    saveData();
}  

// Saves doneArr to the local storage
function saveDoneData(){
    let str = JSON.stringify(doneArr);
    localStorage.setItem("doneJSON", str);
    
    document.querySelector(".done-count").innerText = doneArr.length;

    getDoneTask();
}

// Fetches the data from the local storage
function getDoneTask(){

    let str = localStorage.getItem("doneJSON");
    doneArr = JSON.parse(str);
    if(!str){
        mydoneJson = localStorage.setItem("doneJSON", JSON.stringify(arr));
    }
    placeDoneList(doneArr)
}

// Puts done taks to done list html
function placeDoneList(doneArr){
    deleteItems(doneList);
    document.querySelector(".donetask-count").innerText = doneArr.length;

    for(let i = 0; i < doneArr.length; i++){
        let template = `
            <div class="task">
            <img class="handle" src="images/menu.png" alt="">
            <p class="task-text">${doneArr[i]}</p>
            <div class="buttons">
            <button onclick="addFromDone(this.parentNode.parentNode)" class="done-btn"><img class="done" src="images/checkmark-black.png" alt=""></button>
            <button onclick="deleteTask(this.parentNode.parentNode)" class="delete-btn"><img class="delete" src="images/del.png" alt=""></button>
            </div>
            </div>
            `;
            doneList.insertAdjacentHTML("beforeend", template);
    }
}

// Display the pop up display for Done List
function displayDoneScreen(){
    document.querySelector(".input-container").style.opacity = ".2";
    taskContainer.style.opacity = ".2";
    document.querySelector(".title").style.opacity = ".2"

    doneContainer.style.display = "flex";    
}

// Hide Done List pop up
function hideDoneTasks() {
    doneContainer.style.display = "none";

    document.querySelector(".input-container").style.opacity = "1";
    taskContainer.style.opacity = "1";
    document.querySelector(".title").style.opacity = "1"
}

// Checks whether user clicked outside the Done List div or not
doneContainer.addEventListener('click', function(e) {
    if(e.target.closest(".done-task"))
        return;
    
    hideDoneTasks();
});

// Undo task delete 
async function undoDelete(){
    console.log(delArr);
    index = delArr.length - 1;
    if(index >= 0){
        addTodo(delArr[0]);
        delArr.shift();
        index--;
    }
    await sleep(4000);
    bread.style.bottom = "-40px";
    bread.style.visibility = "hidden";
}


// Breadcrumb
async function deleteBread() {
    bread.style.visibility = "visible";
    bread.style.bottom = "50px";
    
    await sleep(7000);
    
    bread.style.bottom = "-40px";
    bread.style.visibility = "hidden";
}

async function addSuccessBread() {
    addedBread.style.visibility = "visible";
    addedBread.style.bottom = "50px";
    
    await sleep(2000);
    
    addedBread.style.bottom = "-40px";
    addedBread.style.visibility = "hidden";
}


// Reset the DOM
function deleteItems(list){
    while(list.firstChild){
        list.removeChild(list.firstChild);
    }
}

// sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

getData();
saveData();

getDoneTask();
saveDoneData();


// showing notification

function showNotification(){
    const notification = new Notification("Do List: Finish you tasks", {
        body: "Have you finished anything today?",
        icon: "images/checkmark-green.png"
    });

    notification.onclick = (e) => {
        window.location.href = "index.html";
    };
}

// Notification Feature
console.log(Notification.permission);
if(Notification.permission === "granted"){
    showNotification();
} else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
        if(permission ==="granted"){
            showNotification();
        }
    });
}




// Sortable functions : makes items draggable and sortable

new Sortable(list, {
    handle: ".handle",
    delay: 1,
    delayOnTouchOnly: true,
    preventOnFilter: true,
    animation: 300,
    onUpdate: function () {
        grabItems()
    }
})

new Sortable(doneList, {
    handle: ".handle",
    delay: 1,
    delayOnTouchOnly: true,
    preventOnFilter: true,
    animation: 300,
    onUpdate: function () {
        saveDoneData();
    }
})
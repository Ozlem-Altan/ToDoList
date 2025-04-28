
const form = document.querySelector("#todoAddForm");
const addInput = document.querySelector("#todoName");
const todoList=document.querySelector(".list-group");
const clearButton=document.querySelector("#clearButton");
const cardfilter=document.querySelector(".card-filter");
const cardbodymain=document.querySelector(".card-body-main");
const filterinput = document.querySelector("#todoSearch");
let todos=[];

runEvents();

function runEvents(){
    form.addEventListener("submit",addTodo); // submit olduğunda addTodo çalıştır
    document.addEventListener("DOMContentLoaded",pageLoaded) // sayfa yüklendiğinde pageLoaded metodu çalıştır
    cardbodymain.addEventListener("click",removeTodoToUI);
    clearButton.addEventListener("click",removeAllTodosEverywhere);
    filterinput.addEventListener("keyup",filter); // her tuşta arama yapsın diye key up
}
function pageLoaded(){ // sayfa yüklendiğinde storage kayıtlı veriler var ise onları ekranda gösterme
    checkTodosFromStorage();
    todos.forEach(function(todo){
        addTodoToUI(todo);
    });

}
function filter(e){
    const value = e.target.value.toLowerCase().trim(); // arama yapılacak değeriin hepsini küçük ve boşlukları temizleyerek aramak için
    const todolistesi = document.querySelectorAll(".list-group-item");

    if(todolistesi.length>0){
        todolistesi.forEach(function(todo){
            if(todo.textContent.toLowerCase().trim().includes(value)) // yazdığım veri listedeki verilerin içersinde var mı (todo aslında li biz linin içindeki textte arama yapacağız)
                {
                todo.setAttribute("style","display : block");
            }
            else
            {
                todo.setAttribute("style","display : none !important");
            }
        });
    }
    else{
        showAlert("warning","Filtreleme işlemi için liste dolu olmalıdır.")
    }
}
function removeAllTodosEverywhere(){
    
  const todolistesi = document.querySelectorAll(".list-group-item");
  if(todolistesi.length>0){
    // ekrandan silme
    todolistesi.forEach(function(todo){
        todo.remove();
    });

    // storageden silme
    todos=[];
    localStorage.setItem("todos",JSON.stringify(todos));
    showAlert("success","Tüm liste temizlendi.");

  }
  else{
    showAlert("warning","Bu işlem için en az bir veri olmalıdır.")
  }
}
function removeTodoToUI(e){
    if(e.target.className==="fa-remove"){
       // ekrandan silme
        const todo = e.target.parentElement.parentElement;// i etiketinin parenti a ya ulaşıp onunda parenti li ye ulaştık.
        todo.remove();

        // storage den silme
        removeTodoToStorage(todo.textContent); // silinecek değerin textini aldık

        showAlert("success","To-do silindi.") 
    }
}
function removeTodoToStorage(removeTodo){
    checkTodosFromStorage();
    todos.forEach(function(todo,index){ // döndüğüm arraydaki tot ve indeks değerlerini bu şekilde alabilirim
        if(removeTodo===todo){
            todos.splice(index,1); // splice metodu js de arrayleri silmek içinn kullanılır. İşlem yapılacak indeks no ve o indeks devamında kaç datada silme yapacaksa onu yazarız. Todonun indeks nosunu yazarak ve devamında 1 yazarak sadece kendisini sildik
        }
    });
    localStorage.setItem("todos",JSON.stringify(todos)); // localstroage a güncel todos dizinini aktardık
}

function addTodo(e){
 

    const inputText = addInput.value.trim(); // sağ ve soldaki tüm boşlukları çıkar
    if(inputText == null || inputText ==""){
        showAlert("warning","Lütfen bir değer giriniz.")
    }
    else{
        // Arayüze ekleme
        addTodoToUI(inputText); // arayüze eklenmesi yapıldıktan sonra
        // Storage ekleme
        addTodoToStorage(inputText); // data storage e eklendi
        showAlert("success","To-do eklendi.")
    }

    e.preventDefault(); // submit ile farklı bir sayfaya yönlendirmesini kapatmak için
}

function addTodoToUI(newTodo){

    const li = document.createElement("li");
    li.className="list-group-item";
    li.textContent = newTodo;

    
    const a = document.createElement("a");
    a.href="#";
    //a.className = newTodo;

    
    const i = document.createElement("i");
    i.className = "fa-remove";
    
    a.appendChild(i);
    li.appendChild(a);
    todoList.appendChild(li);
    
    addInput.value="";

}

function addTodoToStorage(newTodo){
    checkTodosFromStorage();
    todos.push(newTodo);// gönderilen datayı da ekle array e  
    localStorage.setItem("todos",JSON.stringify(todos)); // ve bu array i todos key i ile storage e ekle
}

function checkTodosFromStorage(){
    if(localStorage.getItem("todos")===null){ // local storage de todos keyine ait data var mı 
        todos=[]; 
    }
    else{
        todos=JSON.parse(localStorage.getItem("todos")); // eğer var ise array e çevir ve todos değişkenine at
    }
}

function showAlert(type,message){

    const div=document.createElement("div");
    div.className=`custom-alert alert-${type}`;
    div.textContent=message;

    cardfilter.appendChild(div);
    
    setTimeout(function(){ // 2.5 saniye sonra eklenen div kaldırılacak
        div.remove();
    },2500);
}
import './style.css'
import {io} from 'socket.io-client'

const socket = io("http://localhost:3001")

let computers = document.getElementById("computers")
let selectedIndex = 100;
let invIndex = 0;
let lastclicked = '';

let oldjson;
let oldIndex;

socket.on("hello", () => {
  console.log("conn")
})

let el = document.createElement("p")
document.body.append(el)

socket.on("ping", (data) => {
  //console.log(data);
  if(JSON.stringify(data) !== oldjson || oldIndex !== selectedIndex) {
    renderComputerList(Object.keys(data), Object.values(data))
  }
  oldIndex = selectedIndex
  oldjson = JSON.stringify(data)
})

socket.on("inventory", (data) => {
  console.log(data);
  renderInventory(data)
})

let buttons = document.getElementsByTagName('button');

for(let i = 0; i < buttons.length; i++) {
  if(buttons[i].getAttribute('command')) {
    buttons[i].addEventListener('click', () => {
      console.log(buttons[i].getAttribute('command'))
      buttons[i].getAttribute('command')
      socket.emit("command", {command: buttons[i].getAttribute('command')})
    })
  }
  else if(buttons[i].getAttribute('servercommand')) {
    buttons[i].addEventListener('click', () => {
      socket.emit("servercommand", {command: buttons[i].getAttribute('servercommand')})
    })
  }
  else if(buttons[i].getAttribute('commands')) {
    buttons[i].addEventListener('click', () => {
      let rep = document.getElementById("repeats")
      switch (buttons[i].getAttribute('commands')) {
        case 'mine':
          socket.emit("commands", {command: 'mine', repeats: parseInt(rep.value), params: [parseInt(document.getElementById("minex").value), parseInt(document.getElementById("miney").value)]})
          break;
        
        case 'tunnel':
          socket.emit("commands", {command: 'tunnel', repeats: parseInt(rep.value), params: [parseInt(document.getElementById("tunnelx").value), parseInt(document.getElementById("tunnely").value)]})
          break;
      }
    })
  }
}

function c(elementName, options) {
  let element = document.createElement(elementName);
  if (options) {
    if (options.text) {element.innerText = options.text}
    if (options.class) {element.classList.add(options.class)}
    if (options.id) {element.id = options.id}
    if (options.type) {element.type = options.type}
    if (options.placeholder) {element.placeholder = options.placeholder}
    if (options.href) {element.href = options.href}
    if (options.elements) {
      for (let i = 0; i < options.elements.length; i++) {
        element.append(options.elements[i])
      }
    }
  }

  return element
}

let addtolist = document.getElementById('addtolist')
addtolist.addEventListener('click', () => {
  document.getElementById('sendlistta').value += lastclicked
  console.log(lastclicked);
})

function renderComputerList(list, data) {
  console.log("bruh",data);

  computers.innerHTML = ''

  for(let i = 0; i < list.length; i++) {
    let el;
    if(i == selectedIndex) {
      if(data[i].ishalted) {
        el = c("div", {class: "selected", elements: [c("em", {text: list[i]}), c("small", {text: data[i].fuel})]})
      }
      else {
        el = c("div", {class: "selected", elements: [c("p", {text: list[i]}), c("small", {text: data[i].fuel})]})
      }
      document.getElementById("instructions").innerHTML = ''
      for(let j = 0; j < data[i].commands.length; j++) {
        let inel = c("pre", {text: JSON.stringify(data[i].commands[j])})
        document.getElementById("instructions").append(inel)
      }
    }
    else {
      if(data[i].ishalted) {
        el = c("div", {elements: [c("em", {text: list[i]}), c("small", {text: data[i].fuel})]})
      }
      else {
        el = c("div", {elements: [c("p", {text: list[i]}), c("small", {text: data[i].fuel})]})
      }
    }
    el.addEventListener("click", () => {
      if(document.getElementById('sendlistta').value.length < 5) {
        socket.emit("selection", [list[i]])
      }
      else {
        let computers = document.getElementById('sendlistta').value.split('\n').slice(0,-1)
        console.log(computers);
        socket.emit("selection", computers)
      }
      selectedIndex = i;
      lastclicked = el.innerText.split('\n')[0] + '\n';
      console.log(el1);
    })

    computers.append(el)
    
  }

  console.log(data)
}

function renderInventory(data) {
  document.getElementById("inv").innerHTML = '';
  for(let i = 0; i < 16; i++) {
    let el1
    if(data[i].item != undefined) {
      if(i == invIndex) {
        el1 = c('p', {text: data[i].item?.count+" "+data[i].item?.name.split(':')[1], class: "selected"})
      }
      else {
        el1 = c('p', {text: data[i].item?.count+" "+data[i].item?.name.split(':')[1]})
      }
    } 
    else {
      if(i == invIndex) {
        el1 = c('p', {text: "empty", class: "selected"})
      }
      else {
        el1 = c('p', {text: "empty"})
      }
    }
    el1.addEventListener("click", () => {
      console.log(i+1);
      socket.emit("command", {command: "selectinv", index: i+1})
      invIndex = i
      renderInventory(data)
    })
    document.getElementById("inv").append(el1)
  }
}
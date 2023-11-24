#!/usr/bin/env node
const { table } = require("table");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const options = ["Make new task", "Mark task as completed", "Delete task"];
let tasks = [];

// Utility functions
function getCurrentDateTime() {
  let currentDate = new Date();
  return `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()} @ ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
}

function checkBlank(taskInput) {
  if (!taskInput.trim()) {
    console.clear();
    console.log(generateTable());
    console.log("\nInput cannot be blank.\n");
    displayOptions();
    return true;
  }
  return false;
}

// Table generation functions
function generateTable() {
  let data = tasks.map((task, index) => [index + 1, task[0], task[1], task[2]]);
  data.unshift(["ID", "Task", "Status", "Date"]);
  return table(data);
}

// Task management functions
function newTask(taskInput) {
  tasks.push([taskInput, "pending", getCurrentDateTime()]);
  console.clear();
  console.log(generateTable());
}

function findTaskIndex(taskInput) {
  if (isNaN(taskInput)) {
    return tasks.findIndex(
      (subarray) => subarray[0].toLowerCase() === taskInput.toLowerCase()
    );
  } else {
    let index = parseInt(taskInput) - 1;
    if (index < 0 || index >= tasks.length) {
      return -1;
    }
    return index;
  }
}

function markCompleted(taskInput) {
  let index = findTaskIndex(taskInput);
  if (index === -1) {
    console.clear();
    console.log(generateTable());
    console.log("\nTask not found.\n");
    return;
  }
  tasks[index][1] = "completed";
  console.clear();
  console.log(generateTable());
}

function deleteTask(taskInput) {
  let index = findTaskIndex(taskInput);
  if (index !== -1) {
    tasks.splice(index, 1);
    console.clear();
    console.log(generateTable());
    console.log(`task ${taskInput} has been deleted`);
  } else {
    console.clear();
    console.log(generateTable());
    console.log("Task not found.\n");
  }
}

// User interaction functions
function displayOptions() {
  options.forEach((option, index) => {
    console.log(`[${index + 1}] ${option}`);
  });
  console.log();
}

function askQuestion() {
  rl.question("What would you like to do: ", (choice) => {
    const selectedOption = options[choice - 1];
    if (selectedOption === "Make new task") {
      rl.question("\nWhat should this task be called: ", (taskInput) => {
        if (checkBlank(taskInput)) return askQuestion();
        newTask(taskInput);
        displayOptions();
        askQuestion();
      });
    } else if (selectedOption === "Mark task as completed") {
      rl.question(
        "\nWhich task should be marked as completed: ",
        (taskInput) => {
          if (checkBlank(taskInput)) return askQuestion();
          markCompleted(taskInput.toLowerCase());
          displayOptions();
          askQuestion();
        }
      );
    } else if (selectedOption === "Delete task") {
      rl.question("\nWhich task should be deleted: ", (taskInput) => {
        if (checkBlank(taskInput)) return askQuestion();
        deleteTask(taskInput);
        displayOptions();
        askQuestion();
      });
    } else {
      console.clear();
      console.log(generateTable());
      displayOptions();
      console.log("Invalid choice\n");
      askQuestion();
    }
  });
}

// Initial setup
console.clear();
console.log(generateTable());
displayOptions();
askQuestion();

const commands = [
  {
    command: "$ echo 'Hello, I am João Pedro Sacheti'",
    output: "Hello, I am João Pedro Sacheti",
  },
  {
    command: "$ echo 'a Senior Software Developer with 10 years of xp specialized in Java and AWS'",
    output: "a Senior Software Developer with 10 years of xp specialized in Java and AWS",
  },
  {
    command: "$ echo 'focused on creating efficient and secure systems.'",
    output: "focused on creating efficient and secure systems.",
  },
];
const typingSpeed = 30;
const executionDelay = 150; // Delay after command is typed
let commandIndex = 0;
let charIndex = 0;
const terminalContentElement = document.querySelector('.terminal-content');
function typeCommand() {
  if (commandIndex < commands.length) {
    if (charIndex === 0) {
      terminalContentElement.innerHTML += "<span class='command'></span>";
    }
    let currentCommand = commands[commandIndex].command;
    let spanCommand = terminalContentElement.querySelector('.command:last-of-type');
    if (charIndex < currentCommand.length) {
      spanCommand.innerHTML += currentCommand.charAt(charIndex);
      charIndex++;
      setTimeout(typeCommand, typingSpeed);
    } else {
      spanCommand.innerHTML += '<br>';
      charIndex = 0;
      setTimeout(executeCommand, executionDelay);
    }
  }
}
function executeCommand() {
  let output = commands[commandIndex].output;
  terminalContentElement.innerHTML += output + '<br><br>';
  commandIndex++;
  if (commandIndex < commands.length) {
    setTimeout(typeCommand, executionDelay);
  }
}
document.addEventListener('DOMContentLoaded', function () {
  typeCommand();
});

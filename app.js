// Employee class
class Employee {
  constructor(id, name, baseSalary) {
    this.id = id;
    this.name = name;
    this.baseSalary = baseSalary;
    this.bonus = 0;
    this.checkInTime = null;
    this.checkOutTime = null;
  }

  setBonus(amount) {
    this.bonus = amount;
  }

  checkIn() {
    this.checkInTime = new Date();
  }

  checkOut() {
    this.checkOutTime = new Date();
  }

  getTotalSalary() {
    return this.baseSalary + this.bonus;
  }

  getCheckInTime() {
    return this.checkInTime ? this.checkInTime.toLocaleTimeString() : "-";
  }

  getCheckOutTime() {
    return this.checkOutTime ? this.checkOutTime.toLocaleTimeString() : "-";
  }
}

// EMS class to manage employees
class EMS {
  constructor() {
    this.employees = [];
    this.nextId = 1;
  }

  addEmployee(name, baseSalary) {
    const employee = new Employee(this.nextId++, name, baseSalary);
    this.employees.push(employee);
    return employee;
  }

  findEmployeeById(id) {
    return this.employees.find(emp => emp.id === id);
  }

  setEmployeeBonus(id, amount) {
    const emp = this.findEmployeeById(id);
    if (emp) {
      emp.setBonus(amount);
    }
  }

  employeeCheckIn(id) {
    const emp = this.findEmployeeById(id);
    if (emp) {
      emp.checkIn();
    }
  }

  employeeCheckOut(id) {
    const emp = this.findEmployeeById(id);
    if (emp) {
      emp.checkOut();
    }
  }
}

// UI and interaction logic

const ems = new EMS();

const nameInput = document.getElementById("nameInput");
const salaryInput = document.getElementById("salaryInput");
const addBtn = document.getElementById("addBtn");
const employeeTableBody = document.querySelector("#employeeTable tbody");

// Render employees in the table
function renderEmployees() {
  employeeTableBody.innerHTML = "";

  ems.employees.forEach(emp => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${emp.id}</td>
      <td>${emp.name}</td>
      <td>${emp.baseSalary.toFixed(2)}</td>
      <td>${emp.bonus.toFixed(2)}</td>
      <td>${emp.getTotalSalary().toFixed(2)}</td>
      <td>${emp.getCheckInTime()}</td>
      <td>${emp.getCheckOutTime()}</td>
      <td>
        <input type="number" class="bonusInput" min="0" placeholder="Bonus" id="bonus-${emp.id}" />
        <button class="setBonusBtn" data-id="${emp.id}">Set Bonus</button>
        <button class="checkInBtn" data-id="${emp.id}">Check In</button>
        <button class="checkOutBtn" data-id="${emp.id}">Check Out</button>
      </td>
    `;

    employeeTableBody.appendChild(tr);
  });

  // Add event listeners to buttons dynamically created

  document.querySelectorAll(".setBonusBtn").forEach(button => {
    button.onclick = () => {
      const id = Number(button.getAttribute("data-id"));
      const bonusInput = document.getElementById(`bonus-${id}`);
      const bonusValue = parseFloat(bonusInput.value);
      if (!isNaN(bonusValue) && bonusValue >= 0) {
        ems.setEmployeeBonus(id, bonusValue);
        renderEmployees();
      } else {
        alert("Enter a valid bonus amount");
      }
    };
  });

  document.querySelectorAll(".checkInBtn").forEach(button => {
    button.onclick = () => {
      const id = Number(button.getAttribute("data-id"));
      ems.employeeCheckIn(id);
      renderEmployees();
    };
  });

  document.querySelectorAll(".checkOutBtn").forEach(button => {
    button.onclick = () => {
      const id = Number(button.getAttribute("data-id"));
      ems.employeeCheckOut(id);
      renderEmployees();
    };
  });
}

addBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const salary = parseFloat(salaryInput.value);

  if (!name) {
    alert("Please enter employee name");
    return;
  }
  if (isNaN(salary) || salary <= 0) {
    alert("Please enter a valid base salary");
    return;
  }

  ems.addEmployee(name, salary);
  nameInput.value = "";
  salaryInput.value = "";
  renderEmployees();
});

// Initial render
renderEmployees();

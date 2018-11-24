const budgetController = (function() {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const calculateTotal = function(type) {
    let sum = 0;

    data.allItems[type].forEach(function(item) {
      sum += item.value;
    });

    data.totals[type] = sum;
  };

  const data = {
    allItems: {
      expense: [],
      income: []
    },
    totals: {
      expense: 0,
      income: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItems: function(type, desc, val) {
      let item;

      const id = data.allItems[type].length ? data.allItems[type][data.allItems[type].length - 1].id + 1 : 0;

      if (type === 'expense') {
        item = new Expense(id, desc, val);
      } else {
        item = new Income(id, desc, val);
      }

      data.allItems[type].push(item);
      return item;
    },

    calculateBudget: function() {
      calculateTotal('income');
      calculateTotal('expense');

      data.budget = data.totals.income - data.totals.expense;

      if (data.totals.income <= 0) return;

      data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalIncome: data.totals.income,
        totalExpense: data.totals.expense,
        percentage: data.percentage
      };
    },

    log: function() {
      console.log(data);
    }
  };
})();

const UIController = (function() {
  const DOMstrings = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentLabel: '.budget__expenses--percentage'
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        desc: document.querySelector(DOMstrings.inputDesc).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(obj, type) {
      let html, className;

      if (type === 'income') {
        className = DOMstrings.incomeContainer;
        html = `
          <div class="item clearfix" id="income-${obj.id}">
            <div class="item__description">${obj.description}</div>
            <div class="right clearfix">
                <div class="item__value">+ ${obj.value}</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
          </div>
        `;
      } else {
        className = DOMstrings.expenseContainer;
        html = `
          <div class="item clearfix" id="expense-${obj.id}">
            <div class="item__description">${obj.description}</div>
            <div class="right clearfix">
                <div class="item__value">- ${obj.value}</div>
                <div class="item__percentage">21%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
          </div>
        `;
      }

      document.querySelector(className).insertAdjacentHTML('beforeend', html);
    },

    clearFields: function() {
      const fields = document.querySelectorAll(DOMstrings.inputDesc + ', ' + DOMstrings.inputValue);

      const fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(elem) {
        elem.value = '';
      });

      fieldsArr[0].focus();
    },

    displayBudget: function(obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalIncome;
      document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExpense;
      document.querySelector(DOMstrings.percentLabel).textContent = obj.percentage > 0 ? obj.percentage + '%' : '-';
    },

    getDOMStrings: function() {
      return DOMstrings;
    }
  };
})();

const controller = (function(budgetCtrl, UICtrl) {
  const setupEventListeners = function() {
    const DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if (!(event.keyCode === 13)) return false;

      ctrlAddItem();
    });
  };

  const updateBudget = function() {
    budgetCtrl.calculateBudget();

    const budget = budgetCtrl.getBudget();

    // console.log(budget);
    UICtrl.displayBudget(budget);
  };

  const ctrlAddItem = function() {
    const input = UICtrl.getInput();

    if (input.desc === '' || isNaN(input.value) || input.value === 0) return false;

    const newItem = budgetCtrl.addItems(input.type, input.desc, input.value);

    UICtrl.addListItem(newItem, input.type);

    UICtrl.clearFields();

    updateBudget();
  };

  return {
    init: function() {
      UICtrl.displayBudget({
        budget: 0,
        totalIncome: 0,
        totalExpense: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();

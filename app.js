const budgetController = (function() {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
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

    deleteItem: function(type, id) {
      const ids = data.allItems[type].map(function(curr) {
        return curr.id;
      });

      const index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      calculateTotal('income');
      calculateTotal('expense');

      data.budget = data.totals.income - data.totals.expense;

      if (data.totals.income <= 0) return;

      data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
    },

    calculatePercentage: function() {
      data.allItems.expense.forEach(function(curr) {
        curr.calcPercentage(data.totals.income);
      });
    },

    getPercentages: function() {
      const allPerc = data.allItems.expense.map(function(curr) {
        return curr.getPercentage();
      });
      return allPerc;
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
    percentLabel: '.budget__expenses--percentage',
    container: '.container',
    expPercentageLabel: '.item__percentage'
  };

  const formatNumber = function(num, type) {
    num = Math.abs(num);
    num = num.toFixed(2);
    const numSplit = num.split('.');

    let int = numSplit[0];

    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }
    let dec = numSplit[1];

    return (type === 'expense' ? '-' : '+') + ' ' + int + '.' + dec;
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
                <div class="item__value">${formatNumber(obj.value, type)}</div>
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
                <div class="item__value">${formatNumber(obj.value, type)}</div>
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

    deleteListItem: function(selectorId) {
      const elem = document.getElementById(selectorId);

      elem.parentNode.removeChild(elem);
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
      const type = obj.budget > 0 ? 'income' : 'expense';

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'income');
      document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExpense, 'expense');
      document.querySelector(DOMstrings.percentLabel).textContent = obj.percentage > 0 ? obj.percentage + '%' : '-';
    },

    displayPercentages: function(percentages) {
      const elems = document.querySelectorAll(DOMstrings.expPercentageLabel);

      const nodeListForEach = function(list, callback) {
        for (let i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(elems, function(curr, idx) {
        curr.textContent = percentages[idx] > 0 ? percentages[idx] + '%' : '-';
      });
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

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  const updateBudget = function() {
    budgetCtrl.calculateBudget();

    const budget = budgetCtrl.getBudget();

    // console.log(budget);
    UICtrl.displayBudget(budget);
  };

  const updatePercentage = function() {
    budgetCtrl.calculatePercentage();

    const allPerc = budgetCtrl.getPercentages();

    UICtrl.displayPercentages(allPerc);
  };

  const ctrlAddItem = function() {
    const input = UICtrl.getInput();

    if (input.desc === '' || isNaN(input.value) || input.value === 0) return false;

    const newItem = budgetCtrl.addItems(input.type, input.desc, input.value);

    UICtrl.addListItem(newItem, input.type);

    UICtrl.clearFields();

    updateBudget();

    updatePercentage();
  };

  const ctrlDeleteItem = function(event) {
    const itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemId) {
      const splitId = itemId.split('-');
      const type = splitId[0];
      const id = parseInt(splitId[1], 10);

      budgetCtrl.deleteItem(type, id);

      UICtrl.deleteListItem(itemId);

      updateBudget();

      updatePercentage();
    }
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

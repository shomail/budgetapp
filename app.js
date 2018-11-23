const budgetController = (function() {

  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  const data = {
    allItems: {
      expense: [],
      income: []
    },
    totals: {
      expense: 0,
      income: 0
    }
  }

  return {
    addItems: function(type, desc, val) {
      let item;

      const id = data.allItems[type].length ? data.allItems[type][data.allItems[type].length - 1].id + 1 : 0;

      if(type === 'expense'){
        item = new Expense(id, desc, val);
      }else{
        item = new Income(id, desc, val);
      }
      
      data.allItems[type].push(item);
      return item;
    },

    log: function(){
      console.log(data);
    }
  }

})();

const UIController = (function() {
  const DOMstrings = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        desc: document.querySelector(DOMstrings.inputDesc).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },

    addListItem: function(obj, type) {
      let html, className;

      if(type === 'income') {
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
      }else {
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

  const ctrlAddItem = function() {
    const input = UICtrl.getInput();

    const newItem = budgetCtrl.addItems(input.type, input.desc, input.value);

    UICtrl.addListItem(newItem, input.type);
  };

  return {
    init: function() {
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();

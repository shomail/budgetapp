const budgetController = (function() {})();

const UIController = (function() {})();

const controller = (function(budgetCtrl, UICtrl) {
  const ctrlAddItem = function() {
    console.log('working');
  };

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function(event) {
    if (!(event.keyCode === 13)) return false;

    ctrlAddItem();
  });
})(budgetController, UIController);

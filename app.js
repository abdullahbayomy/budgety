// BUDGETY CONTROLLER
let budgetController = (function() {
  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, des, val) {
      let newItem, ID;
      // Create new ID *arr.length - 1 + 1*
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      // Push into our data structure
      data.allItems[type].push(newItem);

      // return new element
      return newItem;
    },
    testing: function() {
      console.log(data);
    }
  };
})();

// UI CONTROLLER
let UIController = (function() {
  let DOMstring = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstring.inputType).value, // will be inc or exp
        description: document.querySelector(DOMstring.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstring.inputValue).value)
      };
    },
    DOMstring,
    addListItem: function(obj, type) {
      let html, element;

      // Create html string
      if (type === 'inc') {
        element = DOMstring.incomeContainer;
        html = `
              <div class="item clearfix" id="${obj.id}">
                  <div class="item__description">${obj.description}</div>
                  <div class="right clearfix">
                    <div class="item__value">${obj.value}</div>
                    <div class="item__delete">
                       <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                  </div>
              </div>
             `;
      } else if (type === 'exp') {
        element = DOMstring.expensesContainer;
        html = `
            <div class="item clearfix" id="${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                <div class="item__value">${obj.value}</div>
                   <div class="item__percentage">21%</div>
                    <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
         </div>
        `;
      }

      // insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', html);
    },
    clearFields: function() {
      let fields, fieldsArr;

      fields = document.querySelectorAll(
        `${DOMstring.inputDescription}, ${DOMstring.inputValue}`
      );
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(current) {
        current.value = '';
      });

      fieldsArr[0].focus();
    }
  };
})();

// GLOBAL APP CONTROLLER
let controller = (function(budgetCtrl, UICtrl) {
  let setUpEventListeners = function() {
    let DOMstring = UICtrl.DOMstring;

    document
      .querySelector(DOMstring.inputBtn)
      .addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  let ctrlAddItem = function() {
    let input, newItem;
    // 1. Get the field input data
    input = UICtrl.getInput();

    if (input.description !== '' && input.value > 0 && !isNaN(input.value)) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);
      // Clear input Fields
      UICtrl.clearFields();
      // 5. Calculate the budget
      // 6. Display the budget to the UI
    }
  };

  return {
    init: function() {
      console.log('Application Started...');
      setUpEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();

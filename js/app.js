$(function(){

    var modelTotal = {
        totalClickCount: 0
    };

    var adminViewable = {
        viewable: false
    };

    var model = {
        currentCat: null,
        cats:   [   {name: "Baskets", img: "catpic1.jpg", clickCount: 0},
                    {name: "Pickles", img: "catpic2.jpg", clickCount: 0},
                    {name: "Sir Leo", img: "catpic3.jpg", clickCount: 0},
                    {name: "Buckets & Jingles", img: "catpic4.jpg", clickCount: 0},
                    {name: "Jarv", img: "catpic5.jpg", clickCount: 0},
                    {name: "Cowboy", img: "catpic6.jpg", clickCount: 0}
                ]
    };

//================================= Octopus =========================================

    var octopus = {
        init: function() {
            model.currentCat = model.cats[0];

            listView.init();
            catView.init();
        },

        getCurrentCat: function() {
            return model.currentCat;
        },

        getCats: function() {
            return model.cats;
        },

        setCurrentCat: function(cat) {
            model.currentCat = cat;
        },

        incrementCounter: function() {
            model.currentCat.clickCount++;
            catView.render();
        },
        // when called this function makes and array of all the numbers in cats.clickCount
        clickCountArray: function() {
            var clickCountArray = model.cats.map(function(a) {return a.clickCount;});
            //console.log(clickCountArray);
            return clickCountArray;
        },
        // Sums up the items in clickCount for a total clickCount
        clickCountArraySum: function() {
            var clickCountArray = octopus.clickCountArray();
            var sum = clickCountArray.reduce(add, 0);
            function add(a,b) {
                return a + b;
            }
            //console.log(sum);
            return sum;
        },
        //using a seperate model, keeps real click-count, not editable in admin
        totalCount: function() {
            return modelTotal.totalClickCount;
        },

        totalCounter: function() {
            modelTotal.totalClickCount++;
            catView.totalRender();
        },

        openAdmin: function(viewable) {
            catView.adminButton.disabled = true;
            adminViewable.viewable = true;
            //console.log(adminViewable.viewable);
            this.adminSwitch();
        },

        closeAdmin: function(viewable) {
            catView.adminButton.disabled = false;
            adminViewable.viewable = false;
            //console.log(adminViewable.viewable);
            this.adminSwitch();
        },

        adminSwitch: function() {
            if (adminViewable.viewable === true) {adminView.render();} else {adminView.hide();};
        },

        nameChanger: function() {
            model.currentCat.name = document.getElementById('name-input').value;
            catView.render();
            listView.render();
        },

        urlChanger: function() {
            model.currentCat.img = document.getElementById('imgUrl-input').value;
            catView.render();
        },

        clickCountChanger: function() {
            var val = document.getElementById('clickCount-input').value;

            if (!isNaN(val))
            {
            model.currentCat.clickCount = Math.round(document.getElementById('clickCount-input').value);
            catView.render(), catView.totalRender();
            }
            else
            {
            alert('You must enter a number to change that value.'),
            document.getElementById('clickCount-input').value = null;
            };
        }
    };

//================================= Views ===========================================

    var catView = {
        init: function() {
            this.catElem = document.getElementById('cat');
            this.catNameElem = document.getElementById('cat-name');
            this.catImageElem = document.getElementById('cat-img');
            this.countElem = document.getElementById('cat-count');
            this.clickElem = document.getElementById('total-click-count');
            this.adminButton = document.getElementById('admin-button');

            this.catImageElem.addEventListener('click', function(e){
                octopus.incrementCounter();
            });

            this.clickElem.textContent = "";
            $('.catPic').click(function(e) {
                octopus.totalCounter();
            });

            this.adminButton.addEventListener('click', function(e){
                octopus.openAdmin();
            });
            this.render();
        },

        render: function() {
            var currentCat = octopus.getCurrentCat();
            this.countElem.textContent = "You've clicked "+currentCat.name+" "+ currentCat.clickCount+" time(s)!";
            this.catNameElem.textContent = currentCat.name;
            this.catImageElem.src = currentCat.img;
        },

        totalRender: function() {
            var totalCount = octopus.totalCount();
            var sumCats = octopus.clickCountArraySum();
            this.clickElem.textContent = "You've clicked a cat "+totalCount+"(actual) or "+sumCats+"(editable) time(s)!";
        }
    };

    var listView = {
        init: function() {
            this.listElem = document.getElementById('cat-list');
            this.render();
        },

        render: function() {
        var cats = octopus.getCats();
        this.listElem.innerHTML = '';

            for (var i = 0; i < cats.length; i++) {
                var cat = cats[i];
                var elem = document.createElement('li');
                elem.textContent = cat.name;
                elem.classList.add('btn','btn-primary','btn-block','cat-sel');

                elem.addEventListener('click', (function(cat) {
                    return function() {
                        octopus.setCurrentCat(cat);
                        catView.render();
                    };
                })(cat));
                this.listElem.appendChild(elem);
            };
        }
    };

    var adminView = {

        render: function() {
            this.catWindow = document.getElementById('cat-window');
            this.adminForm = document.getElementById('admin-form');
            this.adminForm.style.visibility = "visible";
            this.catWindow.classList.add("col-md-8");
            this.catWindow.style.width = "auto";
            this.adminForm.classList.add("col-md-4");
            this.adminForm.style.height = "auto";
            this.adminForm.style.width = "auto";
            this.adminForm.innerHTML = '';

// Name Form

            var nameLabel = document.createElement('label');
            nameLabel.innerHTML = 'Name:';
            nameLabel.setAttribute("for","name-input");
            this.adminForm.appendChild(nameLabel);

            var nameInputElem = document.createElement('input');
            nameInputElem.id = "name-input";
            nameInputElem.classList.add('form-control');
            this.adminForm.appendChild(nameInputElem);

// imgUrl Form

            var imgUrlLabel = document.createElement('label');
            imgUrlLabel.innerHTML = 'Img Url:';
            imgUrlLabel.setAttribute("for","imgUrl-input");
            this.adminForm.appendChild(imgUrlLabel);

            var imgUrlInputElem = document.createElement('input');
            imgUrlInputElem.id = "imgUrl-input";
            imgUrlInputElem.classList.add('form-control');
            this.adminForm.appendChild(imgUrlInputElem);

// clickCount Form

            var clickCountLabel = document.createElement('label');
            clickCountLabel.innerHTML = 'Click Count:';
            clickCountLabel.setAttribute("for","clickCount-input");
            this.adminForm.appendChild(clickCountLabel);

            var clickCountInputElem = document.createElement('input');
            clickCountInputElem.id = "clickCount-input";
            clickCountInputElem.classList.add('form-control');
            this.adminForm.appendChild(clickCountInputElem);

// Buttons
            var cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.classList.add('btn','btn-warning');
            cancelButton.setAttribute("type","button");
            this.adminForm.appendChild(cancelButton);

            cancelButton.addEventListener('click', (function(e) {
                octopus.closeAdmin();
            }));

            var saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.classList.add('btn','btn-success');
            saveButton.setAttribute("type","button");
            this.adminForm.appendChild(saveButton);

            saveButton.addEventListener('click', (function(e) {
                if (document.getElementById('name-input').value.length > 0) {octopus.nameChanger();} else {return null};
            }));

            saveButton.addEventListener('click', (function(e) {
                if (document.getElementById('imgUrl-input').value.length > 0) {octopus.urlChanger();} else {return null};
            }));

            saveButton.addEventListener('click', (function(e) {
                if (document.getElementById('clickCount-input').value.length > 0) {octopus.clickCountChanger();} else {return null};
            }));
        },

        hide: function() {
            this.catWindow.style.width = "100%";
            this.catWindow.classList.remove("col-md-8");
            this.adminForm.classList.remove("col-md-4");
            this.adminForm.style.visibility = "hidden";
            this.adminForm.style.height = "0";
            this.adminForm.style.width = "0";
        }
    };
    octopus.init();
});

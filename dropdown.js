(function () {
    var uuid = function (id) {
        return function () {
            return id++;
        };
    }(0);
    var LEFT = 37;
    var UP = 38;
    var RIGHT = 39;
    var DOWN = 40;
    var ENTER = 13;
    var SPACE = 32;
    var ESC = 27;
    var TAB = 9;
    var Dropdown = window.Dropdown = function (wrapper, options) {
        var self = this;
        var preventClose = false;
        this.select = wrapper.querySelector('select');
        this.wrapper = wrapper;
        this.button = document.createElement('button');
        this.menu = document.createElement('ul');
        this.events = {};
        this.menu.id = 'menu_' + uuid();
        this.setValue(this.select.options[this.select.selectedIndex]);
        for (var i = 0; i < this.select.options.length; i++) {
            var li = document.createElement('li');
            li.id = this.menu.id + '_' + uuid();
            li.setAttribute('tabindex', 0);
            li.setAttribute('role', 'menuitem');
            li.innerText = this.select.options[i].innerText;
            li.setAttribute('data-value', this.select.options[i].getAttribute('value') || this.select.options[i].innerText);
            if (this.select.selectedIndex === i) {
                this.button.setAttribute('aria-activedescendent', li.id);
            }
            this.menu.appendChild(li);
        }
        this.button.onclick = function (e) {
            e && e.preventDefault && e.preventDefault();
            self.open();
            return false;
        };
        this.button.onkeydown = function (e) {
            e = e || window.event;
            if (e.keyCode === SPACE || e.keyCode === UP || e.keyCode === DOWN || e.keyCode === ENTER) {
                e.preventDefault && e.preventDefault();
                self.open();
                return false;
            }
        };
        this.menu.onkeydown = function (e) {
            e = e || window.event;
            var selected = document.activeElement;
            if (e.keyCode === UP) {
                e.preventDefault && e.preventDefault();
                selected = selected.previousSibling || selected.parentNode.lastChild;
                selected.focus();
                return false;
            } else if (e.keyCode === DOWN) {
                e.preventDefault && e.preventDefault();
                selected = selected.nextSibling || selected.parentNode.firstChild;
                selected.focus();
                return false;
            } else if (e.keyCode === ESC || e.keyCode === TAB) {
                if (e.keyCode === ESC)
                    e.preventDefault && e.preventDefault();
                self.close();
                self.button.focus();
                if (e.keyCode === ESC)
                    return false;
            } else if (e.keyCode === ENTER || e.keyCode === SPACE) {
                e.preventDefault && e.preventDefault();
                self.button.focus();
                self.close();
                self.setValue(selected);
                return false;
            }
        };
        this.menu.onclick = function (e) {
            e = e || window.event;
            self.button.focus();
            self.close();
            self.setValue(e.target || e.srcElement);
        };
        this.wrapper.onclick = function (e) {
            preventClose = true;
        };
        if (document.addEventListener) {
            document.addEventListener('click', function () {
                if (!preventClose) {
                    if (self.button.getAttribute('aria-expanded') === 'true') {
                        self.button.focus();
                    }
                    self.close();
                }
                preventClose = false;
            });
        } else if (document.attachEvent) {
            document.attachEvent('onclick', function () {
                if (!preventClose) {
                    if (self.button.getAttribute('aria-expanded') === 'true') {
                        self.button.focus();
                    }
                    self.close();
                }
                preventClose = false;
            });
        }
        this.menu.setAttribute('role', 'menu');
        this.button.setAttribute('aria-haspopup', 'true');
        this.button.setAttribute('aria-owns', this.menu.id);
        this.close();
        this.wrapper.appendChild(this.button);
        this.wrapper.appendChild(this.menu);
        this.wrapper.removeChild(this.select);
    };
    Dropdown.prototype.setValue = function (option) {
        this.button.setAttribute('aria-activedescendent', option.id);
        this.button.value = option.value || option.innerText;
        this.button.innerText = option.innerText;
    };
    Dropdown.prototype.open = function () {
        this.button.setAttribute('aria-expanded', 'true');
        this.menu.setAttribute('aria-expanded', 'true');
        document.getElementById(this.button.getAttribute('aria-activedescendent')).focus();
    };
    Dropdown.prototype.close = function () {
        this.button.setAttribute('aria-expanded', 'false');
        this.menu.setAttribute('aria-expanded', 'false');
    };
    Dropdown.prototype.destroy = function () {
        this.wrapper.removeChild(this.button);
        this.wrapper.removeChild(this.menu);
        this.wrapper.appendChild(this.select);
        this.button = null;
    };
}());
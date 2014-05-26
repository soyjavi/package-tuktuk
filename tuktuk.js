/*
TukTuk - Simple (but powerful) RWD Framework
http://tuktuk.tapquo.com
Copyright (c) 2011-2014 Tapquo S.L. - Licensed GPLv3, Commercial

@namespace  Tuktuk
@author     Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
*/


(function() {
  var TukTuk,
    __slice = [].slice;

  window.TukTuk = TukTuk = {};

  TukTuk.VERSION = "0.9.0";

  TukTuk.dom = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (typeof $$ !== "undefined" && $$ !== null) {
      return $$.apply(null, args);
    } else {
      return $.apply(null, args);
    }
  };

  TukTuk.ready = TukTuk.dom().ready;

}).call(this);

(function() {
  window.TukTuk.Accordion = (function(tk) {
    return {
      init: (function() {
        return tk.dom("[data-tuktuk=accordion]").each(function(index, element) {
          var accordion, activator;
          accordion = tk.dom(element);
          activator = accordion.find("[data-accordion=activator]").first();
          return activator.on("click", function(event) {
            if (accordion.hasClass("active")) {
              return accordion.removeClass("active");
            } else {
              return accordion.addClass("active");
            }
          });
        });
      })()
    };
  })(TukTuk);

}).call(this);

(function() {
  TukTuk.Box = (function(tk) {
    var box, hide, lock, show;
    lock = void 0;
    box = void 0;
    show = function(box_id) {
      box = tk.dom("[data-tuktuk=boxes] #" + box_id).first();
      box.addClass("active");
      return this;
    };
    hide = function() {
      box.removeClass("active");
      return this;
    };
    return {
      _Instance: (function() {
        tk.dom("[data-tuktuk=boxes] aside.absolute").each(function(index, element) {
          var modal;
          modal = tk.dom(element);
          return modal.html("<div>" + modal.html() + "</div>");
        });
        tk.dom("[data-tuktuk=boxes] [data-box=close]").on("click", function() {
          return TukTuk.Box.hide();
        });
        return tk.dom("[data-tuktuk-box]").on("click", function() {
          return TukTuk.Box.show(tk.dom(this).attr('data-tuktuk-box'));
        });
      })(),
      show: show,
      hide: hide
    };
  })(TukTuk);

}).call(this);

(function() {
  window.TukTuk.Button = (function(tk) {
    /*
        @todo: Describe method
    */

    var loading;
    loading = function(selector, value) {
      var button;
      if (value == null) {
        value = true;
      }
      button = tk.dom(selector);
      if (button.length > 0) {
        if (value) {
          button.attr("disabled", "disabled");
          button.attr("data-loading", "true");
          return button.prepend("<div class=\"loading\">\n  <div class=\"container\">\n      <span class=\"top\"></span>\n      <span class=\"right\"></span>\n      <span class=\"bottom\"></span>\n      <span class=\"left\"></span>\n  </div>\n</div> ");
        } else {
          button.removeAttr("disabled").removeAttr("data-loading");
          return button.children(".loading").remove();
        }
      }
    };
    return {
      loading: loading
    };
  })(TukTuk);

}).call(this);

(function() {
  TukTuk.Events = (function(tk) {
    return {
      init: (function() {
        return TukTuk.dom("[data-control=checkbox]").on("change", function(event) {
          var checked, el, input;
          event.preventDefault();
          el = TukTuk.dom(this);
          input = el.find("input");
          checked = input[0].checked;
          input.val(checked.toString());
          el.removeClass("checked");
          if (checked) {
            return el.addClass("checked");
          }
        });
      })()
    };
  })(TukTuk);

}).call(this);

(function() {
  var hidebar;

  hidebar = function() {
    var browser, browserRegex, hideURLbar, isMobile;
    browser = navigator.userAgent;
    browserRegex = /(Android|BlackBerry|IEMobile|Nokia|iP(ad|hone|od)|Opera M(obi|ini))/;
    isMobile = false;
    if (browser.match(browserRegex)) {
      hideURLbar = function() {
        return window.scrollTo(0, 1);
      };
      isMobile = true;
      return addEventListener("load", (function() {
        return setTimeout(hideURLbar, 0);
      }), false);
    }
  };

}).call(this);

(function() {
  window.TukTuk.Modal = (function(tk) {
    var alert, confirm, hide, loading, lock, modal, prompt, show;
    lock = void 0;
    modal = void 0;
    /*
        @todo: Describe method
    */

    show = function(modal_id) {
      lock.addClass("active").show();
      this._hideAnyModal();
      modal = tk.dom("[data-tuktuk=modal]#" + modal_id).addClass("active");
      return this;
    };
    /*
        @todo: Describe method
    */

    hide = function() {
      lock.removeClass("active");
      if (modal != null) {
        modal.removeClass("active");
      }
      setTimeout(function() {
        return lock.attr("data-loading", "false").hide();
      }, 250);
      return this;
    };
    alert = function(message) {
      var text;
      if (message == null) {
        message = "";
      }
      modal = tk.dom("[data-tuktuk=modal][data-modal=alert]");
      text = modal.find("#text");
      text.html(message);
      modal.find("button.success").on("click.Modal.alert", function() {
        return hide();
      });
      lock.addClass("active").show();
      this._hideAnyModal();
      modal.addClass("active");
      return this;
    };
    confirm = function(message, true_cb, false_cb) {
      var accept_button, cancel_button, doCallback, text;
      if (message == null) {
        message = "";
      }
      modal = tk.dom("[data-tuktuk=modal][data-modal=confirm]");
      text = modal.find("#text");
      accept_button = modal.find("button.success");
      cancel_button = modal.find("button.alert");
      doCallback = function(callback) {
        hide();
        accept_button.unbind("click.Modal.confirm");
        cancel_button.unbind("click.Modal.confirm");
        if (callback) {
          return setTimeout(callback, 250);
        }
      };
      text.html(message);
      accept_button.on("click.Modal.confirm", function() {
        return doCallback(true_cb);
      });
      cancel_button.on("click.Modal.confirm", function() {
        return doCallback(false_cb);
      });
      lock.addClass("active").show();
      this._hideAnyModal();
      modal.addClass("active");
      return this;
    };
    prompt = function(message, callback) {
      var accept_button, cancel_button, content, text;
      if (message == null) {
        message = "";
      }
      modal = tk.dom("[data-tuktuk=modal][data-modal=prompt]");
      text = modal.find("#text");
      content = modal.find("#content");
      accept_button = modal.find("button.success");
      cancel_button = modal.find("button.alert");
      text.html(message);
      accept_button.on("click.Modal.prompt", function() {
        content = content.val();
        hide();
        accept_button.unbind("click.Modal.prompt");
        if (callback) {
          return setTimeout(function() {
            return callback(content);
          }, 250);
        }
      });
      cancel_button.on("click.Modal.prompt", function() {
        return hide();
      });
      content.val("");
      lock.addClass("active").show();
      this._hideAnyModal();
      modal.addClass("active");
      return this;
    };
    /*
        @loading: Describe method
    */

    loading = function(text) {
      this._hideAnyModal();
      lock.attr("data-loading", "true").addClass("active").show();
      return this;
    };
    return {
      _hideAnyModal: function() {
        return tk.dom("[data-tuktuk=modal]").removeClass("active");
      },
      _Instance: (function() {
        var alert_template, confirm_template, loading_template, prompt_template;
        tk.dom("[data-tuktuk=modal].side").each(function(index, element) {
          modal = tk.dom(element);
          return modal.html("<div>" + modal.html() + "</div>");
        });
        tk.dom("[data-tuktuk=modal] [data-modal=close]").on("click", function() {
          return TukTuk.Modal.hide();
        });
        tk.dom("[data-tuktuk-modal]").on("click", function() {
          return TukTuk.Modal.show(tk.dom(this).attr('data-tuktuk-modal'));
        });
        loading_template = "<div data-tuktuk=\"lock\" data-loading=\"false\">\n  <div class=\"loading\"></div>\n</div>";
        alert_template = "<div data-tuktuk=\"modal\" data-modal=\"alert\" class=\"column_5\">\n  <header class=\"bck alert\">\n    <h4 class=\"text thin inline\">Alert</h4>\n  </header>\n  <article id=\"text\" class=\"text big\"></article>\n  <footer>\n    <button class=\"button large success on-right margin-bottom\">\n      <span class=\"icon ok\"></span>\n    </button>\n  </footer>\n</div>";
        prompt_template = "<div data-tuktuk=\"modal\" data-modal=\"prompt\" class=\"column_5\">\n  <header class=\"bck alert\">\n    <h4 class=\"text thin inline\">Alert</h4>\n  </header>\n  <article class=\"text big\">\n    <form>\n      <label for=\"content\" id=\"text\"/>\n      <input type=\"text\" id=\"content\"/>\n    </form>\n  </article>\n  <footer>\n    <button class=\"button large alert on-right margin-bottom\">\n      <span class=\"icon remove\"></span>\n    </button>\n    <button class=\"button large success on-right margin-bottom margin-right\">\n      <span class=\"icon ok\"></span>\n    </button>\n  </footer>\n</div>";
        confirm_template = "<div data-tuktuk=\"modal\" data-modal=\"confirm\" class=\"column_5\">\n  <header class=\"bck alert\">\n    <h4 class=\"text thin inline\">Confirm</h4>\n  </header>\n  <article id=\"text\" class=\"text big\"></article>\n  <footer>\n    <button class=\"button large alert on-right margin-bottom\">\n      <span class=\"icon remove\"></span>\n    </button>\n    <button class=\"button large success on-right margin-bottom margin-right\">\n      <span class=\"icon ok\"></span>\n    </button>\n  </footer>\n</div>";
        tk.dom(document.body).append("" + alert_template + "\n" + prompt_template + "\n" + confirm_template + "\n" + loading_template);
        return lock = tk.dom("[data-tuktuk=lock]").first();
      })(),
      show: show,
      hide: hide,
      loading: loading,
      alert: alert,
      confirm: confirm,
      prompt: prompt
    };
  })(TukTuk);

}).call(this);

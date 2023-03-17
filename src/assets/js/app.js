//= ../../../node_modules/swiper/swiper-bundle.js
//= components/scrolllock.js
//= components/nice-select.js

document.addEventListener("DOMContentLoaded", () => {
  //= components/sliders.js

  // header functional

  // const header = document.querySelector(".header");
  // let scrollPrev = 0;

  // if (header) {
  //   window.addEventListener("scroll", () => {
  //     let scrolled = document.documentElement.scrollTop;

  //     if (scrolled > 50 && scrolled > scrollPrev) {
  //       header.classList.add("out");
  //     } else {
  //       header.classList.remove("out");
  //     }

  //     if (scrolled <= 50) {
  //       header.classList.add("top");
  //     } else {
  //       header.classList.remove("top");
  //     }

  //     scrollPrev = scrolled;
  //   });

  //   if (document.documentElement.scrollTop <= 50) {
  //     header.classList.add("top");
  //   }

  // }

  const burger = document.querySelector(".burger-menu");
  const menu = document.querySelector(".menu");

  burger.addEventListener("click", () => {
    burger.classList.toggle("menu-on");
    menu.classList.toggle("active");

    if (burger.classList.contains("menu-on")) {
      scrollLock.disablePageScroll();
    } else {
      scrollLock.enablePageScroll();
    }
  });

  // tabs

  class ItcTabs {
    constructor(target, config) {
      const defaultConfig = {};
      this._config = Object.assign(defaultConfig, config);
      this._elTabs =
        typeof target === "string" ? document.querySelector(target) : target;
      this._elButtons = this._elTabs.querySelectorAll(".tabs-btn");
      this._elPanes = this._elTabs.querySelectorAll(".tabs-pane");
      this._elPanesAddl = this._elTabs.querySelectorAll(".tabs-pane_addl");
      this._eventShow = new Event("tab.itc.change");
      this._init();
      this._events();
    }
    _init() {
      this._elTabs.setAttribute("role", "tablist");
      this._elButtons.forEach((el, index) => {
        el.dataset.index = index;
        el.setAttribute("role", "tab");
        this._elPanes[index].setAttribute("role", "tabpanel");
        this._elPanesAddl[index].setAttribute("role", "tabpanel");
      });
    }
    show(elLinkTarget) {
      const elPaneTarget = this._elPanes[elLinkTarget.dataset.index];
      const elPaneAddlTarget = this._elPanesAddl[elLinkTarget.dataset.index];
      const elLinkActive = this._elTabs.querySelector(".tabs-btn_active");
      const elPaneShow = this._elTabs.querySelector(".tabs-pane_show");
      const elPaneAddlShow = this._elTabs.querySelector(".tabs-pane_addl_show");
      if (elLinkTarget === elLinkActive) {
        return;
      }
      elLinkActive ? elLinkActive.classList.remove("tabs-btn_active") : null;
      elPaneShow ? elPaneShow.classList.remove("tabs-pane_show") : null;
      elPaneAddlShow
        ? elPaneAddlShow.classList.remove("tabs-pane_addl_show")
        : null;
      elLinkTarget.classList.add("tabs-btn_active");
      elPaneTarget.classList.add("tabs-pane_show");
      elPaneAddlTarget.classList.add("tabs-pane_addl_show");
      this._elTabs.dispatchEvent(this._eventShow);
      elLinkTarget.focus();
    }
    showByIndex(index) {
      const elLinkTarget = this._elButtons[index];
      elLinkTarget ? this.show(elLinkTarget) : null;
    }
    _events() {
      this._elTabs.addEventListener("click", (e) => {
        const target = e.target.closest(".tabs-btn");
        if (target) {
          e.preventDefault();
          this.show(target);
        }
      });
    }
  }

  if (document.querySelector(".contacts-addrs")) {
    new ItcTabs(".contacts-addrs");
  }

  // modal functioal

  const modalTriggers = document.querySelectorAll("[data-modal]");

  if (modalTriggers.length > 0) {
    modalTriggers.forEach((el) => {
      el.addEventListener("click", () => {
        let modalName = el.dataset.modal;
        let modal = document.querySelector(`[data-modalName='${modalName}']`);

        modal.classList.remove("hide");
        scrollLock.disablePageScroll();
      });
    });
  }

  const modals = document.querySelectorAll(".modal");

  if (modals.length > 0) {
    modals.forEach((el) => {
      el.querySelector("[data-close]").addEventListener("click", () => {
        el.classList.add("hide");
        scrollLock.enablePageScroll();
      });
    });
  }

  // Anchor smooth scroll

  const pageLinks = document.querySelectorAll('a[href^="#"]');

  if (pageLinks.length > 0) {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
          behavior: "smooth",
        });
      });
    });
  }

  // accordeon

  //   const faqAccTitle = document.querySelectorAll(".faq__item-title"),
  //     faqAccText = document.querySelectorAll(".faq__item-descr");

  //   if (faqAccTitle.length > 0) {
  //     for (let i = 0; i < faqAccTitle.length; i++) {
  //       faqAccTitle[i].addEventListener("click", function () {
  //         this.classList.toggle("active");

  //         let panel = faqAccText[i];

  //         if (panel.style.maxHeight) {
  //           panel.style.maxHeight = null;
  //         } else {
  //           panel.style.maxHeight = panel.scrollHeight + "px";
  //         }
  //       });
  //     }
  //   }

  const selects = document.querySelectorAll(".nice-select");

  if (selects.length) {
    selects.forEach((select) => {
      select.addEventListener("blur", (e) => selectEvent(select, e));
      select.addEventListener("click", (e) => selectEvent(select, e));
    });

    selectEvent = (select, event) => {
      if (event.type == "click") {
        if (select.classList.contains("change")) {
          select.classList.remove("change");
        } else {
          select.classList.add("change");
        }
      }
      if (event.type == "blur") {
        select.classList.remove("change");
      }
    };
  }

  $(".nice-select").niceSelect();

  const contactsForm = document.querySelector(".contacts-form");
  const formSuccess = document.querySelector(".form-success");
  const formError = document.querySelector(".form-error");

  if (contactsForm) {
    contactsForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(contactsForm);

      fetch("path/to/server", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Ошибка отправки формы");
          }
        })
        .then((data) => {
          showSuccessMessage();
        })
        .catch((error) => {
          showErrorMessage();
        });
    });

    function showSuccessMessage() {
      formSuccess.classList.add("visible");
      formError.classList.remove("visible");

      contactsForm.reset();
    }

    function showErrorMessage() {
      formSuccess.classList.remove("visible");
      formError.classList.add("visible");
    }

    const contactInputText = document.querySelectorAll('input[type="text"]');
    contactInputText.forEach((el) => {
      el.addEventListener("input", function (e) {
        const value = e.target.value;
        if (!value) {
          el.classList.add("error");
        } else {
          el.classList.remove("error");
        }
      });
    });

    const submitButton = document.querySelector(".contacts-form__submit-btn");
    submitButton.addEventListener("click", function (e) {
      e.preventDefault();

      const inputs = document.querySelectorAll("input");
      let hasErrors = false;

      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        if (input.type === "text" && input.value === "") {
          input.classList.add("error");
          hasErrors = true;
        } else if (input.type === "email" && !isValidEmail(input.value)) {
          input.classList.add("error");
          hasErrors = true;
        } else if (input.type === "tel" && !isValidPhone(input.value)) {
          input.classList.add("error");
          hasErrors = true;
        }
      }

      if (!hasErrors) {
        contactsForm.submit();
      } else {
        showErrorMessage();
      }
    });
  }

  function isValidEmail(email) {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email.trim());
  }
  function isValidPhone(phone) {
    const regex = /^\+?[0-9]{10,}$/;
    return regex.test(phone.trim());
  }

  //= components/ymap-buy.js
});

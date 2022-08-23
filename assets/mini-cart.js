class MiniCart extends HTMLElement {
    constructor() {
      super();
  
      document.querySelectorAll('.js-minicart-close').forEach((closeButton) =>
        closeButton.addEventListener('click', (e) => {
          e.preventDefault();
          this.close();
        })
      );
      document.querySelectorAll('.js-minicart-open').forEach((openButton) =>
        openButton.addEventListener('click', (e) => {
          e.preventDefault();
          this.open();
        })
      );
    }
    open() {
      this.classList.add('is-open');
      document.getElementById('minicart-bg').classList.add('is-open');
      document.body.classList.add('is-cart-open');
    }
    close() {
      this.classList.remove('is-open');
      document.getElementById('minicart-bg').classList.remove('is-open');
      document.body.classList.remove('is-cart-open');
    }
  }
  customElements.define('mini-cart', MiniCart);
  
  class MiniCartRemoveButton extends HTMLElement {
    constructor() {
      super();
      this.addEventListener('click', (event) => {
        event.preventDefault();
        const cartItems = this.closest('mini-cart-items') || this.closest('cart-drawer-items');
        cartItems.updateQuantity(this.dataset.index, 0);
      });
    }
  } 

  customElements.define('mini-cart-remove-button', MiniCartRemoveButton);

  class MiniCartItems extends HTMLElement {
    constructor() {
      super();
  
      this.lineItemStatusElement = document.getElementById('shopping-cart-line-item-status');
  
      this.currentItemCount = this.getCurrentItemCount();
  
      this.debouncedOnChange = debounce((event) => {
        this.onChange(event);
      }, 300);
  
      this.addEventListener('change', this.debouncedOnChange.bind(this));
    }
  
    getCurrentItemCount() {
      return Array.from(this.querySelectorAll('[name="updates[]"]'))
        .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);
    }
  
    onItemAdded() {
      this.toggleEmptyState();
      document.querySelector('mini-cart').open();
    }
  
    toggleEmptyState() {
      const item_count = this.getCurrentItemCount();
      document.querySelector('cart-items')?.classList.toggle('is-empty', item_count === 0);
      document.getElementById('main-cart-items')?.classList.toggle('is-empty', item_count === 0);
      document.getElementById('main-cart-footer')?.classList.toggle('is-empty', item_count === 0);
    }
  
    onChange(event) {
      this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'));
    }
  
    getSectionsToRender() {
      return [
        {
          id: 'main-cart-items',
          section: document.getElementById('main-cart-items')?.dataset.id || 'main-cart-items',
          selector: '.js-contents',
        },
        {
          id: 'cart-icon-bubble',
          section: 'cart-icon-bubble',
          selector: '.shopify-section'
        },
        {
          id: 'cart-live-region-text',
          section: 'cart-live-region-text',
          selector: '.shopify-section'
        },
        {
          id: 'main-cart-footer',
          section: document.getElementById('main-cart-footer')?.dataset.id || 'main-cart-footer',
          selector: '.js-contents',
          
        }
      ];
    }
  
    updateQuantity(line, quantity, name) {
      this.enableLoading(line);
  
      const body = JSON.stringify({
        line,
        quantity,
        sections: this.getSectionsToRender().map((section) => section.section),
        sections_url: window.location.pathname
      });
  
      fetch(`${routes.cart_change_url}`, {...fetchConfig(), ...{ body }})
        .then((response) => {
          return response.text();
        })
        .then((state) => {
          const parsedState = JSON.parse(state);
          this.classList.toggle('is-empty', parsedState.item_count === 0);
          const cartFooter = document.getElementById('main-cart-footer');
          const headerIconCart  = document.querySelector('.header__icon--cart');

          if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);
          if (headerIconCart) headerIconCart.classList.toggle('is-empty', parsedState.item_count === 0);

          this.getSectionsToRender().forEach((section => {
            const elementToReplace =
              document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
  
            elementToReplace.innerHTML =
              this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
          }));
          if( typeof parsedState.sections['main-cart-items'] != 'undefined' ) {
            var mainCart = new DOMParser()
            .parseFromString(parsedState.sections['main-cart-items'], 'text/html');
            console.log(mainCart);
            console.log(parsedState.sections['main-cart-items']);
            document.querySelector('.minicart__main .title-wrapper-with-link>.title').innerHTML = mainCart.querySelector('.title-wrapper-with-link>.title').innerHTML;
          }
          this.updateLiveRegions(line, parsedState.item_count);
          const lineItem =  document.getElementById(`CartItem-${line}`);
          if (lineItem && lineItem.querySelector(`[name="${name}"]`)) lineItem.querySelector(`[name="${name}"]`).focus();
          this.disableLoading();
        }).catch(() => {
          this.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
          document.getElementById('cart-errors').textContent = window.cartStrings.error;
          this.disableLoading();
        });
    }
  
    updateLiveRegions(line, itemCount) {
      if (this.currentItemCount === itemCount) {
        document.getElementById(`Line-item-error-${line}`)
          .querySelector('.cart-item__error-text')
          .innerHTML = window.cartStrings.quantityError.replace(
            '[quantity]',
            document.getElementById(`Quantity-${line}`).value
          );
      }
  
      this.currentItemCount = itemCount;
      this.lineItemStatusElement.setAttribute('aria-hidden', true);
  
      const cartStatus = document.getElementById('cart-live-region-text');
      cartStatus.setAttribute('aria-hidden', false);
  
      setTimeout(() => {
        cartStatus.setAttribute('aria-hidden', true);
      }, 1000);
    }
  
    getSectionInnerHTML(html, selector) {
      return new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelector(selector).innerHTML;
    }
  
    enableLoading(line) {
      document.getElementById('main-cart-items').classList.add('cart__items--disabled');
      this.querySelectorAll(`#CartItem-${line} .loading-overlay`).forEach((overlay) => overlay.classList.remove('hidden'));
      document.activeElement.blur();
      this.lineItemStatusElement.setAttribute('aria-hidden', false);
    }
  
    disableLoading() {
      document.getElementById('main-cart-items').classList.remove('cart__items--disabled');
    }
  }
  
  customElements.define('mini-cart-items', MiniCartItems);
  
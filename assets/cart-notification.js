class CartNotification extends HTMLElement {
  constructor() {
    super();

    this.notification = document.getElementById('cart-notification');
    this.header = document.querySelector('sticky-header');
    this.onBodyClick = this.handleBodyClick.bind(this);
    
    this.notification.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelectorAll('button[type="button"]').forEach((closeButton) =>
      closeButton.addEventListener('click', this.close.bind(this))
    );
  }

  open() {
    this.notification.classList.add('animate', 'active');

    this.notification.addEventListener('transitionend', () => {
      this.notification.focus();
      trapFocus(this.notification);
    }, { once: true });

    document.body.addEventListener('click', this.onBodyClick);
  }

  close() {
    this.notification.classList.remove('active');

    document.body.removeEventListener('click', this.onBodyClick);

    removeTrapFocus(this.activeElement);
  }

  renderContents(parsedState) {
      // console.log(parsedState);
      this.cartItemKey = parsedState.key;

      const headerIconCart  = document.querySelector('.header__icon--cart');
      if (headerIconCart) headerIconCart.classList.toggle('is-empty', parsedState.item_count === 0);
      
      this.getSectionsToRender().forEach((section => {
        document.getElementById(section.id).innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
      }));

      if (this.header) this.header.reveal();

      if( typeof parsedState.sections['main-cart-items'] != 'undefined' ) {
        var mainCart = new DOMParser()
        .parseFromString(parsedState.sections['main-cart-items'], 'text/html');
        document.querySelector('.minicart__main .title-wrapper-with-link>.title').innerHTML = mainCart.querySelector('.title-wrapper-with-link>.title').innerHTML;
      }
      
      if (this.minicartmain && this.minicartmain.classList.contains('is-empty')) this.minicartmain.classList.remove('is-empty');
      // this.open();
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-notification-product',
        selector: `[id="cart-notification-product-${this.cartItemKey}"]`,
      },
      {
        id: 'cart-notification-button'
      },
      {
        id: 'cart-icon-bubble'
      },
      {
        id: 'main-cart-items',
        section: 'main-cart-items',
        selector: '.js-contents',
      },
      {
        id: 'main-cart-footer',
        section: 'main-cart-footer',
        selector: '#main-cart-footer',
      }
    ];
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  handleBodyClick(evt) {
    const target = evt.target;
    if (target !== this.notification && !target.closest('cart-notification')) {
      const disclosure = target.closest('details-disclosure, header-menu');
      this.activeElement = disclosure ? disclosure.querySelector('summary') : null;
      this.close();
    }
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-notification', CartNotification);
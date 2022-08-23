class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;

    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    })
  }

  onToggle() {
    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach(animation => animation.play());
    } else {
      this.animations.forEach(animation => animation.cancel());
    }
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
  }
}

customElements.define('details-disclosure', DetailsDisclosure);

class HeaderMenu extends DetailsDisclosure {
  constructor() {
    super();
    this.header = document.querySelector('.header-wrapper');

    document.querySelectorAll('.js-mega-submenu-close').forEach((closeButton) =>
      closeButton.addEventListener('click', (e) => {
        console.log("sub-menu-close");
        e.preventDefault();
        if (this.querySelector('.mega-menu').classList.contains('mega-submenu')) {
          this.closeMenu(this.querySelector('.mega-menu'));
        }
      })
    );
    document.querySelectorAll('.js-mega-submenu-open').forEach((openButton) =>
      openButton.addEventListener('click', (e) => {
        console.log("sub-menu-open");
        e.preventDefault();
        if (this.querySelector('.mega-menu').classList.contains('mega-submenu')) {
          this.openMenu(this.querySelector('.mega-menu'));
        }
      })
    );
  }

  onToggle() {
    if (!this.header) return;
    this.header.preventHide = this.mainDetailsToggle.open;

    if (document.documentElement.style.getPropertyValue('--header-bottom-position-desktop') !== '') return;
    document.documentElement.style.setProperty('--header-bottom-position-desktop', `${Math.floor(this.header.getBoundingClientRect().bottom)}px`);
  }

  onFocusOut() {
    console.log("Header menu focus out.")
  }

  openMenu(item) {
    console.log("open code: ", item);
    item.addAttribute('open', true);
    document.body.classList.add('is-mega-submenu-open');
    document.getElementById('mega-submenu-bg').classList.add('is-open');
  }
  closeMenu(item) {
    console.log("open code: ", item);
    item.removeAttribute('open', true);
    document.getElementById('mega-submenu-bg').classList.remove('is-open');
    document.body.classList.remove('mega-submenu-open');
  }

}

customElements.define('header-menu', HeaderMenu);

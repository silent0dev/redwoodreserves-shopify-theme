document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
    summary.setAttribute('role', 'button');
    summary.setAttribute('aria-expanded', summary.parentNode.hasAttribute('open'));
  
    if(summary.nextElementSibling.getAttribute('id')) {
      summary.setAttribute('aria-controls', summary.nextElementSibling.id);
    }
  
    summary.addEventListener('click', (event) => {
     
      let currentid = event.currentTarget.closest('details').id;
      let isSubMenu = event.currentTarget.closest('details').classList.contains('mega-submenu');
      let isOpen = event.currentTarget.closest('details').hasAttribute('open');

      if (!isSubMenu) {
        var current_value = !event.currentTarget.closest('details').hasAttribute('open');
        event.currentTarget.setAttribute('aria-expanded', current_value);
    
        //document.querySelectorAll('.mega-menu:not(.mega-submenu)').forEach( (menu) => { menu.removeAttribute('open') });
        document.querySelectorAll('.has-mega-menu').forEach( (hasMenu) => {
           hasMenu.querySelector('.mega-menu').removeAttribute('open')
          }
        );
        //event.currentTarget.parents('details').setAttribute('open', '');
        //event.currentTarget.closest('li').setAttribute('open', '');
      }
      else {
        event.preventDefault();
      }
    });
  
    if (summary.closest('header-drawer')) return;
    summary.parentElement.addEventListener('keyup', onKeyUpEscape);
});

document.querySelectorAll('.mega-menu.mega-submenu').forEach((details) => {

  details.addEventListener('mouseover', (event) => {
    let currentid = event.currentTarget.id;
    document.body.classList.add('mega-submenu-open');
    event.currentTarget.querySelector('summary').setAttribute('aria-expanded', 'open');

    document.querySelectorAll('.mega-menu.mega-submenu').forEach( (menu) => {
      let currentMenuId = menu.id;
      if (currentMenuId != currentid) {
        menu.removeAttribute('open'); 
      } else {
        menu.setAttribute('open','');
      }
    });
  });

  details.addEventListener('mouseout', (event) => {
    document.body.classList.remove('mega-submenu-open');
    event.currentTarget.querySelector('summary').removeAttribute('aria-expanded', 'open');

    document.querySelectorAll('.mega-menu.mega-submenu').forEach( (menu) => {
      menu.removeAttribute('open'); 
    });
  });
});
  
/* Animation */
const scrollElements = document.querySelectorAll(".js-scroll");

const elementInView = (el, dividend = 1) => {
  const elementTop = el.getBoundingClientRect().top;

  return (
    elementTop <=
    (window.innerHeight || document.documentElement.clientHeight) / dividend
  );
};

const elementOutofView = (el) => {
  const elementTop = el.getBoundingClientRect().top;

  return (
    elementTop > (window.innerHeight || document.documentElement.clientHeight)
  );
};

const displayScrollElement = (element) => {
  element.classList.add("scrolled");
};

const hideScrollElement = (element) => {
  element.classList.remove("scrolled");
};

const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el, 1.25)) {
      displayScrollElement(el);
    } else if (elementOutofView(el)) {
      hideScrollElement(el)
    }
  })
}

window.addEventListener("scroll", () => { 
  handleScrollAnimation();
});

if ( document.body.clientWidth <= 750 ) {
    document.querySelectorAll('.footer-block.accordion details').forEach( detail =>  {detail.removeAttribute("open")} );
}

class EA_SlideshowComponent extends SlideshowComponent {
  constructor() {
    super();
    this.enableSliderLooping = false;

    if (this.slider.getAttribute('data-enableSliderLooping') === 'true') {
      this.enableSliderLooping = true;
    }
  }

  update() {
    super.update();
    if (this.enableSliderLooping) return;

    if (this.isSlideVisible(this.sliderItemsToShow[0]) && this.slider.scrollLeft === 0) {
      this.prevButton.setAttribute('disabled', 'disabled');
    } else {
      this.prevButton.removeAttribute('disabled');
    }

    if (this.isSlideVisible(this.sliderItemsToShow[this.sliderItemsToShow.length - 1])) {
      this.nextButton.setAttribute('disabled', 'disabled');
    } else {
      this.nextButton.removeAttribute('disabled');
    }
  }
}

customElements.define('ea-slideshow-component', EA_SlideshowComponent);

var flaverSelect = document.querySelector('.product:not(.featured-product) [data-flavor-select]');
if( flaverSelect != null ){
  flaverSelect.addEventListener('change', function () {
    window.location.href = this.value;
  });
}

function collectionHas(a, b) { //helper function (see below)
  for(var i = 0, len = a.length; i < len; i ++) {
      if(a[i] == b) return true;
  }
  return false;
}
function findParentBySelector(elm, selector) {
  var all = document.querySelectorAll(selector);
  var cur = elm.parentNode;
  while(cur && !collectionHas(all, cur)) { //keep going up until you find a match
      cur = cur.parentNode; //go up
  }
  return cur; //will return null if not found
}

var featuredProductFlaverSelect = document.querySelectorAll('.product.featured-product [data-flavor-select]');
if( featuredProductFlaverSelect.length > 0 ){
  featuredProductFlaverSelect.forEach(function(featuredProductFlaverSelectitem){
    featuredProductFlaverSelectitem.addEventListener('change', function () {
      _this = this;
      findParentBySelector(this,'.special-products-tabs_content').querySelectorAll('[id^="specialproduct-"]').forEach(function(featuredProductCont){
        console.log(featuredProductCont.id);
        console.log(_this.value);
        if( featuredProductCont.id == _this.value ) {
          featuredProductCont.classList.remove('hidden');
          featuredProductCont.querySelector('[data-flavor-select]').value = _this.value;
        } 
        else {
          featuredProductCont.classList.add('hidden');
        }
      });
    });
  });
}
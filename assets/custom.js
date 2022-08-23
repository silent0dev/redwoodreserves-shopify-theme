const faqFilterlinks = document.querySelectorAll(".faq__side-column input[name='faqs--accordion']");

for (const faqFilterlink of faqFilterlinks) {
    faqFilterlink.addEventListener("change", faqFilter);
}

function faqFilter(e) {
  e.preventDefault();
  const href = document.querySelector(".faq__side-column input[name='faqs--accordion']:checked").value;
  var grid = document.querySelector( '#product-grids-' + href );
  var offsetTop = 0;
  if( grid != null ){
    offsetTop = (grid.offsetTop)-60;
  }
  var openmenu = document.querySelector('.open-menu');
  if( openmenu != null ){
    openmenu.classList.remove('open-menu');
  }

  if( window.innerWidth < 750 && offsetTop != 0 ){
    offsetTop = offsetTop - 200;
  }

  scroll({
    top: offsetTop,
    behavior: "smooth"
  });

  setTimeout(() => {
    if( offsetTop > 100 ) {
        document.getElementById('shopify-section-ea-header').classList.add('shopify-section-header-hidden', 'shopify-section-header-sticky');
        document.querySelector('body').classList.add('sticky-header-hidden');
    }
  }, 1000);
}

var rcradioButtons = document.querySelectorAll('.recharge-radio');
var selling_plans = document.querySelectorAll('[name="selling_plan"]');

function rcradioButtonChange() {
    if( this.checked ){
        if( this.value == 'onetime' ){
            selling_plans.forEach((selling_plan) => {
                selling_plan.disabled = true;
            });
            document.querySelector('#sub-type').style.display = 'none';
            document.querySelector('.subscribe-btn').style.display = 'none';
            document.querySelector('.one-time-btn').style.display = 'block';
            document.querySelector('.product-form__buttons-price .regular-price').style.display = 'block';
            document.querySelector('.product-form__buttons-price .subcription-price').style.display = 'none';
        }
        else{
            selling_plans.forEach((selling_plan) => {
                selling_plan.disabled = false;
            });
            document.querySelector('#sub-type').style.display = 'block';
            document.querySelector('.subscribe-btn').style.display = 'block';
            document.querySelector('.one-time-btn').style.display = 'none';
            document.querySelector('.product-form__buttons-price .regular-price').style.display = 'none';
            document.querySelector('.product-form__buttons-price .subcription-price').style.display = 'block';
        }
    }
}

rcradioButtons.forEach((radioButton) => {
    radioButton.addEventListener( 'change', rcradioButtonChange);
});

if( document.querySelector('.recharge-radio:checked') != null ) {
    document.querySelector('.recharge-radio:checked').dispatchEvent( new Event('change') );
}

function scrollIntoViewIfNeeded(target) { 

    var headerOffset = 300;

    var offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
   });
}


var accordionInputs = document.querySelectorAll('.accordion input,.faq__each--accordion input');
accordionInputs.forEach((accordionInput) => {
    accordionInput.addEventListener( 'click', function(e) {
        if( this.getAttribute("data-open") == "true" ){
            this.checked = false;
            accordionInputs.forEach((accordionInput) => {
                accordionInput.setAttribute("data-open", "false");
            });
        }
        else {
            accordionInputs.forEach((accordionInput) => {
                if( accordionInput == this ){
                    accordionInput.setAttribute("data-open", "true");
                }
                else {
                    accordionInput.setAttribute("data-open", "false");
                }
            });
            this.setAttribute("data-open", "true");
            var content = this.nextElementSibling.nextElementSibling;
            content.style.height = content.scrollHeight + 'px';
            var _this = this;
            setTimeout(function(){
                scrollIntoViewIfNeeded(_this)
            }, 1000);
        }
    });

    if( accordionInput.checked ){
        accordionInput.setAttribute("data-open", "true");
        var content = accordionInput.nextElementSibling.nextElementSibling;
        content.style.height = content.scrollHeight + 'px';
    }
});

function delegate(el, evt, sel, handler) {
    el.addEventListener(evt, function(event) {
        var t = event.target;
        while (t && t !== this) {
            if (t.matches(sel)) {
                handler.call(t, event);
            }
            t = t.parentNode;
        }
    });
}

delegate(document, "click", '[href="#recover"]', function(event) {
    document.querySelector('.accounts-sidebar-heading').classList.add('reset-selected');
});

delegate(document, "click", '[href="#create"]', function(event) {
    document.querySelector('.accounts-sidebar-heading').classList.add('create-selected');
});

delegate(document, "click", '[href="#cancel"]', function(event) {
    document.querySelector('.accounts-sidebar-heading').classList.remove('create-selected','reset-selected');
});

class ProductSelects extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('change', this.updateOptions);
    }

    onVariantChange() {
      this.updateOptions();
    }

    updateOptions() {
        window.location = this.querySelector('select').value;
    }
}

customElements.define('product-selects', ProductSelects);

document.querySelector('.menu-drawer-close').addEventListener('click',function(){
    document.querySelector('.header__icon.header__icon--menu').click();
});


document.body.addEventListener('modalClosed',function(){
    document.body.classList.remove(`overflow-hidden-tablet`);
});
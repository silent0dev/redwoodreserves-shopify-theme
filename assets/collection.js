const links = document.querySelectorAll(".collection__side-column ul li");

for (const link of links) {
  link.addEventListener("click", function (e) {
    for (const link of links) {
      link.classList.remove("active");
    }
    this.classList.add("active");
    const href = this.getAttribute("data-href");
    var grid = document.querySelector(href);
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
  });
}

document.querySelector(".collection__side-column ul li.active")?.click();

const mobileFilterHead = document.querySelector('.filter-header .hide-desktop');

mobileFilterHead.addEventListener("click", function(){
    mobileFilterHead.parentElement.parentElement.classList.toggle("open-menu");
});

var pathArray = window.location.pathname.split( '/' );
var collectionHandle = pathArray[pathArray.length-1];
  var collectionFilterBtn = document.querySelector('[data-href="#product-grids-'+ collectionHandle +'"]' );
  if( collectionFilterBtn != null ){
    collectionFilterBtn.click()
  }
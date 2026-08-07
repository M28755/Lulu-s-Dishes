import { dishesData } from "./LuluData.js"
//cart state
 let orderCart = []

document.addEventListener('DOMContentLoaded', () => {
    initNavigation()
    initScrollReveal()
    initCounter()
    initYear()
    initThemeToggle()
    renderMenu(dishesData)
    initCartDrawer()
    inittestimonialSlide()
    initLightBox()
})
const navBar = document.getElementById('navbar');
const themeToggle = document.getElementById('themeToggole')
const navLinks = document.getElementById('navLinks')
const hamburger = document.getElementById('hamburger')
const links = document.querySelectorAll('.nav-link')
const backToTopBtn = document.getElementById('backToTop');
const cartOverlay = document.getElementById("cartOverlay");
    const cartDrawer = document.getElementById("cartDrawer");


const initNavigation = () => {

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navBar.classList.add('scrolled');
            backToTopBtn.classList.add('show')
        }
        else {
            navBar.classList.remove('scrolled');
            backToTopBtn.classList.remove('show')
        }

        //Actve link highlighted on scroll
        const sections = document.querySelectorAll('section');
        let currentSection = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120;

            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');

            }

        });

        links.forEach((link) => {
            link.classList.remove('active');

            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active')
            }
        })
    });

    hamburger.addEventListener('click', () => {
        navLinks.classList.add('active')
    })

    links.forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active')
        })
    })
    backToTopBtn.addEventListener('click', ()=>{
        console.log('clicked')
        window.scrollTo({top: 0, behavior: "smooth"})

    })


}

/* scrolling funtion */
const initScrollReveal =() =>{
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')

    //console.log(reveals)
    const observer = new IntersectionObserver((entries) =>{
        entries.forEach((entry) =>{
            if(entry.isIntersecting){
                entry.target.classList.add('active');
                observer.unobserve(entry.target)
            }
        },{threshold:0.15});


    })
  reveals.forEach((element) => observer.observe(element));

}

/* experence counting */
const initCounter = () =>{
    const experence = document.querySelector('.exp-number');
     if(!experence)return;

     let target = parseInt(experence.getAttribute('data-target'))
     let currentCount = 0;
     //console.log(target)

     const observer = new IntersectionObserver((entries) =>{
        if(entries[0].isIntersecting){
            let timer = setInterval(() =>{
                currentCount += 1;
                if(currentCount >= target){
                    experence.textContent = target
                    clearInterval(timer);
                }else{
                    experence.textContent = currentCount;
                }


            }, 30);
            observer.disconnect();
            
        }

     })
     observer.observe(experence)



}

/* copyright year */
const initYear = () =>{
    const year = document.getElementById('year');

    if(year){
        year.textContent = new Date().getFullYear();
    }
}
/* theme toggle */
const initThemeToggle =() =>{
     const themeBtn = document.getElementById('themeToggole');
     const icon = themeBtn.querySelector('i')
   
     if(!icon)return;

     const saveTheme = localStorage.getItem("Lulus_theme")|| 'light';
     document.documentElement.setAttribute('data-theme', saveTheme)
      
      themeToggle.addEventListener('click', () =>{
        const currentTheme = document.documentElement.getAttribute('data-theme')
       const newTheme = currentTheme === "light" ? "dark" :"light";
       updateThemeIcon(newTheme, icon)

          document.documentElement.setAttribute("data-theme", newTheme)
          
          localStorage.setItem("lulus_theme", JSON.stringify(newTheme))
        //  console.log(JSON.parse(localStorage.getItem('lulus_theme')))
      })
    
   
     function updateThemeIcon(theme,icon){
        if(theme === 'dark'){
            icon.className = "fas fa-sun";
        }else{
            icon.className = 'fas fa-moon';
        }

     }
}


/* Menu (filter , search and render logic) */

const renderMenu = (items) =>{
     //console.log(items);

     const menuGrid = document.getElementById('menuGrid');
     if(!menuGrid)return;
      
     menuGrid.innerHTML = "";


     items.forEach((dish) =>{
        const card = document.createElement('div');

        card.className = "food-card glassmorphism";

        card.innerHTML = ` <div class="food-img-wrapper">
        <img src="${dish.image}" alt="${dish.name}" loading="lazy">
        <span class="food-category-badge">${dish.category}</span>
    </div>
    <div class="food-i">
        <h3 class="food-title">${dish.name}</h3>
        <p class="food-desc">${dish.description}</p>
        <div class="food-bott">
            <span class="food-price">${dish.price}</span>
            <button class="add-cart-btn" aria-label="Add ${dish.name} to cart">
                <i class="fas fa-plus"></i>
            </button>
        </div>
    </div>`

    const addToCartBtn = card.querySelector('.add-cart-btn')
//console.log(addToCartBtn);

addToCartBtn.addEventListener('click' ,()=>{
    addToCart(dish.id)
    console.log(dish.id)
  //  console.log(addToCart(`${dish.id}`));
    
})

        menuGrid.appendChild(card);
     })
}

//filter and search logic

const categoryButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('menuSearch');

let activeFilter = "all"

categoryButtons.forEach((btn)=>{
    btn.addEventListener('click', () =>{
        console.log(btn.getAttribute('data-filter'))

        categoryButtons.forEach((button) =>{
            button.classList.remove('active');
        })
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter');
        applyMenuFilters();

    })
})
searchInput.addEventListener('input', ()=>{
    applyMenuFilters();
})

const applyMenuFilters =()=>{
    const query = searchInput.value.toLocaleLowerCase().trim();
    //console.log(query)

    const filtered = dishesData.filter((dish) =>{
        const matchesCategory = activeFilter === "all" || dish.category === activeFilter;

        const matchesSearch = dish.name.toLocaleLowerCase().includes(query) || dish.description.toLocaleLowerCase().includes(query)

        return matchesCategory && matchesSearch
    })

  renderMenu(filtered);

}

/* ORDER CART SYSTEM & WHATSAPP CHECKOUT */
 

const initCartDrawer = ()=>{
    const cartBtn = document.getElementById("cartBtn")
    const closeCart = document.getElementById("closeCart")



     cartBtn.addEventListener('click', ()=>{
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.classList.add('cart-open')
     })

     function closeCartinter(){
        cartDrawer.classList.remove('active')
        cartOverlay.classList.remove('active');
        document.body.classList.remove('cart-open')
     }
     closeCart.addEventListener('click', closeCartinter)
     cartOverlay.addEventListener('click',closeCartinter);

}


const addToCart = (dishId)=>{
    console.log(dishId)
    
    const dish = dishesData.find((d) =>{
      return  d.id === dishId
    })
    if(!dish)return;

    const existingIndex = orderCart.findIndex((item) =>{
      return   item.id === dishId;
    })

    if(existingIndex > -1){
        orderCart[existingIndex].qty += 1;
    }else{
        orderCart.push({...dish,qty:1});
    }

    updateCartUI()
  cartDrawer.classList.add('active');
  cartOverlay.classList.add('active');
} 
window.changeQty = (dishId, delta)=>{

    const index = orderCart.findIndex((item) => item.id === dishId);
    if (index > -1) {
        orderCart[index].qty += delta;
        if (orderCart[index].qty <= 0) {
            orderCart.splice(index, 1);
        }
    }
    updateCartUI()

}

const updateCartUI = () =>{
    const cartContainer = document.getElementById('cartItems')
    const costTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount')
     

    const totalQty = orderCart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = orderCart.reduce((sum, item) => sum + item.price * item.qty, 0);

    costTotal.textContent =`KSH ${totalPrice}`;
    cartCount.textContent = totalQty

    if (orderCart.length === 0) {
        cartContainer.innerHTML = `<p class="empty-cart-msg">Your basket is currently empty. Explore our menu to add delicious Swahili dishes!</p>`;

        resetCheckOutState();
        return;
    }

    cartContainer.innerHTML = orderCart.map((item)=>
    `
        <div class="cart-item">
            <div>
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">KSh ${item.price} x ${item.qty}</div>
            </div>
            <div class="cart-controls">
                 <button  onclick="changeQty('${item.id}', -1)" aria-label="Decrease Quantity">-</button>
                <span>${item.qty}</span>
                <button  onclick="changeQty('${item.id}', 1)" aria-label="Increase Quantity">+</button>

            </div>
        </div>
    ` )
        .join("");
       
  

}
let isCheckOutFormVisible= false;
 const checkOutBtn = document.getElementById("checkoutBtn")
 const checkOutForm = document.getElementById("checkoutForm");


const checkoutWhatsApp =()=>{
    if(orderCart.length === 0){
       alert("Your cart is empty. Please add items before placing an order!");
        return
    }

    
     const custName = document.getElementById('custName');
     const custPhone = document.getElementById('custPhone')
     const custAddress = document.getElementById('custAddress')
   

    if(!isCheckOutFormVisible){
        checkOutForm.classList.add('active');

        isCheckOutFormVisible = true

        checkOutBtn.innerHTML = `<i class="fab fa-whatsapp"></i> Send Order via WhatsApp`;

        setTimeout(()=>{
          custName.focus()
        },500);

        return
    }
  const customerName =   custName.value.trim();
  const customerAddres =  custAddress.value.trim();
  const customerPhone =  custPhone.value.trim();

  if(!customerName || !customerAddres || !customerPhone){
             alert("Please fill in your name, phone number, and delivery address before sending your order.");
    return
  }
 //decoding the message according to individual customer
  let message = `*NEW ORDER - Lulu's Delish*\n\n`;
  message += `*Customer Details:*\n`;
  message += `• Name: ${customerName}\n`;
  message += `• Phone: ${customerPhone}\n`;
  message += `• Delivery Location: ${customerAddres}\n\n`;

  message += `*Order Items:*\n`;

  let grandTotal = 0;

  orderCart.forEach((item, index)=>{
    const itemTotal = item.price * item.qty;

    grandTotal += itemTotal;

    //console.log(grandTotal);

    message += `${index + 1}. ${item.name} (${item.qty}x) - KSh ${itemTotal}\n`

  });
  message += `\n*Total Amount: KSh ${grandTotal}*`;
  
  //Encode and send via WhatsApp
  const encodeMsg = encodeURIComponent(message);

    //254707729549
 window.open(`https://wa.me/254758644293?text=${encodeMsg}`, "_blank");

 setTimeout(()=>{
    resetCheckOutState()

 },500);
   
}

checkOutBtn.addEventListener('click', checkoutWhatsApp)

const resetCheckOutState = ()=>{
    isCheckOutFormVisible = false
 checkOutForm.reset();
    if(checkOutBtn){
        checkOutBtn.textContent = 'Proceed to Checkout';
    }
    if(checkOutForm){
        checkOutForm.classList.remove('active');
    }
}

const inittestimonialSlide = () =>{
   
    const track = document.getElementById('testimonialTrack');
    const card = track.querySelectorAll('.testimonial-card');
    const previousBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');
    const dotContainer = document.getElementById('sliderDots')

    let currentIndex = 0;
    let total = card.length;

    if(total === 0)return;
    //console.log(total)

    dotContainer.innerHTML = '';
    //creating dot acconding to numbers of testimonial slides
    for(let i = 0; i < total;i++){
        const dot = document.createElement('div');
        dot.className = `dot ${i === 0? "active": ""}`;

        dot.addEventListener('click', ()=> letSlide(i));

           dotContainer.appendChild(dot)
    }
   
    //testimonial slide function
    const letSlide = (index) =>{
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
          
      const  dots = dotContainer.querySelectorAll('.dot');
       //looping through every dot to set it active
        dots.forEach((dot, index) =>{
            dot.classList.toggle('active', index === currentIndex)
        })
    }
    //next button logic
    nextBtn.addEventListener('click', ()=>{
        currentIndex = (currentIndex + 1) % total;
        console.log(currentIndex);

        letSlide(currentIndex);
    })
    //previous button logic
    previousBtn.addEventListener('click', ()=>{
        currentIndex = (currentIndex - 1 + total) % total;
       // console.log(currentIndex)
        
        letSlide(currentIndex)
    })

    //allowing auto sliding after every 4 seconds
    setInterval(()=>{
        currentIndex = (currentIndex + 1 ) % total;

        letSlide(currentIndex)

    },4000)
}

const initLightBox = () =>{
    const lightBox = document.getElementById('lightbox');
    const lightBoxImg = document.getElementById('lightboxImg');
    const lightBoxCaption = document.getElementById('lightboxCaption')
    const gallaryItem = document.querySelectorAll('.gallery-item')
    const closeBtn = document.querySelector('.lightbox-close');


    if(!lightBox || !lightBoxImg || !lightBoxCaption || !gallaryItem) return;

gallaryItem.forEach((item) =>{
    item.addEventListener('click', ()=>{
        //accessing src and alt to the clicked image from gallery
        const imgEl = item.querySelector('img');
        const fullscreen = imgEl ? imgEl.src : "";  
        const caption = imgEl ? imgEl.alt : "";
       console.log(caption);

       lightBoxImg.src = fullscreen;
       lightBoxCaption.textContent = caption;

       lightBox.classList.add('active');

       document.body.style.overflow = 'hidden'


    })

})
//function to close light box
const closeLightBox = () =>{
    lightBox.classList.remove('active');
    document.body.style.overflow = '';
}
closeBtn.addEventListener('click', closeLightBox);
// cloase light box if the overlay is clicked 
lightBox.addEventListener('click', (e)=>{
    if(e.target === lightBox){
        closeLightBox();
    }
})

//closing using  esc key

document.addEventListener('keydown', () =>{
    if(e.key && lightBox.classList.contains('active')){
        closeLightBox()
    }
})
}


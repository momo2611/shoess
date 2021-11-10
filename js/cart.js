const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const shoesList = $('.shoes__list');
const itemsTotal = $('.category__cart-total');

const provisionalValue = $('.shoes__plusCart-provisional-value');
const shipValue = $('.shoes__plusCart-ship-value');
const totalPrice = $('.shoes__plusCart-total-value');
const payBtn = $('.shoes__plusCart-pay');

class UI {

    // hiển thị các shoes
    displayShoeses() {
        const shoeses = Storage.getCart();
        let html = '';

        shoeses.forEach(shoes => {
            html += `
                <div class="shoes__item">
                    <div class="shoes__item-left">
                        <a href="#!">
                            <img src="${shoes.image}" alt="" class="shoes__item-image">
                        </a>
                        <a class="shoes__item-title" href="#!">${shoes.title},
                            <span class="shoes__item-size">${shoes.size}</span>
                        </a>
                    </div>
                    <span class="shoes__item-price shoes__item-number">${this.formatVND(shoes.price)}</span>
                    <div class="shoes__item-quantity">
                        <ion-icon data-id="${shoes.id}" name="remove-outline" class="shoes__item-reduce shoes__item-icon" ></ion-icon>
                        <span class="shoes__item-amount">${shoes.amount}</span>
                        <ion-icon data-id="${shoes.id}" name="add-outline" class="shoes__item-increase shoes__item-icon"></ion-icon>
                    </div>
                    <div class="shoes__item-right">
                        <span class="shoes__item-total shoes__item-number">${this.formatVND(shoes.price * shoes.amount)}</span>
                        <ion-icon data-id="${shoes.id}" name="close-outline" class="shoes__item-remove shoes__item-icon"></ion-icon>
                    </div>
                </div>
            `
        })

        shoesList.innerHTML = html;
    }

    formatVND(price) {
        return price.toLocaleString('vi', {style : 'currency', currency : 'VND'});
    }

    // hàm đặt lại các giá trị sau khi thay đổi
    setCartValue() {
        let countItemTotal = 0;
        let countPriceTotal = 0;

        const cart = Storage.getCart();

        if(cart.length === 0) {
            shoesList.innerHTML = '<p class="empty-mess">Chưa có sản phẩm nào trong giỏ hàng!</p>';
        }

        cart.forEach(shoes => {
            countItemTotal += shoes.amount;
            countPriceTotal += shoes.price * shoes.amount;        
        })

        provisionalValue.innerHTML = this.formatVND(countPriceTotal);

        if(countPriceTotal > 1000000  || countPriceTotal === 0) {
            shipValue.innerText = 'GIAO HÀNG MIỄN PHÍ';
        }
        else {
            shipValue.innerHTML = this.formatVND(30000);
            countPriceTotal += 30000;
        }

        itemsTotal.innerText = countItemTotal;
        totalPrice.innerHTML = this.formatVND(countPriceTotal);

    }

    // khi click vào button tăng, giảm số lượng
    quantityAdjust() {
        let shoesItem = [...$$('.shoes__item')];

        shoesList.addEventListener('click', (e) => {
            let cart = Storage.getCart();

            if(e.target.classList.contains('shoes__item-increase')) {
                let id = e.target.dataset.id;
                let size = parseInt(e.target.parentElement.parentElement.querySelector('.shoes__item-size').innerText);

                let item = cart.find(shoes => shoes.id == id && shoes.size === size);
                
                item.amount++;
                Storage.saveCart(cart);

                let ele = e.target.parentElement.parentElement;
                ele.querySelector('.shoes__item-amount').innerText = item.amount;
                ele.querySelector('.shoes__item-total').innerHTML = this.formatVND(item.amount * item.price);

                this.setCartValue();
            }

            else if(e.target.classList.contains('shoes__item-reduce')) {
                let id = e.target.dataset.id;
                let size = parseInt(e.target.parentElement.parentElement.querySelector('.shoes__item-size').innerText);

                let item = cart.find(shoes => shoes.id == id && shoes.size === size);
                
                item.amount--;
                
                if(item.amount > 0) {
                    Storage.saveCart(cart);

                    let ele = e.target.parentElement.parentElement;
                    ele.querySelector('.shoes__item-amount').innerText = item.amount;
                    ele.querySelector('.shoes__item-total').innerHTML = this.formatVND(item.amount * item.price);
                }
                this.setCartValue();
            }

        })
    }

    // hàm xóa một item khi click vào remove button
    removeItem() {
        shoesList.addEventListener('click', (e) => {

            if(e.target.classList.contains('shoes__item-remove')) {
                let item = e.target;
                let id = item.dataset.id;
                let size = item.parentElement.parentElement.querySelector('.shoes__item-size').innerText;

                item.parentElement.parentElement.remove();

                let cart = Storage.getCart();

                let itemRemove = cart.find(item => item.id == id && item.size == size);

                cart = cart.filter(item => item.id != itemRemove.id || item.size != itemRemove.size);

                Storage.saveCart(cart);   
                this.setCartValue();       
            }
        })
    }

    // khi click vào pay button
    payCart() {
        payBtn.addEventListener('click', (e) => {
            let cart = Storage.getCart();

            if(cart.length > 0) {
                for(let i = 0; i < shoesList.children.length; ++i) {
                    shoesList.innerHTML = '';
                }

                Storage.remove('cart');
                this.setCartValue();
                alert('Bạn đã đặt hàng thành công!!');
            }
            else {
                alert('Không có sản phẩm nào trong giỏ hàng!!');
            }
        })
    }
}

class Storage {
    static getCart() {
        return JSON.parse(localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : [];
    }
    
    static getClickShoes() {
        return JSON.parse(localStorage.getItem('shoesClick'));
    }
    
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    static remove(key) {
        localStorage.removeItem(key);
    }
}


document.addEventListener('DOMContentLoaded', (e) => {
    const ui = new UI();

    ui.displayShoeses();
    ui.setCartValue();
    ui.quantityAdjust();
    ui.removeItem();
    ui.payCart();
})
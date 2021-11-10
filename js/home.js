
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const shoesList = $('.product__list');

class Shoeses {
    async getShoeses() {
        let response = await fetch(' http://localhost:3000/shoeses');
        let shoeses = await response.json();

        shoeses = shoeses.map(shoes => {
            const {id, title, description, discount, price} = shoes;
            const {image, imageSmall_1, imageSmall_2} = shoes.images;

            return {id, title, description, discount, price, image, imageSmall_1, imageSmall_2}
        })

        return shoeses;
    }
}

class UI {
    displayShoeses(shoeses) {
        var html = '';
        shoeses.forEach(shoes => {
            html += `
                <div class="product__list-item" data-id="${shoes.id}">
                    <a href="./details.html" class="product__list-top">
                        <img src="${shoes.image}" alt="" class="product__list-image">
                        <span class="product__list-discount">Giảm ${shoes.discount}%</span>
                    </a>
                    <div class="product__list-imgSmall">
                        <img class="product__list-small" src="${shoes.image}" alt="">
                        <img class="product__list-small" src="${shoes.imageSmall_1}" alt="">
                        <img class="product__list-small"  src="${shoes.imageSmall_2}" alt="">
                    </div>
                    <a href="./details.html" class="product__list-name">${shoes.title}</a>
                    <span class="product__list-price">${this.formatVND(shoes.price)}</span>
                </div>
            `
        })

        shoesList.innerHTML = html;
    }

    formatVND(price) {
        return price.toLocaleString('vi', {style : 'currency', currency : 'VND'});
    }

    hoverImage() {
        var images = $$('.product__list-image');

        images.forEach(image => {
            const imagesSmall = image.parentElement.parentElement.querySelectorAll('.product__list-small');
            
            imagesSmall.forEach(imgSmall => {
                imgSmall.addEventListener('mouseover', (e) => {
                    image.src = e.target.src;
                })
            })
        })
    }

    clickShoes() {
        shoesList.addEventListener('click', (e) => {
            if(e.target.classList.contains('product__list-image') || e.target.classList.contains('product__list-name')) {
                var id;
                if(e.target.classList.contains('product__list-image')) {
                    id = e.target.parentElement.parentElement.dataset.id;
                }
                else {
                    id = e.target.parentElement.dataset.id;
                }
                
                const shoeses = Storage.getShoeses();
                const shoes = shoeses.find(shoes => shoes.id == id);

                Storage.saveClickShoes(shoes);
            }
        })
    }

}

class Storage {
    static saveShoeses(shoeses) {
        localStorage.setItem('shoeses', JSON.stringify(shoeses));
    }

    static getShoeses() {
        return JSON.parse(localStorage.getItem('shoeses'));
    }
    static saveClickShoes(shoes) {
        return localStorage.setItem('shoesClick', JSON.stringify(shoes));
    }
}

document.addEventListener('DOMContentLoaded', (e) => {
    const shoeses = new Shoeses();
    const ui = new UI();

    shoeses.getShoeses().then(shoeses => {
        ui.displayShoeses(shoeses);
        Storage.saveShoeses(shoeses);
    }).then(() => {
        ui.hoverImage();
        ui.clickShoes();
    });
})


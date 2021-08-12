const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
    el: '#app',
    data: {
        catalogUrl: '/catalogData.json',
        cartUrl: '/getBasket.json',
        products: [],
        imgCatalog: 'https://placeholder.com/200x150',
        searchLine: '', //слово для тестирования связки
        filtered: [],
        isVisibleCart: false,
        cart: [{ id_product: 1811, img: 'https://placeholder.com/200x150', product_name: 'Монитор', price: 9000, quantity: 3 }],

    },
    methods: {
        getJson(url) {
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    console.log(error);
                })
        },
        addProduct(product) {
            console.log(product.id_product);
        },
        removeProduct(product) {
            console.log(product.id_product);
            let productId = product.id_product;
            let find = this.cart.find(product => product.id_product === productId);
            if (find.quantity > 1) { // если товара > 1, то уменьшаем количество на 1
                find.quantity--;
            } else { // удаляем
                this.cart.splice(this.cart.indexOf(find), 1);
            }
        },
        filterGoods() {
            const regexp = new RegExp(this.searchLine, 'i');
            this.filtered = this.products.filter(product => regexp.test(product.product_name));
            //TODO: не понятно теперь как обратиться к :key где лежит наш id
            this.products.forEach(el => {
                //пока реализовано на JS, (как это красиво сделать на vue.js не понятно)
                const block = document.querySelector(`.product-item[data-id="${el.id_product}"]`);
                if (!this.filtered.includes(el)) {
                    block.classList.add('invisible');
                } else {
                    block.classList.remove('invisible');
                }
            })
        },
    },
    // хук жизненного цикла
    mounted() {
        this.getJson(`${API + this.catalogUrl}`)
            .then(data => {
                for (let el of data) {
                    this.products.push(el);
                }
            });
        //заполним Корзину
        this.getJson(`${API + this.cartUrl}`)
            .then(data => {
                for (let el of data.contents) {
                    this.cart.push(el); //добавим к существуещему содержимому корзины, там у нас три монитора
                }
                // this.cart = [...data.contents]; //либо полностью массив загрузим из json-запроса
            });
    }
});

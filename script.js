let cart = [];
let modalQT = 1;
let modalKey= 0;

const c = (el)=> document.querySelector(el);
const cs = (el)=> document.querySelectorAll(el);

pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true); /* Clona models a quantidade de vezes que tem de pizza */
    
// Listagem das Pizzas
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQT = 1;
        modalKey = key;

        /* Modal */
        /* informações da pizza  */
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`; /* ainda não esta alterando por unidade */
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeindex)=>{
            if(sizeindex == 2){
                size.classList.add('selected') /* faz com que o tamanho G fique selecionado quando fechar o modal */
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeindex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQT;

        /* Estilo/Formatação Modal */
        c('.pizzaWindowArea').style.opacity = 0;;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{                                /* animação modal */
            c('.pizzaWindowArea').style.opacity = 1;
        }),200;

    })

    c('.pizza-area').append( pizzaItem );
})

// Eventos do Modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal)
});

//botoes de acrescentar ou diminuir a quantidade
c('.pizzaInfo--qtmenos').addEventListener('click', ()=> {
    if (modalQT>1){
        modalQT--;
        c('.pizzaInfo--qt').innerHTML = modalQT;
    }

});
c('.pizzaInfo--qtmais').addEventListener('click', ()=> {
    modalQT++;
    c('.pizzaInfo--qt').innerHTML = modalQT;
});

//seleção de tamanhos
cs('.pizzaInfo--size').forEach((size, sizeindex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected')
    });
});

//Botão de adicionar o carrinho
c('.pizzaInfo--addButton').addEventListener('click', () =>{
   let size = c('.pizzaInfo--size.selected').getAttribute('data-key');

    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>item.identifier == identifier);

    if(key > -1){
        cart[key].qt += modalQT;
    }else{
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id, //Qual a pizza
            size: size,     //Qual o tamanho da pizza
            qt: modalQT     //Quantas pizzas
        });
    }
    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click',() =>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click',() => {
    c('aside').style.left = '100vw';
})

function updateCart(){
    if(cart.length > 0){
        c('.menu-openner').style.display = "block";
        c('.menu-openner span').innerHTML = cart.length;
    }


    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;                        // calculo de subtotal

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName = cart[i].size;
           
            if (pizzaSizeName == 0){
                pizzaSizeName = 'P'
            } else if (pizzaSizeName == 1){
                pizzaSizeName = 'M'
            } else if (pizzaSizeName == 2){
                pizzaSizeName = 'G'
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else{
                    cart.splice(i,1)
                }
                updateCart()
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart()
            })

            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    }else{
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
        c('.menu-openner').style.display = "none";
    }
}
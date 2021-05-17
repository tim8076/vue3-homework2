
const dashBoard = {
    dom:{
        form: document.querySelector('.form'),
        inputs: document.querySelectorAll('#addProcuct input,#addProcuct select'),
        productTable: document.querySelector('.product-table'),
        sendButton: document.querySelector('.sendButton'),
        modal: document.getElementById('productModal'),
        modalSendButton: document.querySelector('.modalSend'),
        modalInputs: document.querySelectorAll('#productModal input,#productModal select'),
    },
    data:{
        url: 'https://vue3-course-api.hexschool.io/',
        path: 'tim8076',
        productData: [],
    },
    eventsBinding(){
        this.dom.productTable.addEventListener('click', this.tableHandler.bind(this));
        this.dom.form.addEventListener('submit', this.addProduct.bind(this));
        this.dom.modalSendButton.addEventListener('click', this.modifyProduct.bind(this));
    },
    getProductData(page = 1){
        const token =  document.cookie
            .split('; ')
            .find(row => row.startsWith('timToken='))
            .split('=')[1];
        axios.defaults.headers.common['Authorization'] = token;

        axios.get(`${this.data.url}api/${this.data.path}/admin/products?page=${page}`)
             .then(res=>{
                 this.data.productData = res.data.products;
                 this.renderProductList();
             })
             .catch(err=>{
                 console.log(err);
             })
    },
    renderProductList(){
        let str = '';
        this.data.productData.forEach((item,index)=>{
            str += `<tr >
                     <td>${index + 1}</td>
                     <td>
                         <img src="${item.imageUrl}" alt="${item.title}" 
                         width="40" height=40""/>
                         ${item.title}
                     </td>
                     <td>${item.origin_price}</td>
                     <td>${item.price}</td>
                     <td>${item.is_enabled ? '啟用' : '未啟用'}</td>
                     <td>
                        <div class="btn-group" role="group" aria-label="Basic outlined example">
                            <button type="button" class="btn btn-sm btn-outline-primary 
                            modifyBtn" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#productModal">修改</button>
                            <button type="button" class="btn btn-sm btn-outline-danger 
                            deleteBtn" data-id="${item.id}">刪除</button>
                        </div>
                     </td>
                  </tr>`
        })
        this.dom.productTable.innerHTML = str;
    },
    addProduct(e){
        e.preventDefault();
        let product = {};
        this.dom.inputs.forEach(item=>{
            if (product[item.id] === undefined){
                if (item.id === 'origin_price' || 
                    item.id === 'price' || 
                    item.id === 'is_enabled'){
                    product[item.id] = parseInt(item.value);
                }else{
                    product[item.id] = item.value;
                }
            }
        });
        axios.post(`${this.data.url}api/${this.data.path}/admin/product`,{
              "data": product
            })
            .then(res=>{
                console.log(res);
                this.getProductData();
                this.dom.form.reset();
            })
            .catch(err=>{
                alert('尚有欄位未填');
                console.dir(err);
            })
    },
    deleteProduct(id){
        axios.delete(`${this.data.url}api/${this.data.path}/admin/product/${id}`)
             .then(res=>{
                 console.log(res);
                 this.getProductData();
             })
             .catch(err=>{
                 console.log(err);
             })
    },
    modifyProduct(){
        let inputs = this.dom.modalInputs;
        let id = this.dom.modal.dataset.id;
        let product = {};
        inputs.forEach(item=>{
            let type = item.dataset.input;
            if (product[type] === undefined){
                if (item.id === 'origin_price-modal' ||
                    item.id === 'price-modal' ||
                    item.id === 'is_enabled-modal') {
                    product[type] = parseInt(item.value);
                } else {
                    product[type] = item.value;
                }
            }
        })
        axios.put(`${this.data.url}api/${this.data.path}/admin/product/${id}`,{
            data: product
        }).then(res=>{
            var myModalEl = document.getElementById('productModal');
            var modal = bootstrap.Modal.getInstance(myModalEl);
            modal.hide();
            this.getProductData();
        }).catch(err=>{
            console.log(err);
        }) 
    },
    tableHandler(e){
        //刪除商品
        if (e.target.matches('.deleteBtn')){
            let id = e.target.dataset.id;
            this.deleteProduct(id);
        }
        //載入修改商品資料
        if (e.target.matches('.modifyBtn')){
            let id = e.target.dataset.id;
            let product = this.data.productData.find(item=>{
                return item.id === id;
            })
            let inputs = this.dom.modalInputs;
            let productAry = Object.keys(product);
            inputs.forEach(input=>{
                productAry.forEach(key=>{
                    if ( input.dataset.input === key ){
                        input.value = product[key];
                    }
                })
            });
            this.dom.modal.dataset.id = id;
        }
    },
    init(){
        this.eventsBinding();
        this.getProductData();
    }
}
dashBoard.init();
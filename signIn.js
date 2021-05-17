
const signIn = {
    doms:{
        form: document.querySelector('#form'),
        signInButton: document.querySelector('.submit'),
        nameInput: document.querySelector('#username'),
        passwordInput: document.querySelector('#password'),
    },
    data:{
        url: 'https://vue3-course-api.hexschool.io/',
    },
    eventsBinding(){
        const vm = this;
        vm.doms.signInButton.addEventListener('click', vm.methods.signIn);
    },
    methods:{
        signIn(e){
            e.preventDefault();
            const vm = signIn;
            let username = vm.doms.nameInput.value.trim();
            let password = vm.doms.passwordInput.value.trim();
            if (username === '' || password === '') return alert('尚有欄位未填');    

            axios.post(`${vm.data.url}admin/signin`, { username, password })
                 .then(res=>{
                    console.log(res.data);
                    let token = res.data.token;
                    let expired = res.data.expired;
                    document.cookie = `timToken=${token}; expires=${expired}`;
                    location.assign("./dashboard.html");
                 })
                 .catch(err=>{
                    console.dir(err);
                 })
            vm.doms.form.reset();
        }
    },
    init(){
        this.eventsBinding();
    }
}
signIn.init();
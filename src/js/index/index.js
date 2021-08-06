//实例化弹窗
let modal=new Modal({title:'测试',callback:function(){
    console.log(modal.value());
    alert('对了')
    modal.close()
}})

function openModal(){
    //打开弹窗
    modal.open()
}
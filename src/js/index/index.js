//实例化弹窗
let modal=new Modal({callback:function(){
    console.log(modal.value());
    modal.close('提交成功')
}})

function openModal(){
    //打开弹窗
    modal.open()
}
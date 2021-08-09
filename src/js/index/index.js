//实例化弹窗
// 公共的信息可以在 new 的时候传过去  按钮点击的方法必传 
let modal=new Modal({callback:function(){
    console.log(modal.value());
    modal.close('提交成功')
}})

function openModal(){
    //打开弹窗
    //modal.open() 或 ⬇️    这个弹窗独有的信息及点击事件可以按下面这种写法 
    modal.open('标题','信息<span>120</span>条','信息2','协议名','javascript:;',function(){modal.close('提交成功222')})
}
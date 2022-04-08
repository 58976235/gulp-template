/*
 * @Author: your name
 * @Date: 2021-08-30 16:38:33
 * @LastEditTime: 2022-04-08 09:00:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /gulp-template/src/pages/index/index.js
 */
//实例化弹窗
// 公共的信息可以在 new 的时候传过去  按钮点击的方法必传 
let modal = new Modal({
    callback: function () {
        console.log(modal.value());
        modal.close('提交成功')
    }
})

function openModal() {
    //打开弹窗
    //modal.open() 或 ⬇️    这个弹窗独有的信息及点击事件可以按下面这种写法 
    modal.open('标题', '信息<span>120</span>条', '信息2', '协议名', 'javascript:;', function () { modal.close('提交成功222') })
}

function debounce(fn,dalay) {
    let timer = null
    return function(){
        console.log(timer);
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(fn ,dalay);
    }
}
function request(){
    $.get('http://localhost:3000/test', { name: 'asdasd' }, function (data) {
        console.log(data);
    })
}

$('.aaaaaaa').on('click', debounce(request,500))
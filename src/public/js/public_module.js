//#region 下拉框
let select_list_dom=''
$('#select>option').each(function(i){
    select_list_dom+='<li data-value="'+$(this).val()+'">'+$(this).text()+'</li>'
})
let select_isShow=false
let select_dom=`
<div class="select">
        <div class="select-header">
            <input type="text" placeholder="请选择" readonly class='select-input'>
            <span class="iconfont select-tag">&#xe699;</span>
        </div>
        <ul class="select-list">`+select_list_dom+`</ul>
    </div>
`
function _select_init(){
    $('#select').hide()
    $('#select').after(select_dom)
    $('.select-list').hide()
}

//初始化下拉框
_select_init()

function _select_hide(){
    select_isShow=false
    $('.select-tag').removeClass('on')
    $('.select-list').hide()
}
function _select_show(){
    select_isShow=true
    $('.select-tag').addClass('on')
    $('.select-list').show()
}

$('.select-header').on('click',function(){
    if(select_isShow){
        _select_hide()
    }else{
        _select_show()
    }
})
$('.select-list').on('click','li',function(){
    $('.select-input').val($(this).text())
    $('.select-input').data('key',$(this).data('value'))
    _select_hide()
})
//#endregion

//#region 留资弹窗
let modal_isCheck=false
let modal_callbackFn=null
~(function modal_dom(){
    const dom_html=`
    <div class="modal-box">
        <div class="modal">
            <div class="modal-input">
                <div class="modal-close">
                    <button onclick='modalClose()'><span class="iconfont">&#xe672;</span></button>
                </div>
                <div class="modal-content">
                    <div class="modal-content-title">
                        <h3>订阅楼市动态</h3>
                    </div>
                    <div class="modal-content-content">
                        <div class="modal-content-msg-box">
                            <p class="modal-content-msg1">已有<span>2200</span>人订阅楼市动态</p>
                            <p class="modal-content-msg2">楼市房产最新消息，我们会及时通知您</p>
                        </div>
                        <div class="modal-content-from">
                            <input id='phone' type="text" placeholder="请输入手机号码">
                            <button onclick='modalsubmit()'>提交</button>
                        </div>
                        <div class="modal-agreement-box">
                            <div class="modal-agreement-check"><span><i class="iconfont">&#xe69c;</i></span>我已阅读并同意</div>
                            <p class="modal-agreement"><a href="">《吉屋用户服务协议》</a></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-alert">
                手机号码不正确
            </div>
        </div>
    </div>
    `
    $('body').prepend(dom_html)
    $('.modal-box').hide()
    modal_isCheck=false
    $('.modal-agreement-check i').hide()
    $('.modal-input').hide()
    $('.modal-alert').hide()
})()
function modalClose(){
    $('.modal-box').hide()
    $('.modal-input').hide()
}
$('.modal-agreement-check').on('click',function(){
    if(modal_isCheck){
        modal_isCheck=false
        $('.modal-agreement-check i').hide()
    }else{
        modal_isCheck=true
        $('.modal-agreement-check i').show()
    }
})

function modalsubmit(){
    if(modal_isCheck){
        let checkStr=/^[1][3,4,5,7,8][0-9]{9}$/;
        let phont=$('.modal-content-from input').val()
        if(!checkStr.test(phont)){
            $('.modal-content-from input').val('')
            $('.modal-alert').addClass('modal-alert-error').removeClass('modal-alert-success')
            $('.modal-alert').text('手机号码有误！')
            $('.modal-alert').show()
            setTimeout(()=>{
                $('.modal-alert').hide()
            },3000)
        }else{
            modal_callbackFn()
        }
    }else{
        $('.modal-alert').addClass('modal-alert-error').removeClass('modal-alert-success')
        $('.modal-alert').text('请阅读并同意相关协议！')
        $('.modal-alert').show()
        setTimeout(()=>{
            $('.modal-alert').hide()
        },3000)
    }
}

/**
 * @param （title：标题，msg1：信息1，msg2：信息2，agreement：协议名称，url：协议地址 callback:提交回调）
 * @function open 打开弹窗  close 关闭弹窗 value 返回手机号
 * @return value 手机号码
 */
class Modal{
    constructor({title,msg1,msg2,agreement,url,callback}){
        this.title=title
        this.msg1=msg1
        this.msg2=msg2
        this.agreement=agreement
        this.url=url
        this.callback=callback
    }
    open(title,msg1,msg2,agreement,url,callback){
        if(this.title!=undefined){
            $('.modal-content-title h3').text(this.title)
        }
        if(this.msg1!=undefined){
            $('.modal-content-msg1').html(this.msg1)
        }
        if(this.msg2!=undefined){
            $('.modal-content-msg2').text(this.msg2)
        }
        if(this.agreement!=undefined){
            $('.modal-agreement a').text(this.agreement)
        }
        if(this.url!=undefined){
            $('.modal-agreement a').attr('href',this.url)
        }
        if(this.callback!=undefined){
            modal_callbackFn=this.callback
        }
        if(title!=undefined){
            $('.modal-content-title h3').text(title)
        }
        if(msg1!=undefined){
            $('.modal-content-msg1').html(msg1)
        }
        if(msg2!=undefined){
            $('.modal-content-msg2').text(msg2)
        }
        if(agreement!=undefined){
            $('.modal-agreement a').text(agreement)
        }
        if(url!=undefined){
            $('.modal-agreement a').attr('href',url)
        }
        if(callback!=undefined){
            modal_callbackFn=callback
        }
        $('.modal-box').show()
        $('.modal-input').show()
    }
    value(){
        return $('#phone').val()
    }
    /**
     * @param 关闭弹窗
     * @requires 弹窗信息
     */
    close(msg){
        if(msg!=undefined){
            $('.modal-alert').text(msg)
            $('.modal-alert').addClass('modal-alert-success').removeClass('modal-alert-error')
            $('.modal-alert').show()
            $('.modal-input').hide()
            setTimeout(()=>{
                $('.modal-alert').hide()
                $('.modal-box').hide()
            },1000)
        }else{
            $('.modal-input').hide()
            $('.modal-box').hide()
        }
    }
}
//#endregion
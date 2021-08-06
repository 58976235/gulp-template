//弹窗
let modal=new Modal({title:'测试',callback:function(){
    $.ajax({
        type: "POST",
        url: "some.php",
        data: "phone="+modal.value(),
        success: function(msg){
          alert( "Data Saved: " + msg );
          //关闭弹窗
          modal.close()
        }
     });
}})

function openModal(){
    //打开弹窗
    modal.open()
}
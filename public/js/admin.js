$(function(){
    $(".del").click(function(e){
        var target = $(e.target)
        var id = target.data('id')
        var tr = $(".item-id-"+id)
        console.log(111)
        $.ajax({
            type:"DElETE",
            url:'/admin/list?id='+id,
        }).done((res)=> {
            console.log(222)
            if(res.success==1){
                if(tr.length>0){
                    console.log(333)
                    tr.remove()
                    alert('删除成功！')
                }
            }
        })
    })
})
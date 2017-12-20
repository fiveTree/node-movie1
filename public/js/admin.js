$(function(){
    console.log(1)
    $(".del").click(function(e){
        console.log(2)
        var target = $(e.target)
        var id = target.data('id')
        var tr = $(".item-id-"+id)
        console.log(111)
        $.ajax({
            type:"DElETE",
            url:'/admin/movie/list?id='+id,
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

    $('#douban').blur(function (e){
        var douban = $(this)
        var id = douban.val()
        if(id){
            $.ajax({
                url:`https://api.douban.com/v2/movie/subject/${id}`,
                cache:true,
                type:'get',
                dataType:'jsonp',
                crossDomain:true,
                jsonp:'callback',
                success(res){
                    console.log(res)
                    $('#inputTitle').val(res.title)
                    $('#inputDoctor').val(res.directors[0].name)
                    $('#inputCountry').val(res.countries[0])
                    $('#inputPoster').val(res.images.large)
                    $('#inputYear').val(res.year)
                    $('#inputSummary').val(res.summary)
                }
            })
        }
    })
})
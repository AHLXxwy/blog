var perpage=2;
var page=1;
var comments=[];
//提交评论
$('#messageBtn').on('click',function(){
    $.ajax({
        type:'POST',
        url:'/api/comment/post',
        data:{
            contentid:$('#contentId').val(),
            content:$('#messageContent').val()
        },
        success:function(responseData){
            $('#messageContent').val('');
            comments=responseData.data.comments.reverse()
            renderComment()
        }
    })
})
//每次页面重载的时候获取一下该文章的所有评论
$.ajax({
    url:'/api/comment',
    data:{
        contentid:$('#contentId').val(),  
    },
    success:function(responseData){
        comments=responseData.data.reverse()
        renderComment()
    }
})
$('.pagination').delegate('a','click',function(){
    if($(this).parent().hasClass("Previous")){
        page--;
    }else{
        page++;
    }
    renderComment();
})
function renderComment(){
    $('#messageCount').html(comments.length)
    pages=Math.max(Math.ceil(comments.length/perpage));
    var start=Math.max(0,(page-1)*perpage);
    var end=Math.min(start+perpage,comments.length);
    var $lis=$('.pagination li')
    $lis.eq(1).html('<a class="page-link" >'+
    '<span aria-hidden="true">'+'&laquo;'+'</span>'+page+'/'+pages+ '<span aria-hidden="true">'+'&raquo;'+
'</a>')
    if(page<=1){
        page=1;
        $lis.eq(0).html('<a class="page-link" aria-label="Previous" >'+
        '<span aria-hidden="true">'+'&laquo;'+'</span>'+' 没有上一页了'+
    '</a>')
    }else{
        $lis.eq(0).html('<a class="page-link" aria-label="Previous" >'+
        '<span aria-hidden="true">'+'&laquo;'+'</span>'+' 上一页'+
    '</a>')
    }
    if(page>=pages){
        page=pages;
        $lis.eq(2).html('<a class="page-link" aria-label="Next">'+
       '</span>'+' 没有下一页了'+ '<span aria-hidden="true">'+'&raquo;'+
    '</a>')
    }else{
        $lis.eq(2).html('<a class="page-link" aria-label="Next" >'+
        '</span>'+' 下一页'+ '<span aria-hidden="true">'+'&raquo;'+
     '</a>')
    }
    if(comments.length==0){
       
        $('.messageList').html('<div class="messageBox"><p>还没有评论</p></div>')
    }else{
        var html = '';
        for (var i = start; i < end; i++) {
            html += '<div class="messageBox">' + '<p class="name clear">' + comments[i].username + '</p>'
                + '<p class="name clear">' + formatDate(comments[i].postTime) + '</p>' +
                '<p class="name clear">' + comments[i].content + '</p>' + '</div>';
        }
        $('.messageList').html(html);
    }
       
    
}
//格式化时间
function formatDate(d){
    var date1=new Date(d);
    return date1.getFullYear()+'年'+(date1.getMonth()+1)+'月'+date1.getDate()+'日'
    +date1.getHours()+":"+date1.getMinutes()+':'+date1.getSeconds();
}
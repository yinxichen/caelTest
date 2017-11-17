/* AdminJKJ $.jkj
 * ==========================
 * @作者 尹喜晨
 * @日期 2017-06-08
 *
 * 修改日志：
 *
 */
/*! code 代码展开
 */
$('[data-xmp]').click(function(){
	var t=$(this).text();
	if(t=="展开代码"){
		$(this).prev('code').css("height","auto");
		$(this).text("收起代码");
	}else{
		$(this).prev('code').css("height","100px");
		$(this).text("展开代码");
	}  
});


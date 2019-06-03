$(document).ready(function(){
  // alert("hi");
  $(".delete").click(function(){
     // alert("clicked");
     var id = $(this).val();
     // alert(id);
     $.post("/remove",{no:id},function(data){
       location.reload('/'); 
     });
  });
  $(".edit").click(function(){
  	var x=$(this).val();
  	//alert(x);
  	$.post("/edit",{y:x},function(data){
      // alert(data);
      var a=JSON.stringify(data);
      // alert(a);
      var parseddata=JSON.parse(a);
      //alert(parseddata[0].firstName);
      $("#id").val(parseddata[0]._id);
      $("#firstName1").val(parseddata[0].firstName);
      $("#lastName1").val(parseddata[0].lastName);
      $("#email1").val(parseddata[0].email);
      $("#telephone1").val(parseddata[0].telephone);
  	});
  	$(".dontshow").show();
  });
});
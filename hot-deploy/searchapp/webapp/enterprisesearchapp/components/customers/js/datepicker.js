$('.input-group.date').datepicker({
 format: "mm/dd/yyyy",
 startDate: "01-01-1991",
 endDate: "01-01-2020",
 todayBtn: "linked",
 autoclose: true,
 todayHighlight: true
});

$(".text-date1").click(function(){
 $(".datepicker").hide();
});
$(".text-date1").focus(function(){
 $(".datepicker").hide();
});
$(".text-date2").click(function(){
 $(".datepicker").hide();
});
$(".text-date2").focus(function(){
 $(".datepicker").hide();
});


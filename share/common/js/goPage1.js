function goPage() { };
goPage.prototype.muiGoPage = function (Url, Id, data) {
	var p = Id.split('/');
	var myId = p[p.length - 1].split('.', 1)[0]; //一般是页面名称
	mui.openWindow({
		url: Url, //需要打开页面的url地址 
		id: myId, //需要打开页面的url页面id
		extras: {
			muiData: data
		},
		show: { //控制打开页面的类型
			autoShow: true,
			//页面loaded事件发生后自动显示，默认为true 
			aniShow: false, //页面显示动画，默认为”slide-in-right“；  页面出现的方式 左右上下
			duration: '1000' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		},
		create: true,

	})
}
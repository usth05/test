/*
 *	createTime:2019年5月23日
 * 	author	  :sth
 */
//数据请求
//页面跳转
var goAh = new goPage();
var app = new Vue({
	el: '.YDapp',
	data: {
		punchBg: "./img/zdinit.png",
	},
	methods: {
		goAh: function (url, isGo) {
			var that = this
			var data = {
                shareInfo:'',
                goodsId:'',
			};
			if(!JSON.parse(localStorage.getItem('myInfo')) && !isGo) {
				goAh.muiGoPage("login/login.html", "login/login.html");
			} else {
				// goAh.muiGoPage(url, url, data)
                var listData = JSON.stringify(data);
                window.location.href=url+"?data="+listData;
			}
		},
	}
})
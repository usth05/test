/*
 *	createTime:2018年12月4日10:42:27
 * 	author	  :王栋
 */
//页面跳转
var goAh = new goPage();
var http = new HttpConnection();
var app = new Vue({
	el: '.YDapp',
	data: {
		info:"",
	},
	created: function() {
		this.startFun() //默认数据
	},
	methods: {
		//页面第一次请求数据
		startFun: function() {
			var that = this;
			mui.plusReady(function() {
				var param = {
					
				}
				var Url = _serverAddr2 + "index/selectUserPrivacy.json";
				http.getJSON(Url, param, function(data) {
					if(data.success) {
					that.info = data.data.info;
					}
				}) 
			})
		},
	},
})
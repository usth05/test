/*
 *	createTime:2019年5月23日
 * 	author	  :sth
 */
//页面跳转
var goAh = new goPage();
//数据请求
var http = new HttpConnection();
var http2 = new HttpConnection();
var http3 = new HttpConnection();
var app = new Vue({
	el: '.YDapp',
	data: {
		listData: [],
		typeId: '', //试卷id
		topName: '', //顶部名称
		oldData: {}, //本套测试的数据
	},
	created: function() {
		//加载数据
		this.startFun()
	},
	methods: {
        // 获取地址栏参数
        getUrlParam: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = decodeURIComponent(window.location.search).substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]); return null; //返回参数值
        },
		//查询一级分类
		startFun: function() {
			var that = this;
			var info = localStorage.getItem('myInfo');
			var myInfo = JSON.parse(info);
			that.myInfo = myInfo;
			var userId = myInfo.id;
			that.userId = userId;
            var myData = JSON.parse(this.getUrlParam('data'));
            console.log(myData);
            var typeId = myData.list.id;
            that.topName = myData.list.name;
            that.typeId = typeId;
            that.oldData = myData.list;
            var param = {
				typeId: that.typeId,
				userId: that.userId,
			};
			var Url = _serverAddr2 + "appWebpage/selectUserAssess.json";
			http.getJSON(Url, param, function(res) {
				if(res.success) {
					that.listData = res.data;
					for(var i = 0; i < that.listData.length; i++) {
						that.listData[i].date = that.timestampToTime(that.listData[i].addTime)
					}
				}
			})
		},
		uploadReport: function(url) {
        	console.log(url);
			window.open(url);
		},
		//时间戳转化成日期
		timestampToTime: function(timestamp) {
			var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
			Y = date.getFullYear() + '-';
			M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			D = date.getDate() + ' ';
			h = date.getHours() + ':';
			m = date.getMinutes() + ':';
			s = date.getSeconds();
			return Y + M + D;
		},
	},
})
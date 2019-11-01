/*
 *	createTime:2018年12月28日15:52:50
 * 	author	  :王栋
 */
//页面跳转
var goAh = new goPage();
//数据请求
var http = new HttpConnection();
var app = new Vue({
	el: '.YDapp',
	data: {
		list: {},
		activateId: null,
		isStatus:false,
	},
	created: function () {
		//加载数据
		this.startFun()
	},
	methods: {
		// 获取地址栏参数
		getUrlParam: function (name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
			var r = decodeURIComponent(window.location.search).substr(1).match(reg);  //匹配目标参数
			if (r != null) return unescape(r[2]); return null; //返回参数值
		},
		startFun: function () {
			var myData = JSON.parse(this.getUrlParam('data'));
			console.log(myData)
			this.activateId = myData.activateId;
			this.list = myData.list;
			this.isStatus = myData.isStatus;
			setTimeout(() => {
				$("#audio")[0].play();
			}, 300);
			
		},
		//跳转到答题页面
		goTestPaper: function () {
			var Url;
			switch (this.list.typeId) {
				case 1: //选择题
					Url = 'selectPage.html';
					break;
				case 2: //填空题
					Url = 'writePage.html';
					break;
				case 3: //论述题
					Url = 'essayPage.html';
					break;
				default:
					break;
			}
			var data = {
				list: this.list,
				activateId: this.activateId,
				isStatus: this.isStatus,
			}
			var listData1 = JSON.stringify(data);
			window.location.href = Url + "?data=" + listData1;
		},
	},
	mounted: function() {
		var that = this;
        window.addEventListener("popstate", function(e) {
			$("#audio")[0].parse();
		}, false);
	}
})
/*
 *	createTime:2019年7月17日  星期四  18:00
 * 	author	  :sth
 * 	link	  :topicList(记题本列表页面)
 */
var goAh = new goPage(); //页面跳转
var http = new HttpConnection();
var app = new Vue({
	el: '.YDapp',
	data: {
		listData: [],
		topName: '信息确认', //顶部名称
		self: null, //当前webview页面
		textData: {}, //上一页传回来的数据
		activateId: null,
	},
	created: function () {
		this.startFun()
		//默认数据
	},
	methods: {
		// 获取地址栏参数
		getUrlParam: function (name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
			var r = decodeURIComponent(window.location.search).substr(1).match(reg);  //匹配目标参数
			if (r != null) return unescape(r[2]); return null; //返回参数值
		},
		startFun: function () {
			var that = this;
			var info = localStorage.getItem('myInfo');
			var myInfo = JSON.parse(info);
			var myData = JSON.parse(this.getUrlParam('data'));
			that.userId = myInfo.id;
			that.textData = myData;
			that.typeId = myData.typeId;
			that.activateId = myData.activateId;
			that.getAssessExam();
		},
		//打开询问是否退出弹窗
		askBack: function () {
			this.showMaskZ();
		},
		//关闭当前webview页面
		goBack: function () {
			window.location.href="clinicTest.html";
		},
		//获取题目类型
		getAssessExam: function () {
			var that = this;
			var paramAssess = {
				userId: this.userId,
				typeId: this.typeId,
			};
			var UrlAssess = _serverAddr2 + "appWebpage/selectAssessExam.json";
			var httpUrlAssess = new HttpConnection();
			httpUrlAssess.getJSON(UrlAssess, paramAssess, function (res) {
				if (res.success) {
					that.listData = res.data.amList;
					that.number = res.data.isOver;
				}
			})
		},
		//显示退出提示框
		showMaskZ: function () {
			$("#maskZ").show();
		},
		//隐藏退出提示框
		closeMaskZ: function () {
			$("#maskZ").hide();
		},
		//跳转到答题页面
		goTestPaper: function (list, type, index) {
			var isStatus = false;
			if (this.number == this.listData.length) {
				isStatus = true;
			} else {
				isStatus = false;
			}
			if (this.number - 1 == index) {
				var Url = 'remindPage.html';
				var data = {
					list: list,
					activateId: this.activateId,
					isStatus: isStatus,
				}
				// goAh.muiGoPage(Url, Url, data);
				var listData1 = JSON.stringify(data);
				window.location.href = Url + "?data=" + listData1;
			} else if (this.number - 1 > index) {
				mui.toast("题目已完成，不可重复测评");
			} else if (this.number - 1 < index) {
				mui.toast("请养成好习惯，不要跳题");
			}
		},
		submit: function () {
			var that = this;
			var urlStatus = _serverAddr2 + 'appWebpage/updateExamStatus.json';
			var httpData = {
				activateId: that.activateId,
			};
			var httpStatus = new HttpConnection();
			httpStatus.getJSON(urlStatus, httpData, function (res) {
				if (res.success) {
					setTimeout(function () {
						mui.toast("本次测评已完成");
						that.goBack();
					}, 300)
				} else {
					mui.toast(res.msg);
				}
			})
		},
		pushHistory: function () {
			var state = {
				title: "title",
				url: "#"
			};
			window.history.pushState(state, "校内语文学习达标测评系统", "#");
		}
	},
	mounted: function () {
		var that = this;
		that.pushHistory();
		window.addEventListener("popstate", function (e) {
			that.askBack();
		}, false);
	}
});
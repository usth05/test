/*
 *	createTime:2019年7月17日  星期四  18:00
 * 	author	  :sth
 * 	link	  :selectPage(选择题页面)
 */
/*
================================================================================================
================================================================================================
*/
var goAh = new goPage(); //封装跳转方法
var http = new HttpConnection(); //ajax封装
var app = new Vue({
	el: '#app',
	data: {
		listData: [], //所有的题目数据
		currentData: {}, //当前题目数据信息
		uacList: [], //所有选中的数据
		number: 0, //当前是第几道题目
		userId: 0, //当前用户id
		activateId: 0, //activateId
		isStatus: false, //是否完成测评
		seconds: 0, //定时
		currentIndex: 0, //当前第几题
		listDataNum: 0, //一共多少题
		isSubmit: false, //是否显示提交
		selectActive: -1, //选中的index
	},
	created: function() {
		var that = this;
		this.startFun();
		mui.plusReady(function() {
			mui.back = function() {}
			plus.key.addEventListener("backbutton", function() {
				that.askBack();
			});
		})
	},
	methods: {
        // 获取地址栏参数
        getUrlParam: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = decodeURIComponent(window.location.search).substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]); return null; //返回参数值
        },
		//打开询问是否退出弹窗
		askBack: function() {
			$("#maskZ").show();
		},
		//隐藏退出提示框
		closeMaskZ: function() {
			$("#maskZ").hide();
		},
		//返回上一页并刷新，并关闭当前页
		goBack: function() {
			history.go(-3);
		},
		//返回入口页并刷新，关闭其子webView
		goOldBack: function() {
        	var data = {};
            var listData1 = JSON.stringify(data);
            window.location.href= "clinicTest.html?data="+listData1;
		},
		startFun: function() {
			var that = this;
			var myData = JSON.parse(this.getUrlParam('data'));
			var list = myData.list;
			that.userId = JSON.parse(localStorage.getItem('myInfo')).id;
			that.number = list.number;
			that.id = list.id;
			that.activateId = myData.activateId;
			that.isStatus = myData.isStatus;
			var param = {
				examId: that.id,
				number: that.number
			}
			var Url = _serverAddr2 + "appWebpage/selectAssessQuestion.json";
			http.getJSON(Url, param, function(res) {
				if(res.success) {
					that.listData = res.data;
					that.listDataNum = res.data.length;
					that.nextQuestion();
				}
			})
		},
		//定时器
		timerFun: function() {
			var that = this;
			var seconds = that.currentData.seconds;
			that.seconds = seconds;
			if(seconds) {
				that.t = setInterval(function() {
					that.seconds--;
					if(that.seconds <= 0) {
						clearInterval(that.t);
						setTimeout(function() {
							that.selecedFun();
						}, 1000)
					}
				}, 1000);
			}
		},
		//选中事件函数
		selecedFun: function(item) {
			var _this = this;
			var obj = {
				userId: this.userId, //用户id
				userAnswer: item ? item.choosen : '', //选中项
				questionId: this.currentData.id, //问题id
				activeId: item ? item.id : '', //选中项id
			}; //保存选中的数据
			this.selectActive = item ? item.id : -1;
			this.uacList.push(obj);
			//100毫秒后更新数据
			setTimeout(function() {
				_this.nextQuestion();
			}, 100)
		},
		//跳转下一题
		nextQuestion: function() {
			var _this = this;
			clearInterval(this.t);
			var index = this.currentIndex; //获取题号
			if(index < this.listDataNum) {
				this.currentData = this.listData[index]; //获取下一题并赋值给currentData
				this.currentIndex++;
				setTimeout(function() {
					_this.timerFun();
				})
			} else {
				this.isSubmit = true;
			}
		},
		/* *
		 	提交答案逻辑
		 * */
		submit: function() {
			var that = this;
			var uacList = JSON.stringify(this.uacList)
			var param = {
				activateId: that.activateId,
				uacList: uacList,
				type: 1,
			}
			var Url = _serverAddr2 + "appWebpage/insertUserAssess.json";
			http.getJSON(Url, param, function(res) {
				if(res.success) {
					mui.toast("本模块题目已答完,请继续下一模块");
					if(that.isStatus) {
						var urlStatus = _serverAddr2 + 'appWebpage/updateExamStatus.json';
						var httpData = {
							activateId: that.activateId,
						};
						var httpStatus = new HttpConnection();
						httpStatus.getJSON(urlStatus, httpData, function(res) {
							if(res.success) {
								setTimeout(function() {
									mui.toast("本次测评已完成");
									that.goOldBack();
								}, 1000)
							} else {
								mui.toast(res.msg);
							}
						})
					} else {
						setTimeout(function() {
							that.goBack();
						}, 1000)
					}
				}
			})
		},
        pushHistory:function() {
            var state = {
                title: "title",
                url: "#"
            };
            window.history.pushState(state, "title", "#");
        },
	},
	mounted: function() {
		// this.scrollInit();
		var that = this;
		this.pushHistory(); 
        window.addEventListener("popstate", function(e) {
            that.askBack();
        }, false);
	}
})
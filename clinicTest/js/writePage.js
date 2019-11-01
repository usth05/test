/*
 *	createTime:2019年7月17日  星期四  18:00
 * 	author	  :sth
 * 	link	  :writePage(填空)
 */
var goAh = new goPage(); //页面跳转
var http = new HttpConnection();
var app = new Vue({
	el: '.YDapp',
	data: {
        listData: [], //所有的题目数据
        currentData: {}, //当前题目数据信息
        uacList: [], //所有选中的数据
        number: 0, //当前是第几类题目
        userId: 0, //当前用户id
        activateId: 0, //activateId
        userAnswer: '',//用户回答的问题
        isStatus: false, //是否完成测评
        seconds: 0, //定时
        currentIndex: 0, //当前第几题
        listDataNum: 0, //一共多少题
        isSubmit: false, //是否显示提交
        isRreadonly:false,//禁止输入
	},
	created:function() {
		this.startFun()
		//默认数据
	},
	methods: {
        //打开询问是否退出弹窗
        askBack:function() {
            this.showMaskZ();
        },
        //返回上一页并刷新，并关闭当前页
        goBack: function() {
            history.go(-2);
        },
        //显示退出提示框
        showMaskZ:function() {
            $("#maskZ").show();
        },
        //隐藏退出提示框
        closeMaskZ:function() {
            $("#maskZ").hide();
        },
        //返回入口页并刷新，关闭其子webView
        goOldBack: function() {
            var data = {};
            var listData1 = JSON.stringify(data);
            window.location.href= "clinicTest.html?data="+listData1;
        },
		// 获取地址栏参数
        getUrlParam: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = decodeURIComponent(window.location.search).substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]); return null; //返回参数值
        },
		startFun:function() {
			var that = this;
			var myData = JSON.parse(this.getUrlParam('data'));
			var list = myData.list;
			var info = localStorage.getItem('myInfo');
			var myInfo = JSON.parse(info);
			that.isStatus = myData.isStatus;
			that.userId = myInfo.id;
			that.topName = list.name;
			that.number = list.number;
			that.id = list.id;
			that.activateId = myData.activateId;
			var param = {
				examId: that.id,
				number: that.number
			}
			var Url = _serverAddr2 + "appWebpage/selectAssessQuestion.json";
			http.getJSON(Url, param, function (res) {
				if (res.success) {
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
        //填空题填写完毕执行函数
        selecedFun:function() {
            if(this.seconds > 0 && this.userAnswer==''){
            	mui.toast('请养成良好的习惯不要跳题');
            }else{
                var _this = this;
                var obj = {
                    userId: this.userId, //用户id
                    userAnswer: this.userAnswer, //选中项
                    questionId: this.currentData.id, //问题id
                }; //保存选中的数据
                this.uacList.push(obj);
                //100毫秒后更新数据
                setTimeout(function() {
                    _this.nextQuestion();
                }, 100)
			}
        },
        //跳转下一题
        nextQuestion:function() {
            var _this = this;
            clearInterval(this.t);
            var index = this.currentIndex; //获取题号
            if(index < this.listDataNum) {
                this.currentData = this.listData[index]; //获取下一题并赋值给currentData
                this.currentIndex++;
                this.userAnswer = '';
                setTimeout(function() {
                    _this.timerFun();
                });
				if(index ==  this.listDataNum-1){
                    this.isSubmit = true;
				}
            }
        },
		/* *
		 	提交答案逻辑
		 * */
		submit:function() {var that = this;
            if(this.seconds > 0 && this.userAnswer==''){
                mui.toast('请答完所有题目');
            }else {
                var that = this;
                if (that.seconds != 0) {
                    this.selecedFun();
                }
                var uacList = JSON.stringify(this.uacList)
                var param = {
                    activateId: this.activateId,
                    uacList: uacList,
                    type: 2,
                };
                var Url = _serverAddr2 + "appWebpage/insertUserAssess.json";
                http.getJSON(Url, param, function (res) {
                    if (res.success) {
                        mui.toast("本模块题目已答完,请继续下一模块");
                        if (that.isStatus) {
                            var urlStatus = _serverAddr2 + 'appWebpage/updateExamStatus.json';
                            var httpData = {
                                activateId: that.activateId,
                            };
                            var httpStatus = new HttpConnection();
                            httpStatus.getJSON(urlStatus, httpData, function (res) {
                                if (res.success) {
                                    setTimeout(function () {
                                        mui.toast("本次测评已完成");
                                        that.goOldBack();
                                    }, 1000)
                                } else {
                                    mui.toast(res.msg)
                                }
                            })
                        } else {
                            setTimeout(function () {
                                that.goBack();
                            }, 1000)
                        }
                    }
                })
            }
		}
	},
	mounted:function() {
		var that = this;
		mui.plusReady(function () {
			mui.back = function () {

			}
			plus.key.addEventListener("backbutton", function () {
				that.askBack();
			});
		})
	}
})
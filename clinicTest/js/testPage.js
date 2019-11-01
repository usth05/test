/*
 *	createTime:2019年7月17日
 * 	author	  :sth
 */
//页面跳转
var goAh = new goPage();
//数据请求
var http = new HttpConnection();
var app = new Vue({
	el: '.YDapp',
	data: {
		listData: {},
		password: '', //激活码
		isUpload: null, //是否继续测评
		number: null, //该做第几个类型
		type: 0,
        baifenbi:'',
        sinUpPop:false,
		name:'',
        telephone:'',
        info:'',
        shortcoming:'',
	},
	created: function () {
		//加载数据
		this.startFun()
		setTimeout(()=>{
			
		console.log($(".progressBar")[0].style)
		},500)
	},
	methods: {
		// 获取地址栏参数
		getUrlParam: function (name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
			var r = decodeURIComponent(window.location.search).substr(1).match(reg);  //匹配目标参数
			if (r != null) return unescape(r[2]); return null; //返回参数值
		},
		//查询一级分类
		startFun: function () {
			var that = this;
			var info = localStorage.getItem('myInfo');
			if (info) {
				var myInfo = JSON.parse(info);
				that.myInfo = myInfo;
				var userId = myInfo.id;
				that.userId = userId;
			};
			var myData = JSON.parse(this.getUrlParam('data'));
			that.listData = myData.list;
			that.isUpload = myData.list.isUpload;
			that.number = myData.list.number;
			that.baifenbi = myData.list.baifenbi;
			that.type = myData.list.type;
			$(".progressBar").css("width",that.baifenbi+'%');
		},
		//跳转下一页 查看报告
		goNextPage: function (url, list) {
			var data = {
				list: this.listData ? this.listData : '暂无数据',
			};
			var listData = JSON.stringify(data);
			window.location.href = "lookReport.html?data=" + listData;
		},
		//激活
		goActivation: function () {
			var that = this;
			var password = that.password;
			// that.goTopicList();
			if (!password) {
				mui.toast("请输入激活码");
				return;
			}
			var param = {
				userId: that.userId,
				password: that.password,
				colckId: that.listData.id,
			}
			var Url = _serverAddr2 + "appWebpage/activateAssessCard.json";
			http.getJSON(Url, param, function (res) {
				if (res.success) {
					that.listData.activateId = res.data;
					that.isUpload = 1;
					that.closeZ();
					mui.toast("激活成功");
					setTimeout(function () {
						that.goTopicList();
					})
				} else {
					mui.toast(res.msg)
				}
			})
		},
		goTopicList: function () {
			if (this.listData.typeIds) {
				var data = {
					topName: this.listData.name,
					typeId: this.listData.typeIds,
					activateId: this.listData.activateId,
				}
				var listData = JSON.stringify(data);
				window.location.href = "topicList.html?data=" + listData;
				// goAh.muiGoPage("./topicList.html", "./topicList.html", data)
			} else {
				var data = {
					number: this.listData.number,
					topName: this.listData.name,
					typeId: this.listData.id,
					activateId: this.listData.activateId,
					level: this.listData.level,
					oneName: this.listData.oneName,
					twoName: this.listData.twoName,
					threeName: this.listData.threeName,
					typeIds: this.listData.typeIds,
					isUpload: this.listData.isUpload,
					isTypea: this.listData.isTypea,
					isTypeb: this.listData.isTypeb,
				};
				var listData = JSON.stringify(data);
				window.location.href = "selectGrade.html?data=" + listData;
				// goAh.muiGoPage('selectGrade.html', 'selectGrade.html', data);
			}
		},
		signUp:function(){
			var _this = this;
			if(this.baifenbi < 100) {
            	if(this.name==''){
                    mui.toast("学生姓名不能为空");
                    return false;
				}else if(this.telephone==''){
                    mui.toast("联系方式不能为空");
                    return false;
				}else if(!(/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(this.telephone))) {
                    mui.toast("手机号码有误，请重填");
                    return false;
                }else if(this.info==''){
                    mui.toast("学生现状不能为空");
                    return false;
				}else if(this.shortcoming==''){
                    mui.toast("学生需求不能为空");
                    return false;
                }
				var param = {
					userId: JSON.parse(localStorage.getItem('myInfo')).id,
					mealId: this.listData.id,
                    telephone:this.telephone,
                    info:this.info,
                    name:this.name,
                    shortcoming:this.shortcoming,
				}
				var Url = _serverAddr2 + "appWebpage/insertAssessEntered.json";
				http.getJSON(Url, param, function (data) {
					if (data.success) {
						mui.toast("报名成功");
                        _this.telephone='';
                        _this.name='';
                        _this.info='';
                        _this.shortcoming='';
                        _this.sinUpPopFun();
					}else{
						mui.toast(data.msg);
                        _this.sinUpPopFun();
                        _this.telephone='';
                        _this.name='';
                        _this.info='';
                        _this.shortcoming='';
					}
				})
			}else{
				mui.toast("本次活动已结束，敬请期待下次活动的开始");
			}
			
		},
		closeZ: function () {
			$("#maskZ").hide()
		},
		closeZ1: function () {
			$("#maskZ1").hide()
		},
		//控制温馨提示的显示
		maskZ1Fun: function () {
			$("#maskZ1").show()
		},
		//控制激活窗口的显示
		maskZFun: function () {
			$("#maskZ").show();
			this.closeZ1();
			this.password = '';
		},
		//拨打电话
		dialTest: function () {
			this.closeZ()
			this.closeZ1()
			// plus.device.dial('18167140039', true);
		},
        sinUpPopFun:function(){
			this.sinUpPop = !this.sinUpPop;
		},
	},
})
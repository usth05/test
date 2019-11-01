/*
 *	createTime:2018年3月9日  星期五  14:37:15
 * 	author	  :cxl
 * 	link	  :information.html(完善信息)
 */

var muiGo = new goPage();
var picture = new getPicture();
var http = new HttpConnection();
var vm = new Vue({
	el: '.YDapp',
	data: {
		step: 'partOne', //完善信息一
		list: [{
			value: '男'
		}, {
			value: '女'
		}],
		compressImgUrl: [],
		imgUrl: [], //
        imgInfo:'',
		//完善信息
		infoData: {
			shortcoming: "", //缺点
			hobby: "", //爱好
			nickname: '', //昵称
			name: '', //姓名
			sex: '', //性别
			age: '',
			address: '', //地址
			careful: '', //详细地址
			stage: '', //阶段（年级）
			school: '', //学校
			Class: '', //班级
			director: '', //
			subject: '', //科目名称
			subjectId: '', //选择科目id
		},
		addressData: [], //
		stageData: [{ //
			text: '一年级'
		}, {
			text: '二年级'
		}, {
			text: '三年级'
		}, {
			text: '四年级'
		}, {
			text: '五年级'
		}, {
			text: '六年级'
		}],
		subjectData: [], //科目
		userId: '', //用户id
		isContact: false, //是否显示填写联系
		oneMessage: "", //文本一
		twoMessage: "", //文本二
		threeMessage: "", //文本三
		edit3: true, //笔是否显示
		edit2: true, //笔是否显示
		edit1: true, //笔是否显示
		kweixin: '', //客服微信
		kphone: '', //客服手机号
        kInfo:'',//客服信息
	},
	created: function() {
		this.subjectFun();
	},
	methods: {
        // 获取地址栏参数
        getUrlParam: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = decodeURIComponent(window.location.search).substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]); return null; //返回参数值
        },
		//获取焦点
		tapText: function(i) {
			this[i] = false;
		},
		//失去焦点
		tapText1: function(i) {
			this[i] = true;
		},
		//复制到剪切板
		copy: function(copy) {
			// 复制链接到剪切板
			// 判断是安卓还是 ios
            var e = document.getElementById("copy");
            e.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            alert("内容复制成功！");
		},
		//查询科目
		subjectFun: function() {
			var that = this;
				that.userId = this.getUrlParam("userId");
				var param = '';
				var Url = _serverAddr + "subject/selectSubject.json";
				http.getJSON(Url, param, function(data) {
					var dt = data.data
					for(var i = 0; i < dt.length; i++) {
						dt[i].text = data.data[i].subjectName;
						dt[i].id = data.data[i].id;
					}
					that.subjectData = dt;
				})
				var param1 = {};
				var Url1 = _serverAddr + "user/selectUserService.json";
				var http1 = new HttpConnection();
				http1.getJSON(Url1, param1, function(data) {
					if(data.success) {
						var data = data.data;
						for(var i = 0; i < data.length; i++) {
							if(data[i].type == 0) { //微信
								that.kweixin = data[i].service
							} else if(data[i].type == 1) { //手机号
								that.kphone = data[i].service
							}
						}
					}
				})
		},
		//选择所在城市
		address: function(v) {
			var that = this;
			(function($, doc) {
				/**
				 * 获取对象属性的值
				 * 主要用于过滤三级联动中，可能出现的最低级的数据不存在的情况，实际开发中需要注意这一点；
				 * @param {Object} obj 对象
				 * @param {String} param 属性名
				 */
				var _getParam = function(obj, param) {
					return obj[param] || '';
				};
				if(v == 'add') {
					//	//级联示例
					var cityPicker3 = new $.PopPicker({
						layer: 3
					});

					cityPicker3.setData(cityData3);
					cityPicker3.show(function(items) {
						that.infoData.address = _getParam(items[0], 'text') + " " + _getParam(items[1], 'text') + " " + _getParam(
							items[2], 'text');
						//返回 false 可以阻止选择框的关闭
						//return false;
					})
				} else if(v == 'subject') { //选择孩子科目
					var subjectPicker = new $.PopPicker();
					subjectPicker.setData(that.subjectData);
					subjectPicker.show(function(items) {
						that.infoData.subject = items[0].text;
						that.infoData.subjectId = items[0].id;
						//返回 false 可以阻止选择框的关闭
						//return false;
					});
				} else if(v == 'stage') { //选择孩子阶段（年级）
					var userPicker = new $.PopPicker();
					userPicker.setData(that.stageData);
					userPicker.show(function(items) {
						that.infoData.stage = items[0].text;
						//返回 false 可以阻止选择框的关闭
						//return false;
					});
				}
			})(mui, document);
		},
		//跳过
		skip: function() {
			muiGo.muiGoPage("../test.html", "../test.html", "")
		},
		//下一步
		nextStep: function() {
			var that = this;
			if(!/^[\u4e00-\u9fa5][\u4e00-\u9fa5|a-zA-Z|0-9]{1,5}$/.test(that.infoData.nickname)) {
				mui.alert("请正确输入昵称");
			} else if(!/^([\u4e00-\u9fa5]{2,5})$/.test(that.infoData.name)) {
				mui.alert("请正确输入姓名");
			} else if(that.infoData.age == '' || that.infoData.age == null) {
				mui.alert("请输入年龄");
			} else if(that.infoData.sex != '男' && that.infoData.sex != '女') {
				mui.alert("请选择性别");
			} else if(that.infoData.address == '' || that.infoData.nickname == null) {
				mui.alert("请选择地区");
			} else if(that.infoData.careful == '' || that.infoData.careful == null) {
				mui.alert("请填写详细地址");
			} else if(imgurl == '' || imgurl == null || imgurl == 'undefined') {
				mui.alert("请上传头像");
			} else {
				this.step = 'partTwo'
			}
		},
		test: function() {
			var that = this;
		},
		//完成提交
		sub: function() {
			var that = this;
            if(!/^[\u4e00-\u9fa5][\u4e00-\u9fa5|a-zA-Z|0-9]{1,5}$/.test(that.infoData.nickname)) {
                mui.alert("请正确输入昵称");
            } else if(!/^([\u4e00-\u9fa5]{2,5})$/.test(that.infoData.name)) {
                mui.alert("请正确输入姓名");
            }else if(that.infoData.sex != '男' && that.infoData.sex != '女') {
                mui.alert("请选择性别");
            } else if(that.infoData.address == '' || that.infoData.nickname == null) {
                mui.alert("请选择地区");
            } else if(that.infoData.careful == '' || that.infoData.careful == null) {
                mui.alert("请填写详细地址");
            }else if(that.infoData.stage == '' || that.infoData.stage == null) {
				mui.alert("请选择阶段");
			} else if(that.infoData.school == '' || that.infoData.school == null) {
				mui.alert("请正确输入学校");
			} else {
				var param = {
					id: that.userId,
					imageUrl: imgurl,
					nickName: that.infoData.nickname, // 昵称
					realName: that.infoData.name, //真实名字
					sex: that.infoData.sex, //性别 
					address: that.infoData.address, // 地址 
					detailAddress: that.infoData.careful, // 详细地址 
					grade: that.infoData.stage, //年纪 阶段
					schoolName: that.infoData.school, // 学校名称
				};
				var Url = _serverAddr + "user/completeInformation.json";
				http.getJSON(Url, param, function(data) {
					if(data.success) {
						//mui.toast('提交完成');
						/*setTimeout(function() {
							
						}.bind(this), 1000);*/
						that.isContact = true;
					} else {
						mui.toast(data.msg);
					}

				})
			}
		},
		//跳转到登录
		goLogin: function() {
			var data = {
				backUrl: "../test.html",
			}
			muiGo.muiGoPage("../login/login.html", "../login/login.html", data);
		},
		//跳转到登录
		goLogin1: function() {
			// console.log("run11");
			var userData = {
				oneMessage: this.oneMessage,
				twoMessage: this.twoMessage,
				threeMessage: this.threeMessage,
				id: this.userId,
			};
			var userUrl = _serverAddr + "user/completeInformation.json";
			var http1 = new HttpConnection();
			http1.getJSON(userUrl, userData, function(data) {
				if(data.success) {
					mui.toast("提交成功");
					setTimeout(function() {
						var data = {
							backUrl: "../test.html",
						}
						muiGo.muiGoPage("../login/login.html", "../login/login.html", data);
					}, 1000)
				}
			})
		},
		//拨打电话
		dialTest: function(kphone) {
			$("#maskZ").hide();
		},
		//关闭确认框
		closeZ: function() {
			$("#maskZ").hide();
		},
		maskZ: function(type) {
        	if(type==0){
                this.kInfo = '客服微信:' + this.kweixin;
			}else{
                this.kInfo = '客服微信:' + this.kphone;
			}
			$("#maskZ").show();
		},
	}
})
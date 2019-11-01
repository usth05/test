//引用js  new一个对象
var muiGo = new goPage();
var http = new HttpConnection();
var vm = new Vue({
	el: ".main",
	data: {
		hide1: "images/lookPassword.png",
		look1: "images/lookPassword.png",
		imageNav: "images/hide.png",
		ss: 0, //帮助看密码
		n: 60, //重新发送
		isOk: false,
		sessionId: "",
		isSub: true,
	},
	methods: {
		focusss: function(event) {
			var my = event.currentTarget;
			var myFather = my.parentElement;
			var myDelete = my.nextElementSibling;
			myFather.style.borderBottom = "1px solid #fa6814";
			myDelete.style.opacity = "1"
		},
		blurss: function(event) {
			var my = event.currentTarget;
			var myDelete = my.nextElementSibling;
			if(my.value != "") {

			} else {
				myFather = my.parentElement;
				myFather.style.borderBottom = "1px solid #bbbbbb";
			};
			myDelete.style.opacity = "0"
		},
		delete1: function(event) {
			var my = event.currentTarget;
			var myInput = my.previousElementSibling;
			myInput.value = "";
			myInput.focus();
		},
		//发送验证
		setUp: function(event) {
			var self = this;
			var phone = document.getElementById("tel").value;
			var my = event.currentTarget;
			if((/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(phone))) {
				self.n = 60;
				var time = setInterval(function() {
					self.isOk = true;
					self.n--;
					if(self.n < 0) {
						clearInterval(time);
						self.isOk = false;
					};
				}, 1000)
				var param = {
					mobile: phone,
				};
				//获取验证码
				var url1 = _serverAddr + "user/sendCode.json";
				http.getJSON(url1, param, function(data) {
					self.sessionId = data.data;
					mui.toast(data.msg)
					if(data.success == false) {
						mui.toast(data.msg)
					}
				})
			} else {
				mui.toast("手机号码有误");
				return false;
			}
		},
		//看密码
		look: function(event) {
			var my = event.currentTarget;
			var inp = document.getElementsByClassName('password1');
			this.ss++;
			if(this.ss % 2 == 1) {
				this.imageNav = "images/lookPassword.png";
				inp[0].setAttribute("type", "text")
				inp[1].setAttribute("type", "text")
			} else {
				this.imageNav = "images/hide.png";
				inp[0].setAttribute("type", "password")
				inp[1].setAttribute("type", "password")
			};
		},
		help: function(data) {
			muiGo.muiGoPage("./registerHelp.html", "./registerHelp.html")
		},
		//提交注册
		sub: function() {
			var that = this;
			if(that.isSub) {
				var phone = document.getElementById("tel").value;
				var password1 = document.getElementById("password").value;
				var password2 = document.getElementById("password1").value;
				var verify = document.getElementById("verify").value;
				// 邀请码字段  可填  可不填
				// var myInvitation = document.getElementById("Invitation").value;
				var myType = "";
				// if(myInvitation == "") {
				// 	myType = 0
				// } else {
				// 	myType = 1
				// }
				//判断手机号
				if(!(/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(phone))) {
					mui.toast("手机号码有误，请重填");
					return false;
				} else {
					//判断密码
					if(!(/^[0-9a-zA-Z]*$/.test(password1))) {
						mui.toast("密码格式有误，请重填");
						return false;
					} else if(password1.length < 5) {
						mui.toast("密码格式有误，请重填");
						return false;
					} else if(password1.length > 21) {
						mui.toast("密码格式有误，请重填");
						return false;
					} else if(password1 != password2) {
						mui.toast("输入的两次密码不一致！");
						return false;
					} else {
						password1 = $.md5(password1).toUpperCase();
						// if(myType == 0) {
							// 用户没有填邀请码
							var param = {
								account: phone,
								password: password1,
								vCode: verify,
							}
						// } else if(myType == 1) {
						// 	// 用户填写了邀请码
						// 	var param = {
						// 		account: phone,
						// 		password: password1,
						// 		vCode: verify,
						// 		invitationCode: myInvitation,
						// 	}
						// }
						var url1 = _serverAddr + "user/registerUser.json;jsessionid=" + this.sessionId;
						//ajax
						http.getJSON(url1, param, function(data) {
							if(data.msg == "添加成功") {
								var dataList = {
									userId: data.data
								}
								setTimeout(function() {
                                    window.location.href="information.html?userId=" + dataList.userId;
								}.bind(this), 1000);
							} else {
								mui.toast(data.msg)
							}
						})
					}
				}
			} else {
				mui.toast("请先查看服务条款，并同意后再进行注册");
			}
		},
		//是否选中条款
		checkRules: function() {
			var that = this;
			if($("#checkRules").is(':checked')) {
				$(".btn").removeClass("disableBtn");
				that.isSub = true;
			} else {
				$(".btn").addClass("disableBtn");
				that.isSub = false;
			}
		},
		//跳转服务条款页
		jump: function() {
			var data = {};
			muiGo.muiGoPage("serverRules.html", "serverRules.html", data)
		},
		//拨打电话
		dialTest: function() {
			plus.device.dial('18167140039', true);
			$("#maskZ").hide();
		},
		//关闭确认框
		closeZ: function() {
			$("#maskZ").hide();
		},
		maskZ: function() {
			$("#maskZ").show();
		},
	}
})
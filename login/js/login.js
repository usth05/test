/*
 *	createTime:2018年3月12日  星期一  11:36:43
 * 	author	  :cxl
 * 	link	  :login.html(登录)
 */
var muiGo = new goPage();
var http = new HttpConnection();
var vm = new Vue({
	el: ".main",
	data: {
		hide1: "images/hide.png",
		look1: "images/lookPassword.png",
		imageNav: "images/hide.png",
		ss: 0, //帮助看密码
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
			var my = event.currentTarget;
			var n = 60;
			var time = setInterval(function() {
				my.innerHTML = "重新发送(<span>" + n + "</span>)";
				n--;
				if(n < 0) {
					clearInterval(time);
				};
			}, 1000)

			my.style.background = "#bbb"
		},
		//看密码
		look: function(event) {
			var my = event.currentTarget;
			var inp = document.getElementById("password");
			this.ss++;
			if(this.ss % 2 == 1) {
				this.imageNav = "images/lookPassword.png";
				inp.setAttribute("type", "text")
			} else {
				this.imageNav = "images/hide.png";
				inp.setAttribute("type", "password")
			}
		},
		//跳转注册
		goSign: function() {
			muiGo.muiGoPage("./../register/register.html", "./../register/register.html", "")
		},
		goForget: function() {
			muiGo.muiGoPage("forgetPassword.html", "forgetPassword.html", "")
		},
		//登录
		set: function() {
			var phone = document.getElementById("tel").value;
			var password1 = document.getElementById("password").value;
			//判断手机号
			if(!(/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(
					phone))) {
				mui.toast('	请填写正确的手机号格式')
			} else {
				//判断密码
				if(!(/^[0-9a-zA-Z]*$/.test(password1))) {
					mui.toast("密码格式有误，请重填");
				} else if(password1.length < 5) {
					mui.toast("密码长度5-20位之间");
				} else if(password1.length > 21) {
					mui.toast("密码长度5-20位之间");
				} else {
					//ajax
					password1 = $.md5(password1).toUpperCase();
					var param = {
						"account": phone,
						"password": password1,
						'deviceId': 1,
					};
					var url1 = _serverAddr2 + "login/login.json";
					// mui.plusReady(function() {
					// 	var self = plus.webview.currentWebview();
					// 	var muiData = self.muiData;
						http.getJSON(url1, param, function(data) {
							if(data.msg == "登录成功") {
								localStorage.setItem("myInfo", JSON.stringify(data.data)); //保存用户信息
								mui.toast('登录成功');
								setTimeout(function() {
                                    window.location.href="../clinicTest/clinicTest.html";
								}.bind(this), 1000);
							} else {
								mui.toast("帐号或密码错误");
							}

						})
					// })
				}
			}
		},
		//拨打电话
		dialTest: function() {
			// plus.device.dial('18167140039', true);
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

//cookie
var cookieUtil = {
	set: function(name, value, expires, path, domain, secure) {
		var cookieText = encodeURIComponent(name) + '=' +
			encodeURIComponent(value);
		if(expires instanceof Date) {
			cookieText += ';expires=' + expires.toGMTString();
		}
		if(path) {
			cookieText += ';path=' + path;
		}
		if(domain) {
			cookieText += ';domain=' + domain;
		}
		if(secure) {
			cookieText += ';secure';
		}
		document.cookie = cookieText;
	},
	get: function(name) {
		var cookieName = encodeURIComponent(name) + '=',
			cookieStart = document.cookie.indexOf(cookieName),
			cookieValue = null;
		if(cookieStart > -1) {
			var cookieEnd = document.cookie.indexOf(';', cookieStart);
			if(cookieEnd == -1) {
				cookieEnd = document.cookie.length;
			}
			cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd))
		}
		return cookieValue;
	},
	unset: function(name, path, domain, secure) {
		this.set(name, '', new Date(0), domain, path)
	},
	fuWu: function() {
		console.log("fuwu");
	}
}

function setCookieDate(day) { //失效时间
	var date = null;
	if(typeof day == 'number' && day > 0) {
		date = new Date();
		date.setDate(date.getDate() + day);
	} else {
		throw new Error('!!')
	}
	return date;
}
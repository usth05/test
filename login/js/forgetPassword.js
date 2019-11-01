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
		isOk: false,
		n: 0,
		self: null,
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

			if((/^1[345678]\d{9}$/.test(phone))) {
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
				var url1 = _serverAddr + "user/findSendCode.json";
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
		//提交
		set: function() {
			var that = this;
			var phone = document.getElementById("tel").value;
			var password1 = document.getElementById("password").value;
			var info = localStorage.getItem('myInfo');
			var myInfo = JSON.parse(info);
			var verify = document.getElementById("verify").value;
			mui.plusReady(function() {
				that.self = plus.webview.currentWebview();
			})
			//判断手机号
			if(!(/^1[345678]\d{9}$/.test(phone))) {

				mui.alert("手机号码有误，请重填");
				return false;
			} else {
				//判断密码
				if(!(/^[0-9a-zA-Z]*$/.test(password1))) {
					alert("密码格式有误，请重填");
				} else if(password1.length < 5) {
					alert("密码格式有误，请重填");
				} else if(password1.length > 21) {
					alert("密码格式有误，请重填");
				} else {
					//ajax
					password1 = $.md5(password1).toUpperCase();
					var param = {
						'account': phone,
						'password': password1,
						'vCode': verify
					};
					//console.log(JSON.stringify(param))
					var url1 = _serverAddr2 + "user/findPassword.json";
					http.getJSON(url1, param, function(data) {
						if(data.success == true) {
							mui.toast(data.msg)
							var data = {
								backUrl: '../myThings/myThings.html'
							}
							muiGo.muiGoPage('./login.html', './login.html', data)
							that.self.close();
						} else {
							mui.toast(data.msg)
						}

					})

				}
			}
		}
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

//alert(cookieUtil.get('msg'))
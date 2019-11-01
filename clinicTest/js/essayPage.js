/*
 *	createTime:2019年7月17日  星期四  18:00
 * 	author	  :sth
 * 	link	  :essayPage(论述)
 */
var goAh = new goPage(); //页面跳转
var http = new HttpConnection();
var app = new Vue({
	el: '.YDapp',
	data: {
		listData: [], //获取到的所有题目数据
		listDataNum: 0, //总题数
		currentIndex: 0, //当前题目
		currentData: {}, //当前问答的问题数据
		topName: '', //顶部名称
		userId: -1, //用户id
		self: null, //当前wenview页面
		id: -1, //类型id
		activateId: -1,
		number: 0, //后台设置题目数量
		uacList: [], //保存选中的数据
		selecedobj: {
			userAnswer: '', //用户答案
			userId: '', //用户id
			questionId: '', //当前问题id
		}, //当前问题选中的是哪一个
		type: -1, //0视频 1音频 2文本 3图片
		imgUrl: "", //图片路径
		videoUrl: "", //视频路径
		isPlay: false, //视频是否播放 
		textMode: '', //文本模式数据保存
		VideoJudge: false, //控制视频的显示 
		mySP: 0, //控制录音和录音结束  0 开始录音  1 结束录音
		myPeat: true, //控制录音图标的切换
		myPlayShow: 0, // 0 还没有录制  1 录制完毕  2 播放中
		myStop: 2, //0:播放，1：暂停，2：开始
		r: null, //录音
		audioUrl: '', //音频的路径
		ri: null,
		t: 0,
		seconds: '', //答题时间
		isStatus: false, //是否可以提交测试完成状态
	},
	created: function() {
		this.startFun()
		//默认数据
	},
	methods: {
		// 获取地址栏参数
		getUrlParam: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
			var r = decodeURIComponent(window.location.search).substr(1).match(reg); //匹配目标参数
			if(r != null) return unescape(r[2]);
			return null; //返回参数值
		},
		//打开询问是否退出弹窗
		askBack: function() {
			this.showMaskZ();
		},
		//返回上一页并刷新，并关闭当前页
		goBack: function() {
			history.go(-2);
		},
		//返回入口页并刷新，关闭其子webView
		goOldBack: function() {
			var data = {};
			var listData1 = JSON.stringify(data);
			window.location.href = "clinicTest.html?data=" + listData1;
		},
		startFun: function() {
			var that = this;
			var myData = JSON.parse(this.getUrlParam('data'));
			var list = myData.list;
			that.isStatus = myData.isStatus;
			var info = localStorage.getItem('myInfo');
			var myInfo = JSON.parse(info);
			that.userId = myInfo.id;
			that.topName = list.name;
			that.number = list.number;
			that.id = list.id;
			that.activateId = myData.activateId;
			var param = {
				examId: that.id,
				number: that.number
			}
			var Url = _serverAddr2 + "appAssess/selectAssessQuestion.json";
			http.getJSON(Url, param, function(res) {
				if(res.success) {
					that.listData = res.data;
					that.listDataNum = listData.length;
					that.nextQuestion();
//					that.currentData = res.data[0];
//					that.currentIndex = 1;
//					that.type = res.data[0].type;
//					that.selecedobj.userId = that.userId;
//					that.timerFun();
//					if(that.currentData.audioUrl) {
//						setTimeout(function() {
//							$("#audio")[0].load();
//							$("#audio")[0].play();
//						}, 200)
//					}
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
		/* *
		 	提交答案逻辑
		 * */
		submit: function() {
			var that = this;
			var uacList = this.uacList;
			if(uacList.length < this.listData.length) {
				if(uacList.length == this.listData.length - 1) {
					this.selecedFun();
				} else {
					mui.toast("请答完所有题目后再提交")
					return;
				}
			}
			var uacList = JSON.stringify(uacList)
			var param = {
				activateId: this.activateId,
				uacList: uacList,
				type: 3,
			}
			var Url = _serverAddr2 + "appAssess/insertUserAssess.json";
			http.getJSON(Url, param, function(res) {
				if(res.success) {
					mui.toast("本分类题目已答完,请继续");
					if(that.isStatus) {
						var urlStatus = _serverAddr2 + 'appAssess/updateExamStatus.json';
						var httpData = {
							activateId: that.activateId,
						};
						var httpStatus = new HttpConnection();
						httpStatus.getJSON(urlStatus, httpData, function(res) {
							if(res.success) {
								setTimeout(function() {
									mui.toast("本次测评已完成");
									that.goOldBack();
								}, 200)
							}
						})
					} else {
						setTimeout(function() {
							that.goBack();
						}, 300)
					}
				}
			})
		},
		//获取题目类型
		getAssessExam: function() {
			var that = this;
			var paramAssess = {
				typeId: this.typeId,
				grade: this.grade,
			}
			var UrlAssess = _serverAddr2 + "appAssess/selectAssessExam.json";
			http.getJSON(UrlAssess, paramAssess, function(res) {
				if(res.success) {
					that.listData = res.data;
				}
			})
		},
		//显示退出提示框
		showMaskZ: function() {
			$("#maskZ").show();
		},
		//隐藏退出提示框
		closeMaskZ: function() {
			$("#maskZ").hide();
		},
		//上传数据处理
		selecedFun: function() {
			var that = this;
			var type = this.type;
			var index = this.currentData.index; // 获取到当前是第几题
			var selecedobj = {
				userId: this.userId,
				questionId: this.currentData.id,
			}
			if(this.audioUrl) {
				files1 = [];
				appendFile1(that.audioUrl);
				upimg1()
			}
			setTimeout(function() {
				if(type == 0) { //视频
					if(that.videoUrl) {
						selecedobj.userAnswer = that.videoUrl;
						selecedobj.userPhoto = that.imgUrl;
					} else {
						selecedobj.userAnswer = '';
						selecedobj.userPhoto = '';
					}
				} else if(type == 1) { //音频
					that.audioUrl ? selecedobj.userAnswer = imgurl : selecedobj.userAnswer = '';
				} else if(type == 2) { //文本
					that.textMode ? selecedobj.userAnswer = that.textMode : selecedobj.userAnswer = '';
				} else if(type == 3) { // 图片
					that.imgUrl ? selecedobj.userAnswer = that.imgUrl : selecedobj.userAnswer = '';
				}
				if(selecedobj.userAnswer || that.seconds <= 0) {
					that.uacList[index - 1] = selecedobj;
				} else {
					mui.toast("请养成良好的习惯不要跳题");
					return;
				}
				if(that.currentData.index != that.listData.length) {
					that.nextQuestion();
				} else {
					$(".userAnswer").attr("maxlength", "0").click(function() {
						mui.toast("答题时间已过，不能继续答题");
						return;
					})
				}
			}, 300)
		},
		//跳转下一题
//		nextQuestion: function() {
//			var that = this;
//			files = [];
//			clearInterval(this.t);
//			this.imgUrl = '';
//			this.audioUrl = '';
//			this.videoUrl = '';
//			this.textMode = '';
//			this.myPlayShow = 0;
//			var index = this.currentData.index; //当前问题数据
//			var nextData = this.listData[index]; //获取到下一个问题数据
//			var type = nextData.type;
//			this.type = type;
//			nextData.index = index + 1;
//			this.currentData = nextData;
//			if(this.currentData.audioUrl) {
//				setTimeout(function() {
//					$("#audio")[0].load();
//					$("#audio")[0].play();
//				}, 300)
//			}
//			this.timerFun();
//		},
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
		//视频初始化
		plays: function(photo, url) {
			var that = this;
			that.myImg = photo;
			var html = '<div class="mui-video-Container" id="video_Container">' +
				'<div class="mui-video-full"><div class="rprogress"><span class="ladtit">加载</span><div class="rschedule"></div></div><span class="mui-full-back"> <svg class="icon" aria-hidden="true"><use xlink:href="#icon-houtui1"></use></svg><span class="vtitle"></span></span><span class="mui-pay_ico"><svg class="icon" aria-hidden="true">' +
				'<use xlink:href="#icon-bofang1"></use></svg></span><div class="v_left"></div><div class="b_right"></div><div class="ptime"></div><div class="mui-video-txt"></div><div class="mui-videoControls"><span class="mui-time-total mui-quanping"><span class="mui-time-cout" style="font-size: 0.2rem;">00:00</span><span class="mui-full-btu"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-quanping"></use></svg></span></span><span class="mui-time-current" style="font-size: 0.2rem;">00:00</span><div class="mui-progressWrap"><div class="mui-wrap-right"><input type="range" id="mui-block-range" value="0" min="0" max="100"></div></div></div></div>' +
				'</div>';
			var _video = document.getElementById("video");
			_video.innerHTML = html;
			_video.style.display = 'block';
			Html5video("#video_Container", {
				title: " ", //视频标题，当全屏时会显示
				url: url, //支持本地视频和网络视频，格式MP4
				img: that.myImg, //视频截图封面
				time: "", //视频总时间以分钟单位，当网络缓慢时，没办法及时加载出来，如已知可以填写，可不填。
				autoplay: true, //是否自动播放视频
				isMobile: true, //是否开启当处于移动网络时，提示用户是否继续播放视频。,不支持浏览器环境
				isFull: false, //是否点击播放就全屏显示
				iospay: false, //如果是IOS系统是否采用苹果系统自带播放器, 可以在浏览器或微信中，全屏观看视频
				drag: true, //禁止拖动,调节,音量和亮度 
				isfull: false, //是否显示全屏按钮
				prompt: function(video) //当开启isMobile时,这里可以写提示用户的内容,h5+环境才有效
				{
					mui.confirm('你当前处于移动手机网络将会消耗手机流量，是否继续播放？', '提示', ["取消", "确定"], function(e) {
						if(e.index == 1) {
							video.play();
						}
					}, "div");
				}
			});
		},
		//上传视频封面
		myImgUpload: function() {
			imgUpload();
		},
		//添加和修改视频
		myVideoUpload: function() {
			var that = this;
			if(that.imgUrl == "") {
				mui.toast("请先上传封面")
			} else {
				//调取oss方法
				videoUpload();
			}
		},
		//播放视频
		play1: function() {
			var isPlay = this.isPlay;
			var playV = document.getElementById("playV");
			if(!isPlay) {
				playV.play();
			} else {
				playV.pause();
			}
			this.isPlay = !isPlay;
		},
		//录音功能
		myRecord: function(v) {
			var that = this
			if(v == 0) {
				//开始录音
				that.myPeat = false;
				that.mySP = 1;
				//调取开始录音函数
				$("#audio")[0].pause();
				that.startRecord();
			} else if(v == 1) {
				//停止录音
				that.myPeat = true;
				that.mySP = 0;
				//调取结束录音函数
				that.stopRecord();
				$("#audio")[0].play();
			}
		},
		//开始录音
		startRecord: function() {
			var that = this;
			that.r = plus.audio.getRecorder();
			mui.toast('开始录音')
			if(that.r == null) {
				mui.toast('录音对象未获取');
				return;
			}
			that.r.record({
				filename: '_doc/audio/'
			}, function(p) {
				that.audioUrl = p;
				plus.io.resolveLocalFileSystemURL(p, function(entry) {}, function(e) {
					mui.toast('读取录音文件错误：' + e.message);
				});
			}, function(e) {
				mui.toast('录音失败：' + e.message);
			});
		},
		//结束录音函数
		stopRecord: function() {
			var that = this
			mui.toast('录音结束')
			that.r.stop();
			that.r = null;
			that.myPlayShow = 1
		},
		//暂停播放录音
		stopPlay: function() {
			var that = this
			// 操作播放对象
			if(that.audioUrl) {
				p.stop();
			}
		},
		//播放录音
		play: function(v) {
			var that = this
			if(v == 2) { //初始化
				if(that.audioUrl) {
					that.myPlayShow = 2
					that.myStop = 1
					p = plus.audio.createPlayer(that.audioUrl);
					p.play(() => {
						that.myPlayShow = 1
						that.myStop = 2;
						that.stopPlay(p);
					}, (e) => {
						outLine('播放音频文件"' + that.audioUrl + '"失败：' + e.message);
					});
				} else {
					mui.toast('请先录音')
				}
			} else if(v == 1) { //暂停
				that.stopPlay();
				that.myPlayShow = 1
				that.myStop = 0;
			} else if(v == 0) { //播放
				if(that.audioUrl) {
					that.myPlayShow = 2
					that.myStop = 1
					p = plus.audio.createPlayer(that.audioUrl);
					p.play(() => {
						that.myPlayShow = 1
						that.myStop = 2;
						that.stopPlay(p);
					}, (e) => {
						mui.toast('播放音频文件"' + that.audioUrl + '"失败：' + e.message)
					});
				} else {
					mui.toast('未录音')
				}
			}
		},
	},
	mounted() {
		var that = this;
		mui.plusReady(function() {
			mui.back = function() {

			}
			plus.key.addEventListener("backbutton", function() {
				that.askBack();
			});
		})
	}
})
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
		info: "", //申请表富文本
		rightWrap: "",
		goodsId: "",
		goodsName: "",
		shareInfo: '',
		listData: [],
		firstPhoto: '',
		lastPhoto: '',
	},
	created: function() {
		//加载数据
		this.startFun()
	},
	methods: {
        // 获取地址栏参数
        getUrlParam: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = decodeURIComponent(window.location.search).substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]); return null; //返回参数值
        },
		wrapTab: function(index) {
			//that.rightWrap = that.listData[index].photoInfo;
			this.slider.gotoItem(index);
		},
		startFun: function() {
			var that = this;
			var myData = this.getUrlParam('data');
			that.goodsName = "把脉诊断测评系统";
			that.shareInfo = myData.shareInfo;
			that.goodsId = myData.id;
			var param = {
				type: 1
			}
			var Url = _serverAddr2 + "appWebpage/selectAssessEnlighten.json";
			http.getJSON(Url, param, function(data) {
				if(data.success) {
					that.listData = data.data;
					// 默认取第一个值
					//that.rightWrap = that.listData[0].photoInfo;
					that.firstPhoto = that.listData[0].photoInfo;
					that.lastPhoto = that.listData[data.data.length - 1].photoInfo;
				}
			})
			setTimeout(() => {
				that.slider = mui("#slider").slider({
					interval: 0,
				});
			}, 300);
			
		},
	},
	mounted: function() {
		var that = this;
		this.$nextTick(function() {
			this.slider = mui("#slider").slider({
				interval: 0,
			});
		})
	}
})
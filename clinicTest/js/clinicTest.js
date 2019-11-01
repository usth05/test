/*
 *	createTime:2019年5月23日
 * 	author	  :sth
 */
//页面跳转
var goAh = new goPage();
//数据请求
var http = new HttpConnection();
var http1 = new HttpConnection();
var app = new Vue({
	el: '.YDapp',
	data: {
		listData: [], //获取到的试卷数据
		imgUrl: '',
	},
	created: function () {
		//加载数据
		this.startFun()
	},
	methods: {
		//查询一级分类
		startFun: function () {
			var that = this;
			var info = localStorage.getItem('myInfo');
			var myInfo = JSON.parse(info);
			if (myInfo) {
				that.myInfo = myInfo;
				var userId = myInfo.id;
				that.userId = userId;
			}
			var param = {
				userId: that.userId,
			}
			var Url = _serverAddr2 + "appWebpage/selectAssessType.json";
			http.getJSON(Url, param, function (res) {
				if (res.success) {
					that.listData = res.data;
				}
			})
			var param1 = {
				type: 2
			}
			var Url1 = _serverAddr2 + "appWebpage/selectAssessEnlighten.json";
			http1.getJSON(Url1, param1, function (data) {
				if (data.success) {
					that.imgUrl = data.data[0].photo;
				}
			})
		},
		/* *
		 * params{
		 *    url: 页面跳转的地址
		 *    list:点击测试的数据
		 *    data:{	传递到url页面的参数
		 * 		
		 *    }
		 * }
		 * */
		goDetail: function (url, list) {
			//list:点击的测评试卷的数据
			var data = {
				list: list,
			};
			data.list.baifenbi = parseInt(data.list.baifenbi);
			var listData = JSON.stringify(data);
            window.location.href="testPage.html?data="+listData;
		},
	}
})
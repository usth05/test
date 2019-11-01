/*
 *	createTime:2019年7月17日  星期四  18:00
 * 	author	  :sth
 * 	link	  :topicList(记题本列表页面)
 */
var goAh = new goPage(); //页面跳转
var http = new HttpConnection();
var app = new Vue({
	el: '.YDapp',
	data: {
		topName: '',
		userData: {}, //获取到的用户信息
		sex: '请选择', //性别
		grade: '', //年级
		oneName: '请选择', //类型
		oneId: '', //类型id
		twoName: '请选择',
		twoId: '',
		typeOne: '请选择', //一级分类 
		typeTwo: '请选择', //二级分类
		typeOneText: '', //选中的一级分类名称
		typeTwoText: '', //选中的二级分类名称
		typeThreeText: '', //选中的三级分类名称
		typeOneId: -1, //一级分类id
		typeTwoId: -1, //二级分类id
		typeThreeId: -1, //三级分类id
		typeOneData: [], //一级分类数据
		typeThree: '',
		level: 0, //当前是几级分类
		promptText: '',
		textData: {}, //上一页传回来的数据
		activateId: null,
		isTypea: 0, //控制类别  0关闭1开启
        isTypeb:0, //控制类别  0关闭1开启
    },
	created: function() {
		this.startFun()
		//默认数据
	},
	methods: {
        // 获取地址栏参数
        getUrlParam: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = decodeURIComponent(window.location.search).substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]); return null; //返回参数值
        },
		startFun: function() {
			var that = this;
				var myData = JSON.parse(this.getUrlParam('data'));
				var info = localStorage.getItem('myInfo');
				var myInfo = JSON.parse(info);
				that.userId = myInfo.id;
				that.textData = myData.list;
				that.topName = myData.topName;
				that.typeId = myData.typeId;
				that.activateId = myData.activateId;
				that.level = myData.level;
				that.typeOne = myData.oneName;
				that.typeTwo = myData.twoName;
				that.typeThree = myData.threeName;
				that.isUpload = myData.isUpload;
				that.isTypea = myData.isTypea;
				that.isTypeb = myData.isTypeb;
				that.number = myData.number;
				var param = {
					userId: that.userId,
				}
				var Url = _serverAddr2 + "public/selectUser.json";
				http.getJSON(Url, param, function(res) {
					if(res.success) {
						that.userData = res.data;
						that.sex = res.data.sex;
					}
				})
				//获取到类型类别数据
				that.getTypeDate();
				if(that.level >= 1) {
					var paramType = {
						typeId: that.typeId,
					};
					var UrlType = _serverAddr2 + "appWebpage/selectStampedArea.json";
					var httpType = new HttpConnection();
					httpType.getJSON(UrlType, paramType, function(res) {
						if(res.success) {
							for(var i = 0; i < res.data.length; i++) {
								res.data[i].text = res.data[i].name;
								res.data[i].value = res.data[i].id;
							}
							that.typeOneData = res.data;
							that.typeOnePicker  = new mui.PopPicker();
							that.typeOnePicker .setData(that.typeOneData);
						} else {
							mui.toast("分类" + res.msg);
							that.typeOnePicker  = new mui.PopPicker();
						}
					})
					// that.typeSelect(that.typeId,0);
				}
		},
		/*
		 	请求类型类别数据
		 * */
		getTypeDate: function() {
			var that = this;
			var paramType1 = {
				typeId: that.typeId,
			};
			var UrlType1 = _serverAddr2 + "appWebpage/selectUserType.json";
			var httpType1 = new HttpConnection();
			httpType1.getJSON(UrlType1, paramType1, function(res) {
				if(res.success) {
					that.onePicker = new mui.PopPicker();
					that.twoPicker = new mui.PopPicker();
					var uListb = res.data.uListb; //类型
					var uLista = res.data.uLista; //类别
					for(var i = 0; i < uLista.length; i++) {
						uLista[i].text = uLista[i].name;
						uLista[i].value = uLista[i].id;
					}
					for(var j = 0; j < uListb.length; j++) {
						uListb[j].text = uListb[j].name;
						uListb[j].value = uListb[j].id;
					}
					that.twoPicker.setData(uLista); //类别
					that.onePicker.setData(uListb); //类别
				} else {
					mui.toast(res.msg);
				}
			})
		},
		/*
		 修改类别类型
		 * */
		reviseType: function() {
			var that = this;
			var reviseData = {
				id: this.activateId,
				oneType: this.oneId,
				twoType: this.twoId,
			};
			if(that.level == 1) {
				reviseData.typeId = this.typeOneId;
			} else if(that.level == 2) {
				reviseData.typeId = this.typeTwoId;
			} else if(that.level == 3) {
				reviseData.typeId = this.typeThreeId;
			}
			var reviseType = _serverAddr2 + "appWebpage/UpdateAssessCardActivate.json";
			var httpReviseType = new HttpConnection();
			httpReviseType.getJSON(reviseType, reviseData, function(res) {
				if(res.success) {
					var listData = {
						activateId: that.activateId,
						topName: that.topName
					}
					if(that.level == 1) {
						listData.typeId = that.typeOneId;
					} else if(that.level == 2) {
						listData.typeId = that.typeTwoId;
					} else if(that.level == 3) {
						listData.typeId = that.typeThreeId;
					}
					var listData1 = JSON.stringify(listData);
					localStorage.setItem("myData",listData1);
                    window.location.href="topicList.html?data="+listData1;
					// goAh.muiGoPage("./topicList.html", "./topicList.html", listData)
				} else {
					mui.toast(res.msg);
				}
			})
		},
		//选则类别逻辑
		oneNameSelect: function() {
			var that = this;
			this.onePicker.show(function(selectItems) {
				that.oneName = selectItems[0].text;
				that.oneId = selectItems[0].value;
			})
		},
		//选则类型逻辑
		twoNameSelect: function() {
			var that = this;
			this.twoPicker.show(function(selectItems) {
				that.twoName = selectItems[0].text;
				that.twoId = selectItems[0].value;
			})
		},
		//生产分类选择框
		typeSelect: function(id,index) {
			var that = this;
			if(index==0){
				var typeData = {
					typeId: id,
				};
				var typeUrl = _serverAddr2 + "appWebpage/selectStampedArea.json";
			}else{
				var typeData = {
					areaId: id,
				};
				var typeUrl = _serverAddr2 + "appWebpage/selectStampedAreas.json";
			}
			var typeHttp = new HttpConnection();
			typeHttp.getJSON(typeUrl, typeData, function(res) {
				if(res.success) {
					for(var i = 0; i < res.data.length; i++) {
						res.data[i].text = res.data[i].name;
						res.data[i].value = res.data[i].id;
					}
					if(index==0){
						that.typeOneData = res.data;
						that.typeOnePicker = new mui.PopPicker();
						that.typeOnePicker.setData(that.typeOneData);
					}else if(index==1){
						that.typeTwoData = res.data;
						that.typeTwoPicker = new mui.PopPicker();
						that.typeTwoPicker.setData(that.typeTwoData);
					}else if(index==2){
						that.typeThreeData = res.data;
						that.typeThreePicker = new mui.PopPicker();
						that.typeThreePicker.setData(that.typeThreeData);
					}
				} else {
					// mui.toast("分类" + res.msg);
					that.typeOnePicker = new mui.PopPicker();
					that.typeTwoPicker = new mui.PopPicker();
					that.typeThreePicker = new mui.PopPicker();
				}
			})
		},
		//选则一级分类
		typeOneSelect: function() {
			var that = this;
			this.typeOnePicker.show(function(selectItems) {
				that.typeOneText = selectItems[0].text;
				that.typeOneId = selectItems[0].id;
				that.typeTwoText = "";
				that.typeThreeText = "";
				if(that.level >= 2) {
					that.typeSelect(that.typeOneId,1);
				}
			})
		},
		//选则二级分类
		typeTwoSelect: function() {
			var that = this;
			this.typeTwoPicker.show(function(selectItems) {
				that.typeTwoText = selectItems[0].text;
				that.typeTwoId = selectItems[0].id;
				that.typeThreeText = "";
				if(that.level >= 3) {
					that.typeSelect(that.typeTwoId,2);
				}
			})
		},
		//选则三级分类
		typeThreeSelect: function() {
			var that = this;
			this.typeThreePicker.show(function(selectItems) {
				that.typeThreeText = selectItems[0].text;
				that.typeThreeId = selectItems[0].value;
			})
		},
		//选则性别逻辑
		sexSelect: function() {
			var that = this;
			this.sexPicker.show(function(selectItems) {
				that.sex = selectItems[0].text
			})
		},
		/* *
		 	点击确认按钮完成信息确认
		 * */
		submit: function() {
			var that = this;
			if(!this.sex) {
				mui.toast("请先选择性别");
				return;
			}
			if(this.isTypea == 1 && !this.oneId) {
				mui.toast("请先选择类别");
				return;
			}
			if(this.isTypeb == 1 && !this.twoId) {
				mui.toast("请先选择类型");
				return;
			}
			if(that.level >= 1) {
				if(this.typeOneId == -1) {
					mui.toast("请选择" + this.typeOne);
					return;
				}
			}
			if(that.level >= 2) {
				if(this.typeTwoId == -1) {
					mui.toast("请选择" + this.typeTwo);
					return;
				}
			}
			if(that.level == 3) {
				if(this.typeThreeId == -1) {
					mui.toast("请选择" + this.typeThree);
					return;
				}
			}
			if(this.sex != this.userData.sex) {
				var param = {
					id: this.userId,
					sex: this.sex,
				}
				var Url = _serverAddr2 + "public/updateUser.json";
				http.getJSON(Url, param, function(res) {
					if(res.success) {
						that.reviseType();
					} else {
						mui.toast(res.msg);
					}
				});
			} else {
				that.reviseType();
			}
		},
		//关闭当前webview页面
		goBack: function() {
            history.go(-2);
		},
	},
	mounted: function() {
		var that = this;
		/* *
		 * 性别多选框
		 * */
		that.sexPicker = new mui.PopPicker();
		that.sexPicker.setData([{
				text: "男",
				value: "1"
			},
			{
				text: "女",
				value: "2"
			},
		]);
	}
})
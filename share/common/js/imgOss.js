var server = ""; //申请到的阿里云OSS地址
var OSSAccessKeyId = ""; //申请到的阿里云AccessKeyId和AccessKeySecret
var AccessKeySecret = ""; //需要用自己申请的进行替换
var files = []; //存储文件信息的数组
var fname = ""; //表示文件名
var dir = ""; //指定上传目录，此处指定上传到app目录下
var nowTime; //服务器时间对象
var testName; //本地测试用的
/*
 * 阿里云参数设置，用于计算签名signature
 */
var policyBase64 = "";
var message = policyBase64;

var signature = "";
/*
 	音频的上传信息
 * */
var server1 = ""; //申请到的阿里云OSS地址
var OSSAccessKeyId1 = ""; //申请到的阿里云AccessKeyId和AccessKeySecret
var AccessKeySecret1 = ""; //需要用自己申请的进行替换
var files1 = []; //存储文件信息的数组
var fname1 = ""; //表示文件名
var dir1 = ""; //指定上传目录，此处指定上传到app目录下
var nowTime1; //服务器时间对象
var testName1; //本地测试用的
/*
 * 阿里云参数设置，用于计算签名signature
 */
var policyBase64_1 = "";
var message = policyBase64_1;

var signature1 = "";

//获取上传权限
function getParam() {
	bucketname = 'hzytjy';
	$.ajax({
		type: "POST",
		url: _serverAddr + "practice/uploadOss.json",
		data: {
			hz: 'content', //修改文件格式 找后台要 音频的是 voice 视频video  图片 content   第一个地方
		},
		success: function(res) {
			OSSAccessKeyId = res.data.accessid;
			AccessKeySecret = res.data.accessKey;
			signature = res.data.signature;
			server = res.data.host;
			dir = res.data.dir;
			policyBase64 = res.data.policy;
			now = res.data.currentTime;
			nowTime = new Date(parseInt(now + "000"));
		},
	});
}
getParam();

//获取上传权限
function getParam1() {
	bucketname = 'hzytjy';
	if(mui.os.android) {
		$.ajax({
			type: "POST",
			url: _serverAddr + "index/uploadVoice.json ",
			data: {
				hz: 'android',
			},
			success: function(res) {
				OSSAccessKeyId1 = res.data.accessid;
				AccessKeySecret1 = res.data.accessKey;
				signature1 = res.data.signature;
				server1 = res.data.host;
				dir1 = res.data.dir;
				policyBase64_1 = res.data.policy;
				now1 = res.data.currentTime;
				nowTime1 = new Date(parseInt(now1 + "000"));
			},
		});
	} else {
		$.ajax({
			type: "POST",
			url: _serverAddr + "practice/uploadOss.json",
			data: {
				hz: 'voice',
			},
			success: function(res) {
				OSSAccessKeyId1 = res.data.accessid;
				AccessKeySecret1 = res.data.accessKey;
				signature1 = res.data.signature;
				server1 = res.data.host;
				dir1 = res.data.dir;
				policyBase64_1 = res.data.policy;
				now1 = res.data.currentTime;
				nowTime1 = new Date(parseInt(now1 + "000"));
			},
		});
	}
}
getParam1();

var new_multipart_params = {
	'key': 'dir',
	'policy': policyBase64,
	'OSSAccessKeyId': OSSAccessKeyId,
	'success_action_status': '200', //让服务端返回200,不然，默认会返回204
	'signature': signature,
};
// 上传文件
function imgUpload() {
	if(mui.os.plus) {
		var buttonTit = [{
			title: "拍照"
		}, {
			title: "从手机相册选择"
		}];
		plus.nativeUI.actionSheet({
			title: "横向拍照  上传图片",
			cancel: "取消",
			buttons: buttonTit,
		}, function(b) {
			switch(b.index) {
				case 0:
					break;
				case 1:
					//拍照的方法
					var cmr = plus.camera.getCamera();
					cmr.captureImage(function(p) {
						plus.io.resolveLocalFileSystemURL(p, function(entry) {
							resize(p)
							setTimeout(function() {
								upimg();
							}, 1000)
						}, function(e) {
							console.log("文件错误" + e.message)
						});
					}, function(e) {
						console.log("失败" + e.message)
					}, {
						filename: '_doc/camera/',
						index: 1
					});
					break;
				case 2:
					//相册的方法
					plus.gallery.pick(function(p) {
						resize(p)
						setTimeout(function() {
							upimg();
						}, 1000)
					});
					break;
				default:
					break;
			}
		})
	}
}
//获取上传路径
function getUploadPath() {
	NowDate = nowTime.getFullYear() + ((nowTime.getMonth() + 1) < 10 ? "0" : "") + (nowTime.getMonth() + 1) + (nowTime.getDate() <
		10 ? "0" : "") + nowTime.getDate();
	uploadeUrl = "/" + NowDate + "/";
	return uploadeUrl;
}

function upimg() {
	if(files.length <= 0) {
		plus.nativeUI.alert("没有添加上传文件！");
		return;
	}
	var task = plus.uploader.createUpload(server, {
		method: "POST",
	}, function(t, status) { //上传完成
		if(status == 200) {
			//至此上传成功，上传后的图片完整地址为server+testName
			app.imgUrl = _serverAddrImg + testName;
			var uploaderFileObj = {
				"server": server,
				"path": testName
			};
		} else {
			alert("上传失败：" + status);
			files = [];
		}
	});
	var suffix1 = get_suffix(fname); //文件后缀  例如   .jpg
	var keyname = dir + getUploadPath() + new Date().getTime() + suffix1;

	testName = keyname;

	//按照之前说明的参数类型，按顺序添加参数
	task.addData("key", keyname);
	task.addData("policy", policyBase64);
	task.addData("OSSAccessKeyId", OSSAccessKeyId);
	task.addData("success_action_status", "200");
	task.addData("signature", signature);
	var f = files[0];
	task.addFile(f.path, {
		key: "file",
		name: "file",
		mime: "image/jpg"
	});
	task.start();
	$.ajax({
		type: "post",
		url: "",
		async: true
	});

}

//得到文件名的后缀
function get_suffix(filename) {
	var pos = filename.lastIndexOf('.');
	var suffix = '';
	if(pos != -1) {
		suffix = filename.substring(pos)
	}
	return suffix;
}
// 添加文件
var index = 1;

function appendFile(p) {
	var n = p.substr(p.lastIndexOf('/') + 1);
	fname = n;
	files.push({
		name: "uploadkey" + index,
		path: p
	});
	index++;
}

// 压缩图片
function resize(src) {
	var filename = src.substr(src.lastIndexOf('/') + 1);
	plus.zip.compressImage({
			src: src,
			dst: '_doc/camera/' + filename,
			overwrite: true,
			width: '750px', //这里指定了宽度，同样可以修改
			format: 'jpg',
			quality: 90 //图片质量不再修改，以免失真
		},
		function(e) {
			appendFile(e.target)
		},
		function(err) {
			com.alert('未知错误!', 0, function() {
				mui.back();
			})
		})
}
/*
 	音频处理
 * */

var imgurl = "";

function upimg1() {
	if(files1.length <= 0) {
		plus.nativeUI.alert("没有添加上传文件！");
		return;
	}
	var task = plus.uploader.createUpload(server1, {
		method: "POST",
	}, function(t, status) { //上传完成
		if(status == 200) {
			//至此上传成功，上传后的图片完整地址为server+testName
			imgurl = _serverAddrImg + testName1;
			app.audioUrl = imgurl;
			app.selecedobj.userAnswer = app.audioUrl;
			var uploaderFileObj = {
				"server": server1,
				"path": testName1
			};
			//mui.toast("音频录制完成");
		} else {
			alert("上传失败：" + status);
		}
	});
	var suffix1 = get_suffix1(fname1); //文件后缀  例如   .jpg
	var keyname1 = dir1 + getUploadPath1() + new Date().getTime() + suffix1;

	testName1 = keyname1;

	//按照之前说明的参数类型，按顺序添加参数
	task.addData("key", keyname1);
	task.addData("policy", policyBase64_1);
	task.addData("OSSAccessKeyId", OSSAccessKeyId1);
	task.addData("success_action_status", "200");
	task.addData("signature", signature1);
	var f = files1[0];
	task.addFile(f.path, {
		key: "file",
		name: "file",
		mime: "image/jpg"
	});
	task.start();
	$.ajax({
		type: "post",
		url: "",
		async: true
	});
}

//得到文件名的后缀
function get_suffix1(filename) {
	var pos = filename.lastIndexOf('.');
	var suffix = '';
	if(pos != -1) {
		if(mui.os.android) {
			suffix = '.mp3'
		} else {
			suffix = filename.substring(pos)
		}

	}
	return suffix;
}
var index1;

function appendFile1(p) {
	var n = p.substr(p.lastIndexOf('/') + 1);
	fname1 = n;
	files1.push({
		name: "uploadkey" + index,
		path: p
	});
	index1++;
}

//获取上传路径
function getUploadPath1() {
	NowDate = nowTime.getFullYear() + ((nowTime.getMonth() + 1) < 10 ? "0" : "") + (nowTime.getMonth() + 1) + (nowTime.getDate() <
		10 ? "0" : "") + nowTime.getDate();
	uploadeUrl = '/';
	return uploadeUrl;
}
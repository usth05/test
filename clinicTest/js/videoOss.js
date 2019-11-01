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

//获取上传权限
function getParam() {
	bucketname = 'hzytjy';
	$.ajax({
		type: "POST",
		url: _serverAddr + "practice/uploadOss.json",
		data: {
			hz: 'video', //修改文件格式 找后台要 音频的是 voice 视频video  图片 content   第一个地方
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

// var bytes = Crypto.HMAC(Crypto.SHA1, message, AccessKeySecret, {
// 	asBytes: true
// });

var new_multipart_params = {
	'key': 'dir',
	'policy': policyBase64,
	'OSSAccessKeyId': OSSAccessKeyId,
	'success_action_status': '200', //让服务端返回200,不然，默认会返回204
	'signature': signature,
};
// 上传文件
function videoUpload() {
	if(mui.os.plus) {
		var buttonTit = [{
			title: "录制"
		}];
		plus.nativeUI.actionSheet({
			title: "横向拍摄  上传视频",
			cancel: "取消",
			buttons: buttonTit,
		}, function(b) {
			switch(b.index) {
				case 0:
					break;
				case 1:
					//录像的方法
					var cmr = plus.camera.getCamera();
					cmr.startVideoCapture(function(p) {
						plus.io.resolveLocalFileSystemURL(p, function(entry) {
							console.log("打印P", p);
							console.log("打印对象", entry)
							appendFileVideo(p);
							upVideo();
						}, function(e) {
							console.log("文件错误" + e.message)
						});
					}, function(e) {
						console.log("错误" + e.message)
					}, {
						filename: '_doc/camera/',
						index: 2
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

function upVideo() {

	if(files.length <= 0) {
		plus.nativeUI.alert("没有添加上传文件！");
		return;
	}
	var task = plus.uploader.createUpload(server, {
		method: "POST",
	}, function(t, status) { //上传完成
		if(status == 200) {
			//至此上传成功，上传后的完整地址为server+testName
			app.videoUrl = _serverAddrImg + testName;
			var uploaderFileObj = {
				"server": server,
				"path": testName
			};
			plus.storage.setItem("uploader", JSON.stringify(uploaderFileObj));
			//赋值路径然后播放
			/*if(app.imgUrl != "" && app.videoUrl != "") {
				mui.toast("视频上传成功,底部预览");
				document.getElementById("playV").src = app.videoUrl
				document.getElementById("playV").poster = app.imgUrl
			}*/
			setTimeout(function() {
				app.VideoJudge = true
			}, 500)
		} else {
			alert("上传失败：" + status);
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

function appendFileVideo(p) {
	var n = p.substr(p.lastIndexOf('/') + 1);
	fname = n;
	files.unshift({
		name: "uploadkey" + index,
		path: p
	});
	index++;
}
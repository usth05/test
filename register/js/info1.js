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
			hz: 'head',
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
function upload() {
	console.log(app.imgInfo)
}
//获取上传路径
function getUploadPath() {
	NowDate = nowTime.getFullYear() + ((nowTime.getMonth() + 1) < 10 ? "0" : "") + (nowTime.getMonth() + 1) + (nowTime.getDate() <
		10 ? "0" : "") + nowTime.getDate();
	uploadeUrl = "/" + NowDate + "/";
	return uploadeUrl;
}
var imgurl;

function upimg() {
	if (files.length <= 0) {
		mui.toast("没有添加上传文件！");
		return;
	}
	console.log(files)
}

//得到文件名的后缀
function get_suffix(filename) {
	var pos = filename.lastIndexOf('.');
	var suffix = '';
	if (pos != -1) {
		suffix = filename.substring(pos)
	}
	return suffix;
}

// 拍照添加文件
function appendByCamera() {
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
}
// 从相册添加文件
function appendByGallery() {
	// gallery  相册方法
	plus.gallery.pick(function(p) {
		resize(p)
		setTimeout(function() {
			upimg();
		}, 1000)
	});
}
// 添加文件
var index = 1;

function appendFile(p) {
	console.log('ceshi' + p)
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
    appendFile(filename);
	/*plus.zip.compressImage({
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
		})*/
}

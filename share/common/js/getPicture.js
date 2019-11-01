
	function getPicture() {
		var my = this;
	}
	var self = this;

	// 从相册中选择图片  跳转发布页
	getPicture.prototype.galleryImgsMaximum = function(Url, Id,pageId) {
		// 从相册中选择图片
		outSet('从相册中选择多张图片(限定最多选择9张)：');
		plus.gallery.pick(function(e) {
			for(var i in e.files) {
				outLine(e.files[i]);
			}
			mui.openWindow({
				url: Url,
				id: Id,
				extras: {
					name: e.files,
					pageId:pageId,
				}
			});

		}, function(e) {
			outSet('取消选择图片');
		}, {
			filter: 'image',
			multiple: true,
			maximum: 9,
			system: false,
			onmaxed: function() {
				plus.nativeUI.alert('最多只能选择9张图片');
			}
		}); // 最多选择9张图片
	}

	// 拍照 跳转发布页
	getPicture.prototype.getImage = function(Url, Id,pageId) {
		outSet('开始拍照：');
		var cmr = plus.camera.getCamera();
		cmr.captureImage(function(p) {
			outLine('成功：' + p);
			plus.io.resolveLocalFileSystemURL(p, function(entry) {
				//					createItem(entry);
				var url = entry.toLocalURL();
				var newUrl = [];
				newUrl[0] = url
				//跳转
				mui.openWindow({
					url: Url,
					id: Id,
					extras: {
						name: newUrl,
						pageId:pageId,
					}
				});
			}, function(e) {
				outLine('读取拍照文件错误：' + e.message);
			});
		}, function(e) {
			outLine('失败：' + e.message);
		}, {
			filename: '',
			index: 1
		});
	}

	// 从相册中选择图片  获得压缩路径
	getPicture.prototype.galleryImgsMaximum1 = function(numb1,funt) {
		// 从相册中选择图片
		outSet('从相册中选择多张图片(限定最多选择9-numb1张)：');
		plus.gallery.pick(function(e) {
			for(var i in e.files) {
				outLine(e.files[i]);
			}

			var dst_Box = new Array(); //新数组 接收压缩的目标路径
			var count = 0; //定义一个参数  后面用来判断 上传时机
			for(var i = 0; i < e.files.length; i++) {
				//压缩图片的dst 目标路径设置   
				var url = e.files[i];
				var random = Math.floor(Math.random() * (10001) + 0);
				var name2 = url.substring(0, url.lastIndexOf('/')) + "j" + random + "/" + url.substring(url.lastIndexOf('/') + 1);
				dst_Box.push(name2);
				//压缩图片
				plus.zip.compressImage({
						src: url,
						dst: name2,
						quality: 20,
						rotate: 45,
						width: '500px',
					},
					function() {
						//压缩成功回调
						count++;
					},
					function(error) {
						alert("Compress error=" + JSON.stringify(error));
					});
			}
			var time1 = setInterval(function() {
				if(count == e.files.length) {
					clearInterval(time1);
				}
			}, 50)

			funt(e.files, dst_Box)

		}, function(e) {
			outSet('取消选择图片');
		}, {
			filter: 'image',
			multiple: true,
			maximum: numb1,						//最多还可以传 的张数
			system: false,
			onmaxed: function() {
				plus.nativeUI.alert('最多只能选择'+numb1+'张图片');
			}
		}); // 最多选择9-numb1张图片
	}

	// 拍照 获得压缩路径
	getPicture.prototype.getImage1 = function(funt) {
		outSet('开始拍照：');
		var cmr = plus.camera.getCamera();
		cmr.captureImage(function(p) {
			outLine('成功：' + p);
			plus.io.resolveLocalFileSystemURL(p, function(entry) {
				//					createItem(entry);
				var url1 = entry.toLocalURL();
				var newUrl = [];
				newUrl[0] = url1;

				var dst_Box = new Array(); //新数组 接收压缩的目标路径
				var count = 0; //定义一个参数  后面用来判断 上传时机
				for(var i = 0; i < newUrl.length; i++) {
					//压缩图片的dst 目标路径设置   
					var url = newUrl[i];
					var random = Math.floor(Math.random() * (10001) + 0);
					var name2 = url.substring(0, url.lastIndexOf('/')) + "j" + random + "/" + url.substring(url.lastIndexOf('/') + 1);
					dst_Box.push(name2);
					//压缩图片
					plus.zip.compressImage({
							src: url,
							dst: name2,
							quality: 20,
							rotate: 45,
							width: '500px',
						},
						function() {
							//压缩成功回调
							count++;
						},
						function(error) {
							alert("Compress error=" + JSON.stringify(error));
						});
				}
				var time1 = setInterval(function() {
					if(count == newUrl.length) {
						clearInterval(time1);
					}
				}, 50)

				funt(newUrl,dst_Box);

			}, function(e) {
				outLine('读取拍照文件错误：' + e.message);
			});
		}, function(e) {
			outLine('失败：' + e.message);
		}, {
			filename: '',
			index: 1
		});
	}

	//发送 上传服务器
	getPicture.prototype.setInformation=function(imgPath,funt){	//imgPath压缩好的路径   funt 写回调函数
		var base64Box = new Array();
			var cout = 0;
			for(var i = 0; i < imgPath.length; i++) {
				var image = new Image();
				image.src = imgPath[i];
				image.onload = function() { //这里会执行多一次  比如for循环2次  这里执行3次
					
					image.src = imgPath[cout]; //这里使用count
					cout++;

					var imgData = getBase64Image(image); //转base64
					base64Box.push(imgData);

					//因为要多执行一次  所以这里判断 ajax上传
					if(cout == i) {
						var base64=JSON.stringify(base64Box)
						funt(base64)
//						var value = document.getElementById("textarea").value;
//						var myId = JSON.parse(localStorage.getItem("user")).id;
//						model.setPhoto(base64,value,myId)
					} else {
						//							alert(base64Box.length+"duo");
					}
				}
			}
		
		function getBase64Image(img) {
			var canvas = document.createElement("canvas");
			var width = img.width;
			var height = img.height;
			//alert(width + " " + height)
			canvas.width = width; /*设置新的图片的宽度*/
			canvas.height = height; /*设置新的图片的长度*/
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, width, height); /*绘图*/
			var dataURL = canvas.toDataURL("image/png", 0.8);
			return dataURL;
		}
		
	}


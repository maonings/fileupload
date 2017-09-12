/**
 * @author	MaoNing
 * @date	2017.08.31
 * */
function ImgUpload(){
	/**
	 * file文本域中全部的file
	 * Type -- FileList;
	 * */	
	var	_files = {length : 0};
	
	/**
	 * 上传到服务器的合法file
	 * Type -- FileArray;
	 * */
	var _dataFiles = new Array();
	
	/**
	 * 验证文件类型
	 * @param	File file
	 * @return	Boolean
	 * */
	var	_validateType = function(file) {
		var name = file.name, suffix = name.substring(name.lastIndexOf(".")), 
			regx = /^[.]{1}(jpg|png|jpeg)$/;
		return regx.test(suffix);
	};
	
	/**
	 * 验证文件大小
	 * @param	File file
	 * @return	Boolean
	 * */
	var	_validateSize = function(file){
		return (file.size - 1024 * 1024 * 5) > 0;
	};
	
	/**
	 * 预览容器对象
	 * */
	var _container;
	

	/**
	 * 图片验证和预览
	 * @param	File fileElement
	 * @param 	Number height
	 * @param 	Number width
	 * */
	this.preview = function(fileInput, height, width) {
		
		var files = fileInput.files, max = fileInput.max, getContainer = function(){
			var pnode = fileInput;
			while (pnode) {
				var cls = pnode.getAttribute("class");
				if (cls && cls.indexOf("preview-warper") != -1) break;
				pnode = pnode.parentNode;
			}
			var childs = pnode.getElementsByTagName("div");
			for (var i = 0; i < childs.length; i++) {
				var cls = childs[i].getAttribute("class");
				if (cls && cls.indexOf("preview") != -1) return childs[i];
			}
		};
		
		_container = getContainer();

		//clear前一次预览图片
		_container.innerHTML = "";
		
		//给全局_files对象赋值
		_files = files;
		
		for (var i = 0; i < files.length; i++) {
			var file = files[i], imgs = _container.childNodes;
			//验证图片格式和size
			if (!_validateType(file)) {
				console.log("不支持的图片格式：" + file.name); continue;
			}
			if (_validateSize(file)) {
				console.log("图片过大，无法上传。Size：" + file.size + "kb"); continue;
			}
			//如果设置了max值，则上传数量不能超过max
			if (max && imgs.length >= max) {
				alert("最多只能选择" + max + "张图片"); break;
			}
			
			//把校验通过的file压入上传文件数组 
			_dataFiles.push(file);
			
			//创建img对象并添加到预览容器中
			var	img = document.createElement("img"), src = window.URL.createObjectURL(file);
				img.setAttribute("src", src);
				img.setAttribute("style", "width: 100%;");
				img.setAttribute("alt", file.name);
			var div = document.createElement("div");
				div.setAttribute("style", "hieght: " + height + "px; width:  "+ height + "px; padding: 2px; border: 1px solid red; display: inline-block;");
				div.appendChild(img);
			_container.appendChild(div);
		}
	};
	
	/**
	 * @param	url String;
	 * @param	successBack Function(responseJSON);
	 * @param	failBack Function(status, statusText);
	 * */
	this.upload = function(url, successBack, failBack) {
		
		var isIegal, formData, abort;
		
		/*
		 * 验证文件
		 * */
		isIegal = function(file) {
			for (var i = 0; i < _dataFiles.length; i++) {
				if (file.name == _dataFiles[i].name) return true; 
			}
		}

		/*
		 * 组装数据
		 * */
		formData = function() {
			
			var form, fd;
			
			/*
			 * 创建form对象
			 * */
			form = document.createElement("form").setAttribute("enctype", "multipart/form-data");
			/*
			 * 创建formData对象
			 * */
			fd = new FormData(form);
			
			for (var i = 0; i < _files.length; i++) {
				if (isIegal(_files[i])) fd.append("file", _files[i]);
			}
			return fd;
		}

		/*
		 * 停止当前http请求，对应的XMLHttpRequest对象会复位到未初始化的状态。
		 * */
		abort = function(xhr){
			xhr.abort();
		}
		
		/*
		 * 创建XMLHttpRequest对象
		 * */
		var xhr = new XMLHttpRequest();
		
		/*
		 * 请求状态改变事件触发器
		 * 对应xhr.readState状态码：
		 * 		1：open方法成功调用，但send方法未调用；
		 * 		2：send方法已经调用，尚未开始接受数据；
		 * 		3：正在接受数据。HTTP响应头信息已经接受，但尚未接收完成；
		 * 		4：完成，即响应数据接受完成。
		 * xhr.status状态码：
		 * 		1、200表示“成功”；
		 * 		2、404表示“未找到”；
		 * 		3、500表示“服务器内部错误”等...
		 * */
		xhr.onreadystatechange = function() {
			/*
			 * 响应数据接受完成
			 * */
			if (xhr.readyState == 4) {
				
				var success, fail, status = xhr.status;
				
				/*
				 * 请求成功callback
				 * */
				success = successBack || function(resJSON) {
					console.log("Request success, response json: " + resJSON);
				};
				
				/*
				 * 请求失败callback
				 * */
				fail = failBack || function(code, text) {
					alert("Request fail, status code: " + code + ", StatusText: " + text);
				};
				
				/*
				 * HTTP状态码
				 * */
				if (status == 200) {
					var json = JSON.parse(xhr.responseText), uploadResult, imgs = _container.childNodes;
					/*
					 * 上传结果
					 * */
					uploadResult = function(fileName) {
						for (var i = 0; i < json.length; i++) {
							if (json[i].original == fileName) {
								return json[i];
							}
						}
					};
					
					//execute callBack before
					for (var i = 0; i < imgs.length; i++) {
						var img = imgs[i], fileName = img.getAttribute("alt"), result = uploadResult(fileName) || {flag : false, message: ""};
						if (result.flag) { //上传成功
							console.log(img);
						} else { //上传失败
							console.log(result.message);
						}
					}
					
					//execute callBack
					success(json);
				} else {
					fail(xhr.status, xhr.statusText);
				}
			}
		}
		
		/*
		 * 准备请求参数
		 * */
		xhr.open("POST", url, true);
		
		/*
		 * 向服务器发送请求
		 * */
		xhr.send(formData());
	} 
}

/**
 * @return	ImgUplaod
 * */
ImgUpload.newInstance = function(){
	return new ImgUpload();
};

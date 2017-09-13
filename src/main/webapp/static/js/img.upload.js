/**
 * @author	MaoNing
 * @date	2017.08.31
 * */
function ImgUpload(){
	/**
	 * file文本域中全部的file
	 * Type -- FileList;
	 * */	
	var	files = new Array();
	
	/**
	 * 预览容器对象
	 * */
	var container;
	
	
	/**
	 * 验证文件类型
	 * @param	File file
	 * @return	Boolean
	 * */
	var	validateType = function(file) {
		var name = file.name, suffix = name.substring(name.lastIndexOf(".")), 
			regx = /^[.]{1}(jpg|png|jpeg)$/;
		return regx.test(suffix);
	};
	
	/**
	 * 验证文件大小
	 * @param	File file
	 * @return	Boolean
	 * */
	var	validateSize = function(file){
		return (file.size - 1024 * 1024 * 5) > 0;
	};
	
	/**
	 * 创建DOM元素
	 * */
	var createElement = function(tagName, attributes, html, events) {
		var e = document.createElement(tagName);
		//设置参数
		if (attributes) {
			for (attr in attributes) {
				e.setAttribute(attr, attributes[attr]);
			}
		}
		//添加HTML内容
		if (html) {
			e.innerHTML = html;
		}
		//添加监听
		if (events) {
			for (event in events) {
				e.addEventListener(event, events[event], false);
			}
		}
		return e;
	}

	/**
	 * 图片验证和预览
	 * @param	File fileElement
	 * @param 	Number height
	 * @param 	Number width
	 * */
	this.preview = function(fileInput, height, width) {

		var tempFiles = fileInput.files;
		
		/*
		 * 获取预览容器对象
		 * */
		(function(fileInput){
			var pnode = fileInput;
			while (pnode) {
				var cls = pnode.getAttribute("class");
				if (cls && cls.indexOf("preview-warper") != -1) break;
				pnode = pnode.parentNode;
			}
			var childs = pnode.getElementsByTagName("div");
			for (var i = 0; i < childs.length; i++) {
				var cls = childs[i].getAttribute("class");
				if (cls && cls.indexOf("preview") != -1) {
					container = childs[i];
					return;
				}
			}
		})(fileInput);
		
		//clear前一次预览图片
		//container.innerHTML = "";
		for (var i = 0; i < tempFiles.length; i++) {
			
			var file = tempFiles[i], imgs = container.childNodes, div, oper, img, result;
			
			//验证图片格式和size
			if (!validateType(file)) {
				console.log("不支持的图片格式：" + file.name); continue;
			}
			if (validateSize(file)) {
				console.log("图片过大，无法上传。Size：" + file.size + "kb"); continue;
			}
			//如果设置了max值，则上传数量不能超过max
			if (fileInput.max && imgs.length >= fileInput.max) {
				alert("最多只能选择" + fileInput.max + "张图片"); break;
			}
			
			//把校验通过的file压入上传文件数组 
			files.push(file);
			
			div = createElement("div", {"style" : "height: " + height + "px; width: " + width + "px; padding: 5px; display: inline-block; position: relative;"});
			container.appendChild(div);
				
			oper = createElement("span", {"class": "oper"}, "<i class='fa fa-trash' data-name='"+file.name+"'></i>", {
				"click": function(obj) {
					//找到需要移除的包含图片的div对象
					var currentDiv = obj.target.parentNode.parentNode, newDatas = new Array();
					for (var i = 0; i < files.length; i++) {
						if (files[i].name != obj.target.getAttribute("data-name")) {
							newDatas.push(files[i]);
						}
					}
					//通过当前DIV的父节点来移除当前DIV对象
					currentDiv.parentNode.removeChild(currentDiv);
					
					//更新dataFiles;
					files = newDatas; newDatas = null;
				}
			});
			div.appendChild(oper);
			
			img = createElement("img", {"src": window.URL.createObjectURL(file), "style" : "width: 100%; height: 100%;", "alt": file.name});
			
			div.appendChild(img);
		}
	};
	
	/**
	 * @param	url String;
	 * @param	successBack Function(responseJSON);
	 * @param	failBack Function(status, statusText);
	 * */
	this.upload = function(url, successBack, failBack) {
		
		if (!files || files.length == 0) {
			alert("请选择图片");
			return;
		}
		
		var formData, abort;
		
		/*
		 * 组装数据
		 * */
		formData = function() {
			
			var form, fd;
			
			/*
			 * 创建form对象
			 * */
			form = createElement("form", {"enctype": "multipart/form-data"});
			/*
			 * 创建formData对象
			 * */
			fd = new FormData(form);
			
			for (var i = 0; i < files.length; i++) {
				fd.append("file", files[i]);
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
					//console.log("Request success, response json: " + resJSON);
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
					
					var json = JSON.parse(xhr.responseText), imgs = new Array();
					
					/*
					 * 获得容器中全部图片对象
					 * */
					(function() {
						var imgDivs = container.childNodes;
						for (var i = 0; i < imgDivs.length; i++) {
							var imgDiv = imgDivs[i];
							var childs = imgDiv.childNodes;
							for (var j = 0; j < childs.length; j++) {
								if (childs[j].nodeName == "IMG") {
									imgs.push(childs[j]); break;
								}
							}
						}
					})();
					
					/*
					 * 根据图片名称获取上传结果
					 * */
					var getResultByFileName = function(fileName) {
						for (var i = 0; i < json.length; i++) {
							if (json[i].original == fileName) {
								return json[i];
							}
						}
					};
					
					/*
					 * 从files移除上传成功的file对象
					 * */
					var removeFile = function(fileName) {
						var temp = new Array();
						for (var i = 0; i < files.length; i++) {
							if (files[i].name != fileName) {
								temp.push(files[i]);
							}
						}
						files = temp; temp = null;
					};
					
					/*
					 * 移除操作按钮
					 * */
					var removeOper = function(img) {
						var parent = img.parentNode, nodes = parent.childNodes;
						for (var i = 0; i < nodes.length; i++) {
							if (nodes[i].getAttribute("class").indexOf("oper") != -1) {
								parent.removeChild(nodes[i]);
							}
						}
					};
					
					//execute callBack before
					for (var i = 0; i < imgs.length; i++) {
						var img = imgs[i], fileName = img.getAttribute("alt"),
							result = getResultByFileName(fileName), 
							span = createElement("span", {"class": "result"})
							style = "width: " + img.parentNode.style.width + "; background: ";
						//上传成功
						if (result && result.flag) {
							style += "#2D9ADA;";
							span.innerHTML = "upload success";
							removeFile(result.original);
							removeOper(img);
						} 
						
						//上传失败
						if (result && !result.flag) {
							style += "red;";
							console.log("fail message: " + result.message);
							span.innerHTML = "upload fail";
						}
						span.setAttribute("style", style);
						img.parentNode.appendChild(span);
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
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE HTML>
<html>
<head>
	<title>Insert title here</title>
	<script type="text/javascript" src="/static/js/img.upload.js?v=0.0.1"></script>
	<link href="/static/css/font-awesome.css" rel="stylesheet" type="text/css">
	<link href="/static/css/style.css" rel="stylesheet" type="text/css">
</head>
<body>
    
    <!--这个DIV容器不能少，必须!!! -->
	<div class="preview-warper">
	
		Click Upload：
		
		<button id="chosen">浏览</button>
		
		<input name="file" type="file" multiple="multiple" max="8" onchange="uploadHandler_0(this)"/>
		   
		<button id="upload" onclick="uploadHandler_0()">上传</button>
		
		<span class="msg">（提示：图片格式仅限jpg、png、jpeg，且大小不能超过5MB）</span>
		
		<div class="preview"></div>
	</div>
</body>
<script type="text/javascript">
	(function(){
		/**
	     * 图片上传对象实例，有几个file就声明几个实例
	     */
	    var iu = ImgUpload.newInstance();
	    
		/**
		 * 在页面同时有多个file上传域的时候，用uploadHandler_[number]来区分作用域
         */
		this.uploadHandler_0 = function(file) {
	        if (file) {
	            iu.preview(file, 150, 120);
	        } else {
	            iu.upload("/upload.do");
	        }
	    }
	})(window);
</script>
</html>
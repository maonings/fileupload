<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE HTML>
<html>
<head>
	<title>Insert title here</title>
	<script type="text/javascript" src="/static/js/img.upload.js"></script>
	<style type="text/css">
		.preview {
			border: 1px solid #2D9ADA; min-height: 385px; width: 630px; margin-top: 15px;
		}
		input[type="file"] {
            opacity: 0; width: 80px;
		}
		button {
            height: 30px; background: #2D9ADA; color: white; border: 0px solid #2D9ADA; border-radius: 2px; cursor: pointer;
		}
		#chosen {
            position: absolute; width: 80px;
		}
		#upload {
            width: 65px; margin-left: 15px;
		}
		.msg {
		  font-size: 12px; color: red;
		}
	</style>
</head>
<body>
    
    <!--这个DIV容器不能少，必须!!! -->
	<div class="preview-warper">
	
		Click Upload：
		
		<button id="chosen">浏览</button>
		
		<input name="file" type="file" multiple="multiple" max="6" onchange="uploadHandler_0(this)"/>
		   
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
	            iu.preview(file);
	        } else {
	            iu.upload("/upload.do");
	        }
	    }
	})();
</script>
</html>
package com.famary.fileupload.servlet;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.famary.fileupload.PartHandler;
import com.famary.fileupload.PartHandler.PartUploadResult;
import com.famary.fileupload.util.DateFormatUtils;
import com.famary.fileupload.util.JsonUtils;

/**
 * Servlet implementation class UploadServlet
 */
@MultipartConfig()
@WebServlet(name = "upload", urlPatterns = { "/upload.do" })
public class UploadServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	
	private static String path;

	/**
	 * path也可以从属性配置文件读取，非常灵活，也可以在@MultipartConfig设置存储路径
	 * */
	@Override
	public void init() throws ServletException {
		path = "E:/upload/image/" + DateFormatUtils.simpleStrDate();
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//上传文件到指定目录
		List<PartUploadResult> results = 
				PartHandler.newInstance().multipleUpload(path, request.getParts());
		JsonUtils.write(response, results);
	}
}

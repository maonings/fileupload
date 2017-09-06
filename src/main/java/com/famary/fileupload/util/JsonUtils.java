package com.famary.fileupload.util;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * JSON工具类
 * @author	MaoNing
 * @date	2017.09.05
 * */
public class JsonUtils {
	
	/**
	 * @param response
	 * @param obj
	 * */
	public static void write(HttpServletResponse response, Object obj) {
		//设置response页面编码字符集
		response.setContentType("text/html;charset=utf-8");
		ObjectMapper mapper = new ObjectMapper();
		try {
			String json = mapper.writeValueAsString(obj);
			response.getWriter().append(json);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}

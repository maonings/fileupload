package com.famary.fileupload.util;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateFormatUtils {
	
	private DateFormatUtils(){}
	
	public static final String FORMAT_DATE = "yyyy-MM-dd";
	
	public static final String FORMAT_DATE_TIME = "yyyy-MM-dd HH:mm:ss";
	
	public static final String STR_DATE = "yyyyMMdd";
	
	public static final String SIMPLE_STR_DATE = "yyMMdd";
	
	public static final String STR_DATE_TIME = "yyyyMMddHHmmss";
	
	/**
	 * @return String
	 * */
	public static String format(String format) {
		return new SimpleDateFormat(format).format(new Date());
	}
	
	/**
	 * @return yyyy-MM-dd
	 * */
	public static String formatDate() {
		return format(FORMAT_DATE);
	}
	
	/**
	 * @return yyyy-MM-dd mm:HH:ss
	 * */
	public static String formatDateTime() {
		return format(FORMAT_DATE_TIME);
	}
	
	/**
	 * @return yyyyMMdd
	 * */
	public static String strDate() {
		return format(STR_DATE);
	}
	
	/**
	 * @return yyMMdd
	 * */
	public static String simpleStrDate() {
		return format(SIMPLE_STR_DATE);
	}
	
	/**
	 * @return yyyyMMddmmHHss
	 * */
	public static String strDateTime() {
		return format(STR_DATE_TIME);
	}
}

package com.famary.fileupload;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.Part;

import com.famary.fileupload.util.DateFormatUtils;

/**
 * <p>基于Servlet3.0+的文件上传Handler,调用此类的Servlet需要@MultipartConfig注解标注</p>
 * @author	MaoNing
 * @date	2017.08.31 
 * */
public class PartHandler {
	
	/*存储路径*/
	private String path = "";
	
	private long maxFileSize;
	
	private PartHandler(long maxFileSize) {
		this.maxFileSize = maxFileSize;
	}
	
	/**
	 * 返回PartHandler实例
	 * */
	public static PartHandler newInstance() {
		return newInstance(1024 * 1024 * 5);
	}
	
	/**
	 * 返回PartHandler实例
	 * */
	public static PartHandler newInstance(long maxFileSize) {
		return new PartHandler(maxFileSize);
	}
	
	/**
	 * 上传多个文件到指定目录文件夹
	 * @throws IOException 
	 * */
	public List<PartUploadResult> multipleUpload(String path, Collection<Part> parts) {
		//检查路径是否存在
		checkPath(path);
		return multipleUpload(parts);
	}
	
	/**
	 * 上传多个文件到@MultipartConfig标注的location目录文件夹
	 * @throws IOException 
	 * */
	public List<PartUploadResult> multipleUpload(Collection<Part> parts) {
		if (parts.isEmpty()) {
			throw new NullPointerException("No has any files can be upload.");
		}
		List<PartUploadResult> results = new ArrayList<>();
		Iterator<Part> iterator = parts.iterator();
		while (iterator.hasNext()) {
			results.add(upload(iterator.next()));
		}
		return results;
	}
	
	/**
	 * 上传单个文件到指定目录文件夹
	 * @throws IOException 
	 * */
	public PartUploadResult upload(String path, Part part) {
		//检查路径是否存在
		checkPath(path);
		return upload(part);
	}
	
	/**
	 * 上传单个文件到@MultipartConfig标注的location目录文件夹
	 * @throws IOException
	 * */
	public PartUploadResult upload(Part part) {
		
		String original = part.getSubmittedFileName(); 	//原始文件名
		String suffix = getSuffix(original); 			//文件后缀
		String fileName = getFileName(suffix);			//新文件名
		
		PartUploadResult result = new PartUploadResult(original, fileName);
		
		//check file size
		if (part.getSize() > maxFileSize) {
			try {
				throw new IOException("File is too big.");
			} catch (IOException e) {
				result.setName(null);
				result.setMessage(e.getMessage());
			}
			return result;
		}
		
		InputStream in = null;
		OutputStream out = null;
		
		try {
			if (path.isEmpty()) {
				part.write(fileName);
			} else {
				in = part.getInputStream();
				out = new FileOutputStream(path + File.separator + fileName);
				
				byte[] b = new byte[1024];
				int c = -1;
				while ((c = in.read(b)) != -1) {
					out.write(b, 0, c);
				}
			}
			result.setTime(new Date().getTime());
			result.setFlag(true);
		} catch (IOException e) {
			result.setMessage(e.getMessage());
		} finally {
			try {
				out.flush();
				out.close();
				in.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return result;
	}
	
	/**
	 * 返回上传文件后缀
	 * */
	public String getSuffix(String name) {
		return name.substring(name.lastIndexOf("."));
	}
	
	/**
	 * 返回yyyyMMddHHmmss格式当前时间+3位随机数的文件名
	 * */
	private String getFileName(String  suffix) {
		int fourRandom = (int) ((Math.random() * 9 + 1) * 1000);
		return DateFormatUtils.strDateTime() + fourRandom + suffix;
	}
	
	/**
	 * 检查指定路径是否存在，不存则创建
	 * */
	private void checkPath(String path) {
		File file = new File(path);
		if (!file.exists()) {
			file.mkdirs();
		}
		this.path = file.getPath();
	}
	
	/**
	 * 上传结果
	 * */
	public static class PartUploadResult implements Serializable {
		
		/**
		 * 
		 */
		private static final long serialVersionUID = 1L;

		private String original; //原始文件名称
		
		private String name;	//新文件名
		
		private boolean flag;	//是否上传成功
		
		private String message;
		
		private long time;
		
		public PartUploadResult(String original, String name) {
			this.original = original;
			this.name = name;
		}

		public String getOriginal() {
			return original;
		}

		public void setOriginal(String original) {
			this.original = original;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public boolean isFlag() {
			return flag;
		}

		public void setFlag(boolean flag) {
			this.flag = flag;
		}

		public String getMessage() {
			return message;
		}

		public void setMessage(String message) {
			this.message = message;
		}

		public long getTime() {
			return time;
		}

		public void setTime(long time) {
			this.time = time;
		}

		@Override
		public int hashCode() {
			final int prime = 31;
			int result = 1;
			result = prime * result + (flag ? 1231 : 1237);
			result = prime * result + ((message == null) ? 0 : message.hashCode());
			result = prime * result + ((name == null) ? 0 : name.hashCode());
			result = prime * result + ((original == null) ? 0 : original.hashCode());
			result = prime * result + (int) (time ^ (time >>> 32));
			return result;
		}

		@Override
		public boolean equals(Object obj) {
			if (this == obj)
				return true;
			if (obj == null)
				return false;
			if (getClass() != obj.getClass())
				return false;
			PartUploadResult other = (PartUploadResult) obj;
			if (flag != other.flag)
				return false;
			if (message == null) {
				if (other.message != null)
					return false;
			} else if (!message.equals(other.message))
				return false;
			if (name == null) {
				if (other.name != null)
					return false;
			} else if (!name.equals(other.name))
				return false;
			if (original == null) {
				if (other.original != null)
					return false;
			} else if (!original.equals(other.original))
				return false;
			if (time != other.time)
				return false;
			return true;
		}

		@Override
		public String toString() {
			return "PartUploadResult [original=" + original + ", name=" + name + ", flag=" + flag + ", message="
					+ message + ", time=" + time + "]";
		}
	}
}

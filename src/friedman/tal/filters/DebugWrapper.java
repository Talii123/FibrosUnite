package friedman.tal.filters;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringReader;

import javax.servlet.ServletInputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** 
 * Class which is used to wrap a request in order that the wrapped request's input stream can be  
 * read once and later be read again in a pseudo fashion by virtue of keeping the original payload 
 * as a string which is actually what is returned by subsequent calls to getInputStream(). 
 */  
public class DebugWrapper extends HttpServletRequestWrapper {  
      
    private static Logger LOGGER = LoggerFactory.getLogger(DebugWrapper.class);  
   
    private final String body;  
    private final Cookie[] cookies;
      
    public DebugWrapper (HttpServletRequest request) {            
        super(request);  
          
        // read the original payload into the body variable  
        StringBuilder stringBuilder = new StringBuilder();  
        BufferedReader bufferedReader = null;  
        try {  
            // read the payload into the StringBuilder  
            InputStream inputStream = request.getInputStream();  
            if (inputStream != null) {  
                bufferedReader = new BufferedReader(new InputStreamReader(inputStream));  
                char[] charBuffer = new char[128];  
                int bytesRead = -1;  
                while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {  
                    stringBuilder.append(charBuffer, 0, bytesRead);  
                }  
            } else {  
                // make an empty string since there is no payload  
                stringBuilder.append("");  
            }  
        } catch (IOException ex) {  
            //LOGGER.error("Error reading the request payload", ex);
        	System.err.println("Error reading the request payload"+ ex);  
        } finally {  
            if (bufferedReader != null) {  
                try {  
                    bufferedReader.close();  
                } catch (IOException iox) {  
                    // ignore  
                }  
            }  
        }  
        body = stringBuilder.toString();  
        cookies = request.getCookies();
    }  
   
    /** 
     * Override of the getInputStream() method which returns an InputStream that reads from the 
     * stored  payload string instead of from the request's actual InputStream. 
     */  
    @Override  
    public ServletInputStream getInputStream ()  
        throws IOException {  
          
        final ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(body.getBytes());  
        ServletInputStream inputStream = new ServletInputStream() {  
            public int read () throws IOException {  
                return byteArrayInputStream.read();  
            }  
        };  
        return inputStream;  
    }

	@Override
	public BufferedReader getReader() throws IOException {
		return new BufferedReader(new StringReader(body));
	}

	@Override
	public Cookie[] getCookies() {
		return cookies;
	}  
    
    
      
}  
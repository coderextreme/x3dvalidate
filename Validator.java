import java.io.*;
import java.net.*;
import java.net.http.*;
import java.net.http.HttpResponse.*;
import java.net.http.HttpClient.*;
import java.time.Duration;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;

public class Validator {
    static public String validate(String json) throws Exception {


	   HttpClient client = HttpClient.newBuilder()
		.version(Version.HTTP_1_1)
		.followRedirects(Redirect.NORMAL)
		.connectTimeout(Duration.ofSeconds(20))
		.build();

	   HttpRequest request = HttpRequest.newBuilder()
		 .uri(URI.create("https://coderextreme.net/X3DJSONLD/src/main/html/validator.html"))
		 .build();

	   HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
	   System.out.println(response.statusCode());
	   // fix up the HTML
	   String buffer = response.body()
		   .replaceAll("async([ />])", "async='true'$1")
		   .replaceAll("defer([ />])", "defer='true'$1")
		   .replaceAll("(<meta[^<>]*)/>", "$1>")
		   .replaceAll("(<meta[^>]*>)", "$1</meta>")
		   .replaceAll("(<link[^<>]*)/>", "$1>")
		   .replaceAll("(<link[^>]*>)", "$1</link>")
		   .replaceAll("(<img[^<>]*)/>", "$1>")
		   .replaceAll("(<img[^>]*>)", "$1</img>")
		   .replaceAll("&(amp;){0}", "&amp;$1")
		   .replaceAll("&amp;amp;", "&amp;")
		   .replaceAll("<hr>", "<hr/>")
		   .replaceAll("</body>", "</div></body>")
		   ;
	   // System.out.println(buffer);
	   System.out.println("json="+json);
	   String out = null;
	   try {
		   DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
		   DocumentBuilder builder = builderFactory.newDocumentBuilder();
		   Document xmlDocument = builder.parse(new InputSource(new StringReader(buffer)));
		   XPath xPath = XPathFactory.newInstance().newXPath();
		   String expression = "/html/body/text()";
		   out = xPath.compile(expression).evaluate(xmlDocument, XPathConstants.STRING).toString().trim();
	   } catch (Exception e) {	
		   out = "Unvalidated "+json;
	   }
	   System.out.println(out);
	return out;
    }
    static public void main(String args[]) throws Exception {
	Validator.validate("thank you");
    }
}

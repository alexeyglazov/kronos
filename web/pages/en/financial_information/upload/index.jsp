<%-- 
    Document   : index.jsp
    Created on : 01.08.2012, 10:50:52
    Author     : glazov
--%><%@page
    import="java.io.PrintWriter"
    import="java.util.GregorianCalendar"
    import="java.util.Calendar"
    import="java.io.BufferedInputStream"
    import="java.io.ByteArrayOutputStream"
    import="java.io.ByteArrayInputStream"
    import="jxl.Cell"
    import="jxl.Sheet"
    import="jxl.Workbook"
    import="jxl.WorkbookSettings"
    import="java.util.Date"
    import="com.mazars.management.web.content.ContentManager"
    import="com.mazars.management.web.content.ContentItem"
    import="java.util.Map"
    import="java.util.HashMap"
    import="java.util.List"
    import="java.util.LinkedList"
    import="java.util.Locale"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="java.text.SimpleDateFormat"
    import="java.io.IOException"
    import="java.io.InputStream"
    import="com.mazars.management.load.excel.FISheet"
    import="org.apache.commons.fileupload.FileItem"
    import="org.apache.commons.fileupload.disk.DiskFileItemFactory"
    import="org.apache.commons.fileupload.FileItemFactory"
    import="org.apache.commons.fileupload.servlet.ServletFileUpload" 
%><%@page contentType="text/html" pageEncoding="UTF-8"%><%
ContentItem thisContentItem = ContentManager.getContentItem(request.getRequestURI());
Employee currentUser = (Employee)session.getAttribute("currentUser");
Locale locale = new Locale("en");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
try {
    hs.beginTransaction();
%>
<%-- start of access.jsp --%>
<%
AccessChecker.Status status = null;

Module module = thisContentItem.getModule();
AccessChecker accessChecker = new AccessChecker();
status = accessChecker.check(currentUser, module);
    
if(AccessChecker.Status.NOT_LOGGED_IN.equals(status)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/login.jsp?status=" + status));
} else if(AccessChecker.Status.NOT_AUTHORIZED.equals(status)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/login.jsp?status=" + status));
} else if(AccessChecker.Status.NOT_AUTHORIZED_TO_MODULE.equals(status)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/login.jsp?status=" + status));
} else if(AccessChecker.Status.PASSWORD_MUST_BE_CHANGED.equals(status)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/changePassword.jsp?status=" + status));
}
if(! AccessChecker.Status.VALID.equals(status)) {
    hs.getTransaction().commit();
    return;
}
%>
<%-- end of access.jsp --%>
<%

String moduleBaseUrl = "/modules/core/";
Map<String, String> bodies = new HashMap<String, String>();

Map<String, String> pageProperties = new HashMap<String, String>();
pageProperties.put("title", "Upload Financial information");
pageProperties.put("description", "Page is used to work with financial information");
pageProperties.put("keywords", "Timesheet, employee, time, tasks, projects");

List<String> jsFiles = new LinkedList<String>();
jsFiles.add("main.js");

request.setAttribute("currentUser", currentUser);
request.setAttribute("bodies", bodies);
request.setAttribute("pageProperties", pageProperties);
request.setAttribute("locale", locale);

request.setAttribute("jsFiles", jsFiles);
request.setAttribute("content", moduleBaseUrl + "elements/FinancialInformationUpload.jsp");
request.setAttribute("initializer", null);
String frametemplate = moduleBaseUrl + "frametemplates/start.jsp";
%>
<%
    String command = null;
    List<FileItem> items = new LinkedList<FileItem>();
    if(! ServletFileUpload.isMultipartContent(request)) {
        command = request.getParameter("command");
    } else {
        DiskFileItemFactory factory = new DiskFileItemFactory();
        ServletFileUpload upload = new ServletFileUpload(factory);
        items = upload.parseRequest(request);
        for(FileItem item : items) {
            if (item.isFormField()) {
                if("command".equals(item.getFieldName())) {
                    command = item.getString();
                    break;
                }
            }
        }    
    }
    if(command == null) {
        command = "start";
    }
    if("start".equals(command)) {
        List<Currency> currencies = CountryCurrency.getCurrencies(currentUser.getCountry());
        String displayStatus = "showUploadForm";
        request.setAttribute("displayStatus", displayStatus);
        request.setAttribute("currencies", currencies);
    } else if("handleUpload".equals(command)) {
        FileItem dataFileItem = null;
        for(FileItem item : items) {
            if (! item.isFormField()) {
                if("dataFile".equals(item.getFieldName())) {
                    dataFileItem = item;
                }        
            }
        }
        if(dataFileItem != null && dataFileItem.getName().endsWith(".xls")) {              
            BufferedInputStream inputStream = null;
            try {
                FISheet fiSheet = new FISheet();
                inputStream = new BufferedInputStream(dataFileItem.getInputStream());
                fiSheet.readRawContent(inputStream);
                String displayStatus = "successOnUploading";
                request.setAttribute("displayStatus", displayStatus);  
                request.setAttribute("fiSheet", fiSheet);
                session.setAttribute("fiSheet", fiSheet);
             } catch (IOException e) {
                String displayStatus = "exceptionOnUploading";
                request.setAttribute("displayStatus", displayStatus);  
                request.setAttribute("exception", e);  
            } finally {
                try {
                    if(inputStream != null) {
                        inputStream.close();
                    }
                } catch (IOException e) {
                    String displayStatus = "exceptionOnUploading";
                    request.setAttribute("displayStatus", displayStatus);  
                    request.setAttribute("exception", e);
                }
            }
        } else {
            String displayStatus = "badFileFormat";
            request.setAttribute("displayStatus", displayStatus);  
        }
    } else if("read".equals(command)) {
        String sheetNumberStr = request.getParameter("sheetNumber");
        if("".equals(sheetNumberStr)) {
            String displayStatus = "errorOnReading";
            request.setAttribute("displayStatus", displayStatus);
            request.setAttribute("error", "Sheet is not selected"); 
        } else {
            Integer sheetNumber = Integer.parseInt(sheetNumberStr);
            FISheet fiSheet = (FISheet)session.getAttribute("fiSheet");
            try {
                List<FISheet.Error> readErrors = fiSheet.read(sheetNumber);
                fiSheet.setFileContent(null);                          
                if(readErrors.isEmpty()) {
                    fiSheet.setFileContent(null);
                    String displayStatus = "successOnReading";
                    request.setAttribute("displayStatus", displayStatus);  
                    request.setAttribute("fiSheet", fiSheet);                    
                } else {
                    String displayStatus = "errorsOnReading";
                    request.setAttribute("displayStatus", displayStatus);
                    request.setAttribute("errors", readErrors);                                
                }
            } catch (Exception e) {
                String displayStatus = "exceptionOnReading";
                request.setAttribute("displayStatus", displayStatus);  
                request.setAttribute("exception", e);  
            } 
        }           
    } else if("parse".equals(command)) {
       FISheet fiSheet = (FISheet)session.getAttribute("fiSheet");
       String dateFormatToParse = "dd.MM.yyyy";
       String dateFormatToShow = "dd.MM.yyyy";
       SimpleDateFormat dateFormatter = new SimpleDateFormat(dateFormatToShow);
       List<FISheet.Error> errors = fiSheet.parse(dateFormatToParse);
       if(errors.isEmpty()) {
            //String displayStatus = "successOnParsing";
            //request.setAttribute("displayStatus", displayStatus);  
            //request.setAttribute("dateFormatter", dateFormatter);
            //request.setAttribute("fiSheet", fiSheet);
            List<FISheet.Error> analyzeErrors = fiSheet.analyze();
            if(analyzeErrors.isEmpty()) {
                    String displayStatus = "successOnAnalyzingForSaving";
                    request.setAttribute("displayStatus", displayStatus);  
                    request.setAttribute("fiSheet", fiSheet);           
            } else {    
                    String displayStatus = "errorsOnAnalyzing";
                    request.setAttribute("displayStatus", displayStatus);
                    request.setAttribute("errors", analyzeErrors);
            }                                                                                                                                  
       } else {          
            String displayStatus = "errorsOnParsing";
            request.setAttribute("displayStatus", displayStatus);
            request.setAttribute("errors", errors);
       }               
    } else if("analyze".equals(command)) {
       FISheet fiSheet = (FISheet)session.getAttribute("fiSheet");
       List<FISheet.Error> errors = fiSheet.analyze();
       if(errors.isEmpty()) {
            String displayStatus = "successOnAnalyzing";
            request.setAttribute("displayStatus", displayStatus);  
            request.setAttribute("fiSheet", fiSheet);           
       } else {    
            String displayStatus = "errorsOnAnalyzing";
            request.setAttribute("displayStatus", displayStatus);
            request.setAttribute("errors", errors);
       }       
    } else if("prepare".equals(command)) {
       SimpleDateFormat dateformatter = new SimpleDateFormat("dd.MM.yyyy");
       FISheet fiSheet = (FISheet)session.getAttribute("fiSheet");
       List<FISheet.Error> prepareErrors = fiSheet.prepare();
       if(prepareErrors.isEmpty()) {
            //String displayStatus = "successOnPreparing";
            //request.setAttribute("displayStatus", displayStatus);  
            //request.setAttribute("dateFormatter", dateformatter);
            //request.setAttribute("fiSheet", fiSheet);
            SimpleDateFormat longDateFormatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String stamp = currentUser.getUserName() + "_" + longDateFormatter.format(new Date());
            try {
                fiSheet.save(stamp);
                String displayStatus = "successOnSaving";
                request.setAttribute("displayStatus", displayStatus);
                request.setAttribute("stamp", stamp);          
            } catch(Exception e) {
                String displayStatus = "exceptionOnSaving";
                request.setAttribute("displayStatus", displayStatus);  
                request.setAttribute("exception", e);  
            }
            session.setAttribute("fiSheet", null);                     
       } else {    
            String displayStatus = "errorsOnPreparing";
            request.setAttribute("displayStatus", displayStatus);
            request.setAttribute("errors", prepareErrors);
       }       
    } else if("save".equals(command)) {
       SimpleDateFormat longDateFormatter = new SimpleDateFormat("yyyyMMddHHmmss");
       String stamp = currentUser.getUserName() + "_" + longDateFormatter.format(new Date());
       FISheet fiSheet = (FISheet)session.getAttribute("fiSheet");
       try {
         fiSheet.save(stamp);
         String displayStatus = "successOnSaving";
         request.setAttribute("displayStatus", displayStatus);
         request.setAttribute("stamp", stamp);          
       } catch(Exception e) {
         String displayStatus = "exceptionOnSaving";
         request.setAttribute("displayStatus", displayStatus);  
         request.setAttribute("exception", e);  
       }
       session.setAttribute("fiSheet", null);
    }
    hs.getTransaction().commit();
    %><jsp:include page="<%=frametemplate %>" flush="true" /><%
} catch (Exception ex) {
    hs.getTransaction().rollback();
    throw ex;
}
%>



<%--
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="java.io.FileNotFoundException"%>
<%@page import="java.io.BufferedInputStream"%>
<%@page import="java.io.InputStream"%>
<%@page import="java.io.File"%>
<%@page import="java.io.FileInputStream"%>
<%@page import="com.mazars.management.service.ConfigUtils"%>
<%@page import="java.net.URLEncoder"%>
<%@page import="com.mazars.management.jobs.JobManager"%>
<%@page import="com.mazars.management.service.MailerJob"%>
<%@page import="com.mazars.management.service.Mailer"%>
<%@page import="java.util.HashSet"%>
<%@page import="java.util.Set"%>
<%@page import="com.mazars.management.web.vo.MailoutHistoryItemVO"%>
<%@page import="com.mazars.management.web.vo.MailoutRecipientVO"%>
<%@page import="com.mazars.management.db.util.MailoutUtil.DescribedMailoutRecipient"%>
<%@page import="com.mazars.management.db.util.MailoutUtil"%>
<%@page import="com.mazars.management.web.vo.EmployeeContactLinkVO"%>
<%@page import="com.mazars.management.web.vo.ConciseEmployee"%>
<%@page import="java.util.Date"%>
<%@page import="com.mazars.management.web.vo.ContactHistoryItemVO"%>
<%@page import="com.mazars.management.db.util.ContactUtil"%>
<%@page import="com.mazars.management.web.vo.ContactWithExtendedInfo"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="com.mazars.management.reports.InvoicingReport"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.List"
    import="java.util.LinkedList"
    import="java.util.Collections"
    import="java.util.Map"
    import="java.util.HashMap"
    import="java.math.BigDecimal"
    import="java.util.Locale"
    import="java.util.Calendar"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.reports.OwnTimeReport"
    import="com.mazars.management.reports.vo.*"
    import="java.text.SimpleDateFormat"
    import="com.mazars.management.reports.OwnTimeReport"
    import="com.mazars.management.reports.excel.*"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.db.comparators.*"
    import="com.mazars.management.reports.WorkInProgressReport"
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("Clients");

AccessChecker accessChecker = new AccessChecker();
AccessChecker.Status status = accessChecker.check(currentUser, module);
if(! AccessChecker.Status.VALID.equals(status)) {
    Map<AccessChecker.Status, String> statusComments = new HashMap<AccessChecker.Status, String>();
    statusComments.put(AccessChecker.Status.NOT_LOGGED_IN, "User is not logged in");
    statusComments.put(AccessChecker.Status.NOT_AUTHORIZED, "User is not authorized");
    statusComments.put(AccessChecker.Status.NOT_AUTHORIZED_TO_MODULE, "User is not authorized to this module");
    statusComments.put(AccessChecker.Status.PASSWORD_MUST_BE_CHANGED, "User must change the password");
    %>{"status": "<%=status %>", "comment": "<%=statusComments.get(status) %>"}<%
    hs.getTransaction().commit();
    return;
}

hs.refresh(currentUser);
if("getInitialContent".equals(command)) {
    List<Mailout> mailouts = MailoutUtil.getMailouts();
    Collections.reverse(mailouts);
    List<MailoutVO> mailoutVOs = MailoutVO.getList(mailouts);
    
    List<MailoutTemplate> mailoutTemplates = MailoutTemplate.getMailoutTemplates();
    List<MailoutTemplateVO> mailoutTemplateVOs = MailoutTemplateVO.getList(mailoutTemplates);
    %>
    {
        "status": "OK",
        "mailouts": <% gson.toJson(mailoutVOs, out); %>,
        "mailoutTemplates": <% gson.toJson(mailoutTemplateVOs, out); %>
    }
    <%
} else if("getMailouts".equals(command)) {
    List<Mailout> mailouts = MailoutUtil.getMailouts();
    Collections.reverse(mailouts);
    List<MailoutVO> mailoutVOs = MailoutVO.getList(mailouts);
    %>
    {
        "status": "OK",
        "mailouts": <% gson.toJson(mailoutVOs, out); %>
    }
    <%
} else if("getMailoutTemplates".equals(command)) {   
    List<MailoutTemplate> mailoutTemplates = MailoutTemplate.getMailoutTemplates();
    List<MailoutTemplateVO> mailoutTemplateVOs = MailoutTemplateVO.getList(mailoutTemplates);
    %>
    {
        "status": "OK",
        "mailoutTemplates": <% gson.toJson(mailoutTemplateVOs, out); %>
    }
    <%
} else if("getMailoutContent".equals(command)) {
    Mailout mailout = (Mailout)hs.get(Mailout.class, new Long(request.getParameter("id")));
    mailout.makeMailoutContent();
    com.mazars.management.web.vo.MailoutVO mailoutVO = new com.mazars.management.web.vo.MailoutVO(mailout);
    
    List<DescribedMailoutRecipient> describedMailoutRecipients = MailoutUtil.getDescribedMailoutRecipients(mailout);
    List<MailoutRecipientVO> mailoutRecipientVOs = new LinkedList<MailoutRecipientVO>();
    for(DescribedMailoutRecipient describedMailoutRecipient : describedMailoutRecipients) {
        mailoutRecipientVOs.add(new MailoutRecipientVO(describedMailoutRecipient));
    }
    List<MailoutHistoryItem> mailoutHistoryItems = new LinkedList<MailoutHistoryItem>(mailout.getMailoutHistoryItems());
    Collections.sort(mailoutHistoryItems, new MailoutHistoryItemComparator());
    List<MailoutHistoryItemVO> mailoutHistoryItemVOs = new LinkedList<MailoutHistoryItemVO>();
    for(MailoutHistoryItem mailoutHistoryItem : mailoutHistoryItems) {
        mailoutHistoryItemVOs.add(new MailoutHistoryItemVO(mailoutHistoryItem));
    }
    
%>
{
"status": "OK",
"mailout": <% gson.toJson(mailoutVO, out); %>,
"mailoutHistoryItems": <% gson.toJson(mailoutHistoryItemVOs, out); %>,
"mailoutRecipients": <% gson.toJson(mailoutRecipientVOs, out); %>
}
<%
} else if("getMailoutTemplateContent".equals(command)) {
    MailoutTemplate mailoutTemplate = (MailoutTemplate)hs.get(MailoutTemplate.class, new Long(request.getParameter("id")));
    mailoutTemplate.makeMailoutContent();
    com.mazars.management.web.vo.MailoutTemplateVO mailoutTemplateVO = new com.mazars.management.web.vo.MailoutTemplateVO(mailoutTemplate);
    
%>
{
"status": "OK",
"mailoutTemplate": <% gson.toJson(mailoutTemplateVO, out); %>
}
<%
} else if ("saveContacts".equals(command)) {
    Mailout mailout = (Mailout)hs.get(Mailout.class, new Long(request.getParameter("mailoutId")));
    Set<Long> tmpContactIds = new HashSet<Long>(ListOfLong.getFromJson(request.getParameter("contactIds")).getList());
    List<Contact> tmpContacts = new LinkedList<Contact>();
    for(DescribedMailoutRecipient describedMailoutRecipient : MailoutUtil.getDescribedMailoutRecipients(mailout)) {
        if(describedMailoutRecipient.getContact() != null) {
            tmpContacts.add(describedMailoutRecipient.getContact());
        }    
    }
    Set<Long> contactIds = new HashSet<Long>();
    for(Long contactId : tmpContactIds) {
        boolean isFound = false;
        for(Contact contact : tmpContacts) {
            if(contact.getId().equals(contactId)) {
                isFound = true;
                break;
            }
        }
        if(! isFound) {
            contactIds.add(contactId);
        }
    }
    List<Contact> contacts = Contact.getByIds(new LinkedList(contactIds));
    for(Contact contact : contacts) {
        if(contact.getEmail() != null && ! contact.getEmail().trim().equals("")) {
            MailoutRecipient mailoutRecipient = new MailoutRecipient();
            mailoutRecipient.setMailout(mailout);
            mailoutRecipient.setContact(contact);
            mailoutRecipient.setEmail(contact.getEmail().trim());
            mailoutRecipient.setSource(MailoutRecipient.Source.CONTACT);
            mailoutRecipient.setStatus(MailoutRecipient.Status.CREATED);
            hs.save(mailoutRecipient);
        }
    }
    List<DescribedMailoutRecipient> describedMailoutRecipients = MailoutUtil.getDescribedMailoutRecipients(mailout);
    List<MailoutRecipientVO> mailoutRecipientVOs = new LinkedList<MailoutRecipientVO>();
    for(DescribedMailoutRecipient describedMailoutRecipient : describedMailoutRecipients) {
        mailoutRecipientVOs.add(new MailoutRecipientVO(describedMailoutRecipient));
    }   
    
    List<MailoutHistoryItem> mailoutHistoryItems = new LinkedList<MailoutHistoryItem>(mailout.getMailoutHistoryItems());
    Collections.sort(mailoutHistoryItems, new MailoutHistoryItemComparator());
    List<MailoutHistoryItemVO> mailoutHistoryItemVOs = new LinkedList<MailoutHistoryItemVO>();
    for(MailoutHistoryItem mailoutHistoryItem : mailoutHistoryItems) {
        mailoutHistoryItemVOs.add(new MailoutHistoryItemVO(mailoutHistoryItem));
    }
    
%>
{
"status": "OK",
"mailoutRecipients": <% gson.toJson(mailoutRecipientVOs, out); %>,
"mailoutHistoryItems": <% gson.toJson(mailoutHistoryItemVOs, out); %>
}
<%    
} else if ("saveEmployees".equals(command)) {
    Mailout mailout = (Mailout)hs.get(Mailout.class, new Long(request.getParameter("mailoutId")));
    Set<Long> tmpEmployeeIds = new HashSet<Long>(ListOfLong.getFromJson(request.getParameter("employeeIds")).getList());
    List<Employee> tmpEmployees = new LinkedList<Employee>();
    for(DescribedMailoutRecipient describedMailoutRecipient : MailoutUtil.getDescribedMailoutRecipients(mailout)) {
        if(describedMailoutRecipient.getEmployee() != null) {
            tmpEmployees.add(describedMailoutRecipient.getEmployee());
        }    
    }
    Set<Long> employeeIds = new HashSet<Long>();
    for(Long employeeId : tmpEmployeeIds) {
        boolean isFound = false;
        for(Employee employee : tmpEmployees) {
            if(employee.getId().equals(employeeId)) {
                isFound = true;
                break;
            }
        }
        if(! isFound) {
            employeeIds.add(employeeId);
        }
    }
    
    List<Employee> employees = Employee.getByIds(new LinkedList(employeeIds));
    for(Employee employee : employees) {
        if(employee.getEmail() != null && ! employee.getEmail().trim().equals("")) {
            MailoutRecipient mailoutRecipient = new MailoutRecipient();
            mailoutRecipient.setMailout(mailout);
            mailoutRecipient.setEmployee(employee);
            mailoutRecipient.setEmail(employee.getEmail().trim());
            mailoutRecipient.setSource(MailoutRecipient.Source.EMPLOYEE);
            mailoutRecipient.setStatus(MailoutRecipient.Status.CREATED);
            hs.save(mailoutRecipient);
        }
    }
    List<DescribedMailoutRecipient> describedMailoutRecipients = MailoutUtil.getDescribedMailoutRecipients(mailout);
    List<MailoutRecipientVO> mailoutRecipientVOs = new LinkedList<MailoutRecipientVO>();
    for(DescribedMailoutRecipient describedMailoutRecipient : describedMailoutRecipients) {
        mailoutRecipientVOs.add(new MailoutRecipientVO(describedMailoutRecipient));
    }   
    
    List<MailoutHistoryItem> mailoutHistoryItems = new LinkedList<MailoutHistoryItem>(mailout.getMailoutHistoryItems());
    Collections.sort(mailoutHistoryItems, new MailoutHistoryItemComparator());
    List<MailoutHistoryItemVO> mailoutHistoryItemVOs = new LinkedList<MailoutHistoryItemVO>();
    for(MailoutHistoryItem mailoutHistoryItem : mailoutHistoryItems) {
        mailoutHistoryItemVOs.add(new MailoutHistoryItemVO(mailoutHistoryItem));
    }
    
%>
{
"status": "OK",
"mailoutRecipients": <% gson.toJson(mailoutRecipientVOs, out); %>,
"mailoutHistoryItems": <% gson.toJson(mailoutHistoryItemVOs, out); %>
}
<%    
} else if ("saveEmails".equals(command)) {
    Mailout mailout = (Mailout)hs.get(Mailout.class, new Long(request.getParameter("mailoutId")));
    Set<String> tmpEmails = new HashSet<String>(ListOfString.getFromJson(request.getParameter("emails")).getList());
    Set<String> emails = new HashSet<String>();
    for(String email : tmpEmails) {
        boolean found = false;
        for(MailoutRecipient mailoutRecipient : mailout.getMailoutRecipients()) {
            if(mailoutRecipient.getEmail().equalsIgnoreCase(email.trim())) {
                found = true;
                break;
            }
        }
        if(! found) {
            emails.add(email);
        }
    }
    for(String email : emails) {
        MailoutRecipient mailoutRecipient = new MailoutRecipient();
        List<Contact> contacts = Contact.getByEmail(email);
        if(! contacts.isEmpty()) {
            mailoutRecipient.setContact(contacts.get(0));
            mailoutRecipient.setSource(MailoutRecipient.Source.CONTACT);
        } else {
            List<Employee> emailEmployees = Employee.getByEmail(email, true);
            if(emailEmployees.isEmpty()) {
                // no active let's take all
                emailEmployees = Employee.getByEmail(email);
            }
            if(! emailEmployees.isEmpty()) {
                mailoutRecipient.setEmployee(emailEmployees.get(0));
                mailoutRecipient.setSource(MailoutRecipient.Source.EMPLOYEE);
            } else {
                mailoutRecipient.setSource(MailoutRecipient.Source.FREE);
            }
        }
        mailoutRecipient.setEmail(email);
        mailoutRecipient.setStatus(MailoutRecipient.Status.CREATED);
        mailoutRecipient.setMailout(mailout);
        hs.save(mailoutRecipient);
    }
    
    List<DescribedMailoutRecipient> describedMailoutRecipients = MailoutUtil.getDescribedMailoutRecipients(mailout);
    List<MailoutRecipientVO> mailoutRecipientVOs = new LinkedList<MailoutRecipientVO>();
    for(DescribedMailoutRecipient describedMailoutRecipient : describedMailoutRecipients) {
        mailoutRecipientVOs.add(new MailoutRecipientVO(describedMailoutRecipient));
    }    
    
    List<MailoutHistoryItem> mailoutHistoryItems = new LinkedList<MailoutHistoryItem>(mailout.getMailoutHistoryItems());
    Collections.sort(mailoutHistoryItems, new MailoutHistoryItemComparator());
    List<MailoutHistoryItemVO> mailoutHistoryItemVOs = new LinkedList<MailoutHistoryItemVO>();
    for(MailoutHistoryItem mailoutHistoryItem : mailoutHistoryItems) {
        mailoutHistoryItemVOs.add(new MailoutHistoryItemVO(mailoutHistoryItem));
    }
    
%>
{
"status": "OK",
"mailoutRecipients": <% gson.toJson(mailoutRecipientVOs, out); %>,
"mailoutHistoryItems": <% gson.toJson(mailoutHistoryItemVOs, out); %>
}
<%    
}  else if ("deleteMailoutRecipients".equals(command)) {
    Mailout mailout = (Mailout)hs.get(Mailout.class, new Long(request.getParameter("mailoutId")));
    List<Long> mailoutRecipientIds = ListOfLong.getFromJson(request.getParameter("mailoutRecipientIds")).getList();
    List<MailoutRecipient> mailoutRecipients = new LinkedList<MailoutRecipient>();
    for(Long mailoutRecipientId : mailoutRecipientIds) {
        MailoutRecipient mailoutRecipient = (MailoutRecipient)hs.get(MailoutRecipient.class, mailoutRecipientId);
        mailoutRecipients.add(mailoutRecipient);
        if(MailoutRecipient.Status.SENT.equals(mailoutRecipient.getStatus()) ||
           MailoutRecipient.Status.RECIEVED.equals(mailoutRecipient.getStatus()) ||
                MailoutRecipient.Status.RECIEVE_FAILED.equals(mailoutRecipient.getStatus())) {
            throw new Exception("List contains recipients that have been sent");
        }
    }

    for(MailoutRecipient mailoutRecipient : mailoutRecipients) {
        if(mailoutRecipient.getMailout().getId().equals(mailout.getId())) {
            hs.delete(mailoutRecipient);
        }
    }
    List<DescribedMailoutRecipient> describedMailoutRecipients = MailoutUtil.getDescribedMailoutRecipients(mailout);
    List<MailoutRecipientVO> mailoutRecipientVOs = new LinkedList<MailoutRecipientVO>();
    for(DescribedMailoutRecipient describedMailoutRecipient : describedMailoutRecipients) {
        mailoutRecipientVOs.add(new MailoutRecipientVO(describedMailoutRecipient));
    }   
    
    List<MailoutHistoryItem> mailoutHistoryItems = new LinkedList<MailoutHistoryItem>(mailout.getMailoutHistoryItems());
    Collections.sort(mailoutHistoryItems, new MailoutHistoryItemComparator());
    List<MailoutHistoryItemVO> mailoutHistoryItemVOs = new LinkedList<MailoutHistoryItemVO>();
    for(MailoutHistoryItem mailoutHistoryItem : mailoutHistoryItems) {
        mailoutHistoryItemVOs.add(new MailoutHistoryItemVO(mailoutHistoryItem));
    }
    
%>
{
"status": "OK",
"mailoutRecipients": <% gson.toJson(mailoutRecipientVOs, out); %>,
"mailoutHistoryItems": <% gson.toJson(mailoutHistoryItemVOs, out); %>
}
<%  
}  else if ("sendToSelectedRecipients".equals(command)) {
    Mailout mailout = (Mailout)hs.get(Mailout.class, new Long(request.getParameter("mailoutId")));
    mailout.makeMailoutContent();
    Set<Long> mailoutRecipientIds = new HashSet(ListOfLong.getFromJson(request.getParameter("mailoutRecipientIds")).getList());
    List<MailoutRecipient> mailoutRecipients = new LinkedList<MailoutRecipient>();
    for(Long mailoutRecipientId : mailoutRecipientIds) {
        MailoutRecipient mailoutRecipient = (MailoutRecipient)hs.get(MailoutRecipient.class, mailoutRecipientId);
        if(! mailout.getId().equals(mailoutRecipient.getMailout().getId())) {
            throw new Exception("Recipient of other mailout (" + mailoutRecipient.getEmail() + ")");
        }
        mailoutRecipients.add(mailoutRecipient);
    }
    if(! (Mailout.Status.TESTED.equals(mailout.getStatus()) || Mailout.Status.FINISHED.equals(mailout.getStatus()))) {
        throw new Exception("Mailout status is neither TESTED nor FINISHED");
    }
    
    MailerJob job = new MailerJob();
    job.setName("Mailout (" + mailout.getName() + ")");
    job.setPart(0.0);
    job.setStartDate(new Date());
    job.setEmployee(currentUser);
    job.setMailout(mailout);
    job.setMailoutRecipients(mailoutRecipients);
    JobManager.getInstance().addJob(job);
    
    %>
    {
    "status": "OK"
    }
    <%     
} else if ("testMailout".equals(command)) {
    Mailout mailout = (Mailout)hs.get(Mailout.class, new Long(request.getParameter("mailoutId")));
    mailout.makeMailoutContent();
    Mailer mailer = new Mailer(mailout);
    mailer.test();
    
    com.mazars.management.web.vo.MailoutVO mailoutVO = new com.mazars.management.web.vo.MailoutVO(mailout);
   
    List<MailoutHistoryItem> mailoutHistoryItems = new LinkedList<MailoutHistoryItem>(mailout.getMailoutHistoryItems());
    Collections.sort(mailoutHistoryItems, new MailoutHistoryItemComparator());
    List<MailoutHistoryItemVO> mailoutHistoryItemVOs = new LinkedList<MailoutHistoryItemVO>();
    for(MailoutHistoryItem mailoutHistoryItem : mailoutHistoryItems) {
        mailoutHistoryItemVOs.add(new MailoutHistoryItemVO(mailoutHistoryItem));
    }
    
%>
{
"status": "OK",
"mailout": <% gson.toJson(mailoutVO, out); %>,
"mailoutHistoryItems": <% gson.toJson(mailoutHistoryItemVOs, out); %>
}
<%    
} else if ("getMailoutPreview".equals(command)) {
    Mailout mailout = (Mailout)hs.get(Mailout.class, new Long(request.getParameter("mailoutId")));
    mailout.makeMailoutContent();
    String htmlMessage = mailout.getMailoutContent().getLayout();
    for(MailoutContent.Body body : mailout.getMailoutContent().getBodies()) {
        String name = body.getName();
        String content = body.getContent();
        //content = content.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
        htmlMessage = htmlMessage.replaceAll("<" + name + ">", content);
    }
    for(MailoutContent.Link link : mailout.getMailoutContent().getLinks()) {
        String name = link.getName();
        String url = link.getUrl();
        String text = link.getText();
        String linkHtml = "<a href=\"" + url + "\">" + text + "</a>";
        htmlMessage = htmlMessage.replaceAll("<" + name + ">", linkHtml);
    }    
    for(MailoutContent.EmbeddedObject embeddedObject : mailout.getMailoutContent().getEmbeddedObjects()) {
        String name = embeddedObject.getName();
        String source = embeddedObject.getSource();
        String url = "../../../files/" + URLEncoder.encode(source, "UTF-8");
        htmlMessage = htmlMessage.replaceAll("<" + name + ">", url);
    }    
%>
    <%=htmlMessage %>
<%    
} else if ("getMailoutTemplatePreview".equals(command)) {
    MailoutTemplate mailoutTemplate = (MailoutTemplate)hs.get(MailoutTemplate.class, new Long(request.getParameter("mailoutTemplateId")));
    mailoutTemplate.makeMailoutContent();
    String htmlMessage = mailoutTemplate.getMailoutContent().getLayout();
    for(MailoutContent.Body body : mailoutTemplate.getMailoutContent().getBodies()) {
        String name = body.getName();
        String content = body.getContent();
        //content = content.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
        htmlMessage = htmlMessage.replaceAll("<" + name + ">", content);
    }
    for(MailoutContent.Link link : mailoutTemplate.getMailoutContent().getLinks()) {
        String name = link.getName();
        String url = link.getUrl();
        String text = link.getText();
        String linkHtml = "<a href=\"" + url + "\">" + text + "</a>";
        htmlMessage = htmlMessage.replaceAll("<" + name + ">", linkHtml);
    }    
    for(MailoutContent.EmbeddedObject embeddedObject : mailoutTemplate.getMailoutContent().getEmbeddedObjects()) {
        String name = embeddedObject.getName();
        String source = embeddedObject.getSource();
        String url = "../../../files/" + URLEncoder.encode(source, "UTF-8");
        htmlMessage = htmlMessage.replaceAll("<" + name + ">", url);
    }    
%>
    <%=htmlMessage %>
<%    
} else if ("setTestedMailout".equals(command)) {
    Mailout mailout = (Mailout)hs.get(Mailout.class, new Long(request.getParameter("mailoutId")));
    mailout.makeMailoutContent();
    
    Date now = new Date();
    mailout.setStatus(Mailout.Status.TESTED);
    hs.save(mailout);
    MailoutHistoryItem mailoutHistoryItem = new MailoutHistoryItem();
    mailoutHistoryItem.setEmployee(currentUser);
    mailoutHistoryItem.setTime(now);
    mailoutHistoryItem.setStatus(Mailout.Status.TESTED);
    mailoutHistoryItem.setComment("Mailout has been set as Tested");
    mailoutHistoryItem.setMailout(mailout);
    hs.save(mailoutHistoryItem);
    com.mazars.management.web.vo.MailoutVO mailoutVO = new com.mazars.management.web.vo.MailoutVO(mailout);
   
    List<MailoutHistoryItem> mailoutHistoryItems = new LinkedList<MailoutHistoryItem>(mailout.getMailoutHistoryItems());
    Collections.sort(mailoutHistoryItems, new MailoutHistoryItemComparator());
    List<MailoutHistoryItemVO> mailoutHistoryItemVOs = new LinkedList<MailoutHistoryItemVO>();
    for(MailoutHistoryItem tmpMailoutHistoryItem : mailoutHistoryItems) {
        mailoutHistoryItemVOs.add(new MailoutHistoryItemVO(tmpMailoutHistoryItem));
    }
    
%>
{
"status": "OK",
"mailout": <% gson.toJson(mailoutVO, out); %>,
"mailoutHistoryItems": <% gson.toJson(mailoutHistoryItemVOs, out); %>
}
<%    
}  else if ("closeMailout".equals(command)) {
    Mailout mailout = (Mailout)hs.get(Mailout.class, new Long(request.getParameter("mailoutId")));
    mailout.makeMailoutContent();
    
    Date now = new Date();
    mailout.setStatus(Mailout.Status.CLOSED);
    hs.save(mailout);
    MailoutHistoryItem mailoutHistoryItem = new MailoutHistoryItem();
    mailoutHistoryItem.setEmployee(currentUser);
    mailoutHistoryItem.setTime(now);
    mailoutHistoryItem.setStatus(Mailout.Status.CLOSED);
    mailoutHistoryItem.setComment("Mailout has been closed");
    mailoutHistoryItem.setMailout(mailout);
    hs.save(mailoutHistoryItem);
    
    com.mazars.management.web.vo.MailoutVO mailoutVO = new com.mazars.management.web.vo.MailoutVO(mailout);
   
    List<MailoutHistoryItem> mailoutHistoryItems = new LinkedList<MailoutHistoryItem>(mailout.getMailoutHistoryItems());
    Collections.sort(mailoutHistoryItems, new MailoutHistoryItemComparator());
    List<MailoutHistoryItemVO> mailoutHistoryItemVOs = new LinkedList<MailoutHistoryItemVO>();
    for(MailoutHistoryItem tmpMailoutHistoryItem : mailoutHistoryItems) {
        mailoutHistoryItemVOs.add(new MailoutHistoryItemVO(tmpMailoutHistoryItem));
    }
    
%>
{
"status": "OK",
"mailout": <% gson.toJson(mailoutVO, out); %>,
"mailoutHistoryItems": <% gson.toJson(mailoutHistoryItemVOs, out); %>
}
<%    
} else if ("sendMailout".equals(command)) {
    Mailout mailout = (Mailout)hs.get(Mailout.class, new Long(request.getParameter("mailoutId")));
    mailout.makeMailoutContent();
       
    MailerJob job = new MailerJob();
    job.setName("Mailout (" + mailout.getName() + ")");
    job.setPart(0.0);
    job.setStartDate(new Date());
    job.setEmployee(currentUser);
    job.setMailout(mailout);
    JobManager.getInstance().addJob(job);   
%>
{
"status": "OK"
}
<%    
} else if("cloneMailout".equals(command)) {
    Mailout mailout = (Mailout)hs.get(Mailout.class, new Long(request.getParameter("id")));
    Mailout cloneMailout = new Mailout();
    
    cloneMailout.setName(mailout.getName());
    cloneMailout.setDescription(mailout.getDescription());
    cloneMailout.setSenderName(mailout.getSenderName());
    cloneMailout.setSubject(mailout.getSubject());
    cloneMailout.setTestTo(mailout.getTestTo());
    cloneMailout.setReplyTo(mailout.getReplyTo());
    cloneMailout.setDispositionNotificationTo(mailout.getDispositionNotificationTo());
    cloneMailout.setStatus(Mailout.Status.MODIFIED);
    cloneMailout.setDelay(mailout.getDelay());
    cloneMailout.setPartSize(mailout.getPartSize());
    
    mailout.makeMailoutContent();
    cloneMailout.setMailoutContent(mailout.getMailoutContent());
    cloneMailout.makeJsonMailoutContent();
    hs.save(cloneMailout);

    MailoutHistoryItem mailoutHistoryItem = new MailoutHistoryItem();
    mailoutHistoryItem.setComment("Created (clone)");
    mailoutHistoryItem.setStatus(Mailout.Status.MODIFIED);
    mailoutHistoryItem.setEmployee(currentUser);
    mailoutHistoryItem.setTime(new Date());
    mailoutHistoryItem.setMailout(cloneMailout);
    hs.save(mailoutHistoryItem);
    %>{
    "status": "OK"
    }<%    
}

hs.getTransaction().commit();

} catch (Exception ex) {
    hs.getTransaction().rollback();
    %>
    {
        "status": "FAIL",
        "comment": <% gson.toJson(ex.toString(), out); %>
        <% ex.printStackTrace(new PrintWriter(out)); %>
        }
    <%
}
%>

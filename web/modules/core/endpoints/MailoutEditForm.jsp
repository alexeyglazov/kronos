<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.web.security.AccessChecker"
    
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

if("getInitialContent".equals(command)) {
    List<MailoutTemplate> mailoutTemplates = MailoutTemplate.getMailoutTemplates();
    List<MailoutTemplateVO> mailoutTemplateVOs = MailoutTemplateVO.getList(mailoutTemplates);
    %>
    {
        "status": "OK",
        "mailoutTemplates": <% gson.toJson(mailoutTemplateVOs, out); %>
    }
    <%    
} else if("saveMailout".equals(command)) {
    MailoutEditForm mailoutEditForm = MailoutEditForm.getFromJson(request.getParameter("mailoutEditForm"));
    Mailout mailout = null;
    MailoutHistoryItem mailoutHistoryItem = new MailoutHistoryItem();
    if(MailoutEditForm.Mode.CREATE.equals(mailoutEditForm.getMode())) {
        mailout = new Mailout();
        mailout.setStatus(Mailout.Status.MODIFIED);
        mailoutHistoryItem.setComment("Created");
        mailoutHistoryItem.setStatus(Mailout.Status.MODIFIED);
    } else if(MailoutEditForm.Mode.UPDATE.equals(mailoutEditForm.getMode())) {
        mailout = (Mailout)hs.get(Mailout.class, new Long(mailoutEditForm.getId()));
        mailout.setStatus(Mailout.Status.MODIFIED);
        mailoutHistoryItem.setComment("Updated");
        mailoutHistoryItem.setStatus(Mailout.Status.MODIFIED);
    }
    mailout.setName(mailoutEditForm.getName());
    mailout.setDescription(mailoutEditForm.getDescription());
    mailout.setSenderName(mailoutEditForm.getSenderName());
    mailout.setSubject(mailoutEditForm.getSubject());
    mailout.setTestTo(mailoutEditForm.getTestTo());
    mailout.setReplyTo(mailoutEditForm.getReplyTo());
    mailout.setDispositionNotificationTo(mailoutEditForm.getDispositionNotificationTo());
    mailout.setDelay(mailoutEditForm.getDelay());
    mailout.setPartSize(mailoutEditForm.getPartSize());
    hs.save(mailout);
    
    mailoutHistoryItem.setEmployee(currentUser);
    mailoutHistoryItem.setTime(new Date());
    mailoutHistoryItem.setMailout(mailout);
    hs.save(mailoutHistoryItem);
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteMailout".equals(command)) {
    Mailout mailout = (Mailout)hs.get(Mailout.class, new Long(request.getParameter("id")));
    List<MailoutRecipient.Status> statuses = new LinkedList<MailoutRecipient.Status>();
    statuses.add(MailoutRecipient.Status.SENT);
    statuses.add(MailoutRecipient.Status.SEND_FAILED);
    statuses.add(MailoutRecipient.Status.RECIEVED);
    statuses.add(MailoutRecipient.Status.RECIEVE_FAILED);
    List<MailoutRecipient> mailoutRecipients = MailoutRecipient.getMailoutRecipients(mailout, statuses);
    if(! mailoutRecipients.isEmpty()) {
        throw new Exception("This mailout has recipents that have been mailed");
    }
    
    for(MailoutRecipient mailoutRecipient : mailout.getMailoutRecipients()) {
        hs.delete(mailoutRecipient);
    }
    for(MailoutHistoryItem mailoutHistoryItem : mailout.getMailoutHistoryItems()) {
        hs.delete(mailoutHistoryItem);
    }
    hs.delete(mailout);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkMailoutDependencies".equals(command)) {
    Mailout mailout = (Mailout)hs.get(Mailout.class, new Long(request.getParameter("id")));
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
    }
    <%
}
%>
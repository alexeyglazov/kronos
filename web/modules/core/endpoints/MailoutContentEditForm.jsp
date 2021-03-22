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
} else if("saveMailoutContent".equals(command)) {
    MailoutContentEditForm mailoutContentEditForm = MailoutContentEditForm.getFromJson(request.getParameter("mailoutContentEditForm"));
    Mailout mailout = (Mailout)hs.get(Mailout.class, mailoutContentEditForm.getId());

    MailoutContent mailoutContent = new MailoutContent();
    mailoutContent.setLayout(mailoutContentEditForm.getMailoutContent().getLayout());
    mailout.setMailoutContent(mailoutContent);
    
    for(MailoutContentEditForm.Body tmpBody : mailoutContentEditForm.getMailoutContent().getBodies()) {
        MailoutContent.Body body = mailoutContent.new Body();
        body.setName(tmpBody.getName());
        body.setContent(tmpBody.getContent());
        body.setSortValue(tmpBody.getSortValue());
        mailoutContent.getBodies().add(body);
    }
    for(MailoutContentEditForm.EmbeddedObject tmpEmbeddedObject : mailoutContentEditForm.getMailoutContent().getEmbeddedObjects()) {
        MailoutContent.EmbeddedObject embeddedObject = mailoutContent.new EmbeddedObject();
        embeddedObject.setName(tmpEmbeddedObject.getName());
        embeddedObject.setSource(tmpEmbeddedObject.getSource());
        mailoutContent.getEmbeddedObjects().add(embeddedObject);
    }
    for(MailoutContentEditForm.Link tmpLink : mailoutContentEditForm.getMailoutContent().getLinks()) {
        MailoutContent.Link link = mailoutContent.new Link();
        link.setName(tmpLink.getName());
        link.setUrl(tmpLink.getUrl());
        link.setText(tmpLink.getText());
        mailoutContent.getLinks().add(link);
    }
    for(MailoutContentEditForm.Attachment tmpAttachment : mailoutContentEditForm.getMailoutContent().getAttachments()) {
        MailoutContent.Attachment attachment = mailoutContent.new Attachment();
        attachment.setName(tmpAttachment.getName());
        attachment.setSource(tmpAttachment.getSource());
        mailoutContent.getAttachments().add(attachment);
    }
    mailout.makeJsonMailoutContent();
    mailout.setStatus(Mailout.Status.MODIFIED);
    hs.save(mailout);
    
    MailoutHistoryItem mailoutHistoryItem = new MailoutHistoryItem();
    mailoutHistoryItem.setStatus(Mailout.Status.MODIFIED);
    mailoutHistoryItem.setComment("Content modified");
    mailoutHistoryItem.setEmployee(currentUser);
    mailoutHistoryItem.setTime(new Date());
    mailoutHistoryItem.setMailout(mailout);
    hs.save(mailoutHistoryItem);
    %>
    {
    "status": "OK"
    }
    <%
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
<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.List"
    import="java.util.LinkedList"
    import="java.util.Locale"
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
Module module = Module.getByName("Financial Information");

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
if("saveAgreement".equals(command)) {
    AgreementEditForm agreementEditForm = AgreementEditForm.getFromJson(request.getParameter("agreementEditForm"));
    if(AgreementEditForm.Mode.CREATE.equals(agreementEditForm.getMode())) {
        ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(agreementEditForm.getProjectCodeId()));
        Agreement agreement = new Agreement();
        agreement.setProjectCode(projectCode);
        
        agreement.setNumber(agreementEditForm.getNumber());
        agreement.setIsSigned(agreementEditForm.getIsSigned());
        if(agreementEditForm.getDate() != null) {
            agreement.setDate(agreementEditForm.getDate().getCalendar());
        } else {
            agreement.setDate(null);
        }
        agreement.setType(agreementEditForm.getType());
        agreement.setIsRenewal(agreementEditForm.getIsRenewal());
        agreement.setComment(agreementEditForm.getComment());
        hs.save(agreement);
    } else if(AgreementEditForm.Mode.UPDATE.equals(agreementEditForm.getMode())) {
        Agreement agreement = (Agreement)hs.get(Agreement.class, new Long(agreementEditForm.getId()));
        agreement.setNumber(agreementEditForm.getNumber());
        agreement.setIsSigned(agreementEditForm.getIsSigned());
        if(agreementEditForm.getDate() != null) {
            agreement.setDate(agreementEditForm.getDate().getCalendar());
        } else {
            agreement.setDate(null);
        }
        agreement.setType(agreementEditForm.getType());
        agreement.setIsRenewal(agreementEditForm.getIsRenewal());
        agreement.setComment(agreementEditForm.getComment());

        hs.save(agreement);
    }
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteAgreement".equals(command)) {
    Agreement agreement = (Agreement)hs.get(Agreement.class, new Long(request.getParameter("id")));
    hs.delete(agreement);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkAgreementDependencies".equals(command)) {
    Agreement agreement = (Agreement)hs.get(Agreement.class, new Long(request.getParameter("id")));
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
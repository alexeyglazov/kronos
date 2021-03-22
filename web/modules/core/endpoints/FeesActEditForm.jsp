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

if("getInitialContent".equals(command)) {
    FeesItem feesItem = null;
    if("CREATE".equals(request.getParameter("mode"))) {
        feesItem = (FeesItem)hs.get(FeesItem.class, new Long(request.getParameter("feesItemId")));
    } else if("UPDATE".equals(request.getParameter("mode"))) {
        feesItem = ((FeesAct)hs.get(FeesAct.class, new Long(request.getParameter("id")))).getFeesItem();
    }
    Currency mainCurrency = CountryCurrency.getMainCurrency(feesItem.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry());
    %>
    {
    "status": "OK",
    "feesItem": <% gson.toJson(new FeesItemVOH(feesItem), out); %>,
    "mainCurrency": <% gson.toJson(new CurrencyVO(mainCurrency), out); %>
    }
    <%
} else if("saveFeesAct".equals(command)) {
    FeesActEditForm feesActEditForm = FeesActEditForm.getFromJson(request.getParameter("feesActEditForm"));
    if(FeesActEditForm.Mode.CREATE.equals(feesActEditForm.getMode())) {
        FeesItem feesItem = (FeesItem)hs.get(FeesItem.class, new Long(feesActEditForm.getFeesItemId()));
        Currency mainCurrency = CountryCurrency.getMainCurrency(feesItem.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry());
        FeesAct feesAct = new FeesAct();
        feesAct.setFeesItem(feesItem);
        feesAct.setAmount(feesActEditForm.getAmount());
        if(! mainCurrency.getId().equals(feesItem.getFeesActCurrency().getId())) {
            feesAct.setCvAmount(feesActEditForm.getCvAmount());
        }
        if(feesActEditForm.getDate() != null) {
            feesAct.setDate(feesActEditForm.getDate().getCalendar());
        } else {
            feesAct.setDate(null);
        }
        feesAct.setReference(feesActEditForm.getReference());
        feesAct.setIsSigned(feesActEditForm.getIsSigned());
        hs.save(feesAct);
    } else if(FeesActEditForm.Mode.UPDATE.equals(feesActEditForm.getMode())) {
        FeesAct feesAct = (FeesAct)hs.get(FeesAct.class, new Long(feesActEditForm.getId()));
        FeesItem feesItem = feesAct.getFeesItem();
        Currency mainCurrency = CountryCurrency.getMainCurrency(feesItem.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry());
        feesAct.setAmount(feesActEditForm.getAmount());
        if(! mainCurrency.getId().equals(feesItem.getFeesActCurrency().getId())) {
            feesAct.setCvAmount(feesActEditForm.getCvAmount());
        }
        if(feesActEditForm.getDate() != null) {
            feesAct.setDate(feesActEditForm.getDate().getCalendar());
        } else {
            feesAct.setDate(null);
        }
        feesAct.setReference(feesActEditForm.getReference());
        feesAct.setIsSigned(feesActEditForm.getIsSigned());
        hs.save(feesAct);
    }
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteFeesAct".equals(command)) {
    FeesAct feesAct = (FeesAct)hs.get(FeesAct.class, new Long(request.getParameter("id")));
    hs.delete(feesAct);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkFeesActDependencies".equals(command)) {
    FeesAct feesAct = (FeesAct)hs.get(FeesAct.class, new Long(request.getParameter("id")));
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
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
    OutOfPocketItem outOfPocketItem = null;
    if("CREATE".equals(request.getParameter("mode"))) {
        outOfPocketItem = (OutOfPocketItem)hs.get(OutOfPocketItem.class, new Long(request.getParameter("outOfPocketItemId")));
    } else if("UPDATE".equals(request.getParameter("mode"))) {
        outOfPocketItem = ((OutOfPocketAct)hs.get(OutOfPocketAct.class, new Long(request.getParameter("id")))).getOutOfPocketItem();
    }
    Currency mainCurrency = CountryCurrency.getMainCurrency(outOfPocketItem.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry());
    %>
    {
    "status": "OK",
    "outOfPocketItem": <% gson.toJson(new OutOfPocketItemVOH(outOfPocketItem), out); %>,
    "mainCurrency": <% gson.toJson(new CurrencyVO(mainCurrency), out); %>
    }
    <%
} else if("saveOutOfPocketAct".equals(command)) {
    OutOfPocketActEditForm outOfPocketActEditForm = OutOfPocketActEditForm.getFromJson(request.getParameter("outOfPocketActEditForm"));
    if(OutOfPocketActEditForm.Mode.CREATE.equals(outOfPocketActEditForm.getMode())) {
        OutOfPocketItem outOfPocketItem = (OutOfPocketItem)hs.get(OutOfPocketItem.class, new Long(outOfPocketActEditForm.getOutOfPocketItemId()));
        Currency mainCurrency = CountryCurrency.getMainCurrency(outOfPocketItem.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry());

        OutOfPocketAct outOfPocketAct = new OutOfPocketAct();
        outOfPocketAct.setOutOfPocketItem(outOfPocketItem);
        outOfPocketAct.setAmount(outOfPocketActEditForm.getAmount());
        if(! mainCurrency.getId().equals(outOfPocketItem.getOutOfPocketActCurrency().getId())) {
            outOfPocketAct.setCvAmount(outOfPocketActEditForm.getCvAmount());
        }
        if(outOfPocketActEditForm.getDate() != null) {
            outOfPocketAct.setDate(outOfPocketActEditForm.getDate().getCalendar());
        } else {
            outOfPocketAct.setDate(null);
        }
        outOfPocketAct.setReference(outOfPocketActEditForm.getReference());
        outOfPocketAct.setIsSigned(outOfPocketActEditForm.getIsSigned());
        hs.save(outOfPocketAct);
    } else if(OutOfPocketActEditForm.Mode.UPDATE.equals(outOfPocketActEditForm.getMode())) {
        OutOfPocketAct outOfPocketAct = (OutOfPocketAct)hs.get(OutOfPocketAct.class, new Long(outOfPocketActEditForm.getId()));
        OutOfPocketItem outOfPocketItem = outOfPocketAct.getOutOfPocketItem();
        Currency mainCurrency = CountryCurrency.getMainCurrency(outOfPocketItem.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry());
        outOfPocketAct.setAmount(outOfPocketActEditForm.getAmount());
        if(! mainCurrency.getId().equals(outOfPocketItem.getOutOfPocketActCurrency().getId())) {
            outOfPocketAct.setCvAmount(outOfPocketActEditForm.getCvAmount());
        }
        if(outOfPocketActEditForm.getDate() != null) {
            outOfPocketAct.setDate(outOfPocketActEditForm.getDate().getCalendar());
        } else {
            outOfPocketAct.setDate(null);
        }
        outOfPocketAct.setReference(outOfPocketActEditForm.getReference());
        outOfPocketAct.setIsSigned(outOfPocketActEditForm.getIsSigned());        
        hs.save(outOfPocketAct);
    }
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteOutOfPocketAct".equals(command)) {
    OutOfPocketAct outOfPocketAct = (OutOfPocketAct)hs.get(OutOfPocketAct.class, new Long(request.getParameter("id")));
    hs.delete(outOfPocketAct);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkOutOfPocketActDependencies".equals(command)) {
    OutOfPocketAct outOfPocketAct = (OutOfPocketAct)hs.get(OutOfPocketAct.class, new Long(request.getParameter("id")));
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
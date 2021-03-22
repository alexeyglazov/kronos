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
Module module = Module.getByName("Admin");

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

if("saveISOCountry".equals(command)) {
    ISOCountryEditForm isoCountryEditForm = ISOCountryEditForm.getFromJson(request.getParameter("isoCountryEditForm"));

        if(ISOCountryEditForm.Mode.CREATE.equals(isoCountryEditForm.getMode())) {
            if(ISOCountry.getByName(isoCountryEditForm.getName()) != null) {
                %>{"status": "FAIL", "comment": "ISOCountry with the same name already exists"}<%
            } else {
                ISOCountry isoCountry = new ISOCountry();
                isoCountry.setName(isoCountryEditForm.getName());
                isoCountry.setAlpha2Code(isoCountryEditForm.getAlpha2Code());
                isoCountry.setAlpha3Code(isoCountryEditForm.getAlpha3Code());
                isoCountry.setNumericCode(isoCountryEditForm.getNumericCode());
                hs.save(isoCountry);
                %>
                {
                "status": "OK"
                }
                <%
            }
        } else if(ISOCountryEditForm.Mode.UPDATE.equals(isoCountryEditForm.getMode())) {
            ISOCountry isoCountry = (ISOCountry)hs.get(ISOCountry.class, new Long(isoCountryEditForm.getId()));
            Integer sameNameISOCountrysCount = 0;
            ISOCountry isoCountryTmp = ISOCountry.getByName(isoCountryEditForm.getName());
            if(isoCountryTmp != null && isoCountryTmp.getId() != isoCountry.getId()) {
                sameNameISOCountrysCount++;
            }
            if(sameNameISOCountrysCount > 0) {
                %>{"status": "FAIL", "comment": "ISOCountry with the same Name already exists"}<%
            } else {
                isoCountry.setName(isoCountryEditForm.getName());
                isoCountry.setAlpha2Code(isoCountryEditForm.getAlpha2Code());
                isoCountry.setAlpha3Code(isoCountryEditForm.getAlpha3Code());
                isoCountry.setNumericCode(isoCountryEditForm.getNumericCode());
                hs.save(isoCountry);
                %>
                {
                "status": "OK"
                }
                <%
            }
        }
} else if("deleteISOCountry".equals(command)) {
    ISOCountry isoCountry = (ISOCountry)hs.get(ISOCountry.class, new Long(request.getParameter("id")));
    hs.delete(isoCountry);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkISOCountryDependencies".equals(command)) {
    ISOCountry isoCountry = (ISOCountry)hs.get(ISOCountry.class, new Long(request.getParameter("id")));
    %>{
    "status": "OK",
    "clients": <%=Client.getAllByCountry(isoCountry).size() %>
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
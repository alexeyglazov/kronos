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

if("saveCountry".equals(command)) {
    CountryEditForm countryEditForm = CountryEditForm.getFromJson(request.getParameter("countryEditForm"));

        if(CountryEditForm.Mode.CREATE.equals(countryEditForm.getMode())) {
            Integer sameNameCountriesCount = Country.getByName(countryEditForm.getName()).size();
            if(sameNameCountriesCount > 0) {
                %>{"status": "FAIL", "comment": "Country with the same name already exists"}<%
            } else {
                Country country = new Country();
                country.setName(countryEditForm.getName());
                country.setDescription(countryEditForm.getDescription());
                hs.save(country);
                %>
                {
                "status": "OK"
                }
                <%
            }
        } else if(CountryEditForm.Mode.UPDATE.equals(countryEditForm.getMode())) {
            Country country = (Country)hs.get(Country.class, new Long(countryEditForm.getId()));
            Integer sameNameCountriesCount = 0;
            for(Country countryTmp : Country.getByName(countryEditForm.getName())) {
                if(countryTmp.getId() != country.getId()) {
                    sameNameCountriesCount++;
                }
            }
            if(sameNameCountriesCount > 0) {
                %>{"status": "FAIL", "comment": "Country with the same Name already exists"}<%
            } else {
                country.setName(countryEditForm.getName());
                country.setDescription(countryEditForm.getDescription());
                hs.save(country);
                %>
                {
                "status": "OK"
                }
                <%
            }
        }
} else if("deleteCountry".equals(command)) {
    Country country = (Country)hs.get(Country.class, new Long(request.getParameter("id")));
    hs.delete(country);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkCountryDependencies".equals(command)) {
    Country country = (Country)hs.get(Country.class, new Long(request.getParameter("id")));
    %>{
    "status": "OK",
    "offices": <%=country.getOffices().size() %>
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
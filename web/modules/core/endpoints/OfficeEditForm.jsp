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


if("saveOffice".equals(command)) {
    OfficeEditForm officeEditForm = OfficeEditForm.getFromJson(request.getParameter("officeEditForm"));
    if(OfficeEditForm.Mode.CREATE.equals(officeEditForm.getMode())) {
        Country country = (Country)hs.get(Country.class, new Long(officeEditForm.getCountryId()));
        Integer sameNameOfficesCount = Office.getByName(officeEditForm.getName(), country).size();
        Integer sameCodeNameOfficesCount = Office.getByCodeName(officeEditForm.getCodeName(), country).size();
        if(sameNameOfficesCount > 0) {
            %>{"status": "FAIL", "comment": "Office with the same Name already exists"}<%
        } else if(sameCodeNameOfficesCount > 0) {
            %>{"status": "FAIL", "comment": "Office with the same Code Name already exists"}<%
        } else {
            Office office = new Office();
            office.setCountry(country);
            office.setName(officeEditForm.getName());
            office.setCodeName(officeEditForm.getCodeName());
            office.setDescription(officeEditForm.getDescription());
            office.setIsActive(officeEditForm.getIsActive());
            hs.save(office);
            %>
            {
            "status": "OK"
            }
            <%
        }
    } else if(OfficeEditForm.Mode.UPDATE.equals(officeEditForm.getMode())) {
        Office office = (Office)hs.get(Office.class, new Long(officeEditForm.getId()));
        Integer sameNameOfficesCount = 0;
        Integer sameCodeNameOfficesCount = 0;
        for(Office officeTmp : Office.getByName(officeEditForm.getName(), office.getCountry())) {
            if(officeTmp.getId() != office.getId()) {
                sameNameOfficesCount++;
            }
        }
        for(Office officeTmp : Office.getByCodeName(officeEditForm.getCodeName(), office.getCountry())) {
            if(officeTmp.getId() != office.getId()) {
                sameCodeNameOfficesCount++;
            }
        }
        if(sameNameOfficesCount > 0) {
            %>{"status": "FAIL", "comment": "Office with the same Name already exists"}<%
        } else if(sameCodeNameOfficesCount > 0) {
            %>{"status": "FAIL", "comment": "Office with the same Code Name already exists"}<%
        } else {
            office.setName(officeEditForm.getName());
            office.setCodeName(officeEditForm.getCodeName());
            office.setDescription(officeEditForm.getDescription());
            office.setIsActive(officeEditForm.getIsActive());
            hs.save(office);
        %>
        {
        "status": "OK"
        }
        <%
        }
    }
} else if("deleteOffice".equals(command)) {
    Office office = (Office)hs.get(Office.class, new Long(request.getParameter("id")));
    hs.delete(office);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkOfficeDependencies".equals(command)) {
    Office office = (Office)hs.get(Office.class, new Long(request.getParameter("id")));
    %>{
    "status": "OK",
    "departments": <%=office.getDepartments().size() %>
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
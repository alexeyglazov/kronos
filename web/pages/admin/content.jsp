<%-- 
    Document   : helper
    Created on : 30.03.2011, 14:05:19
    Author     : glazov
--%>
<%@page import="com.mazars.management.web.content.ContentManager"%>
<%@page import="java.util.Locale"%>
<%@page import="com.mazars.management.service.ConfigUtils"%>
<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    import="java.util.List"
    import="java.util.LinkedList"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="java.util.Map"
    import="java.util.HashMap"
%>
<%
request.setCharacterEncoding("UTF-8");

Boolean isAdminLoggedIn = (Boolean)session.getAttribute("isAdminLoggedIn");
if(! Boolean.TRUE.equals(isAdminLoggedIn)) {
    response.sendRedirect("./login.jsp");
    return;
}

Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
try {
    hs.beginTransaction();
    
Locale locale = new Locale("en");
String moduleBaseUrl = "/modules/core/";
Map<String, String> bodies = new HashMap<String, String>();

Map<String, String> pageProperties = new HashMap<String, String>();
pageProperties.put("title", "Content");
pageProperties.put("description", "Page is used to create Content Items in database");
pageProperties.put("keywords", "Content Items");

List<String> jsFiles = new LinkedList<String>();
//jsFiles.add("main.js");

request.setAttribute("isAdminLoggedIn", isAdminLoggedIn);
request.setAttribute("bodies", bodies);
request.setAttribute("pageProperties", pageProperties);
request.setAttribute("locale", locale);

request.setAttribute("jsFiles", jsFiles);
request.setAttribute("content", moduleBaseUrl + "elements/admin/content.jsp");
String frametemplate = moduleBaseUrl + "frametemplates/admin.jsp";
%>
<%
    String command = request.getParameter("command");
    if(command == null) {
        command = "start";
    }
    String displayStatus = null;
    String displayMessage = null;
    if("start".equals(command)) {
        displayStatus = "showForm";
    } else if("resetContentItems".equals(command)) {
        List<String> keys = new LinkedList<String>();
        Map<String, ContentItem> contentItems = new HashMap<String, ContentItem>();
        keys.add("0");
        contentItems.put("0", new ContentItem(null, "pages", "Mazars", "Root folder of all pages", null, null, true, true, true, true));
        keys.add("0_0");
        contentItems.put("0_0", new ContentItem(contentItems.get("0"), "en", "English", "English version", null, null, true, true, true, true));
        keys.add("0_0_0");
        contentItems.put("0_0_0", new ContentItem(contentItems.get("0_0"), "timesheet", "Timesheet", "Timesheet", "/pages/en/timesheet/fill/", Module.getByName("Timesheets"), false, true, true, true));
            keys.add("0_0_0_0");
            contentItems.put("0_0_0_0", new ContentItem(contentItems.get("0_0_0"), "fill", "Fill", "Fill", null, Module.getByName("Timesheets"), false, true, true, true));
            keys.add("0_0_0_1");
            contentItems.put("0_0_0_1", new ContentItem(contentItems.get("0_0_0"), "my_stats", "My stats", "My stats", null, Module.getByName("Timesheets"), false, true, true, true));
            keys.add("0_0_0_2");
            contentItems.put("0_0_0_2", new ContentItem(contentItems.get("0_0_0"), "my_career", "My career", "My career", null, Module.getByName("Timesheets"), false, true, true, true));
        keys.add("0_0_1");
        contentItems.put("0_0_1", new ContentItem(contentItems.get("0_0"), "clients", "Clients", "Clients", "/pages/en/clients/client_management/", Module.getByName("Clients"), false, false, true, true));
            keys.add("0_0_1_0");
            contentItems.put("0_0_1_0", new ContentItem(contentItems.get("0_0_1"), "client_management", "Client Management", "Client Management", null, Module.getByName("Clients"), false, false, true, true));
            keys.add("0_0_1_1");
            contentItems.put("0_0_1_1", new ContentItem(contentItems.get("0_0_1"), "client_activity", "Client Activity", "Client Activity", null, Module.getByName("Clients"), false, false, true, true));
            keys.add("0_0_1_2");
            contentItems.put("0_0_1_2", new ContentItem(contentItems.get("0_0_1"), "contact_management", "Contact Management", "Contact Management", null, Module.getByName("Clients"), false, false, true, true));
            keys.add("0_0_1_3");
            contentItems.put("0_0_1_3", new ContentItem(contentItems.get("0_0_1"), "mailer", "Mailer", "Mailer", null, Module.getByName("Clients"), false, false, true, true));
        keys.add("0_0_2");
        contentItems.put("0_0_2", new ContentItem(contentItems.get("0_0"), "code", "Code", "Code", null, Module.getByName("Code"), false, false, true, true));
            keys.add("0_0_2_0");
            contentItems.put("0_0_2_0", new ContentItem(contentItems.get("0_0_2"), "creation", "Creation", "Creation", null, Module.getByName("Code"), false, false, true, true));
            keys.add("0_0_2_1");
            contentItems.put("0_0_2_1", new ContentItem(contentItems.get("0_0_2"), "batch_creation", "Batch Creation", "Batch Creation", null, Module.getByName("Code"), false, false, true, true));
            keys.add("0_0_2_2");
            contentItems.put("0_0_2_2", new ContentItem(contentItems.get("0_0_2"), "code_management", "Code management", "Code management", null, Module.getByName("Code"), false, false, true, true));
            keys.add("0_0_2_3");
            contentItems.put("0_0_2_3", new ContentItem(contentItems.get("0_0_2"), "conflict_check", "Conflict check", "Conflict check", null, Module.getByName("Conflict Check"), false, false, true, true));
        keys.add("0_0_3");
        contentItems.put("0_0_3", new ContentItem(contentItems.get("0_0"), "financial_information", "Financial Information", "Financial Information", null, Module.getByName("Financial Information"), false, false, true, true));
            keys.add("0_0_3_0");
            contentItems.put("0_0_3_0", new ContentItem(contentItems.get("0_0_3"), "fees", "Fees", "Fees", null, Module.getByName("Financial Information"), false, false, true, true));
            keys.add("0_0_3_1");
            contentItems.put("0_0_3_1", new ContentItem(contentItems.get("0_0_3"), "upload", "Upload", "Upload", null, Module.getByName("Financial Information"), false, false, false, true));
        keys.add("0_0_4");
        contentItems.put("0_0_4", new ContentItem(contentItems.get("0_0"), "rights", "Rights", "Rights", null, Module.getByName("Rights"), false, false, true, true));
            keys.add("0_0_4_0");
            contentItems.put("0_0_4_0", new ContentItem(contentItems.get("0_0_4"), "profile_management", "Profile Management", "Profile Management", null, Module.getByName("Rights"), false, false, true, true));
            keys.add("0_0_4_1");
            contentItems.put("0_0_4_1", new ContentItem(contentItems.get("0_0_4"), "project_and_task_delegation", "Project & Task Delegation", "Project & Task Delegation", null, Module.getByName("Rights"), false, false, true, true));
            keys.add("0_0_4_2");
            contentItems.put("0_0_4_2", new ContentItem(contentItems.get("0_0_4"), "employee_to_project_assignment", "Employee to project assignment", "Employee to project assignment", null, Module.getByName("Rights"), false, false, true, true));
        keys.add("0_0_5");
        contentItems.put("0_0_5", new ContentItem(contentItems.get("0_0"), "reports", "Reports", "Reports", null, null, false, false, true, true));
            keys.add("0_0_5_0");
            contentItems.put("0_0_5_0", new ContentItem(contentItems.get("0_0_5"), "time_sheets", "Time Sheets", "Time Sheets", null, Module.getByName("Timesheets Report"), false, false, true, true));
                keys.add("0_0_5_0_0");
                contentItems.put("0_0_5_0_0", new ContentItem(contentItems.get("0_0_5_0"), "own_time_report", "Own Time Report", "Own Time Report", null, Module.getByName("Timesheets Report"), false, false, true, true));
                keys.add("0_0_5_0_1");
                contentItems.put("0_0_5_0_1", new ContentItem(contentItems.get("0_0_5_0"), "extract_time_sheet", "Extract Time Sheet", "Extract Time Sheet", null, Module.getByName("Timesheets Report"), false, false, true, true));
                keys.add("0_0_5_0_2");
                contentItems.put("0_0_5_0_2", new ContentItem(contentItems.get("0_0_5_0"), "productivity_and_completion", "Productivity and completion", "Productivity and completion", null, Module.getByName("Timesheets Report"), false, false, true, true));
                keys.add("0_0_5_0_3");
                contentItems.put("0_0_5_0_3", new ContentItem(contentItems.get("0_0_5_0"), "employees_for_projects", "Employees for Projects", "Employees for Projects", null, Module.getByName("Timesheets Report"), false, false, true, true));
                keys.add("0_0_5_0_4");
                contentItems.put("0_0_5_0_4", new ContentItem(contentItems.get("0_0_5_0"), "task", "Task", "Task", null, Module.getByName("Timesheets Report"), false, false, true, true));
                keys.add("0_0_5_0_5");
                contentItems.put("0_0_5_0_5", new ContentItem(contentItems.get("0_0_5_0"), "actual_timespent", "Actual timespent", "Actual timespent", null, Module.getByName("Timesheets Report"), false, false, true, true));
            keys.add("0_0_5_1");
            contentItems.put("0_0_5_1", new ContentItem(contentItems.get("0_0_5"), "clients", "Clients", "Clients", null, Module.getByName("Clients Report"), false, false, true, true));
                keys.add("0_0_5_1_0");
                contentItems.put("0_0_5_1_0", new ContentItem(contentItems.get("0_0_5_1"), "crm_clients", "CRM Clients", "CRM Clients", null, Module.getByName("Clients Report"), false, false, true, true));
                keys.add("0_0_5_1_1");
                contentItems.put("0_0_5_1_1", new ContentItem(contentItems.get("0_0_5_1"), "crm_clients_per_department", "CRM Clients per Department", "CRM Clients per Department", null, Module.getByName("Clients Report"), false, false, true, true));
                keys.add("0_0_5_1_2");
                contentItems.put("0_0_5_1_2", new ContentItem(contentItems.get("0_0_5_1"), "credentials", "Credentials", "Credentials", null, Module.getByName("Clients Report"), false, false, true, true));
                keys.add("0_0_5_1_3");
                contentItems.put("0_0_5_1_3", new ContentItem(contentItems.get("0_0_5_1"), "contacts", "Contacts", "Contacts", null, Module.getByName("Clients Report"), false, false, true, true));
            keys.add("0_0_5_2");
            contentItems.put("0_0_5_2", new ContentItem(contentItems.get("0_0_5"), "code", "Code", "Code", null, Module.getByName("Code Report"), false, false, true, true));
                keys.add("0_0_5_2_0");
                contentItems.put("0_0_5_2_0", new ContentItem(contentItems.get("0_0_5_2"), "code_detail", "Code Detail", "Code Detail", null, Module.getByName("Code Report"), false, false, true, true));
                keys.add("0_0_5_2_1");
                contentItems.put("0_0_5_2_1", new ContentItem(contentItems.get("0_0_5_2"), "code_list", "Code List", "Code List", null, Module.getByName("Code Report"), false, false, true, true));
                keys.add("0_0_5_2_2");
                contentItems.put("0_0_5_2_2", new ContentItem(contentItems.get("0_0_5_2"), "project_code_approvement", "Project code approvement", "Project code approvement", null, Module.getByName("Code Report"), false, false, true, true));
            keys.add("0_0_5_3");
            contentItems.put("0_0_5_3", new ContentItem(contentItems.get("0_0_5"), "financial_information", "Financial Information", "Financial Information", null, Module.getByName("Financial Information Report"), false, false, true, true));
                keys.add("0_0_5_3_0");
                contentItems.put("0_0_5_3_0", new ContentItem(contentItems.get("0_0_5_3"), "invoicing", "Invoicing", "Invoicing", null, Module.getByName("Financial Information Report"), false, false, true, true));
                keys.add("0_0_5_3_1");
                contentItems.put("0_0_5_3_1", new ContentItem(contentItems.get("0_0_5_3"), "profitability", "Profitability", "Profitability", null, Module.getByName("Financial Information Report"), false, false, true, true));
                keys.add("0_0_5_3_2");
                contentItems.put("0_0_5_3_2", new ContentItem(contentItems.get("0_0_5_3"), "manager", "Synthesis", "Synthesis", null, Module.getByName("Financial Information Report"), false, false, true, true));
                keys.add("0_0_5_3_3");
                contentItems.put("0_0_5_3_3", new ContentItem(contentItems.get("0_0_5_3"), "work_in_progress", "Work in progress", "Work in progress", null, Module.getByName("Financial Information Report"), false, false, true, true));
                keys.add("0_0_5_3_4");
                contentItems.put("0_0_5_3_4", new ContentItem(contentItems.get("0_0_5_3"), "productivity", "Productivity", "Productivity", null, Module.getByName("Financial Information Report"), false, false, true, true));
                keys.add("0_0_5_3_5");
                contentItems.put("0_0_5_3_5", new ContentItem(contentItems.get("0_0_5_3"), "invoice_request", "Invoice request", "Invoice request", null, Module.getByName("Financial Information Report"), false, false, true, true));
                keys.add("0_0_5_3_6");
                contentItems.put("0_0_5_3_6", new ContentItem(contentItems.get("0_0_5_3"), "invoice_document", "Invoice document", "Invoice document", null, Module.getByName("Financial Information Report"), false, false, true, true));
                keys.add("0_0_5_3_7");
                contentItems.put("0_0_5_3_7", new ContentItem(contentItems.get("0_0_5_3"), "client_activity", "Client activity", "Client activity", null, Module.getByName("Financial Information Report"), false, false, true, true));
                keys.add("0_0_5_3_8");
                contentItems.put("0_0_5_3_8", new ContentItem(contentItems.get("0_0_5_3"), "invoicing_process", "Invoicing process", "Invoicing process", null, Module.getByName("Financial Information Report"), false, false, true, true));
            keys.add("0_0_5_4");
            contentItems.put("0_0_5_4", new ContentItem(contentItems.get("0_0_5"), "rights", "Rights", "Rights", null, Module.getByName("Rights Report"), false, false, true, true));
            keys.add("0_0_5_5");
            contentItems.put("0_0_5_5", new ContentItem(contentItems.get("0_0_5"), "hr", "HR", "HR", null, Module.getByName("HR Report"), false, false, true, true));
                keys.add("0_0_5_5_0");
                contentItems.put("0_0_5_5_0", new ContentItem(contentItems.get("0_0_5_5"), "fte", "FTE", "FTE", null, Module.getByName("HR Report"), false, false, true, true));
                keys.add("0_0_5_5_1");
                contentItems.put("0_0_5_5_1", new ContentItem(contentItems.get("0_0_5_5"), "individual_performance", "Individual Performance", "Individual Performance", null, Module.getByName("HR Report"), false, false, true, true));
                keys.add("0_0_5_5_2");
                contentItems.put("0_0_5_5_2", new ContentItem(contentItems.get("0_0_5_5"), "training", "Training", "Training", null, Module.getByName("HR Report"), false, false, true, true));
                keys.add("0_0_5_5_3");
                contentItems.put("0_0_5_5_3", new ContentItem(contentItems.get("0_0_5_5"), "business_trip", "Business Trip", "Business Trip", null, Module.getByName("HR Report"), false, false, true, true));
                keys.add("0_0_5_5_4");
                contentItems.put("0_0_5_5_4", new ContentItem(contentItems.get("0_0_5_5"), "leaves", "Leaves", "Leaves", null, Module.getByName("HR Report"), false, false, true, true));
                keys.add("0_0_5_5_5");
                contentItems.put("0_0_5_5_5", new ContentItem(contentItems.get("0_0_5_5"), "hr_administrative", "HR Administrative", "HR Administrative", null, Module.getByName("HR Report"), false, false, true, true));
                keys.add("0_0_5_5_6");
                contentItems.put("0_0_5_5_6", new ContentItem(contentItems.get("0_0_5_5"), "out_of_office", "Out of office", "Out of office", null, Module.getByName("HR Report"), false, false, true, true));
            keys.add("0_0_5_6");
            contentItems.put("0_0_5_6", new ContentItem(contentItems.get("0_0_5"), "salary", "Salary", "Salary", null, Module.getByName("Salary Report"), false, false, true, false));
                keys.add("0_0_5_6_0");
                contentItems.put("0_0_5_6_0", new ContentItem(contentItems.get("0_0_5_6"), "employee_carreer_salary_control", "Employee Carreer Salary Control", "Employee Carreer Salary Control", null, Module.getByName("Salary Report"), false, false, true, false));
        keys.add("0_0_6");
        contentItems.put("0_0_6", new ContentItem(contentItems.get("0_0"), "hr", "HR", "HR", null, Module.getByName("HR"), false, false, true, true));
            keys.add("0_0_6_0");
            contentItems.put("0_0_6_0", new ContentItem(contentItems.get("0_0_6"), "employee_management", "Employee management", "Employee management", null, Module.getByName("HR"), false, false, true, true));
            keys.add("0_0_6_1");
            contentItems.put("0_0_6_1", new ContentItem(contentItems.get("0_0_6"), "annual_paid_leaves", "Annual paid leaves", "Annual paid leaves", null, Module.getByName("HR"), false, false, true, true));
            keys.add("0_0_6_2");
            contentItems.put("0_0_6_2", new ContentItem(contentItems.get("0_0_6"), "holidays_management", "Holidays Management", "Holidays Management", null, Module.getByName("HR"), false, false, true, true));

        keys.add("0_0_7");
        contentItems.put("0_0_7", new ContentItem(contentItems.get("0_0"), "admin", "Admin", "Admin", null, null, false, false, false, true));
            keys.add("0_0_7_0");
            contentItems.put("0_0_7_0", new ContentItem(contentItems.get("0_0_7"), "global_management", "Global Management", "Global Management", null, null, false, false, false, true));
            keys.add("0_0_7_1");
            contentItems.put("0_0_7_1", new ContentItem(contentItems.get("0_0_7"), "country_management", "Country Management", "Country Management", null, null, false, false, false, true));
            keys.add("0_0_7_2");
            contentItems.put("0_0_7_2", new ContentItem(contentItems.get("0_0_7"), "close_month", "Close Month", "Close Month", null, null, false, false, false, true));
            keys.add("0_0_7_3");
            contentItems.put("0_0_7_3", new ContentItem(contentItems.get("0_0_7"), "standard_rate", "Standard Rate", "Standard Rate", null, Module.getByName("Financial Information"), false, false, false, true));
            keys.add("0_0_7_4");
            contentItems.put("0_0_7_4", new ContentItem(contentItems.get("0_0_7"), "monthly_time_sheets", "Monthly Time Sheets", "Monthly Time Sheets", null, null, false, false, false, true));
            keys.add("0_0_7_5");
            contentItems.put("0_0_7_5", new ContentItem(contentItems.get("0_0_7"), "jobs_manager", "Jobs", "Background jobs", null, null, false, false, false, true));
            keys.add("0_0_7_6");
            contentItems.put("0_0_7_6", new ContentItem(contentItems.get("0_0_7"), "logs_viewer", "Logs", "Logs viewer", null, null, false, false, false, true));
            keys.add("0_0_7_7");
            contentItems.put("0_0_7_7", new ContentItem(contentItems.get("0_0_7"), "extra_services", "Extra services", "Extra services", null, null, false, false, false, true));
        keys.add("0_0_8");
        contentItems.put("0_0_8", new ContentItem(contentItems.get("0_0"), "planning_tool", "Planning Tool", "Planning Tool", "/pages/en/planning_tool/overall/", Module.getByName("Planning Read"), false, false, true, true));
            keys.add("0_0_8_0");
            contentItems.put("0_0_8_0", new ContentItem(contentItems.get("0_0_8"), "overall", "Overall", "Overall", null, Module.getByName("Planning Read"), false, false, true, true));
            keys.add("0_0_8_1");
            contentItems.put("0_0_8_1", new ContentItem(contentItems.get("0_0_8"), "client", "Client", "Client", null, Module.getByName("Planning Read"), false, false, true, true));
            keys.add("0_0_8_2");
            contentItems.put("0_0_8_2", new ContentItem(contentItems.get("0_0_8"), "employee", "Employee", "Employee", null, Module.getByName("Planning Read"), false, false, true, true));

        int deleted = ContentItem.deleteAll();
        for(String key : keys) {
            hs.save(contentItems.get(key));
        }
        displayMessage = "Deleted: " + deleted + ", created: " + contentItems.size();
        //request.setAttribute("configProperties", ConfigProperty.getAll());
        displayStatus = "successOnResetContentItems";
    } else if("updateCache".equals(command)) {
        try{
            ContentManager.init(application);
            displayMessage = "Cache has been updated";
            displayStatus = "successOnUpdatingCache";
        } catch(Exception e) {
            displayMessage = "Exception was thrown during cache init. " + e;
            displayStatus = "errorOnUpdatingCache";        
        }
    }
    
    
    hs.getTransaction().commit();
    
    request.setAttribute("displayStatus", displayStatus);               
    request.setAttribute("displayMessage", displayMessage);               
    %><jsp:include page="<%=frametemplate %>" flush="true" /><%
} catch (Exception ex) {
    hs.getTransaction().rollback();
    throw ex;
}
%>












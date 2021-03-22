<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="java.util.Map"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="java.util.List"
    import="java.util.LinkedList"
    import="java.util.Set"
    import="java.util.Locale"
    import="com.mazars.management.web.vo.*"
    import="com.mazars.management.web.comparators.PositionWithStandardPositionComparator"
    import="java.util.Collections"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.db.comparators.*"
    import="java.util.HashMap"
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

hs.refresh(currentUser);
if("getCountries".equals(command)) {
    List<CountryVO> countryVOs = new LinkedList<CountryVO>();
    List<Country> countries = Country.getAll();
    Collections.sort(countries, new CountryComparator());
    for(Country country : countries) {
        countryVOs.add(new CountryVO(country));
    }
    %>
    {
    "status": "OK",
    "countries": <% gson.toJson(countryVOs, out); %>
    }
    <%
} else if("getCommonTaskTypes".equals(command)) {
    List<TaskTypeVO> commonTaskTypeVOs = new LinkedList<TaskTypeVO>();
    List<TaskType> commonTaskTypes = TaskType.getCommonTaskTypes();
    Collections.sort(commonTaskTypes, new TaskTypeComparator());
    for(TaskType commonTaskType : commonTaskTypes) {
        commonTaskTypeVOs.add(new TaskTypeVO(commonTaskType));
    }
    %>
    {
    "status": "OK",
    "commonTaskTypes": <% gson.toJson(commonTaskTypeVOs, out); %>
    }
    <%
} else if("getStandardPositions".equals(command)) {
    List<StandardPositionVO> standardPositionVOs = new LinkedList<StandardPositionVO>();
    List<StandardPosition> standardPositions = StandardPosition.getAll();
    Collections.sort(standardPositions, new StandardPositionComparator());
    for(StandardPosition standardPosition : standardPositions) {
        standardPositionVOs.add(new StandardPositionVO(standardPosition));
    }
    %>
    {
    "status": "OK",
    "standardPositions": <% gson.toJson(standardPositionVOs, out); %>
    }
    <%
} else if("getModules".equals(command)) {
    List<ModuleVO> moduleVOs = new LinkedList<ModuleVO>();
    List<Module> modules = Module.getAll();
    Collections.sort(modules, new ModuleComparator());
    for(Module moduleTmp : modules) {
        moduleVOs.add(new ModuleVO(moduleTmp));
    }
    %>
    {
    "status": "OK",
    "modules": <% gson.toJson(moduleVOs, out); %>
    }
    <%
} else if("getISOCountries".equals(command)) {
    List<ISOCountry> isoCountries = ISOCountry.getAll();
    Collections.sort(isoCountries, new ISOCountryComparator());
    List<ISOCountryVO> isoCountryVOs = ISOCountryVO.getList(isoCountries);
    %>
    {
    "status": "OK",
    "isoCountries": <% gson.toJson(isoCountryVOs, out); %>
    }
    <%
} else if("getCurrencies".equals(command)) {
    List<Currency> currencies = Currency.getAll();
    Collections.sort(currencies, new CurrencyComparator());
    List<CurrencyVO> currencyVOs = CurrencyVO.getList(currencies);
    %>
    {
    "status": "OK",
    "currencies": <% gson.toJson(currencyVOs, out); %>
    }
    <%
} else if("getCountryInfo".equals(command)) {
    Country country = (Country)hs.get(Country.class, new Long(request.getParameter("id")));
    CountryVO countryVO = new CountryVO(country);
    List<OfficeVO> officeVOs = new LinkedList<OfficeVO>();
    List<CountryCurrencyVOH> countryCurrencyVOs = new LinkedList<CountryCurrencyVOH>();
    List<CurrencyVO> currencyVOs = new LinkedList<CurrencyVO>();
    List<Office> offices = new LinkedList<Office>(country.getOffices());
    Collections.sort(offices, new OfficeComparator());
    for(Office office : offices) {
        officeVOs.add(new OfficeVO(office));
    }
    List<CountryCurrency> countryCurrencies = new LinkedList<CountryCurrency>(country.getCountryCurrencies());
    Collections.sort(countryCurrencies, new CountryCurrencyComparator());
    for(CountryCurrency countryCurrency : countryCurrencies) {
        countryCurrencyVOs.add(new CountryCurrencyVOH(countryCurrency));
    }
    List<Currency> currencies = CountryCurrency.getCurrencies(country);
    Collections.sort(currencies, new CurrencyComparator());
    for(Currency currency : currencies) {
        currencyVOs.add(new CurrencyVO(currency));
    }
    %>
    {
        "status": "OK",
        "country": <% gson.toJson(countryVO, out); %>,
        "offices": <% gson.toJson(officeVOs, out); %>,
        "countryCurrencies": <% gson.toJson(countryCurrencyVOs, out); %>,
        "currencies": <% gson.toJson(currencyVOs, out); %>
    }
    <%
} else if("getStandardPositionInfo".equals(command)) {
    StandardPosition standardPosition = (StandardPosition)hs.get(StandardPosition.class, new Long(request.getParameter("id")));
    StandardPositionVO standardPositionVO = new StandardPositionVO(standardPosition);
    %>
    {
        "status": "OK",
        "standardPosition": <% gson.toJson(standardPositionVO, out); %>
    }<%
} else if("getModuleInfo".equals(command)) {
    Module tmpModule = (Module)hs.get(Module.class, new Long(request.getParameter("id")));
    ModuleVO moduleVO = new ModuleVO(tmpModule);
    %>
    {
        "status": "OK",
        "module": <% gson.toJson(moduleVO, out); %>
    }<%
} else if("getISOCountryInfo".equals(command)) {
    ISOCountry isoCountry = (ISOCountry)hs.get(ISOCountry.class, new Long(request.getParameter("id")));
    ISOCountryVO isoCountryVO = new ISOCountryVO(isoCountry);
    %>
    {
        "status": "OK",
        "isoCountry": <% gson.toJson(isoCountryVO, out); %>
    }<%
} else if("getCurrencyInfo".equals(command)) {
    Currency currency = (Currency)hs.get(Currency.class, new Long(request.getParameter("id")));
    CurrencyVO currencyVO = new CurrencyVO(currency);
    %>
    {
        "status": "OK",
        "currency": <% gson.toJson(currencyVO, out); %>
    }<%
} else if("getTaskTypeInfo".equals(command)) {
    TaskType taskType = (TaskType)hs.get(TaskType.class, new Long(request.getParameter("id")));
    TaskTypeVOH taskTypeVO = new TaskTypeVOH(taskType);
    List<TaskVO> taskVOs = new LinkedList<TaskVO>();
    List<Task> tasks = new LinkedList<Task>(taskType.getTasks());
    Collections.sort(tasks, new TaskComparator());
    for(Task task : tasks) {
        taskVOs.add(new TaskVO(task));
    }
    Subdepartment subdepartment = taskType.getSubdepartment();
    if(subdepartment != null) {
        Department department = subdepartment.getDepartment();
        Office office = department.getOffice();
        Country country = office.getCountry();
        %>
        {
            "status": "OK",
            "taskType": <% gson.toJson(taskTypeVO, out); %>,
            "tasks": <% gson.toJson(taskVOs, out); %>,
            "path": {
                "country": <% gson.toJson(new CountryVO(country), out); %>,
                "office": <% gson.toJson(new OfficeVO(office), out); %>,
                "department": <% gson.toJson(new DepartmentVO(department), out); %>,
                "subdepartment": <% gson.toJson(new SubdepartmentVO(subdepartment), out); %>
            }
        }<%
    } else {
        %>
        {
            "status": "OK",
            "taskType": <% gson.toJson(taskTypeVO, out); %>,
            "tasks": <% gson.toJson(taskVOs, out); %>,
            "path": null
        }<%
    }
} else if("getTaskInfo".equals(command)) {
    Task task = (Task)hs.get(Task.class, new Long(request.getParameter("id")));
    TaskVO taskVO = new TaskVO(task);
    TaskType taskType = task.getTaskType();
    Subdepartment subdepartment = taskType.getSubdepartment();
    if(subdepartment != null) {
        Department department = subdepartment.getDepartment();
        Office office = department.getOffice();
        Country country = office.getCountry();
        %>
        {
            "status": "OK",
            "task": <% gson.toJson(taskVO, out); %>,
            "path": {
                "country": <% gson.toJson(new CountryVO(country), out); %>,
                "office": <% gson.toJson(new OfficeVO(office), out); %>,
                "department": <% gson.toJson(new DepartmentVO(department), out); %>,
                "subdepartment": <% gson.toJson(new SubdepartmentVO(subdepartment), out); %>,
                "taskType": <% gson.toJson(new TaskTypeVO(taskType), out); %>
            }
        }<%
    } else {
        %>
        {
            "status": "OK",
            "task": <% gson.toJson(taskVO, out); %>,
            "path": null
        }<%
    }
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
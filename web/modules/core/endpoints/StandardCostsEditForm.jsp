<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.web.comparators.PositionWithStandardPositionComparator"%>
<%@page import="com.mazars.management.web.vo.PositionWithStandardPositionVO"%>
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
    import="java.util.Collections"
    import="com.mazars.management.db.comparators.*"
    import="java.util.Map"
    import="java.util.HashMap"
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
    Subdepartment subdepartment = null;
    if(request.getParameter("subdepartmentId") != null) {
        subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));
    } else if(request.getParameter("standardCostGroupId") != null) {
        StandardCostGroup standardCostGroup = (StandardCostGroup)hs.get(StandardCostGroup.class, new Long(request.getParameter("standardCostGroupId")));
        subdepartment = standardCostGroup.getSubdepartment();
    }
    Country country = currentUser.getCountry();
    List<CurrencyVO> currencyVOs = new LinkedList<CurrencyVO>();
    List<Currency> currencies = CountryCurrency.getCurrencies(country);
    Collections.sort(currencies, new CurrencyComparator());
    for(Currency currency : currencies) {
        currencyVOs.add(new CurrencyVO(currency));
    }
    List<PositionWithStandardPositionVO> positionWithStandardPositionVOs = new LinkedList<PositionWithStandardPositionVO>();
    for(Position position : subdepartment.getPositions()) {
        positionWithStandardPositionVOs.add(new PositionWithStandardPositionVO(position));
    }
    Collections.sort(positionWithStandardPositionVOs, new PositionWithStandardPositionComparator()); 
    %>
    {
        "status": "OK",
        "currencies": <% gson.toJson(currencyVOs, out); %>,
        "positions": <% gson.toJson(positionWithStandardPositionVOs, out); %>
    }
    <%
} else if("saveStandardCosts".equals(command)) {
    StandardCostsEditForm standardCostsEditForm = StandardCostsEditForm.getFromJson(request.getParameter("standardCostsEditForm"));
    if(StandardCostsEditForm.Mode.CREATE.equals(standardCostsEditForm.getMode())) {
          StandardCostGroup standardCostGroup = new StandardCostGroup();
          Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(standardCostsEditForm.getSubdepartmentId()));
          Currency currency = (Currency)hs.get(Currency.class, new Long(standardCostsEditForm.getCurrencyId()));
          standardCostGroup.setSubdepartment(subdepartment);
          standardCostGroup.setCurrency(currency);
          if(standardCostsEditForm.getStart() != null) {
            standardCostGroup.setStart(standardCostsEditForm.getStart().getCalendar());
          }
          if(standardCostsEditForm.getEnd() != null) {
            standardCostGroup.setEnd(standardCostsEditForm.getEnd().getCalendar() );
          } else {
            standardCostGroup.setEnd(null);
          }
          hs.save(standardCostGroup);
          for(StandardCostsEditForm.StandardCost formStandardCost : standardCostsEditForm.getStandardCosts()) {
            Position position = (Position)hs.get(Position.class, new Long(formStandardCost.getPositionId()));
            StandardCost standardCost = new StandardCost();
            standardCost.setAmount(formStandardCost.getAmount());
            standardCost.setPosition(position);
            standardCost.setStandardCostGroup(standardCostGroup);
            hs.save(standardCost);
          }
    } else if(StandardCostsEditForm.Mode.UPDATE.equals(standardCostsEditForm.getMode())) {
          StandardCostGroup standardCostGroup = (StandardCostGroup)hs.get(StandardCostGroup.class, new Long(standardCostsEditForm.getStandardCostGroupId()));
          //Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(standardCostsEditForm.getSubdepartmentId()));
          Currency currency = (Currency)hs.get(Currency.class, new Long(standardCostsEditForm.getCurrencyId()));
          //standardCostGroup.setSubdepartment(subdepartment);
          standardCostGroup.setCurrency(currency);
          if(standardCostsEditForm.getStart() != null) {
            standardCostGroup.setStart(standardCostsEditForm.getStart().getCalendar());
          }
          if(standardCostsEditForm.getEnd() != null) {
            standardCostGroup.setEnd(standardCostsEditForm.getEnd().getCalendar() );
          } else {
            standardCostGroup.setEnd(null);
          }
          hs.save(standardCostGroup);
          for(StandardCostsEditForm.StandardCost formStandardCost : standardCostsEditForm.getStandardCosts()) {
            Position position = (Position)hs.get(Position.class, new Long(formStandardCost.getPositionId()));
            StandardCost standardCost = null;
            if(formStandardCost.getId() == null) {
                standardCost = new StandardCost();
                standardCost.setStandardCostGroup(standardCostGroup);
            } else {
                standardCost = (StandardCost)hs.get(StandardCost.class, new Long(formStandardCost.getId()));
            }        
            standardCost.setAmount(formStandardCost.getAmount());
            standardCost.setPosition(position);
            //standardCost.setStandardCostGroup(standardCostGroup);
            hs.save(standardCost);
          }
    }
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteStandardCost".equals(command)) {
    StandardCostGroup standardCostGroup = (StandardCostGroup)hs.get(StandardCostGroup.class, new Long(request.getParameter("id")));
    for(StandardCost standardCost : standardCostGroup.getStandardCosts()) {
            hs.delete(standardCost);
    }
    hs.delete(standardCostGroup);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkStandardCostDependencies".equals(command)) {
    //StandardCostGroup standardCostGroup = (StandardCostGroup)hs.get(StandardCostGroup.class, new Long(request.getParameter("id")));
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
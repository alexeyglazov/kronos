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
    } else if(request.getParameter("standardSellingRateGroupId") != null) {
        StandardSellingRateGroup standardSellingRateGroup = (StandardSellingRateGroup)hs.get(StandardSellingRateGroup.class, new Long(request.getParameter("standardSellingRateGroupId")));
        subdepartment = standardSellingRateGroup.getSubdepartment();
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
} else if("saveStandardSellingRates".equals(command)) {
    StandardSellingRatesEditForm standardSellingRatesEditForm = StandardSellingRatesEditForm.getFromJson(request.getParameter("standardSellingRatesEditForm"));
    if(StandardSellingRatesEditForm.Mode.CREATE.equals(standardSellingRatesEditForm.getMode())) {
          StandardSellingRateGroup standardSellingRateGroup = new StandardSellingRateGroup();
          Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(standardSellingRatesEditForm.getSubdepartmentId()));
          Currency currency = (Currency)hs.get(Currency.class, new Long(standardSellingRatesEditForm.getCurrencyId()));
          standardSellingRateGroup.setSubdepartment(subdepartment);
          standardSellingRateGroup.setCurrency(currency);
          if(standardSellingRatesEditForm.getStart() != null) {
            standardSellingRateGroup.setStart(standardSellingRatesEditForm.getStart().getCalendar());
          }
          if(standardSellingRatesEditForm.getEnd() != null) {
            standardSellingRateGroup.setEnd(standardSellingRatesEditForm.getEnd().getCalendar() );
          } else {
            standardSellingRateGroup.setEnd(null);
          }
          hs.save(standardSellingRateGroup);
          for(StandardSellingRatesEditForm.StandardSellingRate formStandardSellingRate : standardSellingRatesEditForm.getStandardSellingRates()) {
            Position position = (Position)hs.get(Position.class, new Long(formStandardSellingRate.getPositionId()));
            StandardSellingRate standardSellingRate = new StandardSellingRate();
            standardSellingRate.setAmount(formStandardSellingRate.getAmount());
            standardSellingRate.setPosition(position);
            standardSellingRate.setStandardSellingRateGroup(standardSellingRateGroup);
            hs.save(standardSellingRate);
          }
    } else if(StandardSellingRatesEditForm.Mode.UPDATE.equals(standardSellingRatesEditForm.getMode())) {
          StandardSellingRateGroup standardSellingRateGroup = (StandardSellingRateGroup)hs.get(StandardSellingRateGroup.class, new Long(standardSellingRatesEditForm.getStandardSellingRateGroupId()));
          //Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(standardSellingRatesEditForm.getSubdepartmentId()));
          Currency currency = (Currency)hs.get(Currency.class, new Long(standardSellingRatesEditForm.getCurrencyId()));
          //standardSellingRateGroup.setSubdepartment(subdepartment);
          standardSellingRateGroup.setCurrency(currency);
          if(standardSellingRatesEditForm.getStart() != null) {
            standardSellingRateGroup.setStart(standardSellingRatesEditForm.getStart().getCalendar());
          }
          if(standardSellingRatesEditForm.getEnd() != null) {
            standardSellingRateGroup.setEnd(standardSellingRatesEditForm.getEnd().getCalendar() );
          } else {
            standardSellingRateGroup.setEnd(null);
          }
          hs.save(standardSellingRateGroup);
          for(StandardSellingRatesEditForm.StandardSellingRate formStandardSellingRate : standardSellingRatesEditForm.getStandardSellingRates()) {
            Position position = (Position)hs.get(Position.class, new Long(formStandardSellingRate.getPositionId()));
            StandardSellingRate standardSellingRate = null;
            if(formStandardSellingRate.getId() == null) {
                standardSellingRate = new StandardSellingRate();
                standardSellingRate.setStandardSellingRateGroup(standardSellingRateGroup);
            } else {
                standardSellingRate = (StandardSellingRate)hs.get(StandardSellingRate.class, new Long(formStandardSellingRate.getId()));
            }        
            standardSellingRate.setAmount(formStandardSellingRate.getAmount());
            standardSellingRate.setPosition(position);
            //standardSellingRate.setStandardSellingRateGroup(standardSellingRateGroup);
            hs.save(standardSellingRate);
          }
    }
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteStandardSellingRate".equals(command)) {
    StandardSellingRateGroup standardSellingRateGroup = (StandardSellingRateGroup)hs.get(StandardSellingRateGroup.class, new Long(request.getParameter("id")));
    for(StandardSellingRate standardSellingRate : standardSellingRateGroup.getStandardSellingRates()) {
            hs.delete(standardSellingRate);
    }
    hs.delete(standardSellingRateGroup);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkStandardSellingRateDependencies".equals(command)) {
    //StandardSellingRateGroup standardSellingRateGroup = (StandardSellingRateGroup)hs.get(StandardSellingRateGroup.class, new Long(request.getParameter("id")));
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
<%/*****************************************************************
* Gridnine AB http://www.gridnine.com
* Project: New wave
* Legal notice: (c) Gridnine AB. All rights reserved.
*****************************************************************/%><%@ page language="java" 
    contentType="text/html; charset=UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.mazars.management.web.content.ContentItem"
    import="com.mazars.management.web.content.ContentManager"
%><%
String moduleBaseUrl = "/modules/core/";
String imagesPath = "/galleries/images/";
Locale locale = (Locale)request.getAttribute("locale");
Employee currentUser = (Employee)request.getAttribute("currentUser");
ContentItem thisContentItem = ContentManager.getContentItem(request.getRequestURI());
List<ContentItem> path = ContentManager.getPath(thisContentItem);
ContentItem localeContentItem = path.get(1);
%>
<table id="topMenu" ><tr>
<%
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        hs.beginTransaction();
        int i = 0;
        for(ContentItem contentItem : localeContentItem.getChildren()) {
            if(ContentManager.isResourceAccessible(contentItem, currentUser)) {
%>
                <td <%=(thisContentItem.belongsTo(contentItem)) ? "class=\"highlight\"" : "" %> title="<%=contentItem.getDescription() %>" id="topMenu_<%=i %>">
                    <a href="<%=ContentManager.getNavigationUrl(contentItem) %>"><%=contentItem.getTitle() %></a>
                </td>
<%
            i++;
           }
	}
        hs.getTransaction().commit();
%>
</tr></table>
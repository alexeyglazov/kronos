<%@page import="com.mazars.management.web.content.ContentItem"%>
<%@page import="com.mazars.management.web.content.ContentManager"%>
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
%><%
String moduleBaseUrl = "/modules/core/";
String imagesPath = "/galleries/images/";
Locale locale = (Locale)request.getAttribute("locale");
Employee currentUser = (Employee)request.getAttribute("currentUser");

ContentItem thisContentItem = ContentManager.getContentItem(request.getRequestURI());
List<ContentItem> path = ContentManager.getPath(thisContentItem);
ContentItem topContentItem = path.get(2);
List<ContentItem> contentItems = topContentItem.getChildren();
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
hs.beginTransaction();
%>
	<div id="leftMenu">
                <div id="leftMenuHeader"><%=topContentItem.getTitle() %></div>
<%
	for(ContentItem contentItem2 : contentItems) {
            if(ContentManager.isResourceAccessible(contentItem2, currentUser)) {
                %>
                <div <%=thisContentItem.belongsTo(contentItem2) ? "class=\"menu2Current\"" : "class=\"menu2\"" %> title="<%=contentItem2.getDescription() %>">
                    <a href="<%=ContentManager.getNavigationUrl(contentItem2) %>"><%=contentItem2.getTitle() %></a>
                </div>
                <%
                for(ContentItem contentItem3 : contentItem2.getChildren()) {
                    if(ContentManager.isResourceAccessible(contentItem3, currentUser)) {
                    %>
                    <div <%=thisContentItem.belongsTo(contentItem3) ? "class=\"menu3Current\"" : "class=\"menu3\"" %> title="<%=contentItem3.getDescription() %>">
                            <a href="<%=ContentManager.getNavigationUrl(contentItem3) %>"><%=contentItem3.getTitle() %></a>
                    </div>
                    <%
                    }
                }
            }    
	}
%>
	</div>
<%
        hs.getTransaction().commit();
%>
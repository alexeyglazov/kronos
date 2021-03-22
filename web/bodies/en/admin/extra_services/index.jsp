<%-- 
    Document   : index.jsp
    Created on : 01.08.2012, 10:50:52
    Author     : glazov
--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<h3>List of services</h3>
<ul>
    <li>
    HDS Group project
    <div class="comment1">Export all opened project codes to HDS</div>
    <a href="<%=request.getContextPath() %>/modules/core/extra_services/hds_group_project.jsp" target="_blank">Go to</a>
    </li>
    <li>
    Annual paid leaves
    <div class="comment1">Show the list of annual paid leaves</div>
    <a href="<%=request.getContextPath() %>/modules/core/extra_services/annual_paid_leaves.jsp" target="_blank">Go to</a>
    </li>
    <li>
    Problematic leaves
    <div class="comment1">Show the list of problematic leaves</div>
    <a href="<%=request.getContextPath() %>/modules/core/extra_services/problematic_leaves.jsp" target="_blank">Go to</a>
    </li>
    <li>
    Planning
    <div class="comment1">Creates Excel file with info for planning in Retain</div>
    <a href="<%=request.getContextPath() %>/modules/core/extra_services/Planning.jsp" target="_blank">Go to</a>
    HR
    <div class="comment1">Creates a page with employees carreer</div>
    <a href="<%=request.getContextPath() %>/modules/core/extra_services/carreer.jsp" target="_blank">Go to</a>
</li>
</ul>

<%-- 
    Document   : index.jsp
    Created on : 01.08.2012, 10:50:52
    Author     : glazov
--%><%@page import="com.mazars.management.db.comparators.CurrencyComparator"%>
<%@page import="java.util.Collections"%>
<%@page import="java.util.Collection"%>
<%@ page language="java" 
    contentType="text/html; charset=UTF-8"
    import="java.util.List"
    import="java.util.Map"
    import="com.mazars.management.db.util.*"
    import="com.mazars.management.db.domain.*"
    import="org.hibernate.Session"
    import="java.text.SimpleDateFormat"
    import="com.mazars.management.load.excel.FISheet"
    import="com.mazars.management.web.content.ContentManager"
    import="com.mazars.management.web.content.ContentItem"
    import="jxl.Sheet"
%><%
String moduleBaseUrl = "/modules/core/";
Map<String, String> pageProperties = (Map<String, String>)request.getAttribute("pageProperties");
String displayStatus = (String)request.getAttribute("displayStatus");
%>
<table class="table2" style="width: 100%;">
    <tr class="header"><td><%=pageProperties.get("title") %></td></tr>
    <tr class="body">
    <td>
        <div id="formContainer">
<%
        if("showUploadForm".equals(displayStatus)) {
            List<Currency> currencies = (List<Currency>)request.getAttribute("currencies");
            Collections.sort(currencies, new CurrencyComparator());
%>
        <form method="post" enctype="multipart/form-data">
            Invoice, Payment, Act and Out-of-Pocket information can be uploaded here.<br />
            You can only upload an XLS file following this <a href="<%=ContentManager.link("/modules/core/files/financial_information_import_template.xls") %>" target="_blank">template</a><br />
            The template has two sheets - <em>Description</em> (formal rules for uploaded Excel file) and <em>Example</em> (possible content of various data types)<br />
            Possible currencies for this country:
            <ul>
            <% for(Currency currency : currencies) { %>
            <li><%=currency.getName() %> (<%=currency.getCode() %>)</li>
            <% } %>
            </ul>
        <table>    
            <tr><td>File to upload</td><td><input type="file" name="dataFile"></td></tr>
            <tr><td></td><td><input type="submit" value="Upload file"><input type="hidden" name="command" value="handleUpload"></td></tr>
        </table>
        </form>
<%
        } else if("badFileFormat".equals(displayStatus)) {
            %><div class="error">Bad file uploaded. XLS files are accepted only</div><%
        } else if("successOnUploading".equals(displayStatus)) {
            FISheet fiSheet = (FISheet)request.getAttribute("fiSheet");
                       %>    <script>
                           function validateSheetSelector() {
                                var sheetNumber = $('#fiUpload_sheetName').val();
                                if(sheetNumber == '') {
                                    doAlert('Error', 'Sheet name is not selected', null, null);
                                } else {
                                    $('#fiUpload_form').submit();
                                }
                           }
                       </script>
                    <form method="post" id="fiUpload_form">
                    <table>    
                    <tr><td>Sheet</td><td><select name="sheetNumber" id="fiUpload_sheetName">
                        <option value="">...</option>
                    <%
                    int count = 0;
                    for(Sheet sheet : fiSheet.getSheets()) {
                        %><option value="<%=count %>"><%=sheet.getName() %></option><%
                        count++;
                    }
                    %>
                    </select></td></tr>
                    <tr><td></td><td><input type="button" value="Read data" onClick="validateSheetSelector();"><input type="hidden" name="command" value="read"></td></tr>
                    </table>
                    </form>
           <%         
        } else if("exceptionOnUploading".equals(displayStatus)) {  
            Exception e = (Exception)request.getAttribute("exception");
           %><div class="error"><%=e %></div><%
        } else if("exceptionOnReading".equals(displayStatus)) {
            Exception e = (Exception)request.getAttribute("exception");
           %><div class="error"><%=e %></div><%
        } else if("errorOnReading".equals(displayStatus)) {
            String error = (String)request.getAttribute("error");
           %><div class="error"><%=error %></div><%                      
        } else if("errorsOnReading".equals(displayStatus)) {
                List<FISheet.Error> errors = (List<FISheet.Error>)request.getAttribute("errors");        
                %>
                <div class="error">Errors on reading</div>
                <table class="datagrid">
                <tr class="dgHeader"><td colspan="2">Errors</td></tr>     
                <tr class="dgHeader"><td>Row</td><td>Description</td></tr>    
                <%
                for(FISheet.Error error : errors) {
                    %><tr><td><%=error.getRowNumber() + 1 %></td><td><%=error.getDescription() %></td></tr><%
                }
                %>
                </table>
                <%
        } else if("successOnReading".equals(displayStatus)) {
            FISheet fiSheet = (FISheet)request.getAttribute("fiSheet"); 
                %>    
                    <form method="post">
                        Be sure that date is presented in dd.MM.yyyy or dd/MM/yyyy format<br />
                        For example 18.06.2012, 18.6.2012, 18.06.12, 18/06/2012, 18/6/2012, 18/06/12
                    <table>    
                    <tr><td></td><td><input type="submit" value="Parse data"></td></tr>
                    </table>
                    <input type="hidden" name="command" value="parse">
                    </form>
                    <table class="datagrid">
                        <tr class="dgHeader">
                            <td>Code</td>
                            <td>Amount</td>
                            <td>Date</td>
                            <td>Invoice to Issue Currency</td>
                            <td>Invoice Issued Currency</td>
                            <td>Payment Currency</td>
                            <td>Act Currency</td>
                            <td>CV amount</td>
                            <td>Is advance</td>
                            <td>Reference</td>
                            <td>Is signed</td>
                            <td>Is OOP</td>
                            <td>Type</td>
                        </tr>    
                    <%
                    for(FISheet.Row row : fiSheet.getRows()) {
                        %>
                        <tr>
                            <td><%=row.getCode() %></td>
                            <td><%=row.getAmount() %></td>
                            <td><%=row.getDate() %></td>
                            <td><%=row.getAdvanceCurrency() %></td>
                            <td><%=row.getInvoiceCurrency() %></td>
                            <td><%=row.getPaymentCurrency() %></td>
                            <td><%=row.getActCurrency() %></td>
                            <td><%=row.getCvAmount() %></td>
                            <td><%=row.getIsAdvance() %></td>
                            <td><%=row.getReference() %></td>
                            <td><%=row.getIsSigned() %></td>
                            <td><%=row.getIsOOP() %></td>
                            <td><%=row.getType() %></td>
                        </tr>
                        <%
                    }
                    %>
                    </table>
                    <%
        } else if("errorsOnParsing".equals(displayStatus)) {
            List<FISheet.Error> errors = (List<FISheet.Error>)request.getAttribute("errors"); 
            %>
            <div class="error">Errors on parsing</div>
            <table class="datagrid">
            <tr class="dgHeader"><td colspan="2">Errors</td></tr>     
            <tr class="dgHeader"><td>Row</td><td>Description</td></tr>    
            <%
            for(FISheet.Error error : errors) {
                %><tr><td><%=error.getRowNumber() + 1 %></td><td><%=error.getDescription() %></td></tr><%
            }
            %>
            </table>
            <% 
        } else if("successOnParsing".equals(displayStatus)) {
            FISheet fiSheet = (FISheet)request.getAttribute("fiSheet");
            SimpleDateFormat dateFormatter = (SimpleDateFormat)request.getAttribute("dateFormatter");
            %>
                <form method="post">
                <table>    
                <tr><td></td><td><input type="submit" value="Analyze data"><input type="hidden" name="command" value="analyze"></td></tr>
                </table>
                </form>
                <table class="datagrid">
                    <tr class="dgHeader">
                        <td>Code</td>
                        <td>Amount</td>
                        <td>Date</td>
                        <td>Invoice to Issue Currency</td>
                        <td>Invoice Issued Currency</td>
                        <td>Payment Currency</td>
                        <td>Act Currency</td>
                        <td>CV amount</td>
                        <td>Is advance</td>
                        <td>Reference</td>
                        <td>Is signed</td>
                        <td>Is OOP</td>
                        <td>Type</td>
                    </tr>    
                <%
                for(FISheet.ParsedRow row : fiSheet.getParsedRows()) {
                    %>
                    <tr>
                        <td><%=row.getProjectCode() != null ? row.getProjectCode().getCode() : "" %></td>
                        <td><%=row.getAmount() != null ? row.getAmount() : "" %></td>
                        <td><%=row.getDate() != null ? dateFormatter.format(row.getDate().getTime()) : "" %></td>
                        <td><%=row.getAdvanceCurrency() != null ? row.getAdvanceCurrency().getCode() : "" %></td>
                        <td><%=row.getInvoiceCurrency() != null ? row.getInvoiceCurrency().getCode() : "" %></td>
                        <td><%=row.getPaymentCurrency() != null ? row.getPaymentCurrency().getCode() : "" %></td>
                        <td><%=row.getActCurrency() != null ? row.getActCurrency().getCode() : "" %></td>
                        <td><%=row.getCvAmount() != null ? row.getCvAmount() : "" %></td>
                        <td><%=row.getIsAdvance() != null ? row.getIsAdvance() : "" %></td>
                        <td><%=row.getReference() != null ? row.getReference() : "" %></td>
                        <td><%=row.getIsSigned() != null ? row.getIsSigned() : "" %></td>
                        <td><%=row.getIsOOP() != null ? row.getIsOOP() : "" %></td>
                        <td><%=row.getType() != null ? row.getType() : "" %></td>
                    </tr>
                    <%
                }
                %>
                </table>
                <%
        } else if("successOnAnalyzingForSaving".equals(displayStatus)) {
            FISheet fiSheet = (FISheet)request.getAttribute("fiSheet");
            %>    
                <div class="success">Uploaded data have been parsed and analyzed. No inconsistencies found. Data can be saved.</div> 
                <form method="post">
                <table>    
                <tr><td></td><td><input type="submit" value="Save data"><input type="hidden" name="command" value="prepare"></td></tr>
                </table>
                </form>
            <%            
        } else if("successOnAnalyzing".equals(displayStatus)) {
            FISheet fiSheet = (FISheet)request.getAttribute("fiSheet");
            %>    
                <div class="success">Uploaded data have been parsed and analyzed. No inconsistencies found. Data can be saved.</div> 
                <form method="post">
                <table>    
                <tr><td></td><td><input type="submit" value="Prepare data"><input type="hidden" name="command" value="prepare"></td></tr>
                </table>
                </form>
            <%            
        } else if("errorsOnAnalyzing".equals(displayStatus)) {
            List<FISheet.Error> errors = (List<FISheet.Error>)request.getAttribute("errors"); 
            %>
            <div class="error">Errors on analyzing</div>
            <table class="datagrid">
            <tr class="dgHeader"><td colspan="2">Errors</td></tr>     
            <tr class="dgHeader"><td>Row</td><td>Description</td></tr>    
            <%
            for(FISheet.Error error : errors) {
                %><tr><td><%=error.getRowNumber() + 1 %></td><td><%=error.getDescription() %></td></tr><%
            }
            %>
            </table>
            <% 
        } else if("successOnPreparing".equals(displayStatus)) {
            FISheet fiSheet = (FISheet)request.getAttribute("fiSheet");
            SimpleDateFormat dateFormatter = (SimpleDateFormat)request.getAttribute("dateFormatter");
            %>    
                <form method="post">
                <table>    
                <tr><td></td><td><input type="submit" value="Save data"><input type="hidden" name="command" value="save"></td></tr>
                </table>
                </form>
                
                
                <table class="datagrid">
                    <tr class="dgHeader"><td colspan="5">Fees Items</td></tr>
                    <tr class="dgHeader">
                        <td>Code</td>
                        <td>Invoice to Issue Currency</td>
                        <td>Invoice Issued Currency</td>
                        <td>Payment Currency</td>
                        <td>Act Currency</td>
                    </tr>    
                <%
                for(Long projectCodeId : fiSheet.getFeesItems().keySet()) {
                    FeesItem feesItem = fiSheet.getFeesItems().get(projectCodeId);
                    %>
                    <tr>
                        <td><%=(feesItem.getProjectCode() != null ) ? feesItem.getProjectCode().getCode() : "-" %></td>
                        <td><%=(feesItem.getFeesAdvanceCurrency() != null ) ? feesItem.getFeesAdvanceCurrency().getCode() : "-" %></td>
                        <td><%=(feesItem.getFeesInvoiceCurrency() != null ) ? feesItem.getFeesInvoiceCurrency().getCode() : "-" %></td>
                        <td><%=(feesItem.getFeesPaymentCurrency() != null ) ? feesItem.getFeesPaymentCurrency().getCode() : "-" %></td>
                        <td><%=(feesItem.getFeesActCurrency() != null ) ? feesItem.getFeesActCurrency().getCode() : "-" %></td>
                    </tr>                    
                    <%
                }
                %>
                </table>
                
                                
                <table class="datagrid">
                    <tr class="dgHeader"><td colspan="4">OutOfPocket Items</td></tr>
                    <tr class="dgHeader">
                        <td>Code</td>
                        <td>Invoice Issued Currency</td>
                        <td>Payment Currency</td>
                        <td>Act Currency</td>
                    </tr>    
                <%
                for(Long projectCodeId : fiSheet.getOutOfPocketItems().keySet()) {
                    OutOfPocketItem outOfPocketItem = fiSheet.getOutOfPocketItems().get(projectCodeId);
                    %>
                    <tr>
                        <td><%=(outOfPocketItem.getProjectCode() != null ) ? outOfPocketItem.getProjectCode().getCode() : "-" %></td>
                        <td><%=(outOfPocketItem.getOutOfPocketInvoiceCurrency() != null ) ? outOfPocketItem.getOutOfPocketInvoiceCurrency().getCode() : "-" %></td>
                        <td><%=(outOfPocketItem.getOutOfPocketPaymentCurrency() != null ) ? outOfPocketItem.getOutOfPocketPaymentCurrency().getCode() : "-" %></td>
                        <td><%=(outOfPocketItem.getOutOfPocketActCurrency() != null ) ? outOfPocketItem.getOutOfPocketActCurrency().getCode() : "-" %></td>
                    </tr>                    
                    <%
                }
                %>
                </table>
                
                <table class="datagrid">
                    <tr class="dgHeader"><td colspan="4">Fees Invoices to issue</td></tr>
                    <tr class="dgHeader">
                        <td>Advance</td>
                        <td>Amount</td>
                        <td>Date</td>
                    </tr>    
                <%
                for(FeesAdvance feesAdvance : fiSheet.getFeesAdvances() ) {
                    %>
                    <tr>
                        <td><%=feesAdvance.getIsAdvance() %></td>
                        <td><%=feesAdvance.getAmount() %></td>
                        <td><%=feesAdvance.getDate() != null ? dateFormatter.format(feesAdvance.getDate().getTime()) : null %></td>
                    </tr>                    
                    <%
                }
                %>
                </table>
                
                <table class="datagrid">
                    <tr class="dgHeader"><td colspan="4">Fees Invoices issued</td></tr>
                    <tr class="dgHeader">
                        <td>Advance</td>
                        <td>Amount</td>
                        <td>Date</td>
                        <td>Reference</td>
                    </tr>    
                <%
                for(FeesInvoice feesInvoice : fiSheet.getFeesInvoices() ) {
                    %>
                    <tr>
                        <td><%=feesInvoice.getIsAdvance() %></td>
                        <td><%=feesInvoice.getAmount() %></td>
                        <td><%=feesInvoice.getDate() != null ? dateFormatter.format(feesInvoice.getDate().getTime()) : null %></td>
                        <td><%=feesInvoice.getReference() %></td>
                    </tr>                    
                    <%
                }
                %>
                </table>
                
                <table class="datagrid">
                    <tr class="dgHeader"><td colspan="3">Fees Payments</td></tr>
                    <tr class="dgHeader">
                        <td>Amount</td>
                        <td>Cv Amount</td>
                        <td>Date</td>
                    </tr>    
                <%
                for(FeesPayment feesPayment : fiSheet.getFeesPayments() ) {
                    %>
                    <tr>
                        <td><%=feesPayment.getAmount() %></td>
                        <td><%=feesPayment.getCvAmount() %></td>
                        <td><%=feesPayment.getDate() != null ? dateFormatter.format(feesPayment.getDate().getTime()) : null %></td>
                    </tr>                    
                    <%
                }
                %>
                </table>
                
                <table class="datagrid">
                    <tr class="dgHeader"><td colspan="5">Fees Acts</td></tr>
                    <tr class="dgHeader">
                        <td>Amount</td>
                        <td>Cv Amount</td>
                        <td>Date</td>
                        <td>Reference</td>
                        <td>Signed</td>
                    </tr>    
                <%
                for(FeesAct feesAct : fiSheet.getFeesActs() ) {
                    %>
                    <tr>
                        <td><%=feesAct.getAmount() %></td>
                        <td><%=feesAct.getCvAmount() %></td>
                        <td><%=feesAct.getDate() != null ? dateFormatter.format(feesAct.getDate().getTime()) : null %></td>
                        <td><%=feesAct.getReference() %></td>
                        <td><%=feesAct.getIsSigned() %></td>
                    </tr>                    
                    <%
                }
                %>
                </table>
                
                <table class="datagrid">
                    <tr class="dgHeader"><td colspan="3">OutOfPocket Invoices issued</td></tr>
                    <tr class="dgHeader">
                        <td>Amount</td>
                        <td>Date</td>
                        <td>Reference</td>
                    </tr>    
                <%
                for(OutOfPocketInvoice outOfPocketInvoice : fiSheet.getOutOfPocketInvoices() ) {
                    %>
                    <tr>
                        <td><%=outOfPocketInvoice.getAmount() %></td>
                        <td><%=outOfPocketInvoice.getDate() != null ? dateFormatter.format(outOfPocketInvoice.getDate().getTime()) : null %></td>
                        <td><%=outOfPocketInvoice.getReference() %></td>
                    </tr>                    
                    <%
                }
                %>
                </table>
                
                <table class="datagrid">
                    <tr class="dgHeader"><td colspan="4">OutOfPocket Payments</td></tr>
                    <tr class="dgHeader">
                        <td>Amount</td>
                        <td>Cv Amount</td>
                        <td>Date</td>
                    </tr>    
                <%
                for(OutOfPocketPayment outOfPocketPayment : fiSheet.getOutOfPocketPayments() ) {
                    %>
                    <tr>
                        <td><%=outOfPocketPayment.getAmount() %></td>
                        <td><%=outOfPocketPayment.getCvAmount() %></td>
                        <td><%=outOfPocketPayment.getDate() != null ? dateFormatter.format(outOfPocketPayment.getDate().getTime()) : null %></td>
                    </tr>                    
                    <%
                }
                %>
                </table>
                
                <table class="datagrid">
                    <tr class="dgHeader"><td colspan="5">OutOfPocket Acts</td></tr>
                    <tr class="dgHeader">
                        <td>Amount</td>
                        <td>Cv Amount</td>
                        <td>Date</td>
                        <td>Reference</td>
                        <td>Signed</td>
                    </tr>    
                <%
                for(OutOfPocketAct outOfPocketAct : fiSheet.getOutOfPocketActs() ) {
                    %>
                    <tr>
                        <td><%=outOfPocketAct.getAmount() %></td>
                        <td><%=outOfPocketAct.getCvAmount() %></td>
                        <td><%=outOfPocketAct.getDate() != null ? dateFormatter.format(outOfPocketAct.getDate().getTime()) : null %></td>
                        <td><%=outOfPocketAct.getReference() %></td>
                        <td><%=outOfPocketAct.getIsSigned() %></td>
                    </tr>                    
                    <%
                }
                %>
                </table>
            <%
        } else if("errorsOnPreparing".equals(displayStatus)) {
            List<FISheet.Error> errors = (List<FISheet.Error>)request.getAttribute("errors"); 
            %>
            <div class="error">Errors on preparing</div>
            <table class="datagrid">
            <tr class="dgHeader"><td colspan="2">Errors</td></tr>     
            <tr class="dgHeader"><td>Row</td><td>Description</td></tr>    
            <%
            for(FISheet.Error error : errors) {
                %><tr><td><%=error.getRowNumber() + 1 %></td><td><%=error.getDescription() %></td></tr><%
            }
            %>
            </table>
            <%
        } else if("successOnSaving".equals(displayStatus)) {
            String stamp = (String)request.getAttribute("stamp"); 
            %><div class="success">Data have been successfully saved</div><%
        } else if("exceptionOnSaving".equals(displayStatus)) {
            Exception e = (Exception)request.getAttribute("exception");
           %><div class="error"><%=e %></div><%
        }
%>            
        </div>
    </td>
    </tr>
</table>

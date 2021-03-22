var dataChanged = false;

var projectCodeForm;
var projectCodeBatchCreationForm;
var projectCodesList;
var timeSheet;
var ownTimeReport;
var trainingReport;
var fteReport;
var salaryReport;
var leavesReport;
var hrAdministrativeReport;
var timeSheetReport;
var credentialsReport;
var clientActivityReport;
var contactsReport;
var employeesForProjectsReport;
var monthlyTimeSheetReport;
var productivityAndCompletionReport;
var taskReport;
var actualTimespentReport;
var profitabilityReport;
var productivityReport;
var individualPerformanceReport;
var codeDetailReport;
var businessTripReport;
var outOfOfficeReport;
var codeListReport;
var workInProgressReport;
var invoicingReport;
var invoiceRequestReport;
var invoiceDocumentReport;
var invoicingReportReport;
var globalManagement;
var countryManagement;
var notificationManagement;
var clientManager;
var clientActivityManager;
var contactManager;
var delegationManager;
var employeeToProjectAssignmentManager;
var rightsManager;
var annualPaidLeavesManager;
var monthCloser;
var holidaysLayout;
var employeeManager;
var employeeSalaryManager;
var budgetManager;
var projectCodeApprovementManager;
var conflictCheckManager;
var loginForm;
var areaLoginForm;
var forgotPasswordForm;
var standardRatesManager;
var myStatsManager;
var crmClientReport;
var crmClientPerDepartmentReport;
var marginReport;
var managerReport;
var jobsManager;
var logsViewer;
var planningTool;
var employeePlanningViewer;
var clientPlanningViewer;
var mailoutManager;

var contentSizeChangedEventSubscribers = [];
var popupLayer = 0;

var blockUITimer = null;
$(function() {
    normalizeContentSize();
    $(window).resize(normalizeContentSize);
    $(window).bind("beforeunload", checkDataChanged);
    if(initializer != null) {
        initializer.call();
    }
    $(document).ajaxStart(function() {
        blockUI();
    });
    $(document).ajaxStop(function() {
        unblockUI();
    });
    
    
    var status = null;
    if(params != null) {
        if(params.status != null && params.status.length > 0) {
            status = params.status[0];
        } 
    }
    if(status == "NOT_LOGGED_IN") {
        $.sticky('You are not logged in or your session is expired');
    } else if(status == "NOT_AUTHORIZED") {
        $.sticky('You are not authorized to the system');
    } else if(status == "NOT_AUTHORIZED_TO_MODULE") {
        $.sticky('You are not authorized to use the requeried module');
    }
    
    var menu = new Menu(contentData, currentUri, "topMenu", 'topMenuContainer');
    menu.init();
});

function blockUI() {
    blockUITimer = setTimeout(function() {
            $.blockUI({message: '<h5><img src="' + imagePath + 'wait30trans.gif" /> Waiting for server response...</h5>'})
        },
        300
    );
}
function unblockUI() {
    clearTimeout(blockUITimer);
    setTimeout(function() {
            $.unblockUI();
        },
        500
    );
}
function normalizeContentSize() {
    this.windowHeight = $(window).height();
    this.windowWidth = $(window).width();
    this.contentHeight = windowHeight - 75;
    this.contentWidth = windowWidth - 6;
    $("#content").height(this.contentHeight);
    $("#content").width(this.contentWidth);
    for(var key in contentSizeChangedEventSubscribers) {
        var contentSizeChangedEventSubscriber = contentSizeChangedEventSubscribers[key];
        contentSizeChangedEventSubscriber["function"].call(contentSizeChangedEventSubscriber["context"]);
    }
}
function initMyStatsManager() {
    myStatsManager = new MyStatsManager("myStatsManager", "formContainer")
    myStatsManager.init();
}
function initProjectCodeForm() {
    projectCodeForm = new ProjectCodeForm("projectCodeForm", "formContainer");
    projectCodeForm.init();
}
function initProjectCodeBatchCreationForm() {
    projectCodeBatchCreationForm = new ProjectCodeBatchCreationForm("projectCodeBatchCreationForm", "formContainer");
    projectCodeBatchCreationForm.init();
}
function initProjectCodesList() {
    var code = null;
    if(params != null) {
        if(params.code != null && params.code.length > 0) {
            code = params.code[0];
        }
    }    
    projectCodesList = new ProjectCodesList({"code" : code}, "projectCodeList", "formContainer");
    projectCodesList.init();
    $(window).bind("resize", this.normalizeContentSize);
}
function initTimeSheet() {
    timeSheet = new TimeSheet("timeSheet", "formContainer");
    timeSheet.init();
}
function initOwnTimeReport() {
    ownTimeReport = new OwnTimeReport("ownTimeReport", "formContainer");
    ownTimeReport.init();
}
function initTrainingReport() {
    trainingReport = new TrainingReport("trainingReport", "formContainer");
    trainingReport.init();
}
function initFTEReport() {
    fteReport = new FTEReport("fteReport", "formContainer");
    fteReport.init();
}
function initSalaryReport() {
    salaryReport = new SalaryReport("salaryReport", "formContainer");
    salaryReport.init();
}
function initHRAdministrativeReport() {
    hrAdministrativeReport = new HRAdministrativeReport("hrAdministrativeReport", "formContainer");
    hrAdministrativeReport.init();
}
function initLeavesReport() {
    leavesReport = new LeavesReport("leavesReport", "formContainer");
    leavesReport.init();
}
function initTimeSheetReport() {
    timeSheetReport = new TimeSheetReport("timeSheetReport", "formContainer");
    timeSheetReport.init();
}
function initCredentialsReport() {
    credentialsReport = new CredentialsReport("credentialsReport", "formContainer");
    credentialsReport.init();
}
function initClientActivityReport() {
    clientActivityReport = new ClientActivityReport("clientActivityReport", "formContainer");
    clientActivityReport.init();
}
function initContactsReport() {
    contactsReport = new ContactsReport("contactsReport", "formContainer");
    contactsReport.init();
}
function initEmployeesForProjectsReport() {
    employeesForProjectsReport = new EmployeesForProjectsReport("employeesForProjectsReport", "formContainer");
    employeesForProjectsReport.init();
}
function initMonthlyTimeSheetReport() {
    monthlyTimeSheetReport = new MonthlyTimeSheetReport("monthlyTimeSheetReport", "formContainer");
    monthlyTimeSheetReport.init();
}
function initProductivityAndCompletionReport() {
    productivityAndCompletionReport = new ProductivityAndCompletionReport("productivityAndCompletionReport", "formContainer");
    productivityAndCompletionReport.init();
}
function initTaskReport() {
    taskReport = new TaskReport("taskReport", "formContainer");
    taskReport.init();
}
function initActualTimespentReport() {
    actualTimespentReport = new ActualTimespentReport("actualTimespentReport", "formContainer");
    actualTimespentReport.init();
}
function initProfitabilityReport() {
    profitabilityReport = new ProfitabilityReport("profitabilityReport", "formContainer");
    profitabilityReport.init();
}
function initProductivityReport() {
    productivityReport = new ProductivityReport("productivityReport", "formContainer");
    productivityReport.init();
}
function initIndividualPerformanceReport() {
    individualPerformanceReport = new IndividualPerformanceReport("individualPerformanceReport", "formContainer");
    individualPerformanceReport.init();
}
function initCodeDetailReport() {
    var code = null;
    if(params != null) {
        if(params.code != null && params.code.length > 0) {
            code = params.code[0];
        }
    }    
    codeDetailReport = new CodeDetailReport({"code" : code}, "codeDetailReport", "formContainer");
    codeDetailReport.init();
}
function initBusinessTripReport() {
    businessTripReport = new BusinessTripReport("businessTripReport", "formContainer");
    businessTripReport.init();
}
function initOutOfOfficeReport() {
    outOfOfficeReport = new OutOfOfficeReport("outOfOfficeReport", "formContainer");
    outOfOfficeReport.init();
}
function initCodeListReport() {
    codeListReport = new CodeListReport("codeListReport", "formContainer");
    codeListReport.init();
}
function initWorkInProgressReport() {
    workInProgressReport = new WorkInProgressReport("workInProgressReport", "formContainer");
    workInProgressReport.init();
}
function initInvoicingReport() {
    invoicingReport = new InvoicingReport("invoicingReport", "formContainer");
    invoicingReport.init();
}
function initInvoiceRequestReport() {
    invoiceRequestReport = new InvoiceRequestReport("invoiceRequestReport", "formContainer");
    invoiceRequestReport.init();
}
function initInvoiceDocumentReport() {
    invoiceDocumentReport = new InvoiceDocumentReport("invoiceDocumentReport", "formContainer");
    invoiceDocumentReport.init();
}
function initInvoicingProcessReport() {
    invoicingProcessReport = new InvoicingProcessReport("invoicingProcessReport", "formContainer");
    invoicingProcessReport.init();
}
function initGlobalManagement() {
    globalManagement = new GlobalManagement("globalManager", "formContainer");
    globalManagement.init();
}
function initCountryManagement() {
    countryManagement = new CountryManagement("countryManager", "formContainer");
    countryManagement.init();
}
function initNotificationManagement() {
    notificationManagement = new NotificationManagement("notificationManager", "formContainer");
    notificationManagement.init();
}
function initClientManager() {
    clientManager = new CRM("clientManager", "formContainer");
    clientManager.init();
}
function initClientActivityManager() {
    clientActivityManager = new ClientActivityManager("clientActivityManager", "formContainer");
    clientActivityManager.init();
}
function initContactManager() {
    contactManager = new ContactManager("contactManager", "formContainer");
    contactManager.init();
}
function initDelegationManager() {
    delegationManager = new DelegationManager("delegationManager", "formContainer");
    delegationManager.init();
}
function initEmployeeToProjectAssignmentManager() {
    var code = null;
    if(params != null) {
        if(params.code != null && params.code.length > 0) {
            code = params.code[0];
        }
    }    
    employeeToProjectAssignmentManager = new EmployeeToProjectAssignmentManager({"code" : code}, "employeeToProjectAssignmentManager", "formContainer");
    employeeToProjectAssignmentManager.init();
}
function initRights() {
    rightsManager = new RightsManager("rightsManager", "formContainer");
    rightsManager.init();
}
function initAnnualPaidLeavesManager() {
    annualPaidLeavesManager = new AnnualPaidLeavesManager("annualPaidLeavesManager", "formContainer");
    annualPaidLeavesManager.init();
}
function initMonthCloser() {
    monthCloser = new MonthCloser("monthCloser", "formContainer");
    monthCloser.init();
}
function initHolidaysLayout() {
    holidaysLayout = new HolidaysLayout("holidaysLayout", "formContainer");
    holidaysLayout.init();
}
function initEmployeeManager() {
    employeeManager = new EmployeeManager("employeeManager", "formContainer");
    employeeManager.init();
    $(window).bind("resize", this.normalizeContentSize);
}
function initMyCareerViewer() {
    myCareerViewer = new MyCareerViewer("myCareerViewer", "formContainer");
    myCareerViewer.init();
}
function initEmployeeSalaryManager() {
    employeeSalaryManager = new EmployeeSalaryManager("employeeSalaryManager", "formContainer");
    employeeSalaryManager.init();
    $(window).bind("resize", this.normalizeContentSize);
}
function initBudgetManager() {
    var code = null;
    if(params != null) {
        if(params.code != null && params.code.length > 0) {
            code = params.code[0];
        }
    }    
    budgetManager = new BudgetManager({"code" : code}, "budgetManager", "formContainer");
    budgetManager.init();
}
function initProjectCodeApprovementManager() {
    var code = null;
    if(params != null) {
        if(params.code != null && params.code.length > 0) {
            code = params.code[0];
        }
    }    
    projectCodeApprovementManager = new ProjectCodeApprovementManager({"code" : code}, "projectCodeApprovementManager", "formContainer");
    projectCodeApprovementManager.init();
}
function initConflictCheckManager() {
    var code = null;
    if(params != null) {
        if(params.code != null && params.code.length > 0) {
            code = params.code[0];
        }
    }    
    conflictCheckManager = new ConflictCheckManager({"code" : code}, "conflictCheckManager", "formContainer");
    conflictCheckManager.init();
}
function initLoginForm() {

}
function initAreaLoginForm() {
    var areaId = getCookie("areaId");
    areaLoginForm = new AreaLoginForm({"login": "", "password": "", "areaId": areaId}, "areaLoginForm", "formContainer");
    areaLoginForm.init();
}
function initForgotPasswordForm() {
    forgotPasswordForm = new ForgotPasswordForm({"identifierType": null, "identifier": ""}, "forgotPasswordForm", "formContainer");
    forgotPasswordForm.init();
}
function initCRMClientReport() {
    crmClientReport = new CRMClientReport("crmClientReport", "formContainer");
    crmClientReport.init();
}
function initCRMClientPerDepartmentReport() {
    crmClientPerDepartmentReport = new CRMClientPerDepartmentReport("crmClientPerDepartmentReport", "formContainer");
    crmClientPerDepartmentReport.init();
}
function initMarginReport() {
    marginReport = new MarginReport("marginReport", "formContainer");
    marginReport.init();
}
function initManagerReport() {
    managerReport = new ManagerReport("managerReport", "formContainer");
    managerReport.init();
}
function initSecretKeyForm() {
    var secretKey = null;
    var userName = null;
    if(params != null) {
        if(params.secretKey != null && params.secretKey.length > 0) {
            secretKey = params.secretKey[0];
        }
        if(params.userName != null && params.userName.length > 0) {
            userName = params.userName[0];
        }
    }
    secretKeyForm = new SecretKeyForm({"secretKey": secretKey, "userName": userName}, "secretKeyForm", "formContainer");
    secretKeyForm.init();
}
function initStandardRatesManager() {
    standardRatesManager = new StandardRatesManager("standardRatesManager", "formContainer");
    standardRatesManager.init();
}
function initJobsManager() {
    jobsManager = new JobsManager("jobsManager", "formContainer", "Admin");
    jobsManager.init();
}
function initLogsViewer() {
    logsViewer = new LogsViewer("logsViewer", "formContainer");
    logsViewer.init();
}
function initMailoutManager() {
    mailoutManager = new MailoutManager("mailoutManager", "formContainer");
    mailoutManager.init();
}
function initPlanningTool() {
    planningTool = new PlanningTool("planningTool", "formContainer");
    planningTool.init();
}
function initEmployeePlanningViewer() {
    var employeeId = null;
    if(params != null) {
        if(params.employeeId != null && params.employeeId.length > 0) {
            try {
                employeeId = parseInt(params.employeeId[0]);
            } catch(e) {}
        } 
    }
    employeePlanningViewer = new EmployeePlanningViewer(employeeId, "employeePlanningViewer", "formContainer");
    employeePlanningViewer.init();
}
function initClientPlanningViewer() {
    var formData = {};
    if(params != null) {
        if(params.clientId != null && params.clientId.length > 0) {
            try {
                formData.clientId = parseInt(params.clientId[0]);
            } catch(e) {}
        } 
        if(params.groupId != null && params.groupId.length > 0) {
            try {
                formData.groupId = parseInt(params.groupId[0]);
            } catch(e) {}
        }
        if(params.subdepartmentId != null && params.subdepartmentId.length > 0) {
            try {
                formData.subdepartmentId = parseInt(params.subdepartmentId[0]);
            } catch(e) {}
        }
    }
    clientPlanningViewer = new ClientPlanningViewer(formData, "clientPlanningViewer", "formContainer");
    clientPlanningViewer.init();
}

function getArrayFromMap(map) {
    var array = [];
    for(var key in map) {
        var value = map[key];
        array.push({
            "key": key,
            "value": value
        });
    }
    return array;
}
function getNextPopupLayer() {
    return popupLayer++;
}
function releasePopupLayer() {
    popupLayer--;
}
function getPopupHtmlContainer(layer) {
    return 'popup_' + layer;
}
function getNextPopupHtmlContainer() {
    return getPopupHtmlContainer(getNextPopupLayer());
}
function doAlert(title, message, okContext, okHandler) {
    showPopup(title, message, 300, 200, okContext, okHandler);
}
function doConfirm(title, message, okContext, okHandler, cancelContext, cancelHandler) {
    var popupContainer = getNextPopupHtmlContainer();
    $('#' + popupContainer).html(message);
    $('#' + popupContainer).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 300,
        height: 200,
        buttons: {
            Ok: function() {
                $(this).dialog( "close" );
                if(okContext != null && okHandler != null) {
                    okHandler.call(okContext);
                }
            },
            Cancel: function() {
                $(this).dialog( "close" );
                if(cancelContext != null && cancelHandler != null) {
                    cancelHandler.call(cancelContext);
                }
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    }
    );
}
function showPopup(title, message, width, height, okContext, okHandler) {
    var popupContainer = getNextPopupHtmlContainer();
    $('#' + popupContainer).html(message);
    $('#' + popupContainer).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: width == null ? 300 : width,
        height: height == null ? 200 : height,
        buttons: {
            Ok: function() {
                $(this).dialog( "close" );
                if(okContext != null && okHandler != null) {
                    okHandler.call(okContext);
                }
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    }
    );
}
function showErrors(errors) {
    var message = "";
    for(var key in errors) {
        message += errors[key] + "<br />";
    }
    doAlert("Error", message, null, null);
}
function getErrorHtml(message) {
    var html = '';
    html += '<div class="ui-widget">';
    html += '<div class="ui-state-error ui-corner-all" style="padding: 0 .7em;">';
    html += '<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>';
    html += message;
    html += '</p>';
    html += '</div>';
    html += '</div>';
    return html;
}
function showWarnings(warnings, okContext, okHandler) {
    var message = "";
    for(var key in warnings) {
        message += warnings[key] + "<br />";
    }
    message += "Procede with it?"
    doConfirm("Warning", message, okContext, okHandler, null, null);
}
function getJSON(object) {
 if(window.JSON) {
     return window.JSON.stringify(object);
 }
 if(object == null) {
  return "null";
 }
 if(object.constructor == Array) {
  var json = "[";
  var counter = 0;
  for(var key in object) {
   if(counter > 0) {
    json += ", ";
   }
   json += getJSON(object[key]);
   counter++;
  }
  json += "]"
  return json;
 } else if(object.constructor == String){
  return '"' + object.replace(new RegExp('\n','g'), '\\n').replace(new RegExp('"','g'), '\\"') + '"';
 } else if(object.constructor == Number){
  return object;
 } else if(object.constructor == Boolean){
  return object;
 } else {
  var json = "{";
  var counter = 0;
  for(var key in object) {
   if(counter > 0) {
    json += ", ";
   }
   json += "\"" + key + "\" : " + getJSON(object[key]);
   counter++;
  }
  json += "}"
  return json;
 }
}
function clone(object) {
    return jQuery.parseJSON(getJSON(object));
}
function getDays(year, month) {
    var days = new Array(31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    if(month != 1) {
        return days[month];
    }
    if(year % 400 == 0) {
        return 28;
    } else if(year % 4 == 0) {
        return 29;
    }
    return 28;
}
function isHolyday(year, month, day) {
    var date = new Date(year, month, day);
    return date.getDay() == 0 || date.getDay() == 6;
}
function isOfficialFreeday(list, year, month, day) {
    if(list == null || list.length == 0) {
        return isHolyday(year, month, day);
    } else {
        for(var key in list) {
            var freeday = list[key];
            if(freeday.year == year && freeday.month == month && freeday.dayOfMonth == day) {
                return true;
            }
        }
    }
    return false;
}
String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
}
String.prototype.getReducedToNumber = function() {
    if(this == null) {
        return null;
    }
    var result = "";
    var digitStopsAt = null;
    for(var j = this.length - 1; j >= 0 ; j--) {
        var c = this.charAt(j);
        if(! isNaN(parseInt(c))) {
            digitStopsAt = j;
            break;
        }
    }
    if(digitStopsAt != null) {
        var substr = this.substring(0, digitStopsAt + 1);
        for(var i = 0; i < substr.length; i++) {
            var c = substr.charAt(i);
            if(c == '.' || c == ',' || c == '-' || ! isNaN(parseInt(c))) {
                if(c == ',') {
                    if(substr.indexOf('.') == -1) {
                        result += '.';
                    }
                } else {
                    result += c;
                }
            }
        }
    }
    return result;
}
function size(object) {
    var count = 0;
    for(var key in object) {
        count++;
    }
    return count;
}

function isDateValid(text) {
    // TODO improve validation
    var tmp = text.split(".");
    if(tmp.length != 3) {
        return false;
    }
    return true;
}
function parseDateString(text) {
    var tmp = text.split(".");
    return new Date(tmp[2], tmp[1] - 1, tmp[0]);
}
function getYearMonthDateFromDateString(text) {
    if(text == null || jQuery.trim(text) == "") {
        return null;
    }
    var tmp = text.split(".");
    return {
        "year": parseInt(tmp[2]),
        "month": parseInt(tmp[1] - 1),
        "dayOfMonth": parseInt(tmp[0] - 0) // -0 is used to fix parse problem
    };
}
function getDaysInRange(start, end) {
    if(compareYearMonthDate(start, end) != -1) {
        return 0;
    }
    var startDate = new Date(start.year, start.month, start.dayOfMonth, 0, 0, 0, 0);
    var endDate = new Date(end.year, end.month, end.dayOfMonth, 0, 0, 0, 0);
    return Math.round((endDate.getTime() - startDate.getTime()) / (1000*60*60*24));
}
function sliceDaysByRange(days, start, end) {
    var startDate = new Date(start.year, start.month, start.dayOfMonth, 0, 0, 0, 0);
    var endDate = new Date(end.year, end.month, end.dayOfMonth, 0, 0, 0, 0);
    var result = [];
    for(var key in days) {
        var day = days[key];
        var dayTmp = new Date(day.year, day.month, day.dayOfMonth, 0, 0, 0, 0);
        if(dayTmp >=startDate && dayTmp <= endDate) {
            result.push(day);
        }
    }
    return result;
}

function getStringFromRange(start, end) {
    if(start == null && end == null) {
        return "";
    } else if(start == null && end != null) {
        return "..." + getStringFromYearMonthDate(end);
    } else if(start != null && end == null) {
        return getStringFromYearMonthDate(start) + "...";
    } else {
        return getStringFromYearMonthDate(start) + "..." + getStringFromYearMonthDate(end);
    }
}
function getStringFromYearMonthDate(obj) {
    if(obj == null) {
        return "";
    }
    var dateStr = "" + obj.dayOfMonth;
    if(dateStr.length == 1 ) {
        dateStr = '0' + dateStr;
    }
    var monthStr = "" + (obj.month + 1);
    if(monthStr.length == 1 ) {
        monthStr = '0' + monthStr;
    }
    return dateStr + '.' + monthStr + '.' + obj.year;
}
function getStringFromYearMonthDateTime(obj) {
    if(obj == null) {
        return "";
    }
    var hourStr = "" + obj.hour;
    if(hourStr.length == 1 ) {
        hourStr = '0' + hourStr;
    }
    var minuteStr = "" + obj.minute;
    if(minuteStr.length == 1 ) {
        minuteStr = '0' + minuteStr;
    }
    var secondStr = "" + obj.second;
    if(secondStr.length == 1 ) {
        secondStr = '0' + secondStr;
    }
    return getStringFromYearMonthDate(obj) + ' ' + hourStr + ':' + minuteStr + ':' + secondStr;
}
function getShiftedYearMonthDate(day, n) {
    var date = new Date(day.year, day.month, day.dayOfMonth, 12, 0, 0, 0);
    var shiftedDate = new Date(date.getTime() + n * 24 * 60 * 60 * 1000);
    return {
        "year": shiftedDate.getFullYear(),
        "month": shiftedDate.getMonth(),
        "dayOfMonth": shiftedDate.getDate()
    }
}
function compareYearMonthDate(o1, o2) {
    if(o1==null && o2==null) {
        return 0;
    }
    if(o1!=null && o2==null) {
        return 1;
    }
    if(o1==null && o2!=null) {
        return -1;
    }
    var date1 = new Date(o1.year, o1.month, o1.dayOfMonth, 0, 0, 0, 0);
    var date2 = new Date(o2.year, o2.month, o2.dayOfMonth, 0, 0, 0, 0);
    if(date1.getTime() <  date2.getTime()) {
        return -1;
    } else if(date1.getTime() >  date2.getTime()) {
        return 1;
    }
    return 0;
}
function compareYearMonthDateTime(o1, o2) {
    if(o1==null && o2==null) {
        return 0;
    }
    if(o1!=null && o2==null) {
        return 1;
    }
    if(o1==null && o2!=null) {
        return -1;
    }
    var date1 = new Date(o1.year, o1.month, o1.dayOfMonth, o1.hour, o1.minute, o1.second, 0);
    var date2 = new Date(o2.year, o2.month, o2.dayOfMonth, o2.hour, o2.minute, o2.second, 0);
    if(date1.getTime() <  date2.getTime()) {
        return -1;
    } else if(date1.getTime() >  date2.getTime()) {
        return 1;
    }
    return 0;
}
function isIntersected(start1, end1, start2, end2) {
    if(compareYearMonthDate(start1, start2) == 0 ) {
        return true;
    } else if(compareYearMonthDate(start1, start2) == -1){
        if(end1 == null) {
            return true;
        } else if(compareYearMonthDate(start2, end1) == 1) {
            return false;
        } else {
            return true;
        }
    } else {
        if(end2 == null) {
            return true;
        } else if(compareYearMonthDate(start1, end2) == 1) {
            return false;
        } else {
            return true;
        }
    }
    return false;
}
function getIntersection(start1, end1, start2, end2) {
    //start and end are defined
    var result = null;
    if(compareYearMonthDate(start1, start2) == 0 ) {
        if(compareYearMonthDate(end1, end2) == -1) {
            result = {start: start1, end: end1};
        } else {
            result = {start: start1, end: end2};           
        }
    } else if(compareYearMonthDate(start1, start2) == -1){
        if(compareYearMonthDate(start2, end1) == 1) {
            result = null;
        } else {
            if(compareYearMonthDate(end1, end2) == -1) {
                return {start: start2, end: end1};
            } else {
                return {start: start2, end: end2};
            }
        }
    } else {
        if(compareYearMonthDate(start1, end2) == 1) {
            return null;
        } else {
            if(compareYearMonthDate(end2, end1) == -1) {
                return {start: start1, end: end2};
            } else {
                return {start: start1, end: end1};
            }
        }
    }
    return result;
}
function getSubtraction(range1, range2) {
    //start and end are defined
    var result = [];
    if(compareYearMonthDate(range2.start, range1.end) > 0 || compareYearMonthDate(range2.end, range1.start) < 0) {
        // no intersection
        result.push({start: range1.start, end: range1.end});
    } else if(compareYearMonthDate(range2.start, range1.start) > 0 && compareYearMonthDate(range2.start, range1.end) <= 0 && compareYearMonthDate(range2.end, range1.end) >= 0){
        // side intersection
        result.push({start: range1.start, end: getShiftedYearMonthDate(range2.start, -1)});
    } else if(compareYearMonthDate(range2.end, range1.end) < 0 && compareYearMonthDate(range2.end, range1.start) >= 0 && compareYearMonthDate(range2.start, range1.start) <= 0){
        // side intersection
        result.push({start: getShiftedYearMonthDate(range2.end, 1), end: range1.end});
    } else if(compareYearMonthDate(range2.start, range1.start) > 0 && compareYearMonthDate(range2.end, range1.end) < 0) {
        //splitted intersection
        result.push({start: range1.start, end: getShiftedYearMonthDate(range2.start, -1)});
        result.push({start: getShiftedYearMonthDate(range2.end, 1), end: range1.end});
    }
    return result;
}
function getSubtractionOfRangeFromRanges(ranges, range) {
    var result = [];
    for(var key in ranges) {
        var range1 = ranges[key];
        var resultTmp = getSubtraction(range1, range);
        for(var key2 in resultTmp) {
            var rangeTmp = resultTmp[key2];
            result.push(rangeTmp);
        }
    } 
    return result;
}
function getSubtractionOfRangesFromRange(range, ranges) {
    var result = [];
    result.push(range);
    for(var key in ranges) {
        var rangeTmp = ranges[key];
        result = getSubtractionOfRangeFromRanges(result, rangeTmp);           
    }
    return result;
}
function CalendarVisualizer() {

}
CalendarVisualizer.prototype.getHtml = function(calendar) {
    if(calendar == null) {
        return null;
    } else {
        var dateStr = "" + calendar.dayOfMonth;
        if(dateStr.length == 1 ) {
            dateStr = '0' + dateStr;
        }
        var monthStr = "" + (calendar.month + 1);
        if(monthStr.length == 1 ) {
            monthStr = '0' + monthStr;
        }
        return dateStr + '.' + monthStr + '.' + calendar.year;
    }
}
var calendarVisualizer = new CalendarVisualizer();


function YearMonthDateTimeVisualizer() {

}
YearMonthDateTimeVisualizer.prototype.getHtml = function(time) {
    return getStringFromYearMonthDateTime(time);
}
var yearMonthDateTimeVisualizer = new YearMonthDateTimeVisualizer();

function MinutesAsHoursVisualizer() {

}
MinutesAsHoursVisualizer.prototype.getHtml = function(value) {
    if(value == null) {
        return null;
    } else {
        return value/60;
    }
}
var minutesAsHoursVisualizer = new MinutesAsHoursVisualizer();

function BooleanVisualizer() {

}
BooleanVisualizer.prototype.getHtml = function(value) {
    if(value == null) {
        return '';
    } else if(value) {
        return 'Yes';
    } else {
        return 'No';
    }
}
var booleanVisualizer = new BooleanVisualizer();

function DecimalVisualizer() {
}
DecimalVisualizer.prototype.getHtml = function(value) {
    if(value === null) {
        return "-"
    } else {
        return (Math.round(value * 100) / 100);
    }
}
var decimalVisualizer = new DecimalVisualizer();

function ThousandSeparatorVisualizer() {
}
ThousandSeparatorVisualizer.prototype.getHtml = function(value) {
    if(value === null) {
        return "-"
    }
    var v = (Math.round(value * 100) / 100);
    v = v.toString();
    // separate the whole number and the fraction if possible
    var a = v.split(".");
    var x = a[0]; // decimal
    var y = a[1]; // fraction
    var z = "";
    var l = x.length;
    while (l > 3){
        z = "," + x.substr(l-3, 3) + z;
        l -=3;
    }
    z = v.substr(0, l) + z;
    if(a.length>1) {
        z += "." + y;
    }
    return z;
}
var thousandSeparatorVisualizer = new ThousandSeparatorVisualizer();

function PercentVisualizer() {
}
PercentVisualizer.prototype.getHtml = function(value) {
    if(value === null || isNaN(value)) {
        return "-"
    } else {
        return (Math.round(value * 100 * 100) / 100) + "%";
    }
}
var percentVisualizer = new PercentVisualizer();

function getPercentHtml(value) {
    return percentVisualizer.getHtml(value);
}
function getRoundHtml(value) {
    return decimalVisualizer.getHtml(value);
}
function MemorySizeVisualizer() {
}
MemorySizeVisualizer.prototype.getHtml = function(value) {
    if(value === null || isNaN(value)) {
        return "-"
    } else if(value / 1024 <= 1) {
        return value + "B";
    } else if(value / (1024 * 1024) <= 1) {
        return (decimalVisualizer.getHtml(value / (1024))) + "KB";
    } else {
        return (decimalVisualizer.getHtml(value / (1024 * 1024))) + "MB";
    }
}
var memorySizeVisualizer = new MemorySizeVisualizer();

function getHightlightHtml(text) {
    var html = '';
    html += '<div class="ui-widget">';
    html += '<div class="ui-state-highlight ui-corner-all" style="margin-top: 20px; padding: 0 .7em;">';
    html += '<p><span class="ui-icon ui-icon-info" style="float: left; margin-right: .3em;"></span>';
    html += text;
    html += '</p></div>';
    html += '</div>';
    return html;
}
function getErrorHtml(text) {
    var html = '';
    html += '<div class="ui-widget">';
    html += '<div class="ui-state-error ui-corner-all" style="padding: 0 .7em;">';
    html += '<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>';
    html += text;
    html += '</p></div>';
    html += '</div>';
    return html;
}
function split( val ) {
    return val.split( /,\s*/ );
}
function extractLast( term ) {
    return split( term ).pop();
}
function checkDataChanged() {
    if(dataChanged) {
        if(document.all) {
            return "There are unsaved data in the form.";
        } else {
            return "You are about to leave this page.\nThere are unsaved data in the form.\nPress OK to leave it. Press Cancel to stay here."
        }
    } else {
        blockUI();
    }
}

function setCookie (name, value, expires, path, domain, secure) {
      document.cookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
}

function getCookie(name) {
	var cookie = " " + document.cookie;
	var search = " " + name + "=";
	var setStr = null;
	var offset = 0;
	var end = 0;
	if (cookie.length > 0) {
		offset = cookie.indexOf(search);
		if (offset != -1) {
			offset += search.length;
			end = cookie.indexOf(";", offset)
			if (end == -1) {
				end = cookie.length;
			}
			setStr = unescape(cookie.substring(offset, end));
		}
	}
	return(setStr);
}
function deleteCookie(name) {
    setCookie(name, null, {expires: -1})
}
function ajaxResultHandle(data, okContext, okHandler) {
    if(data == null || jQuery.trim(data) == "") {
        doAlert("Alert", "Empty response from server");
    } else {
        var result = null;
        try {
            result = jQuery.parseJSON(data);
            if(result.status == "OK") {
                okHandler.call(okContext, result);
            } else if(result.status == "NOT_LOGGED_IN" || result.status == "NOT_AUTHORIZED") {
                dataChanged = false;
                location.href = rootPath + "pages/en/login.jsp?status=" + result.status;
            } else if(result.status == "NOT_AUTHORIZED_TO_MODULE") {
                dataChanged = false;
                location.href = rootPath + "pages/en/index.jsp?status=" + result.status;
            } else if(result.status == "PASSWORD_MUST_BE_CHANGED") {
                dataChanged = false;
                location.href = rootPath + "pages/en/changePassword.jsp?status=" + result.status;
            } else {
                doAlert("Alert", "Failed to perform the request. " + result.comment, null, null);
            }
        } catch(e) {
            doAlert("Alert", "" + e);
        }
    }
    
    
}
function ajaxErrorHandle(jqXHR, textStatus, errorThrown, okContext, okHandler) {
    if(jqXHR.status != 0) {
        doAlert("Error", "Technical error occured when communicating with server. " + errorThrown, null, null);
    }
    if(okContext != null && okHandler != null) {
        okHandler.call(okContext);
    }
}
function getContrastColor(color) {
    var r, g, b;
    var contrastR, contrastG, contrastB;
    if(color.charAt(0) == '#') {
        r = parseInt(color.substring(1, 3).toLocaleLowerCase(), 16);
        g = parseInt(color.substring(3, 5).toLocaleLowerCase(), 16);
        b = parseInt(color.substring(5, 7).toLocaleLowerCase(), 16);
    } else {
        r = parseInt(color.substring(0, 2).toLocaleLowerCase(), 16);
        g = parseInt(color.substring(2, 4).toLocaleLowerCase(), 16);
        b = parseInt(color.substring(4, 6).toLocaleLowerCase(), 16);
    }
    if(r < 128) {
        contrastR = 'ff';
    } else {
        contrastR = '00';
    }
    if(g < 128) {
        contrastG = 'ff';
    } else {
        contrastG = '00';
    }
    if(b < 128) {
        contrastB = 'ff';
    } else {
        contrastB = '00';
    }
    return '#' + contrastR + contrastG + contrastB;
}
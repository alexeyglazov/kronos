/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function MailoutManager(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "MailoutManager.jsp"
    }
    this.contactManagerFilter = null;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.moduleName = 'Clients';
    this.loaded = {
        'mailouts' : [],
        'mailout' : null,
        'mailoutHistoryItems' : [],
        'mailoutRecipients': [],
        'mailoutTemplates': [],
        'mailoutTemplate': null
    };
    this.selected = {
        'mailoutId' : null,
        'mailoutTemplateId' : null,
        'mailoutRecipientIds' : []
    };
}
MailoutManager.prototype.init = function() {
    this.loadInitialContent();
}
MailoutManager.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.mailouts = result.mailouts;
            form.loaded.mailoutTemplates = result.mailoutTemplates;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MailoutManager.prototype.loadMailouts = function() {
    var form = this;
    var data = {};
    data.command = "getMailouts";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.mailouts = result.mailouts;
            form.loaded.mailoutTemplates = result.mailoutTemplates;
            form.updateMailoutPanelView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MailoutManager.prototype.loadMailoutTemplates = function() {
    var form = this;
    var data = {};
    data.command = "getMailoutTemplates";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.mailoutTemplates = result.mailoutTemplates;
            form.updateMailoutTemplatePanelView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MailoutManager.prototype.loadMailoutContent = function() {
    var form = this;
    var data = {};
    data.command = "getMailoutContent";
    data.id = getJSON(this.selected.mailoutId);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.mailout = result.mailout;
            form.loaded.mailoutRecipients = result.mailoutRecipients;
            form.loaded.mailoutHistoryItems = result.mailoutHistoryItems;
            form.updateMailoutView();
            form.updateMailoutRecipientsView();
            form.updateMailoutHistoryItemsView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MailoutManager.prototype.loadMailoutTemplateContent = function() {
    var form = this;
    var data = {};
    data.command = "getMailoutTemplateContent";
    data.id = getJSON(this.selected.mailoutTemplateId);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.mailoutTemplate = result.mailoutTemplate;
            form.updateMailoutTemplateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MailoutManager.prototype.doCloneMailout = function(mailoutId) {
    var form = this;
    var data = {};
    data.command = "cloneMailout";
    data.id = mailoutId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Mailout has been successfully cloned", form, form.init);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MailoutManager.prototype.addContacts = function(contactIds) {
    if(contactIds == null || contactIds.length == 0) {
        return;
    }
    var form = this;
    var data = {};
    data.command = "saveContacts";
    data.mailoutId = this.selected.mailoutId;
    data.contactIds = getJSON({"list": contactIds});
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.mailoutRecipients = result.mailoutRecipients;
            form.loaded.mailoutHistoryItems = result.mailoutHistoryItems;
            form.updateMailoutRecipientsView();
            form.updateMailoutHistoryItemsView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MailoutManager.prototype.addEmployees = function(employeeIds) {
    if(employeeIds == null || employeeIds.length == 0) {
        return;
    }
    var form = this;
    var data = {};
    data.command = "saveEmployees";
    data.mailoutId = this.selected.mailoutId;
    data.employeeIds = getJSON({"list": employeeIds});
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.mailoutRecipients = result.mailoutRecipients;
            form.loaded.mailoutHistoryItems = result.mailoutHistoryItems;
            form.updateMailoutRecipientsView();
            form.updateMailoutHistoryItemsView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MailoutManager.prototype.addEmails = function(emails) {
    if(emails == null || emails.length == 0) {
        return;
    }
    var form = this;
    var data = {};
    data.command = "saveEmails";
    data.mailoutId = this.selected.mailoutId;
    data.emails = getJSON({"list": emails});
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.mailoutRecipients = result.mailoutRecipients;
            form.loaded.mailoutHistoryItems = result.mailoutHistoryItems;
            form.updateMailoutRecipientsView();
            form.updateMailoutHistoryItemsView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MailoutManager.prototype.doDeleteMailoutRecipients = function() {
    if(this.selected.mailoutRecipientIds == null || this.selected.mailoutRecipientIds.length == 0) {
        return;
    }
    var form = this;
    var data = {};
    data.command = "deleteMailoutRecipients";
    data.mailoutId = this.selected.mailoutId;
    data.mailoutRecipientIds = getJSON({"list": this.selected.mailoutRecipientIds});
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.selected.mailoutRecipientIds = [];
            form.loaded.mailoutRecipients = result.mailoutRecipients;
            form.loaded.mailoutHistoryItems = result.mailoutHistoryItems;
            form.updateMailoutRecipientsView();
            form.updateMailoutHistoryItemsView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });    
}
MailoutManager.prototype.doSendMailout = function() {
    var form = this;
    var data = {};
    data.command = "sendMailout";
    data.mailoutId = this.selected.mailoutId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert('Susccess', 'Mailout has been launched as a background process', null, null);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });    
}
MailoutManager.prototype.doTestMailout = function() {
    var form = this;
    var data = {};
    data.command = "testMailout";
    data.mailoutId = this.selected.mailoutId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.mailout = result.mailout;
            form.loaded.mailoutHistoryItems = result.mailoutHistoryItems;
            doAlert('Susccess', 'Test email has been sent', null, null);
            form.updateMailoutView();
            form.updateMailoutHistoryItemsView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });    
}
MailoutManager.prototype.doSetTestedMailout = function() {
    var form = this;
    var data = {};
    data.command = "setTestedMailout";
    data.mailoutId = this.selected.mailoutId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.mailout = result.mailout;
            form.loaded.mailoutHistoryItems = result.mailoutHistoryItems;
            doAlert('Susccess', 'Test email has been set as tested', null, null);
            form.updateMailoutView();
            form.updateMailoutHistoryItemsView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });    
}
MailoutManager.prototype.doCloseMailout = function() {
    var form = this;
    var data = {};
    data.command = "closeMailout";
    data.mailoutId = this.selected.mailoutId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.mailout = result.mailout;
            form.loaded.mailoutHistoryItems = result.mailoutHistoryItems;
            doAlert('Susccess', 'Test email has been closed', null, null);
            form.updateMailoutView();
            form.updateMailoutHistoryItemsView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });    
}
MailoutManager.prototype.doSendToSelectedRecipients = function() {
    var form = this;
    var data = {};
    data.command = "sendToSelectedRecipients";
    data.mailoutId = this.selected.mailoutId;
    data.mailoutRecipientIds = getJSON({"list": this.selected.mailoutRecipientIds});
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert('Susccess', 'Mailout has been launched as a background process', null, null);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });        
}

MailoutManager.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeTabs();
    this.updateView();
    this.setHandlers();
}
MailoutManager.prototype.getHtml = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_tabs">';
    html += '<ul>';
    html += '<li><a href="#' + this.htmlId + '_mailoutPanel">Mailouts</a></li>';
    html += '<li><a href="#' + this.htmlId + '_mailoutTemplatePanel">Templates</a></li>';
    html += '<li><a href="#' + this.htmlId + '_filePanel">Files</a></li>';
    html += '</ul>';
    html += '<div id="' + this.htmlId + '_mailoutPanel">';
    html += '</div>';
    html += '<div id="' + this.htmlId + '_mailoutTemplatePanel">';
    html += '</div>';
    html += '<div id="' + this.htmlId + '_filePanel">';
    html += '</div>';
    html += '</div>';    
    return html;
}
MailoutManager.prototype.makeTabs = function() {
    $('#' + this.htmlId + '_tabs').tabs();
}
MailoutManager.prototype.setHandlers = function() {
    var form = this;
    //$('#' + this.htmlId + '_client').bind("change", function(event) {form.clientChangedHandle.call(form)});
}

MailoutManager.prototype.updateView = function() {
   this.updateMailoutPanelView();
   this.updateMailoutTemplatePanelView();
   this.updateFilePanelView();
}
MailoutManager.prototype.updateMailoutPanelView = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td id="' + this.htmlId + '_mailouts"></td>';
    html += '<td><div id="' + this.htmlId + '_mailout"></div><div id="' + this.htmlId + '_mailoutHistoryItems"></div></td>';
    html += '<td id="' + this.htmlId + '_mailoutRecipients"></td>';
    html += '</tr>';
    html += '</table>';
    $('#' + this.htmlId + '_mailoutPanel').html(html);
    this.updateMailoutsView();
    this.updateMailoutView();
    this.updateMailoutRecipientsView();
    this.updateMailoutHistoryItemsView();
}
MailoutManager.prototype.updateMailoutTemplatePanelView = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td id="' + this.htmlId + '_mailoutTemplates"></td><td id="' + this.htmlId + '_mailoutTemplate"></td></tr>';
    html += '</table>';
    $('#' + this.htmlId + '_mailoutTemplatePanel').html(html);
    this.updateMailoutTemplatesView();
    this.updateMailoutTemplateView();
}
MailoutManager.prototype.updateFilePanelView = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td id="' + this.htmlId + '_files"></td><td></td></tr>';
    html += '</table>';
    $('#' + this.htmlId + '_filePanel').html(html);
    this.updateFilesView();
}
MailoutManager.prototype.updateMailoutsView = function() {
    var html = '';
    html += '<button id="' + this.htmlId + '_addMailoutBtn">Add mailout</button><br /><br />';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Name</td><td>Created at</td></tr>';
    if(this.loaded.mailouts.length > 0) {
        for(var key in this.loaded.mailouts) {
            var mailout = this.loaded.mailouts[key];
            html += '<tr>';
            html += '<td><span class="link" id="' + this.htmlId + "_mailout_" + mailout.id + '">' + mailout.name + '</span></td>';
            html += '<td>' + yearMonthDateTimeVisualizer.getHtml(mailout.createdAt) + '</td>';
            html += '</tr>';
        }
    } else {
        html += '<tr><td colspan="2">No data</td></tr>';
    }
    html += '</table>';
    
    $('#' + this.htmlId + '_mailouts').html(html);
    var form = this;
    $('[id^="' + this.htmlId + '_mailout_"]').bind("click", function(event) {form.mailoutClickedHandle.call(form, event);});      
    
    $('#' + this.htmlId + '_addMailoutBtn')
      .button({
        icons: {
            primary: "ui-icon-plus"
        },
        text: true
        })
      .click(function( event ) {
        form.addMailout.call(form);
    });
}
MailoutManager.prototype.updateMailoutView = function() {
    var mailout = this.loaded.mailout
    var html = '';
    if(this.selected.mailoutId != null) {
        html += '<button id="' + this.htmlId + '_refreshMailoutBtn">Refresh</button>';
        html += '<button id="' + this.htmlId + '_editMailoutBtn">Edit</button>';
        html += '<button id="' + this.htmlId + '_editMailoutContentBtn">Edit content</button>';
        html += '<button id="' + this.htmlId + '_previewMailoutBtn">Preview</button><br />';
        html += '<button id="' + this.htmlId + '_cloneMailoutBtn">Clone</button>';
        html += '<button id="' + this.htmlId + '_deleteMailoutBtn">Delete</button>';
        html += '<button id="' + this.htmlId + '_testMailoutBtn">Test</button>';
        html += '<button id="' + this.htmlId + '_setTestedMailoutBtn">Set tested</button>';
        if(mailout.status == 'TESTED' || mailout.status == 'FINISHED') {
            html += '<button id="' + this.htmlId + '_sendMailoutBtn">Send</button>';
        }
        if(mailout.status == 'FINISHED') {
            html += '<button id="' + this.htmlId + '_closeMailoutBtn">Close</button>';
        }
        html += '<br /><br />';    
        html += '<table class="datagrid">';
        html += '<tr class="dgHeader"><td>Name</td><td>Created at</td></tr>';
        html += '<tr><td>Name</td><td>' + mailout.name + '</td></tr>';
        html += '<tr><td>Description</td><td>' + mailout.description + '</td></tr>';
        html += '<tr><td>Sender name</td><td>' + mailout.senderName + '</td></tr>';
        html += '<tr><td>Subject</td><td>' + mailout.subject + '</td></tr>';
        html += '<tr><td>TestTo</td><td>' + mailout.testTo + '</td></tr>';
        html += '<tr><td>ReplyTo</td><td>' + mailout.replyTo + '</td></tr>';
        html += '<tr><td>Part size</td><td>' + mailout.partSize + '</td></tr>';
        html += '<tr><td>Delay, mSec</td><td>' + mailout.delay + '</td></tr>';
        html += '<tr><td>DispositionNotificationTo</td><td>' + mailout.dispositionNotificationTo + '</td></tr>';
        html += '<tr><td>Status</td><td>' + mailout.status + '</td></tr>';
        html += '</table>';
    }
    $('#' + this.htmlId + '_mailout').html(html);

    var form = this;
    $('#' + this.htmlId + '_refreshMailoutBtn')
      .button({
        icons: {
            primary: "ui-icon-refresh"
        },
        text: false
        })
      .click(function( event ) {
        form.refreshMailout.call(form);
    });
    $('#' + this.htmlId + '_editMailoutBtn')
      .button({
        icons: {
            primary: "ui-icon-pencil"
        },
        text: true
        })
      .click(function( event ) {
        form.editMailout.call(form);
    });
    $('#' + this.htmlId + '_editMailoutContentBtn')
      .button({
        icons: {
            primary: "ui-icon-pencil"
        },
        text: true
        })
      .click(function( event ) {
        form.editMailoutContent.call(form);
    });
    $('#' + this.htmlId + '_previewMailoutBtn')
      .button({
        icons: {
            primary: "ui-icon-document"
        },
        text: true
        })
      .click(function( event ) {
        form.previewMailout.call(form);
    });
    $('#' + this.htmlId + '_cloneMailoutBtn')
      .button({
        icons: {
            primary: "ui-icon-plus"
        },
        text: true
        })
      .click(function( event ) {
        form.cloneMailout.call(form);
    });
    $('#' + this.htmlId + '_deleteMailoutBtn')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: true
        })
      .click(function( event ) {
        form.deleteMailout.call(form);
    });
    $('#' + this.htmlId + '_testMailoutBtn')
      .button({
        icons: {
            primary: "ui-icon-mail-open"
        },
        text: true
        })
      .click(function( event ) {
        form.testMailout.call(form);
    });
    $('#' + this.htmlId + '_setTestedMailoutBtn')
      .button({
        icons: {
            primary: "ui-icon-tag"
        },
        text: true
        })
      .click(function( event ) {
        form.setTestedMailout.call(form);
    });
    $('#' + this.htmlId + '_sendMailoutBtn')
      .button({
        icons: {
            primary: "ui-icon-mail-closed"
        },
        text: true
        })
      .click(function( event ) {
        form.sendMailout.call(form);
    });
    $('#' + this.htmlId + '_closeMailoutBtn')
      .button({
        icons: {
            primary: "ui-icon-locked"
        },
        text: true
        })
      .click(function( event ) {
        form.closeMailout.call(form);
    });    
}
MailoutManager.prototype.updateMailoutRecipientsView = function() {
    var html = '';
    if(this.selected.mailoutId != null) {
        html += '<button id="' + this.htmlId + '_addContactsBtn">Add contacts</button>';
        html += '<button id="' + this.htmlId + '_addEmployeesBtn">Add employees</button>';
        html += '<button id="' + this.htmlId + '_addEmailsBtn">Add free emails</button>';
        html += '<button id="' + this.htmlId + '_deleteMailoutRecipientsBtn' + '">Delete</button>';
        html += '<button id="' + this.htmlId + '_sendToSelectedRecipientsBtn' + '">Send to selected</button><br /><br />';
        html += '<table class="datagrid">';
        html += '<tr class="dgHeader"><td></td><td>E-mail</td><td>Status</td><td>Source</td><td>Comment</td></tr>';
        if(this.loaded.mailoutRecipients.length > 0) {
            for(var key in this.loaded.mailoutRecipients) {
                var mailoutRecipient = this.loaded.mailoutRecipients[key];
                html += '<tr>';
                html += '<td><input type="checkbox" id="' + this.htmlId + "_mailoutRecipientSelect_" + mailoutRecipient.id + '"></td>';
                html += '<td><span class="link" id="' + this.htmlId + "_mailoutRecipient_" + mailoutRecipient.id + '">' + mailoutRecipient.email + '</span></td>';
                html += '<td>' + mailoutRecipient.status + '</td>';
                html += '<td>' + mailoutRecipient.source + '</td>';
                html += '<td>' + mailoutRecipient.comment + '</td>';
                html += '</tr>';
            }
        } else {
            html += '<tr><td colspan="5">No data</td></tr>';
        }
        html += '</table>';
    }    
    $('#' + this.htmlId + '_mailoutRecipients').html(html);
    var form = this;
    $('[id^="' + this.htmlId + '_mailoutRecipient_"]').bind("click", function(event) {form.mailoutRecipientClickedHandle.call(form, event);});          
    $('[id^="' + this.htmlId + '_mailoutRecipientSelect_"]').bind("click", function(event) {form.mailoutRecipientSelectClickedHandle.call(form, event);});          

    $('#' + this.htmlId + '_deleteMailoutRecipientsBtn')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: true
        })
      .click(function( event ) {
        form.deleteMailoutRecipients.call(form);
    });

    $('#' + this.htmlId + '_addContactsBtn')
      .button({
        icons: {
            primary: "ui-icon-plus"
        },
        text: true
        })
      .click(function( event ) {
        form.addContactsHandle.call(form);
    });

    $('#' + this.htmlId + '_addEmployeesBtn')
      .button({
        icons: {
            primary: "ui-icon-plus"
        },
        text: true
        })
      .click(function( event ) {
        form.addEmployeesHandle.call(form);
    });

    $('#' + this.htmlId + '_addEmailsBtn')
      .button({
        icons: {
            primary: "ui-icon-plus"
        },
        text: true
        })
      .click(function( event ) {
        form.addEmailsHandle.call(form);
    });
    
    $('#' + this.htmlId + '_sendToSelectedRecipientsBtn')
      .button({
        icons: {
            primary: "ui-icon-mail-closed"
        },
        text: true
        })
      .click(function( event ) {
        form.sendToSelectedRecipientsHandle.call(form);
    });
    this.updateMailoutRecipientsSelection();
}
MailoutManager.prototype.updateMailoutRecipientsSelection = function() {
    for(var key in this.loaded.mailoutRecipients) {
        var mailoutRecipient = this.loaded.mailoutRecipients[key];
        var value = false;
        if(jQuery.inArray(mailoutRecipient.id, this.selected.mailoutRecipientIds) != -1) {
            value = true;
        }
        $('#' + this.htmlId + '_mailoutRecipientSelect_' + mailoutRecipient.id).prop("checked", value);
    }
}
MailoutManager.prototype.updateMailoutHistoryItemsView = function(event) {
    var html = '';
    if(this.selected.mailoutId != null) {
        html += '<table class="datagrid">';
        html += '<tr class="dgHeader"><td>Status</td><td>Time</td><td>Comment</td><td>Employee</td></tr>';
        if(this.loaded.mailoutHistoryItems.length > 0) {
            for(var key in this.loaded.mailoutHistoryItems) {
                var mailoutHistoryItem = this.loaded.mailoutHistoryItems[key];
                html += '<tr>';
                html += '<td>' + mailoutHistoryItem.status + '</td>';
                html += '<td>' + yearMonthDateTimeVisualizer.getHtml(mailoutHistoryItem.time) + '</td>';
                html += '<td>' + mailoutHistoryItem.comment + '</td>';
                html += '<td>' + mailoutHistoryItem.employeeUserName + '</td>';
                html += '</tr>';
            }
        } else {
            html += '<tr><td colspan="4">No data</td></tr>';
        }
        html += '</table>';
    }
    $('#' + this.htmlId + '_mailoutHistoryItems').html(html);
}
MailoutManager.prototype.updateMailoutTemplatesView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Name</td><td>Description</td></tr>';
    if(this.loaded.mailoutTemplates.length > 0) {
        for(var key in this.loaded.mailoutTemplates) {
            var mailoutTemplate = this.loaded.mailoutTemplates[key];
            html += '<tr>';
            html += '<td><span class="link" id="' + this.htmlId + "_mailoutTemplate_" + mailoutTemplate.id + '">' + mailoutTemplate.name + '</span></td>';
            html += '<td>' + mailoutTemplate.description + '</td>';
            html += '</tr>';
        }
    } else {
        html += '<tr><td colspan="2">No data</td></tr>';
    }
    html += '</table>';
    html += '<button id="' + this.htmlId + '_addMailoutTemplateBtn">Add template</button>';
    $('#' + this.htmlId + '_mailoutTemplates').html(html);
    var form = this;
    $('[id^="' + this.htmlId + '_mailoutTemplate_"]').bind("click", function(event) {form.mailoutTemplateClickedHandle.call(form, event);});      

    $('#' + this.htmlId + '_addMailoutTemplateBtn')
      .button({
        icons: {
            primary: "ui-icon-plus"
        },
        text: true
        })
      .click(function( event ) {
        form.addMailoutTemplate.call(form);
    });
}
MailoutManager.prototype.updateMailoutTemplateView = function() {
    var mailoutTemplate = this.loaded.mailoutTemplate;
    var html = '';
    if(this.selected.mailoutTemplateId != null) {
        html += '<table class="datagrid">';
        html += '<tr class="dgHeader"><td>Name</td><td>Created at</td></tr>';
        html += '<tr><td>Name</td><td>' + mailoutTemplate.name + '</td></tr>';
        html += '<tr><td>Description</td><td>' + mailoutTemplate.description + '</td></tr>';
        html += '</table>';
        html += '<button id="' + this.htmlId + '_previewMailoutTemplateBtn">Preview</button>';    
        html += '<button id="' + this.htmlId + '_editMailoutTemplateBtn">Edit</button>';    
        html += '<button id="' + this.htmlId + '_deleteMailoutTemplateBtn">Delete</button>';    
    }
    $('#' + this.htmlId + '_mailoutTemplate').html(html);
    
    var form = this;
    $('#' + this.htmlId + '_previewMailoutTemplateBtn')
      .button({
        icons: {
            primary: "ui-icon-document"
        },
        text: true
        })
      .click(function( event ) {
        form.previewMailoutTemplate.call(form);
    });
    $('#' + this.htmlId + '_editMailoutTemplateBtn')
      .button({
        icons: {
            primary: "ui-icon-pencil"
        },
        text: true
        })
      .click(function( event ) {
        form.editMailoutTemplate.call(form);
    });
    $('#' + this.htmlId + '_deleteMailoutTemplateBtn')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: true
        })
      .click(function( event ) {
        form.deleteMailoutTemplate.call(form);
    });    
}
MailoutManager.prototype.updateFilesView = function() {
    var html = '';
    html += 'Not yet implemented';
    $('#' + this.htmlId + '_files').html(html);
    var form = this;
    $('[id^="' + this.htmlId + '_file_"]').bind("click", function(event) {form.fileClickedHandle.call(form, event);});      


}
MailoutManager.prototype.updateEmailsView = function() {
    var html = '';
    for(var key in this.emails) {
        var email = this.emails[key];
        html += email + '\n';
    }
    $('#' + this.htmlId + '_emails').val(html);      
}

MailoutManager.prototype.mailoutClickedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    this.selected.mailoutId = parseInt(tmp[tmp.length - 1]);
    this.selected.mailoutRecipientIds = [];
    this.loadMailoutContent();
}
MailoutManager.prototype.mailoutTemplateClickedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    this.selected.mailoutTemplateId = parseInt(tmp[tmp.length - 1]);
    this.loadMailoutTemplateContent();
}
MailoutManager.prototype.mailoutRecipientClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    this.selected.mailoutRecipientIds = [];
    this.selected.mailoutRecipientIds.push(id);
    this.updateMailoutRecipientsSelection();
}
MailoutManager.prototype.mailoutRecipientSelectClickedHandle = function(event) {
    this.selected.mailoutRecipientIds = [];
    for(var key in this.loaded.mailoutRecipients) {
        var mailoutRecipient = this.loaded.mailoutRecipients[key];
        if( $('#' + this.htmlId + '_mailoutRecipientSelect_' + mailoutRecipient.id).is(':checked') ) {
            this.selected.mailoutRecipientIds.push(mailoutRecipient.id);
        }
    }
    this.updateMailoutRecipientsSelection();
}
MailoutManager.prototype.addContactsHandle = function(event) {
    var formData = {
        "mode": 'MULTIPLE'
    };
    this.contactPicker = new ContactPicker(formData, "contactPicker", this.contactsPicked, this, this.moduleName);
    this.contactPicker.init();
}
MailoutManager.prototype.contactsPicked = function(contactIds) {
    this.addContacts(contactIds);
}

MailoutManager.prototype.addEmployeesHandle = function(event) {  
    this.employeePicker = new EmployeePicker("employeePicker", this.employeePicked, this, this.moduleName);
    this.employeePicker.init();
}
MailoutManager.prototype.employeePicked = function(employee) {
    var employeeIds = [];
    employeeIds.push(employee.id);
    this.addEmployees(employeeIds);
}
MailoutManager.prototype.addEmailsHandle = function(event) {
    var html = '';
    html += '<textarea id="' + this.htmlId + '_emails" style="width: 400px; height: 200px;"></textarea>';
    this.popupHtmlId = getNextPopupHtmlContainer();
    
    $('#' + this.popupHtmlId).html(html);
    var form = this;
    $('#' + this.htmlId + '_emails').bind('change', function(event) {form.emailsChangedHandle.call(form, event)});
    var form = this;
    $('#' + this.popupHtmlId).dialog({
        title: "Free emails",
        modal: true,
        position: 'center',
        width: 450,
        height: 400,
        buttons: {
            Ok: function() {
                form.emailsPicked();
                $('#' + form.popupHtmlId).dialog("close");
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });
}
MailoutManager.prototype.emailsChangedHandle = function() {
    var emailsStr = jQuery.trim($('#' + this.htmlId + '_emails').val());
    var tmpEmails = emailsStr.split(/(\n|\s|,|;)/);
    var emails = [];
    var emailRE = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    for(var key in tmpEmails) {
        var tmpEmail = tmpEmails[key];
        if(tmpEmail != '' && emailRE.test(tmpEmail)) {
            emails.push(tmpEmail);
        }
    }
    this.emails = emails;
    this.updateEmailsView();
}
MailoutManager.prototype.emailsPicked = function() {
    this.addEmails(this.emails);
}
MailoutManager.prototype.deleteMailoutRecipients = function() {
    if(this.selected.mailoutRecipientIds.length == 0) {
        doAlert('Alert', 'Recipients are not selected', null, null);
    } else {
        doConfirm('Alert', 'Proceed with deletion of selected recipients?', this, this.doDeleteMailoutRecipients, null, null);
    }
}
MailoutManager.prototype.sendToSelectedRecipientsHandle = function() {
    if(this.selected.mailoutRecipientIds.length == 0) {
        doAlert('Alert', 'Recipients are not selected', null, null);
    } else {
        doConfirm('Alert', 'Proceed with sending mail to selected recipients?', this, this.doSendToSelectedRecipients, null, null);
    }    
}
MailoutManager.prototype.addMailout = function(event) {
    var mailoutEditForm = new MailoutEditForm({
        "mode": 'CREATE',
        "id": null,
        "name": "",
        "description": "",
        "senderName": "",
        "subject": "",
        "testTo": currentUser.email,
        "replyTo": "",
        "dispositionNotificationTo": "",
        "delay": 1000,
        "partSize": 100
    }, "mailoutEditForm", this.mailoutsUpdated, this);
    mailoutEditForm.init();
}
MailoutManager.prototype.refreshMailout = function(event) {   
    this.selected.mailoutRecipientIds = [];
    this.loadMailoutContent();
}
MailoutManager.prototype.editMailout = function(event) {   
    var mailout = this.loaded.mailout;
    var mailoutEditForm = new MailoutEditForm({
        "mode": 'UPDATE',
        "id": mailout.id,
        "name": mailout.name,
        "description": mailout.description,
        "senderName": mailout.senderName,
        "subject": mailout.subject,
        "testTo": mailout.testTo,
        "replyTo": mailout.replyTo,
        "dispositionNotificationTo": mailout.dispositionNotificationTo,
        "delay": mailout.delay,
        "partSize": mailout.partSize        
    }, "mailoutEditForm", this.mailoutsUpdated, this);
    mailoutEditForm.init();
}
MailoutManager.prototype.editMailoutContent = function(event) {   
    var mailout = this.loaded.mailout;
    var mailoutContentEditForm = new MailoutContentEditForm({
        "id": mailout.id,
        "mailoutTemplateId": null,
        "mailoutContent": mailout.mailoutContent
    }, "mailoutContentEditForm", this.mailoutsUpdated, this);
    mailoutContentEditForm.init();
}
MailoutManager.prototype.cloneMailout = function(event) {
    var mailoutId = this.loaded.mailout.id;
    var form = this;
    doConfirm('Confirm', 'Proceed with cloning of the selected mailout?', this, function() {form.doCloneMailout.call(form, mailoutId);}, null, null);
}
MailoutManager.prototype.deleteMailout = function(event) {
  var mailoutId = this.loaded.mailout.id;
  var mailoutDeleteForm = new MailoutDeleteForm(mailoutId, this.mailoutsUpdated, this);
  mailoutDeleteForm.init();
}
MailoutManager.prototype.mailoutsUpdated = function() {
    this.selected.mailoutId = null;
    this.loadMailouts();
}
MailoutManager.prototype.sendMailout = function(event) {
  doConfirm('Alert', 'Proceed with sending mailout?', this, this.doSendMailout, null, null);
}
MailoutManager.prototype.testMailout = function(event) {
  doConfirm('Alert', 'Proceed with testing mailout?', this, this.doTestMailout, null, null);
}
MailoutManager.prototype.previewMailout = function(event) {
    var url = this.config.endpointUrl + '?command=getMailoutPreview&mailoutId=' + this.loaded.mailout.id;
    var attachmentsHtml = '<span class="label1">Attachements</span><br />';
    for(var key in this.loaded.mailout.mailoutContent.attachments) {
        var attachment = this.loaded.mailout.mailoutContent.attachments[key];
        attachmentsHtml += '<a href="' + rootPath + 'files/' + attachment.source + '" target="_blank">' + attachment.name + '</a><br />';
    }
    showPopup('Preview', '<iframe src="' + url + '" width="100%" height="450"></iframe><div>' + attachmentsHtml + '</div>', 600, 500, null, null);    
}
MailoutManager.prototype.setTestedMailout = function(event) {
  doConfirm('Alert', 'Proceed with setting mailout as tested?', this, this.doSetTestedMailout, null, null);
}
MailoutManager.prototype.closeMailout = function(event) {
  doConfirm('Alert', 'Proceed with closing mailout?', this, this.doCloseMailout, null, null);
}

MailoutManager.prototype.addMailoutTemplate = function(event) {
    var mailoutTemplateEditForm = new MailoutTemplateEditForm({
        "mode": 'CREATE',
        "id": null,
        "name": "",
        "description": "",
        "mailoutContent": {
            "layout": "",
            "bodies": [],
            "embeddedObjects": [],
            "attachment": [],
            "links": []
        }
    }, "mailoutTemplateEditForm", this.mailoutTemplatesUpdated, this);
    mailoutTemplateEditForm.init();
}
MailoutManager.prototype.editMailoutTemplate = function(event) {   
    var mailoutTemplate = this.loaded.mailoutTemplate;
    var formData = {
        "mode": 'UPDATE',
        "id": mailoutTemplate.id,
        "name": mailoutTemplate.name,
        "description": mailoutTemplate.description,
        "mailoutContent": mailoutTemplate.mailoutContent
    }
    var mailoutTemplateEditForm = new MailoutTemplateEditForm(formData, "mailoutTemplateEditForm", this.mailoutTemplatesUpdated, this);
    mailoutTemplateEditForm.init();
}
MailoutManager.prototype.deleteMailoutTemplate = function(event) {
  var mailoutTemplateId = this.loaded.mailoutTemplate.id;
  var mailoutTemplateDeleteForm = new MailoutTemplateDeleteForm(mailoutTemplateId, this.mailoutTemplatesUpdated, this);
  mailoutTemplateDeleteForm.init();
}
MailoutManager.prototype.previewMailoutTemplate = function(event) {
    var url = this.config.endpointUrl + '?command=getMailoutTemplatePreview&mailoutTemplateId=' + this.loaded.mailoutTemplate.id;
    showPopup('Preview', '<iframe src="' + url + '" width="100%" height="450"></iframe>', 600, 500, null, null);    
}

MailoutManager.prototype.mailoutTemplatesUpdated = function() {
    this.selected.mailoutTemplateId = null;
    this.loadMailoutTemplates();
}


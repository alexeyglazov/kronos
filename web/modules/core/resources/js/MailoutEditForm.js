/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function MailoutEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "MailoutEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.loaded = {
        mailoutTemplates: []
    }
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "name": formData.name,
        "description": formData.description,
        "senderName": formData.senderName,
        "subject": formData.subject,
        "testTo": formData.testTo,
        "replyTo": formData.replyTo,
        "dispositionNotificationTo": formData.dispositionNotificationTo,
        "delay": formData.delay,
        "partSize": formData.partSize
    }
}
MailoutEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    if(this.data.mode == "UPDATE") {
        this.checkDependencies();
    } else {
       this.getInitialContent();
    }
    this.dataChanged(false);
}
MailoutEditForm.prototype.getInitialContent = function() {
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
            form.loaded.mailoutTemplates = result.mailoutTemplates;
            form.show();
        })          
       },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });    
}
MailoutEditForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkMailoutDependencies";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.analyzeDependencies(result);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MailoutEditForm.prototype.analyzeDependencies = function(dependencies) {
//    if(dependencies.mailouts == 0) {
        this.show();
//    } else {
//        var html = 'This MailoutTemplate has dependencies and can not be updated<br />';
//        html += 'Mailouts: ' + dependencies.mailoutTemplates + '<br />';
//        doAlert("Dependencies found", html, null, null);
//    }
}
MailoutEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Name</span></td><td><input type="text" id="' + this.htmlId + '_name"></td></tr>';
    html += '<tr><td><span class="label1">Description</span></td><td><input type="text" id="' + this.htmlId + '_description"></td></tr>';
    html += '<tr><td><span class="label1">Sender name</span></td><td><input type="text" id="' + this.htmlId + '_senderName"></td></tr>';
    html += '<tr><td><span class="label1">Subject</span></td><td><input type="text" id="' + this.htmlId + '_subject"></td></tr>';
    html += '<tr><td><span class="label1">Test to</span></td><td><input type="text" id="' + this.htmlId + '_testTo"></td></tr>';
    html += '<tr><td><span class="label1">Reply to</span></td><td><input type="text" id="' + this.htmlId + '_replyTo"></td></tr>';
    html += '<tr><td><span class="label1">Disposition notification to</span></td><td><input type="text" id="' + this.htmlId + '_dispositionNotificationTo"></td></tr>';
    html += '<tr><td><span class="label1">Delay, mSec</span></td><td><input type="text" id="' + this.htmlId + '_delay"></td></tr>';
    html += '<tr><td><span class="label1">Part size</span></td><td><input type="text" id="' + this.htmlId + '_partSize"></td></tr>';
    html += '</table>';
    return html
}
MailoutEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_name').bind("change", function(event) {form.nameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_description').bind("change", function(event) {form.descriptionChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_senderName').bind("change", function(event) {form.senderNameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_subject').bind("change", function(event) {form.subjectChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_testTo').bind("change", function(event) {form.testToChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_replyTo').bind("change", function(event) {form.replyToChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_dispositionNotificationTo').bind("change", function(event) {form.dispositionNotificationToChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_delay').bind("change", function(event) {form.delayChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_partSize').bind("change", function(event) {form.partSizeChangedHandle.call(form, event);});
}
MailoutEditForm.prototype.nameChangedHandle = function(event) {
    this.data.name = jQuery.trim(event.currentTarget.value);
    this.updateNameView();
    this.dataChanged(true);
}
MailoutEditForm.prototype.descriptionChangedHandle = function(event) {
    this.data.description = jQuery.trim(event.currentTarget.value);
    this.updateDescriptionView();
    this.dataChanged(true);
}
MailoutEditForm.prototype.senderNameChangedHandle = function(event) {
    this.data.senderName = jQuery.trim(event.currentTarget.value);
    this.updateSenderNameView();
    this.dataChanged(true);
}
MailoutEditForm.prototype.subjectChangedHandle = function(event) {
    this.data.subject = jQuery.trim(event.currentTarget.value);
    this.updateSubjectView();
    this.dataChanged(true);
}
MailoutEditForm.prototype.testToChangedHandle = function(event) {
    this.data.testTo = jQuery.trim(event.currentTarget.value);
    this.updateTestToView();
    this.dataChanged(true);
}
MailoutEditForm.prototype.replyToChangedHandle = function(event) {
    this.data.replyTo = jQuery.trim(event.currentTarget.value);
    this.updateReplyToView();
    this.dataChanged(true);
}
MailoutEditForm.prototype.dispositionNotificationToChangedHandle = function(event) {
    this.data.dispositionNotificationTo = jQuery.trim(event.currentTarget.value);
    this.updateDispositionNotificationToView();
    this.dataChanged(true);
}
MailoutEditForm.prototype.delayChangedHandle = function(event) {
    this.data.delay = jQuery.trim(event.currentTarget.value);
    this.updateDelayView();
    this.dataChanged(true);
}
MailoutEditForm.prototype.partSizeChangedHandle = function(event) {
    this.data.partSize = jQuery.trim(event.currentTarget.value);
    this.updatePartSizeView();
    this.dataChanged(true);
}

MailoutEditForm.prototype.updateView = function(event) {
    this.updateNameView();
    this.updateDescriptionView();
    this.updateSenderNameView();
    this.updateSubjectView();
    this.updateTestToView();
    this.updateReplyToView();
    this.updateDispositionNotificationToView();
    this.updateDelayView();
    this.updatePartSizeView();
}
MailoutEditForm.prototype.updateNameView = function(event) {
    $('#' + this.htmlId + '_name').val(this.data.name);
}
MailoutEditForm.prototype.updateDescriptionView = function(event) {
    $('#' + this.htmlId + '_description').val(this.data.description);
}
MailoutEditForm.prototype.updateSenderNameView = function(event) {
    $('#' + this.htmlId + '_senderName').val(this.data.senderName);
}
MailoutEditForm.prototype.updateSubjectView = function(event) {
    $('#' + this.htmlId + '_subject').val(this.data.subject);
}
MailoutEditForm.prototype.updateReplyToView = function(event) {
    $('#' + this.htmlId + '_replyTo').val(this.data.replyTo);
}
MailoutEditForm.prototype.updateTestToView = function(event) {
    $('#' + this.htmlId + '_testTo').val(this.data.testTo);
}
MailoutEditForm.prototype.updateDispositionNotificationToView = function(event) {
    $('#' + this.htmlId + '_dispositionNotificationTo').val(this.data.dispositionNotificationTo);
}
MailoutEditForm.prototype.updateDelayView = function(event) {
    $('#' + this.htmlId + '_delay').val(this.data.delay);
}
MailoutEditForm.prototype.updatePartSizeView = function(event) {
    $('#' + this.htmlId + '_partSize').val(this.data.partSize);
}

MailoutEditForm.prototype.show = function() {
    var title = 'Update Mailout'
    if(this.data.mode == 'CREATE') {
        title = 'Create Mailout';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 400,
        height: 400,
        buttons: {
            Ok: function() {
                form.save();
            },
            Cancel: function() {
                $(this).dialog( "close" );
                form.dataChanged(false);
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });
    this.updateView();
}
MailoutEditForm.prototype.validate = function() {
    var errors = [];
    if(this.data.name == null || this.data.name == "") {
        errors.push("Name is not set");
    }
    if(this.data.description.length > 255) {
        errors.push("Description is too long. It must not exceed 255 characters.");
    }
    if(this.data.senderName == null || this.data.senderName == "") {
        errors.push("Sender Name is not set");
    }
    if(this.data.subject == null || this.data.subject == "") {
        errors.push("Subject is not set");
    }
    var emailRE = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    var integerRE = /^[0-9]*$/;
    if(this.data.testTo == null || this.data.testTo == "") {
        errors.push("TestTo is not set");
    } else if(!emailRE.test(this.data.testTo)) {
      errors.push("TestTo has incorrect format.");
    }
    if(this.data.replyTo == null || this.data.replyTo == "") {
        errors.push("ReplyTo is not set");
    } else if(!emailRE.test(this.data.replyTo)) {
      errors.push("ReplyTo has incorrect format.");
    }
    if(this.data.dispositionNotificationTo == null || this.data.dispositionNotificationTo == "") {

    } else if(!emailRE.test(this.data.dispositionNotificationTo)) {
      errors.push("DispositionNotificationTo has incorrect format.");
    }
    if(this.data.delay == null || this.data.delay == "") {
        errors.push("Delay is not set. Use integer value");
    } else if(!integerRE.test(this.data.delay)) {
        errors.push("Delay must be an integer value");        
    }
    if(this.data.partSize == null || this.data.partSize == "") {
        errors.push("Part Size is not set. Use integer value");
    } else if(!integerRE.test(this.data.partSize)) {
        errors.push("Part Size must be an integer value");        
    }

    return errors;
}
MailoutEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var form = this;
    var data = {};
    data.command = "saveMailout";
    data.mailoutEditForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Mailout has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MailoutEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
MailoutEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}



//==================================================

function MailoutDeleteForm(mailoutId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "MailoutEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": mailoutId
    }
}
MailoutDeleteForm.prototype.init = function() {
    this.checkDependencies();
}
MailoutDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkMailoutDependencies";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.analyzeDependencies(result);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MailoutDeleteForm.prototype.analyzeDependencies = function(dependencies) {
//    if(dependencies.offices == 0) {
        this.show();
//    } else {
//        var html = 'This Mailout has dependencies and can not be deleted<br />';
//        html += 'Mailouts: ' + dependencies.mailouts + '<br />';
//        doAlert("Dependencies found", html, null, null);
//    }
}
MailoutDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Mailout", this, function() {this.doDeleteMailout()}, null, null);
}
MailoutDeleteForm.prototype.doDeleteMailout = function() {
    var form = this;
    var data = {};
    data.command = "deleteMailout";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Mailout has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MailoutDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}



/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ProjectCodeConflictEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "ProjectCodeConflictEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": formData.id,
        "projectCodeId": formData.projectCodeId,
        "checkingSubdepartmentId": formData.checkingSubdepartmentId,
        "comment": formData.comment,
        "status": formData.status
    }
    this.currentStatus = this.data.status;
    this.enums = {
        statuses: {
            'NOT_DETECTED': 'Not detected',
            'DETECTED': 'Detected',
            'IRRESOLVABLE': 'Irresolvable',
            'RESOLVED': 'Resolved'
        }
    }
}
ProjectCodeConflictEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.show();
}
ProjectCodeConflictEditForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkActivityDependencies";
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
ProjectCodeConflictEditForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.projectCodes == 0) {
        this.show();
    } else {
        var html = 'This Activity has dependencies and can not be updated<br />';
        html += 'Project Codes: ' + dependencies.projectCodes + '<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
ProjectCodeConflictEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Status</span></td><td><select id="' + this.htmlId + '_status"></select></td></tr>';
    html += '<tr><td style="vertical-align: top;"><span class="label1">Comment</span></td><td><textarea id="' + this.htmlId + '_comment" style="width: 300px; height: 100px;"></textarea></td></tr>';
    html += '</table>';
    return html
}
ProjectCodeConflictEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_status').bind("change", function(event) {form.statusChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_comment').bind("change", function(event) {form.commentChangedHandle.call(form, event);});
}
ProjectCodeConflictEditForm.prototype.statusChangedHandle = function(event) {
    this.data.status = null;
    if(event.currentTarget.value != '') {
        this.data.status = event.currentTarget.value;
    }
    this.updateStatusView();
}
ProjectCodeConflictEditForm.prototype.commentChangedHandle = function(event) {
    this.data.comment = jQuery.trim(event.currentTarget.value);
    this.updateCommentView();
}
ProjectCodeConflictEditForm.prototype.updateView = function() {
    this.updateStatusView();
    this.updateCommentView();
}
ProjectCodeConflictEditForm.prototype.updateStatusView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.enums.statuses) {
        var status = this.enums.statuses[key];
        var isSelected = "";
        if(key == this.data.status) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + status + '</option>';
    }
    $('#' + this.htmlId + '_status').html(html);
}
ProjectCodeConflictEditForm.prototype.updateCommentView = function() {
    $('#' + this.htmlId + '_comment').val(this.data.comment);
}

ProjectCodeConflictEditForm.prototype.show = function() {
    var title = 'Change project code conflict'
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 400,
        height: 300,
        buttons: {
            Ok: function() {
                form.save();
            },
            Cancel: function() {
                $(this).dialog( "close" );
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });
}
ProjectCodeConflictEditForm.prototype.validate = function() {
    var errors = [];
    if(this.data.status == null) {
        errors.push("Status is not set");
    } else if(this.data.status == 'NOT_DETECTED') {
        errors.push("This status is not allowed");
    } else if(this.data.status == this.currentStatus) {
        errors.push("Saving with the same status is not allowed");
    }

    if(this.data.comment == null || this.data.comment == "") {
        errors.push("Comment is not set");
    }
    return errors;
}
ProjectCodeConflictEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var form = this;
    var data = {};
    data.command = "saveProjectCodeConflict";
    data.projectCodeConflictEditForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function() {
            doAlert("Info", "Status has been successfully saved", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodeConflictEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}


/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ProjectCodeCommentEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "ProjectCodeCommentEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.disabled = {
        "content": true
    };
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "subdepartmentId": formData.subdepartmentId,
        "content": formData.content
    }
}
ProjectCodeCommentEditForm.prototype.start = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    //if(this.data.mode == "UPDATE") {
    //    this.checkDependencies();
    //} else {
       this.disabled = {
        "content": false
       };
       this.show();
    //}
    this.dataChanged(false);
}
ProjectCodeCommentEditForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkProjectCodeCommentDependencies";
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
ProjectCodeCommentEditForm.prototype.analyzeDependencies = function(dependencies) {
    //not used
    if(dependencies.departments == 0) {
        this.disabled = {
            "name": false,
            "codeName": false,
            "description": false,
            "isActive": false
        };
        this.show();
    } else {
        var html = 'This ProjectCodeComment has dependencies. Only "Active" property is updatable.<br />';
        html += 'Departments: ' + dependencies.departments + '<br />';
        this.disabled = {
            "name": true,
            "codeName": true,
            "description": true,
            "isActive": false
        };
        doAlert("Dependencies found", html, this, this.show);
    }
}
ProjectCodeCommentEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Content</span></td><td><textarea id="' + this.htmlId + '_content" style="width: 300px; height: 100px;"></textarea></td></tr>';
    html += '</table>';
    return html
}
ProjectCodeCommentEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_content').bind("change", function(event) {form.contentChangedHandle.call(form, event);});
}
ProjectCodeCommentEditForm.prototype.contentChangedHandle = function(event) {
    this.data.content = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
ProjectCodeCommentEditForm.prototype.updateView = function(event) {
    $('#' + this.htmlId + '_content').val(this.data.content);
    $('#' + this.htmlId + '_content').attr("disabled", this.disabled.content);
}

ProjectCodeCommentEditForm.prototype.show = function() {
    var title = 'Update ProjectCodeComment'
    if(this.data.mode == 'CREATE') {
        title = 'Create ProjectCodeComment';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 400,
        height: 250,
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
ProjectCodeCommentEditForm.prototype.validate = function() {
    var errors = [];
    var nameRE = /^[a-zA-Z0-9-+&]*/;
    if(this.data.content == null || this.data.content == "") {
        errors.push("Content is not set");
    } else if(this.data.content.length > 4096) {
        errors.push("Description is too long. It must not exceed 4k characters.");
    }
    return errors;
}
ProjectCodeCommentEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var form = this;
    var data = {};
    data.command = "saveProjectCodeComment";
    data.projectCodeCommentEditForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "ProjectCodeComment has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodeCommentEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

ProjectCodeCommentEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}

//==================================================

function ProjectCodeCommentDeleteForm(projectCodeCommentId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "ProjectCodeCommentEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": projectCodeCommentId
    }
}
ProjectCodeCommentDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
ProjectCodeCommentDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkProjectCodeCommentDependencies";
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
ProjectCodeCommentDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.departments == null || dependencies.departments == 0) {
        this.show();
    } else {
        var html = 'This ProjectCodeComment has dependencies and can not be deleted<br />';
        html += 'Departments: ' + dependencies.departments + '<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
ProjectCodeCommentDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Proceed to delete this ProjectCodeComment?", this, function() {this.doDeleteProjectCodeComment()}, null, null);
}
ProjectCodeCommentDeleteForm.prototype.doDeleteProjectCodeComment = function() {
    var form = this;
    var data = {};
    data.command = "deleteProjectCodeComment";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "ProjectCodeComment has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodeCommentDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}
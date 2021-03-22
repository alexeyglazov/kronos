/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function MailoutTemplateEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "MailoutTemplateEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "name": formData.name,
        "description": formData.description,
        "mailoutContent": formData.mailoutContent
    }
    if(this.data.mailoutContent == null) {
        this.data.mailoutContent = {
            "layout": '',
            "bodies": [],
            "embeddedObjects": [],
            "attachments": [],
            "links": []            
        }
    } else {
        if(this.data.mailoutContent.bodies == null) {
            this.data.mailoutContent.bodies = [];
        }
        if(this.data.mailoutContent.embeddedObjects == null) {
            this.data.mailoutContent.embeddedObjects = [];
        }
        if(this.data.mailoutContent.attachments == null) {
            this.data.mailoutContent.attachments = [];
        }
        if(this.data.mailoutContent.links == null) {
            this.data.mailoutContent.links = [];
        }
    }
    this.sortBodies();
}
MailoutTemplateEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    if(this.data.mode == "UPDATE") {
        this.checkDependencies();
    } else {
       this.show();
    }
    this.dataChanged(false);
}
MailoutTemplateEditForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkMailoutTemplateDependencies";
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
MailoutTemplateEditForm.prototype.analyzeDependencies = function(dependencies) {
//    if(dependencies.mailouts == 0) {
        this.show();
//    } else {
//        var html = 'This MailoutTemplate has dependencies and can not be updated<br />';
//        html += 'Mailouts: ' + dependencies.mailoutTemplates + '<br />';
//        doAlert("Dependencies found", html, null, null);
//    }
}
MailoutTemplateEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Name</span></td><td><input type="text" id="' + this.htmlId + '_name"></td></tr>';
    html += '<tr><td><span class="label1">Description</span></td><td><input type="text" id="' + this.htmlId + '_description"></td></tr>';
    html += '<tr><td><span class="label1">Layout</span></td><td><textarea id="' + this.htmlId + '_layout" style="width: 600px; height: 300px;"></textarea></td></tr>';
    html += '<tr><td><span class="label1">Bodies</span></td><td><div id="' + this.htmlId + '_bodiesBlock"></div><button id="' + this.htmlId + '_addBodyBtn">Add</button><button id="' + this.htmlId + '_sortBodiesBtn">Sort</button></td></tr>';
    html += '<tr><td><span class="label1">Objects</span></td><td><div id="' + this.htmlId + '_embeddedObjectsBlock"></div><button id="' + this.htmlId + '_addEmbeddedObjectBtn">Add</button></td></tr>';
    html += '<tr><td><span class="label1">Attachments</span></td><td><div id="' + this.htmlId + '_attachmentsBlock"></div><button id="' + this.htmlId + '_addAttachmentBtn">Add</button></td></tr>';
    html += '<tr><td><span class="label1">Links</span></td><td><div id="' + this.htmlId + '_linksBlock"></div><button id="' + this.htmlId + '_addLinkBtn">Add</button></td></tr>';
    html += '</table>';
    return html;    
}
MailoutTemplateEditForm.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_addBodyBtn')
      .button({
        icons: {
            primary: "ui-icon-plus"
        },
        text: true
        })
      .click(function( event ) {
        form.addBody.call(form);
    });    
    $('#' + this.htmlId + '_sortBodiesBtn')
      .button({
        icons: {
            primary: "ui-icon-arrowthick-2-n-s"
        },
        text: true
        })
      .click(function( event ) {
        form.startSortingBodies.call(form);
    });
    $('#' + this.htmlId + '_addEmbeddedObjectBtn')
      .button({
        icons: {
            primary: "ui-icon-plus"
        },
        text: true
        })
      .click(function( event ) {
        form.addEmbeddedObject.call(form);
    });
    $('#' + this.htmlId + '_addAttachmentBtn')
      .button({
        icons: {
            primary: "ui-icon-plus"
        },
        text: true
        })
      .click(function( event ) {
        form.addAttachment.call(form);
    });
    $('#' + this.htmlId + '_addLinkBtn')
      .button({
        icons: {
            primary: "ui-icon-plus"
        },
        text: true
        })
      .click(function( event ) {
        form.addLink.call(form);
    });    
}
MailoutTemplateEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_name').bind("change", function(event) {form.nameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_description').bind("change", function(event) {form.descriptionChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_layout').bind("change", function(event) {form.layoutChangedHandle.call(form, event);});
}
MailoutTemplateEditForm.prototype.nameChangedHandle = function(event) {
    this.data.name = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.descriptionChangedHandle = function(event) {
    this.data.description = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.layoutChangedHandle = function(event) {
    this.data.mailoutContent.layout = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.bodyNameChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.bodies[index].name = jQuery.trim(event.currentTarget.value);
    this.updateBodiesView();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.bodyContentChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.bodies[index].content = jQuery.trim(event.currentTarget.value);
    this.updateBodiesView();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.embeddedObjectNameChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.embeddedObjects[index].name = jQuery.trim(event.currentTarget.value);
    this.updateEmbeddedObjectsView();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.embeddedObjectSourceChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.embeddedObjects[index].source = jQuery.trim(event.currentTarget.value);
    this.updateEmbeddedObjectsView();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.attachmentNameChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.attachments[index].name = jQuery.trim(event.currentTarget.value);
    this.updateAttachmentsView();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.attachmentSourceChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.attachments[index].source = jQuery.trim(event.currentTarget.value);
    this.updateAttachmentsView();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.linkNameChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.links[index].name = jQuery.trim(event.currentTarget.value);
    this.updateLinksView();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.linkUrlChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.links[index].url = jQuery.trim(event.currentTarget.value);
    this.updateLinksView();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.linkTextChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.links[index].text = jQuery.trim(event.currentTarget.value);
    this.updateLinksView();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.addBody = function(event) {
    this.data.mailoutContent.bodies.push({
        "name": '',
        "content": '',
        "sortValue": this.data.mailoutContent.bodies.length
    });
    this.sortBodies();
    this.updateBodiesStructure();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.startSortingBodies = function(event) {
    var items = [];
    for(var key in this.data.mailoutContent.bodies) {
        var body = this.data.mailoutContent.bodies[key];
        items.push({
            id: key,
            text: body.name
        });
    }
    var bodySortForm = new Sorter({
        "items": items
    }, "bodySorterForm", this.saveSortedBodies, this);
    bodySortForm.init();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.saveSortedBodies = function(indexes) {
    for(var key in indexes) {
        var index = indexes[key];
        var body = this.data.mailoutContent.bodies[index];
        body.sortValue = key;
    }
    this.sortBodies();
    this.updateBodiesStructure();
}
MailoutTemplateEditForm.prototype.sortBodies = function() {
    this.data.mailoutContent.bodies.sort(function(o1, o2){
        if(o1.sortValue == o2.sortValue) return 0;
        return o1.sortValue > o2.sortValue ? 1: -1;
    });
    for(var key in this.data.mailoutContent.bodies) {
        var body = this.data.mailoutContent.bodies[key];
        body.sortValue = key;
    }
}
MailoutTemplateEditForm.prototype.deleteBody = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.bodies.splice(index, 1);
    this.sortBodies();
    this.updateBodiesStructure();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.addEmbeddedObject = function(event) {
    this.data.mailoutContent.embeddedObjects.push({
        "name": '',
        "source": ''
    });
    this.updateEmbeddedObjectsStructure();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.deleteEmbeddedObject = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.embeddedObjects.splice(index, 1);
    this.updateEmbeddedObjectsStructure();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.addAttachment = function(event) {
    this.data.mailoutContent.attachments.push({
        "name": '',
        "source": ''
    });
    this.updateAttachmentsStructure();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.deleteAttachment = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.attachments.splice(index, 1);
    this.updateAttachmentsStructure();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.addLink = function(event) {
    this.data.mailoutContent.links.push({
        "name": '',
        "url": '',
        "text": ''
    });
    this.updateLinksStructure();
    this.dataChanged(true);
}
MailoutTemplateEditForm.prototype.deleteLink = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.links.splice(index, 1);
    this.updateLinksStructure();
    this.dataChanged(true);
}

MailoutTemplateEditForm.prototype.updateView = function(event) {
    this.updateNameView();
    this.updateDescriptionView();
    this.updateLayoutView();
    this.updateBodiesStructure();
    this.updateEmbeddedObjectsStructure();   
    this.updateAttachmentsStructure();
    this.updateLinksStructure();   
}
MailoutTemplateEditForm.prototype.updateNameView = function(event) {
    $('#' + this.htmlId + '_name').val(this.data.name);
}
MailoutTemplateEditForm.prototype.updateDescriptionView = function(event) {
    $('#' + this.htmlId + '_description').val(this.data.description);
}
MailoutTemplateEditForm.prototype.updateLayoutView = function(event) {
    $('#' + this.htmlId + '_layout').val(this.data.mailoutContent.layout);
}
MailoutTemplateEditForm.prototype.updateBodiesStructure = function(event) {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Name</td><td>Default content</td><td></td></tr>';
    if(this.data.mailoutContent.bodies.length > 0) {
        var i = 0;
        for(var key in this.data.mailoutContent.bodies) {
            html += '<tr>';
            html += '<td><input type="text" id="' + this.htmlId + '_bodyName_' + i + '"></td>';
            html += '<td><textarea id="' + this.htmlId + '_bodyContent_' + i + '" style="width: 300px; height: 100px;"></textarea></td>';
            html += '<td><button id="' + this.htmlId + '_bodyDeleteBtn_' + i + '">Delete</button></td>';
            html += '</tr>';
            i++;
        }
    } else {
        html += '<tr><td colspan="3">No data</td></tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_bodiesBlock').html(html);
    
    var form = this;
    $('input[id^="' + this.htmlId + '_bodyName_"]').bind("change", function(event) {form.bodyNameChangedHandle.call(form, event);});
    $('textarea[id^="' + this.htmlId + '_bodyContent_"]').bind("change", function(event) {form.bodyContentChangedHandle.call(form, event);});

    $('button[id^="' + this.htmlId + '_bodyDeleteBtn_"]')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.deleteBody.call(form, event);
    });    
    
    this.updateBodiesView();
}
MailoutTemplateEditForm.prototype.updateBodiesView = function(event) {
    var i = 0;
    for(var key in this.data.mailoutContent.bodies) {
        var body = this.data.mailoutContent.bodies[key];
        $('#' + this.htmlId + '_bodyName_' + i).val(body.name);
        $('#' + this.htmlId + '_bodyContent_' + i).val(body.content);
        i++;
    }    
}
MailoutTemplateEditForm.prototype.updateEmbeddedObjectsStructure = function(event) {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Name</td><td>Source</td><td></td></tr>';
    var i = 0;
    if(this.data.mailoutContent.embeddedObjects.length > 0) {
        var i = 0;    
        for(var key in this.data.mailoutContent.embeddedObjects) {
            html += '<tr>';
            html += '<td><input type="text" id="' + this.htmlId + '_embeddedObjectName_' + i + '"></td>';
            html += '<td><input type="text" id="' + this.htmlId + '_embeddedObjectSource_' + i + '"></td>';
            html += '<td><button id="' + this.htmlId + '_embeddedObjectDeleteBtn_' + i + '">Delete</button></td>';
            html += '</tr>';
            i++;
        }
    } else {
        html += '<tr><td colspan="3">No data</td></tr>';
    }    
    html += '</table>';
    $('#' + this.htmlId + '_embeddedObjectsBlock').html(html);
    
    var form = this;
    $('input[id^="' + this.htmlId + '_embeddedObjectName_"]').bind("change", function(event) {form.embeddedObjectNameChangedHandle.call(form, event);});
    $('input[id^="' + this.htmlId + '_embeddedObjectSource_"]').bind("change", function(event) {form.embeddedObjectSourceChangedHandle.call(form, event);});

    $('button[id^="' + this.htmlId + '_embeddedObjectDeleteBtn_"]')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.deleteEmbeddedObject.call(form, event);
    });    
    
    this.updateEmbeddedObjectsView();    
}
MailoutTemplateEditForm.prototype.updateEmbeddedObjectsView = function(event) {
    var i = 0;
    for(var key in this.data.mailoutContent.embeddedObjects) {
        var embeddedObject = this.data.mailoutContent.embeddedObjects[key];
        $('#' + this.htmlId + '_embeddedObjectName_' + i).val(embeddedObject.name);
        $('#' + this.htmlId + '_embeddedObjectSource_' + i).val(embeddedObject.source);
        i++;
    }    
}
MailoutTemplateEditForm.prototype.updateAttachmentsStructure = function(event) {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Name</td><td>Default content</td><td></td></tr>';
    if(this.data.mailoutContent.attachments.length > 0) {
        var i = 0;
        for(var key in this.data.mailoutContent.attachments) {
            html += '<tr>';
            html += '<td><input type="text" id="' + this.htmlId + '_attachmentName_' + i + '"></td>';
            html += '<td><input type="text" id="' + this.htmlId + '_attachmentSource_' + i + '"></td>';
            html += '<td><button id="' + this.htmlId + '_attachmentDeleteBtn_' + i + '">Delete</button></td>';
            html += '</tr>';
            i++;
        }
    } else {
        html += '<tr><td colspan="3">No data</td></tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_attachmentsBlock').html(html);
    
    var form = this;
    $('input[id^="' + this.htmlId + '_attachmentName_"]').bind("change", function(event) {form.attachmentNameChangedHandle.call(form, event);});
    $('input[id^="' + this.htmlId + '_attachmentSource_"]').bind("change", function(event) {form.attachmentSourceChangedHandle.call(form, event);});

    $('button[id^="' + this.htmlId + '_attachmentDeleteBtn_"]')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.deleteAttachment.call(form, event);
    });    
    
    this.updateAttachmentsView();
}
MailoutTemplateEditForm.prototype.updateAttachmentsView = function(event) {
    var i = 0;
    for(var key in this.data.mailoutContent.attachments) {
        var attachment = this.data.mailoutContent.attachments[key];
        $('#' + this.htmlId + '_attachmentName_' + i).val(attachment.name);
        $('#' + this.htmlId + '_attachmentSource_' + i).val(attachment.source);
        i++;
    }    
}
MailoutTemplateEditForm.prototype.updateLinksStructure = function(event) {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Name</td><td>URL</td><td>Text</td><td></td></tr>';
    if(this.data.mailoutContent.links.length > 0) {
        var i = 0;
        for(var key in this.data.mailoutContent.links) {
            html += '<tr>';
            html += '<td><input type="text" id="' + this.htmlId + '_linkName_' + i + '"></td>';
            html += '<td><input type="text" id="' + this.htmlId + '_linkUrl_' + i + '"></td>';
            html += '<td><input type="text" id="' + this.htmlId + '_linkText_' + i + '"></td>';
            html += '<td><button id="' + this.htmlId + '_linkDeleteBtn_' + i + '">Delete</button></td>';
            html += '</tr>';
            i++;
        }
    } else {
        html += '<tr><td colspan="4">No data</td></tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_linksBlock').html(html);
    
    var form = this;
    $('input[id^="' + this.htmlId + '_linkName_"]').bind("change", function(event) {form.linkNameChangedHandle.call(form, event);});
    $('input[id^="' + this.htmlId + '_linkUrl_"]').bind("change", function(event) {form.linkUrlChangedHandle.call(form, event);});
    $('input[id^="' + this.htmlId + '_linkText_"]').bind("change", function(event) {form.linkTextChangedHandle.call(form, event);});

    $('button[id^="' + this.htmlId + '_linkDeleteBtn_"]')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.deleteLink.call(form, event);
    });    
    
    this.updateLinksView();
}
MailoutTemplateEditForm.prototype.updateLinksView = function(event) {
    var i = 0;
    for(var key in this.data.mailoutContent.links) {
        var link = this.data.mailoutContent.links[key];
        $('#' + this.htmlId + '_linkName_' + i).val(link.name);
        $('#' + this.htmlId + '_linkUrl_' + i).val(link.url);
        $('#' + this.htmlId + '_linkText_' + i).val(link.text);
        i++;
    }    
}

MailoutTemplateEditForm.prototype.show = function() {
    var title = 'Update Mailout template'
    if(this.data.mode == 'CREATE') {
        title = 'Create Mailout template';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeButtons();
    this.updateView();
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 750,
        height: 700,
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
MailoutTemplateEditForm.prototype.validate = function() {
    var errors = [];
    if(this.data.name == null || this.data.name == "") {
        errors.push("Name is not set");
    }
    if(this.data.description.length > 255) {
        errors.push("Description is too long. It must not exceed 255 characters.");
    }
    if(this.data.mailoutContent.layout == null || this.data.mailoutContent.layout == '') {
        errors.push("Layout is not set");
    }
    return errors;
}
MailoutTemplateEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var form = this;
    var data = {};
    data.command = "saveMailoutTemplate";
    data.mailoutTemplateEditForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "MailoutTemplate has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MailoutTemplateEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
MailoutTemplateEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}



//==================================================

function MailoutTemplateDeleteForm(mailoutTemplateId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "MailoutTemplateEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": mailoutTemplateId
    }
}
MailoutTemplateDeleteForm.prototype.init = function() {
    this.checkDependencies();
}
MailoutTemplateDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkMailoutTemplateDependencies";
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
MailoutTemplateDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    //if(dependencies.mailouts == 0) {
        this.show();
    //} else {
    //    var html = 'This MailoutTemplate has dependencies and can not be deleted<br />';
    //    html += 'Mailouts: ' + dependencies.mailouts + '<br />';
    //    doAlert("Dependencies found", html, null, null);
    //}
}
MailoutTemplateDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this MailoutTemplate", this, function() {this.doDeleteMailoutTemplate()}, null, null);
}
MailoutTemplateDeleteForm.prototype.doDeleteMailoutTemplate = function() {
    var form = this;
    var data = {};
    data.command = "deleteMailoutTemplate";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "MailoutTemplate has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MailoutTemplateDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}



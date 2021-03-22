/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function MailoutContentEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "MailoutContentEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.loaded = {
        mailoutTemplates: [],
        mailoutTemplate: null
    }
    this.data = {
        "id": formData.id,
        "mailoutTemplateId": formData.mailoutTemplateId,
        "mailoutContent": formData.mailoutContent
    }
    this.showDetails = false;
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
MailoutContentEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.getInitialContent();
    this.dataChanged(false);
}
MailoutContentEditForm.prototype.getInitialContent = function() {
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
MailoutContentEditForm.prototype.loadMailoutTemplateContent = function() {
    var form = this;
    var data = {};
    data.command = "getMailoutTemplateContent";
    data.id = getJSON(this.data.mailoutTemplateId);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.mailoutTemplate = result.mailoutTemplate;
            form.setMailoutTemplate();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MailoutContentEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Template</span></td><td><select id="' + this.htmlId + '_mailoutTemplate"></select></td></tr>';
    html += '</table>';

    html += '<table>';
    html += '<tr><td><span class="label1">Show details</span></td><td><input type="checkbox" id="' + this.htmlId  + '_showDetails' + '"></td></tr>';
    html += '</table>';


    html += '<div id="' + this.htmlId + '_layoutBlock">';
    html += '<span class="label1">Layout</span><br />';
    html += '<textarea id="' + this.htmlId + '_layout" style="width: 500px; height: 300px;"></textarea>';
    html += '</div>';
     
    html += '<span class="label1">Bodies</span>'
    html += '<div type="text" id="' + this.htmlId + '_bodiesBlock"></div>';
    if(this.showDetails) {
        html += '<button id="' + this.htmlId + '_addBodyBtn">Add body</button><br />';
    }
    
    html += '<span class="label1">Embedded Objects</span>'
    html += '<div type="text" id="' + this.htmlId + '_embeddedObjectsBlock"></div>';
    if(this.showDetails) {
        html += '<button id="' + this.htmlId + '_addEmbeddedObjectBtn">Add embedded object</button><br />';
    }
 
    html += '<span class="label1">Links</span>'
    html += '<div type="text" id="' + this.htmlId + '_linksBlock"></div>';
    if(this.showDetails) {
        html += '<button id="' + this.htmlId + '_addLinkBtn">Add link</button><br />';
    }
    
    html += '<span class="label1">Attachements</span>'
    html += '<div type="text" id="' + this.htmlId + '_attachmentsBlock"></div>';
    html += '<button id="' + this.htmlId + '_addAttachmentBtn">Add attachement</button><br />'
    return html;
}
MailoutContentEditForm.prototype.makeButtons = function() {
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
}
MailoutContentEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_showDetails').bind("click", function(event) {form.showDetailsClickedHandle.call(form, event);});
    $('#' + this.htmlId + '_mailoutTemplate').bind("change", function(event) {form.mailoutTemplateChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_layout').bind("change", function(event) {form.layoutChangedHandle.call(form, event);});
}
MailoutContentEditForm.prototype.showDetailsClickedHandle = function(event) {
    this.showDetails = $(event.currentTarget).is(":checked");
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.makeButtons();
    this.setHandlers();
}
MailoutContentEditForm.prototype.mailoutTemplateChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_mailoutTemplate').val();
    var oldValue = this.data.mailoutTemplateId;
    if(htmlId == '') {
        this.data.mailoutTemplateId = null;
    } else {
        this.data.mailoutTemplateId = parseInt(htmlId);
    }
    this.updateMailoutTemplateView();
    if(this.data.mailoutTemplateId == null) {
        if(oldValue != null) {
            this.data.mailoutContent = {
                "layout": '',
                "bodies": [],
                "embeddedObjects": [],
                "attachments": [],
                "links": []            
            }
            this.updateBodiesStructure();
            this.updateEmbeddedObjectsStructure();
            this.updateAttachmentsStructure();
            this.updateLinksStructure();
        }
    } else {
        this.loadMailoutTemplateContent();
    }
    this.dataChanged(true);
}
MailoutContentEditForm.prototype.setMailoutTemplate = function(event) {
    this.data.mailoutContent = this.loaded.mailoutTemplate.mailoutContent;
    this.sortBodies();
    this.updateLayoutView();
    this.updateBodiesStructure();
    this.updateEmbeddedObjectsStructure();
    this.updateAttachmentsStructure();
    this.updateLinksStructure();
}
MailoutContentEditForm.prototype.sortBodies = function() {
    this.data.mailoutContent.bodies.sort(function(o1, o2){
        if(o1.sortValue == o2.sortValue) return 0;
        return o1.sortValue > o2.sortValue ? 1: -1;
    });
    for(var key in this.data.mailoutContent.bodies) {
        var body = this.data.mailoutContent.bodies[key];
        body.sortValue = key;
    }
}
MailoutContentEditForm.prototype.layoutChangedHandle = function(event) {
    this.data.mailoutContent.layout = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
MailoutContentEditForm.prototype.addAttachment = function(event) {
    this.data.mailoutContent.attachments.push({
        "name": '',
        "source": ''
    });
    this.updateAttachmentsStructure();
    this.dataChanged(true);
}
MailoutContentEditForm.prototype.deleteAttachment = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.attachments.splice(index, 1);
    this.updateAttachmentsStructure();
    this.dataChanged(true);
}
MailoutContentEditForm.prototype.addBody = function(event) {
    this.data.mailoutContent.bodies.push({
        "name": '',
        "content": '',
        "sortValue": this.data.mailoutContent.bodies.length
    });
    this.sortBodies();
    this.updateBodiesStructure();
    this.dataChanged(true);
}
MailoutContentEditForm.prototype.deleteBody = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.bodies.splice(index, 1);
    this.sortBodies();
    this.updateBodiesStructure();
    this.dataChanged(true);
}
MailoutContentEditForm.prototype.addEmbeddedObject = function(event) {
    this.data.mailoutContent.embeddedObjects.push({
        "name": '',
        "source": ''
    });
    this.updateEmbeddedObjectsStructure();
    this.dataChanged(true);
}
MailoutContentEditForm.prototype.deleteEmbeddedObject = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.embeddedObjects.splice(index, 1);
    this.updateEmbeddedObjectsStructure();
    this.dataChanged(true);
}
MailoutContentEditForm.prototype.addLink = function(event) {
    this.data.mailoutContent.links.push({
        "name": '',
        "url": '',
        "text": ''
    });
    this.updateLinksStructure();
    this.dataChanged(true);
}
MailoutContentEditForm.prototype.deleteLink = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.links.splice(index, 1);
    this.updateLinksStructure();
    this.dataChanged(true);
}
MailoutContentEditForm.prototype.bodyNameChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.bodies[index].name = jQuery.trim(event.currentTarget.value);
    this.updateBodiesView();
    this.dataChanged(true);
}
MailoutContentEditForm.prototype.bodyContentChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.bodies[index].content = jQuery.trim(event.currentTarget.value);
    this.updateBodiesView();
    this.dataChanged(true);
}
MailoutContentEditForm.prototype.embeddedObjectNameChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.embeddedObjects[index].name = jQuery.trim(event.currentTarget.value);
    this.updateEmbeddedObjectsView();
    this.dataChanged(true);
}
MailoutContentEditForm.prototype.embeddedObjectSourceChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.embeddedObjects[index].source = jQuery.trim(event.currentTarget.value);
    this.updateEmbeddedObjectsView();
    this.dataChanged(true);
}
MailoutContentEditForm.prototype.attachmentNameChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.attachments[index].name = jQuery.trim(event.currentTarget.value);
    this.updateAttachmentsView();
    this.dataChanged(true);
}
MailoutContentEditForm.prototype.attachmentSourceChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.attachments[index].source = jQuery.trim(event.currentTarget.value);
    this.updateAttachmentsView();
    this.dataChanged(true);
}
MailoutContentEditForm.prototype.linkNameChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.links[index].name = jQuery.trim(event.currentTarget.value);
    this.updateLinksView();
    this.dataChanged(true);
}
MailoutContentEditForm.prototype.linkUrlChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.links[index].url = jQuery.trim(event.currentTarget.value);
    this.updateLinksView();
    this.dataChanged(true);
}
MailoutContentEditForm.prototype.linkTextChangedHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var index = tmp[tmp.length - 1];
    this.data.mailoutContent.links[index].text = jQuery.trim(event.currentTarget.value);
    this.updateLinksView();
    this.dataChanged(true);
}

MailoutContentEditForm.prototype.updateView = function(event) {
    this.updateShowDetailsView();
    this.updateLayoutView();
    this.updateMailoutTemplateView();
    this.updateBodiesStructure();
    this.updateEmbeddedObjectsStructure();   
    this.updateAttachmentsStructure();
    this.updateLinksStructure();    
}
MailoutContentEditForm.prototype.updateShowDetailsView = function(event) {
    $('#' + this.htmlId + '_showDetails').attr("checked", this.showDetails);
}
MailoutContentEditForm.prototype.updateMailoutTemplateView = function(event) {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.mailoutTemplates) {
        var mailoutTemplate = this.loaded.mailoutTemplates[key];
        var isSelected = "";
        if(mailoutTemplate.id == this.data.mailoutTemplateId) {
           isSelected = "selected";
        }
        html += '<option value="' + mailoutTemplate.id + '" ' + isSelected + '>' + mailoutTemplate.name + '</option>';
    }
    $('#' + this.htmlId + '_mailoutTemplate').html(html);    
}
MailoutContentEditForm.prototype.updateLayoutView = function(event) {
    if(this.showDetails) {
        $('#' + this.htmlId + '_layoutBlock').show();
    } else {
        $('#' + this.htmlId + '_layoutBlock').hide();
    }
    $('#' + this.htmlId + '_layout').val(this.data.mailoutContent.layout);
}
MailoutContentEditForm.prototype.updateBodiesStructure = function(event) {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Name</td><td>Default content</td>';
    if(this.showDetails) {
        html += '<td></td>';
    }
    html += '</tr>';
    if(this.data.mailoutContent.bodies.length > 0) {
        var i = 0;
        for(var key in this.data.mailoutContent.bodies) {
            html += '<tr>';
            if(this.showDetails) {
                html += '<td><input type="text" id="' + this.htmlId + '_bodyName_' + i + '"></td>';
            } else {
                html += '<td><span type="text" id="' + this.htmlId + '_bodyName_' + i + '"></span></td>';
            }
            html += '<td><textarea id="' + this.htmlId + '_bodyContent_' + i + '" style="width: 300px; height: 100px;"></textarea></td>';
            if(this.showDetails) {
                html += '<td><button id="' + this.htmlId + '_bodyDeleteBtn_' + i + '">Delete</button></td>';
            }    
            html += '</tr>';
            i++;
        }
    } else {
        html += '<tr><td colspan="2">No data</td></tr>';
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
MailoutContentEditForm.prototype.updateBodiesView = function(event) {
    var i = 0;
    for(var key in this.data.mailoutContent.bodies) {
        var body = this.data.mailoutContent.bodies[key];
        if(this.showDetails) {
            $('#' + this.htmlId + '_bodyName_' + i).val(body.name);
        } else {
            $('#' + this.htmlId + '_bodyName_' + i).html(body.name);
        }
        $('#' + this.htmlId + '_bodyContent_' + i).val(body.content);
        i++;
    }    
}
MailoutContentEditForm.prototype.updateEmbeddedObjectsStructure = function(event) {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Name</td><td>Source</td>';
    if(this.showDetails) {
        html += '<td></td>';
    }
    html += '</tr>';
    var i = 0;
    if(this.data.mailoutContent.embeddedObjects.length > 0) {
        var i = 0;    
        for(var key in this.data.mailoutContent.embeddedObjects) {
            html += '<tr>';
            if(this.showDetails) {
                html += '<td><input type="text" id="' + this.htmlId + '_embeddedObjectName_' + i + '"></td>';
            } else {
                html += '<td><span type="text" id="' + this.htmlId + '_embeddedObjectName_' + i + '"></span></td>';
            }
            html += '<td><input type="text" id="' + this.htmlId + '_embeddedObjectSource_' + i + '"></td>';
            if(this.showDetails) {
                html += '<td><button id="' + this.htmlId + '_embeddedObjectDeleteBtn_' + i + '">Delete</button></td>';
            }    
            html += '</tr>';
            i++;
        }
    } else {
        html += '<tr><td colspan="2">No data</td></tr>';
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
MailoutContentEditForm.prototype.updateEmbeddedObjectsView = function(event) {
    var i = 0;
    for(var key in this.data.mailoutContent.embeddedObjects) {
        var embeddedObject = this.data.mailoutContent.embeddedObjects[key];
        if(this.showDetails) {
            $('#' + this.htmlId + '_embeddedObjectName_' + i).val(embeddedObject.name);
        } else {
            $('#' + this.htmlId + '_embeddedObjectName_' + i).html(embeddedObject.name);
        }
        $('#' + this.htmlId + '_embeddedObjectSource_' + i).val(embeddedObject.source);
        i++;
    }    
}
MailoutContentEditForm.prototype.updateAttachmentsStructure = function(event) {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Name</td><td>Source</td><td></td></tr>';
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
MailoutContentEditForm.prototype.updateAttachmentsView = function(event) {
    var i = 0;
    for(var key in this.data.mailoutContent.attachments) {
        var attachment = this.data.mailoutContent.attachments[key];
        $('#' + this.htmlId + '_attachmentName_' + i).val(attachment.name);
        $('#' + this.htmlId + '_attachmentSource_' + i).val(attachment.source);
        i++;
    }    
}
MailoutContentEditForm.prototype.updateLinksStructure = function(event) {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Name</td><td>URL</td><td>Text</td>';
    if(this.showDetails) {
        html += '<td></td>';
    }
    html += '</tr>';
    if(this.data.mailoutContent.links.length > 0) {
        var i = 0;
        for(var key in this.data.mailoutContent.links) {
            html += '<tr>';
            if(this.showDetails) {
                html += '<td><input type="text" id="' + this.htmlId + '_linkName_' + i + '"></td>';
            } else {
                html += '<td><span type="text" id="' + this.htmlId + '_linkName_' + i + '"></span></td>';
            }
            html += '<td><input type="text" id="' + this.htmlId + '_linkUrl_' + i + '"></td>';
            html += '<td><input type="text" id="' + this.htmlId + '_linkText_' + i + '"></td>';
            if(this.showDetails) {
                html += '<td><button id="' + this.htmlId + '_linkDeleteBtn_' + i + '">Delete</button></td>';
            }
            html += '</tr>';
            i++;
        }
    } else {
        html += '<tr><td colspan="3">No data</td></tr>';
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
MailoutContentEditForm.prototype.updateLinksView = function(event) {
    var i = 0;
    for(var key in this.data.mailoutContent.links) {
        var link = this.data.mailoutContent.links[key];
        if(this.showDetails) {
            $('#' + this.htmlId + '_linkName_' + i).val(link.name);
        } else {
            $('#' + this.htmlId + '_linkName_' + i).html(link.name);
        }
        $('#' + this.htmlId + '_linkUrl_' + i).val(link.url);
        $('#' + this.htmlId + '_linkText_' + i).val(link.text);
        i++;
    }    
}

MailoutContentEditForm.prototype.show = function() {
    var title = 'Update Mailout content'
    if(this.data.mode == 'CREATE') {
        title = 'Create Mailout content';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.makeButtons();
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 600,
        height: 500,
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
MailoutContentEditForm.prototype.validate = function() {
    var errors = [];
    if(this.data.mailoutContent.layout == null || this.data.mailoutContent.layout == "") {
        errors.push("Layout is not set");
    }
    return errors;
}
MailoutContentEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var form = this;
    var data = {};
    data.command = "saveMailoutContent";
    data.mailoutContentEditForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Mailout Content has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MailoutContentEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
MailoutContentEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}






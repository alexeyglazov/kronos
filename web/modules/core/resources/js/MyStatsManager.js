/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function MyStatsManager(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder+ "MyStatsManager.jsp"
    }
    this.loaded = {
        projectAndInternalTimeSpentItems : null
    }
    this.views = {
        "TIME" : "Time",
        "PERCENT" : "Percent"
    }
    this.data = {};
    this.selected = {};
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
}
MyStatsManager.prototype.init = function() {
    this.makeLayout();
}
MyStatsManager.prototype.makeLayout = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Start</span></td><td><input type="input" id="' + this.htmlId + '_startDate"></td></tr>';
    html += '<tr><td><span class="label1">End</span></td><td><input type="input" id="' + this.htmlId + '_endDate"></td></tr>';
    html += '<tr><td><span class="label1">View</span></td><td><select id="' + this.htmlId + '_view"></select></td></tr>';
    html += '<tr><td></td><td><input type="button" id="' + this.htmlId + '_showBtn" value="Show"></td></tr>';
    html += '</table>';
    html += '<div id="' + this.htmlId + '_chart"></div>';
    $('#' + this.containerHtmlId).html(html);
    this.updateViewView();
    this.setHandlers();
    this.makeDatePickers();
}
MyStatsManager.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_startDate' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startDateChangedHandle(dateText, inst)}
    });
    $( '#' + this.htmlId + '_endDate' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endDateChangedHandle(dateText, inst)}
    });
}
MyStatsManager.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_view').bind("change", function(event) {form.viewChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_showBtn').bind("click", function(event) {form.startShow.call(form, event)});
}
MyStatsManager.prototype.startDateChangedHandle = function(dateText, inst) {
    this.data.startDate = dateText;
}
MyStatsManager.prototype.startDateTextChangedHandle = function(event) {
    this.data.startDate = jQuery.trim(event.currentTarget.value);
}
MyStatsManager.prototype.endDateChangedHandle = function(dateText, inst) {
    this.data.endDate = dateText;
}
MyStatsManager.prototype.endDateTextChangedHandle = function(event) {
    this.data.endDate = jQuery.trim(event.currentTarget.value);
}
MyStatsManager.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(this.data.startDate);
}
MyStatsManager.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(this.data.endDate);
}
MyStatsManager.prototype.viewChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_view').val();
    if(idTxt == '') {
        this.selected.view = null;
    } else {
        this.selected.view = idTxt;
    }
    this.data.view = this.selected.view;
}
MyStatsManager.prototype.updateViewView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.views) {
        var view = this.views[key];
        var isSelected = "";
        if(key == this.selected.view) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + view + '</option>';
    }
    $('#' + this.htmlId + '_view').html(html);
}
MyStatsManager.prototype.validate = function() {
    var errors = [];
    var startDate = null;
    var endDate = null;
    if(this.data.startDate == null || this.data.startDate == "") {
        errors.push("Start date is not set");
    } else if(! isDateValid(this.data.startDate)) {
        errors.push("Start date has incorrect format");
    } else {
        startDate = parseDateString(this.data.startDate);
    }
    if(this.data.endDate == null || this.data.endDate == "") {
        errors.push("End date is not set");
    } else if(! isDateValid(this.data.endDate)) {
        errors.push("End date has incorrect format");
    } else {
        endDate = parseDateString(this.data.endDate);
    }
    if(startDate != null && endDate != null && startDate > endDate) {
        errors.push("End date is less than Start date");
    }
    if(this.selected.view == null) {
        errors.push("View is not set");
    }
    return errors;
}
MyStatsManager.prototype.startShow = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors)
    } else {
      this.show();
    }
}
MyStatsManager.prototype.show = function() {
    var serverFormatData = {
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate),
        "view": this.data.view
    };
    var form = this;
    var data = {};
    data.command = "getContent";
    data.projectAndInternalTimeSpentItemsForm = getJSON(serverFormatData);
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                form.loaded.projectAndInternalTimeSpentItems = result.projectAndInternalTimeSpentItems;
                form.updateChartView();
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}

MyStatsManager.prototype.updateChartView = function() {
    var chartData = this.loaded.projectAndInternalTimeSpentItems;
    if(chartData.projectTimeSpentItems.length == 0 && chartData.internalTimeSpentItems.length == 0) {
        $('#' + this.htmlId + '_chart').html('No time was reported in this period');
        return;
    }
    var projectTimeSpent = 0;
    var internalTimeSpent = 0;
    var projectCategories = [];
    var internalCategories = [];
    var projectData = [];
    var internalData = [];
    
    for(var key in chartData.projectTimeSpentItems) {
        var projectTimeSpentItem = chartData.projectTimeSpentItems[key];
        projectTimeSpent += projectTimeSpentItem.timeSpent / 60.0;
        projectCategories.push(projectTimeSpentItem.projectCodeCode);
        projectData.push(projectTimeSpentItem.timeSpent / 60.0);
    }
    for(var key in chartData.internalTimeSpentItems) {
        var internalTimeSpentItem = chartData.internalTimeSpentItems[key];
        internalTimeSpent += internalTimeSpentItem.timeSpent / 60.0;
        internalCategories.push(internalTimeSpentItem.taskName);
        internalData.push(internalTimeSpentItem.timeSpent / 60.0);
    }
    var totalTimeSpent = projectTimeSpent + internalTimeSpent;
    var projectPercent = projectTimeSpent / totalTimeSpent;
    var internalPercent = internalTimeSpent / totalTimeSpent;
    var projectPercentData = [];
    var internalPercentData = [];
    for(var key in projectData) {
        projectPercentData.push(projectData[key] / totalTimeSpent);
    }
    for(var key in internalData) {
        internalPercentData.push(internalData[key] / totalTimeSpent);
    }

    var colors = Highcharts.getOptions().colors;
    var categories = ['Project', 'Internal'];
    var name = 'Types of job';
    var data = [{
            y: (chartData.view == 'PERCENT') ? projectPercent : projectTimeSpent,
            color: colors[0],
            drilldown: {
                name: 'Project details',
                categories: projectCategories,
                data: (chartData.view == 'PERCENT') ? projectPercentData : projectData,
                color: colors[0]
            }
        }, {
            y: (chartData.view == 'PERCENT') ? internalPercent : internalTimeSpent,
            color: colors[1],
            drilldown: {
                name: 'Internal details',
                categories: internalCategories,
                data: (chartData.view == 'PERCENT') ? internalPercentData : internalData,
                color: colors[1]
            }
        }];
                    
                    
    // Build the data arrays
    var overallData = [];
    var detailedData = [];
    for (var i = 0; i < data.length; i++) {
        // add overall data
        overallData.push({
                name: categories[i],
                y: data[i].y,
                color: data[i].color
        });

        // add detailed data
        for (var j = 0; j < data[i].drilldown.data.length; j++) {
            var brightness = 0.2 - (j / data[i].drilldown.data.length) / 5 ;
            detailedData.push({
                name: data[i].drilldown.categories[j],
                y: data[i].drilldown.data[j],
                color: Highcharts.Color(data[i].color).brighten(brightness).get()
            });
        }
    }
        
    // Create the chart
    var form = this;
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: form.htmlId + '_chart',
            type: 'pie'
        },
        title: {
            text: 'Timespent Sum Project vs Internal (Not Idle)'
        },
        yAxis: {
            title: {
                text: 'Tasks share'
            }
        },
        plotOptions: {
            pie: {
                shadow: false
            }
        },
        tooltip: {
            formatter: function() {
                if(chartData.view == 'PERCENT') {
                    return '<b>'+ this.point.name +'</b>: '+ getPercentHtml(this.y) + '';
                } else {
                    return '<b>'+ this.point.name +'</b>: '+ this.y + '';
                }
            }
        },
        series: [{
            name: 'Overall share',
            data: overallData,
            size: '60%',
            dataLabels: {
                formatter: function() {
                    // display only if larger than 0                   
                    if(chartData.view == 'PERCENT') {
                        return this.y > 0 ? '<b>'+ this.point.name +':</b> '+ getPercentHtml(this.y) + ''  : null;
                    } else {
                        return this.y > 0 ? '<b>'+ this.point.name +':</b> '+ this.y + ''  : null;
                    }
                },
                color: 'white',
                distance: -30
            }
        }, {
            name: 'Detailed share',
            data: detailedData,
            innerSize: '60%',
            dataLabels: {
                formatter: function() {
                    // display only if larger than 0
                    if(chartData.view == 'PERCENT') {
                        return this.y > 0 ? '<b>'+ this.point.name +':</b> '+ getPercentHtml(this.y) + ''  : null;
                    } else {
                        return this.y > 0 ? '<b>'+ this.point.name +':</b> '+ this.y + ''  : null;
                    }
                }
            }
        }]
    });
}

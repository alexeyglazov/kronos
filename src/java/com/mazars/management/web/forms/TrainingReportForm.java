/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.TrainingReport;

/**
 *
 * @author glazov
 */
public class TrainingReportForm {
    private YearMonthDate startDate;
    private YearMonthDate endDate;
    private TrainingReport.SearchType searchType;
    private String keyword;

    public TrainingReportForm() {
    }

    public YearMonthDate getEndDate() {
        return endDate;
    }

    public void setEndDate(YearMonthDate endDate) {
        this.endDate = endDate;
    }

    public YearMonthDate getStartDate() {
        return startDate;
    }

    public void setStartDate(YearMonthDate startDate) {
        this.startDate = startDate;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public TrainingReport.SearchType getSearchType() {
        return searchType;
    }

    public void setSearchType(TrainingReport.SearchType searchType) {
        this.searchType = searchType;
    }
   
    public static TrainingReportForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, TrainingReportForm.class);
    }
}

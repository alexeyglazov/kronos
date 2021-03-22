/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.*;

/**
 *
 * @author glazov
 */
public class InvoicingProcessReportForm {
    public enum DocumentType {
        ALL,
        INVOICE_TO_ISSUE,
        INVOICE_ISSUED,
        PAYMENT
    }
    public enum View {
        FULL,
        RESTRICTED
    }
    private ProjectCodeListFilter projectCodeListFilter;
    private YearMonthDate startDate;
    private YearMonthDate endDate;
    private DocumentType documentTypeToSearch;
    private DocumentType documentTypeToShow;
    private View view;

    public InvoicingProcessReportForm() {
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

    public DocumentType getDocumentTypeToSearch() {
        return documentTypeToSearch;
    }

    public void setDocumentTypeToSearch(DocumentType documentTypeToSearch) {
        this.documentTypeToSearch = documentTypeToSearch;
    }

    public DocumentType getDocumentTypeToShow() {
        return documentTypeToShow;
    }

    public void setDocumentTypeToShow(DocumentType documentTypeToShow) {
        this.documentTypeToShow = documentTypeToShow;
    }

    public ProjectCodeListFilter getProjectCodeListFilter() {
        return projectCodeListFilter;
    }

    public void setProjectCodeListFilter(ProjectCodeListFilter projectCodeListFilter) {
        this.projectCodeListFilter = projectCodeListFilter;
    }

    public View getView() {
        return view;
    }

    public void setView(View view) {
        this.view = view;
    }
  
    public static InvoicingProcessReportForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, InvoicingProcessReportForm.class);
    }
}

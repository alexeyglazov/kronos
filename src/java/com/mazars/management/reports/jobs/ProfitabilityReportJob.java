/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.reports.jobs;

import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.JobResult;
import com.mazars.management.db.domain.Module;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.jobs.Job;
import com.mazars.management.reports.ProfitabilityReport;
import com.mazars.management.reports.excel.ProfitabilityReportExcelBuilder;
import com.mazars.management.web.forms.ProfitabilityReportForm;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.zip.ZipOutputStream;
import jxl.write.WriteException;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class ProfitabilityReportJob extends Job {
    ProfitabilityReportForm profitabilityReportForm;
    Module module;

    public ProfitabilityReportForm getProfitabilityReportForm() {
        return profitabilityReportForm;
    }

    public void setProfitabilityReportForm(ProfitabilityReportForm profitabilityReportForm) {
        this.profitabilityReportForm = profitabilityReportForm;
    }

    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
    }
    @Override
    public void execute() throws Exception {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            refresh();
            makeReport();
            hs.getTransaction().commit();
        } catch(Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }
    }
    private void refresh() throws Exception {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        setModule((Module)hs.get(Module.class, module.getId()));
        setEmployee((Employee)hs.get(Employee.class, getEmployee().getId()));       
    }    
    private void makeReport() throws IOException, WriteException {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        ProfitabilityReport profitabilityReport = new ProfitabilityReport(profitabilityReportForm, module, getEmployee(), this);
        profitabilityReport.build();
        SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
        SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");

        String formGroupName = "ALL";
        String formClientCodeName = "ALL";
        String formOfficeCodeName = "ALL";
        String formDepartmentCodeName = "ALL";
        String formSubdepartmentCodeName = "ALL";
        String formStartDate = dateFormatterShort.format(profitabilityReportForm.getStartDate().getCalendar().getTime());
        String formEndDate = dateFormatterShort.format(profitabilityReportForm.getEndDate().getCalendar().getTime());

        if(profitabilityReport.getFormGroup() != null) {
            formGroupName = profitabilityReport.getFormGroup().getName().trim().replaceAll(" ", "").replaceAll("_", "");
        }
        if(profitabilityReport.getFormClient() != null) {
            formClientCodeName = profitabilityReport.getFormClient().getCodeName();
        }
        if(profitabilityReport.getFormOffice() != null) {
            formOfficeCodeName = profitabilityReport.getFormOffice().getCodeName();
        }
        if(profitabilityReport.getFormDepartment() != null) {
            formDepartmentCodeName = profitabilityReport.getFormDepartment().getCodeName();
        }
        if(profitabilityReport.getFormSubdepartment() != null) {
            formSubdepartmentCodeName = profitabilityReport.getFormSubdepartment().getCodeName();
        }


        String fileName = "P_" + formGroupName + "_" + formClientCodeName + "_" + formOfficeCodeName + "_" + formDepartmentCodeName + "_" + formSubdepartmentCodeName + "_";
        fileName += formStartDate + "_";
        fileName += formEndDate + "_";
        fileName += dateFormatterLong.format(profitabilityReport.getCreatedAt());
        fileName += ".zip";

        //ByteArrayOutputStream bos = new ByteArrayOutputStream();
        File file = File.createTempFile("profitability_",".zip");
        ZipOutputStream zipOutputStream = new ZipOutputStream(new FileOutputStream(file));

        //response.setContentType("application/x-zip-compressed");
        //response.setHeader("content-disposition", "filename=" + fileName);

        ProfitabilityReportExcelBuilder reb = new ProfitabilityReportExcelBuilder(profitabilityReport);
        reb.createDividedReport(zipOutputStream);
        zipOutputStream.flush();
        zipOutputStream.close();

        InputStream in = new FileInputStream(file);
        byte[] buff = new byte[8000];
        int bytesRead = 0;
        ByteArrayOutputStream bao = new ByteArrayOutputStream();
        while((bytesRead = in.read(buff)) != -1) {
            bao.write(buff, 0, bytesRead);
        }
        byte[] data = bao.toByteArray();
        in.close();

        JobResult jobResult = new JobResult();
        jobResult.setName(this.getName());
        jobResult.setEmployee(getEmployee());
        jobResult.setStartDate(this.getStartDate());
        jobResult.setEndDate(new Date());
        jobResult.setData(data);
        if(data != null) {
            jobResult.setDataSize(data.length);
        } else {
            jobResult.setDataSize(null);
        }
        jobResult.setFileName(fileName);
        hs.save(jobResult);
        file.delete();
    }
}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.utils;

import com.mazars.management.db.domain.Activity;
import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.CountryCurrency;
import com.mazars.management.db.domain.Currency;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.FeesAdvance;
import com.mazars.management.db.domain.FeesItem;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.ProjectCodeConflict;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.util.CalendarUtil;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.web.forms.ProjectCodeBatchCreationForm;
import com.mazars.management.web.forms.ProjectCodeForm;
import com.mazars.management.web.vo.Period;
import java.math.BigDecimal;
import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class ProjectCodeUtils {
    public static ProjectCode getProjectCode(ProjectCodeForm projectCodeForm, Employee employee) throws ParseException, Exception {
        Date now = new Date();
        Calendar today = new GregorianCalendar();
        today.setTime(now);
        CalendarUtil.truncateTime(today);
        ProjectCode projectCode = new ProjectCode();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        Client client = (Client)hs.get(Client.class, new Long(projectCodeForm.getClientId()));
        Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(projectCodeForm.getSubdepartmentId()));
        Activity activity = (Activity)hs.get(Activity.class, new Long(projectCodeForm.getActivityId()));
        Employee inChargePerson = null;
        if(projectCodeForm.getInChargePersonId() != null) {
            inChargePerson = (Employee)hs.get(Employee.class, new Long(projectCodeForm.getInChargePersonId()));
        }
        Employee inChargePartner = null;
        if(projectCodeForm.getInChargePartnerId() != null) {
            inChargePartner = (Employee)hs.get(Employee.class, new Long(projectCodeForm.getInChargePartnerId()));
        }
        projectCode.setSubdepartment(subdepartment);
        projectCode.setClient(client);
        projectCode.setActivity(activity);

        projectCode.setYear(projectCodeForm.getYear());
        projectCode.setFinancialYear(projectCodeForm.getFinancialYear());

        projectCode.setPeriodType(projectCodeForm.getPeriodType());
        if(ProjectCode.PeriodType.QUARTER.equals(projectCode.getPeriodType())) {
            projectCode.setPeriodQuarter(projectCodeForm.getPeriodQuarter());
        } else if(ProjectCode.PeriodType.MONTH.equals(projectCode.getPeriodType())) {
            projectCode.setPeriodMonth(projectCodeForm.getPeriodMonth());
        } else if(ProjectCode.PeriodType.DATE.equals(projectCode.getPeriodType())) {
            projectCode.setPeriodDate(projectCodeForm.getPeriodDate());
        } else if(ProjectCode.PeriodType.COUNTER.equals(projectCode.getPeriodType())) {
            Integer max = ProjectCode.getMaxPeriodCounter(projectCode.getYear(), client, activity);
            if(max == null) {
                max = 1;
            } else {
                max++;
            }
            projectCode.setPeriodCounter(max);
        }
        projectCode.setDescription(projectCodeForm.getDescription());
        projectCode.setComment(projectCodeForm.getComment());
        projectCode.setCreatedAt(now);
        projectCode.setModifiedAt(projectCode.getCreatedAt());
        projectCode.setCreatedBy(employee);
        projectCode.setIsClosed(projectCodeForm.getIsClosed());
        projectCode.setClosedAt(null);
        projectCode.setClosedBy(null);
        projectCode.setStartDate(today);
        projectCode.setEndDate(today);
        projectCode.setIsFuture(projectCodeForm.getIsFuture());
        projectCode.setIsDead(projectCodeForm.getIsDead());
        projectCode.setIsHidden(false);
        projectCode.setInChargePerson(inChargePerson);
        projectCode.setInChargePartner(inChargePartner);
        projectCode.setConflictStatus(ProjectCodeConflict.Status.NOT_DETECTED);
        projectCode.generateCode();
        String previewedCode = projectCodeForm.getProjectCodeCode();
        if(! previewedCode.equals(projectCode.getCode())) {
            throw new Exception("Previewed code is not the same as actually generated");
        }
        
        BigDecimal amount = projectCodeForm.getFeesAdvanceAmount();
        Calendar date = null;
        if(projectCodeForm.getFeesAdvanceDate() != null) {
            date = projectCodeForm.getFeesAdvanceDate().getCalendar();
        }
        Long advanceCurrencyId = projectCodeForm.getFeesAdvanceCurrencyId();
        Long paymentCurrencyId = projectCodeForm.getFeesPaymentCurrencyId();
        
        if(amount != null && advanceCurrencyId != null && paymentCurrencyId != null && date != null) {
            Currency advanceCurrency = (Currency)hs.get(Currency.class, new Long(advanceCurrencyId));
            Currency paymentCurrency = (Currency)hs.get(Currency.class, new Long(paymentCurrencyId));
            Calendar currentDate = new GregorianCalendar();
            CalendarUtil.truncateTime(currentDate);
            FeesItem feesItem = new FeesItem();
            feesItem.setFeesAdvanceCurrency(advanceCurrency);
            feesItem.setFeesInvoiceCurrency(advanceCurrency);
            feesItem.setFeesPaymentCurrency(paymentCurrency);
            feesItem.setFeesActCurrency(advanceCurrency);
            feesItem.setType(FeesItem.Type.FLAT_FEE);
            feesItem.setDate(currentDate);

            
            FeesAdvance feesAdvance = new FeesAdvance();
            feesAdvance.setAmount(amount);
            feesAdvance.setDate(date);
            feesAdvance.setIsAdvance(false);
            feesAdvance.setFeesItem(feesItem);
            Set<FeesAdvance> feesAdvances = new HashSet<FeesAdvance>(); 
            feesAdvances.add(feesAdvance);
            feesItem.setFeesAdvances(feesAdvances);

            projectCode.setFeesItem(feesItem);
            feesItem.setProjectCode(projectCode);
        }

        return projectCode;
    }
    public static List<ProjectCode> getProjectCodes(ProjectCodeBatchCreationForm projectCodeBatchCreationForm, Employee employee) throws ParseException, Exception {
        Date now = new Date();
        Calendar today = new GregorianCalendar();
        today.setTime(now);
        CalendarUtil.truncateTime(today);
        
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        List<ProjectCode> projectCodes = new LinkedList<ProjectCode>();
        Map<Long, Client> clients = new HashMap<Long, Client>();
        Map<Long, Activity> activities = new HashMap<Long, Activity>();
        Map<Long, Employee> inChargePersons = new HashMap<Long, Employee>();
        Map<Long, Employee> inChargePartners = new HashMap<Long, Employee>();
        Map<String, Integer> counters = new HashMap<String, Integer>();
        Map<Long, Currency> currencies = new HashMap<Long, Currency>();
        List<Currency> currencies1 = CountryCurrency.getCurrencies(employee.getCountry());
        for(Currency currency : currencies1) {
            currencies.put(currency.getId(), currency);
        }
        int count = 0;
        for(Long clientId : projectCodeBatchCreationForm.getClientIds()) {
            Client client = clients.get(clientId);
            if(client == null) {
                client = (Client)hs.get(Client.class, clientId);
                clients.put(clientId, client);
            }
            for(Long activityId : projectCodeBatchCreationForm.getActivityIds()) {
                Activity activity = activities.get(activityId);
                if(activity == null) {
                    activity = (Activity)hs.get(Activity.class, activityId);
                    activities.put(activityId, activity);
                }        
                for(Period period : projectCodeBatchCreationForm.getPeriods()) {
                    if(ProjectCode.PeriodType.COUNTER.equals(period.getType())) {
                        String key = "" + clientId + "_" + activityId + "_" + projectCodeBatchCreationForm.getYear();
                        Integer counter = counters.get(key);
                        if(counter == null) {
                            counter = ProjectCode.getMaxPeriodCounter(projectCodeBatchCreationForm.getYear(), client, activity);
                        }
                        if(counter == null) {
                            counter = 1;
                        } else {
                            counter++;
                        }
                        counters.put(key, counter);
                        period.setCounter(counter);
                    }

                    ProjectCode projectCode = new ProjectCode();
                    projectCode.setActivity(activity);
                    projectCode.setSubdepartment(activity.getSubdepartment());
                    projectCode.setClient(client);
                    projectCode.setYear(projectCodeBatchCreationForm.getYear());
                    projectCode.setFinancialYear(projectCodeBatchCreationForm.getFinancialYear());
                    projectCode.setPeriodType(period.getType());
                    if(ProjectCode.PeriodType.QUARTER.equals(period.getType())) {
                        projectCode.setPeriodQuarter(period.getQuarter());
                    } else if(ProjectCode.PeriodType.MONTH.equals(period.getType())) {
                        projectCode.setPeriodMonth(period.getMonth());
                    } else if(ProjectCode.PeriodType.DATE.equals(period.getType())) {
                        projectCode.setPeriodDate(period.getDate());
                    } else if(ProjectCode.PeriodType.COUNTER.equals(period.getType())) {
                        projectCode.setPeriodCounter(period.getCounter());
                    }
                    projectCode.generateCode();
                    projectCode.setDescription(projectCodeBatchCreationForm.getDescription());
                    projectCode.setComment(projectCodeBatchCreationForm.getComment());
                    projectCode.setCreatedAt(now);
                    projectCode.setModifiedAt(projectCode.getCreatedAt());
                    projectCode.setCreatedBy(employee);
                    projectCode.setIsClosed(projectCodeBatchCreationForm.getIsClosed());
                    projectCode.setClosedAt(null);
                    projectCode.setClosedBy(null);
                    projectCode.setStartDate(today);
                    projectCode.setEndDate(today);
                    String previewedCode = projectCodeBatchCreationForm.getProjectCodeCodes().get(count);
                    Boolean isFuture = projectCodeBatchCreationForm.getIsFutureItems().get(previewedCode);
                    projectCode.setIsFuture(isFuture);
                    projectCode.setIsDead(projectCodeBatchCreationForm.getIsDead());
                    projectCode.setIsHidden(false);
                    
                    Employee inChargePerson = null;
                    Long inChargePersonId = projectCodeBatchCreationForm.getInChargePersonIds().get(previewedCode);
                    if(inChargePersonId != null) {
                        inChargePerson = inChargePersons.get(inChargePersonId);
                        if(inChargePerson == null) {
                            inChargePerson = (Employee)hs.get(Employee.class, new Long(inChargePersonId));
                            if(inChargePerson != null) {
                                inChargePersons.put(inChargePersonId, inChargePerson);
                            }
                        }
                    }
                    projectCode.setInChargePerson(inChargePerson);
                    Employee inChargePartner = null;
                    Long inChargePartnerId = projectCodeBatchCreationForm.getInChargePartnerIds().get(previewedCode);
                    if(inChargePartnerId != null) {
                        inChargePartner = inChargePartners.get(inChargePartnerId);
                        if(inChargePartner == null) {
                            inChargePartner = (Employee)hs.get(Employee.class, new Long(inChargePartnerId));
                            if(inChargePartner != null) {
                                inChargePartners.put(inChargePartnerId, inChargePartner);
                            }
                        }
                    }
                    projectCode.setInChargePartner(inChargePartner);
                    projectCode.setConflictStatus(ProjectCodeConflict.Status.NOT_DETECTED);
                    projectCode.generateCode();
                    
                    if(! previewedCode.equals(projectCode.getCode())) {
                        throw new Exception("Previewed code is not the same as actually generated");
                    }

                    BigDecimal amount = projectCodeBatchCreationForm.getFeesAdvanceAmounts().get(previewedCode);
                    Calendar date = null;
                    if(projectCodeBatchCreationForm.getFeesAdvanceDates().get(previewedCode) != null) {
                        date = projectCodeBatchCreationForm.getFeesAdvanceDates().get(previewedCode).getCalendar();
                    }
                    Long advanceCurrencyId = projectCodeBatchCreationForm.getFeesAdvanceCurrencyIds().get(previewedCode);
                    Long paymentCurrencyId = projectCodeBatchCreationForm.getFeesPaymentCurrencyIds().get(previewedCode);
                    if(amount != null && advanceCurrencyId != null && paymentCurrencyId != null && date != null) {
                        Calendar currentDate = new GregorianCalendar();
                        CalendarUtil.truncateTime(currentDate);
                        Currency advanceCurrency = currencies.get(advanceCurrencyId);
                        Currency paymentCurrency = currencies.get(paymentCurrencyId);
                        FeesItem feesItem = new FeesItem();
                        feesItem.setFeesAdvanceCurrency(advanceCurrency);
                        feesItem.setFeesInvoiceCurrency(advanceCurrency);
                        feesItem.setFeesPaymentCurrency(paymentCurrency);
                        feesItem.setFeesActCurrency(advanceCurrency);
                        feesItem.setType(FeesItem.Type.FLAT_FEE);
                        feesItem.setDate(currentDate);
                        
                        FeesAdvance feesAdvance = new FeesAdvance();
                        feesAdvance.setAmount(amount);
                        feesAdvance.setDate(date);
                        feesAdvance.setIsAdvance(false);
                        feesAdvance.setFeesItem(feesItem);
                        Set<FeesAdvance> feesAdvances = new HashSet<FeesAdvance>(); 
                        feesAdvances.add(feesAdvance);
                        feesItem.setFeesAdvances(feesAdvances);
                        
                        projectCode.setFeesItem(feesItem);
                        feesItem.setProjectCode(projectCode);
                    }
                    
                    projectCodes.add(projectCode);
                    
                    count++;
                }
            }
        }
        return projectCodes;
    }
}

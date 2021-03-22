/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.util;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.vo.YearMonth;
import com.mazars.management.web.forms.*;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class ProjectCodeListUtil {
    protected static String getHQLForProjectCodeFilteredList(ProjectCodeListFilter filter, InvoiceRequestsFilter invoiceRequestsFilter, ProjectCodeListSorter sorter, List<Subdepartment> subdepartments, List<Subdepartment> conflictCheckingSubdepartments) {
        String query = "";
        query += "select pc from ProjectCode as pc ";
        query += "inner join pc.subdepartment as s inner join s.department as d inner join d.office as o ";
        if(filter.isGroupIdUsed() || sorter.isGroupUsed()) {
            query += "inner join pc.client as c left join c.group as g ";            
        } else if(filter.isClientIdUsed() || sorter.isClientUsed()) {
            query += "inner join pc.client as c ";
        }
        if(filter.isActivityIdUsed() || sorter.isActivityUsed() || filter.isActivityNameUsed()) {
            query += "inner join pc.activity as a ";
        }
        if(filter.isInChargePersonIdUsed() || sorter.isInChargePersonUsed()) {
            query += "left join pc.inChargePerson as icp ";
        }
        if(filter.isInChargePartnerIdUsed() || sorter.isInChargePartnerUsed()) {
            query += "left join pc.inChargePartner as icpat ";
        }
        
        if(filter.isCreatedByIdUsed() || sorter.isCreatedByUsed()) {
            query += "left join pc.createdBy as cb ";
        }
        if(filter.isClosedByIdUsed() || sorter.isClosedByUsed()) {
            query += "left join pc.closedBy as clb ";
        }
        if(conflictCheckingSubdepartments != null) {
            query += "inner join pc.projectCodeConflicts as pcc ";
        }
        //---------------------------------------
        if(invoiceRequestsFilter.isRequestUsed() || invoiceRequestsFilter.isDateUsed()) {
            query += "left join pc.invoiceRequestPackets as irp ";
            query += "left join pc.outOfPocketRequest as oopr ";
            if(invoiceRequestsFilter.isDateUsed() || invoiceRequestsFilter.isHasInvoiceRequestsUsed()) {
                query += "left join irp.invoiceRequests as ir ";
            }
            if(invoiceRequestsFilter.isDateUsed() || invoiceRequestsFilter.isHasActRequestsUsed()) {
                query += "left join irp.actRequest as ar ";
            }
            if(invoiceRequestsFilter.isHasTaxInvoiceRequestsUsed()) {
                query += "left join irp.taxInvoiceRequest as tir ";
            }
        }
        //---------------------------------------
        if(invoiceRequestsFilter.isFeesReferenceUsed()) {
            query += "left join pc.feesItem as fi ";
            if(invoiceRequestsFilter.isInvoiceReferenceUsed()) {
                query += "left join fi.feesInvoices as fin ";
            }
            if(invoiceRequestsFilter.isActReferenceUsed()) {
                query += "left join fi.feesActs as fa ";
            }
            if(invoiceRequestsFilter.isPaymentReferenceUsed()) {
                query += "left join fi.feesPayments as fp ";
            }
        }
        //---------------------------------------
        if(invoiceRequestsFilter.isOutOfPocketReferenceUsed()) {
            query += "left join pc.outOfPocketItem as oopi ";
            if(invoiceRequestsFilter.isOutOfPocketInvoiceReferenceUsed()) {
                query += "left join oopi.outOfPocketInvoices as oopin ";
            }
            if(invoiceRequestsFilter.isOutOfPocketActReferenceUsed()) {
                query += "left join oopi.outOfPocketActs as oopa ";
            }
            if(invoiceRequestsFilter.isOutOfPocketPaymentReferenceUsed()) {
                query += "left join oopi.outOfPocketPayments as oopp ";
            }            
        }
        //---------------------------------------
        
        query += "where ";
        query += "s in :subdepartments ";
        if(filter.isCodeUsed()) {
            query += "and pc.code like :code escape '|' ";
        }
        if(filter.isGroupIdUsed()) {
            query += "and g=:group ";
        }
        if(filter.isClientIdUsed()) {
            query += "and c=:client ";
        }
        if(filter.isOfficeIdUsed()) {
            query += "and o=:office ";
        }
        if(filter.isDepartmentIdUsed()) {
            query += "and d=:department ";
        }
        if(filter.isSubdepartmentIdUsed()) {
            query += "and s=:subdepartment ";
        }
        if(filter.isSubdepartmentNameUsed()) {
            query += "and s.name like :subdepartmentName ";
        }
        if(filter.isActivityIdUsed()) {
            query += "and a=:activity ";
        }
        if(filter.isActivityNameUsed()) {
            query += "and a.name like :activityName ";
        }
       
        if(filter.isInChargePersonIdUsed()) {
            query += "and icp=:inChargePerson ";
        }
        if(filter.isInChargePartnerIdUsed()) {
            query += "and icpat=:inChargePartner ";
        }
        if(filter.isCreatedByIdUsed()) {
            query += "and cb=:createdBy ";
        }
        if(filter.isClosedByIdUsed()) {
            query += "and clb=:closedBy ";
        }        
        if(filter.isDescriptionUsed()) {
            query += "and pc.description=:description ";
        }
        if(filter.isCommentUsed()) {
            query += "and pc.comment=:comment ";
        }
        if(filter.isYearUsed()) {
            query += "and pc.year=:year ";
        }
        if(filter.isFinancialYearUsed()) {
            query += "and pc.financialYear=:financialYear ";
        }
        if(filter.isClosedUsed()) {
            query += "and pc.isClosed=:isClosed ";
        }
        if(filter.isFutureUsed()) {
            query += "and pc.isFuture=:isFuture ";
        }
        if(filter.isDeadUsed()) {
            query += "and pc.isDead=:isDead ";
        }
        if(filter.isHiddenUsed()) {
            query += "and pc.isHidden=:isHidden ";
        }
        if(conflictCheckingSubdepartments == null) {
            if(filter.isProjectCodeConflictStatusUsed()) {
                query += "and pc.conflictStatus=:projectCodeConflictStatus ";
            }    
        } else {
            if(filter.isProjectCodeConflictStatusUsed()) {
                query += "and pcc.status=:projectCodeConflictStatus ";
            }    
            query += "and pcc.checkingSubdepartment in (:conflictCheckingSubdepartments) ";
        }
        if(filter.isPeriodTypeUsed()) {
            query += "and pc.periodType=:periodType ";
        }
        if(filter.isPeriodQuarterUsed()) {
            query += "and pc.periodQuarter=:periodQuarter ";
        }
        if(filter.isPeriodMonthUsed()) {
            query += "and pc.periodMonth=:periodMonth ";
        }
        if(filter.isPeriodDateUsed()) {
            query += "and pc.periodDate=:periodDate ";
        }
        if(filter.isPeriodCounterUsed()) {
            query += "and pc.periodCounter=:periodCounter ";
        }
        if(filter.isFromOfCreatedAtRangeUsed()) {
            query += "and pc.createdAt>=:createdAtFrom ";
        }
        if(filter.isToOfCreatedAtRangeUsed()) {
            query += "and pc.createdAt<=:createdAtTo ";
        }
        if(filter.isFromOfClosedAtRangeUsed()) {
            query += "and pc.closedAt>=:closedAtFrom ";
        }
        if(filter.isToOfClosedAtRangeUsed()) {
            query += "and pc.closedAt<=:closedAtTo ";
        }
        if(filter.isFromOfStartDateRangeUsed()) {
            query += "and pc.startDate>=:startDateFrom ";
        }
        if(filter.isToOfStartDateRangeUsed()) {
            query += "and pc.startDate<=:startDateTo ";
        }
        if(filter.isFromOfEndDateRangeUsed()) {
            query += "and pc.endDate>=:endDateFrom ";
        }
        if(filter.isToOfEndDateRangeUsed()) {
            query += "and pc.endDate<=:endDateTo ";
        }
        
        //=====================================             
        if(invoiceRequestsFilter.isHasSuspendedRequestsUsed()) {
            query += "and (irp.status=:suspended or oopr.status=:suspended) ";
        }
        if(invoiceRequestsFilter.isHasActiveRequestsUsed()) {
            query += "and (irp.status=:active or oopr.status=:active) ";
        }
        if(invoiceRequestsFilter.isHasLockedRequestsUsed()) {
            query += "and (irp.status=:locked or oopr.status=:locked) ";
        }
        if(invoiceRequestsFilter.isHasClosedRequestsUsed()) {
            query += "and (irp.status=:closed or oopr.status=:closed) ";
        }     
        
        if(invoiceRequestsFilter.isInvoiceReferenceUsed()) {
            query += "and fin.reference like :finReference  ";
        }
        if(invoiceRequestsFilter.isActReferenceUsed()) {
            query += "and fa.reference like :faReference  ";
        }
        if(invoiceRequestsFilter.isPaymentReferenceUsed()) {
            query += "and fp.reference like :fpReference  ";
        }
        if(invoiceRequestsFilter.isOutOfPocketInvoiceReferenceUsed()) {
            query += "and oopin.reference like :oopinReference  ";
        }
        if(invoiceRequestsFilter.isOutOfPocketActReferenceUsed()) {
            query += "and oopa.reference like :oopaReference  ";
        }
        if(invoiceRequestsFilter.isOutOfPocketPaymentReferenceUsed()) {
            query += "and oopp.reference like :ooppReference  ";
        }
        
        if(invoiceRequestsFilter.isDateUsed()) {
            query += "and ( ";
            if(invoiceRequestsFilter.isStartDateUsed() && ! invoiceRequestsFilter.isEndDateUsed()) {
                query += "ir.date>=:startDate ";
                query += "or ar.date>=:startDate ";
            } else if(! invoiceRequestsFilter.isStartDateUsed() && invoiceRequestsFilter.isEndDateUsed()) {
                query += "ir.date<=:endDate ";
                query += "or ar.date<=:endDate ";           
            } else if(invoiceRequestsFilter.isStartDateUsed() && invoiceRequestsFilter.isEndDateUsed()) {
                query += "(ir.date>=:startDate and ir.date<=:endDate) ";
                query += "or (ar.date>=:startDate and ar.date<=:endDate) ";          
            }
            query += ") ";
        }
        //======================================
        
        query += "group by pc ";
        if(invoiceRequestsFilter.isHasRequestsUsed()) {
            query += "having ";
            if(InvoiceRequestsFilter.BooleanExtended.FALSE.equals(invoiceRequestsFilter.getHasRequests())) {
                query += "count(irp)=0 and count(oopr)=0 ";
            } else if(InvoiceRequestsFilter.BooleanExtended.TRUE.equals(invoiceRequestsFilter.getHasRequests())) {
                query += "(count(irp)>0 or count(oopr)>0) ";
                if(InvoiceRequestsFilter.BooleanExtended.TRUE.equals(invoiceRequestsFilter.getHasInvoiceRequests())) {
                    query += "and count(ir)>0 ";
                } else if(InvoiceRequestsFilter.BooleanExtended.FALSE.equals(invoiceRequestsFilter.getHasInvoiceRequests())) {
                    query += "and count(ir)=0 ";
                }
                if(InvoiceRequestsFilter.BooleanExtended.TRUE.equals(invoiceRequestsFilter.getHasActRequests())) {
                    query += "and count(ar)=count(irp) ";
                } else if(InvoiceRequestsFilter.BooleanExtended.FALSE.equals(invoiceRequestsFilter.getHasActRequests())) {
                    query += "and count(ar)<count(irp) ";
                }
                if(InvoiceRequestsFilter.BooleanExtended.TRUE.equals(invoiceRequestsFilter.getHasTaxInvoiceRequests())) {
                    query += "and count(tir)=count(irp) ";
                } else if(InvoiceRequestsFilter.BooleanExtended.FALSE.equals(invoiceRequestsFilter.getHasTaxInvoiceRequests())) {
                    query += "and count(tir)<count(irp) ";
                }
                
            }
        }
        
        if(sorter.isUsed()) {
            query += "order by ";
            if(sorter.isCodeUsed()) {
                query += "pc.code ";
            }
            if(sorter.isGroupUsed()) {
                query += "g.name ";
            }
            if(sorter.isClientUsed()) {
                query += "c.name ";
            }
            if(sorter.isOfficeUsed()) {
                query += "o.name ";
            }
            if(sorter.isSubdepartmentUsed()) {
                query += "s.name ";
            }
            if(sorter.isActivityUsed()) {
                query += "a.name ";
            }
            if(sorter.isInChargePersonUsed()) {
                query += "icp.userName ";
            }
            if(sorter.isInChargePartnerUsed()) {
                query += "icpat.userName ";
            }
            if(sorter.isYearUsed()) {
                query += "pc.year ";
            }
            if(sorter.isFinancialYearUsed()) {
                query += "pc.financialYear ";
            }
            if(sorter.isPeriodTypeUsed()) {
                query += "pc.periodType ";
            }
            if(sorter.isPeriodQuarterUsed()) {
                query += "pc.periodQuarter ";
            }
            if(sorter.isPeriodMonthUsed()) {
                query += "pc.periodMonth ";
            }
            if(sorter.isPeriodDateUsed()) {
                query += "pc.periodDate ";
            }
            if(sorter.isPeriodCounterUsed()) {
                query += "pc.periodCounter ";
            }
            if(sorter.isCreatedAtUsed()) {
                query += "pc.createdAt ";
            }
            if(sorter.isCreatedByUsed()) {
                query += "cb.userName ";
            }
            if(sorter.isClosedByUsed()) {
                query += "clb.userName ";
            }            
            if(sorter.isClosedUsed()) {
                query += "pc.isClosed ";
            }
            if(sorter.isClosedAtUsed()) {
                query += "pc.closedAt ";
            }
            if(sorter.isStartDateUsed()) {
                query += "pc.startDate ";
            }
            if(sorter.isEndDateUsed()) {
                query += "pc.endDate ";
            }
            if(sorter.isFutureUsed()) {
                query += "pc.isFuture ";
            }
            if(sorter.isDeadUsed()) {
                query += "pc.isDead ";
            }
            if(sorter.isDescriptionUsed()) {
                query += "pc.description ";
            }
            if(sorter.isCommentUsed()) {
                query += "pc.comment ";
            }
            if(sorter.getOrder() != null) {
                query += "" + sorter.getOrder() + " ";
            }
        }
        return query;
    }
    protected static String getHQLForCountOfProjectCodeFilteredList(ProjectCodeListFilter filter, InvoiceRequestsFilter invoiceRequestsFilter, List<Subdepartment> subdepartments, List<Subdepartment> conflictCheckingSubdepartments) {
        String query = "";
        query += "select count(pc2) from ProjectCode as pc2 where pc2.id in ( ";
        
        query += "select pc.id from ProjectCode as pc ";
        query += "inner join pc.subdepartment as s inner join s.department as d inner join d.office as o ";
        if(filter.isGroupIdUsed()) {
            query += "inner join pc.client as c left join c.group as g ";
        } else if(filter.isClientIdUsed()) {
            query += "inner join pc.client as c ";
        }
        if(filter.isActivityIdUsed() || filter.isActivityNameUsed()) {
            query += "inner join pc.activity as a ";
        }
        if(filter.isInChargePersonIdUsed()) {
            query += "left join pc.inChargePerson as icp ";
        }
        if(filter.isInChargePartnerIdUsed()) {
            query += "left join pc.inChargePartner as icpat ";
        }
        if(filter.isCreatedByIdUsed()) {
            query += "left join pc.createdBy as cb ";
        }
        if(filter.isClosedByIdUsed()) {
            query += "left join pc.closedBy as clb ";
        }
        if(conflictCheckingSubdepartments != null) {
            query += "inner join pc.projectCodeConflicts as pcc ";
        }        
        //---------------------------------------
        if(invoiceRequestsFilter.isRequestUsed() || invoiceRequestsFilter.isDateUsed()) {
            query += "left join pc.invoiceRequestPackets as irp ";
            query += "left join pc.outOfPocketRequest as oopr ";
            if(invoiceRequestsFilter.isDateUsed() || invoiceRequestsFilter.isHasInvoiceRequestsUsed()) {
                query += "left join irp.invoiceRequests as ir ";
            }
            if(invoiceRequestsFilter.isDateUsed() || invoiceRequestsFilter.isHasActRequestsUsed()) {
                query += "left join irp.actRequest as ar ";
            }
            if(invoiceRequestsFilter.isHasTaxInvoiceRequestsUsed()) {
                query += "left join irp.taxInvoiceRequest as tir ";
            }
        }
        //---------------------------------------
        if(invoiceRequestsFilter.isFeesReferenceUsed()) {
            query += "left join pc.feesItem as fi ";
            if(invoiceRequestsFilter.isInvoiceReferenceUsed()) {
                query += "left join fi.feesInvoices as fin ";
            }
            if(invoiceRequestsFilter.isActReferenceUsed()) {
                query += "left join fi.feesActs as fa ";
            }
            if(invoiceRequestsFilter.isPaymentReferenceUsed()) {
                query += "left join fi.feesPayments as fp ";
            }
        }
        //---------------------------------------
        if(invoiceRequestsFilter.isOutOfPocketReferenceUsed()) {
            query += "left join pc.outOfPocketItem as oopi ";
            if(invoiceRequestsFilter.isOutOfPocketInvoiceReferenceUsed()) {
                query += "left join oopi.outOfPocketInvoices as oopin ";
            }
            if(invoiceRequestsFilter.isOutOfPocketActReferenceUsed()) {
                query += "left join oopi.outOfPocketActs as oopa ";
            }
            if(invoiceRequestsFilter.isOutOfPocketPaymentReferenceUsed()) {
                query += "left join oopi.outOfPocketPayments as oopp ";
            }            
        }
        //---------------------------------------
                
        query += "where ";
        query += "s in :subdepartments ";
        if(filter.isCodeUsed()) {
            query += "and pc.code like :code escape '|' ";
        }
        if(filter.isGroupIdUsed()) {
            query += "and g=:group ";
        }
        if(filter.isClientIdUsed()) {
            query += "and c=:client ";
        }
        if(filter.isOfficeIdUsed()) {
            query += "and o=:office ";
        }
        if(filter.isDepartmentIdUsed()) {
            query += "and d=:department ";
        }
        if(filter.isSubdepartmentIdUsed()) {
            query += "and s=:subdepartment ";
        }
        if(filter.isSubdepartmentNameUsed()) {
            query += "and s.name like :subdepartmentName ";
        }        
        if(filter.isActivityIdUsed()) {
            query += "and a=:activity ";
        }
        if(filter.isActivityNameUsed()) {
            query += "and a.name like :activityName ";
        }        
        if(filter.isInChargePersonIdUsed()) {
            query += "and icp=:inChargePerson ";
        }
        if(filter.isInChargePartnerIdUsed()) {
            query += "and icpat=:inChargePartner ";
        }
        if(filter.isCreatedByIdUsed()) {
            query += "and cb=:createdBy ";
        }
        if(filter.isClosedByIdUsed()) {
            query += "and clb=:closedBy ";
        }
        if(filter.isDescriptionUsed()) {
            query += "and pc.description=:description ";
        }
        if(filter.isCommentUsed()) {
            query += "and pc.comment=:comment ";
        }
        if(filter.isYearUsed()) {
            query += "and pc.year=:year ";
        }
        if(filter.isFinancialYearUsed()) {
            query += "and pc.financialYear=:financialYear ";
        }
        if(filter.isClosedUsed()) {
            query += "and pc.isClosed=:isClosed ";
        }
        if(filter.isFutureUsed()) {
            query += "and pc.isFuture=:isFuture ";
        }
        if(filter.isDeadUsed()) {
            query += "and pc.isDead=:isDead ";
        }
        if(filter.isHiddenUsed()) {
            query += "and pc.isHidden=:isHidden ";
        }

        if(conflictCheckingSubdepartments == null) {
            if(filter.isProjectCodeConflictStatusUsed()) {
                query += "and pc.conflictStatus=:projectCodeConflictStatus ";
            }    
        } else {
            if(filter.isProjectCodeConflictStatusUsed()) {
                query += "and pcc.status=:projectCodeConflictStatus ";
            }    
            query += "and pcc.checkingSubdepartment in (:conflictCheckingSubdepartments) ";
        }
        
        if(filter.isPeriodTypeUsed()) {
            query += "and pc.periodType=:periodType ";
        }
        if(filter.isPeriodQuarterUsed()) {
            query += "and pc.periodQuarter=:periodQuarter ";
        }
        if(filter.isPeriodMonthUsed()) {
            query += "and pc.periodMonth=:periodMonth ";
        }
        if(filter.isPeriodDateUsed()) {
            query += "and pc.periodDate=:periodDate ";
        }
        if(filter.isPeriodCounterUsed()) {
            query += "and pc.periodCounter=:periodCounter ";
        }
        if(filter.isFromOfCreatedAtRangeUsed()) {
            query += "and pc.createdAt>=:createdAtFrom ";
        }
        if(filter.isToOfCreatedAtRangeUsed()) {
            query += "and pc.createdAt<=:createdAtTo ";
        }
        if(filter.isFromOfClosedAtRangeUsed()) {
            query += "and pc.closedAt>=:closedAtFrom ";
         }
        if(filter.isToOfClosedAtRangeUsed()) {
            query += "and pc.closedAt<=:closedAtTo ";
        }
        if(filter.isFromOfStartDateRangeUsed()) {
            query += "and pc.startDate>=:startDateFrom ";
        }
        if(filter.isToOfStartDateRangeUsed()) {
            query += "and pc.startDate<=:startDateTo ";
        }
        if(filter.isFromOfEndDateRangeUsed()) {
            query += "and pc.endDate>=:endDateFrom ";
        }
        if(filter.isToOfEndDateRangeUsed()) {
            query += "and pc.endDate<=:endDateTo ";
        }
        
        if(invoiceRequestsFilter.isHasSuspendedRequestsUsed()) {
            query += "and (irp.status=:suspended or oopr.status=:suspended) ";
        }
        if(invoiceRequestsFilter.isHasActiveRequestsUsed()) {
            query += "and (irp.status=:active or oopr.status=:active) ";
        }
        if(invoiceRequestsFilter.isHasLockedRequestsUsed()) {
            query += "and (irp.status=:locked or oopr.status=:locked) ";
        }
        if(invoiceRequestsFilter.isHasClosedRequestsUsed()) {
            query += "and (irp.status=:closed or oopr.status=:closed) ";
        }
        
        if(invoiceRequestsFilter.isInvoiceReferenceUsed()) {
            query += "and fin.reference like :finReference  ";
        }
        if(invoiceRequestsFilter.isActReferenceUsed()) {
            query += "and fa.reference like :faReference  ";
        }
        if(invoiceRequestsFilter.isPaymentReferenceUsed()) {
            query += "and fp.reference like :fpReference  ";
        }
        if(invoiceRequestsFilter.isOutOfPocketInvoiceReferenceUsed()) {
            query += "and oopin.reference like :oopinReference  ";
        }
        if(invoiceRequestsFilter.isOutOfPocketActReferenceUsed()) {
            query += "and oopa.reference like :oopaReference  ";
        }
        if(invoiceRequestsFilter.isOutOfPocketPaymentReferenceUsed()) {
            query += "and oopp.reference like :ooppReference  ";
        }
        
        if(invoiceRequestsFilter.isDateUsed()) {
            query += "and ( ";
            if(invoiceRequestsFilter.isStartDateUsed() && ! invoiceRequestsFilter.isEndDateUsed()) {
                query += "ir.date>=:startDate ";
                query += "or ar.date>=:startDate ";
            } else if(! invoiceRequestsFilter.isStartDateUsed() && invoiceRequestsFilter.isEndDateUsed()) {
                query += "ir.date<=:endDate ";
                query += "or ar.date<=:endDate ";         
            } else if(invoiceRequestsFilter.isStartDateUsed() && invoiceRequestsFilter.isEndDateUsed()) {
                query += "(ir.date>=:startDate and ir.date<=:endDate) ";
                query += "or (ar.date>=:startDate and ar.date<=:endDate) ";   
            }
            query += ") ";
        }
        
        query += "group by pc ";
        if(invoiceRequestsFilter.isHasRequestsUsed()) {
            query += "having ";
            if(InvoiceRequestsFilter.BooleanExtended.FALSE.equals(invoiceRequestsFilter.getHasRequests())) {
                query += "count(irp)=0 and count(oopr)=0 ";
            } else if(InvoiceRequestsFilter.BooleanExtended.TRUE.equals(invoiceRequestsFilter.getHasRequests())) {
                query += "(count(irp)>0 or count(oopr)>0) ";
                if(InvoiceRequestsFilter.BooleanExtended.TRUE.equals(invoiceRequestsFilter.getHasInvoiceRequests())) {
                    query += "and count(ir)>0 ";
                } else if(InvoiceRequestsFilter.BooleanExtended.FALSE.equals(invoiceRequestsFilter.getHasInvoiceRequests())) {
                    query += "and count(ir)=0 ";
                }
                if(InvoiceRequestsFilter.BooleanExtended.TRUE.equals(invoiceRequestsFilter.getHasActRequests())) {
                    query += "and count(ar)=count(irp) ";
                } else if(InvoiceRequestsFilter.BooleanExtended.FALSE.equals(invoiceRequestsFilter.getHasActRequests())) {
                    query += "and count(ar)<count(irp) ";
                }
                if(InvoiceRequestsFilter.BooleanExtended.TRUE.equals(invoiceRequestsFilter.getHasTaxInvoiceRequests())) {
                    query += "and count(tir)=count(irp) ";
                } else if(InvoiceRequestsFilter.BooleanExtended.FALSE.equals(invoiceRequestsFilter.getHasTaxInvoiceRequests())) {
                    query += "and count(tir)<count(irp) ";
                }
                
            }
        }
        
        query += ")"; //end of subselect
        
        return query;
    }
    
    protected static void setParametersForProjectCodeFilteredList(Query hq, ProjectCodeListFilter filter, InvoiceRequestsFilter invoiceRequestsFilter, List<Subdepartment> subdepartments, List<Subdepartment> conflictCheckingSubdepartments) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(filter.isCodeUsed()) {
            String code = filter.getCode().replaceAll("_", "|_").replaceAll("\\*", "%");
            if(! code.startsWith("%")) {
                code = ("%" + code);
            }
            if(! code.endsWith("%")) {
                code += "%";
            }            
            hq.setParameter("code", code);
        }
        if(filter.isGroupIdUsed()) {
            Group group = (Group)hs.get(Group.class, filter.getGroupId());
            hq.setParameter("group", group);
        }
        if(filter.isClientIdUsed()) {
            Client client = (Client)hs.get(Client.class, filter.getClientId());
            hq.setParameter("client", client);
        }
        if(filter.isOfficeIdUsed()) {
            Office office = (Office)hs.get(Office.class, filter.getOfficeId());
            hq.setParameter("office", office);
        }
        if(filter.isDepartmentIdUsed()) {
            Department department = (Department)hs.get(Department.class, filter.getDepartmentId());
            hq.setParameter("department", department);
        }
        if(filter.isSubdepartmentIdUsed()) {
            Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, filter.getSubdepartmentId());
            hq.setParameter("subdepartment", subdepartment);
        }
        if(filter.isSubdepartmentNameUsed()) {
            String subdepartmentName = filter.getSubdepartmentName().replaceAll("\\*", "%");
            hq.setParameter("subdepartmentName", subdepartmentName);
        }
        if(filter.isActivityIdUsed()) {
            Activity activity = (Activity)hs.get(Activity.class, filter.getActivityId());
            hq.setParameter("activity", activity);
        }
        if(filter.isActivityNameUsed()) {
            String activityName = filter.getActivityName().replaceAll("\\*", "%");
            hq.setParameter("activityName", activityName);
        }        
        if(filter.isInChargePersonIdUsed()) {
            Employee inChargePerson = (Employee)hs.get(Employee.class, filter.getInChargePersonId());
            hq.setParameter("inChargePerson", inChargePerson);
        }
        if(filter.isInChargePartnerIdUsed()) {
            Employee inChargePartner = (Employee)hs.get(Employee.class, filter.getInChargePartnerId());
            hq.setParameter("inChargePartner", inChargePartner);
        }        
        if(filter.isCreatedByIdUsed()) {
            Employee createdBy = (Employee)hs.get(Employee.class, filter.getCreatedById());
            hq.setParameter("createdBy", createdBy);
        }
        if(filter.isClosedByIdUsed()) {
            Employee closedBy = (Employee)hs.get(Employee.class, filter.getClosedById());
            hq.setParameter("closedBy", closedBy);
        }
        
        if(filter.isDescriptionUsed()) {
            hq.setParameter("description", filter.getDescription());
        }
        if(filter.isCommentUsed()) {
            hq.setParameter("comment", filter.getComment());
        }
        if(filter.isYearUsed()) {
            hq.setParameter("year", filter.getYear());
        }
        if(filter.isFinancialYearUsed()) {
            hq.setParameter("financialYear", filter.getFinancialYear());
        }
        if(filter.isClosedUsed()) {
            hq.setBoolean("isClosed", new Boolean(filter.getIsClosed().toString()));
        }
        if(filter.isFutureUsed()) {
            hq.setBoolean("isFuture", new Boolean(filter.getIsFuture().toString()));
        }
        if(filter.isDeadUsed()) {
            hq.setBoolean("isDead", new Boolean(filter.getIsDead().toString()));
        }
        if(filter.isHiddenUsed()) {
            hq.setBoolean("isHidden", new Boolean(filter.getIsHidden().toString()));
        }
        if(filter.isProjectCodeConflictStatusUsed()) {
            hq.setParameter("projectCodeConflictStatus", filter.getProjectCodeConflictStatus());
        }
        if(conflictCheckingSubdepartments != null) {
            hq.setParameterList("conflictCheckingSubdepartments", conflictCheckingSubdepartments);
        }
        if(filter.isPeriodTypeUsed()) {
            hq.setParameter("periodType", ProjectCode.PeriodType.valueOf(filter.getPeriodType().toString()));
        }
        if(filter.isPeriodQuarterUsed()) {
            hq.setParameter("periodQuarter", ProjectCode.PeriodQuarter.valueOf(filter.getPeriodQuarter().toString()));
        }
        if(filter.isPeriodMonthUsed()) {
            hq.setParameter("periodMonth", ProjectCode.PeriodMonth.valueOf(filter.getPeriodMonth().toString()));
        }
        if(filter.isPeriodDateUsed()) {
            hq.setParameter("periodDate", ProjectCode.PeriodDate.valueOf(filter.getPeriodDate().toString()));
        }
        if(filter.isPeriodCounterUsed()) {
            hq.setInteger("periodCounter", filter.getPeriodCounter());
        }
        if(filter.isFromOfCreatedAtRangeUsed()) {
            hq.setCalendar("createdAtFrom", filter.getCreatedAtRange().getFrom().getCalendar());
        }
        if(filter.isToOfCreatedAtRangeUsed()) {
            hq.setCalendar("createdAtTo", filter.getCreatedAtRange().getTo().getShifted(1).getCalendar());
        }
        if(filter.isFromOfClosedAtRangeUsed()) {
            hq.setCalendar("closedAtFrom", filter.getClosedAtRange().getFrom().getCalendar());
        }
        if(filter.isToOfClosedAtRangeUsed()) {
            hq.setCalendar("closedAtTo", filter.getClosedAtRange().getTo().getShifted(1).getCalendar());
        }
        if(filter.isFromOfStartDateRangeUsed()) {
            hq.setCalendar("startDateFrom", filter.getStartDateRange().getFrom().getCalendar());
        }
        if(filter.isToOfStartDateRangeUsed()) {
            hq.setCalendar("startDateTo", filter.getStartDateRange().getTo().getShifted(1).getCalendar());
        }
        if(filter.isFromOfEndDateRangeUsed()) {
            hq.setCalendar("endDateFrom", filter.getEndDateRange().getFrom().getCalendar());
        }
        if(filter.isToOfEndDateRangeUsed()) {
            hq.setCalendar("endDateTo", filter.getEndDateRange().getTo().getShifted(1).getCalendar());
        }
        //-------------------
        if(invoiceRequestsFilter.isHasSuspendedRequestsUsed()) {
            hq.setParameter("suspended", InvoiceRequestPacket.Status.SUSPENDED);
        }
        if(invoiceRequestsFilter.isHasActiveRequestsUsed()) {
            hq.setParameter("active", InvoiceRequestPacket.Status.ACTIVE);
        }
        if(invoiceRequestsFilter.isHasLockedRequestsUsed()) {
            hq.setParameter("locked", InvoiceRequestPacket.Status.LOCKED);
        }
        if(invoiceRequestsFilter.isHasClosedRequestsUsed()) {
            hq.setParameter("closed", InvoiceRequestPacket.Status.CLOSED);
        }
        if(invoiceRequestsFilter.isInvoiceReferenceUsed()) {
            String reference = invoiceRequestsFilter.getInvoiceReference().replaceAll("\\*", "%");
            hq.setParameter("finReference", reference);
        }
        if(invoiceRequestsFilter.isActReferenceUsed()) {
            String reference = invoiceRequestsFilter.getActReference().replaceAll("\\*", "%");
            hq.setParameter("faReference", reference);
        }
        if(invoiceRequestsFilter.isPaymentReferenceUsed()) {
            String reference = invoiceRequestsFilter.getPaymentReference().replaceAll("\\*", "%");
            hq.setParameter("fpReference", reference);
        }
        
        if(invoiceRequestsFilter.isOutOfPocketInvoiceReferenceUsed()) {
            String reference = invoiceRequestsFilter.getOutOfPocketInvoiceReference().replaceAll("\\*", "%");
            hq.setParameter("oopinReference", reference);
        }
        if(invoiceRequestsFilter.isOutOfPocketActReferenceUsed()) {
            String reference = invoiceRequestsFilter.getOutOfPocketActReference().replaceAll("\\*", "%");
            hq.setParameter("oopaReference", reference);
        }
        if(invoiceRequestsFilter.isOutOfPocketPaymentReferenceUsed()) {
            String reference = invoiceRequestsFilter.getOutOfPocketPaymentReference().replaceAll("\\*", "%");
            hq.setParameter("ooppReference", reference);
        }        
        if(invoiceRequestsFilter.isStartDateUsed()) {
            hq.setParameter("startDate", invoiceRequestsFilter.getStartDate().getCalendar());
        }
        if(invoiceRequestsFilter.isEndDateUsed()) {
            hq.setParameter("endDate", invoiceRequestsFilter.getEndDate().getCalendar());
        }
        //-------------------
        hq.setParameterList("subdepartments", subdepartments);
    }
    protected static void setParametersForCountOfProjectCodeFilteredList(Query hq, ProjectCodeListFilter filter, InvoiceRequestsFilter invoiceRequestsFilter, List<Subdepartment> subdepartments, List<Subdepartment> conflictCheckingSubdepartments) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(filter.isCodeUsed()) {
            String code = filter.getCode().replaceAll("_", "|_").replaceAll("\\*", "%");
            if(! code.startsWith("%")) {
                code = ("%" + code);
            }
            if(! code.endsWith("%")) {
                code += "%";
            }
            hq.setParameter("code", code);
        }
        if(filter.isGroupIdUsed()) {
            Group group = (Group)hs.get(Group.class, filter.getGroupId());
            hq.setParameter("group", group);
        }
        if(filter.isClientIdUsed()) {
            Client client = (Client)hs.get(Client.class, filter.getClientId());
            hq.setParameter("client", client);
        }
        if(filter.isOfficeIdUsed()) {
            Office office = (Office)hs.get(Office.class, filter.getOfficeId());
            hq.setParameter("office", office);
        }
        if(filter.isDepartmentIdUsed()) {
            Department department = (Department)hs.get(Department.class, filter.getDepartmentId());
            hq.setParameter("department", department);
        }
        if(filter.isSubdepartmentIdUsed()) {
            Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, filter.getSubdepartmentId());
            hq.setParameter("subdepartment", subdepartment);
        }
        if(filter.isSubdepartmentNameUsed()) {
            String subdepartmentName = filter.getSubdepartmentName().replaceAll("\\*", "%");
            hq.setParameter("subdepartmentName", subdepartmentName);
        }        
        if(filter.isActivityIdUsed()) {
            Activity activity = (Activity)hs.get(Activity.class, filter.getActivityId());
            hq.setParameter("activity", activity);
        }
        if(filter.isActivityNameUsed()) {
            String activityName = filter.getActivityName().replaceAll("\\*", "%");
            hq.setParameter("activityName", activityName);
        }           
        if(filter.isInChargePersonIdUsed()) {
            Employee inChargePerson = (Employee)hs.get(Employee.class, filter.getInChargePersonId());
            hq.setParameter("inChargePerson", inChargePerson);
        }
        if(filter.isInChargePartnerIdUsed()) {
            Employee inChargePartner = (Employee)hs.get(Employee.class, filter.getInChargePartnerId());
            hq.setParameter("inChargePartner", inChargePartner);
        }
        if(filter.isCreatedByIdUsed()) {
            Employee createdBy = (Employee)hs.get(Employee.class, filter.getCreatedById());
            hq.setParameter("createdBy", createdBy);
        }
        if(filter.isClosedByIdUsed()) {
            Employee closedBy = (Employee)hs.get(Employee.class, filter.getClosedById());
            hq.setParameter("closedBy", closedBy);
        }
        
        
        if(filter.isDescriptionUsed()) {
            hq.setParameter("description", filter.getDescription());
        }
        if(filter.isCommentUsed()) {
            hq.setParameter("comment", filter.getComment());
        }        
        if(filter.isYearUsed()) {
            hq.setParameter("year", filter.getYear());
        }
        if(filter.isFinancialYearUsed()) {
            hq.setParameter("financialYear", filter.getFinancialYear());
        }
        if(filter.isClosedUsed()) {
            hq.setBoolean("isClosed", new Boolean(filter.getIsClosed().toString()));
        }
        if(filter.isFutureUsed()) {
            hq.setBoolean("isFuture", new Boolean(filter.getIsFuture().toString()));
        }
        if(filter.isDeadUsed()) {
            hq.setBoolean("isDead", new Boolean(filter.getIsDead().toString()));
        }
        if(filter.isHiddenUsed()) {
            hq.setBoolean("isHidden", new Boolean(filter.getIsHidden().toString()));
        }
        if(filter.isProjectCodeConflictStatusUsed()) {
            hq.setParameter("projectCodeConflictStatus", filter.getProjectCodeConflictStatus());
        }
        if(conflictCheckingSubdepartments != null) {
            hq.setParameterList("conflictCheckingSubdepartments", conflictCheckingSubdepartments);
        }

        if(filter.isPeriodTypeUsed()) {
            hq.setParameter("periodType", ProjectCode.PeriodType.valueOf(filter.getPeriodType().toString()));
        }
        if(filter.isPeriodQuarterUsed()) {
            hq.setParameter("periodQuarter", ProjectCode.PeriodQuarter.valueOf(filter.getPeriodQuarter().toString()));
        }
        if(filter.isPeriodMonthUsed()) {
            hq.setParameter("periodMonth", ProjectCode.PeriodMonth.valueOf(filter.getPeriodMonth().toString()));
        }
        if(filter.isPeriodDateUsed()) {
            hq.setParameter("periodDate", ProjectCode.PeriodDate.valueOf(filter.getPeriodDate().toString()));
        }
        if(filter.isPeriodCounterUsed()) {
            hq.setInteger("periodCounter", filter.getPeriodCounter());
        }
        if(filter.isFromOfCreatedAtRangeUsed()) {
            hq.setCalendar("createdAtFrom", filter.getCreatedAtRange().getFrom().getCalendar());
        }
        if(filter.isToOfCreatedAtRangeUsed()) {
            hq.setCalendar("createdAtTo", filter.getCreatedAtRange().getTo().getShifted(1).getCalendar());
        }
        if(filter.isFromOfClosedAtRangeUsed()) {
            hq.setCalendar("closedAtFrom", filter.getClosedAtRange().getFrom().getCalendar());
        }
        if(filter.isToOfClosedAtRangeUsed()) {
            hq.setCalendar("closedAtTo", filter.getClosedAtRange().getTo().getShifted(1).getCalendar());
        }
        if(filter.isFromOfStartDateRangeUsed()) {
            hq.setCalendar("startDateFrom", filter.getStartDateRange().getFrom().getCalendar());
        }
        if(filter.isToOfStartDateRangeUsed()) {
            hq.setCalendar("startDateTo", filter.getStartDateRange().getTo().getShifted(1).getCalendar());
        }
        if(filter.isFromOfEndDateRangeUsed()) {
            hq.setCalendar("endDateFrom", filter.getEndDateRange().getFrom().getCalendar());
        }
        if(filter.isToOfEndDateRangeUsed()) {
            hq.setCalendar("endDateTo", filter.getEndDateRange().getTo().getShifted(1).getCalendar());
        }
        //-------------------
        if(invoiceRequestsFilter.isHasSuspendedRequestsUsed()) {
            hq.setParameter("suspended", InvoiceRequestPacket.Status.SUSPENDED);
        }
        if(invoiceRequestsFilter.isHasActiveRequestsUsed()) {
            hq.setParameter("active", InvoiceRequestPacket.Status.ACTIVE);
        }
        if(invoiceRequestsFilter.isHasLockedRequestsUsed()) {
            hq.setParameter("locked", InvoiceRequestPacket.Status.LOCKED);
        }
        if(invoiceRequestsFilter.isHasClosedRequestsUsed()) {
            hq.setParameter("closed", InvoiceRequestPacket.Status.CLOSED);
        }
        if(invoiceRequestsFilter.isInvoiceReferenceUsed()) {
            String reference = invoiceRequestsFilter.getInvoiceReference().replaceAll("\\*", "%");
            hq.setParameter("finReference", reference);
        }
        if(invoiceRequestsFilter.isActReferenceUsed()) {
            String reference = invoiceRequestsFilter.getActReference().replaceAll("\\*", "%");
            hq.setParameter("faReference", reference);
        }
        if(invoiceRequestsFilter.isPaymentReferenceUsed()) {
            String reference = invoiceRequestsFilter.getPaymentReference().replaceAll("\\*", "%");
            hq.setParameter("fpReference", reference);
        }
        
        if(invoiceRequestsFilter.isOutOfPocketInvoiceReferenceUsed()) {
            String reference = invoiceRequestsFilter.getOutOfPocketInvoiceReference().replaceAll("\\*", "%");
            hq.setParameter("oopinReference", reference);
        }
        if(invoiceRequestsFilter.isOutOfPocketActReferenceUsed()) {
            String reference = invoiceRequestsFilter.getOutOfPocketActReference().replaceAll("\\*", "%");
            hq.setParameter("oopaReference", reference);
        }
        if(invoiceRequestsFilter.isOutOfPocketPaymentReferenceUsed()) {
            String reference = invoiceRequestsFilter.getOutOfPocketPaymentReference().replaceAll("\\*", "%");
            hq.setParameter("ooppReference", reference);
        }    
        
        if(invoiceRequestsFilter.isStartDateUsed()) {
            hq.setParameter("startDate", invoiceRequestsFilter.getStartDate().getCalendar());
        }
        if(invoiceRequestsFilter.isEndDateUsed()) {
            hq.setParameter("endDate", invoiceRequestsFilter.getEndDate().getCalendar());
        }
        
        //-------------------        
        hq.setParameterList("subdepartments", subdepartments);
    }
    public static List<ProjectCode> getProjectCodeFilteredList(ProjectCodeListFilter filter, InvoiceRequestsFilter invoiceRequestsFilter, ProjectCodeListSorter sorter, ProjectCodeListLimiter limiter, List<Subdepartment> allowedSubdepartments, List<Subdepartment> conflictCheckingSubdepartments) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = getHQLForProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, allowedSubdepartments, conflictCheckingSubdepartments);
        
        org.hibernate.Query hq = hs.createQuery(query);
        setParametersForProjectCodeFilteredList(hq, filter, invoiceRequestsFilter, allowedSubdepartments, conflictCheckingSubdepartments);
        if(limiter.getPage() != null && limiter.getItemsPerPage() != null) {
            hq.setFirstResult(limiter.getPage() * limiter.getItemsPerPage());
        }
        if(limiter.getItemsPerPage() != null) {
            hq.setMaxResults(limiter.getItemsPerPage());
        }
        return (List<ProjectCode>)hq.list();
    }
    public static Long getCountOfProjectCodeFilteredList(ProjectCodeListFilter filter, InvoiceRequestsFilter invoiceRequestsFilter, ProjectCodeListSorter sorter, ProjectCodeListLimiter limiter, List<Subdepartment> allowedSubdepartments, List<Subdepartment> conflictCheckingSubdepartments) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = getHQLForCountOfProjectCodeFilteredList(filter, invoiceRequestsFilter, allowedSubdepartments, conflictCheckingSubdepartments);
        
        org.hibernate.Query hq = hs.createQuery(query);
        setParametersForCountOfProjectCodeFilteredList(hq, filter, invoiceRequestsFilter, allowedSubdepartments, conflictCheckingSubdepartments);
        return (Long)hq.uniqueResult();       
    }
    public static List<ProjectCode> getProjectCodeFilteredList(ProjectCodeListFilter filter, InvoiceRequestsFilter invoiceRequestsFilter, ProjectCodeListSorter sorter, ProjectCodeListLimiter limiter, List<Subdepartment> allowedSubdepartments) {
        return getProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments, null);
    }
    public static Long getCountOfProjectCodeFilteredList(ProjectCodeListFilter filter, InvoiceRequestsFilter invoiceRequestsFilter, ProjectCodeListSorter sorter, ProjectCodeListLimiter limiter, List<Subdepartment> allowedSubdepartments) {
        return getCountOfProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments, null);
    }
    public static List<ProjectCode> getProjectCodeFilteredList(List<ProjectCode> projectCodes, ProjectCodeApprovementFilter projectCodeApprovementFilter) {
        if(! projectCodeApprovementFilter.isUsed()) {
            return projectCodes;
        }

        List<ProjectCodeApprovement.AnalysisStatus> noPrimaryApprovementStatuses = new LinkedList<ProjectCodeApprovement.AnalysisStatus>();
        noPrimaryApprovementStatuses.add(ProjectCodeApprovement.AnalysisStatus.NO_PRIMARY_APPROVEMENT);
        noPrimaryApprovementStatuses.add(ProjectCodeApprovement.AnalysisStatus.PRIMARY_APPROVEMENT_COMPROMISED);

        List<ProjectCodeApprovement.AnalysisStatus> noSecondaryApprovementStatuses = new LinkedList<ProjectCodeApprovement.AnalysisStatus>();
        noSecondaryApprovementStatuses.add(ProjectCodeApprovement.AnalysisStatus.NO_PRIMARY_APPROVEMENT);
        noSecondaryApprovementStatuses.add(ProjectCodeApprovement.AnalysisStatus.PRIMARY_APPROVEMENT_COMPROMISED);
        noSecondaryApprovementStatuses.add(ProjectCodeApprovement.AnalysisStatus.NO_SECONDARY_APPROVEMENT);
        noSecondaryApprovementStatuses.add(ProjectCodeApprovement.AnalysisStatus.SECONDARY_APPROVEMENT_COMPROMISED);

        List<ProjectCode> resultProjectCodes = new LinkedList<ProjectCode>();
        for(ProjectCode projectCode : projectCodes) {
            Map<YearMonth, ProjectCodeApprovement.AnalysisStatus> analysisStatusInfo = ProjectCodeApprovement.analyse(projectCode);
            for(YearMonth month : analysisStatusInfo.keySet()) {
                ProjectCodeApprovement.AnalysisStatus analysisStatus = analysisStatusInfo.get(month);
                if(ProjectCodeApprovementFilter.NoApprovement.NO_PRIMARY_APPROVEMENT.equals(projectCodeApprovementFilter.getNoApprovement())) {
                    if(noPrimaryApprovementStatuses.contains(analysisStatus)) {
                        resultProjectCodes.add(projectCode);
                        break;
                    }
                } else if(ProjectCodeApprovementFilter.NoApprovement.NO_SECONDARY_APPROVEMENT.equals(projectCodeApprovementFilter.getNoApprovement())) {
                    if(noSecondaryApprovementStatuses.contains(analysisStatus)) {
                        resultProjectCodes.add(projectCode);
                        break;
                    }                
                }
            }
        }
        return resultProjectCodes;
    }

}
